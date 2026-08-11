// ── FieldAgentMVP — Escalation handler ───────────────────────────────────────
import { sendTextMessage } from "@/lib/whatsapp/client";
import { saveIncident } from "@/lib/db/incidents";
import type { Technician } from "@/types/bot";

/**
 * Handle an escalation: notify supervisor via WhatsApp and save escalated incident.
 *
 * @param message         - The technician message that triggered escalation
 * @param technician      - The authenticated technician
 * @param supervisorPhone - Supervisor phone number (E.164 without +)
 * @param businessId      - UUID of the business
 * @param accessToken     - Meta access token for sending WhatsApp messages
 * @param phoneNumberId   - WhatsApp Business Phone Number ID
 * @returns Response text to send back to the technician
 */
export async function handleEscalation(
  message: string,
  technician: Technician,
  supervisorPhone: string,
  businessId: string,
  accessToken: string,
  phoneNumberId: string
): Promise<string> {
  try {
    // 1. Notify supervisor via WhatsApp
    const supervisorMessage =
      `ESCALACION: El tecnico ${technician.name} (+${technician.wa_phone}) necesita ayuda.\n\n` +
      `Ultimo mensaje: "${message.substring(0, 200)}"`;

    try {
      await sendTextMessage(supervisorPhone, supervisorMessage, accessToken, phoneNumberId);
      console.log(`[escalationHandler] Supervisor notified at +${supervisorPhone}`);
    } catch (waErr) {
      console.error("[escalationHandler] Failed to notify supervisor via WhatsApp:", waErr);
      // Continue — still save incident and respond to technician
    }

    // 2. Save escalated incident record
    try {
      await saveIncident({
        business_id: businessId,
        technician_id: technician.id,
        technician_phone: technician.wa_phone,
        address: null,
        equipment_code: null,
        fault_code: null,
        description: `Escalacion solicitada por ${technician.name}`,
        solution: null,
        status: "escalated",
        raw_message: message,
      });
    } catch (dbErr) {
      console.error("[escalationHandler] Failed to save escalated incident:", dbErr);
    }

    // 3. Respond to technician
    return (
      "Entendido. Tu supervisor fue notificado y te contactara pronto.\n\n" +
      "Por favor *mantente en el lugar* y espera el contacto. " +
      "Si la situacion es peligrosa, llama al numero de emergencias de tu empresa."
    );
  } catch (err) {
    console.error("[escalationHandler] handleEscalation unexpected error:", err);
    return (
      "Hubo un problema al notificar a tu supervisor.\n\n" +
      "Por favor llama directamente a tu supervisor o al numero de emergencias de la empresa."
    );
  }
}
