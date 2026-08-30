"use client";

import { useState } from "react";

const days = [
  {
    id: "day-1",
    label: "DAY 01",
    date: "07 NOV",
    weekday: "SABTU",
  },
  {
    id: "day-2",
    label: "DAY 02",
    date: "08 NOV",
    weekday: "MINGGU",
  },
];

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
  {
    day: "day-2",
    time: "09.00",
    end: "11.00",
    title: "Workshop Kreatif",
    category: "WORKSHOP",
    location: "Ruang Kreatif",
    description:
      "Lokakarya kreatif yang mengajak pengunjung untuk mengenal budaya melalui praktik langsung.",
  },
  {
    day: "day-2",
    time: "11.00",
    end: "13.00",
    title: "Pertunjukan Budaya",
    category: "SENI",
    location: "Panggung Utama",
    description:
      "Pertunjukan kolaboratif yang menghadirkan ragam ekspresi budaya.",
  },
  {
    day: "day-2",
    time: "13.00",
    end: "15.00",
    title: "Talkshow Budaya",
    category: "DISKUSI",
    location: "Ruang Diskusi",
    description:
      "Percakapan bersama pelaku budaya mengenai keberlanjutan dan masa depan kebudayaan.",
  },
  {
    day: "day-2",
    time: "15.00",
    end: "17.00",
    title: "Kolaborasi Komunitas",
    category: "KOMUNITAS",
    location: "Taman Dewi Sartika",
    description:
      "Kolaborasi lintas komunitas dalam merayakan keberagaman budaya Kota Bandung.",
  },
  {
    day: "day-2",
    time: "17.00",
    end: "18.00",
    title: "Closing Celebration",
    category: "CLOSING",
    location: "Panggung Utama",
    description:
      "Penutupan rangkaian acara dan perayaan bersama seluruh pengunjung, talent, komunitas, dan partner.",
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
  const [activeDay, setActiveDay] = useState("day-1");
  const [activeCategory, setActiveCategory] = useState("SEMUA");
  const [openSchedule, setOpenSchedule] = useState<string | null>(null);

  const filteredSchedules = schedules.filter((item) => {
    const matchDay = item.day === activeDay;

    const matchCategory =
      activeCategory === "SEMUA" ||
      item.category === activeCategory;

    return matchDay && matchCategory;
  });

  return (
    <section id="schedule" className="pkkb-schedule pkkb-section">
      <div className="pkkb-container">
        {/* Header */}
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
            Susun pengalamanmu di PKKB. Pilih hari dan jelajahi
            berbagai aktivitas yang berlangsung sepanjang acara.
          </p>
        </div>

        {/* Day selector */}
        <div className="pkkb-day-selector">
          {days.map((day) => (
            <button
              key={day.id}
              type="button"
              className={`pkkb-day-card ${
                activeDay === day.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveDay(day.id);
                setOpenSchedule(null);
              }}
            >
              <span>{day.label}</span>

              <strong>{day.date}</strong>

              <small>{day.weekday}</small>

              <i>↗</i>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="pkkb-schedule-filters">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category ? "active" : ""
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

        {/* Schedule */}
        <div className="pkkb-schedule-list">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((item, index) => {
              const id = `${item.day}-${item.time}-${index}`;
              const isOpen = openSchedule === id;

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
                      setOpenSchedule(isOpen ? null : id)
                    }
                    aria-expanded={isOpen}
                  >
                    <div className="pkkb-schedule-time">
                      <strong>{item.time}</strong>
                      <span>— {item.end}</span>
                    </div>

                    <div className="pkkb-schedule-title">
                      <span>{item.category}</span>
                      <h3>{item.title}</h3>
                    </div>

                    <div className="pkkb-schedule-location">
                      {item.location}
                    </div>

                    <span className="pkkb-schedule-plus">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`pkkb-schedule-expanded ${
                      isOpen ? "show" : ""
                    }`}
                  >
                    <div>
                      <span className="pkkb-schedule-expanded-line" />
                      <p>{item.description}</p>
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

        {/* Note */}
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