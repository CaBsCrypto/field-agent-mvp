import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "text-embedding-004";

export interface CachedEmbedding {
  fileName: string;
  filePath: string;
  fileHash: string;
  embedding: number[];
  content: string;
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function computeEmbedding(text: string, apiKeyOverride?: string): Promise<number[]> {
  const apiKey = apiKeyOverride ?? process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    // Return dummy vector if key not configured for mockup/offline testing
    return new Array(768).fill(0.1);
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: EMBEDDING_MODEL }, { apiVersion: "v1" });

  const result = await model.embedContent(text);
  if (!result.embedding?.values) {
    throw new Error("Failed to generate embedding from Gemini API");
  }
  return result.embedding.values;
}

/**
 * Clean dynamic require for pdf-parse package.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadPdfParse(): any {
  try {
    // eslint-disable-next-line no-eval
    const req = eval("require");
    const pdfParse = req("pdf-parse");
    return typeof pdfParse === "function" ? pdfParse : (pdfParse.default || pdfParse);
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadMammoth(): any {
  try {
    // eslint-disable-next-line no-eval
    const req = eval("require");
    const mammoth = req("mammoth");
    return mammoth.extractRawText ? mammoth : (mammoth.default || mammoth);
  } catch {
    return null;
  }
}

/**
 * Checks whether a buffer or string contains binary magic headers (%PDF, PK\x03\x04)
 * or non-printable binary control characters.
 */
function isBinaryContent(content: Buffer | string): boolean {
  if (Buffer.isBuffer(content)) {
    if (content.length >= 4) {
      // %PDF magic header
      if (content[0] === 0x25 && content[1] === 0x50 && content[2] === 0x44 && content[3] === 0x46) {
        return true;
      }
      // PK\x03\x04 magic header (ZIP/DOCX)
      if (content[0] === 0x50 && content[1] === 0x4b && content[2] === 0x03 && content[3] === 0x04) {
        return true;
      }
    }
    const sample = content.toString("utf-8", 0, Math.min(content.length, 4096));
    return checkStringBinary(sample);
  }
  return checkStringBinary(content);
}

function checkStringBinary(str: string): boolean {
  const trimmed = str.trimStart();
  if (trimmed.startsWith("%PDF") || trimmed.startsWith("PK\x03\x04")) {
    return true;
  }
  let nonPrintableCount = 0;
  const sampleLen = Math.min(str.length, 1000);
  for (let i = 0; i < sampleLen; i++) {
    const code = str.charCodeAt(i);
    if (code === 0) return true; // Null byte indicates binary
    if ((code < 32 && code !== 9 && code !== 10 && code !== 13) || (code >= 127 && code < 160)) {
      nonPrintableCount++;
    }
  }
  return sampleLen > 0 && nonPrintableCount / sampleLen > 0.05;
}

/**
 * Strips non-printable control characters and raw binary magic headers from text.
 */
function sanitizeText(raw: string): string {
  if (!raw) return "";
  let clean = raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
  clean = clean.replace(/%PDF-[0-9\.]+/g, "").replace(/PK\x03\x04[^\n]*/g, "");
  return clean.trim();
}

/**
 * Extracts raw text content from PDF or DOCX Buffer/string with binary fallback protection.
 */
async function extractDocumentText(
  fileType: "pdf" | "docx",
  content: Buffer | string,
  fileName?: string
): Promise<string> {
  let extractedText = "";

  if (typeof content === "string") {
    if (!isBinaryContent(content)) {
      extractedText = sanitizeText(content);
    }
  } else if (Buffer.isBuffer(content)) {
    try {
      if (fileType === "pdf") {
        const pdfParse = loadPdfParse();
        if (pdfParse && typeof pdfParse === "function") {
          const parsed = await pdfParse(content);
          if (parsed && typeof parsed.text === "string" && parsed.text.trim().length > 0) {
            extractedText = sanitizeText(parsed.text);
          }
        }
      } else if (fileType === "docx") {
        const mammoth = loadMammoth();
        if (mammoth && typeof mammoth.extractRawText === "function") {
          const parsed = await mammoth.extractRawText({ buffer: content });
          if (parsed && typeof parsed.value === "string" && parsed.value.trim().length > 0) {
            extractedText = sanitizeText(parsed.value);
          }
        }
      }
    } catch (err) {
      console.warn(`[RAG-Vector] Document parser (${fileType}) notice:`, err);
    }

    if (!extractedText || extractedText.trim().length === 0 || isBinaryContent(extractedText)) {
      // If buffer is UTF-8 text (e.g. mock documents), content.toString("utf-8") will be valid text
      if (!isBinaryContent(content)) {
        extractedText = sanitizeText(content.toString("utf-8"));
      }
    }
  }

  // Fallback protection: Never allow raw binary bytes or magic headers to be output
  if (!extractedText || extractedText.trim().length === 0 || isBinaryContent(extractedText)) {
    const docLabel = fileName ? fileName : `${fileType.toUpperCase()} document`;
    const docTitle = fileName ? fileName.replace(/\.(pdf|docx)$/i, "") : "Documento";
    extractedText = `# ${docTitle}\n\n[Documento ${fileType.toUpperCase()}: ${docLabel}. El contenido binario fue procesado pero no contiene texto plano extrable o requiere OCR.]`;
  }

  return sanitizeText(extractedText);
}

/**
 * Ingests a document (PDF / DOCX or raw text) into the RAG Vector store.
 * Extracts text, computes embeddings using computeEmbedding, saves document under knowledge_base/,
 * and updates embedding cache data/knowledge_base_embeddings.json.
 */
export async function ingestDocumentIntoVectorRAG(
  fileName: string,
  fileType: "pdf" | "docx",
  content: Buffer | string,
  apiKeyOverride?: string
): Promise<{ embeddingsCount: number }> {
  const text = await extractDocumentText(fileType, content, fileName);
  if (!text) {
    throw new Error(`Cannot ingest document '${fileName}': Extracted text is empty.`);
  }

  // 1. Save document in knowledge_base directory
  const kbDir = path.join(process.cwd(), "knowledge_base");
  if (!fs.existsSync(kbDir)) {
    fs.mkdirSync(kbDir, { recursive: true });
  }

  const baseName = fileName.replace(/\.(pdf|docx)$/i, "");
  const kbFileName = `${baseName}.md`;
  const kbFilePath = path.join(kbDir, kbFileName);

  const markdownContent = text.startsWith("#") ? text : `# ${baseName}\n\n${text}`;
  fs.writeFileSync(kbFilePath, markdownContent, "utf-8");

  // 2. Chunk text for fine-grained embedding vector search
  const rawParagraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const chunks: string[] = [];
  if (rawParagraphs.length > 0) {
    for (const para of rawParagraphs) {
      if (para.length > 600) {
        // Chunk long paragraphs into 500-char blocks
        const matches = para.match(/[\s\S]{1,500}/g) || [para];
        chunks.push(...matches);
      } else {
        chunks.push(para);
      }
    }
  } else {
    chunks.push(text);
  }

  // 3. Load & update embeddings cache
  const cachePath = path.join(process.cwd(), "data", "knowledge_base_embeddings.json");
  let cache: CachedEmbedding[] = [];
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } catch {
      cache = [];
    }
  }

  // Remove existing entries for this file to prevent duplicate embeddings
  cache = cache.filter(
    item =>
      item.fileName !== fileName &&
      item.fileName !== kbFileName &&
      !item.fileName.startsWith(`${baseName}_chunk`)
  );

  const fileStats = fs.statSync(kbFilePath);
  const fileHashBase = `${fileStats.size}_${fileStats.mtimeMs}`;
  let embeddingsCount = 0;

  for (let i = 0; i < chunks.length; i++) {
    const chunkContent = chunks[i];
    try {
      const embedding = await computeEmbedding(chunkContent, apiKeyOverride);
      const chunkFileName = chunks.length === 1 ? kbFileName : `${baseName}_chunk_${i + 1}.md`;

      cache.push({
        fileName: chunkFileName,
        filePath: kbFilePath,
        fileHash: `${fileHashBase}_${i}`,
        embedding,
        content: chunkContent,
      });

      embeddingsCount++;
    } catch (err) {
      console.error(`[RAG-Vector] Error embedding chunk ${i + 1} of ${fileName}:`, err);
    }
  }

  // Save updated cache
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");

  return { embeddingsCount };
}

export async function syncEmbeddingsCache(apiKeyOverride?: string): Promise<CachedEmbedding[]> {
  const folderPath = path.join(process.cwd(), "knowledge_base");
  const cachePath = path.join(process.cwd(), "data", "knowledge_base_embeddings.json");

  if (!fs.existsSync(folderPath)) {
    return [];
  }

  let cache: CachedEmbedding[] = [];
  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } catch {
      cache = [];
    }
  }

  const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".md"));
  const updatedCache: CachedEmbedding[] = [];
  let cacheModified = false;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const fileStats = fs.statSync(filePath);
    const fileHash = `${fileStats.size}_${fileStats.mtimeMs}`;
    const baseName = file.replace(/\.md$/i, "");

    // Check if cache has existing entries for this file (either single file or chunked)
    const matchingEntries = cache.filter(
      c =>
        c.fileName === file ||
        c.fileName.startsWith(`${baseName}_chunk_`) ||
        (c.filePath && (c.filePath.endsWith(file) || path.basename(c.filePath) === file))
    );

    const isUpToDate =
      matchingEntries.length > 0 &&
      matchingEntries.every(
        c => c.fileHash === fileHash || c.fileHash.startsWith(`${fileHash}_`)
      );

    if (isUpToDate) {
      updatedCache.push(...matchingEntries);
    } else {
      try {
        const rawParagraphs = content
          .split(/\n\s*\n/)
          .map(p => p.trim())
          .filter(p => p.length > 0);

        const chunks: string[] = [];
        if (rawParagraphs.length > 0) {
          for (const para of rawParagraphs) {
            if (para.length > 600) {
              const matches = para.match(/[\s\S]{1,500}/g) || [para];
              chunks.push(...matches);
            } else {
              chunks.push(para);
            }
          }
        } else {
          chunks.push(content);
        }

        for (let i = 0; i < chunks.length; i++) {
          const chunkContent = chunks[i];
          const embedding = await computeEmbedding(chunkContent, apiKeyOverride);
          const chunkFileName = chunks.length === 1 ? file : `${baseName}_chunk_${i + 1}.md`;
          const chunkHash = chunks.length === 1 ? fileHash : `${fileHash}_${i}`;

          updatedCache.push({
            fileName: chunkFileName,
            filePath,
            fileHash: chunkHash,
            embedding,
            content: chunkContent,
          });
        }
        cacheModified = true;
      } catch (err) {
        console.error(`[RAG-Vector] Failed to embed file ${file}:`, err);
        if (matchingEntries.length > 0) {
          updatedCache.push(...matchingEntries);
        }
      }
    }
  }

  if (cacheModified && updatedCache.length > 0) {
    try {
      const dataDir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(cachePath, JSON.stringify(updatedCache, null, 2), "utf-8");
    } catch (err) {
      console.error(`[RAG-Vector] Failed to write embeddings cache:`, err);
    }
  }

  return updatedCache;
}

export async function getSemanticKnowledgeContext(
  query: string,
  limit = 3,
  apiKeyOverride?: string
): Promise<string> {
  try {
    const cachedNotes = await syncEmbeddingsCache(apiKeyOverride);

    if (cachedNotes.length === 0) {
      return "";
    }

    const queryEmbedding = await computeEmbedding(query, apiKeyOverride);

    const matches = cachedNotes.map(note => {
      const similarity = cosineSimilarity(queryEmbedding, note.embedding);
      return { note, similarity };
    });

    matches.sort((a, b) => b.similarity - a.similarity);
    const topMatches = matches.slice(0, limit);

    let semanticContext = "";
    for (const match of topMatches) {
      semanticContext += `\n\n--- MANUAL TÉCNICO: ${match.note.fileName} ---\n${match.note.content}\n--- FIN MANUAL ---\n`;
    }

    return semanticContext.trim();
  } catch (err) {
    console.error(`[RAG-Vector] Semantic RAG error:`, err);
    return "";
  }
}

