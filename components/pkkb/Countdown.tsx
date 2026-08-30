"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-11-07T09:00:00+07:00");

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(): TimeLeft {
  const difference = EVENT_DATE.getTime() - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24)
    ),

    hours: Math.floor(
      (difference / (1000 * 60 * 60)) % 24
    ),

    minutes: Math.floor(
      (difference / (1000 * 60)) % 60
    ),

    seconds: Math.floor(
      (difference / 1000) % 60
    ),
  };
}

function pad(value: number) {
  return value
    .toString()
    .padStart(2, "0");
}

export default function Countdown() {
  /*
   * Jangan hitung countdown saat initial render.
   *
   * Kalau calculateTimeLeft() dipanggil di sini,
   * server dan browser bisa mendapatkan angka
   * berbeda beberapa milidetik.
   *
   * Contoh:
   * Server → 19 detik
   * Client → 18 detik
   *
   * Itu yang menyebabkan hydration mismatch.
   */
  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  useEffect(() => {
    /*
     * Hitung countdown setelah component
     * sudah mounted di browser.
     */
    setTimeLeft(calculateTimeLeft());

    const timer =
      window.setInterval(() => {
        setTimeLeft(
          calculateTimeLeft()
        );
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, []);

  const items = [
    {
      value: timeLeft.days,
      label: "HARI",
    },

    {
      value: timeLeft.hours,
      label: "JAM",
    },

    {
      value: timeLeft.minutes,
      label: "MENIT",
    },

    {
      value: timeLeft.seconds,
      label: "DETIK",
    },
  ];

  return (
    <section
      className="pkkb-countdown-wrapper"
      aria-label="Countdown Pekan Kebudayaan Kota Bandung"
    >
      <div className="pkkb-countdown-card">

        <div className="pkkb-countdown-intro">

          <span className="pkkb-countdown-kicker">
            COUNTING DOWN TO
          </span>

          <h2>
            PKKB
            <br />
            2026
          </h2>

          <p>
            Sampai jumpa di perayaan budaya
            Kota Bandung.
          </p>

        </div>

        <div className="pkkb-countdown-values">

          {items.map((item, index) => (
            <div
              className="pkkb-countdown-item"
              key={item.label}
            >

              <span className="pkkb-countdown-number">
                {pad(item.value)}
              </span>

              <span className="pkkb-countdown-label">
                {item.label}
              </span>

              {index < items.length - 1 && (
                <span
                  className="pkkb-countdown-separator"
                  aria-hidden="true"
                >
                  :
                </span>
              )}

            </div>
          ))}

        </div>

        <div className="pkkb-countdown-date">

          <span>07</span>

          <div>
            <strong>NOVEMBER</strong>
            <small>2026</small>
          </div>

        </div>

      </div>
    </section>
  );
}