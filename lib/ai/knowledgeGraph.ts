import fs from "fs";
import path from "path";

export interface VaultNode {
  id: string;
  title: string;
  fileName: string;
  category: string;
  links: string[];
  backlinks: string[];
  summary: string;
}

export interface KnowledgeGraph {
  nodes: VaultNode[];
  totalConnections: number;
}

/**
 * Extracts Obsidian wikilinks `[[Link Target]]` or `[[Link Target|Custom Label]]` from Markdown text.
 */
export function extractObsidianLinks(content: string): string[] {
  const regex = /\[\[([^\]\|]+)(?:\|[^\]]+)?\]\]/g;
  const links: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match[1]) {
      links.push(match[1].trim());
    }
  }
  return Array.from(new Set(links));
}

/**
 * Scans `knowledge_base/` and builds an in-memory GBrain-style Knowledge Graph.
 */
export function buildKnowledgeGraph(): KnowledgeGraph {
  const kbDir = path.join(process.cwd(), "knowledge_base");
  if (!fs.existsSync(kbDir)) {
    return { nodes: [], totalConnections: 0 };
  }

  const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".md"));
  const nodesMap = new Map<string, VaultNode>();

  // Pass 1: Parse nodes and outbound links
  for (const file of files) {
    const filePath = path.join(kbDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const links = extractObsidianLinks(content);
    
    // Extract first title header or use filename
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : file.replace(".md", "");

    // Category detection
    let category = "Procedimientos Generales";
    if (file.includes("sec")) category = "SEC Chile / Normativa";
    else if (file.includes("estanques") || file.includes("abastible")) category = "Abastible Granel";
    else if (file.includes("hvac") || file.includes("error")) category = "Códigos de Falla";

    const baseId = file.replace(".md", "");

    nodesMap.set(baseId, {
      id: baseId,
      title,
      fileName: file,
      category,
      links,
      backlinks: [],
      summary: content.substring(0, 180).replace(/[#*`]/g, "").trim() + "...",
    });
  }

  // Pass 2: Calculate bidirectional backlinks
  let totalConnections = 0;
  nodesMap.forEach((node) => {
    node.links.forEach((targetId) => {
      totalConnections++;
      const targetNode = nodesMap.get(targetId);
      if (targetNode && !targetNode.backlinks.includes(node.id)) {
        targetNode.backlinks.push(node.id);
      }
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    totalConnections,
  };
}
