
"use client";

import { useState } from "react";
import Link from "next/link";
import "./registration-choice-modal.css";

export default function RegistrationChoiceModal() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="pkkb-choice-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setIsOpen(false);
        }
      }}
    >
      <section
        className="pkkb-choice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pkkb-choice-title"
      >
        <button
          type="button"
          className="pkkb-choice-close"
          aria-label="Tutup popup"
          onClick={() => setIsOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="pkkb-choice-content">
          <span className="pkkb-choice-eyebrow">
            PEKAN KEBUDAYAAN KOTA BANDUNG
          </span>

          <h2 id="pkkb-choice-title">
            Selamat
            <br />
            <span>Datang!</span>
          </h2>

          <p className="pkkb-choice-description">
            Mari rayakan budaya dan kebersamaan
            bersama kami di PKKB 2026.
          </p>

          <div className="pkkb-choice-date">
            <svg viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="5"
                width="18"
                height="16"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M16 3V7M8 3V7M3 10H21"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <span>13 – 15 November 2026</span>
          </div>

          <div className="pkkb-choice-actions">
            <Link
              href="/register"
              className="pkkb-choice-button pkkb-choice-primary"
            >
              Daftar Sekarang
            </Link>

            <Link
              href="/find-ticket"
              className="pkkb-choice-button pkkb-choice-secondary"
            >
              Find Ticket
            </Link>
          </div>

          <span className="pkkb-choice-footer">
            NGAMUMULE BUDAYA, NGAWANGUN KOTA.
          </span>
        </div>
      </section>
    </div>
  );
}
