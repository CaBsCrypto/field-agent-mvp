import { NextResponse } from "next/server";
import { fetchSharePointFiles } from "@/lib/sharepoint/graphClient";
import { ingestDocumentIntoVectorRAG } from "@/lib/ai/vectorRAG";

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { siteId, folderPath } = body;

    console.log(
      `[SharePoint Sync] Triggering sync for site=${siteId || "Abastible-Docs"} folder=${folderPath || "/ManualesTecnicos"}`
    );

    // 1. Fetch documents from SharePoint (Live Azure Graph API or Dev Mock)
    const files = await fetchSharePointFiles(siteId, folderPath);

    // 2. Ingest each document into RAG Vector DB
    const syncedFiles = [];
    for (const file of files) {
      const { embeddingsCount } = await ingestDocumentIntoVectorRAG(
        file.fileName,
        file.fileType,
        file.contentBuffer || file.textContent || ""
      );

      syncedFiles.push({
        fileName: file.fileName,
        fileType: file.fileType,
        status: "Indexado",
        embeddingsCount,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Sincronización con Microsoft SharePoint Office 365 completada",
      syncedFiles,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[SharePoint Sync Error]:", error);
    return NextResponse.json(
      { error: "Error conectando con Microsoft Graph API / SharePoint" },
      { status: 500 }
    );
  }
}
