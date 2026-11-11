
"use client";

import { useState } from "react";

const talents = [
  {
    number: "01",
    name: "TALENT 01",
    role: "MUSISI",
    description:
      "Menghadirkan musik tradisi dan kontemporer yang menjadi bagian dari keberagaman bunyi Kota Bandung.",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "02",
    name: "TALENT 02",
    role: "SENIMAN",
    description:
      "Membawa karya dan ekspresi seni untuk membuka ruang apresiasi dan perjumpaan.",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "03",
    name: "TALENT 03",
    role: "PERFORMER",
    description:
      "Menghidupkan panggung melalui pertunjukan yang menghubungkan tradisi dan generasi hari ini.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "04",
    name: "TALENT 04",
    role: "KOMUNITAS",
    description:
      "Menghadirkan semangat kolaborasi komunitas dalam merawat kebudayaan Kota Bandung.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function Talent() {
  const [active, setActive] = useState(0);

  const current = talents[active] ?? talents[0]!;

  return (
    <section id="talent" className="pkkb-talent pkkb-section">
      <div className="pkkb-container">
        {/* Header */}
        <div className="pkkb-talent-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              TALENT & PERFORMER
            </div>

            <h2>
              Mereka yang
              <br />
              <em>menghidupkan.</em>
            </h2>
          </div>

          <div className="pkkb-talent-intro">
            <span>PKKB 2026</span>
            <p>
              Ruang bagi para talenta, seniman, dan komunitas
              untuk merayakan keberagaman budaya Kota Bandung.
            </p>
          </div>
        </div>

        {/* Showcase */}
        <div className="pkkb-talent-showcase">
          {/* Image */}
          <div className="pkkb-talent-image-wrap">
            <div
              key={current.image}
              className="pkkb-talent-image"
              style={{
                backgroundImage: `url(${current.image})`,
              }}
            />

            <div className="pkkb-talent-overlay" />

            <div className="pkkb-talent-image-top">
              <span>{current.number}</span>
              <span>PKKB / 2026</span>
            </div>

            <div className="pkkb-talent-image-bottom">
              <span>{current.role}</span>
              <h3>{current.name}</h3>
            </div>
          </div>

          {/* Info */}
          <div className="pkkb-talent-info">
            <div className="pkkb-talent-counter">
              <strong>{current.number}</strong>
              <span>/ {String(talents.length).padStart(2, "0")}</span>
            </div>

            <div className="pkkb-talent-copy" key={current.name}>
              <span>FEATURED CATEGORY</span>

              <h3>{current.role}</h3>

              <p>{current.description}</p>

              <div className="pkkb-talent-announcement">
                <span />
                LINEUP AKAN DIUMUMKAN
              </div>
            </div>

            {/* Navigation */}
            <div className="pkkb-talent-navigation">
              {talents.map((talent, index) => (
                <button
                  key={talent.number}
                  type="button"
                  aria-label={`Lihat kategori ${talent.role}`}
                  aria-pressed={active === index}
                  className={active === index ? "active" : ""}
                  onClick={() => setActive(index)}
                >
                  <span>{talent.number}</span>
                  <div
                    style={{
                      backgroundImage: `url(${talent.image})`,
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom information */}
        <div className="pkkb-talent-footer">
          <span>RUANG EKSPRESI</span>
          <p>
            Musik <i>✦</i> Seni <i>✦</i> Pertunjukan{" "}
            <i>✦</i> Komunitas
          </p>
        </div>
      </div>
    </section>
  );
}
