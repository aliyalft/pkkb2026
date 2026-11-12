
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminShell from "../components/AdminShell";
import "./redeem-history.css";

type RedeemRecord = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  district: string;
  menu_code: string | null;
  menu_name: string | null;
  ticket_code: string | null;
  created_at: string;
  redeemed_at: string | null;
};

type DateFilter = "all" | "today" | "week" | "month";

export default function RedeemHistoryPage() {
  const router = useRouter();

  const [records, setRecords] = useState<RedeemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selected, setSelected] = useState<RedeemRecord | null>(null);
  const [error, setError] = useState("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login?next=%2Fadmin%2Fredeem-history");
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from("botram_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      router.replace("/admin/login");
      return;
    }

    const { data, error: historyError } = await supabase
      .from("botram_registrations")
      .select("*")
      .not("redeemed_at", "is", null)
      .order("redeemed_at", { ascending: false });

    if (historyError) {
      setError("Riwayat redeem gagal dimuat. Silakan coba lagi.");
      setRecords([]);
    } else {
      setRecords((data ?? []) as RedeemRecord[]);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  const filteredRecords = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    const now = new Date();

    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(
      startOfWeek.getDate() - (day === 0 ? 6 : day - 1)
    );

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    return records.filter((item) => {
      const matchesSearch =
        !keyword ||
        [
          item.name,
          item.phone,
          item.email,
          item.city,
          item.district,
          item.menu_name,
          item.menu_code,
          item.ticket_code,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(keyword));

      const redeemedDate = item.redeemed_at
        ? new Date(item.redeemed_at)
        : null;

      let matchesDate = true;

      if (redeemedDate && dateFilter === "today") {
        matchesDate = redeemedDate >= startOfToday;
      } else if (redeemedDate && dateFilter === "week") {
        matchesDate = redeemedDate >= startOfWeek;
      } else if (redeemedDate && dateFilter === "month") {
        matchesDate = redeemedDate >= startOfMonth;
      }

      return matchesSearch && matchesDate;
    });
  }, [records, search, dateFilter]);

  const todayCount = records.filter((item) => {
    if (!item.redeemed_at) return false;

    const date = new Date(item.redeemed_at);
    const now = new Date();

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }).length;

  const uniqueMenus = new Set(
    records.map((item) => item.menu_code).filter(Boolean)
  ).size;

  function formatDate(value: string | null) {
    if (!value) return "-";

    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function exportCSV() {
    const headers = [
      "Nama Pengunjung",
      "Nomor Telepon",
      "Email",
      "Kota",
      "Kecamatan",
      "Menu",
      "Kode Menu",
      "Kode Tiket",
      "Tanggal Pendaftaran",
      "Waktu Redeem",
    ];

    const rows = filteredRecords.map((item) => [
      item.name,
      item.phone,
      item.email ?? "",
      item.city,
      item.district,
      item.menu_name ?? "",
      item.menu_code ?? "",
      item.ticket_code ?? "",
      formatDate(item.created_at),
      formatDate(item.redeemed_at),
    ]);

    const escapeCSV = (value: string) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `riwayat-redeem-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell onLogout={handleLogout}>
      <main className="redeem-history-page">
        <div className="redeem-history-header">
          <div>
            <span className="redeem-history-eyebrow">
              BOTRAM MANAGEMENT
            </span>
            <h1>Riwayat Redeem</h1>
            <p>
              Pantau seluruh tiket yang sudah berhasil digunakan oleh
              pengunjung.
            </p>
          </div>

          <div className="redeem-history-actions">
            <button
              type="button"
              className="redeem-refresh-button"
              onClick={loadHistory}
              disabled={loading}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 7v5h-5" />
                <path d="M4 17v-5h5" />
                <path d="M5.6 9a7 7 0 0 1 11.8-2L20 12" />
                <path d="M4 12l2.6 5a7 7 0 0 0 11.8-2" />
              </svg>
              Refresh
            </button>

            <button
              type="button"
              className="redeem-export-button"
              onClick={exportCSV}
              disabled={filteredRecords.length === 0}
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="m7 10 5 5 5-5" />
                <path d="M5 17v4h14v-4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <section className="redeem-history-stats">
          <div className="redeem-stat-card">
            <span>Total Tiket Redeem</span>
            <strong>{records.length}</strong>
            <small>Seluruh tiket yang digunakan</small>
          </div>

          <div className="redeem-stat-card">
            <span>Redeem Hari Ini</span>
            <strong>{todayCount}</strong>
            <small>Tiket digunakan hari ini</small>
          </div>

          <div className="redeem-stat-card">
            <span>Jenis Menu Digunakan</span>
            <strong>{uniqueMenus}</strong>
            <small>Menu dengan tiket redeem</small>
          </div>
        </section>

        <section className="redeem-history-card">
          <div className="redeem-history-card-heading">
            <div>
              <h2>Aktivitas Redeem</h2>
              <p>
                {filteredRecords.length} riwayat ditampilkan
              </p>
            </div>
          </div>

          <div className="redeem-history-toolbar">
            <div className="redeem-search">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                placeholder="Cari nama, kode tiket, menu, atau kota..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value as DateFilter)
              }
              className="redeem-date-filter"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>

          {error && (
            <div className="redeem-history-error">{error}</div>
          )}

          <div className="redeem-table-wrapper">
            <table className="redeem-table">
              <thead>
                <tr>
                  <th>Pengunjung</th>
                  <th>Menu</th>
                  <th>Kode Tiket</th>
                  <th>Wilayah</th>
                  <th>Tanggal Redeem</th>
                  <th>Status</th>
                  <th>Detail</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="redeem-empty">
                      Memuat riwayat redeem...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="redeem-empty">
                      Belum ada riwayat redeem yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="redeem-person">
                          <strong>{item.name}</strong>
                          <span>{item.phone}</span>
                        </div>
                      </td>

                      <td>
                        <div className="redeem-menu">
                          <strong>{item.menu_name || "-"}</strong>
                          <span>{item.menu_code || "-"}</span>
                        </div>
                      </td>

                      <td>
                        <span className="redeem-ticket-code">
                          {item.ticket_code || "-"}
                        </span>
                      </td>

                      <td>
                        <div className="redeem-region">
                          <strong>{item.city}</strong>
                          <span>{item.district}</span>
                        </div>
                      </td>

                      <td className="redeem-date">
                        {formatDate(item.redeemed_at)}
                      </td>

                      <td>
                        <span className="redeem-status">
                          <span />
                          Redeemed
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="redeem-detail-button"
                          onClick={() => setSelected(item)}
                        >
                          Lihat
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selected && (
          <div
            className="redeem-modal-overlay"
            onClick={() => setSelected(null)}
          >
            <section
              className="redeem-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="redeem-modal-header">
                <div>
                  <span>DETAIL RIWAYAT REDEEM</span>
                  <h2>{selected.name}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Tutup detail"
                >
                  ×
                </button>
              </div>

              <div className="redeem-detail-grid">
                <div>
                  <span>Nomor Telepon</span>
                  <strong>{selected.phone}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selected.email || "-"}</strong>
                </div>

                <div>
                  <span>Kota</span>
                  <strong>{selected.city}</strong>
                </div>

                <div>
                  <span>Kecamatan</span>
                  <strong>{selected.district}</strong>
                </div>

                <div>
                  <span>Menu</span>
                  <strong>{selected.menu_name || "-"}</strong>
                </div>

                <div>
                  <span>Kode Menu</span>
                  <strong>{selected.menu_code || "-"}</strong>
                </div>

                <div>
                  <span>Kode Tiket</span>
                  <strong>{selected.ticket_code || "-"}</strong>
                </div>

                <div>
                  <span>Tanggal Pendaftaran</span>
                  <strong>{formatDate(selected.created_at)}</strong>
                </div>

                <div className="redeem-detail-full">
                  <span>Waktu Redeem</span>
                  <strong>{formatDate(selected.redeemed_at)}</strong>
                </div>
              </div>

              <div className="redeem-modal-status">
                <span />
                Tiket berhasil digunakan
              </div>

              <button
                type="button"
                className="redeem-modal-close"
                onClick={() => setSelected(null)}
              >
                Tutup Detail
              </button>
            </section>
          </div>
        )}
      </main>
    </AdminShell>
  );
}
