// ── FieldAgentMVP — Conversations DB (Supabase) ───────────────────────────────
import { createClient } from "@supabase/supabase-js";
import type { BotMessage, Conversation } from "@/types/bot";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  }
  return createClient(url, key);
}

/** Deterministic composite ID for a conversation */
function makeConversationId(waPhone: string, businessId: string): string {
  return `${businessId}_${waPhone}`;
}

/**
 * Get an existing conversation or create one if it does not exist.
 *
 * @param waPhone    - Technician phone number (E.164 without +)
 * @param businessId - UUID of the business
 * @returns The Conversation record
 */
export async function getOrCreateConversation(
  waPhone: string,
  businessId: string
): Promise<Conversation> {
  const supabase = getSupabase();
  const id = makeConversationId(waPhone, businessId);

  // Try to fetch existing
  const { data: existing, error: fetchError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (!fetchError && existing) {
    return existing as Conversation;
  }

  // Create new
  const now = new Date().toISOString();
  const newConv: Conversation = {
    id,
    business_id: businessId,
    wa_phone: waPhone,
    messages: [],
    last_message_at: now,
    created_at: now,
  };

  const { error: insertError } = await supabase
    .from("conversations")
    .insert(newConv);

  if (insertError) {
    console.error("[db/conversations] Failed to insert conversation:", insertError);
  }

  return newConv;
}

/**
 * Append a message to a conversation, keeping the last 60 messages.
 *
 * @param conversationId - Composite conversation ID
 * @param message        - Message to append
 */
export async function appendMessage(
  conversationId: string,
  message: BotMessage
): Promise<void> {
  try {
    const supabase = getSupabase();

    const { data: conv, error: fetchError } = await supabase
      .from("conversations")
      .select("messages")
      .eq("id", conversationId)
      .single();

    if (fetchError || !conv) {
      console.error("[db/conversations] Conversation not found:", conversationId);
      return;
    }

    const current: BotMessage[] = (conv.messages as BotMessage[]) ?? [];
    const updated = [...current, message].slice(-60);

    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        messages: updated,
        last_message_at: new Date().toISOString(),
      })
      .eq("id", conversationId);

    if (updateError) {
      console.error("[db/conversations] appendMessage update error:", updateError);
    }
  } catch (err) {
    console.error("[db/conversations] appendMessage unexpected error:", err);
  }
}
