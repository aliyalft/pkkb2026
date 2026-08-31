"use client";

import { useState } from "react";

const partners = [
  {
    number: "01",
    name: "PEMERINTAH KOTA",
    type: "GOVERNMENT",
    description:
      "Kolaborator dalam menciptakan ruang kebudayaan yang inklusif dan berkelanjutan.",
  },
  {
    number: "02",
    name: "KOMUNITAS",
    type: "COMMUNITY",
    description:
      "Penggerak yang menghadirkan cerita, karya, dan praktik budaya dari masyarakat.",
  },
  {
    number: "03",
    name: "PELAKU KREATIF",
    type: "CREATIVE",
    description:
      "Membawa ide, karya, dan perspektif baru ke dalam ekosistem kebudayaan kota.",
  },
  {
    number: "04",
    name: "MITRA",
    type: "PARTNER",
    description:
      "Mendukung terwujudnya pengalaman PKKB melalui kolaborasi lintas sektor.",
  },
];

const logos = [
  "PARTNER / 01",
  "PARTNER / 02",
  "PARTNER / 03",
  "PARTNER / 04",
  "PARTNER / 05",
  "PARTNER / 06",
];

export default function Partners() {
  const [active, setActive] = useState(0);

  const current = partners[active] ?? partners[0]!;

  return (
    <section id="partners" className="pkkb-partners pkkb-section">
      <div className="pkkb-container">
        {/* HEADER */}
        <div className="pkkb-partners-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              PARTNERS
            </div>

            <h2>
              Tumbuh
              <br />
              <em>bersama.</em>
            </h2>
          </div>

          <p>
            PKKB hadir melalui kolaborasi. Karena kebudayaan
            menjadi lebih hidup ketika banyak gagasan bertemu
            dalam satu ruang.
          </p>
        </div>

        {/* LOGO MARQUEE */}
        <div className="pkkb-partners-marquee">
          <div className="pkkb-partners-track">
            {[...logos, ...logos].map((logo, index) => (
              <div
                className="pkkb-partner-logo"
                key={`${logo}-${index}`}
              >
                <span>✦</span>
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* PARTNER TYPES */}
        <div className="pkkb-partners-content">
          <div className="pkkb-partners-index">
            <span>COLLABORATION INDEX</span>

            <div className="pkkb-partners-index-line" />
          </div>

          <div className="pkkb-partners-list">
            {partners.map((partner, index) => (
              <button
                key={partner.number}
                type="button"
                className={`pkkb-partner-item ${
                  active === index ? "active" : ""
                }`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span className="pkkb-partner-number">
                  {partner.number}
                </span>

                <span className="pkkb-partner-name">
                  {partner.name}
                </span>

                <span className="pkkb-partner-type">
                  {partner.type}
                </span>

                <span className="pkkb-partner-arrow">
                  ↗︎
                </span>
              </button>
            ))}
          </div>

          <div className="pkkb-partner-detail">
            <span>{current.type}</span>

            <h3>{current.name}</h3>

            <p key={current.number}>
              {current.description}
            </p>
          </div>
        </div>

        {/* BOTTOM STATEMENT */}
        <div className="pkkb-partners-bottom">
          <span>PKKB / COLLABORATION</span>

          <p>
            Banyak pihak.
            <br />
            <em>Satu perayaan.</em>
          </p>

          <span>2026</span>
        </div>
      </div>
    </section>
  );
}