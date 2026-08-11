// ── FieldAgentMVP — Incidents DB (Supabase) ───────────────────────────────────
import { createClient } from "@supabase/supabase-js";
import type { Incident } from "@/types/bot";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  }
  return createClient(url, key);
}

/**
 * Save a new incident report to the database.
 *
 * @param incident - Incident data without auto-generated fields
 * @returns The saved incident with generated ID, or null on failure
 */
export async function saveIncident(
  incident: Omit<Incident, "id" | "created_at" | "updated_at">
): Promise<Incident | null> {
  try {
    const supabase = getSupabase();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("incidents")
      .insert({ ...incident, created_at: now, updated_at: now })
      .select()
      .single();

    if (error) {
      console.error("[db/incidents] saveIncident error:", error);
      return null;
    }

    return data as Incident;
  } catch (err) {
    console.error("[db/incidents] saveIncident unexpected error:", err);
    return null;
  }
}

/**
 * Update the status of an existing incident.
 *
 * @param incidentId - UUID of the incident
 * @param status     - New status value
 */
export async function updateIncidentStatus(
  incidentId: string,
  status: Incident["status"]
): Promise<void> {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("incidents")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", incidentId);

    if (error) {
      console.error("[db/incidents] updateIncidentStatus error:", error);
    }
  } catch (err) {
    console.error("[db/incidents] updateIncidentStatus unexpected error:", err);
  }
}
