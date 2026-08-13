## 2026-08-13T03:14:31Z
Scope & Task (Milestone M2 - Eskuad Webhook Endpoint):
Target file: C:\Users\MGC\Desktop\Dev\field-agent-mvp\app\api\eskuad\webhook\route.ts

Requirements:
1. Parse incoming POST JSON body payload from Eskuad field form submissions.
2. Extract fields:
   - `form_id` (fallback: `payload.form_id || payload.id || "FORM-" + Date.now()`)
   - `technician_phone` (fallback: `payload.technician_phone || payload.phone || payload.tech_phone || "+56912345678"`)
   - `equipment_code` (fallback: `payload.equipment_code || payload.equipment_id || "ESTANQUE-GRANEL-402"`)
   - `comments` (fallback: `payload.comments || payload.comentarios || payload.notes || payload.observaciones || "Formulario de terreno Eskuad sin comentarios"`)
3. Integrate with DB:
   - Import `getTechnicianByPhone` from `@/lib/db/technicians` (if needed) and `saveIncident` from `@/lib/db/incidents`.
   - Call `saveIncident` to create an Incident record with `business_id: "abastible-glp"`, `technician_phone: techPhone`, `equipment_code: equipmentCode`, `description: `${formTitle}: ${comments}`, `status: "closed"`, `raw_message: JSON.stringify(payload)`.
   - Wrap DB call in try/catch so if DB keys are absent/mock in dev environment, it handles it gracefully without throwing unhandled exceptions.
4. Integrate with WhatsApp Bot:
   - Import `sendTextMessage` from `@/lib/whatsapp/client`.
   - Send confirmation WhatsApp message to `techPhone` acknowledging receipt of field form `form_id` for equipment `equipment_code`.
   - Wrap WhatsApp call in try/catch so if WhatsApp API token is absent in dev environment, it handles it gracefully and logs warning without throwing unhandled exceptions.
5. Response:
   - Return HTTP 200 OK with structured JSON:
     ```json
     {
       "success": true,
       "message": "Formulario de Eskuad recibido, registrado en DB y notificado vía WhatsApp",
       "record": {
         "formId": formId,
         "techPhone": techPhone,
         "equipmentCode": equipmentCode,
         "comments": comments,
         "status": "completed",
         "timestamp": new Date().toISOString()
       },
       "incidentId": incidentRecord?.id || null,
       "whatsappSent": true/false
     }
     ```
6. Verification & Build:
   - Run `pnpm build` in C:\Users\MGC\Desktop\Dev\field-agent-mvp to ensure TypeScript and Next.js compilation succeed with 0 errors.
