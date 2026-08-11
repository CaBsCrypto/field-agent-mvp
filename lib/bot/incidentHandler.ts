// ── FieldAgentMVP — Incident report handler ───────────────────────────────────
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveIncident } from "@/lib/db/incidents";
import type { BotMessage, Technician, ExtractedIncidentData } from "@/types/bot";

function getGeminiClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

async function extractIncidentData(
  message: string,
  history: BotMessage[]
): Promise<ExtractedIncidentData> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 0, maxOutputTokens: 256 },
    });

    const recentContext = history
      .slice(-4)
      .map((m) => `${m.role === "user" ? "Tecnico" : "Bot"}: ${m.content}`)
      .join("\n");

    const prompt = `Extrae los datos de incidencia del mensaje de un tecnico de campo.
Devuelve SOLO un JSON valido con estos campos (usa null si no se menciona):
{
  "address": "direccion donde se realizo el trabajo o null",
  "equipment_code": "codigo o modelo del equipo o null",
  "fault_code": "codigo de falla o null",
  "description": "descripcion del problema o trabajo realizado",
  "solution": "solucion aplicada o null"
}

Contexto reciente:
${recentContext}

Mensaje del tecnico: "${message}"

Devuelve SOLO el JSON, sin texto adicional.`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};
    return JSON.parse(jsonMatch[0]) as ExtractedIncidentData;
  } catch (err) {
    console.error("[incidentHandler] extractIncidentData error:", err);
    return {};
  }
}

function getMissingFields(data: ExtractedIncidentData): string[] {
  const missing: string[] = [];
  if (!data.description) missing.push("descripcion del trabajo o falla");
  if (!data.address) missing.push("direccion o ubicacion del trabajo");
  return missing;
}

function buildFollowUpQuestion(missingFields: string[]): string {
  if (missingFields.length === 1) {
    return `Entendido. Para completar el registro, me puedes indicar ${missingFields[0]}?`;
  }
  return (
    `Entendido. Para completar el registro necesito un poco mas de info:\n\n` +
    missingFields.map((f, i) => `${i + 1}. ${f}`).join("\n") +
    "\n\nPuedes proporcionarme esos datos?"
  );
}

/**
 * Handle an incident report from a field technician.
 * Extracts structured data, asks follow-up questions if needed, then saves.
 *
 * @param message    - The technician message
 * @param technician - The authenticated technician
 * @param history    - Conversation history
 * @param businessId - UUID of the business
 * @returns Response text and whether the incident was saved
 */
export async function handleIncidentReport(
  message: string,
  technician: Technician,
  history: BotMessage[],
  businessId: string
): Promise<{ response: string; incidentSaved: boolean }> {
  try {
    const extracted = await extractIncidentData(message, history);
    const missingFields = getMissingFields(extracted);

    // Count prior follow-up questions (max 2)
    const followUpCount = history.filter(
      (m) => m.role === "model" && m.content.includes("Para completar el registro")
    ).length;

    if (missingFields.length > 0 && followUpCount < 2) {
      return { response: buildFollowUpQuestion(missingFields), incidentSaved: false };
    }

    // Save with whatever we have
    const allUserMessages = [...history, { role: "user" as const, content: message, timestamp: new Date().toISOString() }];
    const description =
      extracted.description ??
      allUserMessages
        .filter((m) => m.role === "user")
        .map((m) => m.content)
        .join(" | ");

    const saved = await saveIncident({
      business_id: businessId,
      technician_id: technician.id,
      technician_phone: technician.wa_phone,
      address: extracted.address ?? null,
      equipment_code: extracted.equipment_code ?? null,
      fault_code: extracted.fault_code ?? null,
      description,
      solution: extracted.solution ?? null,
      status: "closed",
      raw_message: message,
    });

    if (!saved) {
      return {
        response:
          "Hubo un problema al guardar la incidencia en el sistema.\n\nPor favor intenta nuevamente o contacta a tu supervisor.",
        incidentSaved: false,
      };
    }

    const summaryLines = [
      `Incidencia registrada correctamente (ID: ${saved.id?.slice(0, 8) ?? "N/A"})`,
      "",
      extracted.address ? `Ubicacion: ${extracted.address}` : null,
      extracted.equipment_code ? `Equipo: ${extracted.equipment_code}` : null,
      extracted.fault_code ? `Codigo de falla: ${extracted.fault_code}` : null,
      `Descripcion: ${description.substring(0, 100)}${description.length > 100 ? "..." : ""}`,
      extracted.solution ? `Solucion: ${extracted.solution}` : null,
    ].filter(Boolean).join("\n");

    return {
      response: summaryLines + "\n\nBuen trabajo!",
      incidentSaved: true,
    };
  } catch (err) {
    console.error("[incidentHandler] handleIncidentReport error:", err);
    return {
      response: "Ocurrio un error inesperado al procesar el reporte.\n\nPor favor intenta nuevamente o contacta a tu supervisor.",
      incidentSaved: false,
    };
  }
}
