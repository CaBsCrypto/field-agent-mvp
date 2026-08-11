// ── FieldAgentMVP — Main bot orchestrator ────────────────────────────────────
import { sendTextMessage } from "@/lib/whatsapp/client";
import { getBusinessByPhoneNumberId, getBusinessConfig } from "@/lib/db/businesses";
import { getTechnicianByPhone } from "@/lib/db/technicians";
import { getOrCreateConversation, appendMessage } from "@/lib/db/conversations";
import { classifyIntent } from "@/lib/bot/intentRouter";
import { handleQuery } from "@/lib/bot/queryHandler";
import { handleIncidentReport } from "@/lib/bot/incidentHandler";
import { handleEscalation } from "@/lib/bot/escalationHandler";
import type { BotMessage, BusinessConfig } from "@/types/bot";

/**
 * Process an incoming WhatsApp message end-to-end.
 * Entry point called by the webhook route after signature verification.
 *
 * @param from          - Technician WhatsApp phone (E.164 without +)
 * @param messageText   - Plain text content of the message
 * @param phoneNumberId - WhatsApp Business Phone Number ID (identifies the business)
 */
export async function processMessage(
  from: string,
  messageText: string,
  phoneNumberId: string
): Promise<void> {
  // 1. Identify the business by phone number ID
  const business = await getBusinessByPhoneNumberId(phoneNumberId);
  if (!business) {
    console.error(`[handler] No active business found for phoneNumberId=${phoneNumberId}`);
    return;
  }

  const accessToken =
    business.wa_access_token ?? process.env.WHATSAPP_ACCESS_TOKEN ?? "";

  // 2. Check authorization — only registered technicians can use the system
  const technician = await getTechnicianByPhone(from, business.id);
  if (!technician) {
    console.warn(`[handler] Unauthorized sender: +${from} for business=${business.id}`);
    try {
      await sendTextMessage(
        from,
        "No autorizado. Solo tecnicos registrados pueden usar este sistema.",
        accessToken,
        phoneNumberId
      );
    } catch (err) {
      console.error("[handler] Failed to send unauthorized message:", err);
    }
    return;
  }

  // 3. Get or create conversation session
  const conversation = await getOrCreateConversation(from, business.id);
  const history: BotMessage[] = conversation.messages ?? [];

  // 4. Persist incoming user message
  const userMessage: BotMessage = {
    role: "user",
    content: messageText,
    timestamp: new Date().toISOString(),
  };
  await appendMessage(conversation.id, userMessage);

  // 5. Classify intent using Gemini (temp=0)
  const intent = await classifyIntent(
    messageText,
    history,
    business.gemini_api_key ?? undefined
  );
  console.log(
    `[handler] +${from} | intent="${intent}" | msg="${messageText.substring(0, 60)}"`
  );

  // 6. Load business config (with sensible defaults as fallback)
  const businessConfig = await getBusinessConfig(business.id);
  const config: BusinessConfig = businessConfig ?? {
    id: business.id,
    business_id: business.id,
    bot_name: "Agente",
    tone: "profesional y claro",
    knowledge_base_path: null,
  };

  // 7. Route to the appropriate handler
  let responseText: string;

  switch (intent) {
    case "query": {
      responseText = await handleQuery(messageText, technician, history, config);
      break;
    }

    case "incident_report": {
      const { response } = await handleIncidentReport(
        messageText,
        technician,
        history,
        business.id
      );
      responseText = response;
      break;
    }

    case "escalation": {
      const supervisorPhone = business.supervisor_phone;
      if (!supervisorPhone) {
        responseText =
          "No hay un supervisor configurado para escalar.\n\n" +
          "Por favor contacta directamente a tu empresa.";
      } else {
        responseText = await handleEscalation(
          messageText,
          technician,
          supervisorPhone,
          business.id,
          accessToken,
          phoneNumberId
        );
      }
      break;
    }

    case "unknown":
    default: {
      responseText =
        "Hola! Soy tu asistente de campo. Puedo ayudarte con:\n\n" +
        "- Consultas tecnicas: preguntame sobre procedimientos o equipos\n" +
        "- Registrar trabajo: dime que trabajo completaste\n" +
        '- Escalar: escribe "necesito ayuda" si necesitas a tu supervisor';
      break;
    }
  }

  // 8. Send response to technician
  try {
    await sendTextMessage(from, responseText, accessToken, phoneNumberId);
  } catch (err) {
    console.error("[handler] Failed to send response to +${from}:", err);
    return;
  }

  // 9. Persist bot response
  await appendMessage(conversation.id, {
    role: "model",
    content: responseText,
    timestamp: new Date().toISOString(),
  });
}
