// ── FieldAgentMVP — Core domain types ─────────────────────────────────────────

/** A single message in a conversation history */
export interface BotMessage {
  role: "user" | "model";
  content: string;
  timestamp: string; // ISO 8601
}

/** A field technician registered in the system */
export interface Technician {
  id: string;
  business_id: string;
  name: string;
  wa_phone: string; // E.164 without +
  is_active: boolean;
  created_at: string;
}

/** A business/company using the platform */
export interface Business {
  id: string;
  name: string;
  wa_phone_number_id: string;
  wa_access_token: string | null;
  supervisor_phone: string | null; // E.164 without + for escalations
  gemini_api_key: string | null;
  is_active: boolean;
  created_at: string;
}

/** Business-level configuration (prompts, tone, etc.) */
export interface BusinessConfig {
  id: string;
  business_id: string;
  bot_name: string;
  tone: string;
  knowledge_base_path: string | null;
}

/** A conversation session between a technician and the bot */
export interface Conversation {
  id: string; // Composite: {businessId}_{waPhone}
  business_id: string;
  wa_phone: string;
  messages: BotMessage[];
  last_message_at: string;
  created_at: string;
}

/** An incident report logged by a technician */
export interface Incident {
  id?: string;
  business_id: string;
  technician_id: string;
  technician_phone: string;
  address: string | null;
  equipment_code: string | null;
  fault_code: string | null;
  description: string;
  solution: string | null;
  status: "open" | "closed" | "escalated";
  raw_message: string;
  created_at?: string;
  updated_at?: string;
}

/** Partial incident data extracted from a technician message */
export interface ExtractedIncidentData {
  address?: string | null;
  equipment_code?: string | null;
  fault_code?: string | null;
  description?: string | null;
  solution?: string | null;
}
