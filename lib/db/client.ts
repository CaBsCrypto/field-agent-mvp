import { neon } from "@neondatabase/serverless";

/**
 * Returns a Neon Serverless SQL query executor.
 * Automatically checks POSTGRES_URL or DATABASE_URL (set by Vercel Postgres / Neon integration).
 */
export function getNeonSql() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    // Graceful fallback for mock mode if DB is not attached yet
    return async (query: string, params: any[] = []) => {
      console.warn("[Neon DB] No POSTGRES_URL configured. Running in fallback mode.");
      return [];
    };
  }

  return neon(connectionString);
}
