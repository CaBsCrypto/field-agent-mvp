"use client";

import { useState } from "react";
import { Send, Bot, UserCheck, FileText, RefreshCw, ShieldCheck, CheckCircle, AlertCircle, Lightbulb, Menu, X } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  intent?: string;
}

const MOCK_TECHNICIANS = [
  { name: "Juan Pérez (Técnico HVAC)", phone: "+56912345678", role: "Técnico Registrado" },
  { name: "Carlos Muñoz (Climatización)", phone: "+56987654321", role: "Técnico Registrado" },
  { name: "Pedro Soto (Supervisor)", phone: "+56900000001", role: "Supervisor" },
];

const SUGGESTED_CHIPS = [
  { label: "📍 Distancias SEC 45kg", query: "¿Cuáles son las distancias mínimas de seguridad para un cilindro de 45 kg según la SEC?" },
  { label: "⛽ Límite Estanque Granel", query: "¿Cuál es el porcentaje máximo de llenado permitido para un estanque de GLP a granel?" },
  { label: "📋 Formulario TC11 SEC", query: "¿Cuándo se requiere la declaración con Formulario TC11?" },
  { label: "🛠️ Error E-VRP-01 Fuga Válvula", query: "¿Cómo solucionar el error E-VRP-01 de escape continuo en la válvula de seguridad?" },
];

export default function DemoSimulatorPage() {
  const [selectedTech, setSelectedTech] = useState(MOCK_TECHNICIANS[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      text: "Asistente Técnico Abastible listo. Selecciona una pregunta rápida o escribe tu consulta.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfigMobile, setShowConfigMobile] = useState(false);

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
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "12px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Header Estilo Microsoft / Abastible Adaptado a Mobile */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", background: "#FFFFFF", padding: "14px 16px", borderRadius: "12px", boxShadow: "0 2px 10px rgba(0, 51, 102, 0.05)", borderLeft: "5px solid #FF6600" }}>
          <div>
            <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#003366", background: "rgba(0, 51, 102, 0.08)", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
              DEMO TECNICA ABASTIBLE
            </span>
            <h1 style={{ fontSize: "16px", fontWeight: "700", color: "#003366", margin: "4px 0 0 0" }}>
              Centro de Validación en Terreno
            </h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/admin" style={{ background: "#003366", color: "#FFF", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", textDecoration: "none", fontWeight: "700" }}>
              Portal Admin
            </Link>
            <button
              type="button"
              onClick={() => setShowConfigMobile(!showConfigMobile)}
              style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", padding: "6px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}
            >
              {showConfigMobile ? <X size={14} /> : <Menu size={14} />} Config
            </button>
          </div>
        </header>

        {/* Dynamic Responsive Layout */}
        <div className="demo-responsive-grid" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          {/* Mobile Config Drawer / Toggle */}
          {showConfigMobile && (
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "14px", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#003366", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                <UserCheck size={15} color="#FF6600" /> Seleccionar Técnico Simulado
              </h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {MOCK_TECHNICIANS.map((tech) => {
                  const isSelected = selectedTech.phone === tech.phone;
                  return (
                    <button
                      key={tech.phone}
                      type="button"
                      onClick={() => {
                        setSelectedTech(tech);
                        setShowConfigMobile(false);
                      }}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: isSelected ? "2px solid #FF6600" : "1px solid #CBD5E1",
                        background: isSelected ? "#FFF7ED" : "#F8FAFC",
                        color: "#0F172A",
                        fontSize: "11.5px",
                        fontWeight: "600"
                      }}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Main Chat Box Mobile-First Design */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: "500px", boxShadow: "0 2px 12px rgba(0,0,0,0.03)" }}>
            
            {/* Chat Top Header */}
            <div style={{ padding: "12px 16px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#003366", borderTopLeftRadius: "13px", borderTopRightRadius: "13px", color: "#FFFFFF" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#FF6600", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "14px" }}>Copilot Técnico Abastible</div>
                  <div style={{ fontSize: "11px", color: "#93C5FD" }}>
                    Técnico: <strong style={{ color: "#FFF" }}>{selectedTech.name}</strong>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "10px", background: "#D1FAE5", color: "#065F46", padding: "3px 8px", borderRadius: "10px", fontWeight: "700" }}>
                ✓ ACTIVO
              </span>
            </div>

            {/* Scrollable Messages Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "12px", background: "#F8FAFC" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === "user" ? "flex-end" : msg.sender === "bot" ? "flex-start" : "center",
                    maxWidth: msg.sender === "system" ? "100%" : "88%",
                  }}
                >
                  {msg.sender === "system" ? (
                    <div style={{ background: "#E2E8F0", padding: "6px 14px", borderRadius: "16px", fontSize: "11px", color: "#475569", textAlign: "center", border: "1px solid #CBD5E1" }}>
                      {msg.text}
                    </div>
                  ) : (
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        background: msg.sender === "user" ? "#003366" : "#FFFFFF",
                        color: msg.sender === "user" ? "#FFFFFF" : "#0F172A",
                        border: msg.sender === "bot" ? "1px solid #E2E8F0" : "none",
                        boxShadow: msg.sender === "bot" ? "0 2px 6px rgba(0,0,0,0.03)" : "none",
                        lineHeight: "1.5",
                        whiteSpace: "pre-wrap",
                        fontSize: "13px"
                      }}
                    >
                      {msg.text}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", fontSize: "9.5px", opacity: 0.8 }}>
                        <span>{msg.timestamp}</span>
                        {msg.intent && (
                          <span style={{ background: "#FF6600", color: "#FFF", padding: "1px 5px", borderRadius: "3px", fontWeight: "700" }}>
                            {msg.intent.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div style={{ alignSelf: "flex-start", padding: "10px 14px", background: "#FFFFFF", borderRadius: "10px", color: "#003366", fontSize: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600" }}>
                  <RefreshCw size={14} className="animate-spin" color="#FF6600" /> Buscando fallas en manuales Abastible...
                </div>
              )}
            </div>

            {/* Quick Chips Bar (Mobile Optimized Horizontal Scroll) */}
            <div style={{ padding: "8px 12px", background: "#FFFFFF", borderTop: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px" }}>
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
                      padding: "5px 10px",
                      borderRadius: "14px",
                      fontSize: "11px",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      flexShrink: 0
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Fixed Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ padding: "10px 12px 12px 12px", background: "#FFFFFF", display: "flex", gap: "8px", borderBottomLeftRadius: "13px", borderBottomRightRadius: "13px" }}
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
                  padding: "10px 12px",
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
                  padding: "0 16px",
                  color: "#FFFFFF",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Send size={16} />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
