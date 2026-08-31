"use client";

import { useEffect, useState } from "react";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Program", href: "#program" },
  { label: "Schedule", href: "#schedule" },
  { label: "Talent", href: "#talent" },
  { label: "Venue", href: "#venue" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  };

  return (
    <header
      className={`pkkb-navbar ${
        scrolled ? "pkkb-navbar-scrolled" : ""
      }`}
    >
      <div className="pkkb-navbar-inner">

        <a
          href="#hero"
          className="pkkb-logo"
          aria-label="Pekan Kebudayaan Kota Bandung"
          onClick={closeMenu}
        >
          <img
            src="/assets/Logo-PKKB-putih.png"
            alt="Pekan Kebudayaan Kota Bandung"
            className="pkkb-logo-image"
          />
        </a>

        <nav
          className="pkkb-nav"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="pkkb-nav-link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="pkkb-navbar-right">

          <button
            type="button"
            className="pkkb-language-switch"
            data-lang={lang}
            onClick={toggleLang}
            aria-label="Switch language"
          >
            <span className="pkkb-language-thumb" />
            <span
              className={`pkkb-language-option ${
                lang === "id" ? "is-active" : ""
              }`}
            >
              ID
            </span>
            <span
              className={`pkkb-language-option ${
                lang === "en" ? "is-active" : ""
              }`}
            >
              EN
            </span>
          </button>

          <div className="pkkb-navbar-actions">
            <a
              href="/register"
              className="pkkb-nav-cta"
            >
              Daftar Sekarang
            </a>
          </div>

          <button
            type="button"
            className={`pkkb-menu-button ${
              menuOpen ? "is-open" : ""
            }`}
            aria-label={
              menuOpen
                ? "Tutup menu"
                : "Buka menu"
            }
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
          >
            <span />
            <span />
          </button>

        </div>

      </div>

      <div
        className={`pkkb-mobile-menu ${
          menuOpen ? "is-open" : ""
        }`}
      >
        <nav aria-label="Mobile navigation">

          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="pkkb-mobile-link"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

        </nav>

        <a
          href="/register"
          className="
            pkkb-button
            pkkb-button-dark
            pkkb-mobile-cta
          "
          onClick={closeMenu}
        >
          Daftar Sekarang
        </a>

      </div>
    </header>
  );
}