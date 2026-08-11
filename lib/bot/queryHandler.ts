// ── FieldAgentMVP — Technical query handler ───────────────────────────────────
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSemanticKnowledgeContext } from "@/lib/ai/vectorRAG";
import type { BotMessage, Technician, BusinessConfig } from "@/types/bot";

function getGeminiClient(apiKeyOverride?: string): GoogleGenerativeAI {
  const key = apiKeyOverride ?? process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

function buildTechnicianSystemPrompt(
  technician: Technician,
  config: BusinessConfig,
  knowledgeContext: string
): string {
  return `Eres un asistente tecnico de campo. Ayudas a tecnicos con consultas sobre procedimientos, equipos y resolucion de fallas.

Tecnico actual: ${technician.name} (telefono: +${technician.wa_phone})
Tono: ${config.tone}
Asistente: ${config.bot_name}

BASE DE CONOCIMIENTO:
${knowledgeContext}

INSTRUCCIONES:
- Responde de forma clara, concisa y practica usando el contexto de los manuales.
- Usa lenguaje tecnico pero accesible.
- Si el contexto no es suficiente, indicalo claramente.
- Usa emojis con moderacion (ej: checkmark para pasos, warning para advertencias).
- Responde siempre en espanol.
- Maximo 300 palabras por respuesta.`.trim();
}

/**
 * Handle a technical query from a field technician using semantic RAG.
 *
 * @param message        - The technician question
 * @param technician     - The authenticated technician record
 * @param history        - Conversation history
 * @param businessConfig - Business configuration
 * @returns The bot text response
 */
export async function handleQuery(
  message: string,
  technician: Technician,
  history: BotMessage[],
  businessConfig: BusinessConfig
): Promise<string> {
  try {
    // 1. Retrieve semantic context from knowledge base
    let knowledgeContext = "";
    try {
      knowledgeContext = await getSemanticKnowledgeContext(message, 3);
    } catch (ragErr) {
      console.error("[queryHandler] RAG error:", ragErr);
    }

    // 2. No useful context found -> guide to escalate
    if (!knowledgeContext || knowledgeContext.trim().length < 50) {
      return (
        "No encontre informacion especifica sobre eso en nuestros manuales. \u{1F4DA}\n\n" +
        'Te recomiendo escalar al supervisor escribiendo *"necesito ayuda"* para que te asistan directamente.'
      );
    }

    // 3. Build system prompt and generate reply
    const systemPrompt = buildTechnicianSystemPrompt(technician, businessConfig, knowledgeContext);
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
    });

    // Build Gemini-compatible history
    const geminiHistory = history.slice(-10).map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message);
    return result.response.text().trim();
  } catch (err) {
    console.error("[queryHandler] handleQuery error:", err);
    return (
      "Tuve un problema al procesar tu consulta. \u{1F527}\n\n" +
      'Por favor intenta de nuevo, o escribe *"necesito ayuda"* para contactar a tu supervisor.'
    );
  }
}
