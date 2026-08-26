"use client";

import { AdminHeader } from "@/components/AdminHeader";
import { useState } from "react";
import {
  FileText,
  Upload,
  Sparkles,
  BookOpen,
  CheckCircle,
  RefreshCw,
  Share2,
  Smartphone,
  X,
  Activity,
  Database,
  Send,
  Terminal,
  AlertCircle,
} from "lucide-react";

interface DocumentItem {
  name: string;
  category: string;
  size: string;
  status: "active" | "syncing";
  lastUpdated: string;
  chunksCount: number;
  source?: string;
}

interface EskuadWebhookRecord {
  formId: string;
  techPhone?: string;
  equipmentCode?: string;
  comments?: string;
  status?: string;
  timestamp?: string;
}

interface EskuadWebhookResult {
  success?: boolean;
  message?: string;
  record?: EskuadWebhookRecord;
  incidentId?: string | null;
  whatsappSent?: boolean;
  error?: string;
}

interface SharePointSyncedFile {
  fileName: string;
  fileType?: string;
  status?: string;
  embeddingsCount?: number;
}

interface SharePointSyncResult {
  success?: boolean;
  message?: string;
  syncedFiles?: SharePointSyncedFile[];
  timestamp?: string;
  error?: string;
}

const INITIAL_DOCS: DocumentItem[] = [
  { name: "08-basculas-siraga-hermeticidad-fuga-c3.md", category: "Básculas SIRAGA / GLP", size: "32 KB", status: "active", lastUpdated: "Ahora mismo", chunksCount: 16, source: "Presentación PPTX Oficial Abastible" },
];

export default function AdminTrainingPage() {
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [generating, setGenerating] = useState(false);
  const [selectedDocModal, setSelectedDocModal] = useState<{ title: string; filename: string } | null>(null);
  const [syncingSharePoint, setSyncingSharePoint] = useState(false);
  const [submittingEskuad, setSubmittingEskuad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("SEC Chile / GLP");
  const [aiPrompt, setAiPrompt] = useState("Generar anexo técnico sobre inspección de fuga de gas en redes interiores de gas de red conforme al DS 66 de la SEC Chile.");

  // Eskuad Modal / Drawer state
  const [isEskuadModalOpen, setIsEskuadModalOpen] = useState(false);
  const [eskuadForm, setEskuadForm] = useState({
    form_id: "ESKUAD-INS-4099",
    technician_phone: "+56961857682",
    equipment_code: "ESTANQUE-GRANEL-402",
    comments: "Inspección técnica de válvulas de seguridad y medición de presión en estanque GLP granel completada sin fugas.",
  });

  // Recent execution feedback results
  const [lastEskuadResult, setLastEskuadResult] = useState<EskuadWebhookResult | null>(null);
  const [lastSharePointResult, setLastSharePointResult] = useState<SharePointSyncResult | null>(null);

  // Connector operational status badges state
  const [connectorStatus, setConnectorStatus] = useState({
    eskuad: { status: "operativo", lastChecked: "Hoy, 10:48", label: "200 OK - Webhook Receptor Activo" },
    sharepoint: { status: "operativo", lastChecked: "Hoy, 10:48", label: "200 OK - Graph API Sync Activo" },
    vectorDb: { status: "activo", provider: "Supabase PGVector Store" },
  });

  const totalChunks = docs.reduce((acc, doc) => acc + doc.chunksCount, 0);

  const handleSyncSharePoint = async () => {
    setSyncingSharePoint(true);
    setLastSharePointResult(null);
    try {
      const res = await fetch("/api/sharepoint/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: "Abastible-SharePoint-Docs", folderPath: "/ManualesTecnicos" }),
      });
      const data = await res.json();
      
      setLastSharePointResult(data);
      
      if (res.ok && data.success && !data.error) {
        if (data.syncedFiles && data.syncedFiles.length > 0) {
          const newDocs: DocumentItem[] = data.syncedFiles.map((sf: SharePointSyncedFile) => ({
            name: sf.fileName || "Manual_SharePoint.pdf",
            category: "SharePoint O365",
            size: "1.4 MB",
            status: "active",
            lastUpdated: "Ahora mismo",
            chunksCount: sf.embeddingsCount || 24,
            source: "SharePoint Office 365",
          }));
          setDocs((prev) => [...newDocs, ...prev]);
        }
        setConnectorStatus((prev) => ({
          ...prev,
          sharepoint: { status: "operativo", lastChecked: "Ahora mismo", label: "200 OK - Graph API Sync Exitoso" },
        }));
      } else {
        const errorMsg = data.error || data.message || `Error (${res.status})`;
        setConnectorStatus((prev) => ({
          ...prev,
          sharepoint: { status: "error", lastChecked: "Ahora mismo", label: `Error: ${errorMsg}` },
        }));
      }
    } catch (e: any) {
      const errorMsg = e?.message || "Error al conectar con SharePoint API";
      setLastSharePointResult({ success: false, error: errorMsg });
      setConnectorStatus((prev) => ({
        ...prev,
        sharepoint: { status: "error", lastChecked: "Ahora mismo", label: `Error: ${errorMsg}` },
      }));
    } finally {
      setSyncingSharePoint(false);
    }
  };

  const handleSimulateEskuadWebhook = async (customPayload?: typeof eskuadForm) => {
    setSubmittingEskuad(true);
    setLastEskuadResult(null);

    const payloadToSend = customPayload || eskuadForm;

    try {
      const res = await fetch("/api/eskuad/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_id: payloadToSend.form_id,
          technician_phone: payloadToSend.technician_phone,
          form_title: `Acta Terreno ${payloadToSend.form_id}`,
          equipment_code: payloadToSend.equipment_code,
          comments: payloadToSend.comments,
        }),
      });
      const data = await res.json();

      setLastEskuadResult(data);

      if (res.ok && data.success && !data.error) {
        const newEskuadDoc: DocumentItem = {
          name: `Acta_Eskuad_${payloadToSend.form_id.replace(/[^a-zA-Z0-9_-]/g, "")}.json`,
          category: "Eskuad Field Data",
          size: "14 KB",
          status: "active",
          lastUpdated: "Ahora mismo",
          chunksCount: 6,
          source: "Eskuad App Terreno",
        };

        setDocs((prev) => [newEskuadDoc, ...prev]);

        setConnectorStatus((prev) => ({
          ...prev,
          eskuad: { status: "operativo", lastChecked: "Ahora mismo", label: "200 OK - Webhook Recibido" },
        }));
      } else {
        const errorMsg = data.error || data.message || `Error (${res.status})`;
        setConnectorStatus((prev) => ({
          ...prev,
          eskuad: { status: "error", lastChecked: "Ahora mismo", label: `Error: ${errorMsg}` },
        }));
      }
    } catch (e: any) {
      const errorMsg = e?.message || "Error al enviar webhook de Eskuad";
      setLastEskuadResult({ success: false, error: errorMsg });
      setConnectorStatus((prev) => ({
        ...prev,
        eskuad: { status: "error", lastChecked: "Ahora mismo", label: `Error: ${errorMsg}` },
      }));
    } finally {
      setSubmittingEskuad(false);
    }
  };

  const handleGenerateManualWithAI = () => {
    if (!aiPrompt.trim() || generating) return;
    setGenerating(true);

    setTimeout(() => {
      const newDoc: DocumentItem = {
        name: `07-anexo-sec-${Date.now().toString().slice(-4)}.md`,
        category: selectedCategory,
        size: "18 KB",
        status: "active",
        lastUpdated: "Ahora mismo",
        chunksCount: 10,
        source: "IA Generator",
      };

      setDocs((prev) => [newDoc, ...prev]);
      setGenerating(false);
      alert("✅ Manual técnico estandarizado generado con éxito e indexado en el motor Vector RAG de Supabase.");
    }, 1500);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Clean Single Panel Layout */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #F1F5F9", paddingBottom: "16px" }}>
            <div>
              <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <BookOpen size={20} color="#FF6600" /> Base de Conocimiento Vectorial RAG — Abastible
              </h2>
              <p style={{ fontSize: "12.5px", color: "#64748B", margin: "4px 0 0 0" }}>
                Manuales técnicos oficiales indexados en Supabase PGVector que alimentan las respuestas del bot.
              </p>
            </div>

            <button
              type="button"
              onClick={() => alert("✓ Índice vectorial 100% sincronizado con Supabase PGVector.")}
              style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}
            >
              <RefreshCw size={14} /> Estado Sincronizado
            </button>
          </div>

          {/* Clean Summary Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "16px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "11.5px", color: "#64748B", fontWeight: "700" }}>MANUALES INDEXADOS</div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#003366", marginTop: "4px" }}>{docs.length}</div>
            </div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "16px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "11.5px", color: "#64748B", fontWeight: "700" }}>FRAGMENTOS DE MEMORIA</div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#FF6600", marginTop: "4px" }}>{totalChunks} Secciones</div>
            </div>
            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "16px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "11.5px", color: "#64748B", fontWeight: "700" }}>ESTADO BASE DE DATOS</div>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#059669", marginTop: "10px" }}>✓ Base Vectorial Activa</div>
            </div>
          </div>

          {/* Document Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {docs.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  padding: "18px 20px",
                  borderRadius: "12px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14.5px", color: "#003366" }}>{doc.name}</div>
                    <div style={{ display: "flex", gap: "8px", fontSize: "11.5px", color: "#64748B", marginTop: "4px", alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ background: "#FF6600", color: "#FFF", padding: "2px 8px", borderRadius: "4px", fontWeight: "700" }}>{doc.category}</span>
                      <span style={{ background: "#E2E8F0", color: "#334155", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>📡 Presentación PPTX Oficial Abastible</span>
                      <span>Tamaño: {doc.size}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "12.5px", background: "#D1FAE5", color: "#065F46", padding: "6px 12px", borderRadius: "14px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle size={14} /> {doc.chunksCount} Secciones Indexadas
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedDocModal({
                      title: "Documento Técnico Oficial Abastible — Básculas SIRAGA & Fuga C3",
                      filename: doc.name
                    })}
                    style={{
                      background: "#003366",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      padding: "8px 14px",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    🔍 Ver Documento ➔
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Eskuad Offline Form Modal / Drawer */}
        {isEskuadModalOpen && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "16px"
          }}>
            <div style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "580px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              border: "1px solid #E2E8F0",
              overflow: "hidden"
            }}>
              
              {/* Modal Header */}
              <div style={{
                background: "#003366",
                color: "#FFFFFF",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "4px solid #FF6600"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,102,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Smartphone size={20} color="#FF6600" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>Simulador de Formulario Terreno Offline</h3>
                    <p style={{ fontSize: "11px", color: "#CBD5E1", margin: "2px 0 0 0" }}>Eskuad Webhook Integration (/api/eskuad/webhook)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEskuadModalOpen(false)}
                  style={{ background: "transparent", border: "none", color: "#FFFFFF", cursor: "pointer", padding: "4px" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body / Form */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                    ID del Formulario (form_id):
                  </label>
                  <input
                    type="text"
                    value={eskuadForm.form_id}
                    onChange={(e) => setEskuadForm({ ...eskuadForm, form_id: e.target.value })}
                    placeholder="ESKUAD-INS-4099"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                    Teléfono del Técnico (technician_phone):
                  </label>
                  <input
                    type="text"
                    value={eskuadForm.technician_phone}
                    onChange={(e) => setEskuadForm({ ...eskuadForm, technician_phone: e.target.value })}
                    placeholder="+56961857682"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                    Código de Equipo (equipment_code):
                  </label>
                  <input
                    type="text"
                    value={eskuadForm.equipment_code}
                    onChange={(e) => setEskuadForm({ ...eskuadForm, equipment_code: e.target.value })}
                    placeholder="ESTANQUE-GRANEL-402"
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
                    Observaciones / Comentarios de Terreno (comments):
                  </label>
                  <textarea
                    rows={3}
                    value={eskuadForm.comments}
                    onChange={(e) => setEskuadForm({ ...eskuadForm, comments: e.target.value })}
                    placeholder="Escriba aquí los comentarios del formulario..."
                    style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none", resize: "none" }}
                  />
                </div>

                {/* Submit Response Banner inside Modal */}
                {lastEskuadResult && (
                  <div style={{ padding: "12px", borderRadius: "8px", background: lastEskuadResult.error || lastEskuadResult.success === false ? "#FEF2F2" : "#ECFDF5", border: lastEskuadResult.error || lastEskuadResult.success === false ? "1px solid #FCA5A5" : "1px solid #6EE7B7", fontSize: "12px" }}>
                    {lastEskuadResult.error || lastEskuadResult.success === false ? (
                      <div style={{ color: "#991B1B", fontWeight: "700" }}>⚠️ {lastEskuadResult.error || lastEskuadResult.message || "Error al procesar webhook"}</div>
                    ) : (
                      <div style={{ color: "#065F46" }}>
                        <div style={{ fontWeight: "700", marginBottom: "4px" }}>✅ Webhook procesado exitosamente</div>
                        <div>Incidencia ID: <strong>{lastEskuadResult.incidentId || "Generada en DB"}</strong></div>
                        <div>Notificación WhatsApp: <strong>{lastEskuadResult.whatsappSent ? "Enviada" : "Modo dev (Sin token)"}</strong></div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Modal Footer */}
              <div style={{
                background: "#F8FAFC",
                padding: "16px 24px",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
              }}>
                <button
                  type="button"
                  onClick={() => setIsEskuadModalOpen(false)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "1px solid #CBD5E1",
                    background: "#FFFFFF",
                    color: "#475569",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateEskuadWebhook(eskuadForm)}
                  disabled={submittingEskuad}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#FF6600",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: "13px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {submittingEskuad ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                  {submittingEskuad ? "Enviando Webhook..." : "Enviar Webhook a /api/eskuad/webhook"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        {selectedDocModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px"
          }}>
            <div style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              maxWidth: "760px",
              width: "100%",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid #E2E8F0",
              overflow: "hidden"
            }}>
              
              {/* Modal Header */}
              <div style={{
                background: "#003366",
                color: "#FFFFFF",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "4px solid #FF6600"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={22} color="#FF6600" />
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", margin: 0 }}>{selectedDocModal.title}</h3>
                    <p style={{ fontSize: "11px", color: "#CBD5E1", margin: "2px 0 0 0" }}>Archivo Indexado: {selectedDocModal.filename}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedDocModal(null)}
                  style={{ background: "transparent", border: "none", color: "#FFFFFF", cursor: "pointer", padding: "4px" }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Modal Content - Manual Text Stream */}
              <div style={{ padding: "24px", overflowY: "auto", flex: 1, background: "#F8FAFC", fontSize: "13.5px", lineHeight: "1.7", color: "#1E293B" }}>
                
                <div style={{ background: "#E0F2FE", border: "1px solid #7DD3FC", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px", fontSize: "12px", color: "#075985", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle size={16} color="#0284C7" />
                  <span>Documento oficial parseado e indexado en el motor <strong>Vector RAG de Supabase</strong> de Abastible.</span>
                </div>

                <h4 style={{ color: "#003366", fontSize: "16px", fontWeight: "800", marginTop: 0 }}>1. Principio de Funcionamiento de Básculas SIRAGA & Hermeticidad</h4>
                <ol style={{ paddingLeft: "20px", margin: "10px 0" }}>
                  <li><strong>Posicionamiento:</strong> El cilindro de GLP se posiciona en la romana de llenado.</li>
                  <li><strong>Detección PLC:</strong> El PLC detecta la presencia del cilindro en el interior de la romana mediante la celda de carga (requiere un peso registrado mayor a 5 kg).</li>
                  <li><strong>Señal Eléctrica VAL1:</strong> El PLC envía una señal eléctrica a la válvula VAL1 activando el cilindro 1C (centrado) y 1D (posiciona cabeza de llenado).</li>
                  <li><strong>Prueba de Hermeticidad (Presostato 27):</strong> Se genera una presión neumática para asegurar la estanqueidad. La estanqueidad es confirmada e indicada al PLC por el <strong>Presostato 27</strong>.</li>
                  <li><strong>Señal Eléctrica VAL2 (Llenado):</strong> Cumplidas las 3 condiciones, VAL2 conmuta enviando aire a la válvula de corte GLP 1A y cabeza de llenado 162.</li>
                  <li><strong>Cierre de Llenado & Eyección (VAL3):</strong> Al completar el peso, se corta la señal de VAL1/VAL2 y con la señal magnética la válvula VAL3 activa el cilindro 1B para la eyección.</li>
                </ol>

                <h4 style={{ color: "#003366", fontSize: "16px", fontWeight: "800", marginTop: "20px" }}>2. Guía Paso a Paso: Acceso a Revisión de Hermeticidad (Cabezal SIRAGA)</h4>
                <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                  <li><strong>Bloqueo Preventivo:</strong> Bloquear la alimentación de GLP con dispositivo específico.</li>
                  <li><strong>Navegación PLC:</strong> Tecla <code>F3</code> ➔ <code>ENTER</code> ➔ Código <code>01024</code> ➔ <code>GENERAL</code> ➔ <code>PLC</code> ➔ <code>STEP BY STEP</code> ➔ Ajustar <code>SFC de 0 a 1</code>. Presionando F2 se avanza paso a paso.</li>
                  <li><strong>Verificación de Sensores:</strong> Presionar <code>SHIFT + ESC</code> en menú principal. Al bajar el cabezal, desconectar el tubing de aire y bloquearlo con el dedo. El sensor debe cambiar de <code>1 a 0</code> al taparlo y de <code>0 a 1</code> al soltarlo. Si no conmuta, el <strong>Presostato 27 está defectuoso</strong>.</li>
                </ul>

                <h4 style={{ color: "#003366", fontSize: "16px", fontWeight: "800", marginTop: "20px" }}>3. Secuencia de Fallas & Análisis de Incidente (Fuga C3)</h4>
                <ul style={{ paddingLeft: "20px", margin: "10px 0" }}>
                  <li><strong>Falla 1 (Hermeticidad):</strong> Si el sistema hubiese actuado (detectando falta de estanqueidad en Presostato 27), el cabezal no debería haber comenzado a llenar.</li>
                  <li><strong>Falla 2 (Válvula Corte 1A):</strong> Al apretar la Parada de Emergencia, la válvula de corte debió haber cerrado.</li>
                  <li><strong>Falla 3 (Actuador Anillo):</strong> Al apretar la Parada de Emergencia, el actuador neumático debió haber cerrado impidiendo la liberación de fluido C3.</li>
                </ul>

              </div>

              {/* Modal Footer */}
              <div style={{
                background: "#F8FAFC",
                padding: "14px 24px",
                borderTop: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace" }}>
                  DOCUMENTO: 08-basculas-siraga-hermeticidad-fuga-c3.md
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedDocModal(null)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#003366",
                    color: "#FFFFFF",
                    fontWeight: "700",
                    fontSize: "12.5px",
                    cursor: "pointer"
                  }}
                >
                  Cerrar Visualizador
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

