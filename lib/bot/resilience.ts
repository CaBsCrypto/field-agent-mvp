// ── FieldAgentMVP — Fallback and Resilience Utilities ──────────────────────────
import fs from "fs";
import path from "path";

/**
 * Sanitizes user input to prevent Prompt Injections
 */
export function sanitizeTechnicianInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/(ignore\s+all\s+previous\s+instructions|system\s+prompt|admin\s+override)/gi, "[REDACTED_PROMPT_INJECTION]")
    .trim();
}

/**
 * Emergency static fallback if database or Gemini API is unreachable
 */
export function getEmergencyFallbackReply(phone: string): string {
  return `⚠️ **SISTEMA EN MODO RESILIENCIA / CONTINGENCIA**

No pudimos conectar temporalmente con los servidores de IA en la nube, pero tu seguridad en terreno es la prioridad.

📞 **Contacto Directo de Supervisor Abastible:**
- **Central de Emergencias:** +56900000001
- **Mesa de Ayuda Técnica:** 800 20 20 20

Tu consulta ha quedado registrada localmente y un supervisor te contactará.`;
}
