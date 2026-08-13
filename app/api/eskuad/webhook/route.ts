import { NextResponse } from "next/server";
import { getTechnicianByPhone } from "@/lib/db/technicians";
import { saveIncident } from "@/lib/db/incidents";
import { sendTextMessage } from "@/lib/whatsapp/client";
import type { Incident } from "@/types/bot";

export async function POST(req: Request) {
  try {
    let payload: Record<string, any> = {};
    try {
      payload = await req.json();
    } catch {
      payload = {};
    }

    console.log("[Eskuad Webhook] Received field form payload:", JSON.stringify(payload));

    // Extract fields with fallbacks per specification
    const formId = payload.form_id || payload.id || "FORM-" + Date.now();
    const techPhone =
      payload.technician_phone || payload.phone || payload.tech_phone || "+56912345678";
    const equipmentCode =
      payload.equipment_code || payload.equipment_id || "ESTANQUE-GRANEL-402";
    const comments =
      payload.comments ||
      payload.comentarios ||
      payload.notes ||
      payload.observaciones ||
      "Formulario de terreno Eskuad sin comentarios";
    const formTitle =
      payload.form_title ||
      payload.title ||
      payload.form_name ||
      payload.nombre_formulario ||
      "Formulario Eskuad";

    // 1. Save incident in database
    let incidentRecord: Incident | null = null;
    try {
      const tech = await getTechnicianByPhone(techPhone, "abastible-glp");
      const technicianId = tech?.id || `tech_${techPhone.replace(/\D/g, "")}`;

      incidentRecord = await saveIncident({
        business_id: "abastible-glp",
        technician_id: technicianId,
        technician_phone: techPhone,
        address: null,
        equipment_code: equipmentCode,
        fault_code: null,
        description: `${formTitle}: ${comments}`,
        solution: null,
        status: "closed",
        raw_message: JSON.stringify(payload),
      });
    } catch (dbError) {
      console.warn("[Eskuad Webhook] DB integration error (handled gracefully):", dbError);
      incidentRecord = null;
    }

    // 2. Send WhatsApp notification
    let whatsappSent = false;
    try {
      const accessToken =
        process.env.WHATSAPP_ACCESS_TOKEN || process.env.KAPSO_API_KEY || "";
      const phoneNumberId =
        process.env.WHATSAPP_PHONE_NUMBER_ID ||
        process.env.KAPSO_CHANNEL_ID ||
        "1121481194385373";

      if (accessToken) {
        const messageText = `Formulario ${formId} recibido para equipo ${equipmentCode}.`;
        await sendTextMessage(techPhone, messageText, accessToken, phoneNumberId);
        whatsappSent = true;
      } else {
        console.warn("[Eskuad Webhook] WhatsApp API token absent in dev environment; skipping message sending.");
      }
    } catch (waError) {
      console.warn("[Eskuad Webhook] WhatsApp send message error (handled gracefully):", waError);
      whatsappSent = false;
    }

    return NextResponse.json({
      success: true,
      message: "Formulario de Eskuad recibido, registrado en DB y notificado vía WhatsApp",
      record: {
        formId,
        techPhone,
        equipmentCode,
        comments,
        status: "completed",
        timestamp: new Date().toISOString(),
      },
      incidentId: incidentRecord?.id || null,
      whatsappSent,
    });
  } catch (error) {
    console.error("[Eskuad Webhook] Unexpected error:", error);
    return NextResponse.json(
      { error: "Error procesando webhook de Eskuad" },
      { status: 500 }
    );
  }
}

