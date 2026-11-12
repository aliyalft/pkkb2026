"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { toPng } from "html-to-image";
import "./ticket.css";
import "../../find-ticket/find-ticket.css";
import "../../botram-footer.css";

type TicketData = {
  id: string;
  name: string;
  city: string;
  district: string;
  menuCode: string;
  menuName: string;
  ticketCode: string;
  createdAt: string;
  redeemedAt: string | null;
};

export default function TicketPage() {
  const params = useParams<{ id: string }>();
  const ticketId = params.id;

  const ticketRef = useRef<HTMLDivElement>(null);

  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/botram/ticket/${encodeURIComponent(ticketId)}`,
          { cache: "no-store" }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Tiket tidak ditemukan.");
        }

        setTicket(result.ticket);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil tiket."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleDownload = async () => {
    if (!ticketRef.current || downloading) return;

    try {
      setDownloading(true);

      const imageUrl = await toPng(ticketRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `Tiket-Botram-${ticket?.ticketCode}.png`;
      link.href = imageUrl;
      link.click();
    } catch (err) {
      console.error("TICKET DOWNLOAD ERROR:", err);
      alert("Tiket gagal diunduh. Silakan coba kembali.");
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <main className="botram-ticket-page">
        <div className="botram-ticket-loading">
          <div className="botram-ticket-spinner" />
          <p>Menyiapkan tiket kamu...</p>
        </div>
      </main>
    );
  }

  if (error || !ticket) {
    return (
      <main className="botram-ticket-page">
        <div className="botram-ticket-error">
          <a href="/" className="botram-back-link" style={{ marginBottom: "20px" }}>
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
          <span className="botram-ticket-error-label">
            TIKET TIDAK DITEMUKAN
          </span>
          <h1>Oops, ada kendala.</h1>
          <p>{error || "Data tiket tidak tersedia."}</p>
          <a href="/register">Kembali ke halaman registrasi</a>
        </div>
      </main>
    );
  }

  return (
    <main className="botram-ticket-page">
      <section className="botram-ticket-container">
        {/* BACK TO PKKB BUTTON */}
        <div style={{ marginBottom: "20px" }}>
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
        </div>

        <div className="botram-ticket-intro">
          <span className="botram-ticket-eyebrow">
            PEKAN KEBUDAYAAN KOTA BANDUNG 2026
          </span>

          <h1>
            Tiket Botram
            <br />
            <span>berhasil dibuat!</span>
          </h1>

          <p>
            Simpan tiket digital ini dan tunjukkan QR Code kepada
            panitia saat pengambilan menu.
          </p>
        </div>

        <div className="botram-ticket-card" ref={ticketRef}>
          <div className="botram-ticket-card-header">
            <div>
              <span>PEKAN KEBUDAYAAN</span>
              <h2>KOTA BANDUNG</h2>
            </div>

            <span className="botram-ticket-edition">2026</span>
          </div>

          <div className="botram-ticket-card-title">
            <span>BUKTI REGISTRASI</span>
            <h3>Tiket Botram</h3>
          </div>

          <div className="botram-ticket-divider">
            <span />
            <span />
          </div>

          <div className="botram-ticket-participant">
            <span className="botram-ticket-label">
              NAMA PESERTA
            </span>
            <h4>{ticket.name}</h4>

            <div className="botram-ticket-location">
              <div>
                <span className="botram-ticket-label">KOTA/KABUPATEN</span>
                <strong>{ticket.city}</strong>
              </div>

              <div>
                <span className="botram-ticket-label">KECAMATAN</span>
                <strong>{ticket.district}</strong>
              </div>
            </div>
          </div>

          <div className="botram-ticket-menu">
            <span className="botram-ticket-label">
              MENU PILIHAN
            </span>

            <div className="botram-ticket-menu-info">
              <div>
                <span>{ticket.menuCode}</span>
              </div>
              <strong>{ticket.menuName}</strong>
            </div>
          </div>

          <div className="botram-ticket-qr-section">
            <div className="botram-ticket-qr">
              <QRCode
                value={ticket.ticketCode}
                size={190}
                level="H"
                bgColor="#ffffff"
                fgColor="#192246"
              />
            </div>

            <span className="botram-ticket-label">
              SCAN QR CODE SAAT PENGAMBILAN MENU
            </span>

            <strong className="botram-ticket-code">
              {ticket.ticketCode}
            </strong>
          </div>

          <div className="botram-ticket-card-footer">
            <span>NGAMUMULE BUDAYA, NGAWANGUN KOTA.</span>
            <span>PKKB 2026</span>
          </div>
        </div>

        <div className="botram-ticket-actions">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? "Menyiapkan gambar..." : "Download Tiket"}
          </button>

          <p>
            Pastikan QR Code tetap terlihat jelas saat ditunjukkan
            kepada panitia.
          </p>
        </div>

        <div className="botram-ticket-note">
          <span>INFORMASI PENTING</span>
          <p>
            Satu tiket berlaku untuk satu kali pengambilan menu
            sesuai pilihan saat registrasi. QR Code bersifat unik
            dan tidak dapat digunakan berulang kali setelah
            penukaran berhasil.
          </p>
        </div>
      </section>

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