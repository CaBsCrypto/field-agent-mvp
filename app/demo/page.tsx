"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, UserCheck, FileText, RefreshCw, ShieldCheck, CheckCircle, AlertCircle, Lightbulb, Menu, X, Phone } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  intent?: string;
  sourceDoc?: string;
  docSnippet?: string;
  followUpButtons?: { label: string; query: string }[];
}

interface RoleConfig {
  roleName: string;
  presetQueries: string[];
  suggestedChips: { label: string; query: string }[];
}

const ABASTIBLE_ROLES: Record<string, RoleConfig> = {
  "tech_siraga": {
    roleName: "Especialista Básculas SIRAGA & Carrusel C3",
    presetQueries: [
      "¿Cuáles son los pasos en la pantalla del PLC para revisar la hermeticidad del cabezal Siraga y validar el Presostato 27?",
      "¿Cómo funciona el proceso neumático de llenado en las básculas SIRAGA desde que entra el cilindro hasta que se eyecta?",
      "¿Qué fallas ocurrieron en la secuencia del incidente de Fuga C3 al presionar la parada de emergencia?",
      "¿Qué hacer si el presostato 27 no cambia de estado 1 a 0 al desconectar el tubing?",
    ],
    suggestedChips: [
      { label: "⚙️ Hermeticidad PLC Siraga", query: "¿Cuáles son los pasos en la pantalla del PLC para revisar la hermeticidad del cabezal Siraga y como validar el presostato 27?" },
      { label: "🚨 Secuencia Fallas Fuga C3", query: "¿Qué fallas ocurrieron en la secuencia del incidente de Fuga C3 al presionar la parada de emergencia?" },
      { label: "⛽ Llenado Básculas SIRAGA", query: "¿Cómo funciona el proceso neumático de llenado en las básculas SIRAGA desde que entra el cilindro hasta que se eyecta?" },
      { label: "🔧 Fallo Presostato 27 (Tubing)", query: "¿Qué hacer si el presostato 27 no cambia de estado 1 a 0 al desconectar el tubing de aire?" },
    ],
  },
  "tech_glp": {
    roleName: "Técnico Granel & Cilindros GLP",
    presetQueries: [
      "¿Cuáles son las distancias de seguridad SEC para cilindros de 45kg?",
      "¿Cómo actuar ante fuga en válvula de alivio E-VRP-01 de estanque?",
      "¿Cuándo es obligatorio el Formulario TC11 SEC?",
      "¿Cuál es el límite máximo de llenado de estanque a granel?",
    ],
    suggestedChips: [
      { label: "📍 Distancias SEC 45kg", query: "¿Cuáles son las distancias mínimas de seguridad para cilindros 45kg según la SEC?" },
      { label: "⛽ Máx Llenado Granel (85%)", query: "¿Cuál es el porcentaje máximo de llenado permitido en estanque a granel?" },
      { label: "📋 Formulario TC11 SEC", query: "¿Cuándo se exige la declaración TC11 de la SEC?" },
      { label: "🛠️ Fuga Válvula E-VRP-01", query: "¿Cómo solucionar el error E-VRP-01 por escape continuo en válvula?" },
    ],
  },
  "tech_hvac": {
    roleName: "Técnico Climatización & Bombas",
    presetQueries: [
      "¿Qué significa el error E-01 y cómo calibrar presión R410A?",
      "¿Cómo reparar la falla E-03 en sensor térmico NTC?",
      "¿Cuál es el procedimiento de prueba de estanqueidad en cañerías?",
      "Completé mantención en central de climatización sin fallas.",
    ],
    suggestedChips: [
      { label: "❄️ Error E-01 Presión R410A", query: "¿Qué significa el error E-01 y cómo calibrar presión R410A?" },
      { label: "🌡️ Error E-03 Sensor NTC", query: "¿Cómo reparar la falla E-03 en sensor térmico NTC?" },
      { label: "🔧 Prueba Estanqueidad", query: "¿Cuál es el procedimiento para la prueba de estanqueidad?" },
      { label: "✅ Registrar Mantención OK", query: "Completé la instalación y mantención preventiva sin fallas." },
    ],
  },
  "supervisor": {
    roleName: "Supervisor de Operaciones & Emergencias",
    presetQueries: [
      "Tengo una fuga masiva descontrolable de GLP, necesito auxilio inmediato.",
      "¿Cómo emitir un reporte de emergencia Clase 1 a la central?",
      "Revisar estado de alertas recibidas en la jornada.",
      "¿Cuál es el protocolo de evacuación en plantas de almacenamiento?",
    ],
    suggestedChips: [
      { label: "🚨 Fuga Masiva (Alerta Clase 1)", query: "Tengo una fuga masiva descontrolable de GLP, necesito auxilio inmediato." },
      { label: "📞 Protocolo Escalación", query: "¿Cómo notificar una emergencia al supervisor central?" },
      { label: "📊 Estado de Incidencias", query: "Revisar estado de alertas recibidas en la jornada." },
      { label: "🛑 Protocolo Evacuación", query: "¿Cuál es el protocolo de evacuación en plantas de almacenamiento?" },
    ],
  },
};

const MOCK_TECHNICIANS = [
  { id: "tech_siraga", name: "Roberto Araya", roleKey: "tech_siraga", phone: "+56955554321", displayRole: "Especialista Básculas SIRAGA & Carrusel C3", isAuth: true },
  { id: "denied", name: "Usuario Desconocido", roleKey: "tech_siraga", phone: "+56999999999", displayRole: "Sin Autorización (No Whitelist)", isAuth: false },
];

export default function DemoSimulatorPage() {
  const [selectedTech, setSelectedTech] = useState(MOCK_TECHNICIANS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "Asistente Técnico Abastible listo. Selecciona una sugerencia ajustada a tu cargo o escribe tu consulta.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDocModal, setSelectedDocModal] = useState<{ title: string; filename: string } | null>(null);
  const [showConfigMobile, setShowConfigMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const activeRoleConfig = ABASTIBLE_ROLES[selectedTech.roleKey] || ABASTIBLE_ROLES["tech_glp"];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend !== undefined ? textToSend : inputText;
    if (!query || !query.trim() || loading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/demo/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: selectedTech.phone,
          message: query,
        }),
      });

      const data = await res.json();

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "Sin respuesta del servidor",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: data.intent,
        sourceDoc: data.sourceDoc,
        docSnippet: data.docSnippet,
        followUpButtons: data.followUpButtons,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "system",
          text: "Error de conexión con el servidor de demo.",
          timestamp: timeStr,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "16px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Header Estilo Abastible */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", background: "#FFFFFF", padding: "16px 20px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0, 51, 102, 0.05)", borderLeft: "6px solid #FF6600" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#003366", background: "rgba(0, 51, 102, 0.08)", padding: "3px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                DEMO MVP OPERATIVA ABASTIBLE
              </span>
            </div>
            <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#003366", margin: "4px 0 0 0" }}>
              Simulador Técnico Abastible (Respuestas Dinámicas por Cargo)
            </h1>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link href="/admin" style={{ background: "#003366", color: "#FFF", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", textDecoration: "none", fontWeight: "700" }}>
              Portal Admin
            </Link>
          </div>
        </header>

        {/* Layout Grid 2 Columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "20px" }}>
          
          {/* Left Panel: Whitelist y Consultas Rápidas por Rol */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserCheck size={16} color="#FF6600" /> Seleccionar Técnico / Rol Abastible
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              {MOCK_TECHNICIANS.map((tech) => {
                const isSelected = selectedTech.id === tech.id;
                return (
                  <button
                    key={tech.id}
                    type="button"
                    onClick={() => {
                      setSelectedTech(tech);
                      setMessages([
                        {
                          id: Date.now().toString(),
                          sender: "system",
                          text: `Cambiaste a ${tech.name} (${tech.displayRole}). Preguntas sugeridas actualizadas a su especialidad.`,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        },
                      ]);
                    }}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: isSelected ? "2px solid #FF6600" : "1px solid #E2E8F0",
                      background: isSelected ? "#FFF7ED" : "#F8FAFC",
                      color: "#0F172A",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                  >
                    <div style={{ fontWeight: "700", fontSize: "13px", color: isSelected ? "#003366" : "#1E293B" }}>{tech.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{tech.displayRole}</div>
                    <div style={{ fontSize: "10.5px", fontWeight: "700", color: tech.isAuth ? "#059669" : "#DC2626", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      {tech.isAuth ? <ShieldCheck size={12} /> : <AlertCircle size={12} />} {tech.isAuth ? "Autorizado Whitelist" : "Sin Autorización (No Whitelist)"}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Consultas Recomendadas por Cargo */}
            <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#003366", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FileText size={15} color="#FF6600" /> Consultas de su Cargo:
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeRoleConfig.presetQueries.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(preset)}
                  disabled={loading}
                  style={{
                    textAlign: "left",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "#F1F5F9",
                    border: "1px solid #CBD5E1",
                    color: "#334155",
                    fontSize: "12px",
                    cursor: "pointer",
                    lineHeight: "1.4",
                    fontWeight: "500"
                  }}
                >
                  "{preset}"
                </button>
              ))}
            </div>

          </div>

          {/* Right Panel: Chat Simulator */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", display: "flex", flexDirection: "column", height: "680px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            
            {/* Chat Header */}
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#003366", borderTopLeftRadius: "13px", borderTopRightRadius: "13px", color: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FF6600", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>Copilot Técnico Abastible</div>
                  <div style={{ fontSize: "11.5px", color: "#93C5FD" }}>
                    Técnico: <strong style={{ color: "#FFF" }}>{selectedTech.name}</strong> ({selectedTech.displayRole})
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", background: selectedTech.isAuth ? "#D1FAE5" : "#FEE2E2", color: selectedTech.isAuth ? "#065F46" : "#991B1B", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
                {selectedTech.isAuth ? "✓ AUTORIZADO" : "⛔ NO AUTORIZADO"}
              </span>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "14px", background: "#F8FAFC" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : msg.sender === "bot" ? "flex-start" : "center",
                    maxWidth: msg.sender === "system" ? "100%" : "82%",
                  }}
                >
                  {msg.sender === "system" ? (
                    <div style={{ background: "#E2E8F0", padding: "8px 16px", borderRadius: "18px", fontSize: "11.5px", color: "#475569", textAlign: "center", border: "1px solid #CBD5E1" }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        background: msg.sender === "user" ? "#003366" : "#FFFFFF",
                        color: msg.sender === "user" ? "#FFFFFF" : "#0F172A",
                        border: msg.sender === "bot" ? "1px solid #E2E8F0" : "none",
                        boxShadow: msg.sender === "bot" ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        fontSize: "13.5px"
                      }}
                    >
                      {msg.text.split("\n").map((line, lineIdx) => {
                        const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
                        return (
                          <div key={lineIdx} style={{ marginBottom: line.trim() === "" ? "8px" : "4px" }}>
                            {parts.map((part, partIdx) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                return <strong key={partIdx} style={{ color: "#003366" }}>{part.slice(2, -2)}</strong>;
                              }
                              if (part.startsWith("*") && part.endsWith("*")) {
                                return <em key={partIdx} style={{ fontStyle: "italic" }}>{part.slice(1, -1)}</em>;
                              }
                              return part;
                            })}
                          </div>
                        );
                      })}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "10px", opacity: 0.85 }}>
                        <span>{msg.timestamp}</span>
                        {msg.intent && (
                          <span style={{
                            background: msg.intent === "escalation" ? "#FEF2F2" : msg.intent === "incident_report" ? "#ECFDF5" : "#EFF6FF",
                            color: msg.intent === "escalation" ? "#DC2626" : msg.intent === "incident_report" ? "#065F46" : "#1D4ED8",
                            border: msg.intent === "escalation" ? "1px solid #FCA5A5" : msg.intent === "incident_report" ? "1px solid #6EE7B7" : "1px solid #BFDBFE",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "9.5px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}>
                            {msg.intent === "query" && "📚 CONSULTA TÉCNICA (RAG)"}
                            {msg.intent === "escalation" && "🚨 ALERTA ESCALADA A SUPERVISOR"}
                            {msg.intent === "incident_report" && "✅ INCIDENCIA REGISTRADA EN DB"}
                            {msg.intent === "unauthorized" && "⛔ SIN AUTORIZACIÓN"}
                          </span>
                        )}
                      </div>


                      {msg.sender === "bot" && (msg.followUpButtons || msg.intent === "query") && (
                        <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px dashed #E2E8F0", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {msg.followUpButtons && msg.followUpButtons.length > 0 ? (
                            msg.followUpButtons.map((btn, bIdx) => (
                              <button
                                key={bIdx}
                                type="button"
                                onClick={() => handleSendMessage(btn.query)}
                                style={{
                                  background: btn.query.includes("🚨") || btn.query.includes("urgente") ? "#EF4444" : btn.query.includes("OK") || btn.query.includes("correctamente") ? "#10B981" : "#003366",
                                  color: "#FFFFFF",
                                  border: "none",
                                  padding: "7px 13px",
                                  borderRadius: "8px",
                                  fontSize: "11.5px",
                                  fontWeight: "700",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                                }}
                              >
                                {btn.label}
                              </button>
                            ))
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSendMessage("✅ El sensor conmutó de 1 a 0 correctamente al tapar el tubing.")}
                                style={{ background: "#003366", color: "#FFF", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                              >
                                ▶️ Responder Lectura Sensor
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSendMessage("Completé la mantención preventiva sin fallas.")}
                                style={{ background: "#10B981", color: "#FFF", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}
                              >
                                ✅ Marcar Resuelto
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", padding: "12px 16px", background: "#FFFFFF", borderRadius: "10px", color: "#003366", fontSize: "12.5px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  <RefreshCw size={15} className="animate-spin" color="#FF6600" /> Buscando solución específica en la base de datos...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Chips (Dinámicos por Cargo del Técnico) */}
            <div style={{ padding: "10px 18px", background: "#FFFFFF", borderTop: "1px solid #F1F5F9" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Lightbulb size={13} color="#FF6600" /> Recomendaciones específicas para {selectedTech.displayRole}:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {activeRoleConfig.suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(chip.query)}
                    disabled={loading}
                    style={{
                      background: "#EFF6FF",
                      border: "1px solid #BFDBFE",
                      color: "#1E40AF",
                      padding: "6px 12px",
                      borderRadius: "16px",
                      fontSize: "11.5px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ padding: "12px 18px 16px 18px", background: "#FFFFFF", display: "flex", gap: "10px", borderBottomLeftRadius: "13px", borderBottomRightRadius: "13px" }}
            >
              <input
                type="text"
                placeholder="Escribe tu consulta o responde 1, 2 o 3..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                style={{
                  flex: 1,
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#0F172A",
                  fontSize: "13.5px",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                style={{
                  background: "#FF6600",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 22px",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "13.5px"
                }}
              >
                <Send size={15} /> Enviar
              </button>
            </form>

          </div>

        </div>

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
                  <li><strong>Prueba de Hermeticidad (Presostato 27):**</strong> Se genera una presión neumática para asegurar la estanqueidad. La estanqueidad es confirmada e indicada al PLC por el <strong>Presostato 27</strong>.</li>
                  <li><strong>Señal Eléctrica VAL2 (Llenado):**</strong> Cumplidas las 3 condiciones, VAL2 conmuta enviando aire a la válvula de corte GLP 1A y cabeza de llenado 162.</li>
                  <li><strong>Cierre de Llenado & Eyección (VAL3):**</strong> Al completar el peso, se corta la señal de VAL1/VAL2 y con la señal magnética la válvula VAL3 activa el cilindro 1B para la eyección.</li>
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
