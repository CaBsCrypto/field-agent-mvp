// ── FieldAgentMVP — Health check endpoint ────────────────────────────────────

/**
 * GET /api/health
 * Returns service health status. Used by uptime monitors and load balancers.
 */
export async function GET(): Promise<Response> {
  return Response.json({
    status: "ok",
    service: "field-agent-mvp",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}
