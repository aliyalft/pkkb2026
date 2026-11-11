"use client";

import { useEffect, useRef, useState } from "react";


const programs = [
  {
    number: "01",
    title: "BALE BOTRAM",
    category: "RUANG BERKUMPUL",
    description:
      "Jantung Perjumpaan Kota. Paviliun terbuka sebagai pusat aktivitas dan ruang berkumpul festival. Ruang berbagi, berdiskusi, beristirahat, dan membangun relasi. Desain terbuka menyatu dengan lanskap Balai Kota, tanpa sekat antara pelaku dan pengunjung.",
    image:
      "https://miro.medium.com/v2/resize%3Afit%3A1358/format%3Awebp/0%2ANUoYaU0m5H3_6FcB.jpg",
  },
  {
    number: "02",
    title: "DAPUR BANDUNG",
    category: "PANGAN & BUDAYA",
    description:
      "Ruang budaya yang mengangkat pangan sebagai identitas Kota Bandung. Mempertemukan petani, UMKM, juru masak, komunitas, dan masyarakat. Menghadirkan pengalaman belajar, berbagi, dan merawat tradisi melalui makanan. Berangkat dari hasil eksplorasi Popolah Kampung Cibuntu.",
    image:
      "https://radarutara.bacakoran.co/upload/e4e5fcb23a3419c5d8f11f18a613ad46.jpg",
  },
  {
    number: "03",
    title: "PANGGUNG KOTA",
    category: "PERAYAAN KEBUDAYAAN",
    description:
      "Perayaan Kebudayaan Kota. Panggung terbuka sebagai ruang perayaan kebudayaan Kota Bandung. Menghadirkan beragam ekspresi seni dalam satu ruang bersama. Mengubah plaza Balai Kota menjadi alun-alun budaya yang hidup.",
    image:
      "https://asset.kompas.com/crops/Tn4N02IDCMa4cpfswv3cZyWxFZs%3D/0x0%3A1125x750/1200x800/data/photo/2021/03/23/60597d51ca3ea.jpeg",
  },
  {
    number: "04",
    title: "RUMAH KOMUNITAS",
    category: "KOMUNITAS KOTA",
    description:
      "Ruang untuk mempertemukan beragam komunitas Kota Bandung. Menampilkan inisiatif warga di bidang seni, lingkungan, literasi, sejarah, dan lainnya. Mengajak pengunjung mengenal dan terlibat dalam kehidupan budaya kota.",
    image:
      "https://asset.kompas.com/crops/tECfuzJIOWClzRvNcj6OgM3Vjkw%3D/0x0%3A1278x852/1200x900/data/photo/2021/06/13/60c57be0f2bcb.jpeg",
  },
  {
    number: "05",
    title: "KAULINAN KOTA",
    category: "PERMAINAN & INTERAKSI",
    description:
      "Ruang bermain sebagai bagian dari kehidupan dan kebudayaan kota. Menghidupkan kembali permainan tradisional Sunda dan Indonesia. Menghadirkan permainan kreatif yang dikembangkan komunitas. Menjadi ruang interaksi lintas generasi dalam suasana yang inklusif.",
    image:
      "https://cdn01.metrotvnews.com/dynamic/content/2024/12/06/bw6Comz2/a_6752a12bc0b28.jpg?w=720",
  },
  {
    number: "06",
    title: "RUANG BACA KOTA",
    category: "ARSIP & PENGETAHUAN",
    description:
      "Ruang publik untuk membaca, berbagi, dan membangun pengetahuan tentang Bandung. Menghadirkan arsip, buku, foto, peta, dan berbagai narasi kota. Mengajak masyarakat memahami Bandung melalui sejarah, ruang publik, dan pengalaman sehari-hari.",
    image:
      "https://static.republika.co.id/uploads/images/inpicture_slide/seorang-asn-berdiri-di-depan-dokumen-peta-yang-dipajang_220525155751-955.jpg",
  },
];


export default function Program() {
  const [active, setActive] = useState(0);

  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const current = programs[active] ?? programs[0]!;

 useEffect(() => {
  if (active === 0) return;

  if (window.innerWidth > 700) return;

  setTimeout(() => {
    const item = itemRefs.current[active];

    if (!item) return;

    const rect = item.getBoundingClientRect();

    const targetY =
      window.scrollY + rect.top - 100;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, 100);
}, [active]);

  return (
    <section id="program" className="pkkb-program pkkb-section">
      <div className="pkkb-container">

        {/* HEADER */}
        <div className="pkkb-program-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              PROGRAM BOTRAM
            </div>

            <h2>
              Ruang untuk
              <br />
              <em>berjumpa.</em>
            </h2>
          </div>

          <p>
            Ruang-ruang yang dirancang untuk mempertemukan masyarakat,
            komunitas, pelaku budaya, dan berbagai cerita yang tumbuh
            di Kota Bandung.
          </p>
        </div>


        {/* =========================
            DESKTOP PROGRAM
            ========================= */}

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
              <div
                key={program.number}
                className="pkkb-program-mobile-item"
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
              >

                <button
                  type="button"
                  className={`pkkb-program-item ${
                    active === index ? "active" : ""
                  }`}
                  onMouseEnter={() => {
                    if (window.innerWidth > 700) {
                        setActive(index);
                    }
                    }}
                    onFocus={() => {
                    if (window.innerWidth > 700) {
                        setActive(index);
                    }
                    }}
                    onClick={() => setActive(index)}
                >
                  <span className="pkkb-program-item-number">
                    {program.number}
                  </span>

                  <span className="pkkb-program-item-title">
                    {program.title}
                  </span>

                  <span className="pkkb-program-item-arrow">
                    ↗︎
                  </span>
                </button>


                {/* MOBILE DETAIL */}
                {active === index && (
                  <div className="pkkb-program-mobile-detail">

                    <div
                      className="pkkb-program-mobile-image"
                      style={{
                        backgroundImage: `url(${program.image})`,
                      }}
                    />

                    <div className="pkkb-program-mobile-copy">
                      <span>
                        ABOUT THE PROGRAM
                      </span>

                      <p>
                        {program.description}
                      </p>
                    </div>

                  </div>
                )}

              </div>
            ))}


            {/* DESKTOP DESCRIPTION */}
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