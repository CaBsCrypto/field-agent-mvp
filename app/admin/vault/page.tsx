"use client";

import { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Network, Share2, BookOpen, Search, Layers, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";

interface GraphNode {
  id: string;
  title: string;
  category: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  links: string[];
  backlinks: string[];
  summary: string;
}

const INITIAL_NODES: GraphNode[] = [
  {
    id: "05-normativa-sec-glp-cilindros",
    title: "Normativa SEC Chile GLP (DS 108 / DS 66)",
    category: "SEC Chile / Normativa",
    x: 200,
    y: 150,
    vx: 0,
    vy: 0,
    links: ["06-protocolo-estanques-glp-abastible", "04-protocolo-escalacion"],
    backlinks: ["06-protocolo-estanques-glp-abastible"],
    summary: "Reglamento de seguridad para cilindros de GLP 15kg/45kg, distancias de seguridad y formulario TC11...",
  },
  {
    id: "06-protocolo-estanques-glp-abastible",
    title: "Estanques a Granel Abastible",
    category: "Abastible Granel",
    x: 450,
    y: 120,
    vx: 0,
    vy: 0,
    links: ["05-normativa-sec-glp-cilindros", "01-codigos-error-hvac"],
    backlinks: ["05-normativa-sec-glp-cilindros"],
    summary: "Llenado máximo del 85%, inspección quinquenal NCh2427 y matriz de fallas E-VRP-01...",
  },
  {
    id: "01-codigos-error-hvac",
    title: "Códigos de Error HVAC & Climatización",
    category: "Códigos de Falla",
    x: 650,
    y: 260,
    vx: 0,
    vy: 0,
    links: ["02-protocolo-mantenimiento-preventivo"],
    backlinks: ["06-protocolo-estanques-glp-abastible"],
    summary: "Códigos E-01 a E-20, causas probables, soluciones paso a paso y criterios de escalación...",
  },
  {
    id: "02-protocolo-mantenimiento-preventivo",
    title: "Mantenimiento Preventivo Mensual",
    category: "Procedimientos",
    x: 350,
    y: 320,
    vx: 0,
    vy: 0,
    links: ["04-protocolo-escalacion"],
    backlinks: ["01-codigos-error-hvac"],
    summary: "Checklist de inspección de 15 puntos, calibración de termostatos y estanqueidad...",
  },
  {
    id: "04-protocolo-escalacion",
    title: "Escalación Inmediata a Supervisor",
    category: "Procedimientos",
    x: 150,
    y: 300,
    vx: 0,
    vy: 0,
    links: [],
    backlinks: ["05-normativa-sec-glp-cilindros", "02-protocolo-mantenimiento-preventivo"],
    summary: "Protocolo de emergencias Clase 1, fugas no contenidas y alertas por WhatsApp al supervisor...",
  },
];

export default function AdminVaultPage() {
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState<GraphNode>(INITIAL_NODES[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Simple 2D Canvas Force-Directed physics simulation for Obsidian Graph View
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid dots like Obsidian
      ctx.fillStyle = "#0A2540";
      for (let x = 0; x < canvas.width; x += 30) {
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // Draw Connection Lines (Edges)
      nodes.forEach((sourceNode) => {
        sourceNode.links.forEach((targetId) => {
          const targetNode = nodes.find((n) => n.id === targetId);
          if (targetNode) {
            ctx.beginPath();
            ctx.moveTo(sourceNode.x, sourceNode.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.strokeStyle = sourceNode.id === selectedNode.id || targetNode.id === selectedNode.id ? "#FF6600" : "rgba(0, 240, 255, 0.25)";
            ctx.lineWidth = sourceNode.id === selectedNode.id || targetNode.id === selectedNode.id ? 2.5 : 1;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });

      // Draw Nodes (Floating Circles & Labels)
      nodes.forEach((node) => {
        const isSelected = node.id === selectedNode.id;
        const radius = isSelected ? 12 : 8;

        // Node Glow Effect
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 102, 0, 0.25)";
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? "#FF6600" : node.category.includes("SEC") ? "#00F0FF" : "#38BDF8";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Label Text
        ctx.font = isSelected ? "bold 12px Segoe UI, sans-serif" : "11px Segoe UI, sans-serif";
        ctx.fillStyle = isSelected ? "#FFFFFF" : "#94A3B8";
        ctx.fillText(node.title, node.x + radius + 8, node.y + 4);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [nodes, selectedNode]);

  // Dragging interaction
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const clickedNode = nodes.find((n) => {
      const dist = Math.hypot(n.x - clickX, n.y - clickY);
      return dist <= 16;
    });

    if (clickedNode) {
      setSelectedNode(clickedNode);
      setDraggingId(clickedNode.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggingId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const moveY = e.clientY - rect.top;

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingId ? { ...n, x: moveX, y: moveY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const filteredNodes = nodes.filter(
    (n) => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

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

          {/* Right Panel: Interactive Canvas Graph View */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Real Interactive Canvas Graph View */}
            <div style={{ background: "#001E3C", borderRadius: "14px", padding: "16px", color: "#FFFFFF", position: "relative", border: "1px solid #003366", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#00F0FF", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Network size={16} /> OBSIDIAN INTERACTIVE CANVAS GRAPH (GBRAIN ENGINE)
                </span>
                <span style={{ fontSize: "11px", background: "rgba(0, 240, 255, 0.15)", color: "#00F0FF", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
                  💡 Arrastra los nodos con el mouse
                </span>
              </div>

              {/* 2D Canvas Element */}
              <canvas
                ref={canvasRef}
                width={780}
                height={360}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ width: "100%", height: "360px", background: "#001830", borderRadius: "10px", cursor: draggingId ? "grabbing" : "grab" }}
              />

              <div style={{ fontSize: "11px", color: "#94A3B8", textAlign: "center", marginTop: "10px" }}>
                Haz clic en cualquier nodo para seleccionarlo o arrástralo para explorar sus conexiones bidireccionales (`[[wikilinks]]`).
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
