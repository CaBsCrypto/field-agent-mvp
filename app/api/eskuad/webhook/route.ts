import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    console.log("[Eskuad Webhook] Received field form event:", JSON.stringify(payload));

    const formId = payload.form_id || payload.id || "FORM-" + Date.now();
    const techPhone = payload.technician_phone || payload.phone || "+56912345678";
    const formTitle = payload.form_title || payload.title || "Formulario de Inspección en Terreno (Eskuad)";
    const equipmentCode = payload.equipment_code || "ESTANQUE-GRANEL-402";
    const status = payload.status || "completed";

    return NextResponse.json({
      success: true,
      message: "Formulario de Eskuad recibido e indexado con éxito",
      record: {
        formId,
        techPhone,
        formTitle,
        equipmentCode,
        status,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Eskuad Webhook Error]:", error);
    return NextResponse.json({ error: "Error procesando webhook de Eskuad" }, { status: 500 });
  }
}
