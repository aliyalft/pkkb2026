
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminShell from "../components/AdminShell";
import "./registrations.css";

type Registration = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string;
  city_id: string;
  district: string;
  proof_path: string;
  created_at: string;
  menu_code: string | null;
  menu_name: string | null;
  ticket_code: string | null;
  redeemed_at: string | null;
};

type FilterStatus = "all" | "redeemed" | "pending";

export default function RegistrationsPage() {
  const router = useRouter();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [proofLoading, setProofLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login?next=%2Fadmin%2Fregistrations");
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

    const { data, error: fetchError } = await supabase
      .from("botram_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError("Data pengunjung gagal dimuat. Silakan coba lagi.");
      setRegistrations([]);
    } else {
      setRegistrations((data ?? []) as Registration[]);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  async function openDetail(item: Registration) {
    setSelected(item);
    setProofUrl("");
    setProofLoading(true);

    const { data, error: storageError } = await supabase.storage
      .from("botram-proofs")
      .createSignedUrl(item.proof_path, 300);

    if (!storageError && data?.signedUrl) {
      setProofUrl(data.signedUrl);
    }

    setProofLoading(false);
  }

  async function handleDelete(item: Registration) {
    if (deletingId) return;

    const redeemedText = item.redeemed_at
      ? "Sudah Redeem"
      : "Belum Redeem";

    const confirmation = window.confirm(
      `Yakin ingin menghapus data pengunjung ini?\n\n` +
        `Nama: ${item.name}\n` +
        `Menu: ${item.menu_name || "Tanpa menu"}\n` +
        `Kode tiket: ${item.ticket_code || "-"}\n` +
        `Status: ${redeemedText}\n\n` +
        `Data akan dihapus permanen dan kuota menu akan dikembalikan 1.`
    );

    if (!confirmation) return;

    setDeletingId(item.id);
    setError("");
    setSuccess("");

    const { data, error: deleteError } = await supabase.rpc(
      "admin_delete_botram_registration",
      {
        p_registration_id: item.id,
      }
    );

    if (deleteError) {
      setError(
        `Gagal menghapus data ${item.name}: ${deleteError.message}`
      );
      setDeletingId(null);
      return;
    }

    const result = data as {
      success?: boolean;
      message?: string;
    } | null;

    if (!result?.success) {
      setError(result?.message || "Penghapusan data gagal.");
      setDeletingId(null);
      return;
    }

    setRegistrations((current) =>
      current.filter((registration) => registration.id !== item.id)
    );

    if (selected?.id === item.id) {
      setSelected(null);
      setProofUrl("");
    }

    setSuccess(
      `Data ${item.name} berhasil dihapus. Kuota menu ${
        item.menu_name || "terkait"
      } telah dikembalikan.`
    );

    setDeletingId(null);
  }

  const filteredRegistrations = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return registrations.filter((item) => {
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

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "redeemed" && !!item.redeemed_at) ||
        (statusFilter === "pending" && !item.redeemed_at);

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  const totalRedeemed = registrations.filter(
    (item) => item.redeemed_at
  ).length;

  const totalPending = registrations.length - totalRedeemed;

  function formatDate(value: string) {
    return new Date(value).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <AdminShell onLogout={handleLogout}>
      <main className="registrations-page">
        <div className="registrations-header">
          <div>
            <span className="registrations-eyebrow">
              BOTRAM MANAGEMENT
            </span>
            <h1>Data Pengunjung</h1>
            <p>
              Kelola dan pantau seluruh data pendaftaran pengunjung Botram.
            </p>
          </div>

          <button
            type="button"
            className="registrations-refresh"
            onClick={loadRegistrations}
            disabled={loading || !!deletingId}
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
            {loading ? "Memuat..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="registrations-error">
            {error}
          </div>
        )}

        {success && (
          <div className="registrations-success">
            {success}
          </div>
        )}

        <section className="registrations-stats">
          <div className="registrations-stat-card">
            <span>Total Pengunjung</span>
            <strong>{registrations.length}</strong>
            <small>Seluruh pendaftaran</small>
          </div>

          <div className="registrations-stat-card">
            <span>Sudah Redeem</span>
            <strong>{totalRedeemed}</strong>
            <small>Tiket telah digunakan</small>
          </div>

          <div className="registrations-stat-card">
            <span>Belum Redeem</span>
            <strong>{totalPending}</strong>
            <small>Tiket belum digunakan</small>
          </div>
        </section>

        <section className="registrations-table-card">
          <div className="registrations-table-heading">
            <div>
              <h2>Daftar Pendaftar</h2>
              <p>
                {filteredRegistrations.length} data ditampilkan
              </p>
            </div>
          </div>

          <div className="registrations-toolbar">
            <div className="registrations-search">
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
                placeholder="Cari nama, tiket, menu, atau kota..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as FilterStatus)
              }
              className="registrations-filter"
            >
              <option value="all">Semua Status</option>
              <option value="redeemed">Sudah Redeem</option>
              <option value="pending">Belum Redeem</option>
            </select>
          </div>

          <div className="registrations-table-wrapper">
            <table className="registrations-table">
              <thead>
                <tr>
                  <th>Pengunjung</th>
                  <th>Wilayah</th>
                  <th>Menu Botram</th>
                  <th>Kode Tiket</th>
                  <th>Tanggal Daftar</th>
                  <th>Status</th>
                  <th>Detail</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="registrations-empty">
                      Memuat data pengunjung...
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="registrations-empty">
                      Tidak ada data pengunjung yang ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="registration-person">
                          <strong>{item.name}</strong>
                          <span>{item.phone}</span>
                        </div>
                      </td>

                      <td>
                        <div className="registration-region">
                          <strong>{item.city}</strong>
                          <span>{item.district}</span>
                        </div>
                      </td>

                      <td>
                        <div className="registration-menu">
                          <strong>{item.menu_name || "-"}</strong>
                          <span>{item.menu_code || "Tanpa menu"}</span>
                        </div>
                      </td>

                      <td>
                        <span className="registration-ticket">
                          {item.ticket_code || "-"}
                        </span>
                      </td>

                      <td className="registration-date">
                        {formatDate(item.created_at)}
                      </td>

                      <td>
                        <span
                          className={`registration-status ${
                            item.redeemed_at
                              ? "is-redeemed"
                              : "is-pending"
                          }`}
                        >
                          {item.redeemed_at
                            ? "Sudah Redeem"
                            : "Belum Redeem"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="registration-detail-button"
                          onClick={() => openDetail(item)}
                        >
                          Lihat
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="registration-delete-button"
                          onClick={() => handleDelete(item)}
                          disabled={!!deletingId}
                        >
                          {deletingId === item.id
                            ? "Menghapus..."
                            : "Hapus"}
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
            className="registration-modal-overlay"
            onClick={() => {
              if (!deletingId) setSelected(null);
            }}
          >
            <section
              className="registration-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="registration-modal-header">
                <div>
                  <span>DETAIL PENDAFTARAN</span>
                  <h2>{selected.name}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Tutup detail"
                  disabled={!!deletingId}
                >
                  ×
                </button>
              </div>

              <div className="registration-detail-grid">
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
                  <span>Menu Botram</span>
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

                <div>
                  <span>Status Redeem</span>
                  <strong>
                    {selected.redeemed_at
                      ? "Sudah Redeem"
                      : "Belum Redeem"}
                  </strong>
                </div>

                {selected.redeemed_at && (
                  <div>
                    <span>Waktu Redeem</span>
                    <strong>{formatDate(selected.redeemed_at)}</strong>
                  </div>
                )}
              </div>

              <div className="registration-proof">
                <h3>Bukti Pendaftaran</h3>

                {proofLoading ? (
                  <p>Memuat bukti pendaftaran...</p>
                ) : proofUrl ? (
                  <a
                    href={proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="registration-proof-link"
                  >
                    Lihat Bukti Pendaftaran
                  </a>
                ) : (
                  <p>Bukti pendaftaran tidak dapat ditampilkan.</p>
                )}
              </div>

              <div className="registration-modal-actions">
                <button
                  type="button"
                  className="registration-modal-close"
                  onClick={() => setSelected(null)}
                  disabled={!!deletingId}
                >
                  Tutup Detail
                </button>

                <button
                  type="button"
                  className="registration-delete-button"
                  onClick={() => handleDelete(selected)}
                  disabled={!!deletingId}
                >
                  {deletingId === selected.id
                    ? "Menghapus..."
                    : "Hapus Data Pengunjung"}
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </AdminShell>
  );
}
