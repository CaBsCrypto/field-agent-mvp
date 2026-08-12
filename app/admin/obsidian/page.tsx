"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { BookOpen, FileText, ArrowLeft, Network, Edit3, Share2, Layers, Search, Eye } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

interface VaultDoc {
  id: string;
  title: string;
  fileName: string;
  category: string;
  content: string;
  links: string[];
}

const VAULT_DOCS: VaultDoc[] = [
  {
    id: "05-normativa-sec-glp-cilindros",
    title: "Normativa SEC Chile GLP (DS 108 / DS 66)",
    fileName: "05-normativa-sec-glp-cilindros.md",
    category: "SEC Chile / GLP",
    links: ["06-protocolo-estanques-glp-abastible", "04-protocolo-escalacion"],
    content: `# Protocolo Técnico SEC Chile: Cilindros GLP (DS 108 / DS 66)

## 📌 Normativa Aplicable
Reglamento de seguridad para las instalaciones y almacenamiento de cilindros de Gas Licuado de Petróleo (GLP) de 15 kg y 45 kg en recintos habitacionales y comerciales.

### 📍 Distancias Mínimas de Seguridad (DS 108)
- **Aperturas a edificios (puertas/ventanas):** Mínimo **1,5 metros**.
- **Fuentes de ignición / interruptores eléctricos:** Mínimo **3,0 metros**.
- **Alcantarillas / pozos sin sello:** Mínimo **2,0 metros**.

### 📋 Formulario TC11 SEC
Obligatorio para instalaciones comerciales superiores a 3 cilindros de 45 kg.
Vínculo relacional: [[06-protocolo-estanques-glp-abastible]] y [[04-protocolo-escalacion]].`,
  },
  {
    id: "06-protocolo-estanques-glp-abastible",
    title: "Protocolo Estanques a Granel Abastible",
    fileName: "06-protocolo-estanques-glp-abastible.md",
    category: "Abastible Granel",
    links: ["05-normativa-sec-glp-cilindros", "01-codigos-error-hvac"],
    content: `# Protocolo Mantenimiento Estanques a Granel Abastible

## ⛽ Operación de Carga Granel
- **Límite Máximo de Llenado:** Jamás superar el **85% de capacidad volumétrica total** por dilatación térmica.
- **Presión Normal Operativa:** 4,5 a 6,2 bar.
- **Revisión Quinquenal:** Norma NCh2427 para pruebas hidrostáticas.

### 🛠️ Código de Falla Relacionado
Ver matriz de errores en [[01-codigos-error-hvac]] o protocolo de regulación en [[05-normativa-sec-glp-cilindros]].`,
  },
  {
    id: "01-codigos-error-hvac",
    title: "Tabla Maestra de Códigos de Error HVAC",
    fileName: "01-codigos-error-hvac.md",
    category: "Códigos de Falla",
    links: ["02-protocolo-mantenimiento-preventivo"],
    content: `# Tabla Maestra de Códigos de Error HVAC & Climatización

| Código | Descripción de Falla | Acción Sugerida |
|---|---|---|
| **E-01** | Presión de Refrigerante Anormal | Revisar fuga o carga de gas R410A |
| **E-02** | Falla de Encendido de Quemador | Verificar válvula solenoide y chispa |
| **E-VRP-01** | Escape Continuo en Válvula Alivio | Evacuar zona y aplicar [[04-protocolo-escalacion]] |

Ver procedimiento de rutina mensual en [[02-protocolo-mantenimiento-preventivo]].`,
  },
  {
    id: "02-protocolo-mantenimiento-preventivo",
    title: "Protocolo de Mantenimiento Preventivo",
    fileName: "02-protocolo-mantenimiento-preventivo.md",
    category: "Procedimientos",
    links: ["04-protocolo-escalacion"],
    content: `# Protocolo de Mantenimiento Preventivo Mensual / Anual

Checklist de inspección obligatoria de 15 puntos en terreno:
1. Inspección visual de cañerías de cobre y empalmes.
2. Aplicación de solución jabonosa para estanqueidad.
3. Medición de tensión eléctrica y amperaje de compresores.

Si se detecta peligro de explosión, aplicar [[04-protocolo-escalacion]].`,
  },
  {
    id: "04-protocolo-escalacion",
    title: "Protocolo de Escalación Inmediata a Supervisor",
    fileName: "04-protocolo-escalacion.md",
    category: "Procedimientos",
    links: [],
    content: `# Protocolo de Escalación Inmediata a Supervisor Abastible

## 🚨 Alerta de Emergencias Clase 1
Notificar de inmediato cuando:
- Exista fuga masiva no contenible de GLP.
- Daño estructural en el estanque o tubería principal.

El bot notificará automáticamente vía WhatsApp al supervisor central (+56900000001).`,
  },
];

export default function AdminObsidianStudioPage() {
  const [activeDoc, setActiveDoc] = useState<VaultDoc>(VAULT_DOCS[0]);
  const [markdownContent, setMarkdownContent] = useState(VAULT_DOCS[0].content);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSelectDoc = (doc: VaultDoc) => {
    setActiveDoc(doc);
    setMarkdownContent(doc.content);
  };

  const handleSaveDoc = () => {
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const filteredDocs = VAULT_DOCS.filter(
    (d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0F172A", color: "#F8FAFC", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Studio Title Sub-header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", background: "#1E293B", padding: "14px 20px", borderRadius: "10px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "#FF6600", padding: "6px", borderRadius: "6px", color: "#FFF" }}>
              <BookOpen size={18} />
            </div>
            <div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#38BDF8", fontFamily: "monospace" }}>OBSIDIAN EMBEDDED STUDIO (LOCALHOST INTEGRADO)</span>
              <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0, color: "#FFF" }}>Bóveda Viva de Conocimiento Técnico</h2>
            </div>
          </div>
          <div style={{ fontSize: "12px", background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8", padding: "4px 12px", borderRadius: "20px", fontWeight: "600" }}>
            📁 Sincronizado con /knowledge_base/*.md
          </div>
        </div>

        {/* 3-Column Studio Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 340px", gap: "16px", height: "680px" }}>
          
          {/* Column 1: File Tree (Obsidian Sidebar) */}
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", marginBottom: "14px" }}>
              <input
                type="text"
                placeholder="Buscar nota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "8px 10px 8px 32px", borderRadius: "6px", border: "1px solid #475569", background: "#0F172A", color: "#FFF", fontSize: "12px", outline: "none" }}
              />
              <Search size={14} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "10px" }} />
            </div>

            <div style={{ fontSize: "11px", fontWeight: "700", color: "#94A3B8", marginBottom: "8px", textTransform: "uppercase" }}>
              Archivos de la Bóveda ({filteredDocs.length})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto", flex: 1 }}>
              {filteredDocs.map((doc) => {
                const isActive = activeDoc.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleSelectDoc(doc)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: isActive ? "#FF6600" : "#0F172A",
                      color: "#FFFFFF",
                      border: isActive ? "1px solid #FF6600" : "1px solid #334155",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: isActive ? "700" : "500",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FileText size={14} color={isActive ? "#FFF" : "#38BDF8"} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Markdown Live Editor & Preview */}
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "12px", display: "flex", flexDirection: "column", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", paddingBottom: "10px", borderBottom: "1px solid #334155" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Edit3 size={16} color="#FF6600" />
                <span style={{ fontWeight: "700", fontSize: "14px", color: "#FFF" }}>{activeDoc.fileName}</span>
              </div>
              <button
                type="button"
                onClick={handleSaveDoc}
                style={{ background: "#FF6600", border: "none", color: "#FFF", padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}
              >
                {savedStatus ? "✓ Guardado!" : "Guardar Nota"}
              </button>
            </div>

            {/* Editor Area */}
            <textarea
              value={markdownContent}
              onChange={(e) => setMarkdownContent(e.target.value)}
              style={{
                flex: 1,
                background: "#0F172A",
                color: "#E2E8F0",
                border: "1px solid #334155",
                borderRadius: "8px",
                padding: "16px",
                fontFamily: "Consolas, Monaco, monospace",
                fontSize: "13px",
                lineHeight: "1.6",
                outline: "none",
                resize: "none"
              }}
            />
          </div>

          {/* Column 3: Live Obsidian Force Graph Mini-View */}
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#00F0FF", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Network size={16} /> GRAFO VIVO DE OBSIDIAN
            </div>

            <div style={{ flex: 1, background: "#050C1A", borderRadius: "8px", border: "1px solid #334155", overflow: "hidden" }}>
              <ForceGraph2D
                graphData={{
                  nodes: VAULT_DOCS.map((d) => ({ id: d.id, name: d.title, val: d.id === activeDoc.id ? 10 : 5 })),
                  links: [
                    { source: "05-normativa-sec-glp-cilindros", target: "06-protocolo-estanques-glp-abastible" },
                    { source: "05-normativa-sec-glp-cilindros", target: "04-protocolo-escalacion" },
                    { source: "06-protocolo-estanques-glp-abastible", target: "01-codigos-error-hvac" },
                    { source: "01-codigos-error-hvac", target: "02-protocolo-mantenimiento-preventivo" },
                    { source: "02-protocolo-mantenimiento-preventivo", target: "04-protocolo-escalacion" },
                  ],
                }}
                nodeAutoColorBy="id"
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.008}
                linkColor={() => "rgba(0, 240, 255, 0.4)"}
                width={306}
                height={380}
              />
            </div>

            <div style={{ marginTop: "12px", fontSize: "11px", color: "#94A3B8", background: "#0F172A", padding: "10px", borderRadius: "6px", border: "1px solid #334155" }}>
              💡 Al editar las notas en este editor, los cambios se indexan en tiempo real en la base de datos Vector RAG del bot de WhatsApp.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
