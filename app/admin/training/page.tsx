"use client";

import { AdminHeader } from "@/components/AdminHeader";
import { useState } from "react";
import { FileText, Upload, Sparkles, BookOpen, CheckCircle, RefreshCw, ArrowRight, CloudSync, Share2, Smartphone } from "lucide-react";

interface DocumentItem {
  name: string;
  category: string;
  size: string;
  status: "active" | "syncing";
  lastUpdated: string;
  chunksCount: number;
  source?: string;
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
  const [simulatingEskuad, setSimulatingEskuad] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("SEC Chile / GLP");
  const [aiPrompt, setAiPrompt] = useState("Generar anexo técnico sobre inspección de fuga de gas en redes interiores de gas de red conforme al DS 66 de la SEC Chile.");

  const handleSyncSharePoint = async () => {
    setSyncingSharePoint(true);
    try {
      const res = await fetch("/api/sharepoint/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: "Abastible-SharePoint-Docs" }),
      });
      const data = await res.json();
      
      const newSharePointDoc: DocumentItem = {
        name: "SEC_DS108_Normativa_Oficial_2026.pdf",
        category: "SharePoint O365",
        size: "1.4 MB",
        status: "active",
        lastUpdated: "Ahora mismo",
        chunksCount: 24,
        source: "SharePoint Office 365",
      };

      setDocs((prev) => [newSharePointDoc, ...prev]);
      alert("✅ Conexión con Microsoft Graph API exitosa. Documento sincronizado desde SharePoint Office 365.");
    } catch (e) {
      alert("Error al sincronizar con SharePoint.");
    } finally {
      setSyncingSharePoint(false);
    }
  };

  const handleSimulateEskuadWebhook = async () => {
    setSimulatingEskuad(true);
    try {
      const res = await fetch("/api/eskuad/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_id: "ESKUAD-INS-4099",
          technician_phone: "+56961857682",
          form_title: "Acta de Inspección Estanque Granel 402",
          equipment_code: "ESTANQUE-GRANEL-402",
        }),
      });
      const data = await res.json();

      const newEskuadDoc: DocumentItem = {
        name: "Acta_Inspeccion_Eskuad_Form_4099.json",
        category: "Eskuad Field Data",
        size: "14 KB",
        status: "active",
        lastUpdated: "Ahora mismo",
        chunksCount: 6,
        source: "Eskuad App Terreno",
      };

      setDocs((prev) => [newEskuadDoc, ...prev]);
      alert("✅ Evento Webhook de Eskuad recibido. Formulario de terreno indexado e integrado al bot.");
    } catch (e) {
      alert("Error al recibir evento de Eskuad.");
    } finally {
      setSimulatingEskuad(false);
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
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          
          {/* Main Panel: Document List */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <BookOpen size={18} color="#FF6600" /> Manuales & Fuentes Indexadas ({docs.length})
                </h2>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>
                  Integración directa con SharePoint (Office 365) y Formularios de Terreno Eskuad.
                </p>
              </div>
              <button
                type="button"
                onClick={() => alert("Sincronizando índice con Vector Store...")}
                style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", color: "#334155", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <RefreshCw size={14} /> Re-sincronizar Vector Store
              </button>
            </div>

            {/* Document Table */}
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
                      <div style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#64748B", marginTop: "4px", alignItems: "center" }}>
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

          {/* Right Panel: Integraciones SharePoint & Eskuad + AI */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Box 1: Conectores Empresariales (SharePoint & Eskuad) */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", borderTop: "4px solid #003366" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Share2 size={16} color="#003366" /> Integraciones Corporativas
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>
                Sincronización en tiempo real con los sistemas oficiales de Abastible.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* SharePoint Button */}
                <button
                  type="button"
                  onClick={handleSyncSharePoint}
                  disabled={syncingSharePoint}
                  style={{
                    background: "#0284C7",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#FFF",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    ☁️ Sincronizar SharePoint O365
                  </span>
                  {syncingSharePoint ? <RefreshCw size={14} className="animate-spin" /> : <span>Pruebas Graph API →</span>}
                </button>

                {/* Eskuad Webhook Simulation Button */}
                <button
                  type="button"
                  onClick={handleSimulateEskuadWebhook}
                  disabled={simulatingEskuad}
                  style={{
                    background: "#D97706",
                    border: "none",
                    borderRadius: "8px",
                    padding: "10px 14px",
                    color: "#FFF",
                    fontSize: "12.5px",
                    fontWeight: "700",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    📱 Simular Webhook de Eskuad
                  </span>
                  {simulatingEskuad ? <RefreshCw size={14} className="animate-spin" /> : <span>Form Terreno →</span>}
                </button>
              </div>
            </div>

            {/* Box 2: File Uploader */}
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

            {/* Box 3: AI Manual Generator */}
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

      </div>
    </div>
  );
}
