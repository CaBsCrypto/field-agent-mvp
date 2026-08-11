// ── Meta WhatsApp Webhook — GET (verification) + POST (incoming messages) ─────
import { after } from "next/server";
import { verifyWebhookSignature } from "@/lib/whatsapp/verify";
import { processMessage } from "@/lib/bot/handler";
import type { WhatsAppWebhookPayload } from "@/lib/whatsapp/types";

// ── GET — Meta webhook verification challenge ─────────────────────────────────
export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);

  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  if (mode === "subscribe" && token === expectedToken && challenge) {
    console.log("[WhatsApp Webhook] Verification successful");
    return new Response(challenge, { status: 200 });
  }

  console.warn("[WhatsApp Webhook] Verification failed", { mode, token });
  return new Response("Forbidden", { status: 403 });
}

// ── POST — Incoming messages ──────────────────────────────────────────────────
// IMPORTANT: Always respond 200 to Meta to prevent retries.
// Processing happens asynchronously via next/server after().
export async function POST(request: Request): Promise<Response> {
  // 1. Read raw body for HMAC verification (before any parsing)
  let rawBody: Buffer;
  try {
    rawBody = Buffer.from(await request.arrayBuffer());
  } catch (err) {
    console.error("[WhatsApp Webhook] Failed to read body:", err);
    return new Response("OK", { status: 200 }); // Always 200 to Meta
  }

  // 2. Verify HMAC-SHA256 signature
  const signature = request.headers.get("x-hub-signature-256") ?? "";
  const appSecret = process.env.WHATSAPP_APP_SECRET ?? "";

  if (!verifyWebhookSignature(rawBody.toString("utf-8"), signature, appSecret)) {
    console.warn("[WhatsApp Webhook] Invalid HMAC signature");
    return new Response("Forbidden", { status: 403 });
  }

  // 3. Parse JSON payload
  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody.toString("utf-8")) as WhatsAppWebhookPayload;
  } catch (err) {
    console.error("[WhatsApp Webhook] Failed to parse JSON:", err);
    return new Response("OK", { status: 200 }); // Always 200 to Meta
  }

  // 4. Only process whatsapp_business_account events
  if (payload.object !== "whatsapp_business_account") {
    return new Response("OK", { status: 200 });
  }

  // 5. Acknowledge Meta immediately (<5s) — process async
  after(async () => {
    try {
      await handlePayload(payload);
    } catch (err) {
      console.error("[WhatsApp Webhook] handlePayload error:", err);
    }
  });

  return new Response("OK", { status: 200 });
}

// ── Internal: iterate over entries and dispatch to processMessage ─────────────
async function handlePayload(payload: WhatsAppWebhookPayload): Promise<void> {
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;

      // Skip status updates and non-message events
      if (!value.messages?.length) continue;

      const phoneNumberId = value.metadata?.phone_number_id;
      if (!phoneNumberId) {
        console.warn("[WhatsApp Webhook] Missing phone_number_id in metadata");
        continue;
      }

      for (const message of value.messages) {
        // Only handle text messages for now
        if (message.type !== "text" || !message.text?.body) {
          console.log(`[WhatsApp Webhook] Skipping message type: ${message.type}`);
          continue;
        }

        const from = message.from;
        const messageText = message.text.body.trim();
        if (!messageText) continue;

        console.log(
          `[WhatsApp Webhook] +${from} on ${phoneNumberId}: "${messageText.substring(0, 60)}"`
        );

        try {
          await processMessage(from, messageText, phoneNumberId);
        } catch (err) {
          console.error(`[WhatsApp Webhook] processMessage error for +${from}:`, err);
          // Continue processing other messages even if one fails
        }
      }
    }
  }
}
