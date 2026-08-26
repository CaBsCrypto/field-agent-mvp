"use client";

import { AdminHeader } from "@/components/AdminHeader";
import { useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Search, Filter } from "lucide-react";

interface IncidentItem {
  id: string;
  technicianName: string;
  techPhone: string;
  location: string;
  faultCode: string;
  description: string;
  status: "resolved" | "escalated" | "open";
  timestamp: string;
}

const MOCK_INCIDENTS: IncidentItem[] = [
  {
    id: "INC-C3-001",
    technicianName: "Roberto Araya (Especialista SIRAGA)",
    techPhone: "+56955554321",
    location: "Planta de Llenado GLP — Romana 4 (Carrusel C3)",
    faultCode: "01024 / Presostato 27",
    description: "Fuga C3 detectada por falta de conmutación 1->0 en sensor de hermeticidad Presostato 27.",
    status: "escalated",
    timestamp: "Hace 10 mins",
  },
  {
    id: "INC-C3-002",
    technicianName: "Roberto Araya (Especialista SIRAGA)",
    techPhone: "+56955554321",
    location: "Planta de Llenado GLP — Romana 2 (Cabezal SIRAGA)",
    faultCode: "VAL1 / Actuador 1C",
    description: "Prueba de estanqueidad completada exitosamente en cabezal Siraga tras cambio de tubing.",
    status: "resolved",
    timestamp: "Hace 1 hora",
  },
  {
    id: "INC-C3-003",
    technicianName: "Roberto Araya (Especialista SIRAGA)",
    techPhone: "+56955554321",
    location: "Planta de Llenado GLP — Salida Carrusel C3",
    faultCode: "VAL3 / Sensor Magnético",
    description: "Verificación de eyección neumática a 50cm de la salida del carrusel realizada conforme a protocolo.",
    status: "resolved",
    timestamp: "Ayer 15:30",
  },
];

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentItem[]>(MOCK_INCIDENTS);
  const [filter, setFilter] = useState<"all" | "escalated" | "resolved">("all");

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === "all") return true;
    return inc.status === filter;
  });

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Incidents Table Panel */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={18} color="#FF6600" /> Monitoreo de Incidencias — Básculas SIRAGA & Fuga C3
              </h2>
              <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>
                Monitoreo en tiempo real de los reportes en Planta de Llenado GLP estandarizados por Roberto Araya vía WhatsApp.
              </p>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "6px", background: "#F1F5F9", padding: "4px", borderRadius: "8px" }}>
              <button
                type="button"
                onClick={() => setFilter("all")}
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: filter === "all" ? "#003366" : "transparent",
                  color: filter === "all" ? "#FFF" : "#64748B"
                }}
              >
                Todos ({incidents.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("escalated")}
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: filter === "escalated" ? "#DC2626" : "transparent",
                  color: filter === "escalated" ? "#FFF" : "#64748B"
                }}
              >
                Escalados ({incidents.filter(i => i.status === "escalated").length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("resolved")}
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "600",
                  cursor: "pointer",
                  background: filter === "resolved" ? "#059669" : "transparent",
                  color: filter === "resolved" ? "#FFF" : "#64748B"
                }}
              >
                Resueltos ({incidents.filter(i => i.status === "resolved").length})
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredIncidents.map((inc) => {
              const isEscalated = inc.status === "escalated";
              return (
                <div
                  key={inc.id}
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    border: isEscalated ? "2px solid #FECACA" : "1px solid #E2E8F0",
                    background: isEscalated ? "#FEF2F2" : "#F8FAFC",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#003366", fontFamily: "monospace" }}>{inc.id}</span>
                      <span style={{ fontSize: "11px", background: "#E2E8F0", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>Código: {inc.faultCode}</span>
                      <span style={{ fontSize: "11px", color: "#64748B" }}>📍 {inc.location}</span>
                    </div>
                    <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0F172A" }}>{inc.description}</div>
                    <div style={{ fontSize: "11.5px", color: "#64748B", marginTop: "4px" }}>
                      Técnico: <strong>{inc.technicianName}</strong> ({inc.techPhone})
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontWeight: "700",
                        background: isEscalated ? "#DC2626" : "#D1FAE5",
                        color: isEscalated ? "#FFF" : "#065F46",
                        display: "inline-block",
                        marginBottom: "6px"
                      }}
                    >
                      {isEscalated ? "🚨 ALERTA ESCALADA" : "✓ RESUELTO EN TERRENO"}
                    </span>
                    <div style={{ fontSize: "11px", color: "#94A3B8" }}>{inc.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
