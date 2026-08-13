# Original User Request

## 2026-08-12T23:02:00Z

# Teamwork Project Prompt — Eskuad & SharePoint Integration

Implementación completa y encapsulada de los conectores de prueba para **Eskuad** y **Microsoft SharePoint (Office 365)** en el proyecto `field-agent-mvp`, organizados en la rama específica `feature/eskuad-sharepoint-integration`.

Working directory: C:\Users\MGC\Desktop\Dev\field-agent-mvp
Integrity mode: development

## Requirements

### R1. Creación de la Rama Git Específica
- Todo el desarrollo de la integración debe quedar aislado y commiteado en la rama `feature/eskuad-sharepoint-integration`.

### R2. Receptor Webhook Eskuad (/api/eskuad/webhook)
- Implementar el procesamiento de payloads de formularios de terreno offline de Eskuad, extrayendo `form_id`, `technician_phone`, `equipment_code` y comentarios, e integrándolos con la base de datos de incidencias y el bot de WhatsApp.

### R3. Conector SharePoint Graph API (/api/sharepoint/sync)
- Implementar la rutina de sincronización con Microsoft Graph API para descargar e indexar manuales corporativos (PDF/Word) en la base vectorial RAG.

### R4. Panel Admin de Pruebas e Integración (/admin/training)
- Proveer botones de prueba y simulaciones visuales para probar ambos conectores directamente desde la interfaz web.

## Acceptance Criteria

### Verificación Programática y de Construcción
- [ ] La rama actual es `feature/eskuad-sharepoint-integration` y la lista de git branch está limpia.
- [ ] Endpoint `/api/eskuad/webhook` responde `200 OK` con JSON estructurado al recibir datos de prueba.
- [ ] Endpoint `/api/sharepoint/sync` responde `200 OK` simulando la ingesta de documentos corporativos.
- [ ] Ejecución exitosa de `pnpm build` sin errores de compilación ni TypeScript.
