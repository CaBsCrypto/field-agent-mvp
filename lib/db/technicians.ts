// ── FieldAgentMVP — Technician Whitelist & Google Drive Mock Sync ──────────
import type { Technician } from "@/types";

const MOCK_WHITELIST_TECHNICIANS: Array<{ name: string; wa_phone: string; role: string }> = [
  { name: "Administrador Real (MGC)", wa_phone: "56961857682", role: "administrator" },
  { name: "Juan Pérez (Técnico HVAC)", wa_phone: "56912345678", role: "technician" },
  { name: "Carlos Muñoz (Técnico Climatización)", wa_phone: "56987654321", role: "technician" },
  { name: "Pedro Soto (Supervisor)", wa_phone: "56900000001", role: "supervisor" },
];

export async function getTechnicianByPhone(phone: string, businessId?: string): Promise<Technician | null> {
  const cleanPhone = phone.replace(/\D/g, "");
  
  // 1. Check in-memory Whitelist simulation (Accepts test phones + predefined)
  const found = MOCK_WHITELIST_TECHNICIANS.find(t => t.wa_phone === cleanPhone || cleanPhone.endsWith(t.wa_phone!));
  if (found) {
    return {
      id: "tech_" + cleanPhone,
      business_id: businessId || "biz_abastible",
      name: found.name,
      full_name: found.name,
      wa_phone: cleanPhone,
      role: found.role as any || "technician",
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }

  // 2. Allow any tester phone passed via env or fallback for live demo testing
  if (process.env.ALLOW_ALL_TEST_PHONES === "true") {
    return {
      id: "tech_test_" + cleanPhone,
      business_id: businessId || "biz_abastible",
      name: `Técnico Autorizado (+${cleanPhone})`,
      full_name: `Técnico Autorizado (+${cleanPhone})`,
      wa_phone: cleanPhone,
      role: "technician",
      is_active: true,
      created_at: new Date().toISOString(),
    };
  }

  return null;
}

export async function addTechnicianToWhitelist(name: string, phone: string, role: string = "technician"): Promise<Technician> {
  const cleanPhone = phone.replace(/\D/g, "");
  const newTech = { name, wa_phone: cleanPhone, role };
  MOCK_WHITELIST_TECHNICIANS.push(newTech);

  return {
    id: "tech_" + cleanPhone,
    business_id: "biz_abastible",
    name,
    full_name: name,
    wa_phone: cleanPhone,
    role: role as any,
    is_active: true,
    created_at: new Date().toISOString(),
  };
}
