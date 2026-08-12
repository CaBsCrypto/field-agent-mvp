"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Users, FileText, AlertTriangle, ArrowUpRight, Activity, X, CheckCircle, Phone, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

type ModalType = "techs" | "manuals" | "queries" | "alerts" | null;

export default function AdminDashboardPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Metric Cards Grid (Interactive Popups) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "28px" }}>
          
          {/* Card 1: Whitelist */}
          <div
            onClick={() => setActiveModal("techs")}
            style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.2s" }}
            className="hover:border-orange-500 hover:shadow-md"
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>TÉCNICOS AUTORIZADOS</span>
              <Users size={16} color="#003366" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#003366" }}>10</div>
            <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>✓ Whitelist Activa (Haz clic para ver)</div>
          </div>

          {/* Card 2: Manuals */}
          <div
            onClick={() => setActiveModal("manuals")}
            style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>MANUALES RAG ACTIVOS</span>
              <FileText size={16} color="#FF6600" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#FF6600" }}>6</div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>Normativa SEC & Abastible (Haz clic)</div>
          </div>

          {/* Card 3: Queries */}
          <div
            onClick={() => setActiveModal("queries")}
            style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.2s" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              <span>CONSULTAS ATENDIDAS HOY</span>
              <Activity size={16} color="#0284C7" />
            </div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: "#0284C7" }}>42</div>
            <div style={{ fontSize: "11px", color: "#059669", marginTop: "4px", fontWeight: "600" }}>⚡ Menos de 1.5s tiempo respuesta</div>
          </div>

          {/* Card 4: Alerts */}
          <div
            onClick={() => setActiveModal("alerts")}
            style={{ background: "#FFFFFF", padding: "20px", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.2s" }}
          >
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
              Ir a Manuales & Base de Datos <ArrowUpRight size={16} />
            </Link>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", marginBottom: "8px" }}>
              🛡️ Lista Blanca & Control de Accesos
            </h3>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px", lineHeight: "1.5" }}>
              Gestión de números de celular de técnicos autorizados, alta de personal y revocación de permisos al bot de WhatsApp.
            </p>
            <Link
              href="/admin/whitelist"
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#FF6600", color: "#FFF", padding: "10px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}
            >
              Ir a Control de Accesos (Whitelist) <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>

        {/* ── MODALS (POPUPS) ────────────────────────────────────────── */}

        {/* Modal 1: Técnicos Whitelist */}
        {activeModal === "techs" && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
            <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", maxWidth: "600px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#003366", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <ShieldCheck color="#059669" size={20} /> Técnicos Autorizados (Whitelist Activa)
                </h3>
                <button type="button" onClick={closeModal} style={{ background: "#F1F5F9", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}>
                  <X size={18} color="#64748B" />
                </button>
              </div>

              <div style={{ fontSize: "13px", color: "#334155", marginBottom: "16px" }}>
                Lista de personal verificado con permiso de consulta vía WhatsApp y Web en la sucursal piloto Abastible:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
                <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#003366" }}>Administrador Real (MGC)</strong>
                    <div style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>+56961857682</div>
                  </div>
                  <span style={{ background: "#D1FAE5", color: "#065F46", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>✓ Habilitado</span>
                </div>

                <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#003366" }}>Juan Pérez (Técnico GLP)</strong>
                    <div style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>+56912345678</div>
                  </div>
                  <span style={{ background: "#D1FAE5", color: "#065F46", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>✓ Habilitado</span>
                </div>

                <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#003366" }}>Carlos Muñoz (Climatización)</strong>
                    <div style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>+56987654321</div>
                  </div>
                  <span style={{ background: "#D1FAE5", color: "#065F46", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>✓ Habilitado</span>
                </div>

                <div style={{ background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: "13px", color: "#003366" }}>Pedro Soto (Supervisor Operaciones)</strong>
                    <div style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>+56900000001</div>
                  </div>
                  <span style={{ background: "#FEF3C7", color: "#92400E", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "700" }}>Supervisor</span>
                </div>
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <Link href="/admin/whitelist" style={{ background: "#FF6600", color: "#FFF", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                  Gestionar Whitelist Completa →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Manuales */}
        {activeModal === "manuals" && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
            <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", maxWidth: "600px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#003366", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <FileText color="#FF6600" size={20} /> Manuales RAG Indexados
                </h3>
                <button type="button" onClick={closeModal} style={{ background: "#F1F5F9", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}>
                  <X size={18} color="#64748B" />
                </button>
              </div>

              <div style={{ fontSize: "13px", color: "#334155", marginBottom: "14px" }}>
                Documentos cargados en la base de conocimiento vectorial que alimentan las respuestas del bot:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
                  📄 <strong>05-normativa-sec-glp-cilindros.md</strong> (SEC Chile DS 108 / Formulario TC11)
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
                  📄 <strong>06-protocolo-estanques-glp-abastible.md</strong> (Límite 85% Granel / Válvula E-VRP-01)
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
                  📄 <strong>01-codigos-error-hvac.md</strong> (Tabla Maestra de Errores E-01 a E-20)
                </div>
                <div style={{ background: "#F8FAFC", padding: "10px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "12.5px" }}>
                  📄 <strong>02-protocolo-mantenimiento-preventivo.md</strong> (Checklist de Inspección 15 puntos)
                </div>
              </div>

              <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                <Link href="/admin/training" style={{ background: "#003366", color: "#FFF", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                  Subir o Generar Nuevo Manual →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modal 3: Consultas Hoy */}
        {activeModal === "queries" && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
            <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", maxWidth: "600px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#003366", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <Activity color="#0284C7" size={20} /> Métricas de Desempeño (Hoy)
                </h3>
                <button type="button" onClick={closeModal} style={{ background: "#F1F5F9", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}>
                  <X size={18} color="#64748B" />
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div style={{ background: "#EFF6FF", padding: "14px", borderRadius: "10px", border: "1px solid #BFDBFE" }}>
                  <div style={{ fontSize: "11px", color: "#1E40AF", fontWeight: "700" }}>TOTAL CONSULTAS ATENDIDAS</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#1E3A8A", marginTop: "4px" }}>42</div>
                </div>
                <div style={{ background: "#ECFDF5", padding: "14px", borderRadius: "10px", border: "1px solid #A7F3D0" }}>
                  <div style={{ fontSize: "11px", color: "#065F46", fontWeight: "700" }}>TIEMPO PROMEDIO RESPUESTA</div>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "#064E3B", marginTop: "4px" }}>1.1 seg</div>
                </div>
              </div>

              <div style={{ fontSize: "12px", color: "#64748B", background: "#F8FAFC", padding: "12px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                ⚡ El motor Gemini 2.5 Flash ha procesado el 100% de las dudas sin requerir intervención humana directa.
              </div>
            </div>
          </div>
        )}

        {/* Modal 4: Alertas */}
        {activeModal === "alerts" && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "20px" }}>
            <div style={{ background: "#FFFFFF", borderRadius: "16px", padding: "24px", maxWidth: "600px", width: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #E2E8F0", paddingBottom: "12px" }}>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#DC2626", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                  <AlertTriangle color="#DC2626" size={20} /> Alerta de Escalación Clase 1 (Fuga Masiva)
                </h3>
                <button type="button" onClick={closeModal} style={{ background: "#F1F5F9", border: "none", borderRadius: "8px", padding: "6px", cursor: "pointer" }}>
                  <X size={18} color="#64748B" />
                </button>
              </div>

              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "14px", color: "#991B1B", fontSize: "13px", lineHeight: "1.5", marginBottom: "16px" }}>
                <strong>⚠️ Reporte de Emergencia Recibido:</strong><br />
                Técnico Pedro Soto reportó fuga masiva de GLP en Estanque Granel #402. Se activó protocolo de evacuación y se notificó inmediatamente al supervisor de guardia (+56900000001) por WhatsApp.
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="/admin/incidents" style={{ background: "#DC2626", color: "#FFF", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                  Ver Monitoreo de Incidencias →
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
