import fs from "fs";
import path from "path";

export interface SharePointFile {
  fileName: string;
  fileType: "pdf" | "docx";
  contentBuffer: Buffer;
  textContent?: string;
}

/**
 * Dual-mode Microsoft Graph API connector.
 * If AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET are configured in process.env,
 * authenticates via OAuth2 client credentials grant and fetches files from Microsoft Graph API.
 * Otherwise, falls back to dev/mock corporate documents from data/drive_mock or synthetic buffers.
 */
export async function fetchSharePointFiles(
  siteId?: string,
  folderPath?: string
): Promise<SharePointFile[]> {
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  const isAzureConfigured = Boolean(
    tenantId &&
      clientId &&
      clientSecret &&
      tenantId !== "your_azure_tenant_id" &&
      clientId !== "your_azure_client_id" &&
      clientSecret !== "your_azure_client_secret"
  );

  if (isAzureConfigured) {
    try {
      console.log(
        `[SharePoint Graph] Authenticating via OAuth2 client credentials grant for tenant: ${tenantId}`
      );
      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials",
      });

      const tokenRes = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        throw new Error(`OAuth token request failed (${tokenRes.status}): ${errText}`);
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        throw new Error("No access_token returned from Microsoft Azure OAuth token endpoint");
      }

      const targetSiteId = siteId || process.env.SHAREPOINT_SITE_ID || "root";
      const targetFolderPath = folderPath || process.env.SHAREPOINT_FOLDER_PATH || "";

      let graphUrl = `https://graph.microsoft.com/v1.0/sites/${targetSiteId}/drive/root/children`;
      if (targetFolderPath && targetFolderPath !== "/") {
        const cleanPath = targetFolderPath.replace(/^\/+|\/+$/g, "");
        graphUrl = `https://graph.microsoft.com/v1.0/sites/${targetSiteId}/drive/root:/${cleanPath}:/children`;
      }

      console.log(`[SharePoint Graph] Fetching files from: ${graphUrl}`);
      const graphRes = await fetch(graphUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!graphRes.ok) {
        const errText = await graphRes.text();
        throw new Error(`Graph API list children failed (${graphRes.status}): ${errText}`);
      }

      const graphData = await graphRes.json();
      const items: any[] = graphData.value || [];

      const fetchedFiles: SharePointFile[] = [];

      for (const item of items) {
        if (item.file && item.name) {
          const ext = path.extname(item.name).toLowerCase();
          if (ext === ".pdf" || ext === ".docx" || ext === ".doc") {
            const fileType: "pdf" | "docx" = ext === ".pdf" ? "pdf" : "docx";
            const downloadUrl =
              item["@microsoft.graph.downloadUrl"] ||
              `https://graph.microsoft.com/v1.0/sites/${targetSiteId}/drive/items/${item.id}/content`;

            const fileRes = await fetch(downloadUrl, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (fileRes.ok) {
              const arrayBuffer = await fileRes.arrayBuffer();
              fetchedFiles.push({
                fileName: item.name,
                fileType,
                contentBuffer: Buffer.from(arrayBuffer),
              });
            }
          }
        }
      }

      if (fetchedFiles.length > 0) {
        return fetchedFiles;
      }
    } catch (err) {
      console.warn(
        "[SharePoint Graph API] Live API call failed, falling back to mock corporate files:",
        err
      );
    }
  }

  // --- Dev / Mock Mode ---
  console.log("[SharePoint Graph API] Operating in Mock/Dev mode. Serving corporate mock manuals.");

  return getMockCorporateDocuments();
}

/**
 * Returns corporate technical manuals for mock/dev environment.
 */
function getMockCorporateDocuments(): SharePointFile[] {
  const mockDocs: { fileName: string; fileType: "pdf" | "docx"; text: string }[] = [
    {
      fileName: "SEC_DS108_Normativa_Oficial_2026.pdf",
      fileType: "pdf",
      text: [
        "# Normativa Oficial SEC DS 108 (Edición 2026)",
        "Superintendencia de Electricidad y Combustibles Chile - Reglamento de Seguridad GLP.",
        "",
        "## Distancias Mínimas de Seguridad para Gas Licuado de Petróleo (GLP)",
        "1. Cilindros de 45 kg: Distancia mínima de 1.5 metros respecto a aberturas, ventanas y desagües.",
        "2. Fuentes de Ignición: Distancia mínima de 3.0 metros de tableros eléctricos, motores e interruptores.",
        "3. Tanques y Estanques a Granel: Mínimo 3.0 metros de deslindes de propiedad y 5.0 metros de edificación habitable.",
        "",
        "## Tramitación y Certificación Formulario TC11",
        "- Formulario TC11 obligatorio para instalaciones comerciales o industriales con más de 3 cilindros de 45kg.",
        "- Inspección periódica obligatoria de Válvulas de Alivio de Presión (VRP) cada 5 años por entidad acreditada SEC.",
        "- Mantener registro impreso y digital de mantenimiento de líneas de vaporizado e inspección ultrasónica.",
      ].join("\n"),
    },
    {
      fileName: "Manual_Mantenimiento_Estanques_Granel_v4.docx",
      fileType: "docx",
      text: [
        "# Manual de Mantenimiento Estanques a Granel Abastible GLP (v4.0)",
        "Procedimientos de operación segura y mantenimiento preventivo para estanques industriales y comerciales.",
        "",
        "## Parámetros de Operación y Seguridad",
        "1. Llenado Máximo Regulado: No sobrepasar el 85% de la capacidad volumétrica total del estanque bajo ninguna circunstancia.",
        "2. Código de Falla E-VRP-01: Fuga en Válvula de Regulación y Alivio de Presión.",
        "   - Procedimiento: Cierre inmediato de válvula maestra de servicio.",
        "   - Ventilación de zona afectada y despresurización de tramo secundario.",
        "   - Reemplazo de empaquetadura elastomérica y prueba de hermeticidad con nitrógeno a 1.5 veces la presión de trabajo.",
        "3. Medición ultrasónica de espesor de casco estructural obligatoria cada 24 meses.",
        "4. Presión nominal de trabajo: 8.0 a 10.5 bar. Alerta de sobrepresión si supera 12.0 bar.",
      ].join("\n"),
    },
    {
      fileName: "Pauta_Inspeccion_Bombas_HVAC.pdf",
      fileType: "pdf",
      text: [
        "# Pauta de Inspección y Diagnóstico de Bombas HVAC y Climatización",
        "Protocolo técnico para bombas de circulación hidrónica y compresores de climatización comercial.",
        "",
        "## Códigos de Alerta y Fallas Comunes",
        "1. Código de Error E-HVAC-04: Sobrecalentamiento crítico en compresor HVAC por restricción de refrigerante o falla de condensador.",
        "2. Código de Error E-HVAC-02: Vibración fuera de tolerancia en eje impulsante.",
        "   - Causa probable: Desalineación angular del acoplamiento o desgaste de rodamientos de bolas.",
        "   - Acción: Verificación espectral con acelerómetro y relubricación de rodamientos de alta temperatura.",
        "3. Delta P Nominal: Mantener presión diferencial entre succión y descarga entre 1.2 bar y 2.5 bar.",
        "4. Frecuencia de mantenimiento preventivo: Reconciliación eléctrica e inspección térmica cada 500 horas de uso.",
      ].join("\n"),
    },
  ];

  // Try reading additional mock files from data/drive_mock if available
  const driveMockDir = path.join(process.cwd(), "data", "drive_mock");
  if (fs.existsSync(driveMockDir)) {
    try {
      const files = fs.readdirSync(driveMockDir);
      for (const file of files) {
        if (file.endsWith(".md") || file.endsWith(".txt")) {
          const filePath = path.join(driveMockDir, file);
          const text = fs.readFileSync(filePath, "utf-8");
          const ext = file.endsWith(".docx") ? "docx" : "pdf";
          if (!mockDocs.some(d => d.fileName === file)) {
            mockDocs.push({
              fileName: file,
              fileType: ext,
              text,
            });
          }
        }
      }
    } catch {
      // Ignore read errors from mock dir
    }
  }

  return mockDocs.map(doc => {
    const buffer = Buffer.from(doc.text, "utf-8");
    return {
      fileName: doc.fileName,
      fileType: doc.fileType,
      contentBuffer: buffer,
      textContent: doc.text,
    };
  });
}
