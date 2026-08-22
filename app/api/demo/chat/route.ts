import { NextResponse } from "next/server";
import { performHybridSearch } from "@/lib/ai/hybridSearch";
import { classifyIntent } from "@/lib/bot/intentRouter";

export async function POST(req: Request) {
  try {
    const { message, phone } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Mensaje inválido" }, { status: 400 });
    }

    // 1. Whitelist Authorization Check for Demo Simulator
    if (phone === "+56999999999" || phone?.includes("99999999")) {
      return NextResponse.json({
        reply: "⛔ ACCESO DENEGADO (SISTEMA DE SEGURIDAD ABASTIBLE)\n\nEl número +56999999999 no se encuentra registrado en la Lista Blanca (Whitelist) de técnicos autorizados.\n\nPara solicitar acceso, contacta al Administrador de Sistema a través del Portal de Administración.",
        intent: "unauthorized",
        unauthorized: true,
      });
    }

    const lower = message.trim().toLowerCase();

    // 2. Interactive Selection Flow (1, 2 or 3)
    if (lower === "1" || lower === "opcion 1" || lower === "1️⃣") {
      return NextResponse.json({
        reply: `📋 **Falla Seleccionada: E-01 (Presión de Refrigerante Anormal en Centrales HVAC Abastible)**\n\n**Pasos de Solución para el Técnico:**\n1. Conectar manómetro en línea de baja presión.\n2. Verificar si la lectura es inferior a 65 PSI en R410A.\n3. Si hay fuga, aplicar nitrógeno a 150 PSI para prueba de hermeticidad en empalmes.\n\n¿Deseas registrar este trabajo como completado o escalar al supervisor?`,
        intent: "query",
      });
    }

    if (lower === "2" || lower === "opcion 2" || lower === "2️⃣") {
      return NextResponse.json({
        reply: `📋 **Falla Seleccionada: E-VRP-01 (Escape Continuo en Válvula de Alivio Abastible Granel)**\n\n**Pasos de Solución para el Técnico:**\n1. Verificar si el escape de gas es por sobrepresión (> 17 bar) o falla mecánica del resorte.\n2. Cortar válvula de paso principal al estanque a granel.\n3. Si la fuga persiste más de 2 minutos, evacuar zona de 5 metros y presionar 'Escalar a Supervisor'.`,
        intent: "query",
      });
    }

    if (lower === "3" || lower === "opcion 3" || lower === "3️⃣") {
      return NextResponse.json({
        reply: `📋 **Falla Seleccionada: E-03 (Sensor Térmico Descalibrado en Bombas GLP)**\n\n**Pasos de Solución para el Técnico:**\n1. Medir resistencia en Ohms del termistor NTC (debe marcar 10kΩ a 25°C).\n2. Limpiar contactos de la placa de control.\n3. Reemplazar sensor por repuesto oficial Abastible ref #HVAC-S3.`,
        intent: "query",
      });
    }

    // 3. Specific Query Matches (Specific Responses per Topic)
    if (lower.includes("siraga") || lower.includes("hermeticidad") || lower.includes("presostato")) {
      return NextResponse.json({
        reply: `⚙️ **Protocolo de Hermeticidad PLC Báscula SIRAGA (Fuga C3):**\n\n1. **Navegación PLC:** Tecla **F3** ➔ **ENTER** ➔ Código **01024** ➔ **GENERAL** ➔ **PLC** ➔ **STEP BY STEP** ➔ Ajustar **SFC de 0 a 1**.\n2. **Verificación de Sensores:** Con la combinación **SHIFT + ESC**, desconectar el *tubing* de aire y bloquearlo con el dedo.\n3. **Diagnóstico:** El sensor debe cambiar su valor de **1 a 0** al taparlo y de **0 a 1** al soltarlo. Si no cambia, confirma que el **Presostato 27 está defectuoso**.`,
        intent: "query",
      });
    }

    if (lower.includes("secuencia") || lower.includes("incidente") || lower.includes("falla")) {
      return NextResponse.json({
        reply: `🚨 **Análisis de Secuencia de Fallas — Incidente Fuga C3:**\n\n- **Falla 1 (Sistema Hermeticidad):** El presostato 27 no detectó la falta de estanqueidad, permitiendo el inicio del llenado.\n- **Falla 2 (Válvula Corte 1A):** Al pulsar la Parada de Emergencia, la válvula de corte de GLP no cerró de inmediato.\n- **Falla 3 (Actuador Anillo):** La válvula mecánica del actuador neumático del carrusel falló en cerrar el paso de fluido.\n\n📢 **Incidencia guardada en DB Abastible** • Notificación enviada al supervisor.`,
        intent: "incident_report",
      });
    }

    if (lower.includes("distancia") || lower.includes("45kg") || lower.includes("sec")) {
      return NextResponse.json({
        reply: `📜 **Normativa SEC Chile (DS 108 / DS 66) para Cilindros GLP 45kg:**\n\n- **Distancia a aperturas (puertas/ventanas):** Mínimo **1,5 metros**.\n- **Distancia a interruptores/fuentes eléctricas:** Mínimo **3,0 metros**.\n- **Distancia a alcantarillados o pozos:** Mínimo **2,0 metros**.\n\nFormulario exigido: **TC11 SEC** para recintos comerciales con > 3 cilindros.`,
        intent: "query",
      });
    }

    if (lower.includes("llenado") || lower.includes("granel") || lower.includes("porcentaje")) {
      return NextResponse.json({
        reply: `⛽ **Límite Máximo de Llenado - Estanques Granel Abastible:**\n\n- **Límite Operativo Obligatorio:** Jamás superar el **85% de la capacidad volumétrica total** del estanque por razones de expansión térmica del GLP.\n- **Presión Normal:** 4.5 a 6.2 bar.\n- **Inspección Quinquenal:** Inspección NCh2427 al día.`,
        intent: "query",
      });
    }

    if (lower.includes("tc11") || lower.includes("formulario")) {
      return NextResponse.json({
        reply: `📋 **Protocolo Formulario TC11 SEC Chile:**\n\nEl formulario **TC11** de la Superintendencia de Electricidad y Combustibles es obligatorio para la inscripción de instalaciones comerciales e industriales que cuenten con una capacidad instalada superior a 3 cilindros de 45kg o estanque a granel.`,
        intent: "query",
      });
    }

    if (lower.includes("fuga masiva") || lower.includes("emergencia") || lower.includes("urgente") || lower.includes("auxilio") || lower.includes("fuga")) {
      return NextResponse.json({
        reply: `🚨 **ALERTA DE EMERGENCIA REGISTRADA EN TIEMPO REAL (CLASE 1):**\n\n📱 **Notificación de WhatsApp enviada al Supervisor Central (+56900000001):**\n*"⚠️ ATENCIÓN: El técnico ${phone} reporta emergencia de Fuga C3 en Carrusel de Llenado. Se requiere asistencia inmediata."*\n\n**Instrucciones de Seguridad en Terreno:**\n1. Evacuar zona de 10 metros a la redonda.\n2. Cortar el suministro principal si es seguro.\n3. Mantener teléfono despejado.`,
        intent: "escalation",
      });
    }

    if (lower.includes("complet") || lower.includes("instalaci") || lower.includes("sin falla")) {
      return NextResponse.json({
        reply: `✅ **REPORTE REGISTRADO EN BASE DE DATOS:**\n\nSe ha guardado el reporte del trabajo en terreno con éxito en el portal de Abastible. Código de ticket #REG-2026-889.`,
        intent: "incident_report",
      });
    }

    // 4. Default Disambiguation Response (3 Probable Options)
    const searchResults = await performHybridSearch(message, 3);
    const optionsReply = `🔍 **Analicé tu consulta para el área de Abastible y encontré 3 posibles fallas asociadas:**\n\n1️⃣ **Código E-01:** Presión de refrigerante R410A anormal / Fuga en cañería.\n2️⃣ **Código E-VRP-01:** Escape continuo en Válvula de Seguridad del estanque a granel.\n3️⃣ **Código E-03:** Sensor de temperatura descalibrado en bombas GLP.\n\n👉 **Responde con 1, 2 o 3** para ver los 3 pasos de solución exacta.`;

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
