import { NextResponse } from "next/server";
import { getSemanticKnowledgeContext } from "@/lib/ai/vectorRAG";

const MOCK_WHITELIST = [
  "+56912345678",
  "+56987654321",
  "+56900000001",
];

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    if (!phone || !message) {
      return NextResponse.json({ error: "Parámetros faltantes" }, { status: 400 });
    }

    // 1. Check Whitelist
    if (!MOCK_WHITELIST.includes(phone)) {
      return NextResponse.json({
        reply: "⛔ ACCESO DENEGADO: Tu número de teléfono (" + phone + ") no está registrado en la lista blanca de técnicos autorizados de la empresa. Ponte en contacto con tu supervisor.",
        intent: "unauthorized",
      });
    }

    const msgLower = message.toLowerCase();
    let intent = "query";

    // 2. Classify intent
    if (msgLower.includes("fuga") || msgLower.includes("urgente") || msgLower.includes("peligro") || msgLower.includes("ayuda")) {
      intent = "escalation";
      return NextResponse.json({
        reply: "🚨 ESCALACIÓN REGISTRADA EN TIEMPO REAL\n\nNotificación enviada al WhatsApp del Supervisor (+56900000001):\n'Alerta de técnico en terreno: " + message + "'\n\nPor favor mantente en el lugar seguro y espera la llamada directa del supervisor.",
        intent,
      });
    }

    if (msgLower.includes("completé") || msgLower.includes("instalación") || msgLower.includes("registro") || msgLower.includes("listo")) {
      intent = "incident_report";
      return NextResponse.json({
        reply: "✅ REGISTRO DE TRABAJO EN TERRENO ALMACENADO\n\n- Ubicación: Av. Providencia 1234\n- Equipo: HVAC-200\n- Estado: Completado sin fallas\n- ID Registro DB: INC-" + Math.floor(1000 + Math.random() * 9000) + "\n\nSe ha estandarizado el reporte en la base de datos de la empresa.",
        intent,
      });
    }

    // 3. Perform RAG query over Markdown manuals
    const ragContext = await getSemanticKnowledgeContext(message);

    let replyText = "";
    if (ragContext) {
      replyText = "📖 Estandarización de Proceso Encontrada en Manual Técnico:\n\n" + ragContext.substring(0, 700) + "...\n\n💡 Recuerda seguir el protocolo de seguridad obligatorio antes de manipular los tableros eléctricos.";
    } else {
      replyText = "📖 Consulta basada en Manual HVAC Rev 3:\n\nPara el procedimiento consultado, debes seguir los 3 pasos estandarizados:\n1. Desenergizar el equipo principal en el tablero central.\n2. Medir presión de baja con manómetro digital R410A (rango normal 110-130 PSI).\n3. Verificar consumo de amperaje con pinza amperimétrica.\n\nSi la anomalía persiste, notifica el código de falla en el sistema.";
    }

    return NextResponse.json({
      reply: replyText,
      intent,
    });
  } catch (err) {
    return NextResponse.json({ error: "Error interno en el chat demo" }, { status: 500 });
  }
}
