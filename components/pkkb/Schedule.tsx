"use client";

import { useState } from "react";

const schedules = [
  {
    day: "day-1",
    time: "08.00",
    end: "09.00",
    title: "Registrasi & Welcoming",
    category: "OPENING",
    location: "Taman Dewi Sartika",
    description:
      "Kedatangan peserta dan pengunjung sekaligus pembukaan ruang-ruang pengalaman PKKB.",
  },
  {
    day: "day-1",
    time: "09.00",
    end: "10.00",
    title: "Pembukaan PKKB 2026",
    category: "CEREMONY",
    location: "Panggung Utama",
    description:
      "Pembukaan rangkaian Pekan Kebudayaan Kota Bandung bersama para pemangku kepentingan dan komunitas budaya.",
  },
  {
    day: "day-1",
    time: "10.00",
    end: "12.00",
    title: "Pentas Seni Budaya",
    category: "SENI",
    location: "Panggung Utama",
    description:
      "Pertunjukan seni dan budaya dari berbagai komunitas di Kota Bandung.",
  },
  {
    day: "day-1",
    time: "12.00",
    end: "14.00",
    title: "Jelajah Pangan Lokal",
    category: "PANGAN",
    location: "Ruang Pangan",
    description:
      "Eksplorasi kuliner dan cerita pangan lokal bersama pelaku budaya dan komunitas.",
  },
  {
    day: "day-1",
    time: "14.00",
    end: "16.00",
    title: "Permainan Tradisional",
    category: "PERMAINAN",
    location: "Ruang Bermain",
    description:
      "Berbagai permainan tradisional yang dapat dimainkan bersama lintas generasi.",
  },
  {
    day: "day-1",
    time: "16.00",
    end: "18.00",
    title: "Ruang Perjumpaan",
    category: "KOMUNITAS",
    location: "Taman Badak",
    description:
      "Ruang temu komunitas untuk berbagi cerita, gagasan, dan pengalaman budaya.",
  },
];

const categories = [
  "SEMUA",
  "SENI",
  "PANGAN",
  "KOMUNITAS",
  "WORKSHOP",
  "DISKUSI",
];

export default function Schedule() {
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [openSchedule, setOpenSchedule] = useState<string | null>(null);

  const filteredSchedules = schedules.filter((item) => {
    return (
      activeCategory === "SEMUA" ||
      item.category === activeCategory
    );
  });

  return (
    <section
      id="schedule"
      className="pkkb-schedule pkkb-section"
    >
      <div className="pkkb-container">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="pkkb-schedule-header">

          <div>

            <div className="pkkb-section-eyebrow">
              <span />
              JADWAL ACARA
            </div>

            <h2>
              Temukan
              <br />
              <em>waktumu.</em>
            </h2>

          </div>

          <p>
            Susun pengalamanmu di PKKB. Jelajahi berbagai
            aktivitas yang berlangsung sepanjang acara.
          </p>

        </div>


        {/* =========================================
            EVENT DATE
        ========================================= */}

        <div className="pkkb-schedule-date">

          <span className="pkkb-schedule-date-number">
            07
          </span>

          <div>
            <strong>
              NOVEMBER 2026
            </strong>

            <small>
              SABTU · BANDUNG
            </small>
          </div>

        </div>


        {/* =========================================
            CATEGORY FILTER
        ========================================= */}

        <div className="pkkb-schedule-filters">

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "active"
                  : ""
              }
              onClick={() => {
                setActiveCategory(category);
                setOpenSchedule(null);
              }}
            >
              {category}
            </button>

          ))}

        </div>


        {/* =========================================
            SCHEDULE LIST
        ========================================= */}

        <div className="pkkb-schedule-list">

          {filteredSchedules.length > 0 ? (

            filteredSchedules.map((item, index) => {

              const id =
                `${item.day}-${item.time}-${index}`;

              const isOpen =
                openSchedule === id;

              return (

                <div
                  key={id}
                  className={`pkkb-schedule-row ${
                    isOpen ? "open" : ""
                  }`}
                >

                  <button
                    type="button"
                    className="pkkb-schedule-main"
                    onClick={() =>
                      setOpenSchedule(
                        isOpen ? null : id
                      )
                    }
                    aria-expanded={isOpen}
                  >

                    {/* TIME */}

                    <div className="pkkb-schedule-time">

                      <strong>
                        {item.time}
                      </strong>

                      <span>
                        — {item.end}
                      </span>

                    </div>


                    {/* TITLE */}

                    <div className="pkkb-schedule-title">

                      <span>
                        {item.category}
                      </span>

                      <h3>
                        {item.title}
                      </h3>

                    </div>


                    {/* LOCATION */}

                    <div className="pkkb-schedule-location">
                      {item.location}
                    </div>


                    {/* PLUS */}

                    <span className="pkkb-schedule-plus">
                      {isOpen ? "−" : "+"}
                    </span>

                  </button>


                  {/* EXPANDED DESCRIPTION */}

                  <div
                    className={`pkkb-schedule-expanded ${
                      isOpen ? "show" : ""
                    }`}
                  >

                    <div>

                      <span className="pkkb-schedule-expanded-line" />

                      <p>
                        {item.description}
                      </p>

                    </div>

                  </div>

                </div>

              );

            })

          ) : (

            <div className="pkkb-schedule-empty">
              Belum ada agenda untuk kategori ini.
            </div>

          )}

        </div>


        {/* =========================================
            NOTE
        ========================================= */}

        <div className="pkkb-schedule-note">

          <span>✦</span>

          <p>
            Jadwal dapat berubah sewaktu-waktu. Pantau terus
            informasi terbaru PKKB 2026.
          </p>

        </div>

      </div>
    </section>
  );
}