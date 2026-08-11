/**
 * Shared types for the FieldAgent AI system.
 */

/** A single turn in a conversation with the AI agent. */
export interface BotMessage {
  /** "user" for technician messages, "assistant" for agent replies. */
  role: "user" | "assistant";
  /** Plain-text content of the message. */
  content: string;
}

/** Intent categories the agent can classify. */
export type MessageIntent =
  | "query"            // Technician asking a technical question
  | "incident_report"  // Technician reporting a fault or incident
  | "escalation"       // Technician requesting supervisor intervention
  | "unknown";         // Cannot be classified

/** Business configuration injected into system prompts. */
export interface BusinessConfig {
  /** Company name shown in agent responses. */
  companyName: string;
  /** Short description of the company's service area. */
  serviceArea?: string;
  /** Supervisor contact info shown when escalation is needed. */
  supervisorContact?: string;
}
