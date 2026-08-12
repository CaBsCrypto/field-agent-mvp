"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { ShieldCheck, UserPlus, Trash2, Phone, Search, CheckCircle, UserX, AlertCircle } from "lucide-react";

interface WhitelistTech {
  id: string;
  name: string;
  phone: string;
  role: string;
  status: "active" | "blocked";
  createdAt: string;
}

const INITIAL_TECHNICIANS: WhitelistTech[] = [
  { id: "1", name: "Juan Pérez (Técnico HVAC)", phone: "+56912345678", role: "Técnico en Terreno", status: "active", createdAt: "2026-08-01" },
  { id: "2", name: "Carlos Muñoz (Técnico Climatización)", phone: "+56987654321", role: "Técnico en Terreno", status: "active", createdAt: "2026-08-05" },
  { id: "3", name: "Pedro Soto (Supervisor Central)", phone: "+56900000001", role: "Supervisor de Guardia", status: "active", createdAt: "2026-08-02" },
  { id: "4", name: "Gonzalo Tapia (Técnico GLP)", phone: "+56955554433", role: "Técnico en Terreno", status: "active", createdAt: "2026-08-10" },
  { id: "5", name: "Matías Silva (Pruebas Externa)", phone: "+56977778899", role: "Contratista", status: "blocked", createdAt: "2026-08-11" },
];

export default function AdminWhitelistPage() {
  const [technicians, setTechnicians] = useState<WhitelistTech[]>(INITIAL_TECHNICIANS);
  const [searchQuery, setSearchQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("Técnico en Terreno");
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const formattedPhone = newPhone.startsWith("+") ? newPhone : `+${newPhone.replace(/\D/g, "")}`;
    const newTech: WhitelistTech = {
      id: Date.now().toString(),
      name: newName.trim(),
      phone: formattedPhone,
      role: newRole,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTechnicians([newTech, ...technicians]);
    setNewName("");
    setNewPhone("");
    showToast(`✅ Teléfono ${formattedPhone} agregado a la Whitelist de Abastible.`);
  };

  const handleToggleStatus = (id: string) => {
    setTechnicians(
      technicians.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "active" ? "blocked" : "active";
          showToast(nextStatus === "blocked" ? `⛔ Acceso bloqueado para ${t.name}` : `✅ Acceso concedido a ${t.name}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Eliminar definitivamente a ${name} de la Whitelist?`)) {
      setTechnicians(technicians.filter((t) => t.id !== id));
      showToast(`🗑️ ${name} ha sido eliminado de la Lista Blanca.`);
    }
  };

  const filteredTechs = technicians.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFC", color: "#0F172A", fontFamily: "Segoe UI, -apple-system, sans-serif", padding: "24px" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        
        {/* Navigation Header */}
        <AdminHeader />

        {/* Notification Toast */}
        {notification && (
          <div style={{ background: "#003366", color: "#FFF", padding: "12px 20px", borderRadius: "8px", marginBottom: "20px", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <CheckCircle size={16} color="#FF6600" /> {notification}
          </div>
        )}

        {/* Layout Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px" }}>
          
          {/* Left Form: Add New Authorized Technician */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#003366", marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserPlus size={18} color="#FF6600" /> Dar Acceso a Nuevo Técnico
            </h3>
            <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "20px" }}>
              Ingresa el número de celular del técnico para autorizar su acceso al bot de WhatsApp.
            </p>

            <form onSubmit={handleAddTechnician} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Nombre del Técnico / Contratista
                </label>
                <input
                  type="text"
                  placeholder="ej: Roberto Gómez"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Número Celular WhatsApp (+569...)
                </label>
                <input
                  type="text"
                  placeholder="+56912345678"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                  Rol / Especialidad
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "13px", outline: "none", background: "#FFF" }}
                >
                  <option value="Técnico en Terreno">Técnico en Terreno</option>
                  <option value="Supervisor de Guardia">Supervisor de Guardia</option>
                  <option value="Técnico HVAC">Técnico HVAC</option>
                  <option value="Contratista">Contratista Externo</option>
                </select>
              </div>

              <button
                type="submit"
                style={{ background: "#FF6600", border: "none", color: "#FFF", padding: "12px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", cursor: "pointer", marginTop: "6px" }}
              >
                + Dar Acceso Inmediato
              </button>
            </form>
          </div>

          {/* Right Table: Technician Whitelist Control */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "24px", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#003366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={20} color="#059669" /> Lista Blanca de Seguridad (Whitelist Abastible)
                </h2>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
                  Total Autorizados: <strong>{technicians.filter((t) => t.status === "active").length} técnicos activos</strong>
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ position: "relative", width: "240px" }}>
                <input
                  type="text"
                  placeholder="Buscar por nombre o número..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px 8px 32px", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "12px", outline: "none" }}
                />
                <Search size={14} color="#64748B" style={{ position: "absolute", left: "10px", top: "10px" }} />
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", color: "#475569", fontWeight: "700", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "12px" }}>Técnico / Nombre</th>
                    <th style={{ padding: "12px" }}>Número WhatsApp</th>
                    <th style={{ padding: "12px" }}>Rol</th>
                    <th style={{ padding: "12px" }}>Estado Acceso</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechs.map((tech) => {
                    const isActive = tech.status === "active";
                    return (
                      <tr key={tech.id} style={{ borderBottom: "1px solid #E2E8F0", background: isActive ? "#FFFFFF" : "#FEF2F2" }}>
                        <td style={{ padding: "12px", fontWeight: "600", color: "#0F172A" }}>
                          {tech.name}
                        </td>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#003366", fontWeight: "700" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Phone size={13} color="#FF6600" /> {tech.phone}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#475569" }}>
                          <span style={{ background: "#E2E8F0", padding: "3px 8px", borderRadius: "6px", fontSize: "11px" }}>
                            {tech.role}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          {isActive ? (
                            <span style={{ background: "#D1FAE5", color: "#065F46", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle size={12} /> Habilitado
                            </span>
                          ) : (
                            <span style={{ background: "#FEE2E2", color: "#991B1B", padding: "4px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <UserX size={12} /> Bloqueado
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(tech.id)}
                              style={{
                                background: isActive ? "#FEE2E2" : "#D1FAE5",
                                color: isActive ? "#991B1B" : "#065F46",
                                border: "none",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: "700",
                                cursor: "pointer"
                              }}
                            >
                              {isActive ? "Bloquear" : "Reactivar"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tech.id, tech.name)}
                              style={{ background: "#F1F5F9", border: "none", color: "#EF4444", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
