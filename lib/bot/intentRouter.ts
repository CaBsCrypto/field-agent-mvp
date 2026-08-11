// ── FieldAgentMVP — Intent classifier using Gemini (temp=0) ─────────────────
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { BotMessage } from "@/types/bot";

/** The possible intents a technician message can have */
export type Intent = "query" | "incident_report" | "escalation" | "unknown";

const CLASSIFIER_SYSTEM_PROMPT = `
You are an intent classifier for a field technician WhatsApp bot.
Classify the technician message into exactly ONE of these intents:

- query: A technical question asking for help or information.
  Examples: "como arreglo X", "que significa error Y", "cual es el procedimiento para Z", "como se instala", "que hago si..."

- incident_report: Registering completed work or reporting a fault/incident.
  Examples: "termine la instalacion", "registrar incidencia", "listo el trabajo en calle X", "cambie el equipo con codigo Y", "complete la reparacion"

- escalation: Needs urgent supervisor help or is in a dangerous/blocked situation.
  Examples: "no se que hacer", "necesito ayuda urgente", "situacion de peligro", "escalar", "necesito a mi supervisor", "estoy bloqueado"

- unknown: Greeting, irrelevant message, or cannot be classified.
  Examples: "hola", "gracias", "ok", thumbs up emoji, random text

Respond with ONLY the intent word, nothing else. No explanation, no punctuation.
`.trim();

function getGeminiClient(apiKeyOverride?: string): GoogleGenerativeAI {
  const key = apiKeyOverride ?? process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

/**
 * Classify the intent of a technician message using Gemini with temperature=0.
 *
 * @param message             - The technician incoming message
 * @param conversationHistory - Recent conversation history for context
 * @param apiKeyOverride      - Optional per-business Gemini API key
 * @returns The classified Intent
 */
export async function classifyIntent(
  message: string,
  conversationHistory: BotMessage[],
  apiKeyOverride?: string
): Promise<Intent> {
  try {
    const client = getGeminiClient(apiKeyOverride);
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: CLASSIFIER_SYSTEM_PROMPT,
      generationConfig: { temperature: 0, maxOutputTokens: 10 },
    });

    // Include last 3 messages as context
    const recentHistory = conversationHistory
      .slice(-3)
      .map((m) => `${m.role === "user" ? "Technician" : "Bot"}: ${m.content}`)
      .join("\n");

    const contextualMessage = recentHistory
      ? `Recent context:\n${recentHistory}\n\nNew message to classify: ${message}`
      : `Message to classify: ${message}`;

    const result = await model.generateContent(contextualMessage);
    const raw = result.response.text().trim().toLowerCase();

    const validIntents: Intent[] = ["query", "incident_report", "escalation", "unknown"];
    return validIntents.includes(raw as Intent) ? (raw as Intent) : "unknown";
  } catch (err) {
    console.error("[intentRouter] classifyIntent error:", err);
    return "unknown";
  }
}
