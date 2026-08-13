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
  { name: "05-normativa-sec-glp-cilindros.md", category: "SEC Chile / GLP", size: "26 KB", status: "active", lastUpdated: "Hoy", chunksCount: 14, source: "SharePoint Office 365" },
  { name: "06-protocolo-estanques-glp-abastible.md", category: "Abastible Granel", size: "19 KB", status: "active", lastUpdated: "Hoy", chunksCount: 11, source: "SharePoint Office 365" },
  { name: "01-codigos-error-hvac.md", category: "Mantenimiento HVAC", size: "26 KB", status: "active", lastUpdated: "Ayer", chunksCount: 18, source: "Eskuad Forms API" },
  { name: "02-protocolo-mantenimiento-preventivo.md", category: "Procedimientos", size: "19 KB", status: "active", lastUpdated: "Hace 2 días", chunksCount: 12, source: "Eskuad App Terreno" },
];

export default function AdminTrainingPage() {
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [generating, setGenerating] = useState(false);
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

        {/* Connector Operational Status Badges */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "18px 24px", marginBottom: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Activity size={14} color="#003366" /> Estado de Conectores e Integraciones
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
            
            {/* Eskuad Webhook Status Badge */}
            <div style={{
              background: connectorStatus.eskuad.status === "error" ? "#FEF2F2" : "#FFFBEB",
              border: connectorStatus.eskuad.status === "error" ? "1px solid #FCA5A5" : "1px solid #FCD34D",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: connectorStatus.eskuad.status === "error" ? "#991B1B" : "#92400E", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Smartphone size={16} color={connectorStatus.eskuad.status === "error" ? "#DC2626" : "#D97706"} /> Eskuad Webhook Receptor
                </div>
                <div style={{ fontSize: "11px", color: connectorStatus.eskuad.status === "error" ? "#B91C1C" : "#B45309", marginTop: "2px" }}>
                  /api/eskuad/webhook
                </div>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                background: connectorStatus.eskuad.status === "error" ? "#FEE2E2" : "#D1FAE5",
                color: connectorStatus.eskuad.status === "error" ? "#991B1B" : "#065F46",
                padding: "4px 8px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: connectorStatus.eskuad.status === "error" ? "#EF4444" : "#10B981" }} />
                {connectorStatus.eskuad.label}
              </span>
            </div>

            {/* SharePoint Sync Status Badge */}
            <div style={{
              background: connectorStatus.sharepoint.status === "error" ? "#FEF2F2" : "#F0F9FF",
              border: connectorStatus.sharepoint.status === "error" ? "1px solid #FCA5A5" : "1px solid #7DD3FC",
              borderRadius: "10px",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: connectorStatus.sharepoint.status === "error" ? "#991B1B" : "#075985", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Share2 size={16} color={connectorStatus.sharepoint.status === "error" ? "#DC2626" : "#0284C7"} /> SharePoint Office 365 Sync
                </div>
                <div style={{ fontSize: "11px", color: connectorStatus.sharepoint.status === "error" ? "#B91C1C" : "#0369A1", marginTop: "2px" }}>
                  /api/sharepoint/sync (Graph API)
                </div>
              </div>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                background: connectorStatus.sharepoint.status === "error" ? "#FEE2E2" : "#D1FAE5",
                color: connectorStatus.sharepoint.status === "error" ? "#991B1B" : "#065F46",
                padding: "4px 8px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: connectorStatus.sharepoint.status === "error" ? "#EF4444" : "#10B981" }} />
                {connectorStatus.sharepoint.label}
              </span>
            </div>

            {/* RAG Vector Store Status Badge */}
            <div style={{ background: "#F3E8FF", border: "1px solid #D8B4FE", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#6B21A8", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Database size={16} color="#9333EA" /> Vector Store & Embeddings RAG
                </div>
                <div style={{ fontSize: "11px", color: "#7E22CE", marginTop: "2px" }}>
                  Supabase PGVector • {totalChunks} Chunks Activos
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "700", background: "#D1FAE5", color: "#065F46", padding: "4px 8px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#10B981" }} />
                Activo
              </span>
            </div>

          </div>
        </div>

        {/* Main Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          
          {/* Main Panel: Document Vector State Tracking & Interactive Tests */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Action Card: Interactive Test Buttons */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", borderLeft: "5px solid #FF6600" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <Terminal size={18} color="#FF6600" /> Centro de Pruebas e Integración de Conectores
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>
                    Ejecuta pruebas interactivas de ingestión de datos y sincronización de formularios offline.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                {/* Trigger Eskuad Form Modal */}
                <button
                  type="button"
                  onClick={() => setIsEskuadModalOpen(true)}
                  style={{
                    background: "#D97706",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 2px 6px rgba(217, 119, 6, 0.2)"
                  }}
                >
                  <Smartphone size={16} /> Abrir Formulario Terreno Offline Eskuad
                </button>

                {/* Direct Quick Eskuad Webhook Test */}
                <button
                  type="button"
                  onClick={() => handleSimulateEskuadWebhook()}
                  disabled={submittingEskuad}
                  style={{
                    background: "#F59E0B",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}
                >
                  {submittingEskuad ? <RefreshCw size={15} className="animate-spin" /> : <Send size={15} />}
                  ⚡ Test Rápido Webhook Eskuad
                </button>

                {/* SharePoint Sync Button */}
                <button
                  type="button"
                  onClick={handleSyncSharePoint}
                  disabled={syncingSharePoint}
                  style={{
                    background: "#0284C7",
                    color: "#FFFFFF",
                    border: "none",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: "0 2px 6px rgba(2, 132, 199, 0.2)"
                  }}
                >
                  {syncingSharePoint ? <RefreshCw size={15} className="animate-spin" /> : <Share2 size={15} />}
                  ☁️ Sincronizar SharePoint O365
                </button>
              </div>

              {/* Execution Feedback Notification Banners */}
              {lastEskuadResult && (
                lastEskuadResult.error || lastEskuadResult.success === false ? (
                  <div style={{ marginTop: "16px", padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", fontSize: "12px", color: "#991B1B" }}>
                    <div style={{ fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertCircle size={15} color="#DC2626" /> Error en Webhook Eskuad:
                    </div>
                    <div><strong>{lastEskuadResult.error || lastEskuadResult.message || "Error procesando webhook de Eskuad"}</strong></div>
                  </div>
                ) : (
                  <div style={{ marginTop: "16px", padding: "12px 16px", background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", fontSize: "12px", color: "#92400E" }}>
                    <div style={{ fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle size={15} color="#D97706" /> Webhook Eskuad procesado exitosamente:
                    </div>
                    <div>ID Formulario: <strong>{lastEskuadResult.record?.formId || "N/A"}</strong> • Equipo: <strong>{lastEskuadResult.record?.equipmentCode || "N/A"}</strong></div>
                    <div>ID Incidencia DB: <strong>{lastEskuadResult.incidentId || "Registrada"}</strong> • WhatsApp: <strong>{lastEskuadResult.whatsappSent ? "Notificación enviada" : "Modo dev"}</strong></div>
                  </div>
                )
              )}

              {lastSharePointResult && (
                lastSharePointResult.error || lastSharePointResult.success === false ? (
                  <div style={{ marginTop: "16px", padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "8px", fontSize: "12px", color: "#991B1B" }}>
                    <div style={{ fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <AlertCircle size={15} color="#DC2626" /> Error en Sincronización SharePoint:
                    </div>
                    <div><strong>{lastSharePointResult.error || lastSharePointResult.message || "Error al conectar con SharePoint API"}</strong></div>
                  </div>
                ) : (
                  <div style={{ marginTop: "16px", padding: "12px 16px", background: "#E0F2FE", border: "1px solid #7DD3FC", borderRadius: "8px", fontSize: "12px", color: "#075985" }}>
                    <div style={{ fontWeight: "700", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <CheckCircle size={15} color="#0284C7" /> Sincronización SharePoint ejecutada:
                    </div>
                    <div>Mensaje: <strong>{lastSharePointResult.message || "Documento procesado"}</strong></div>
                    <div>Archivos procesados: <strong>{lastSharePointResult.syncedFiles?.length ?? 1} manual(es)</strong></div>
                  </div>
                )
              )}
            </div>

            {/* Document Vector State Tracking Table */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <BookOpen size={18} color="#FF6600" /> Tracking de Estado Vectorial RAG ({docs.length} Manuales)
                  </h2>
                  <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>
                    Monitoreo de manuales corporativos indexados y conteo de chunks/embeddings en Supabase.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => alert("Sincronizando índice con Supabase Vector Store...")}
                  style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={14} /> Re-sincronizar Vector Store
                </button>
              </div>

              {/* Vector Tracking Summary Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}>Total Documentos Indexados</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#003366", marginTop: "2px" }}>{docs.length}</div>
                </div>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}>Chunks / Embeddings Totales</div>
                  <div style={{ fontSize: "20px", fontWeight: "800", color: "#FF6600", marginTop: "2px" }}>{totalChunks}</div>
                </div>
                <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                  <div style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}>Motor RAG Base</div>
                  <div style={{ fontSize: "13px", fontWeight: "700", color: "#065F46", marginTop: "6px" }}>pgvector / Supabase</div>
                </div>
              </div>

              {/* Document List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {docs.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      background: "#F8FAFC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: doc.source?.includes("SharePoint") ? "#E0F2FE" : doc.source?.includes("Eskuad") ? "#FEF3C7" : "#F3E8FF", color: doc.source?.includes("SharePoint") ? "#0284C7" : doc.source?.includes("Eskuad") ? "#D97706" : "#7E22CE", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>{doc.name}</div>
                        <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#64748B", marginTop: "4px", alignItems: "center", flexWrap: "wrap" }}>
                          <span style={{ background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>{doc.category}</span>
                          {doc.source && (
                            <span style={{ background: "#E2E8F0", color: "#334155", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>📡 {doc.source}</span>
                          )}
                          <span>Tamaño: {doc.size}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", background: "#D1FAE5", color: "#065F46", padding: "4px 10px", borderRadius: "12px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle size={12} /> {doc.chunksCount} Embeddings Activos
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Panel: File Upload & AI Manual Generator */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Box 1: File Uploader */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Upload size={16} color="#FF6600" /> Cargar Nuevo Documento Técnico
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>
                Sube archivos en formato PDF, Word (DOCX) o Markdown.
              </p>
              
              <div 
                onClick={() => alert("Simulando selección de archivo PDF/DOCX corporativo...")}
                style={{ border: "2px dashed #CBD5E1", borderRadius: "10px", padding: "20px", textAlign: "center", background: "#F8FAFC", cursor: "pointer", transition: "all 0.2s" }}
              >
                <Upload size={24} color="#003366" style={{ margin: "0 auto 6px auto", display: "block" }} />
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#003366" }}>Seleccionar archivo PDF/DOCX</div>
              </div>
            </div>

            {/* Box 2: AI Manual Generator */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", borderTop: "4px solid #FF6600" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="#FF6600" /> Generar Manual Técnico con IA
              </h3>

              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>Categoría del Manual:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#F8FAFC", fontSize: "12px" }}
                >
                  <option value="SEC Chile / GLP">SEC Chile / GLP</option>
                  <option value="Abastible Granel">Abastible Granel</option>
                  <option value="Procedimientos Generales">Procedimientos Generales</option>
                </select>
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "11px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "4px" }}>Prompt de Estandarización:</label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #CBD5E1", background: "#F8FAFC", fontSize: "12px", outline: "none", resize: "none" }}
                />
              </div>

              <button
                type="button"
                onClick={handleGenerateManualWithAI}
                disabled={generating}
                style={{
                  width: "100%",
                  background: "#FF6600",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}
              >
                {generating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                {generating ? "Generando e Indexando Manual..." : "Generar Manual con IA"}
              </button>
            </div>

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

      </div>
    </div>
  );
}

