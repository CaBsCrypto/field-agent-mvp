import { fetchSharePointFiles } from "../lib/sharepoint/graphClient";
import { ingestDocumentIntoVectorRAG, getSemanticKnowledgeContext } from "../lib/ai/vectorRAG";

async function main() {
  console.log("=== Testing M3 SharePoint Sync & Vector RAG Ingestion ===");

  console.log("1. Fetching SharePoint Files...");
  const files = await fetchSharePointFiles("Abastible-Docs", "/ManualesTecnicos");
  console.log(`Fetched ${files.length} files:`);
  for (const f of files) {
    console.log(` - ${f.fileName} (${f.fileType}) bufferSize=${f.contentBuffer.length}`);
  }

  console.log("\n2. Ingesting Documents into RAG Vector DB...");
  for (const f of files) {
    const res = await ingestDocumentIntoVectorRAG(f.fileName, f.fileType, f.contentBuffer);
    console.log(` Ingested ${f.fileName} -> embeddingsCount: ${res.embeddingsCount}`);
  }

  console.log("\n3. Testing RAG Semantic Knowledge Context Retrieval...");
  const context = await getSemanticKnowledgeContext("SEC DS 108 distancias cilindros GLP");
  console.log("Retrieved RAG Context Snippet:\n", context.slice(0, 300));

  console.log("\n=== Test M3 Completed Successfully ===");
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
