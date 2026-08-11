export interface Technician {
  id: string;
  business_id: string;
  wa_phone: string; // "+56912345678"
  full_name: string | null;
  name: string; // Mandatory for bot handlers
  role: 'technician' | 'supervisor';
  is_active: boolean;
  notes?: string | null;
  created_at: string;
}

export interface Incident {
  id: string;
  business_id: string;
  technician_id: string | null;
  wa_phone: string;
  address: string | null;
  equipment_code: string | null;
  fault_code: string | null;
  description: string;
  solution: string | null;
  status: 'open' | 'resolved' | 'escalated';
  escalated_to: string | null;
  agent_response: string | null;
  created_at: string;
}

export interface BotMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  wa_phone: string;
  messages: BotMessage[];
  stage: string;
  business_id: string;
  last_message_at: string;
}

export interface Business {
  id: string;
  nombre: string;
  wa_phone_number_id: string;
  wa_access_token: string | null;
  supervisor_phone?: string | null;
  gemini_api_key: string | null;
  is_active: boolean;
  plan?: string;
  rubro?: string;
  created_at?: string;
}

export interface BusinessConfig {
  id: string;
  business_id: string;
  nombre_bot: string;
  bot_name: string; // Mandatory for bot handlers
  tono: string;
  tone: string; // Mandatory for bot handlers
  horario?: string;
  knowledge_base_path: string | null;
  supervisor_phone?: string | null;
  servicios?: any[];
  faqs?: any[];
  reglas_extra?: string | null;
  ms_tenant_id?: string | null;
  ms_client_id?: string | null;
  ms_client_secret?: string | null;
  ms_folder_id?: string | null;
  updated_at?: string;
}
