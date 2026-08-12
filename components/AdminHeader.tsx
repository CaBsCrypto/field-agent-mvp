"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, Network, AlertTriangle, PhoneCall, ExternalLink, Bot } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Manuales & Base de Datos", href: "/admin/training", icon: BookOpen },
    { label: "Monitoreo Incidencias", href: "/admin/incidents", icon: AlertTriangle },
  ];

  return (
    <header style={{ background: "#003366", borderRadius: "14px", color: "#FFFFFF", padding: "16px 24px", marginBottom: "24px", boxShadow: "0 4px 20px rgba(0, 51, 102, 0.12)", borderLeft: "6px solid #FF6600" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#FF6600", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
            <Bot size={22} />
          </div>
          <div>
            <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#FF6600", background: "rgba(255,102,0,0.15)", padding: "2px 8px", borderRadius: "4px", fontWeight: "700", display: "inline-block" }}>
              PORTAL CORPORATIVO DE ADMINISTRACIÓN
            </div>
            <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "2px 0 0 0" }}>
              Abastible / FieldAgentMVP
            </h1>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            href="/demo"
            target="_blank"
            style={{
              fontSize: "12.5px",
              background: "#FF6600",
              color: "#FFF",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <PhoneCall size={15} /> Probar Chat Técnico (Demo) <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: "flex", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "12px" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontSize: "13px",
                padding: "8px 14px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: isActive ? "700" : "500",
                background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
                color: isActive ? "#FFFFFF" : "#CBD5E1",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: isActive ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent",
                transition: "all 0.2s"
              }}
            >
              <Icon size={16} color={isActive ? "#FF6600" : "#94A3B8"} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
