import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

const EMBEDDING_MODEL = "text-embedding-004";

interface CachedEmbedding {
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

    const existing = cache.find(c => c.fileName === file);

    if (existing && existing.fileHash === fileHash) {
      updatedCache.push(existing);
    } else {
      try {
        const embedding = await computeEmbedding(content, apiKeyOverride);
        updatedCache.push({
          fileName: file,
          filePath,
          fileHash,
          embedding,
          content,
        });
        cacheModified = true;
      } catch (err) {
        console.error(`[RAG-Vector] Failed to embed file ${file}:`, err);
        if (existing) updatedCache.push(existing);
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
