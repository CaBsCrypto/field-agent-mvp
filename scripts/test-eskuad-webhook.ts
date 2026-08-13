import { POST } from "../app/api/eskuad/webhook/route";

async function runTests() {
  console.log("=== EMPIRICAL TEST SUITE: ESKUAD WEBHOOK ROUTE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  function validateSchema(data: any): { valid: boolean; reason?: string } {
    if (typeof data !== "object" || data === null) {
      return { valid: false, reason: "Response body is not an object" };
    }
    if (typeof data.success !== "boolean") {
      return { valid: false, reason: "'success' is not boolean" };
    }
    if (typeof data.message !== "string") {
      return { valid: false, reason: "'message' is not string" };
    }
    if (typeof data.record !== "object" || data.record === null) {
      return { valid: false, reason: "'record' is not object" };
    }
    const { formId, techPhone, equipmentCode, comments, status, timestamp } = data.record;
    if (typeof formId !== "string" || !formId) {
      return { valid: false, reason: "record.formId is not non-empty string" };
    }
    if (typeof techPhone !== "string" || !techPhone) {
      return { valid: false, reason: "record.techPhone is not non-empty string" };
    }
    if (typeof equipmentCode !== "string" || !equipmentCode) {
      return { valid: false, reason: "record.equipmentCode is not non-empty string" };
    }
    if (typeof comments !== "string" || !comments) {
      return { valid: false, reason: "record.comments is not non-empty string" };
    }
    if (status !== "completed") {
      return { valid: false, reason: `record.status is '${status}', expected 'completed'` };
    }
    if (typeof timestamp !== "string" || isNaN(Date.parse(timestamp))) {
      return { valid: false, reason: "record.timestamp is not valid ISO date string" };
    }
    if (data.incidentId !== null && typeof data.incidentId !== "string") {
      return { valid: false, reason: "'incidentId' must be string or null" };
    }
    if (typeof data.whatsappSent !== "boolean") {
      return { valid: false, reason: "'whatsappSent' must be boolean" };
    }
    return { valid: true };
  }

  // -------------------------------------------------------------
  // Test 1: Standard English Payload
  // -------------------------------------------------------------
  try {
    const payload = {
      form_id: "FORM-ENG-001",
      technician_phone: "+56911112222",
      equipment_code: "EQ-ENG-100",
      comments: "English comments text",
      form_title: "English Form Title",
    };
    const req = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await POST(req);
    assert(res.status === 200, "Test 1: Standard English Payload HTTP Status 200", `Got ${res.status}`);
    const data = await res.json();
    const schemaRes = validateSchema(data);
    assert(schemaRes.valid, "Test 1: Schema Conformance", schemaRes.reason);
    assert(data.record.formId === "FORM-ENG-001", "Test 1: form_id mapped correctly", `Got ${data.record.formId}`);
    assert(data.record.techPhone === "+56911112222", "Test 1: technician_phone mapped correctly", `Got ${data.record.techPhone}`);
    assert(data.record.equipmentCode === "EQ-ENG-100", "Test 1: equipment_code mapped correctly", `Got ${data.record.equipmentCode}`);
    assert(data.record.comments === "English comments text", "Test 1: comments mapped correctly", `Got ${data.record.comments}`);
  } catch (e: any) {
    assert(false, "Test 1: Exception thrown", e.message);
  }

  // -------------------------------------------------------------
  // Test 2: Spanish Key Aliases Payload
  // -------------------------------------------------------------
  try {
    const payload = {
      id: "FORM-ESP-002",
      phone: "+56933334444",
      equipment_id: "EQ-ESP-200",
      comentarios: "Comentarios en español",
      nombre_formulario: "Formulario Español",
    };
    const req = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const res = await POST(req);
    assert(res.status === 200, "Test 2: Spanish Aliases Payload HTTP Status 200", `Got ${res.status}`);
    const data = await res.json();
    const schemaRes = validateSchema(data);
    assert(schemaRes.valid, "Test 2: Schema Conformance", schemaRes.reason);
    assert(data.record.formId === "FORM-ESP-002", "Test 2: id alias mapped to formId", `Got ${data.record.formId}`);
    assert(data.record.techPhone === "+56933334444", "Test 2: phone alias mapped to techPhone", `Got ${data.record.techPhone}`);
    assert(data.record.equipmentCode === "EQ-ESP-200", "Test 2: equipment_id alias mapped to equipmentCode", `Got ${data.record.equipmentCode}`);
    assert(data.record.comments === "Comentarios en español", "Test 2: comentarios alias mapped to comments", `Got ${data.record.comments}`);
  } catch (e: any) {
    assert(false, "Test 2: Exception thrown", e.message);
  }

  // -------------------------------------------------------------
  // Test 3: Alternative Key Aliases (tech_phone, notes, observaciones, title, form_name)
  // -------------------------------------------------------------
  try {
    const payloadAlt1 = {
      tech_phone: "+56955556666",
      notes: "Notes content text",
      title: "Title text",
    };
    const req1 = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadAlt1),
    });
    const res1 = await POST(req1);
    const data1 = await res1.json();
    assert(data1.record.techPhone === "+56955556666", "Test 3a: tech_phone alias mapped to techPhone", `Got ${data1.record.techPhone}`);
    assert(data1.record.comments === "Notes content text", "Test 3a: notes alias mapped to comments", `Got ${data1.record.comments}`);

    const payloadAlt2 = {
      observaciones: "Observaciones content text",
      form_name: "Form Name text",
    };
    const req2 = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadAlt2),
    });
    const res2 = await POST(req2);
    const data2 = await res2.json();
    assert(data2.record.comments === "Observaciones content text", "Test 3b: observaciones alias mapped to comments", `Got ${data2.record.comments}`);
  } catch (e: any) {
    assert(false, "Test 3: Exception thrown", e.message);
  }

  // -------------------------------------------------------------
  // Test 4: Priority & Precedence (English primary keys vs Spanish secondary keys)
  // -------------------------------------------------------------
  try {
    const payloadMixed = {
      form_id: "PRIMARY-FORM-ID",
      id: "SECONDARY-ID",
      technician_phone: "+56977778888",
      phone: "+56999990000",
      equipment_code: "PRIMARY-EQ-CODE",
      equipment_id: "SECONDARY-EQ-ID",
      comments: "Primary Comments",
      comentarios: "Secondary Comentarios",
    };
    const req = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadMixed),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(data.record.formId === "PRIMARY-FORM-ID", "Test 4: form_id has precedence over id", `Got ${data.record.formId}`);
    assert(data.record.techPhone === "+56977778888", "Test 4: technician_phone has precedence over phone", `Got ${data.record.techPhone}`);
    assert(data.record.equipmentCode === "PRIMARY-EQ-CODE", "Test 4: equipment_code has precedence over equipment_id", `Got ${data.record.equipmentCode}`);
    assert(data.record.comments === "Primary Comments", "Test 4: comments has precedence over comentarios", `Got ${data.record.comments}`);
  } catch (e: any) {
    assert(false, "Test 4: Exception thrown", e.message);
  }

  // -------------------------------------------------------------
  // Test 5: Empty Payload Defaults
  // -------------------------------------------------------------
  try {
    const req = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    assert(res.status === 200, "Test 5: Empty Payload HTTP Status 200", `Got ${res.status}`);
    const data = await res.json();
    const schemaRes = validateSchema(data);
    assert(schemaRes.valid, "Test 5: Empty Payload Schema Conformance", schemaRes.reason);
    assert(data.record.formId.startsWith("FORM-"), "Test 5: Fallback formId starts with FORM-", `Got ${data.record.formId}`);
    assert(data.record.techPhone === "+56912345678", "Test 5: Fallback techPhone", `Got ${data.record.techPhone}`);
    assert(data.record.equipmentCode === "ESTANQUE-GRANEL-402", "Test 5: Fallback equipmentCode", `Got ${data.record.equipmentCode}`);
    assert(data.record.comments === "Formulario de terreno Eskuad sin comentarios", "Test 5: Fallback comments", `Got ${data.record.comments}`);
  } catch (e: any) {
    assert(false, "Test 5: Exception thrown", e.message);
  }

  // -------------------------------------------------------------
  // Test 6: Invalid / Non-JSON Payload Handling
  // -------------------------------------------------------------
  try {
    const req = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "NOT_VALID_JSON",
    });
    const res = await POST(req);
    assert(res.status === 200, "Test 6: Invalid JSON Payload Handled Gracefully with Status 200", `Got ${res.status}`);
    const data = await res.json();
    const schemaRes = validateSchema(data);
    assert(schemaRes.valid, "Test 6: Schema Conformance on Malformed Input", schemaRes.reason);
  } catch (e: any) {
    assert(false, "Test 6: Exception thrown", e.message);
  }

  // -------------------------------------------------------------
  // Test 7: Null / Falsy Field Handling
  // -------------------------------------------------------------
  try {
    const payloadNulls = {
      form_id: null,
      id: "BACKUP-FORM-ID",
      comments: null,
      comentarios: "BACKUP-COMENTARIOS",
    };
    const req = new Request("http://localhost:3000/api/eskuad/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payloadNulls),
    });
    const res = await POST(req);
    const data = await res.json();
    assert(data.record.formId === "BACKUP-FORM-ID", "Test 7: null form_id falls back to id alias", `Got ${data.record.formId}`);
    assert(data.record.comments === "BACKUP-COMENTARIOS", "Test 7: null comments falls back to comentarios alias", `Got ${data.record.comments}`);
  } catch (e: any) {
    assert(false, "Test 7: Exception thrown", e.message);
  }

  console.log(`\n=== SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
