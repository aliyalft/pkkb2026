"use client";

import { useState } from "react";

const pentahelix = [
  {
    number: "01",
    title: "PEMERINTAH",
    short: "POLICY",
    description:
      "Menciptakan ekosistem dan kebijakan yang mendukung keberlanjutan kebudayaan kota.",
  },
  {
    number: "02",
    title: "AKADEMISI",
    short: "KNOWLEDGE",
    description:
      "Mengembangkan pengetahuan, riset, dan perspektif baru untuk membaca kebudayaan.",
  },
  {
    number: "03",
    title: "BISNIS",
    short: "ECONOMY",
    description:
      "Mendorong ekosistem ekonomi kreatif dan membuka ruang kolaborasi yang berkelanjutan.",
  },
  {
    number: "04",
    title: "KOMUNITAS",
    short: "PEOPLE",
    description:
      "Menjadi penggerak utama yang menjaga praktik budaya tetap hidup di tengah masyarakat.",
  },
  {
    number: "05",
    title: "MEDIA",
    short: "STORY",
    description:
      "Menyebarkan cerita dan memperluas jangkauan kebudayaan kepada publik yang lebih luas.",
  },
];

export default function Pentahelix() {
  const [active, setActive] = useState(0);

  const current = pentahelix[active] ?? pentahelix[0]!;

  return (
    <section
      id="pentahelix"
      className="pkkb-pentahelix pkkb-section"
    >
      <div className="pkkb-container">
        {/* Header */}
        <div className="pkkb-penta-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              PENTAHELIX
            </div>

            <h2>
              Lima arah,
              <br />
              <em>satu gerak.</em>
            </h2>
          </div>

          <p>
            Kebudayaan tidak tumbuh sendirian. Ia hadir melalui
            pertemuan berbagai pihak yang bergerak bersama.
          </p>
        </div>

        {/* Interactive area */}
        <div className="pkkb-penta-stage">
          {/* Decorative orbit */}
          <div className="pkkb-penta-orbit pkkb-penta-orbit-one" />
          <div className="pkkb-penta-orbit pkkb-penta-orbit-two" />

          {/* Center */}
          <div className="pkkb-penta-center">
            <div className="pkkb-penta-center-ring">
              <span>PKKB</span>

              <strong>∞</strong>

              <small>COLLABORATION</small>
            </div>
          </div>

          {/* Nodes */}
          {pentahelix.map((item, index) => (
            <button
              key={item.number}
              type="button"
              className={`pkkb-penta-node pkkb-penta-node-${index + 1} ${
                active === index ? "active" : ""
              }`}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              aria-label={`View ${item.title}`}
            >
              <span>{item.number}</span>

              <strong>{item.title}</strong>

              <small>{item.short}</small>
            </button>
          ))}
        </div>

        {/* Active information */}
        <div className="pkkb-penta-detail">
          <div className="pkkb-penta-detail-number">
            {current.number}
          </div>

          <div className="pkkb-penta-detail-title">
            <span>COLLABORATION / {current.short}</span>
            <h3>{current.title}</h3>
          </div>

          <p key={current.number}>{current.description}</p>
        </div>

        {/* Statement */}
        <div className="pkkb-penta-statement">
          <span>✦</span>

          <p>
            Ketika banyak pihak bergerak bersama,
            <br />
            kota menjadi ruang budaya yang hidup.
          </p>
        </div>
      </div>
    </section>
  );
}