
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import "./admin.css";

type Registration = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  district: string;
  proof_path: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofLoading, setProofLoading] = useState(false);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        router.replace("/admin/login");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("botram_admins")
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      const { data, error: queryError } = await supabase
        .from("botram_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setRegistrations((data || []) as Registration[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat data pendaftar."
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const filteredRegistrations = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return registrations.filter((item) => {
      const matchesSearch =
        !keyword ||
        [
          item.name,
          item.phone,
          item.email || "",
          item.city,
          item.district,
        ].some((value) =>
          value.toLowerCase().includes(keyword)
        );

      const created = new Date(item.created_at);
      const today = new Date();

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "today" &&
          created.toDateString() === today.toDateString()) ||
        (dateFilter === "week" &&
          created.getTime() >=
            today.getTime() - 7 * 24 * 60 * 60 * 1000) ||
        (dateFilter === "month" &&
          created.getMonth() === today.getMonth() &&
          created.getFullYear() === today.getFullYear());

      return matchesSearch && matchesDate;
    });
  }, [registrations, search, dateFilter]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();

    return registrations.filter(
      (item) =>
        new Date(item.created_at).toDateString() === today
    ).length;
  }, [registrations]);

  const uniqueCities = useMemo(
    () => new Set(registrations.map((item) => item.city)).size,
    [registrations]
  );

  function formatDate(value: string) {
    return new Date(value).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function openDetail(item: Registration) {
    setSelected(item);
    setProofUrl("");
    setProofLoading(true);

    try {
      const { data, error } = await supabase.storage
        .from("botram-proofs")
        .createSignedUrl(item.proof_path, 300);

      if (error) throw error;

      setProofUrl(data.signedUrl);
    } catch {
      setError("Bukti tidak dapat dibuka. Periksa akses Storage.");
    } finally {
      setProofLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function exportCSV() {
    const headers = [
      "Nama",
      "WhatsApp",
      "Email",
      "Kota/Kabupaten",
      "Kecamatan",
      "Tanggal Registrasi",
      "Path Bukti",
    ];

    const escapeCSV = (value: string) => {
      const safeValue = /^[=+\-@]/.test(value)
        ? `'${value}`
        : value;

      return `"${safeValue.replace(/"/g, '""')}"`;
    };

    const rows = filteredRegistrations.map((item) => [
      item.name,
      item.phone,
      item.email || "",
      item.city,
      item.district,
      formatDate(item.created_at),
      item.proof_path,
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `botram-pendaftar-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <a href="/" className="admin-sidebar-brand">
          <span className="admin-brand-mark">P</span>
          <span>
            <strong>PKKB</strong>
            <small>ADMIN PORTAL</small>
          </span>
        </a>

        <div className="admin-sidebar-label">MENU UTAMA</div>

        <a href="/admin" className="admin-nav-item active">
          <span>▦</span>
          Dashboard
        </a>

        <div className="admin-sidebar-label admin-sidebar-bottom-label">
          SISTEM
        </div>

        <button
          className="admin-nav-item admin-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Keluar
        </button>

        <div className="admin-sidebar-footer">
          <strong>BOTRAM</strong>
          <span>PEKAN KEBUDAYAAN KOTA BANDUNG</span>
          <span>2026</span>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              PKKB 2026 / MANAGEMENT
            </span>
            <h1>Dashboard.</h1>
          </div>

          <button
            className="admin-refresh-button"
            onClick={loadRegistrations}
            disabled={loading}
          >
            ↻ <span>Refresh data</span>
          </button>
        </header>

        {error && (
          <div className="admin-error admin-page-error">
            {error}
          </div>
        )}

        <div className="admin-welcome">
          <div>
            <span>REGISTRATION MANAGEMENT</span>
            <h2>Selamat datang, Admin.</h2>
            <p>
              Pantau dan kelola data pengunjung
              Botram PKKB 2026.
            </p>
          </div>
          <div className="admin-welcome-year">2026</div>
        </div>

        <section className="admin-stat-grid">
          <article className="admin-stat-card">
            <span>TOTAL PENDAFTAR</span>
            <strong>{loading ? "—" : registrations.length}</strong>
            <small>Seluruh registrasi masuk</small>
          </article>

          <article className="admin-stat-card lavender">
            <span>REGISTRASI HARI INI</span>
            <strong>{loading ? "—" : todayCount}</strong>
            <small>Pendaftar pada hari ini</small>
          </article>

          <article className="admin-stat-card blue">
            <span>BUKTI TERUNGGAH</span>
            <strong>{loading ? "—" : registrations.length}</strong>
            <small>Data dengan bukti tersimpan</small>
          </article>

          <article className="admin-stat-card navy">
            <span>WILAYAH TERDAFTAR</span>
            <strong>{loading ? "—" : uniqueCities}</strong>
            <small>Kota/kabupaten berbeda</small>
          </article>
        </section>

        <section className="admin-data-card">
          <div className="admin-data-heading">
            <div>
              <span className="admin-eyebrow">
                DATABASE REGISTRASI
              </span>
              <h2>Data pengunjung</h2>
              <p>
                Daftar pengunjung yang sudah mengirim
                formulir Botram.
              </p>
            </div>

            <button
              className="admin-export-button"
              onClick={exportCSV}
              disabled={filteredRegistrations.length === 0}
            >
              ↓ EXPORT CSV
            </button>
          </div>

          <div className="admin-toolbar">
            <input
              type="search"
              placeholder="Cari nama, WhatsApp, email, atau wilayah..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
            >
              <option value="all">Semua waktu</option>
              <option value="today">Hari ini</option>
              <option value="week">7 hari terakhir</option>
              <option value="month">Bulan ini</option>
            </select>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>NO.</th>
                  <th>NAMA PENGUNJUNG</th>
                  <th>WHATSAPP</th>
                  <th>WILAYAH</th>
                  <th>TANGGAL DAFTAR</th>
                  <th>BUKTI</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      Memuat data pendaftar...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">
                      Tidak ada data pendaftar yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{item.name}</strong>
                        <small className="admin-table-email">
                          {item.email || "Email tidak tersedia"}
                        </small>
                      </td>

                      <td>{item.phone}</td>

                      <td>
                        <strong>{item.city}</strong>
                        <small className="admin-table-email">
                          {item.district}
                        </small>
                      </td>

                      <td>{formatDate(item.created_at)}</td>

                      <td>
                        <button
                          className="admin-proof-button"
                          onClick={() => openDetail(item)}
                        >
                          LIHAT BUKTI
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="admin-table-footer">
            <span>
              Menampilkan {filteredRegistrations.length} dari{" "}
              {registrations.length} pendaftar
            </span>
            <span>BOTRAM · PKKB 2026</span>
          </div>
        </section>

        <footer className="admin-page-footer">
          PEKAN KEBUDAYAAN KOTA BANDUNG · 2026
        </footer>
      </section>

      {selected && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section className="admin-detail-modal">
            <div className="admin-modal-header">
              <div>
                <span className="admin-eyebrow">
                  REGISTRATION DETAIL
                </span>
                <h2>Detail pengunjung.</h2>
              </div>

              <button
                className="admin-modal-close"
                onClick={() => setSelected(null)}
                aria-label="Tutup detail"
              >
                ×
              </button>
            </div>

            <div className="admin-detail-grid">
              <div>
                <span>NAMA LENGKAP</span>
                <strong>{selected.name}</strong>
              </div>
              <div>
                <span>NOMOR WHATSAPP</span>
                <strong>{selected.phone}</strong>
              </div>
              <div>
                <span>EMAIL</span>
                <strong>{selected.email || "Tidak diisi"}</strong>
              </div>
              <div>
                <span>KOTA / KABUPATEN</span>
                <strong>{selected.city}</strong>
              </div>
              <div>
                <span>KECAMATAN</span>
                <strong>{selected.district}</strong>
              </div>
              <div>
                <span>TANGGAL PENDAFTARAN</span>
                <strong>{formatDate(selected.created_at)}</strong>
              </div>
            </div>

            <div className="admin-proof-preview">
              <h3>Bukti download TactLink</h3>

              {proofLoading ? (
                <p>Memuat bukti...</p>
              ) : proofUrl ? (
                <a
                  href={proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="admin-proof-image-link"
                >
                  <img
                    src={proofUrl}
                    alt={`Bukti TactLink ${selected.name}`}
                  />
                  <span>BUKA GAMBAR UKURAN PENUH</span>
                </a>
              ) : (
                <p>Bukti tidak dapat ditampilkan.</p>
              )}
            </div>

            <button
              className="admin-primary-button"
              onClick={() => setSelected(null)}
            >
              TUTUP DETAIL
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
