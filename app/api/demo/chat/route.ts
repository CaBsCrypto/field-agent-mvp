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

    // 1. Classify intent
    const intent = await classifyIntent(message, []);

    // 2. Perform ultra-fast Hybrid Search (BM25 exact match + Vector RAG)
    const searchResults = await performHybridSearch(message, 3);
    const context = searchResults.map((r) => r.text).join("\n\n---\n\n");

    // 3. Generate Gemini reply
    let reply = "";
    if (intent === "escalation") {
      reply = "🚨 ALERTA REGISTRADA: He notificado inmediatamente al supervisor (+56900000001) por WhatsApp. Un equipo de asistencia se pondrá en contacto contigo a la brevedad.";
    } else if (intent === "incident_report") {
      reply = "✅ TRABAJO REGISTRADO EN BD: Se ha guardado el reporte del trabajo en terreno con éxito en la base de datos de Abastible.";
    } else {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "your_gemini_api_key_here") {
        reply = `[Hybrid Search Context Found]:\n${context.substring(0, 300)}...`;
      } else {
        const client = new GoogleGenerativeAI(apiKey);
        const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Eres el Copilot Técnico Abastible. Responde al técnico basándote en este contexto normativo:\n\n${context}\n\nPregunta: ${message}`;
        const result = await model.generateContent(prompt);
        reply = result.response.text();
      }
    }

    return NextResponse.json({
      reply,
      intent,
      searchResultsCount: searchResults.length,
      matchTypes: searchResults.map((r) => r.matchType),
    });
  } catch (error) {
    console.error("Demo Chat API error:", error);
    return NextResponse.json({ error: "Error en el servidor de demo" }, { status: 500 });
  }
}
