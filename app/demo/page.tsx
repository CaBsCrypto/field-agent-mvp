"use client";

import { useState } from "react";
import { Send, Bot, UserCheck, FileText, RefreshCw, ShieldCheck, CheckCircle, AlertCircle, Lightbulb, Zap, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  intent?: string;
}

const MOCK_TECHNICIANS = [
  { name: "Juan Pérez (Técnico HVAC)", phone: "+56912345678", role: "Técnico Registrado (Autorizado)" },
  { name: "Carlos Muñoz (Técnico Climatización)", phone: "+56987654321", role: "Técnico Registrado (Autorizado)" },
  { name: "Pedro Soto (Supervisor)", phone: "+56900000001", role: "Supervisor" },
  { name: "Usuario Desconocido", phone: "+56999999999", role: "Sin Autorización (No Whitelist)" },
];

const PRESET_QUERIES = [
  "¿Qué significa el error E-01 y cómo se soluciona?",
  "¿Cuáles son los pasos para la prueba de estanqueidad?",
  "Completé la instalación en Av. Providencia 1234, equipo HVAC-200, sin fallas.",
  "Tengo una fuga masiva de refrigerante R410A y no puedo contenerla, necesito ayuda urgente.",
];

const SUGGESTED_CHIPS = [
  { label: "📍 Distancias SEC Cilindros 45kg", query: "¿Cuáles son las distancias mínimas de seguridad para un cilindro de 45 kg según la SEC?" },
  { label: "⛽ Límite Llenado Estanque Granel", query: "¿Cuál es el porcentaje máximo de llenado permitido para un estanque de GLP a granel?" },
  { label: "📋 Formulario TC11 SEC", query: "¿Cuándo se requiere la declaración con Formulario TC11?" },
  { label: "🛠️ Error E-VRP-01 Fuga Válvula", query: "¿Cómo solucionar el error E-VRP-01 de escape continuo en la válvula de seguridad?" },
];

export default function DemoSimulatorPage() {
  const [selectedTech, setSelectedTech] = useState(MOCK_TECHNICIANS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "Sistema de Asistencia Técnica Abastible / Browns Studio inicializado. Selecciona un técnico, usa las sugerencias rápidas o escribe directamente.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

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
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "system",
          text: "Error de conexión con el simulador.",
          timestamp: timeStr,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Header Estilo Microsoft 365 / Abastible */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", background: "#FFFFFF", padding: "20px 28px", borderRadius: "14px", boxShadow: "0 4px 20px rgba(0, 51, 102, 0.06)", borderLeft: "6px solid #FF6600" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#003366", background: "rgba(0, 51, 102, 0.08)", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold" }}>
                MICROSOFT FLUENT + ABASTIBLE STYLE
              </span>
            </div>
            <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#003366", margin: "6px 0 0 0" }}>
              Centro de Validación de Procesos Técnicos en Terreno
            </h1>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", padding: "6px 14px", borderRadius: "20px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
              <CheckCircle size={14} /> Servidor Local Activo
            </span>
          </div>
        </header>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
          
          {/* Left Panel: Sidebar Config */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "20px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserCheck size={16} color="#FF6600" /> Whitelist de Técnicos
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {MOCK_TECHNICIANS.map((tech) => {
                const isSelected = selectedTech.phone === tech.phone;
                const isDenied = tech.role.includes("Sin");
                return (
                  <button
                    key={tech.phone}
                    type="button"
                    onClick={() => setSelectedTech(tech)}
                    style={{
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: isSelected ? "2px solid #FF6600" : "1px solid #E2E8F0",
                      background: isSelected ? "#FFF7ED" : "#F8FAFC",
                      color: "#0F172A",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <div style={{ fontWeight: "700", fontSize: "13px", color: isSelected ? "#003366" : "#1E293B" }}>{tech.name}</div>
                    <div style={{ fontSize: "11px", color: "#64748B", fontFamily: "monospace", marginTop: "2px" }}>{tech.phone}</div>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: isDenied ? "#DC2626" : "#059669", marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                      {isDenied ? <AlertCircle size={12} /> : <ShieldCheck size={12} />} {tech.role}
                    </div>
                  </button>
                );
              })}
            </div>

            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#003366", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <FileText size={16} color="#FF6600" /> Consultas Rápidas de Prueba
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {PRESET_QUERIES.map((preset, idx) => (
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

          {/* Right Panel: Chat Window */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", display: "flex", flexDirection: "column", height: "660px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            
            {/* Chat Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#003366", borderTopLeftRadius: "13px", borderTopRightRadius: "13px", color: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "38px", height: "38px", borderRadius: "8px", background: "#FF6600", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>Copilot Técnico Abastible</div>
                  <div style={{ fontSize: "12px", color: "#93C5FD" }}>
                    Técnico activo: <strong style={{ color: "#FFF" }}>{selectedTech.name}</strong>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px", background: selectedTech.role.includes("Sin") ? "#FEE2E2" : "#D1FAE5", color: selectedTech.role.includes("Sin") ? "#991B1B" : "#065F46", padding: "4px 10px", borderRadius: "12px", fontWeight: "700" }}>
                {selectedTech.role.includes("Sin") ? "⛔ NO AUTORIZADO" : "✓ ACCESO CONCEDIDO"}
              </span>
            </div>

            {/* Chat Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "16px", background: "#F8FAFC" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : msg.sender === "bot" ? "flex-start" : "center",
                    maxWidth: msg.sender === "system" ? "100%" : "78%",
                  }}
                >
                  {msg.sender === "system" ? (
                    <div style={{ background: "#E2E8F0", padding: "8px 18px", borderRadius: "20px", fontSize: "12px", color: "#475569", textAlign: "center", border: "1px solid #CBD5E1", fontWeight: "500" }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: msg.sender === "user" ? "#003366" : "#FFFFFF",
                        color: msg.sender === "user" ? "#FFFFFF" : "#0F172A",
                        border: msg.sender === "bot" ? "1px solid #E2E8F0" : "none",
                        boxShadow: msg.sender === "bot" ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        fontSize: "13.5px"
                      }}
                    >
                      {msg.text}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", fontSize: "10px", opacity: 0.85 }}>
                        <span>{msg.timestamp}</span>
                        {msg.intent && (
                          <span style={{ background: "#FF6600", color: "#FFF", padding: "2px 6px", borderRadius: "4px", fontWeight: "700" }}>
                            INTENT: {msg.intent.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", padding: "12px 18px", background: "#FFFFFF", borderRadius: "12px", color: "#003366", fontSize: "13px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
                  <RefreshCw size={16} className="animate-spin" color="#FF6600" /> Consultando manuales técnicos Abastible...
                </div>
              )}
            </div>

            {/* Suggested Chips Bar */}
            <div style={{ padding: "10px 20px 4px 20px", background: "#FFFFFF", borderTop: "1px solid #F1F5F9" }}>
              <div style={{ fontSize: "11px", fontWeight: "700", color: "#64748B", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
                <Lightbulb size={13} color="#FF6600" /> Recomendaciones sugeridas para el técnico:
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {SUGGESTED_CHIPS.map((chip, idx) => (
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
                      transition: "all 0.2s",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.03)"
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
              style={{ padding: "12px 20px 16px 20px", background: "#FFFFFF", display: "flex", gap: "12px", borderBottomLeftRadius: "13px", borderBottomRightRadius: "13px" }}
            >
              <textarea
                rows={1}
                placeholder="Escribe o pega una duda técnica o registro de incidencia..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={loading}
                style={{
                  flex: 1,
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  color: "#0F172A",
                  fontSize: "14px",
                  outline: "none",
                  resize: "none",
                  fontFamily: "inherit"
                }}
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                style={{
                  background: "#FF6600",
                  border: "none",
                  borderRadius: "8px",
                  padding: "0 24px",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px"
                }}
              >
                <Send size={16} /> Enviar
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
