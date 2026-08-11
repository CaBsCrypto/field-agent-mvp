// ── FieldAgentMVP — Technicians DB (Supabase) ─────────────────────────────────
import { createClient } from "@supabase/supabase-js";
import type { Technician } from "@/types/bot";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  }
  return createClient(url, key);
}

/**
 * Look up an active technician by their WhatsApp phone number and business.
 *
 * @param waPhone    - E.164 phone number WITHOUT the +
 * @param businessId - UUID of the business this technician belongs to
 * @returns The Technician record, or null if not found / not authorized
 */
export async function getTechnicianByPhone(
  waPhone: string,
  businessId: string
): Promise<Technician | null> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("technicians")
      .select("*")
      .eq("wa_phone", waPhone)
      .eq("business_id", businessId)
      .eq("is_active", true)
      .limit(1)
      .single();

    if (error || !data) return null;
    return data as Technician;
  } catch (err) {
    console.error("[db/technicians] getTechnicianByPhone error:", err);
    return null;
  }
}
