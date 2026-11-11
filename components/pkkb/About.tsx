
"use client";

import { useState } from "react";

const values = [
  {
    number: "01",
    title: "BERBAGI",
    description:
      "Setiap komunitas membawa praktik kebudayaannya untuk dinikmati bersama.",
    detail:
      "Seperti dalam tradisi Botram, setiap orang membawa sesuatu untuk dibagikan dan dinikmati bersama.",
  },
  {
    number: "02",
    title: "KESETARAAN",
    description:
      "Semua praktik kebudayaan hadir dalam ruang yang setara dan terbuka.",
    detail:
      "PKKB menjadi ruang yang memberi kesempatan bagi berbagai komunitas dan praktik budaya untuk hadir bersama.",
  },
  {
    number: "03",
    title: "PERJUMPAAN",
    description:
      "Ruang kolaboratif yang menghubungkan masyarakat, komunitas, dan ruang kota.",
    detail:
      "Melalui perjumpaan, berbagai praktik kebudayaan dapat saling terhubung dan memperkuat ekosistem budaya Kota Bandung.",
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
              Kota Bandung tumbuh melalui berbagai praktik kebudayaan
              yang hidup di tengah masyarakat. Melalui Pekan
              Kebudayaan Kota Bandung 2026, berbagai praktik tersebut
              dipertemukan dalam ruang yang terbuka, partisipatif,
              dan kolaboratif.
            </p>
          </div>
        </div>

        {/* Interactive Values */}
        <div className="pkkb-about-content">
          {/* Left Visual */}
          <div className="pkkb-about-visual">
            <div className="pkkb-about-orbit orbit-one" />
            <div className="pkkb-about-orbit orbit-two" />

            <div className="pkkb-about-visual-content">
              <span className="pkkb-about-visual-label">
                PEKAN KEBUDAYAAN KOTA BANDUNG
              </span>

              <h3>
                Ngamumule
                <br />
                <span>Budaya,</span>
                <br />
                Ngawangun
                <br />
                <span>Kota.</span>
              </h3>

              <div className="pkkb-about-visual-footer">
                <span>BOTRAM</span>
                <span>PKKB 2026</span>
              </div>
            </div>
          </div>

          {/* Right Content */}
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
                NILAI {current.number}
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

        {/* Bottom Statement */}
        <div className="pkkb-about-statement">
          <p>
            “Ngamumule Budaya, Ngawangun Kota” menegaskan bahwa
            pembangunan kota tidak dapat dipisahkan dari upaya
            merawat kebudayaan. Sebuah ajakan untuk tumbuh bersama
            melalui kolaborasi dan partisipasi masyarakat.
          </p>

          <span>PEKAN KEBUDAYAAN KOTA BANDUNG 2026</span>
        </div>
      </div>
    </section>
  );
}
