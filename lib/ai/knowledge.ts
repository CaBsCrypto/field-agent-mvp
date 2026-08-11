/**
 * @file lib/ai/knowledge.ts
 * Reads and concatenates all Markdown files from the `knowledge_base/` directory
 * into a single string of structured context for the LLM.
 *
 * Falls back to a single `knowledge_base.md` at the project root if the
 * directory does not exist.
 */

import fs from "fs";
import path from "path";

/**
 * Dynamically reads and concatenates all Markdown (.md) files from the
 * `knowledge_base/` folder, maintaining per-file separators so the LLM
 * receives structured, labelled context.
 *
 * Falls back to reading `knowledge_base.md` at the root if the directory
 * is not found.
 *
 * @returns Concatenated knowledge base content, or an empty string if nothing
 *          is found or an error occurs.
 */
export function getLocalKnowledgeBase(): string {
  const folderPath = path.join(process.cwd(), "knowledge_base");
  const fallbackFilePath = path.join(process.cwd(), "knowledge_base.md");

  try {
    // 1. Primary: Load all markdown files from the "knowledge_base/" directory
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      const files = fs.readdirSync(folderPath);
      const markdownFiles = files
        .filter((file) => file.endsWith(".md"))
        .sort(); // Sort alphabetically (e.g. 01-codigos-error.md, 02-mantenimiento.md)

      if (markdownFiles.length > 0) {
        let concatenatedContent = "";
        for (const file of markdownFiles) {
          const filePath = path.join(folderPath, file);
          const content = fs.readFileSync(filePath, "utf-8");
          concatenatedContent += `\n\n--- INICIO MANUAL TÉCNICO: ${file} ---\n${content}\n--- FIN MANUAL TÉCNICO: ${file} ---\n`;
        }
        return concatenatedContent.trim();
      }
    }

    // 2. Fallback: Read the single "knowledge_base.md" from the root
    if (fs.existsSync(fallbackFilePath)) {
      return fs.readFileSync(fallbackFilePath, "utf-8");
    }
  } catch (err) {
    console.error("[knowledge] Error al leer la base de conocimiento local:", err);
  }

  return "";
}
