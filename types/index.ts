/**
 * @file types/index.ts
 * @description Shared TypeScript interfaces for FieldAgentMVP.
 * All data shapes used across lib/db and API routes are defined here.
 */

// ─────────────────────────────────────────────
// Business
// ─────────────────────────────────────────────

/** A tenant / company registered on the platform. */
export interface Business {
  id: string;
  nombre: string;
  rubro: string | null;
  wa_phone_number_id: string;
  wa_access_token: string | null;
  gemini_api_key: string | null;
  is_active: boolean;
  plan: 'starter' | 'pro' | 'enterprise';
  created_at: string;
}

/** Per-tenant bot configuration. */
export interface BusinessConfig {
  id: string;
  business_id: string;
  nombre_bot: string;
  tono: string;
  horario: string | null;
  supervisor_phone: string | null;
  servicios: unknown[];
  faqs: unknown[];
  reglas_extra: string | null;
  ms_tenant_id: string | null;
  ms_client_id: string | null;
  ms_client_secret: string | null;
  ms_folder_id: string | null;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Technician
// ─────────────────────────────────────────────

/** A field technician or supervisor linked to a business. */
export interface Technician {
  id: string;
  business_id: string;
  /** WhatsApp phone in E.164 format, e.g. "+56912345678" */
  wa_phone: string;
  full_name: string | null;
  role: 'technician' | 'supervisor';
  is_active: boolean;
  notes: string | null;
  created_at: string;
}

/** Input payload for creating a new technician. */
export interface CreateTechnicianInput {
  business_id: string;
  wa_phone: string;
  full_name?: string;
  role?: 'technician' | 'supervisor';
  notes?: string;
}

// ─────────────────────────────────────────────
// Conversation
// ─────────────────────────────────────────────

/** A single message in the chat history. */
export interface BotMessage {
  role: 'user' | 'model';
  content: string;
  /** ISO-8601 timestamp, added automatically. */
  timestamp?: string;
}

/** A WhatsApp conversation thread. */
export interface Conversation {
  id: string;
  wa_phone: string;
  display_name: string | null;
  messages: BotMessage[];
  /** Current dialog stage, e.g. "greeting" | "collecting_info" | "resolved". */
  stage: string;
  business_id: string;
  last_message_at: string;
  created_at: string;
}

// ─────────────────────────────────────────────
// Incident
// ─────────────────────────────────────────────

/** A field incident / service ticket. */
export interface Incident {
  id: string;
  business_id: string;
  technician_id: string | null;
  /** WhatsApp phone that reported the incident. */
  wa_phone: string;
  address: string | null;
  equipment_code: string | null;
  fault_code: string | null;
  description: string;
  solution: string | null;
  status: 'open' | 'resolved' | 'escalated';
  escalated_to: string | null;
  agent_response: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Input payload for creating a new incident. */
export interface CreateIncidentInput {
  business_id: string;
  technician_id?: string;
  wa_phone: string;
  address?: string;
  equipment_code?: string;
  fault_code?: string;
  description: string;
  solution?: string;
  status?: 'open' | 'resolved' | 'escalated';
  escalated_to?: string;
  agent_response?: string;
}

/** Filters for listing incidents. */
export interface IncidentFilters {
  status?: 'open' | 'resolved' | 'escalated';
  technician_id?: string;
  wa_phone?: string;
  /** ISO date string — returns incidents created on or after this date. */
  from?: string;
  /** ISO date string — returns incidents created on or before this date. */
  to?: string;
}

// ─────────────────────────────────────────────
// KB Sync Log
// ─────────────────────────────────────────────

/** Log entry for Microsoft SharePoint knowledge-base sync. */
export interface KbSyncLog {
  id: string;
  business_id: string;
  ms_file_id: string;
  file_name: string;
  last_modified: string;
  synced_at: string;
  status: 'ok' | 'error';
  error_message: string | null;
}
