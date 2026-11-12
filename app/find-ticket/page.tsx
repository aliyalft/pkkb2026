
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import "./find-ticket.css";
import "../botram-footer.css";

type SearchMethod = "email" | "phone";

export default function FindTicketPage() {
  const router = useRouter();

  const [method, setMethod] = useState<SearchMethod>("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      setError(
        method === "email"
          ? "Masukkan email yang digunakan saat registrasi."
          : "Masukkan nomor HP yang digunakan saat registrasi."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/botram/ticket/find", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method,
          value: value.trim(),
        }),
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Tiket tidak berhasil ditemukan."
        );
      }

      router.push(`/ticket/${encodeURIComponent(result.ticketId)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="botram-find-page">
      <div className="botram-find-container">
  <a href="/" className="botram-back-link">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
  BACK TO PKKB
</a>



        <section className="botram-find-content">
          <div className="botram-find-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5z" />
              <path d="M8 8h8M8 12h5M8 16h3" />
            </svg>
          </div>

          <span className="botram-find-eyebrow">
            PEKAN KEBUDAYAAN KOTA BANDUNG 2026
          </span>

          <h1>
            Cari Tiket
            <br />
            <span>Botram Saya</span>
          </h1>

          <p className="botram-find-description">
            Kehilangan tiket atau belum sempat mengunduhnya?
            Jangan khawatir! Masukkan email atau nomor HP yang
            kamu gunakan saat registrasi untuk menemukan kembali
            tiket Botram kamu.
          </p>

          <form onSubmit={handleSearch} className="botram-find-form">
            <label className="botram-find-label">
              Cari menggunakan
            </label>

            <div className="botram-find-methods">
              <button
                type="button"
                className={method === "email" ? "active" : ""}
                onClick={() => {
                  setMethod("email");
                  setValue("");
                  setError("");
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                Email
              </button>

              <button
                type="button"
                className={method === "phone" ? "active" : ""}
                onClick={() => {
                  setMethod("phone");
                  setValue("");
                  setError("");
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="6" y="2" width="12" height="20" rx="2" />
                  <path d="M10 18h4" />
                </svg>
                Nomor HP
              </button>
            </div>

            <label
              htmlFor="find-ticket-value"
              className="botram-find-label"
            >
              {method === "email" ? "Alamat Email" : "Nomor HP"}
            </label>

            <input
              id="find-ticket-value"
              type={method === "email" ? "email" : "tel"}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (error) setError("");
              }}
              placeholder={
                method === "email"
                  ? "contoh@email.com"
                  : "Contoh: 081234567890"
              }
              autoComplete={method === "email" ? "email" : "tel"}
              required
            />

            {error && (
              <div className="botram-find-error">
                <span>!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="botram-find-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="botram-find-spinner" />
                  Mencari tiket...
                </>
              ) : (
                <>
                  Cari Tiket
                  
                </>
              )}
            </button>
          </form>

          <div className="botram-find-help">
            <span className="botram-find-help-icon">i</span>
            <p>
              Gunakan data kontak yang sama persis dengan
              yang kamu masukkan saat registrasi Botram.
            </p>
          </div>

          <div className="botram-find-register">
            Belum pernah registrasi? <a href="/register">Daftar di sini</a>
          </div>
        </section>
      </div>

<footer className="botram-register-footer">
  <div className="botram-footer-main">
    <div>
      <span className="botram-footer-eyebrow">
        PEKAN KEBUDAYAAN KOTA BANDUNG
      </span>
      <h2>
        NGAMUMULE BUDAYA,
        <br />
        NGAWANGUN KOTA.
      </h2>
    </div>

    <span className="botram-footer-year">2026</span>
  </div>

  <div className="botram-footer-bottom">
    <span>
      © 2026 PEKAN KEBUDAYAAN KOTA BANDUNG
    </span>

    <div className="botram-footer-credits">
      <div className="botram-footer-powered">
        <span>POWERED BY</span>
        <img src="/image/tactlink.png" alt="TactLink" />
      </div>

      <div className="botram-footer-developed">
        <span>DEVELOPED BY</span>
        <a
          href="https://www.linkedin.com/in/aliyahalfitarossa/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ALIYAH ALFITA ROSSA
        </a>
      </div>
    </div>
  </div>
</footer>

    </main>
  );
}
