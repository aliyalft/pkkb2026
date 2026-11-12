"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { supabase } from "@/lib/supabase";
import AdminShell from "../components/AdminShell";
import "./scan.css";

type RedeemResult = {
  success: boolean;
  status: string;
  message: string;
  name?: string;
  city?: string;
  district?: string;
  menuCode?: string;
  menuName?: string;
  ticketCode?: string;
  redeemedAt?: string;
};

type HistoryItem = {
  id: string;
  name: string;
  city: string;
  menuName: string;
  ticketCode: string;
  redeemedAt: string;
};

type RegistrationRow = {
  id: string;
  name: string;
  city: string | null;
  menu_name: string | null;
  ticket_code: string | null;
  redeemed_at: string | null;
};

export default function AdminScanPage() {
  const router = useRouter();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const processingRef = useRef(false);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [flashActive, setFlashActive] = useState(false); // State untuk efek kedip kamera
  const [ticketCode, setTicketCode] = useState("");
  const [result, setResult] = useState<RedeemResult | null>(null);
  const [error, setError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState({ total: 0, redeemed: 0 });
  const [loadingData, setLoadingData] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoadingData(true);

    try {
      const { data, error } = await supabase
        .from("botram_registrations")
        .select("id,name,city,menu_name,ticket_code,redeemed_at")
        .order("redeemed_at", { ascending: false, nullsFirst: false });

      if (error) throw error;

      const rows = (data ?? []) as RegistrationRow[];
      const redeemedRows = rows.filter((row) => row.redeemed_at);

      setStats({
        total: rows.length,
        redeemed: redeemedRows.length,
      });

      setHistory(
        redeemedRows.slice(0, 8).map((row) => ({
          id: row.id,
          name: row.name,
          city: row.city ?? "-",
          menuName: row.menu_name ?? "-",
          ticketCode: row.ticket_code ?? "-",
          redeemedAt: row.redeemed_at as string,
        }))
      );
    } catch (err) {
      console.error("LOAD SCAN DASHBOARD ERROR:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // AUTHENTICATION
  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.replace("/admin/login?next=%2Fadmin%2Fscan");
          return;
        }

        const { data: admin, error } = await supabase
          .from("botram_admins")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error || !admin) {
          await supabase.auth.signOut();
          router.replace("/admin/login?next=%2Fadmin%2Fscan");
          return;
        }
      } catch (err) {
        console.error("ADMIN AUTH ERROR:", err);
        if (mounted) setError("Gagal memeriksa akses admin.");
      } finally {
        if (mounted) setCheckingAuth(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!checkingAuth) loadDashboardData();
  }, [checkingAuth, loadDashboardData]);

  // STOP SCANNER
  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      setScanning(false);
      return;
    }

    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch (err) {
      console.error("SCANNER STOP ERROR:", err);
    } finally {
      scannerRef.current = null;
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner?.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  // REDEEM TICKET (Kamera tetap terbuka dan mendeteksi berbagai status tiket)
  const redeemTicket = useCallback(async (rawCode: string) => {
    const cleanCode = rawCode.trim().toUpperCase();

    if (!cleanCode || processingRef.current) return;

    processingRef.current = true;
    setSubmitting(true);
    setTicketCode(cleanCode);
    setError("");
    setResult(null);

    // Picu efek kedip (flash) kamera saat berhasil menangkap QR
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 400);

    try {
      const response = await fetch("/api/botram/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode: cleanCode }),
      });

      const responseText = await response.text();
      let data: RedeemResult;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("REDEEM RESPONSE BUKAN JSON:", responseText);
        throw new Error(
          `Respons server tidak valid (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        // Tangkap pesan error dari server (misal: sudah diredeem / tidak ditemukan)
        setResult({
          success: false,
          status: data.status || "ERROR",
          message: data.message || `Server error: ${response.status}`,
          ticketCode: cleanCode,
        });
        return;
      }

      setResult(data);

      if (data.status === "REDEEMED") {
        await loadDashboardData();
      }
    } catch (err) {
      console.error("BOTRAM REDEEM ERROR:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan koneksi."
      );
    } finally {
      setSubmitting(false);
      // Beri jeda sebentar sebelum processingRef dibuka kembali agar tidak double scan instan
      setTimeout(() => {
        processingRef.current = false;
      }, 1500);
    }
  }, [loadDashboardData]);

  // START SCANNER
  async function startScanner() {
    if (scanning || submitting) return;

    setError("");
    setResult(null);
    setTicketCode("");

    try {
      const scanner = new Html5Qrcode("botram-qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 230, height: 230 },
          aspectRatio: 1,
        },
        async (decodedText) => {
          if (processingRef.current) return;
          await redeemTicket(decodedText);
        },
        () => {}
      );

      setScanning(true);
    } catch (err) {
      console.error("SCANNER START ERROR:", err);
      scannerRef.current = null;
      setScanning(false);
      setError(
        "Kamera tidak dapat dibuka. Izinkan akses kamera atau masukkan kode tiket secara manual."
      );
    }
  }

  async function handleManualRedeem() {
    if (!ticketCode.trim() || submitting || scanning) return;
    await redeemTicket(ticketCode);
  }

  function resetTicket() {
    setTicketCode("");
    setError("");
    setResult(null);
    processingRef.current = false;
  }

  async function handleLogout() {
    await stopScanner();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const progress =
    stats.total > 0
      ? Math.round((stats.redeemed / stats.total) * 100)
      : 0;

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const resultTitle =
    result?.status === "REDEEMED"
      ? "Redeem Berhasil!"
      : result?.status === "ALREADY_REDEEMED"
        ? "Tiket Sudah Digunakan"
        : result?.status === "NOT_FOUND"
          ? "Tiket Tidak Ditemukan"
          : "Validasi Gagal";

  const resultIsSuccess = result?.status === "REDEEMED";
  const resultIsAlready = result?.status === "ALREADY_REDEEMED";

  if (checkingAuth) {
    return (
      <AdminShell onLogout={handleLogout}>
        <main className="botram-scan-page">
          <div className="botram-scan-loading">
            <span className="botram-scan-spinner" />
            Memeriksa akses panitia...
          </div>
        </main>
      </AdminShell>
    );
  }

  return (
    <AdminShell onLogout={handleLogout}>
      <main className="botram-scan-page">
        <div className="botram-scan-orb botram-scan-orb-one" />
        <div className="botram-scan-orb botram-scan-orb-two" />
        <div className="botram-scan-orb botram-scan-orb-three" />

        <div className="botram-scan-container">
          <header className="botram-scan-header">
            <div>
              <span className="botram-scan-eyebrow">
                PEKAN KEBUDAYAAN KOTA BANDUNG 2026
              </span>
              <h1>
                Ticket <em>Scanner.</em>
              </h1>
              <p>
                Validasi tiket dan proses redeem menu peserta Botram dengan mudah.
              </p>
            </div>

            <button
              type="button"
              className="botram-scan-help-button"
              onClick={() => setShowHelp(true)}
              aria-label="Panduan scanner"
            >
              ?
            </button>
          </header>

          <section className="botram-scan-stats">
            <div className="botram-scan-stat-main">
              <div className="botram-scan-stat-copy">
                <span>KEHADIRAN BOTRAM</span>
                <strong>
                  {stats.redeemed}
                  <small> / {stats.total} tiket</small>
                </strong>
                <p>
                  {loadingData ? "Memperbarui data..." : "Total tiket yang telah berhasil diredeem"}
                </p>
              </div>
              <div className="botram-scan-stat-percent">{progress}%</div>
            </div>

            <div className="botram-scan-progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="botram-scan-stat-bottom">
              <span>
                <i className="is-redeemed" />
                Sudah redeem <strong>{stats.redeemed}</strong>
              </span>
              <span>
                <i className="is-pending" />
                Belum redeem <strong>{Math.max(stats.total - stats.redeemed, 0)}</strong>
              </span>
            </div>
          </section>

          <section className="botram-scan-card">
            <div className="botram-scan-card-heading">
              <div className="botram-scan-card-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 9h8v6H8zM11 9v6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <span>VALIDASI TIKET</span>
                <h2>Scan QR Code Peserta</h2>
                <p>Arahkan QR pada tiket ke dalam bingkai kamera.</p>
              </div>
            </div>

            {/* BINGKAI KAMERA DENGAN EFEK FLASH / KEDIP KETIKA BERHASIL MENANGKAP QR */}
            <div className="botram-qr-reader-wrapper">
              <div className={`botram-qr-reader-frame ${flashActive ? "is-camera-flash" : ""}`}>
                <div id="botram-qr-reader" />
                {!scanning && (
                  <div className="botram-scan-camera-placeholder">
                    <div className="botram-scan-camera-icon">
                      <svg viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
                      </svg>
                    </div>
                    <strong>Kamera siap digunakan</strong>
                    <span>Tekan tombol di bawah untuk memulai pemindaian.</span>
                  </div>
                )}
              </div>
            </div>

            {/* HASIL REDEEM / VALIDASI INLINE (MENDETEKSI BERBAGAI KONDISI TIKET) */}
            {result && (
              <div className={`botram-inline-result-box ${resultIsSuccess ? "is-success" : resultIsAlready ? "is-warning" : "is-error"}`}>
                <div className="botram-inline-result-header">
                  <span className="botram-inline-symbol">{resultIsSuccess ? "✓" : resultIsAlready ? "!" : "×"}</span>
                  <div>
                    <span className="botram-inline-kicker">{resultIsSuccess ? "VALIDASI BERHASIL" : "HASIL VALIDASI"}</span>
                    <h3 className="botram-inline-title">{resultTitle}</h3>
                  </div>
                </div>

                <p className="botram-inline-message">{result.message}</p>

                {result.name && (
                  <div className="botram-inline-details">
                    <div className="botram-inline-detail-row">
                      <span>NAMA PESERTA</span>
                      <strong className="botram-bold-text">{result.name}</strong>
                    </div>
                    <div className="botram-inline-detail-row">
                      <span>MENU PILIHAN</span>
                      <strong className="botram-bold-menu">{result.menuName || "-"}</strong>
                    </div>
                    <div className="botram-inline-detail-row">
                      <span>KODE TIKET</span>
                      <strong className="botram-bold-text">{result.ticketCode || ticketCode || "-"}</strong>
                    </div>
                    {result.city && (
                      <div className="botram-inline-detail-row">
                        <span>KOTA / KABUPATEN</span>
                        <strong>{result.city}</strong>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  className="botram-scan-reset"
                  onClick={resetTicket}
                  disabled={submitting}
                >
                  Scan Tiket Berikutnya
                </button>
              </div>
            )}

            <button
              type="button"
              className={scanning ? "botram-scan-camera-button is-stop" : "botram-scan-camera-button"}
              onClick={scanning ? stopScanner : startScanner}
              disabled={submitting}
            >
              {scanning ? "Tutup Kamera" : "Buka Kamera"}
            </button>

            <div className="botram-scan-or-divider">
              <span />
              <small>ATAU GUNAKAN KODE TIKET</small>
              <span />
            </div>

            <div className="botram-scan-manual">
              <label htmlFor="ticket-code-input">KODE TIKET</label>
              <input
                id="ticket-code-input"
                type="text"
                placeholder="Contoh: COL-XXXXXXXXXX"
                value={ticketCode}
                onChange={(event) => {
                  setTicketCode(event.target.value.toUpperCase());
                  setResult(null);
                  setError("");
                }}
                disabled={submitting}
              />
              <button
                type="button"
                className="botram-scan-manual-button"
                onClick={handleManualRedeem}
                disabled={!ticketCode.trim() || submitting}
              >
                {submitting ? "MEMPROSES TIKET..." : "VALIDASI & REDEEM"}
              </button>
            </div>

            {submitting && (
              <div className="botram-scan-processing">
                <span className="botram-scan-spinner" />
                Sedang memvalidasi tiket...
              </div>
            )}

            {error && (
              <div className="botram-scan-inline-error">
                <strong>Terjadi kesalahan</strong>
                <span>{error}</span>
              </div>
            )}
          </section>

          <section className="botram-scan-history-card">
            <button
              type="button"
              className="botram-scan-history-toggle"
              onClick={() => setHistoryOpen(true)}
            >
              <span className="botram-scan-history-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="botram-scan-history-copy">
                <strong>Riwayat Redeem</strong>
                <small>Lihat aktivitas redeem terbaru</small>
              </span>
              <span className="botram-scan-history-count">{history.length}</span>
              <span className="botram-scan-history-arrow">›</span>
            </button>
          </section>

          <footer className="botram-scan-footer">
            BOTRAM · PEKAN KEBUDAYAAN KOTA BANDUNG 2026
          </footer>
        </div>

        {/* RIWAYAT REDEEM MODAL */}
        {historyOpen && (
          <div className="botram-scan-modal-backdrop" onClick={() => setHistoryOpen(false)}>
            <section
              className="botram-scan-help-modal botram-scan-history-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="botram-scan-history-title"
            >
              <button
                type="button"
                className="botram-scan-modal-close"
                onClick={() => setHistoryOpen(false)}
                aria-label="Tutup riwayat"
              >
                ×
              </button>
              
              <span className="botram-scan-help-kicker">AKTIVITAS TERBARU</span>
              <h2 id="botram-scan-history-title">Riwayat Redeem</h2>
              <p className="botram-scan-history-subtitle">{history.length} aktivitas terakhir</p>

              <div className="botram-scan-history-modal-body">
                {history.length === 0 ? (
                  <div className="botram-scan-history-empty">
                    Belum ada tiket yang berhasil diredeem.
                  </div>
                ) : (
                  history.map((item) => (
                    <article className="botram-scan-history-item" key={item.id}>
                      <div className="botram-scan-history-check">✓</div>
                      <div className="botram-scan-history-info">
                        <strong>{item.name}</strong>
                        <span>{item.menuName} · {item.ticketCode}</span>
                        <small>{item.city}</small>
                      </div>
                      <time>{formatDate(item.redeemedAt)}</time>
                    </article>
                  ))
                )}
              </div>

              <button
                type="button"
                className="botram-scan-result-done"
                onClick={() => setHistoryOpen(false)}
              >
                Tutup
              </button>
            </section>
          </div>
        )}

        {showHelp && (
          <div className="botram-scan-modal-backdrop" onClick={() => setShowHelp(false)}>
            <section
              className="botram-scan-help-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="botram-scan-help-title"
            >
              <button
                type="button"
                className="botram-scan-modal-close"
                onClick={() => setShowHelp(false)}
                aria-label="Tutup panduan"
              >
                ×
              </button>
              <span className="botram-scan-help-kicker">PANDUAN PETUGAS</span>
              <h2 id="botram-scan-help-title">Cara menggunakan scanner</h2>
              <ol>
                <li><strong>Buka Kamera</strong><span>Tekan tombol untuk mengaktifkan kamera perangkat.</span></li>
                <li><strong>Arahkan QR Code</strong><span>Posisikan QR tiket peserta di dalam area kamera.</span></li>
                <li><strong>Tunggu validasi</strong><span>Sistem akan memeriksa tiket dan status redeem secara otomatis.</span></li>
                <li><strong>Periksa hasilnya</strong><span>Pastikan status berhasil sebelum peserta mengambil menu.</span></li>
                <li><strong>Scan berikutnya</strong><span>Tekan tombol scan berikutnya untuk melanjutkan.</span></li>
              </ol>
              <button
                type="button"
                className="botram-scan-result-done"
                onClick={() => setShowHelp(false)}
              >
                Mengerti
              </button>
            </section>
          </div>
        )}
      </main>
    </AdminShell>
  );
}