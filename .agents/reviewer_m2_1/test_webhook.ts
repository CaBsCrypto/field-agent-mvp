import { POST } from "../../app/api/eskuad/webhook/route.ts";

async function runTests() {
  console.log("=== Testing Eskuad Webhook Route Handler with Mocked Fetch ===");

  // Mock global fetch for WhatsApp client to avoid real network call during test
  const originalFetch = global.fetch;
  global.fetch = async (url: any, init: any) => {
    if (url.toString().includes("kapso") || url.toString().includes("graph.facebook")) {
      return new Response(JSON.stringify({ message_id: "wamid.test12345" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return originalFetch(url, init);
  };

  process.env.KAPSO_API_KEY = "kapso_test_key_123";
  process.env.KAPSO_CHANNEL_ID = "channel_test_456";

  const req = new Request("http://localhost:3000/api/eskuad/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form_id: "ESK-1001",
      technician_phone: "+56999887766",
      equipment_code: "COMP-202",
      comments: "Filtro de aire reemplazado",
      form_title: "Mantenimiento Preventivo"
    })
  });

  const res = await POST(req);
  const data = await res.json();
  console.log("Test Status:", res.status);
  console.log("Test Data with Credentials:", JSON.stringify(data, null, 2));

  // Restore fetch
  global.fetch = originalFetch;
}

runTests().catch(console.error);
