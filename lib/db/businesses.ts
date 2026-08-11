/**
 * @file lib/db/businesses.ts
 * @description Supabase queries for the businesses and business_configs tables.
 */
import { getSupabaseClient } from './client';
import type { Business, BusinessConfig } from '@/types';

/**
 * Find the active business that owns a given WhatsApp Phone Number ID.
 *
 * @param phoneNumberId - The phone_number_id from the webhook metadata
 * @returns The Business record, or null if not found
 */
export async function getBusinessByPhoneNumberId(
  phoneNumberId: string
): Promise<Business | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('wa_phone_number_id', phoneNumberId)
    .eq('is_active', true)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[businesses] getBusinessByPhoneNumberId error:', error.message);
    return null;
  }
  return data as Business;
}

/**
 * Get the business config for a given business ID.
 *
 * @param businessId - UUID of the business
 * @returns The BusinessConfig record, or null if not found
 */
export async function getBusinessConfig(
  businessId: string
): Promise<BusinessConfig | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('business_configs')
    .select('*')
    .eq('business_id', businessId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('[businesses] getBusinessConfig error:', error.message);
    return null;
  }
  return data as BusinessConfig;
}
