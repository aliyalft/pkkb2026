"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./admin-shell.css";

type AdminShellProps = {
  children: React.ReactNode;
  onLogout: () => void;
};

const navigation = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Data Pengunjung", href: "/admin/registrations", icon: "users" },
  { label: "Manajemen Menu", href: "/admin/menus", icon: "utensils" },
  { label: "Scan Tiket", href: "/admin/scan", icon: "scan" },
  { label: "Riwayat Redeem", href: "/admin/redeem-history", icon: "history" },
];

function NavIcon({ name }: { name: string }) {
  const common = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "utensils":
      return (
        <svg {...common}>
          <path d="M3 2v7a4 4 0 0 0 4 4h1V2" />
          <path d="M7 2v20M3 6h5" />
          <path d="M16 2v20M16 2c3 2 4 5 4 9h-4" />
        </svg>
      );
    case "scan":
      return (
        <svg {...common}>
          <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
          <path d="M4 12h16M8 9v6M12 9v6M16 9v6" />
        </svg>
      );
    case "history":
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
          <path d="M3 3v5h5M12 7v5l3 2" />
        </svg>
      );
    default:
      return null;
  }
}

function HamburgerIcon() {
  return (
    <span className="admin-hamburger-lines">
      <span />
      <span />
      <span />
    </span>
  );
}

export default function AdminShell({ children, onLogout }: AdminShellProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className={`admin-shell ${menuOpen ? "menu-open" : ""}`}>
      {/* Overlay Mobile */}
      <button
        type="button"
        className={`admin-mobile-overlay ${menuOpen ? "is-visible" : ""}`}
        onClick={closeMenu}
        aria-label="Tutup navigasi"
      />

      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-sidebar-logo">P</div>
          <div>
            <strong>PKKB 2026</strong>
            <span>ADMIN PORTAL</span>
          </div>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={closeMenu}
            aria-label="Tutup menu"
          >
            ×
          </button>
        </div>

        <div className="admin-sidebar-label">MENU UTAMA</div>

        <nav className="admin-sidebar-nav">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={`admin-nav-item ${isActive ? "is-active" : ""}`}
              >
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-event">
            <span>EVENT</span>
            <strong>
              Pekan Kebudayaan
              <br />
              Kota Bandung 2026
            </strong>
            <small>BOTRAM MANAGEMENT</small>
          </div>

          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={onLogout}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 17l5-5-5-5M15 12H3" />
              <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="admin-shell-main">
        {/* MOBILE HEADER DENGAN TEMA WARNA UNGU GRADASI */}
        <header className="admin-mobile-header">
          <button
            type="button"
            className="admin-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka navigasi"
            aria-expanded={menuOpen}
          >
            <HamburgerIcon />
          </button>

          <div>
            <strong>PKKB 2026</strong>
            <span>ADMIN PORTAL</span>
          </div>
        </header>

        <div className="admin-shell-content">{children}</div>
      </div>
    </div>
  );
}