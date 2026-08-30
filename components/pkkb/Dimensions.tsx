"use client";

import { useState } from "react";

const dimensions = [
  {
    number: "01",
    title: "PANGAN",
    description:
      "Merayakan pangan sebagai bagian dari identitas, tradisi, dan ruang perjumpaan masyarakat.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "02",
    title: "SENI",
    description:
      "Memberi ruang bagi karya dan ekspresi seni untuk hadir, bertemu, dan berkembang bersama.",
    image:
      "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "03",
    title: "TRADISI",
    description:
      "Menghidupkan kembali nilai dan praktik budaya yang diwariskan lintas generasi.",
    image:
      "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "04",
    title: "KOMUNITAS",
    description:
      "Mempertemukan berbagai komunitas untuk berbagi cerita, gagasan, dan pengalaman.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
  },
  {
    number: "05",
    title: "RUANG KOTA",
    description:
      "Menjadikan ruang publik sebagai tempat bertemu, berekspresi, dan merayakan kebudayaan.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function Dimensions() {
  const [active, setActive] = useState(0);

  const current = dimensions[active] ?? dimensions[0]!;

  return (
    <section
      id="dimensions"
      className="pkkb-dimensions pkkb-section"
    >
      <div className="pkkb-container">
        {/* Header */}
        <div className="pkkb-dimensions-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              DIMENSIONS
            </div>

            <h2>
              Banyak wajah,
              <br />
              <em>satu kota.</em>
            </h2>
          </div>

          <p>
            Kebudayaan hadir dalam berbagai bentuk. Dari apa
            yang kita makan, karya yang kita lihat, hingga ruang
            tempat kita bertemu.
          </p>
        </div>

        {/* Main interactive area */}
        <div className="pkkb-dimensions-main">
          {/* Image */}
          <div className="pkkb-dimensions-image">
            <div
              className="pkkb-dimensions-image-bg"
              style={{
                backgroundImage: `url(${current.image})`,
              }}
            />

            <div className="pkkb-dimensions-image-overlay" />

            <div className="pkkb-dimensions-image-number">
              {current.number}
            </div>

            <div className="pkkb-dimensions-image-label">
              PKKB / CULTURAL DIMENSIONS
            </div>
          </div>

          {/* List */}
          <div className="pkkb-dimensions-list">
            {dimensions.map((item, index) => (
              <button
                key={item.number}
                type="button"
                className={`pkkb-dimension-item ${
                  active === index ? "active" : ""
                }`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span className="pkkb-dimension-number">
                  {item.number}
                </span>

                <span className="pkkb-dimension-title">
                  {item.title}
                </span>

                <span className="pkkb-dimension-arrow">
                  ↗
                </span>
              </button>
            ))}

            {/* Description */}
            <div className="pkkb-dimensions-description">
              <span>ABOUT THIS SPACE</span>

              <p key={current.number}>
                {current.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}