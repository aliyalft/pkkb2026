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

  return (
    <header
      className={`pkkb-navbar ${
        scrolled ? "pkkb-navbar-scrolled" : ""
      }`}
    >
      <div className="pkkb-navbar-inner">

        {/* Logo */}
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

        {/* Desktop Navigation */}
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

        {/* Right Actions */}
        <div className="pkkb-navbar-actions">

          <button
            className="pkkb-language"
            type="button"
          >
            ID
            <span className="pkkb-language-divider">
              /
            </span>
            <span>EN</span>
          </button>

          <a
            href="/register"
            className="pkkb-nav-cta"
          >
            Daftar Sekarang
          </a>

        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Navigation */}
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