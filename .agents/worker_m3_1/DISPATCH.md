## 2026-08-13T03:24:10Z
<USER_REQUEST>
You are Worker M3 (teamwork_preview_worker).
Your working directory is: C:\Users\MGC\Desktop\Dev\field-agent-mvp\.agents\worker_m3_1
Original Request Path: C:\Users\MGC\Desktop\Dev\field-agent-mvp\.agents\ORIGINAL_REQUEST.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Task (Milestone M3 - SharePoint Graph API Sync & RAG Ingestion):

Target files to create or modify:
1. `lib/sharepoint/graphClient.ts` (Create/Implement):
   - Dual-mode Microsoft Graph API connector.
   - If `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` are configured, execute OAuth2 client credentials grant against `https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token` to get Bearer token, then fetch documents from Graph API (`/v1.0/sites/{siteId}/drive/root:/{folderPath}:/children`).
   - If credentials are absent or in dev/mock mode, read mock corporate documents from `data/drive_mock/` or synthetic buffers for corporate manuals (PDF/Word).
   - Export function: `fetchSharePointFiles(siteId?: string, folderPath?: string): Promise<{ fileName: string; fileType: "pdf" | "docx"; contentBuffer: Buffer; textContent?: string }[]>`.

2. `lib/ai/vectorRAG.ts` (Update):
   - Support parsing PDF documents (using `pdf-parse`) and DOCX documents (using `mammoth`).
   - Export function or method `ingestDocumentIntoVectorRAG(fileName: string, fileType: "pdf" | "docx", content: Buffer | string): Promise<{ embeddingsCount: number }>` that extracts text, computes embeddings using `computeEmbedding(text)`, saves document under `knowledge_base/` or embedding cache `data/knowledge_base_embeddings.json`, and updates cache.

3. `app/api/eskuad/webhook/route.ts` & `app/api/sharepoint/sync/route.ts` (Update / Complete):
   - In `app/api/sharepoint/sync/route.ts`:
     - Parse POST request JSON body `{ siteId, folderPath }`.
     - Invoke `fetchSharePointFiles(siteId, folderPath)`.
     - Ingest each document into RAG vector DB via `ingestDocumentIntoVectorRAG` / `vectorRAG.ts`.
     - Return HTTP 200 OK JSON:
       ```json
       {
         "success": true,
         "message": "Sincronización con Microsoft SharePoint Office 365 completada",
         "syncedFiles": [
           {
             "fileName": "SEC_DS108_Normativa_Oficial_2026.pdf",
             "fileType": "pdf",
             "status": "Indexado",
             "embeddingsCount": 24
           },
           {
             "fileName": "Manual_Mantenimiento_Estanques_Granel_v4.docx",
             "fileType": "docx",
             "status": "Indexado",
             "embeddingsCount": 18
           },
           {
             "fileName": "Pauta_Inspeccion_Bombas_HVAC.pdf",
             "fileType": "pdf",
             "status": "Indexado",
             "embeddingsCount": 12
           }
         ],
         "timestamp": new Date().toISOString()
       }
       ```

4. Verification & Build:
   - Run `pnpm build` in C:\Users\MGC\Desktop\Dev\field-agent-mvp to ensure TypeScript and Next.js compilation succeed with 0 errors.

Output Requirements:
Write full handoff report to C:\Users\MGC\Desktop\Dev\field-agent-mvp\.agents\worker_m3_1\handoff.md documenting file changes, build logs, and test verification output. Update progress.md in your directory.
Send a message to parent when done.
</USER_REQUEST>
