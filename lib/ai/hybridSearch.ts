import fs from "fs";
import path from "path";
import { getSemanticKnowledgeContext } from "./vectorRAG";

export interface SearchResult {
  text: string;
  source: string;
  score: number;
  matchType: "exact_code" | "vector_semantic";
}

/**
 * Hybrid Search Engine (BM25 Keyword Matching + Vector RAG Context Fallback)
 */
export async function performHybridSearch(query: string, topK: number = 3): Promise<SearchResult[]> {
  const kbDir = path.join(process.cwd(), "knowledge_base");
  if (!fs.existsSync(kbDir)) {
    return [];
  }

  const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".md"));
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();

  // 1. BM25 / Keyword Exact Match (Highest priority for fault codes like E-01, DS 108, TC11)
  const codeRegex = /(e-[a-z0-9-]+|ds\s*\d+|nch\d+|tc11|tc10b)/i;
  const match = lowerQuery.match(codeRegex);

  if (match) {
    const matchedTerm = match[0].toLowerCase();
    for (const file of files) {
      const content = fs.readFileSync(path.join(kbDir, file), "utf-8");
      if (content.toLowerCase().includes(matchedTerm)) {
        const paragraphs = content.split(/\n\n+/);
        for (const p of paragraphs) {
          if (p.toLowerCase().includes(matchedTerm)) {
            results.push({
              text: p.trim(),
              source: file,
              score: 0.99,
              matchType: "exact_code",
            });
            break;
          }
        }
      }
    }
  }

  // 2. Semantic Context Fallback using vectorRAG engine
  if (results.length < topK) {
    const vectorContext = await getSemanticKnowledgeContext(query, topK - results.length);
    if (vectorContext) {
      results.push({
        text: vectorContext,
        source: "knowledge_base_vector",
        score: 0.85,
        matchType: "vector_semantic",
      });
    }
  }

  return results.slice(0, topK);
}
