// ── Meta WhatsApp HMAC-SHA256 webhook signature verification ──────────────────
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify a Meta WhatsApp webhook signature (X-Hub-Signature-256 header).
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * @param body      - Raw request body as string
 * @param signature - Value of the X-Hub-Signature-256 header ("sha256=<hex>")
 * @param appSecret - Your Meta App Secret
 * @returns true if the signature is valid
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  appSecret: string
): boolean {
  if (!signature || !appSecret) return false;

  // Meta sends "sha256=<hex>"
  const [algo, hex] = signature.split("=");
  if (algo !== "sha256" || !hex) return false;

  const expected = createHmac("sha256", appSecret)
    .update(body, "utf8")
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(hex, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
