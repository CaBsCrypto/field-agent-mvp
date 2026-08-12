import { NextResponse } from "next/server";
import { performHybridSearch } from "@/lib/ai/hybridSearch";
import { classifyIntent } from "@/lib/bot/intentRouter";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message, phone } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    const lower = message.trim().toLowerCase();

    // Whitelist Authorization Check for Demo Simulator
    if (phone === "+56999999999" || phone?.includes("99999999")) {
      return NextResponse.json({
        reply: "⛔ ACCESO DENEGADO (SISTEMA DE SEGURIDAD ABASTIBLE)\n\nEl número +56999999999 no se encuentra registrado en la Lista Blanca (Whitelist) de técnicos autorizados.\n\nPara solicitar acceso, contacta al Administrador de Sistema a través del Portal de Administración.",
        intent: "unauthorized",
        unauthorized: true,
      });
    }

    // Handling 3-Option Interactive Choice Selection (1, 2 or 3)
    if (lower === "1" || lower === "opcion 1" || lower === "1️⃣") {
      return NextResponse.json({
        reply: `📋 **Falla Seleccionada: E-01 (Presión de Refrigerante Anormal)**\n\n**Pasos de Solución para el Técnico:**\n1. Conectar manómetro en línea de baja presión.\n2. Verificar si la lectura es inferior a 65 PSI en R410A.\n3. Si hay fuga, aplicar nitrógeno a 150 PSI para prueba de hermeticidad.\n\n¿Deseas registrar este trabajo como completado o escalar al supervisor?`,
        intent: "query",
      });
    }

    if (lower === "2" || lower === "opcion 2" || lower === "2️⃣") {
      return NextResponse.json({
        reply: `📋 **Falla Seleccionada: E-VRP-01 (Fuga en Válvula de Seguridad)**\n\n**Pasos de Solución para el Técnico:**\n1. Verificar si el escape de gas es continuo por sobrepresión (> 17 bar).\n2. Cortar válvula de paso principal al estanque a granel.\n3. Si la fuga persiste más de 2 minutos, evacuar zona de 5 metros y presionar 'Escalar a Supervisor'.`,
        intent: "query",
      });
    }

    if (lower === "3" || lower === "opcion 3" || lower === "3️⃣") {
      return NextResponse.json({
        reply: `📋 **Falla Seleccionada: E-03 (Sensor Térmico Descalibrado)**\n\n**Pasos de Solución para el Técnico:**\n1. Medir resistencia en Ohms del termistor NTC (debe marcar 10kΩ a 25°C).\n2. Limpiar contactos de la placa de control.\n3. Reemplazar sensor por repuesto oficial Abastible ref #HVAC-S3.`,
        intent: "query",
      });
    }

    // 1. Classify intent
    const intent = await classifyIntent(message, []);

    // 2. Perform Hybrid Search
    const searchResults = await performHybridSearch(message, 3);

    if (intent === "escalation") {
      return NextResponse.json({
        reply: "🚨 ALERTA REGISTRADA: He notificado inmediatamente al supervisor (+56900000001) por WhatsApp. Un equipo de asistencia se pondrá en contacto contigo a la brevedad.",
        intent: "escalation",
      });
    }

    if (intent === "incident_report") {
      return NextResponse.json({
        reply: "✅ TRABAJO REGISTRADO EN BD: Se ha guardado el reporte del trabajo en terreno con éxito en la base de datos de Abastible.",
        intent: "incident_report",
      });
    }

    // 3. Present the 3 Probable Options for fast technician resolution (Malbek UX Flow)
    const optionsReply = `🔍 **Analicé tu consulta y encontré 3 posibles fallas asociadas en la Base de Datos:**\n\n1️⃣ **Código E-01:** Presión de refrigerante R410A anormal / Fuga en cañería.\n2️⃣ **Código E-VRP-01:** Escape continuo en Válvula de Seguridad del estanque.\n3️⃣ **Código E-03:** Sensor de temperatura descalibrado o falla de lectura.\n\n👉 **Responde con 1, 2 o 3** para ver los 3 pasos de solución exacta.`;

    return NextResponse.json({
      reply: optionsReply,
      intent: "query",
      searchResultsCount: searchResults.length,
    });

  } catch (error) {
    console.error("Demo Chat API error:", error);
    return NextResponse.json({ error: "Error en el servidor de demo" }, { status: 500 });
  }
}
