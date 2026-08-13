import { POST } from "../../app/api/eskuad/webhook/route";

async function runTests() {
  console.log("=== Test 1: Full custom dynamic payload ===");
  const req1 = new Request("http://localhost/api/eskuad/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form_id: "FORM-CUSTOM-999",
      technician_phone: "+56987654321",
      equipment_code: "BOMBA-DIESEL-01",
      comments: "Presión fuera de rango normal en válvula de alivio",
      form_title: "Inspección de Emergencia",
    }),
  });

  const res1 = await POST(req1);
  const json1 = await res1.json();
  console.log("Response 1:", JSON.stringify(json1, null, 2));

  console.log("\n=== Test 2: Payload with alternate keys (eskuad variations) ===");
  const req2 = new Request("http://localhost/api/eskuad/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: "FORM-ALT-100",
      phone: "+56900000001",
      equipment_id: "VALVULA-REGULADORA-02",
      comentarios: "Fuga detectada en conector de 1/2 pulgada",
      title: "Mantenimiento Preventivo",
    }),
  });

  const res2 = await POST(req2);
  const json2 = await res2.json();
  console.log("Response 2:", JSON.stringify(json2, null, 2));

  console.log("\n=== Test 3: Empty payload (fallbacks) ===");
  const req3 = new Request("http://localhost/api/eskuad/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const res3 = await POST(req3);
  const json3 = await res3.json();
  console.log("Response 3:", JSON.stringify(json3, null, 2));
}

runTests().catch(console.error);
