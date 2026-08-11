// ── WhatsApp Client — Soporta Meta Cloud API y Kapso.ai ─────────────────────

const META_BASE_URL = "https://graph.facebook.com/v21.0";
const KAPSO_BASE_URL = process.env.KAPSO_API_URL ?? "https://api.kapso.ai/v1";

/**
 * Send a plain text message to a WhatsApp number via Meta Cloud API or Kapso.ai.
 *
 * @param to            - E.164 format (ej: "56912345678" o "+56912345678")
 * @param text          - Message body text
 * @param accessToken   - Token de acceso (Meta Token o KAPSO_API_KEY)
 * @param phoneNumberId - Phone Number ID o Kapso Channel ID
 */
export async function sendTextMessage(
  to: string,
  text: string,
  accessToken: string,
  phoneNumberId: string
): Promise<void> {
  const isKapso = process.env.WHATSAPP_PROVIDER === "kapso" || accessToken.startsWith("kapso_");

  if (isKapso) {
    // 🟢 Envío a través de Kapso.ai API
    const kapsoKey = process.env.KAPSO_API_KEY || accessToken;
    const url = `${KAPSO_BASE_URL}/messages`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": kapsoKey,
      },
      body: JSON.stringify({
        channel_id: phoneNumberId || process.env.KAPSO_CHANNEL_ID,
        to: to.replace("+", ""),
        type: "text",
        text: text,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`[Kapso Client] API error ${res.status}: ${error}`);
    }
  } else {
    // 🔵 Envío directo a Meta Cloud API
    const url = `${META_BASE_URL}/${phoneNumberId}/messages`;
    const cleanTo = to.replace("+", "");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanTo,
        type: "text",
        text: { body: text, preview_url: false },
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`[WhatsApp Client] Meta API error ${res.status}: ${error}`);
    }
  }
}

/**
 * Send a template message to a WhatsApp number.
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  accessToken: string,
  phoneNumberId: string
): Promise<void> {
  const url = `${META_BASE_URL}/${phoneNumberId}/messages`;
  const cleanTo = to.replace("+", "");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanTo,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`[WhatsApp Client] Template API error ${res.status}: ${error}`);
  }
}
