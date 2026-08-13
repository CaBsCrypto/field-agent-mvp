# Investigation Report: Requirements R3 (SharePoint Graph API Sync) & R4 (Admin Training / Integration Panel)

**Explorer**: Explorer 3 (`teamwork_preview_explorer`)  
**Target Codebase**: `C:\Users\MGC\Desktop\Dev\field-agent-mvp`  
**Report Location**: `C:\Users\MGC\Desktop\Dev\field-agent-mvp\.agents\explorer_survey_3\handoff.md`  

---

## 1. Observation

### 1.1 Vector RAG Engine & Embedding Pipeline (`lib/ai/vectorRAG.ts`)
- **Embedding Model**: `text-embedding-004` via `@google/generative-ai` (`GoogleGenerativeAI`), configured in `lib/ai/vectorRAG.ts:5`.
- **Embedding Generator**: `computeEmbedding(text, apiKeyOverride)` (lines 29-44). If `GEMINI_API_KEY` is undefined or set to `"your_gemini_api_key_here"`, fallback returns a dummy vector array of size 768 filled with `0.1` (lines 31-34).
- **Storage / Cache**: Vector embeddings are serialized to `data/knowledge_base_embeddings.json` via `syncEmbeddingsCache(apiKeyOverride)` (lines 46-106).
- **Cached Data Schema**:
  ```ts
  interface CachedEmbedding {
    fileName: string;
    filePath: string;
    fileHash: string;
    embedding: number[];
    content: string;
  }
  ```
- **Semantic Search**: `getSemanticKnowledgeContext(query, limit, apiKeyOverride)` (lines 108-140) uses cosine similarity (`cosineSimilarity(vecA, vecB)` lines 15-27) to match queries against cached document content.
- **Document Parsers in `package.json`**:
  - `pdf-parse`: `^2.4.5` (line 22 of `package.json`)
  - `mammoth`: `^1.12.1` (line 20 of `package.json` — for Microsoft Word `.docx` parsing)
  - Currently, `syncEmbeddingsCache` only scans for `.md` files inside `knowledge_base/` (`lib/ai/vectorRAG.ts:63`).

### 1.2 SharePoint Sync API Route (`app/api/sharepoint/sync/route.ts`)
- **HTTP Method**: `POST`
- **Current Behavior**: Extracts `siteId` (default `"Abastible-Docs"`) and `folderPath` (default `"/ManualesTecnicos"`) from JSON body (line 5).
- **Response**: Returns HTTP 200 OK with `success: true`, message `"Sincronización con Microsoft SharePoint Office 365 completada"`, a mock array `syncedFiles` with 3 items (`SEC_DS108_Normativa_Oficial_2026.pdf`, `Manual_Mantenimiento_Estanques_Granel_v4.docx`, `Pauta_Inspeccion_Bombas_HVAC.pdf`), and a timestamp (lines 9-18).
- **Graph API Client**: No external Microsoft Graph client SDK (`@microsoft/microsoft-graph-client`) is installed; integration operates via simulated mock data or raw REST fetch.

### 1.3 Eskuad Webhook API Route (`app/api/eskuad/webhook/route.ts`)
- **HTTP Method**: `POST`
- **Current Behavior**: Parses JSON payload, extracts `form_id`, `technician_phone`, `form_title`, `equipment_code`, and `status`. Returns HTTP 200 OK with `record` object containing extracted fields and timestamp.

### 1.4 Admin Training & Integration UI (`app/admin/training/page.tsx`)
- **Component Type**: Client Component (`"use client"`).
- **Navigation Layout**: Uses `<AdminHeader />` from `@/components/AdminHeader`.
- **Existing Interactive Handlers**:
  - `handleSyncSharePoint()` (lines 32-59): Sends POST request to `/api/sharepoint/sync`, prepends `SEC_DS108_Normativa_Oficial_2026.pdf` (`24` embeddings) to `docs` state, and displays confirmation alert.
  - `handleSimulateEskuadWebhook()` (lines 61-93): Sends POST request to `/api/eskuad/webhook`, prepends `Acta_Inspeccion_Eskuad_Form_4099.json` (`6` embeddings) to `docs` state, and displays confirmation alert.
  - `handleGenerateManualWithAI()` (lines 95-114): Simulates AI generation of a markdown manual and prepends it to `docs` state.
- **Design System & Dependencies**: Uses inline React styles matching corporate palette (`#003366` Navy, `#FF6600` Orange, `#F8FAFC` Slate background) and `lucide-react` icons (`BookOpen`, `CloudSync`, `Share2`, `Smartphone`, `Upload`, `Sparkles`, `RefreshCw`, `CheckCircle`, `FileText`).

---

## 2. Logic Chain

1. **R3: SharePoint Graph API Sync Requirements**:
   - **Requirement**: Endpoint `/api/sharepoint/sync` must trigger synchronization with Microsoft Graph API to download corporate manuals (PDF/Word) and ingest/index them into the RAG vector database.
   - **Data Flow**:
     1. Incoming POST request to `/api/sharepoint/sync` specifies target `siteId` and `folderPath`.
     2. Connector checks for Azure AD credentials (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`).
     3. If credentials are empty/mock, connector uses local mock files (such as `data/drive_mock/manual_abastible_sec_drive.md` or synthetic buffers) to simulate Microsoft Graph API file retrieval `/v1.0/sites/{siteId}/drive/root:/{folderPath}:/children`.
     4. Document Parsing: PDF buffers are parsed via `pdf-parse`, Word DOCX buffers are parsed via `mammoth`. Text content is converted into structured markdown/text documents.
     5. RAG Vector Ingestion: Text is split into chunks/documents, passed to `computeEmbedding(text)` in `lib/ai/vectorRAG.ts`, saved into `knowledge_base/` or `data/knowledge_base_embeddings.json`.
     6. Response: Endpoint returns JSON array of indexed documents with file format, status `"Indexado"`, and active embedding counts.

2. **R4: Admin Training / Integration Panel Requirements**:
   - **Requirement**: Provide visual simulations and test buttons for both Eskuad Webhook and SharePoint Sync at `/admin/training`.
   - **Data Flow & UI Integration**:
     1. Page `/admin/training/page.tsx` is already linked in `<AdminHeader />` (line 13 of `components/AdminHeader.tsx`).
     2. Visual Panel: Section "Integraciones Corporativas" hosts two distinct test action buttons:
        - `☁️ Sincronizar SharePoint O365` -> calls `POST /api/sharepoint/sync`.
        - `📱 Simular Webhook de Eskuad` -> calls `POST /api/eskuad/webhook`.
     3. Enhancements for Implementation Phase:
        - Add stateful visual feedback cards showing live status of each connector (e.g. `SharePoint Graph API: Connected (Mock)` and `Eskuad Webhook Receiver: Active`).
        - Add an interactive Eskuad Payload Test Drawer / Form Modal allowing customized test inputs (`form_id`, `technician_phone`, `equipment_code`, `comments`).
        - Display real-time execution logs/toasts when sync/webhook test buttons are clicked.
        - Synchronize document list state with actual files stored in `data/knowledge_base_embeddings.json`.

---

## 3. Caveats

- **API Credentials & Network Constraints**: In environments without live Azure AD / Microsoft Graph API credentials (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`), the connector must fallback smoothly to the mock provider strategy using local synthetic files (`data/drive_mock/manual_abastible_sec_drive.md` or generated buffers).
- **Gemini API Key Fallback**: `lib/ai/vectorRAG.ts` handles missing Gemini keys gracefully by generating a dummy 768-dim vector filled with `0.1`. This allows offline testing without throwing unhandled exceptions.
- **Read-Only Scope**: This report is produced under read-only investigation rules. No source files under `app/` or `lib/` were modified during this explorer phase.

---

## 4. Conclusion & Architecture Specifications

### 4.1 Requirement R3: SharePoint Graph API Sync Architecture
- **Target Endpoint**: `app/api/sharepoint/sync/route.ts`
- **Connector Strategy**:
  - Implement a dual-mode Graph API service module `lib/sharepoint/graphClient.ts`:
    - **Live Mode**: When Azure env vars are present, execute OAuth2 client credentials grant to get Bearer token and fetch documents from Graph API endpoint `GET https://graph.microsoft.com/v1.0/sites/{siteId}/drive/root:/{folderPath}:/children`.
    - **Mock Mode**: When Azure env vars are absent, load corporate manual templates from `data/drive_mock/` and simulate response payloads for PDF and Word documents.
- **Document Ingestion Engine**:
  - Extend `lib/ai/vectorRAG.ts` to parse `.pdf` files using `pdf-parse` and `.docx` files using `mammoth`.
  - Save extracted text files to `knowledge_base/` and trigger `syncEmbeddingsCache()`.
  - Update `data/knowledge_base_embeddings.json` with generated vectors.

### 4.2 Requirement R4: Admin Training / Integration Panel Architecture
- **Target Page**: `app/admin/training/page.tsx`
- **UI Structure & Components**:
  - Header: Shared `<AdminHeader />` navigation.
  - Main Document Table: Renders `docs` array with file type icons, source badge (`SharePoint Office 365`, `Eskuad Field Data`), file size, and embedding count.
  - Integration Action Panel:
    - **SharePoint Sync Button**: `<button onClick={handleSyncSharePoint}>` with spinner state, triggers `POST /api/sharepoint/sync`, updates document list and toast feedback.
    - **Eskuad Webhook Simulation Button**: `<button onClick={handleSimulateEskuadWebhook}>` with spinner state, triggers `POST /api/eskuad/webhook`, updates document list and webhook event feed.
  - Interactive Simulation Controls: Add parameters input fields for customizing `siteId` / `folderPath` and test Eskuad form payload data.

---

## 5. Verification Method

To verify R3 and R4 implementation independently once built:

1. **Build & Type Check**:
   ```bash
   pnpm build
   ```
   Ensure 0 build or TypeScript errors occur.

2. **SharePoint Sync API Endpoint Test**:
   ```bash
   curl -X POST http://localhost:3000/api/sharepoint/sync \
     -H "Content-Type: application/json" \
     -d '{"siteId":"Abastible-Docs","folderPath":"/ManualesTecnicos"}'
   ```
   Expected result: `HTTP 200 OK` with JSON `{ "success": true, "syncedFiles": [...] }`.

3. **Eskuad Webhook Endpoint Test**:
   ```bash
   curl -X POST http://localhost:3000/api/eskuad/webhook \
     -H "Content-Type: application/json" \
     -d '{"form_id":"ESKUAD-INS-4099","technician_phone":"+56961857682","equipment_code":"ESTANQUE-GRANEL-402"}'
   ```
   Expected result: `HTTP 200 OK` with JSON `{ "success": true, "record": {...} }`.

4. **UI Panel Verification**:
   - Navigate to `http://localhost:3000/admin/training` in browser.
   - Click "☁️ Sincronizar SharePoint O365" -> Verify new PDF doc appears in table with active embeddings.
   - Click "📱 Simular Webhook de Eskuad" -> Verify new field form document appears in table.
