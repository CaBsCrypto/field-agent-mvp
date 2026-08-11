import { getNeonSql } from './client';
import type { Business, BusinessConfig } from '@/types';

const MOCK_BUSINESS: Business = {
  id: "mock-business-id-001",
  nombre: "TechServ Chile S.A. (Abastible)",
  rubro: "Gas & Climatización",
  wa_phone_number_id: "TEST_PHONE_ID_123",
  wa_access_token: null,
  gemini_api_key: null,
  is_active: true,
  plan: "enterprise",
  created_at: new Date().toISOString(),
};

const MOCK_CONFIG: BusinessConfig = {
  id: "mock-config-id-001",
  business_id: "mock-business-id-001",
  nombre_bot: "Copilot Técnico Abastible",
  bot_name: "Copilot Técnico Abastible",
  tono: "técnico y preciso",
  tone: "técnico y preciso",
  horario: "Lunes a Viernes 8am-7pm",
  knowledge_base_path: null,
  supervisor_phone: "+56900000001",
  servicios: [],
  faqs: [],
  reglas_extra: "Normativa SEC Chile GLP",
  updated_at: new Date().toISOString(),
};

export async function getBusinessByPhoneNumberId(phoneNumberId: string): Promise<Business | null> {
  try {
    const sql = getNeonSql();
    const rows = (await (sql as any)("SELECT * FROM businesses WHERE wa_phone_number_id = $1 LIMIT 1", [phoneNumberId])) as any[];
    if (rows && rows.length > 0) return rows[0] as Business;
  } catch (err) {
    console.warn("[Neon DB] Using mock business fallback");
  }
  return MOCK_BUSINESS;
}

export async function getBusinessConfig(businessId: string): Promise<BusinessConfig | null> {
  try {
    const sql = getNeonSql();
    const rows = (await (sql as any)("SELECT * FROM business_configs WHERE business_id = $1 LIMIT 1", [businessId])) as any[];
    if (rows && rows.length > 0) return rows[0] as BusinessConfig;
  } catch (err) {
    console.warn("[Neon DB] Using mock config fallback");
  }
  return MOCK_CONFIG;
}
