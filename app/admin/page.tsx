"use client";

import { AdminHeader } from "@/components/AdminHeader";
import { Users, FileText, AlertTriangle, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Metric Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
          
          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>TÉCNICOS AUTORIZADOS</span>
              <Users size={16} color="#003366" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#003366" }}>10</div>
            <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>✓ Whitelist Activa (Sucursal Piloto)</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>MANUALES RAG ACTIVOS</span>
              <FileText size={16} color="#FF6600" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#FF6600" }}>6</div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>Normativa SEC Chile & Abastible</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>CONSULTAS ATENDIDAS HOY</span>
              <Activity size={16} color="#0284C7" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0284C7" }}>42</div>
            <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>⚡ Menos de 3 seg tiempo respuesta</div>
          </div>

          <div style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>ALERTAS DE ESCALACIÓN</span>
              <AlertTriangle size={16} color="#DC2626" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#DC2626" }}>1</div>
            <div style={{ fontSize: "11px", color: "#DC2626", marginTop: "4px", fontWeight: "600" }}>Notificada a Supervisor (+56900000001)</div>
          </div>

        </div>

        {/* Shortcut Quick Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", marginBottom: "8px" }}>
              📖 Centro de Entrenamiento de Manuales
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px", lineHeight: "1.5" }}>
              Administra la documentación técnica, sube archivos PDF/Word o genera nuevos anexos normativos de la SEC con Inteligencia Artificial.
            </p>
            <Link
              href="/admin/training"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#003366", color: "#FFF", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}
            >
              Ir a Manuales & Entrenamiento <ArrowUpRight size={16} />
            </Link>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", marginBottom: "8px" }}>
              🧠 Bóveda Relacional (Obsidian Graph View)
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px", lineHeight: "1.5" }}>
              Visualiza el mapa de nodos y conexiones de la base de conocimientos con el motor GBrain V2 y enlaces `[[wikilinks]]`.
            </p>
            <Link
              href="/admin/vault"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FF6600", color: "#FFF", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}
            >
              Ver Grafo de Conocimiento <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
