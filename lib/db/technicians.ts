import { getNeonSql } from "./client";
import type { Technician } from "@/types";

const MOCK_TECHNICIANS: Technician[] = [
  {
    id: "tech-1",
    business_id: "mock-business-id-001",
    wa_phone: "+56912345678",
    full_name: "Juan Pérez (Técnico HVAC)",
    name: "Juan Pérez (Técnico HVAC)",
    role: "technician",
    is_active: true,
    notes: "Técnico Certificado SEC",
    created_at: new Date().toISOString(),
  },
  {
    id: "tech-2",
    business_id: "mock-business-id-001",
    wa_phone: "+56987654321",
    full_name: "Carlos Muñoz (Técnico Climatización)",
    name: "Carlos Muñoz (Técnico Climatización)",
    role: "technician",
    is_active: true,
    notes: "Técnico Certificado SEC",
    created_at: new Date().toISOString(),
  },
  {
    id: "tech-3",
    business_id: "mock-business-id-001",
    wa_phone: "+56900000001",
    full_name: "Pedro Soto (Supervisor)",
    name: "Pedro Soto (Supervisor)",
    role: "supervisor",
    is_active: true,
    notes: "Supervisor Abastible",
    created_at: new Date().toISOString(),
  },
];

export async function getTechnicianByPhone(phone: string, businessId: string): Promise<Technician | null> {
  try {
    const sql = getNeonSql();
    const rows = (await (sql as any)("SELECT * FROM technicians WHERE wa_phone = $1 AND is_active = true LIMIT 1", [phone])) as any[];

    if (rows && rows.length > 0) {
      return rows[0] as Technician;
    }
  } catch (err) {
    console.warn("[Neon DB] Falling back to memory whitelist for phone:", phone);
  }

  // Fallback for demo/mock testing
  const found = MOCK_TECHNICIANS.find((t) => t.wa_phone === phone);
  return found || null;
}

export async function listTechnicians(businessId: string): Promise<Technician[]> {
  try {
    const sql = getNeonSql();
    const rows = (await (sql as any)("SELECT * FROM technicians WHERE business_id = $1", [businessId])) as any[];
    if (rows && rows.length > 0) return rows as Technician[];
  } catch (err) {
    console.warn("[Neon DB] Using mock technician list");
  }
  return MOCK_TECHNICIANS;
}
