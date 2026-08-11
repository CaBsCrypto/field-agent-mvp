"use client";

import { useState } from "react";
import { 
  FileText, Upload, Sparkles, Database, CheckCircle, ArrowRight, ShieldCheck, RefreshCw, Cpu, Layers, BookOpen, ExternalLink, Plus
} from "lucide-react";

interface DocumentItem {
  name: string;
  category: string;
  size: string;
  status: "active" | "syncing";
  lastUpdated: string;
  chunksCount: number;
}

const INITIAL_DOCS: DocumentItem[] = [
  { name: "05-normativa-sec-glp-cilindros.md", category: "SEC Chile / GLP", size: "26 KB", status: "active", lastUpdated: "Hoy", chunksCount: 14 },
  { name: "06-protocolo-estanques-glp-abastible.md", category: "Abastible Granel", size: "19 KB", status: "active", lastUpdated: "Hoy", chunksCount: 11 },
  { name: "01-codigos-error-hvac.md", category: "Mantenimiento HVAC", size: "26 KB", status: "active", lastUpdated: "Ayer", chunksCount: 18 },
  { name: "02-protocolo-mantenimiento-preventivo.md", category: "Procedimientos", size: "19 KB", status: "active", lastUpdated: "Hace 2 días", chunksCount: 12 },
];

export default function AdminTrainingPage() {
  const [docs, setDocs] = useState<DocumentItem[]>(INITIAL_DOCS);
  const [generating, setGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("SEC Chile / GLP");
  const [aiPrompt, setAiPrompt] = useState("Generar anexo técnico sobre inspección de fuga de gas en redes interiores de gas de red conforme al DS 66 de la SEC Chile.");

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
      };

      setDocs((prev) => [newDoc, ...prev]);
      setGenerating(false);
      alert("✅ Manual técnico estandarizado generado con éxito e indexado en el motor Vector RAG de Supabase.");
    }, 2000);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Header Admin */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", background: "#003366", padding: "20px 28px", borderRadius: "14px", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(0, 51, 102, 0.12)" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#FFF", background: "#FF6600", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                PANEL CORPORATIVO DE ENTRENAMIENTO
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", margin: "6px 0 0 0" }}>
              Administración de Manuales Técnicos & Base de Conocimiento RAG
            </h1>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href="/demo"
              style={{ fontSize: "13px", background: "rgba(255,255,255,0.15)", color: "#FFF", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}
            >
              Ir a Demo Técnico en Terreno <ArrowRight size={14} />
            </a>
          </div>
        </header>

        {/* Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px" }}>
          
          {/* Main Panel: Document List */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <BookOpen size={18} color="#FF6600" /> Manuales Indexados en Tiempo Real ({docs.length})
                </h2>
                <p style={{ fontSize: "12px", color: "#64748B", margin: "4px 0 0 0" }}>
                  Documentos estandarizados disponibles para el Copilot de WhatsApp de los técnicos en terreno.
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
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "14px", color: "#0F172A" }}>{doc.name}</div>
                      <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                        <span style={{ background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px", fontWeight: "600" }}>{doc.category}</span>
                        <span>Tamaño: {doc.size}</span>
                        <span>Actualizado: {doc.lastUpdated}</span>
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

          {/* Right Panel: Upload & AI Generator */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Box 1: File Uploader */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Upload size={16} color="#FF6600" /> Cargar Nuevo Documento Técnico
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>
                Sube archivos en formato PDF, Word (DOCX) o Markdown. El motor procesará automáticamente los textos para el agente.
              </p>
              
              <div 
                onClick={() => alert("Simulando selección de archivo PDF/DOCX corporativo...")}
                style={{ border: "2px dashed #CBD5E1", borderRadius: "10px", padding: "24px", textAlign: "center", background: "#F8FAFC", cursor: "pointer", transition: "all 0.2s" }}
              >
                <Upload size={28} color="#003366" style={{ margin: "0 auto 8px auto", display: "block" }} />
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#003366" }}>Haz clic para seleccionar un archivo</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>Soporta PDF, DOCX, XLSX, TXT (máx. 25MB)</div>
              </div>
            </div>

            {/* Box 2: AI Manual Generator */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)", borderTop: "4px solid #FF6600" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Sparkles size={16} color="#FF6600" /> Generar Manual Técnico con IA (SEC Chile)
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "14px" }}>
                Describe el requerimiento normativo o procedimiento que deseas estandarizar para que la IA redacte la documentación.
              </p>

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
