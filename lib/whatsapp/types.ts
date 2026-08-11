// ── Meta WhatsApp Business Cloud API webhook payload types ────────────────────

export interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes: WhatsAppChange[];
}

export interface WhatsAppChange {
  value: WhatsAppChangeValue;
  field: string;
}

export interface WhatsAppChangeValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WhatsAppContact[];
  messages?: WhatsAppMessage[];
  statuses?: WhatsAppStatus[];
  errors?: WhatsAppError[];
}

export interface WhatsAppContact {
  profile: { name: string };
  wa_id: string;
}

export interface WhatsAppMessage {
  from: string;       // E.164 phone number without +
  id: string;         // Message ID (for deduplication)
  timestamp: string;  // Unix timestamp
  type: WhatsAppMessageType;
  text?: { body: string };
  image?: { id: string; mime_type: string; sha256: string; caption?: string };
  audio?: { id: string; mime_type: string };
  document?: { id: string; mime_type: string; filename?: string };
  interactive?: WhatsAppInteractive;
  button?: { payload: string; text: string };
  reaction?: { message_id: string; emoji: string };
}

export type WhatsAppMessageType =
  | "text"
  | "image"
  | "audio"
  | "document"
  | "interactive"
  | "button"
  | "reaction"
  | "unsupported";

export interface WhatsAppInteractive {
  type: "button_reply" | "list_reply";
  button_reply?: { id: string; title: string };
  list_reply?: { id: string; title: string; description?: string };
}

export interface WhatsAppStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: string;
  recipient_id: string;
}

export interface WhatsAppError {
  code: number;
  title: string;
  message: string;
  error_data?: { details: string };
}
