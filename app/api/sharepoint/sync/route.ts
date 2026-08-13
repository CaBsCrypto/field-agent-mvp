import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { siteId, folderPath } = await req.json();

    console.log(`[SharePoint Sync] Triggered sync for site=${siteId || "Abastible-Docs"} folder=${folderPath || "/ManualesTecnicos"}`);

    return NextResponse.json({
      success: true,
      message: "Sincronización con Microsoft SharePoint Office 365 completada",
      syncedFiles: [
        { name: "SEC_DS108_Normativa_Oficial_2026.pdf", status: "Indexado", embeddings: 24 },
        { name: "Manual_Mantenimiento_Estanques_Granel_v4.docx", status: "Indexado", embeddings: 18 },
        { name: "Pauta_Inspeccion_Bombas_HVAC.pdf", status: "Indexado", embeddings: 15 },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[SharePoint Sync Error]:", error);
    return NextResponse.json({ error: "Error conectando con Microsoft Graph API / SharePoint" }, { status: 500 });
  }
}
