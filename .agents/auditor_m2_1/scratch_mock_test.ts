import * as technicians from "../../lib/db/technicians";
import * as incidents from "../../lib/db/incidents";
import * as whatsapp from "../../lib/whatsapp/client";

// Spy tracking
const calls: Record<string, any[]> = {
  getTechnicianByPhone: [],
  saveIncident: [],
  sendTextMessage: [],
};

// Override functions with spies before importing route
(technicians as any).getTechnicianByPhone = async (phone: string, businessId?: string) => {
  calls.getTechnicianByPhone.push({ phone, businessId });
  return { id: "tech_spy_123", name: "Spy Tech", wa_phone: phone };
};

(incidents as any).saveIncident = async (data: any) => {
  calls.saveIncident.push(data);
  return { id: "inc_spy_999", ...data };
};

(whatsapp as any).sendTextMessage = async (to: string, text: string, token: string, phoneId: string) => {
  calls.sendTextMessage.push({ to, text, token, phoneId });
};

// Set env vars
process.env.WHATSAPP_ACCESS_TOKEN = "mock_wa_token_123";
process.env.WHATSAPP_PHONE_NUMBER_ID = "mock_phone_id_456";

import { POST } from "../../app/api/eskuad/webhook/route";

async function verifyCalls() {
  const req = new Request("http://localhost/api/eskuad/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      form_id: "FORM-SPY-888",
      technician_phone: "+56911223344",
      equipment_code: "COMPRESOR-01",
      comments: "Falta aceite en cárter",
      form_title: "Inspección Diaria",
    }),
  });

  const res = await POST(req);
  const json = await res.json();

  console.log("Response JSON:", JSON.stringify(json, null, 2));
  console.log("\nCaptured Function Calls:", JSON.stringify(calls, null, 2));
}

verifyCalls().catch(console.error);
