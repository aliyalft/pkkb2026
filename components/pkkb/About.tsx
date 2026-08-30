"use client";

import { useState } from "react";

const values = [
  {
    number: "01",
    title: "BERBAGI",
    description:
      "Berbagi pengetahuan, karya, cerita, dan pengalaman budaya yang tumbuh dari masyarakat Kota Bandung.",
    detail:
      "Budaya menjadi ruang untuk saling belajar dan meneruskan pengetahuan antar generasi.",
  },
  {
    number: "02",
    title: "KESETARAAN",
    description:
      "Membuka ruang yang setara bagi masyarakat untuk berpartisipasi, berkarya, dan merayakan keberagaman budaya.",
    detail:
      "Setiap komunitas memiliki kesempatan untuk hadir, bersuara, dan menjadi bagian dari perayaan.",
  },
  {
    number: "03",
    title: "PERJUMPAAN",
    description:
      "Mempertemukan berbagai komunitas, generasi, gagasan, dan ekspresi budaya dalam satu ruang kota.",
    detail:
      "Pertemuan menjadi awal dari kolaborasi baru dan pengalaman budaya yang lebih hidup.",
  },
];

export default function About() {
  const [active, setActive] = useState(0);

  const current = values[active];

  return (
    <section id="about" className="pkkb-about pkkb-section">
      <div className="pkkb-container">
        {/* Header */}
        <div className="pkkb-about-header">
          <div className="pkkb-section-eyebrow">
            <span />
            TENTANG PKKB
          </div>

          <div className="pkkb-about-heading">
            <h2>
              Budaya yang
              <br />
              <span>hidup</span> di tengah kota.
            </h2>

            <p>
              Pekan Kebudayaan Kota Bandung hadir sebagai ruang
              perayaan, perjumpaan, dan kolaborasi yang menghidupkan
              keberagaman budaya masyarakat Bandung.
            </p>
          </div>
        </div>

        {/* Interactive area */}
        <div className="pkkb-about-content">
          {/* Left visual */}
          <div className="pkkb-about-visual">
            <div className="pkkb-about-orbit orbit-one" />
            <div className="pkkb-about-orbit orbit-two" />

            <div className="pkkb-about-number">
              <span>0</span>
              <strong>{active + 1}</strong>
            </div>

            <div className="pkkb-about-word">
              {current.title}
            </div>

            <div className="pkkb-about-caption">
              <span>NGAMUMULE BUDAYA</span>
              <span>2026</span>
            </div>
          </div>

          {/* Right content */}
          <div className="pkkb-about-info">
            <div className="pkkb-about-tabs">
              {values.map((value, index) => (
                <button
                  key={value.title}
                  type="button"
                  className={`pkkb-about-tab ${
                    active === index ? "active" : ""
                  }`}
                  onClick={() => setActive(index)}
                >
                  <span>{value.number}</span>
                  <strong>{value.title}</strong>
                </button>
              ))}
            </div>

            <div className="pkkb-about-copy" key={current.title}>
              <span className="pkkb-about-copy-index">
                {current.number} / 03
              </span>

              <h3>{current.title}</h3>

              <p>{current.description}</p>

              <div className="pkkb-about-detail">
                <span className="pkkb-about-detail-line" />
                <p>{current.detail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="pkkb-about-statement">
          <span>01</span>

          <p>
            “Ngamumule Budaya, Ngawangun Kota” bukan sekadar tema,
            tetapi ajakan untuk menjaga budaya sekaligus membangun
            kota melalui partisipasi masyarakat.
          </p>

          <span>PKKB 2026</span>
        </div>
      </div>
    </section>
  );
}