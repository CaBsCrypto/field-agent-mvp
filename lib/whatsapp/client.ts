// ── Meta WhatsApp Business Cloud API — outgoing message client ────────────────

const BASE_URL = "https://graph.facebook.com/v21.0";

/**
 * Send a plain text message to a WhatsApp number.
 *
 * @param to            - E.164 format WITHOUT the +, e.g. "5491155556666"
 * @param text          - Message body text
 * @param accessToken   - Meta permanent access token
 * @param phoneNumberId - WhatsApp Business Phone Number ID
 */
export async function sendTextMessage(
  to: string,
  text: string,
  accessToken: string,
  phoneNumberId: string
): Promise<void> {
  const url = `${BASE_URL}/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: text, preview_url: false },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`[WhatsApp Client] Meta API error ${res.status}: ${error}`);
  }
}

/**
 * Send a template message to a WhatsApp number.
 * Stub implementation — extend with full template parameters as needed.
 *
 * @param to             - E.164 format WITHOUT the +
 * @param templateName   - Name of the approved Meta template
 * @param languageCode   - Language code e.g. "es_MX", "en_US"
 * @param accessToken    - Meta permanent access token
 * @param phoneNumberId  - WhatsApp Business Phone Number ID
 */
export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string,
  accessToken: string,
  phoneNumberId: string
): Promise<void> {
  const url = `${BASE_URL}/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
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
