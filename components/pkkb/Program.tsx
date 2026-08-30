"use client";

import { useState } from "react";

const programs = [
  {
    number: "01",
    title: "PANGGUNG",
    category: "PERFORMANCE",
    description:
      "Ruang pertunjukan untuk merayakan berbagai ekspresi seni, musik, dan budaya yang tumbuh di kota.",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "02",
    title: "PASAR KREATIF",
    category: "CREATIVE MARKET",
    description:
      "Tempat bertemunya karya, produk lokal, dan pelaku kreatif dalam satu ruang yang hidup.",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "03",
    title: "BOTRAM",
    category: "CULINARY",
    description:
      "Makan bersama sebagai cara sederhana untuk mempertemukan manusia dan merayakan keberagaman.",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "04",
    title: "BINCANG KOTA",
    category: "DISCUSSION",
    description:
      "Percakapan terbuka tentang kota, budaya, dan berbagai gagasan untuk masa depan bersama.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "05",
    title: "KARYA KOTA",
    category: "EXHIBITION",
    description:
      "Menampilkan karya dan cerita yang merepresentasikan wajah kebudayaan masyarakat.",
    image:
      "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=1400&q=85",
  },
  {
    number: "06",
    title: "RUANG ANAK",
    category: "FAMILY",
    description:
      "Ruang bermain dan belajar yang mengajak generasi muda mengenal budaya dengan cara yang menyenangkan.",
    image:
      "https://images.unsplash.com/photo-1504159506876-f8338247a14a?auto=format&fit=crop&w=1400&q=85",
  },
];

export default function Program() {
  const [active, setActive] = useState(0);

  const current = programs[active] ?? programs[0]!;

  return (
    <section id="program" className="pkkb-program pkkb-section">
      <div className="pkkb-container">
        {/* HEADER */}
        <div className="pkkb-program-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              PROGRAM
            </div>

            <h2>
              Datang untuk
              <br />
              <em>mengalami.</em>
            </h2>
          </div>

          <p>
            Bukan sekadar rangkaian acara. Setiap program
            dirancang untuk membuat kamu ikut terlibat,
            bertemu, dan mengalami kebudayaan secara langsung.
          </p>
        </div>

        {/* PROGRAM */}
        <div className="pkkb-program-main">
          {/* IMAGE */}
          <div className="pkkb-program-visual">
            <div
              className="pkkb-program-image"
              style={{
                backgroundImage: `url(${current.image})`,
              }}
            />

            <div className="pkkb-program-overlay" />

            <div className="pkkb-program-meta">
              <span>{current.number}</span>
              <span>{current.category}</span>
            </div>

            <div className="pkkb-program-visual-title">
              <small>NOW SHOWING</small>

              <strong>{current.title}</strong>
            </div>
          </div>

          {/* LIST */}
          <div className="pkkb-program-list">
            {programs.map((program, index) => (
              <button
                key={program.number}
                type="button"
                className={`pkkb-program-item ${
                  active === index ? "active" : ""
                }`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span className="pkkb-program-item-number">
                  {program.number}
                </span>

                <span className="pkkb-program-item-title">
                  {program.title}
                </span>

                <span className="pkkb-program-item-arrow">
                  ↗
                </span>
              </button>
            ))}

            <div className="pkkb-program-description">
              <span>ABOUT THE PROGRAM</span>

              <p key={current.number}>
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pkkb-program-footer">
          <span>06 PROGRAMS</span>

          <div>
            <span>EXPLORE</span>
            <strong>↓</strong>
          </div>

          <span>PKKB 2026</span>
        </div>
      </div>
    </section>
  );
}