/**
 * @file lib/ai/gemini.ts
 * Gemini AI client for FieldAgentMVP.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BotMessage, MessageIntent } from "@/types/agent";

const DEFAULT_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

let _defaultClient: GoogleGenerativeAI | null = null;

function getClient(apiKeyOverride?: string): GoogleGenerativeAI {
  if (apiKeyOverride) return new GoogleGenerativeAI(apiKeyOverride);
  if (_defaultClient) return _defaultClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY no configurada en .env.local");
  _defaultClient = new GoogleGenerativeAI(apiKey);
  return _defaultClient;
}

export async function generateReply(
  systemPrompt: string,
  messages: BotMessage[],
  apiKeyOverride?: string
): Promise<string> {
  const client = getClient(apiKeyOverride);
  const model = client.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction: systemPrompt,
    generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
  });
  let history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  while (history.length > 0 && history[0].role === "model") history.shift();
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== "user")
    throw new Error("[gemini] El ultimo mensaje debe ser del usuario.");
  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();
    if (!text) throw new Error("[gemini] Respuesta vacia del modelo.");
    return text;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`[gemini] Error al generar respuesta: ${msg}`);
  }
}

export async function classifyIntent(
  message: string,
  history: BotMessage[],
  apiKeyOverride?: string
): Promise<MessageIntent> {
  const client = getClient(apiKeyOverride);
  const model = client.getGenerativeModel({
    model: DEFAULT_MODEL,
    generationConfig: { maxOutputTokens: 10, temperature: 0.1 },
  });
  const recentHistory = history
    .slice(-5)
    .map((m) => `${m.role === "user" ? "TECNICO" : "AGENTE"}: ${m.content}`)
    .join("\n");
  const prompt = `Clasificador de intenciones para mensajes de tecnicos HVAC.
Categorias:
- query: pregunta tecnica sobre equipos, errores o procedimientos
- incident_report: reporte de falla activa o equipo que no funciona
- escalation: solicitud de supervisor, escalacion o pedido de autorizacion
- unknown: no encaja claramente

Responde SOLO con una de estas 4 palabras: query, incident_report, escalation, unknown

Historial:
${recentHistory}

Mensaje:
${message}`;
  try {
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim().toLowerCase();
    const valid: MessageIntent[] = ["query", "incident_report", "escalation", "unknown"];
    if (valid.includes(raw as MessageIntent)) return raw as MessageIntent;
    console.warn(`[gemini] classifyIntent valor inesperado: "${raw}". Fallback "unknown".`);
    return "unknown";
  } catch (err) {
    console.error("[gemini] Error al clasificar intent:", err);
    return "unknown";
  }
}
