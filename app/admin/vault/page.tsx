"use client";

import { useState, useEffect } from "react";
import { Network, Share2, BookOpen, Search, ArrowRight, Layers, FileText, CheckCircle2, RefreshCw, Cpu } from "lucide-react";

interface VaultNode {
  id: string;
  title: string;
  fileName: string;
  category: string;
  links: string[];
  backlinks: string[];
  summary: string;
}

export default function AdminVaultPage() {
  const [nodes, setNodes] = useState<VaultNode[]>([
    {
      id: "05-normativa-sec-glp-cilindros",
      title: "Protocolo Técnico SEC Chile: Cilindros GLP (DS 108 / DS 66)",
      fileName: "05-normativa-sec-glp-cilindros.md",
      category: "SEC Chile / Normativa",
      links: ["06-protocolo-estanques-glp-abastible", "04-protocolo-escalacion"],
      backlinks: ["06-protocolo-estanques-glp-abastible"],
      summary: "Reglamento de seguridad para cilindros de GLP 15kg/45kg, distancias de seguridad y formulario TC11...",
    },
    {
      id: "06-protocolo-estanques-glp-abastible",
      title: "Protocolo Mantenimiento Estanques a Granel Abastible",
      fileName: "06-protocolo-estanques-glp-abastible.md",
      category: "Abastible Granel",
      links: ["05-normativa-sec-glp-cilindros", "01-codigos-error-hvac"],
      backlinks: ["05-normativa-sec-glp-cilindros"],
      summary: "Llenado máximo del 85%, inspección quinquenal NCh2427 y matriz de fallas E-VRP-01...",
    },
    {
      id: "01-codigos-error-hvac",
      title: "Tabla Maestra de Códigos de Error HVAC & Climatización",
      fileName: "01-codigos-error-hvac.md",
      category: "Códigos de Falla",
      links: ["02-protocolo-mantenimiento-preventivo"],
      backlinks: ["06-protocolo-estanques-glp-abastible"],
      summary: "Códigos E-01 a E-20, causas probables, soluciones paso a paso y criterios de escalación...",
    },
    {
      id: "02-protocolo-mantenimiento-preventivo",
      title: "Protocolo de Mantenimiento Preventivo Mensual / Anual",
      fileName: "02-protocolo-mantenimiento-preventivo.md",
      category: "Procedimientos Generales",
      links: ["04-protocolo-escalacion"],
      backlinks: ["01-codigos-error-hvac"],
      summary: "Checklist de inspección de 15 puntos, calibración de termostatos y estanqueidad...",
    },
    {
      id: "04-protocolo-escalacion",
      title: "Protocolo de Escalación Inmediata a Supervisor Abastible",
      fileName: "04-protocolo-escalacion.md",
      category: "Procedimientos Generales",
      links: [],
      backlinks: ["05-normativa-sec-glp-cilindros", "02-protocolo-mantenimiento-preventivo"],
      summary: "Protocolo de emergencias Clase 1, fugas no contenidas y alertas por WhatsApp al supervisor...",
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<VaultNode>(nodes[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNodes = nodes.filter(
    (n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Header Admin Bóveda */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", background: "#003366", padding: "20px 28px", borderRadius: "14px", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0, 51, 102, 0.12)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#FFF", background: "#FF6600", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                GBRAIN / OBSIDIAN KNOWLEDGE GRAPH
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", margin: "6px 0 0 0" }}>
              Bóveda Relacional de Conocimiento (Grafo de Notas)
            </h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href="/admin/training"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.15)", color: "#FFF", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
            >
              Volver a Administración <ArrowRight size={14} />
            </a>
          </div>
        </header>

        {/* Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>
          
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
                    <div style={{ fontWeight: "700", fontSize: "13px", color: isSelected ? "#003366" : "#1E293B" }}>{node.title}</div>
                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ background: "#E2E8F0", padding: "2px 6px", borderRadius: "4px" }}>{node.category}</span>
                      <span style={{ color: "#FF6600", fontWeight: "700" }}>{node.links.length + node.backlinks.length} enlaces</span>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Panel: Interactive Graph & Detail View */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Visual Graph View Map (Canvas representation) */}
            <div style={{ background: "#001E3C", borderRadius: "14px", padding: "24px", color: "#FFFFFF", position: "relative", minHeight: "260px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #003366", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#00F0FF", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Network size={16} /> OBSIDIAN GRAPH VIEW (GBRAIN V2 ENGINE)
                </span>
                <span style={{ fontSize: "11px", background: "rgba(0, 240, 255, 0.15)", color: "#00F0FF", padding: "4px 10px", borderRadius: "12px" }}>
                  5 NODOS Y 7 ENLACES RELACIONALES
                </span>
              </div>

              {/* Node Visual Graph Simulation */}
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", margin: "30px 0" }}>
                {nodes.map((n) => {
                  const isActive = selectedNode.id === n.id;
                  return (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNode(n)}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "20px",
                        background: isActive ? "#FF6600" : "rgba(255,255,255,0.08)",
                        border: isActive ? "2px solid #FFF" : "1px solid rgba(255,255,255,0.2)",
                        color: "#FFF",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: isActive ? "0 0 15px rgba(255, 102, 0, 0.5)" : "none",
                        transition: "all 0.2s"
                      }}
                    >
                      ● {n.id.split("-").slice(1, 3).join(" ").toUpperCase()}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center" }}>
                Haz clic en cualquier nodo para inspeccionar sus conexiones relacionales bidireccionales ([[wikilinks]])
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
                    {selectedNode.title}
                  </h2>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px", fontFamily: "monospace" }}>
                    Archivo: {selectedNode.fileName}
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
                  {selectedNode.links.length > 0 ? (
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
                  {selectedNode.backlinks.length > 0 ? (
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
