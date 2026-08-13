# Codebase Survey Handoff Report — Explorer 1 (teamwork_preview_explorer)

## 1. Observation

Direct observations from inspecting `C:\Users\MGC\Desktop\Dev\field-agent-mvp`:

### 1.1 Tech Stack & Framework
- **Next.js Version**: Next.js `16.3.0` (`package.json` line 21).
- **React Version**: React `19.2.8` & React DOM `19.2.8` (`package.json` lines 23-24).
- **Router Model**: Next.js App Router using the `app/` directory convention (e.g. `app/api/.../route.ts` and `app/.../page.tsx`).
- **Language**: TypeScript 5 (`package.json` line 36, `tsconfig.json`).
- **Package Manager**: `pnpm` (`pnpm-lock.yaml` present in repository root).
- **Database Clients**:
  - `@supabase/supabase-js` (`^2.112.2`): Used in `lib/db/incidents.ts` (lines 2-12) and `lib/db/conversations.ts` (lines 2-12) requiring `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - `@neondatabase/serverless` (`^1.1.0`): Used in `lib/db/client.ts` (lines 1-19) and `lib/db/businesses.ts` (lines 1-36) connecting via `POSTGRES_URL` or `DATABASE_URL`.
  - In-memory mock fallback in `lib/db/technicians.ts` (lines 4-9) for technician whitelist authentication.

### 1.2 Existing API Routes Directory Structure
All API routes are located in `app/api/`:
- `app/api/whatsapp/webhook/route.ts`: Meta WhatsApp Business Cloud API & Kapso webhook receiver. Implements `GET` challenge verification (lines 8-24) and `POST` message handler with `x-hub-signature-256` HMAC validation and `after()` async execution (lines 26-74).
- `app/api/eskuad/webhook/route.ts`: Webhook handler for Eskuad offline field forms (`POST` method, lines 3-31). Currently returns a stub JSON response.
- `app/api/sharepoint/sync/route.ts`: Sync handler for Microsoft SharePoint Graph API (`POST` method, lines 3-23). Currently returns a stub JSON response.
- `app/api/demo/chat/route.ts`: Demo chat endpoint supporting interactive selection, fallback queries, and emergency keyword handling (`POST` method, lines 5-96).
- `app/api/health/route.ts`: System health check endpoint.

### 1.3 Existing Database Models & Schemas
Defined in `types/bot.ts` and `types/index.ts`:
- **Incidents Table (`incidents`)**:
  ```ts
  export interface Incident {
    id?: string;               // UUID
    business_id: string;       // Foreign key to business
    technician_id: string;     // Foreign key to technician
    technician_phone: string;  // E.164 without +
    address: string | null;    // Location of work
    equipment_code: string | null; // Equipment ID (e.g. ESTANQUE-GRANEL-402)
    fault_code: string | null; // Fault code (e.g. E-01, E-VRP-01)
    description: string;       // Fault or work description
    solution: string | null;   // Action applied
    status: "open" | "closed" | "escalated";
    raw_message: string;       // Original technician message
    created_at?: string;
    updated_at?: string;
  }
  ```
- **Conversations Table (`conversations`)**:
  ```ts
  export interface Conversation {
    id: string;                // Composite: ${business_id}_${wa_phone}
    business_id: string;
    wa_phone: string;
    messages: BotMessage[];    // JSONB array capped at 60 messages ({ role: "user" | "model", content: string, timestamp: string })
    last_message_at: string;
    created_at: string;
  }
  ```
- **Business Configuration (`business_configs`)**:
  Contains fields for `id`, `business_id`, `bot_name`, `tone`, `knowledge_base_path`, `supervisor_phone`, `servicios`, `faqs`, `reglas_extra`, and Microsoft Graph API credentials (`ms_tenant_id`, `ms_client_id`, `ms_client_secret`, `ms_folder_id`).

### 1.4 Existing WhatsApp Integration Logic
- **Providers**: Dual support for Kapso.ai and Meta Cloud API (`v21.0`) in `lib/whatsapp/client.ts`.
- **Environment Switch**: `WHATSAPP_PROVIDER` env variable (`kapso` or `meta`).
- **Signature Verification**: `lib/whatsapp/verify.ts` uses HMAC-SHA256 (`timingSafeEqual`) on `x-hub-signature-256`.
- **Bot Orchestrator**: `lib/bot/handler.ts` handles message flow end-to-end:
  1. Identifies business by `phoneNumberId` (`getBusinessByPhoneNumberId`).
  2. Authenticates technician via whitelist (`getTechnicianByPhone`).
  3. Manages conversation history (`getOrCreateConversation`, `appendMessage`).
  4. Classifies intent (`lib/bot/intentRouter.ts` using Gemini with `temperature: 0`).
  5. Routes to: `query` (`handleQuery`), `incident_report` (`handleIncidentReport`), `escalation` (`handleEscalation`).

### 1.5 Existing Vector DB / RAG & Manual Indexing Infrastructure
- **Embedding Model**: `@google/generative-ai` model `text-embedding-004` (768 dimensions) in `lib/ai/vectorRAG.ts`.
- **Cache Store**: Local file cache stored at `data/knowledge_base_embeddings.json`.
- **Knowledge Base Source**: Markdown files in `knowledge_base/` (`01-codigos-error-hvac.md` to `06-protocolo-estanques-glp-abastible.md`).
- **Search Strategy**:
  - `lib/ai/hybridSearch.ts`: BM25 exact keyword matching for codes (`E-01`, `DS 108`, `TC11`) combined with Cosine Similarity vector search.
  - `lib/ai/knowledgeGraph.ts`: Obsidian wikilink (`[[Link Target]]`) graph generator.

### 1.6 Admin Panel Interface (`/admin/training`)
- Located at `app/admin/training/page.tsx`.
- Contains visual triggers:
  - Button "☁️ Sincronizar SharePoint O365" -> calls `POST /api/sharepoint/sync`.
  - Button "📱 Simular Webhook de Eskuad" -> calls `POST /api/eskuad/webhook`.

### 1.7 Package.json Dependencies & Scripts
- **Key Dependencies**: `@google/generative-ai`, `@neondatabase/serverless`, `@supabase/supabase-js`, `d3-force-3d`, `force-graph`, `lucide-react`, `mammoth`, `next`, `pdf-parse`, `react`, `react-dom`, `react-force-graph-2d`, `xlsx`.
- **Key Scripts**: `dev`, `build`, `start`, `lint`, `seed` (`tsx --env-file=.env.local scripts/seed-mockup.ts`).

---

## 2. Logic Chain

1. **Framework & API Router**: The presence of `app/api/.../route.ts` files alongside `next: 16.3.0` in `package.json` confirms the repository uses Next.js 16 App Router.
2. **Database Integration**: `lib/db/incidents.ts` uses `@supabase/supabase-js` `from("incidents")` to store incident reports, while `lib/db/client.ts` provides `@neondatabase/serverless` SQL bindings. This indicates a dual DB pattern (Supabase client for JSON/record tables and Neon for SQL tables, with mock fallback).
3. **Eskuad Webhook Requirement (R2)**: The endpoint `app/api/eskuad/webhook/route.ts` already receives form data (`form_id`, `technician_phone`, `equipment_code`), but currently returns a static stub. Connecting it to `saveIncident()` in `lib/db/incidents.ts` and `sendTextMessage()` in `lib/whatsapp/client.ts` will fulfill Requirement R2.
4. **SharePoint Sync Requirement (R3)**: The endpoint `app/api/sharepoint/sync/route.ts` receives `{ siteId, folderPath }`, but currently returns hardcoded file metadata. Integrating Microsoft Graph API downloading + `mammoth`/`pdf-parse` text extraction + `syncEmbeddingsCache()` from `lib/ai/vectorRAG.ts` will fulfill Requirement R3.
5. **Admin Panel (R4)**: `/admin/training` already includes buttons invoking `/api/sharepoint/sync` and `/api/eskuad/webhook`. When those endpoints return actual processed data, the UI will dynamically update the document list.

---

## 3. Caveats

- **Environment Credentials**: Real database calls (`Supabase` or `Neon`) and Microsoft Graph API require actual environment secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MS_TENANT_ID`, `MS_CLIENT_ID`, `MS_CLIENT_SECRET`). In fallback/mock mode, endpoints must handle missing keys gracefully without crashing.
- **`scripts/` Directory**: `scripts/` directory is currently empty despite `package.json` referencing `scripts/seed-mockup.ts`.
- **Git Branch Check**: Git operations must be verified on the terminal before submitting handoff to confirm the active branch is `feature/eskuad-sharepoint-integration`.

---

## 4. Conclusion

The `field-agent-mvp` codebase is well-structured and ready for feature implementation on `feature/eskuad-sharepoint-integration`:
- All required domain models (`Incident`, `Technician`, `BusinessConfig`) are fully defined in `types/bot.ts` and `types/index.ts`.
- The webhook entry point `/api/eskuad/webhook/route.ts` and sync entry point `/api/sharepoint/sync/route.ts` exist as functional stubs.
- The WhatsApp messaging client (`lib/whatsapp/client.ts`) and vector RAG engine (`lib/ai/vectorRAG.ts`) are fully implemented and available for integration.
- The Admin Panel (`app/admin/training/page.tsx`) is already pre-configured to test both endpoints.

---

## 5. Verification Method

To verify these findings:
1. View `package.json` to confirm dependency versions (`next`, `@supabase/supabase-js`, `mammoth`, `pdf-parse`).
2. Inspect `app/api/eskuad/webhook/route.ts` and `app/api/sharepoint/sync/route.ts` to confirm existing endpoint signatures.
3. Inspect `lib/db/incidents.ts` and `types/bot.ts` to confirm database schema compatibility.
4. Run `pnpm build` to verify project compilation.
