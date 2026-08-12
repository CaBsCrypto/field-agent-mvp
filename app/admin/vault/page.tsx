"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Network, Share2, BookOpen, Search, Layers, Sparkles, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import ReactForceGraph2D to prevent SSR window issues
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "420px", display: "flex", alignItems: "center", justifyContent: "center", color: "#00F0FF", background: "#001830", borderRadius: "10px" }}>
      <RefreshCw size={24} className="animate-spin" /> Cargando Grafo de Fuerza Obsidian D3 Engine...
    </div>
  ),
});

interface GraphDataNode {
  id: string;
  name: string;
  category: string;
  val: number;
  color?: string;
  summary: string;
  links: string[];
  backlinks: string[];
}

interface GraphDataLink {
  source: string;
  target: string;
}

const RAW_NODES: GraphDataNode[] = [
  {
    id: "05-normativa-sec-glp-cilindros",
    name: "Normativa SEC Chile GLP (DS 108 / DS 66)",
    category: "SEC Chile / Normativa",
    val: 16,
    color: "#FF6600",
    links: ["06-protocolo-estanques-glp-abastible", "04-protocolo-escalacion"],
    backlinks: ["06-protocolo-estanques-glp-abastible"],
    summary: "Reglamento de seguridad para cilindros de GLP 15kg/45kg, distancias de seguridad y formulario TC11...",
  },
  {
    id: "06-protocolo-estanques-glp-abastible",
    name: "Estanques a Granel Abastible",
    category: "Abastible Granel",
    val: 14,
    color: "#00F0FF",
    links: ["05-normativa-sec-glp-cilindros", "01-codigos-error-hvac"],
    backlinks: ["05-normativa-sec-glp-cilindros"],
    summary: "Llenado máximo del 85%, inspección quinquenal NCh2427 y matriz de fallas E-VRP-01...",
  },
  {
    id: "01-codigos-error-hvac",
    name: "Códigos de Error HVAC & Climatización",
    category: "Códigos de Falla",
    val: 12,
    color: "#38BDF8",
    links: ["02-protocolo-mantenimiento-preventivo"],
    backlinks: ["06-protocolo-estanques-glp-abastible"],
    summary: "Códigos E-01 a E-20, causas probables, soluciones paso a paso y criterios de escalación...",
  },
  {
    id: "02-protocolo-mantenimiento-preventivo",
    name: "Mantenimiento Preventivo Mensual",
    category: "Procedimientos",
    val: 10,
    color: "#A7F3D0",
    links: ["04-protocolo-escalacion"],
    backlinks: ["01-codigos-error-hvac"],
    summary: "Checklist de inspección de 15 puntos, calibración de termostatos y estanqueidad...",
  },
  {
    id: "04-protocolo-escalacion",
    name: "Escalación Inmediata a Supervisor",
    category: "Procedimientos",
    val: 10,
    color: "#FCA5A5",
    links: [],
    backlinks: ["05-normativa-sec-glp-cilindros", "02-protocolo-mantenimiento-preventivo"],
    summary: "Protocolo de emergencias Clase 1, fugas no contenidas y alertas por WhatsApp al supervisor...",
  },
];

const RAW_LINKS: GraphDataLink[] = [
  { source: "05-normativa-sec-glp-cilindros", target: "06-protocolo-estanques-glp-abastible" },
  { source: "05-normativa-sec-glp-cilindros", target: "04-protocolo-escalacion" },
  { source: "06-protocolo-estanques-glp-abastible", target: "01-codigos-error-hvac" },
  { source: "01-codigos-error-hvac", target: "02-protocolo-mantenimiento-preventivo" },
  { source: "02-protocolo-mantenimiento-preventivo", target: "04-protocolo-escalacion" },
];

export default function AdminVaultPage() {
  const [selectedNode, setSelectedNode] = useState<GraphDataNode>(RAW_NODES[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const graphData = {
    nodes: RAW_NODES,
    links: RAW_LINKS,
  };

  const filteredNodes = RAW_NODES.filter(
    (n) => n.name.toLowerCase().includes(searchQuery.toLowerCase()) || n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
          
          {/* Left Panel: Search & Node List */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            
            <div style={{ marginBottom: "16px" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Buscar notas en la bóveda..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: "8px", border: "1px solid #CBD5E1", background: "#F8FAFC", fontSize: "13px", outline: "none" }}
                />
                <Search size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "12px" }} />
              </div>
            </div>

            <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#003366", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <BookOpen size={15} color="#FF6600" /> Nodos de la Bóveda ({filteredNodes.length})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderRadius: "10px",
                      border: isSelected ? "2px solid #FF6600" : "1px solid #E2E8F0",
                      background: isSelected ? "#FFF7ED" : "#F8FAFC",
                      color: "#0F172A",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontWeight: "700", fontSize: "13px", color: isSelected ? "#003366" : "#1E293B" }}>{node.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ background: "#E2E8F0", padding: "2px 6px", borderRadius: "4px" }}>{node.category}</span>
                      <span style={{ color: "#FF6600", fontWeight: "700" }}>{node.links.length + node.backlinks.length} enlaces</span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Panel: Force-Directed Obsidian D3 Graph View */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Real Obsidian D3 Force Graph Container */}
            <div style={{ background: "#0B192C", borderRadius: "14px", padding: "16px", color: "#FFFFFF", position: "relative", border: "1px solid #003366", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#00F0FF", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Network size={16} /> OBSIDIAN NATIVE FORCE GRAPH (D3 ENGINE)
                </span>
                <span style={{ fontSize: "11px", background: "rgba(0, 240, 255, 0.15)", color: "#00F0FF", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  ⚡ Motor de Partículas en Vivo
                </span>
              </div>

              {/* ForceGraph2D Canvas */}
              <div style={{ borderRadius: "10px", overflow: "hidden", background: "#050C1A", height: "420px" }}>
                <ForceGraph2D
                  graphData={graphData}
                  nodeAutoColorBy="category"
                  nodeRelSize={6}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleSpeed={0.006}
                  linkDirectionalParticleWidth={2}
                  linkColor={() => "rgba(0, 240, 255, 0.4)"}
                  onNodeClick={(node: any) => setSelectedNode(node)}
                  nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;
                    ctx.font = `${fontSize}px Segoe UI, sans-serif`;
                    const isSelected = node.id === selectedNode.id;

                    // Node Circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, isSelected ? 8 : 5, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isSelected ? "#FF6600" : node.color || "#00F0FF";
                    ctx.fill();

                    // Glow Effect on Selection
                    if (isSelected) {
                      ctx.lineWidth = 3;
                      ctx.strokeStyle = "#FFFFFF";
                      ctx.stroke();
                    }

                    // Text Label
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = isSelected ? "#FFFFFF" : "rgba(255, 255, 255, 0.8)";
                    ctx.fillText(label, node.x, node.y + 12);
                  }}
                  width={800}
                  height={420}
                />
              </div>

              <div style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center", marginTop: "10px" }}>
                Haz clic en cualquier nodo para inspeccionar sus conexiones relacionales bidireccionales (`[[wikilinks]]`).
              </div>
            </div>

            {/* Selected Node Details */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "11px", background: "#FEF3C7", color: "#92400E", padding: "4px 8px", borderRadius: "6px", fontWeight: "700" }}>
                    {selectedNode.category}
                  </span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#003366", margin: "8px 0 0 0" }}>
                    {selectedNode.name}
                  </h2>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", fontFamily: "monospace" }}>
                    Archivo: {selectedNode.id}.md
                  </div>
                </div>
              </div>

              <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: "1.6", background: "#F8FAFC", padding: "14px", borderRadius: "8px", border: "1px solid #E2E8F0", marginBottom: "20px" }}>
                {selectedNode.summary}
              </p>

              {/* Connections Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ background: "#F1F5F9", padding: "14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#003366", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Share2 size={14} color="#FF6600" /> Enlaces de Salida (Wikilinks [[...]])
                  </h4>
                  {selectedNode.links && selectedNode.links.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {selectedNode.links.map((linkId) => (
                        <span key={linkId} style={{ fontSize: "11.5px", color: "#1E40AF", fontFamily: "monospace", fontWeight: "600" }}>
                          ➔ [[{linkId}]]
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#94A3B8" }}>Sin enlaces salientes</span>
                  )}
                </div>

                <div style={{ background: "#F1F5F9", padding: "14px", borderRadius: "10px", border: "1px solid #CBD5E1" }}>
                  <h4 style={{ fontSize: "12px", fontWeight: "700", color: "#003366", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Layers size={14} color="#059669" /> Enlaces Entrantes (Backlinks)
                  </h4>
                  {selectedNode.backlinks && selectedNode.backlinks.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {selectedNode.backlinks.map((linkId) => (
                        <span key={linkId} style={{ fontSize: "11.5px", color: "#065F46", fontFamily: "monospace", fontWeight: "600" }}>
                          ⬅ [[{linkId}]]
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#94A3B8" }}>Sin referencias entrantes</span>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
