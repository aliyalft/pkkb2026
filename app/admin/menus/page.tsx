
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminShell from "../components/AdminShell";
import "./menus.css";

type Menu = {
  menu_code: string;
  menu_name: string;
  store_name: string;
  quota: number;
  claimed_count: number;
  updated_at: string;
  is_active: boolean;
  sort_order: number;
  description: string | null;
};

type MenuForm = {
  menu_code: string;
  menu_name: string;
  store_name: string;
  quota: string;
  description: string;
  sort_order: string;
  is_active: boolean;
};

const emptyForm: MenuForm = {
  menu_code: "",
  menu_name: "",
  store_name: "",
  quota: "",
  description: "",
  sort_order: "0",
  is_active: true,
};

export default function MenusPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<MenuForm>(emptyForm);

  const loadMenus = useCallback(async () => {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/admin/login?next=%2Fadmin%2Fmenus");
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

    const { data, error: menuError } = await supabase
      .from("botram_menu_stock")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("menu_name", { ascending: true });

    if (menuError) {
      setError("Data menu gagal dimuat. Silakan coba lagi.");
      setMenus([]);
    } else {
      setMenus((data ?? []) as Menu[]);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadMenus();
  }, [loadMenus]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  function openAddModal() {
    setEditing(false);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function openEditModal(menu: Menu) {
    setEditing(true);
    setForm({
      menu_code: menu.menu_code,
      menu_name: menu.menu_name,
      store_name: menu.store_name,
      quota: String(menu.quota),
      description: menu.description ?? "",
      sort_order: String(menu.sort_order),
      is_active: menu.is_active,
    });
    setError("");
    setSuccess("");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;
    setModalOpen(false);
    setForm(emptyForm);
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const menuCode = form.menu_code.trim().toUpperCase();
    const quota = Number(form.quota);
    const sortOrder = Number(form.sort_order);

    if (!menuCode || !form.menu_name.trim() || !form.store_name.trim()) {
      setError("Kode menu, nama menu, dan nama tenant wajib diisi.");
      return;
    }

    if (!Number.isInteger(quota) || quota < 1) {
      setError("Kuota harus berupa angka bulat minimal 1.");
      return;
    }

    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      setError("Urutan harus berupa angka bulat minimal 0.");
      return;
    }

    setSaving(true);

    const { data, error: saveError } = await supabase.rpc(
      "admin_save_botram_menu",
      {
        p_menu_code: menuCode,
        p_menu_name: form.menu_name.trim(),
        p_store_name: form.store_name.trim(),
        p_quota: quota,
        p_description: form.description.trim(),
        p_sort_order: sortOrder,
        p_is_active: form.is_active,
      }
    );

    setSaving(false);

    if (saveError) {
      setError(saveError.message || "Menu gagal disimpan.");
      return;
    }

    setSuccess(
      data?.action === "created"
        ? "Menu baru berhasil ditambahkan."
        : "Perubahan menu berhasil disimpan."
    );

    setModalOpen(false);
    setForm(emptyForm);
    await loadMenus();
  }

  async function handleDeactivate(menu: Menu) {
    const confirmed = window.confirm(
      `Nonaktifkan menu "${menu.menu_name}"? Menu ini tidak akan tersedia untuk pendaftaran baru. Data pendaftar yang sudah ada tetap aman.`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    const { error: deactivateError } = await supabase.rpc(
      "admin_deactivate_botram_menu",
      {
        p_menu_code: menu.menu_code,
      }
    );

    if (deactivateError) {
      setError(deactivateError.message || "Menu gagal dinonaktifkan.");
      return;
    }

    setSuccess(`Menu ${menu.menu_name} berhasil dinonaktifkan.`);
    await loadMenus();
  }

  const totalClaimed = menus.reduce(
    (total, menu) => total + menu.claimed_count,
    0
  );

  const totalRemaining = menus.reduce(
    (total, menu) =>
      total + (menu.is_active ? Math.max(menu.quota - menu.claimed_count, 0) : 0),
    0
  );

  const activeMenus = menus.filter((menu) => menu.is_active).length;

  return (
    <AdminShell onLogout={handleLogout}>
      <main className="menus-page">
        <div className="menus-header">
          <div>
            <span className="menus-eyebrow">BOTRAM MANAGEMENT</span>
            <h1>Manajemen Menu</h1>
            <p>
              Kelola pilihan menu, tenant, dan kuota pendaftaran Botram.
            </p>
          </div>

          <button
            type="button"
            className="menus-add-button"
            onClick={openAddModal}
          >
            <span>+</span>
            Tambah Menu
          </button>
        </div>

        {error && !modalOpen && (
          <div className="menus-alert is-error">{error}</div>
        )}

        {success && (
          <div className="menus-alert is-success">{success}</div>
        )}

        <section className="menus-stats">
          <div className="menus-stat-card">
            <span>Total Menu Aktif</span>
            <strong>{activeMenus}</strong>
            <small>Dapat dipilih pengunjung</small>
          </div>

          <div className="menus-stat-card">
            <span>Total Terdaftar</span>
            <strong>{totalClaimed}</strong>
            <small>Kuota yang sudah diambil</small>
          </div>

          <div className="menus-stat-card">
            <span>Sisa Kuota Aktif</span>
            <strong>{totalRemaining}</strong>
            <small>Kuota yang masih tersedia</small>
          </div>
        </section>

        <section className="menus-list-card">
          <div className="menus-list-heading">
            <div>
              <h2>Daftar Menu Botram</h2>
              <p>{menus.length} menu tercatat</p>
            </div>

            <button
              type="button"
              className="menus-refresh-button"
              onClick={loadMenus}
              disabled={loading}
            >
              <svg
                width="16"
                height="16"
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
          </div>

          {loading ? (
            <div className="menus-empty">Memuat data menu...</div>
          ) : menus.length === 0 ? (
            <div className="menus-empty">
              Belum ada menu yang tersedia.
            </div>
          ) : (
            <div className="menus-grid">
              {menus.map((menu) => {
                const remaining = Math.max(
                  menu.quota - menu.claimed_count,
                  0
                );
                const percentage =
                  menu.quota > 0
                    ? Math.min((menu.claimed_count / menu.quota) * 100, 100)
                    : 0;
                const lowQuota = remaining <= Math.max(5, menu.quota * 0.2);

                return (
                  <article
                    className={`menus-item-card ${
                      !menu.is_active ? "is-inactive" : ""
                    }`}
                    key={menu.menu_code}
                  >
                    <div className="menus-item-top">
                      <div className="menus-item-code">
                        {menu.menu_code}
                      </div>

                      <span
                        className={`menus-active-badge ${
                          menu.is_active ? "is-active" : "is-inactive"
                        }`}
                      >
                        {menu.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <div className="menus-item-info">
                      <h3>{menu.menu_name}</h3>
                      <p>{menu.store_name}</p>
                      {menu.description && (
                        <span>{menu.description}</span>
                      )}
                    </div>

                    <div className="menus-quota">
                      <div className="menus-quota-heading">
                        <span>Penggunaan Kuota</span>
                        <strong>
                          {menu.claimed_count} / {menu.quota}
                        </strong>
                      </div>

                      <div className="menus-progress">
                        <div
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <div className="menus-quota-bottom">
                        <span>
                          {menu.is_active
                            ? `${remaining} kuota tersisa`
                            : "Menu tidak menerima pendaftaran"}
                        </span>

                        {menu.is_active && lowQuota && remaining > 0 && (
                          <small>Kuota menipis</small>
                        )}

                        {menu.is_active && remaining === 0 && (
                          <small>Kuota habis</small>
                        )}
                      </div>
                    </div>

                    <div className="menus-item-footer">
                      <button
                        type="button"
                        className="menus-edit-button"
                        onClick={() => openEditModal(menu)}
                      >
                        Edit Menu
                      </button>

                      {menu.is_active && (
                        <button
                          type="button"
                          className="menus-deactivate-button"
                          onClick={() => handleDeactivate(menu)}
                        >
                          Nonaktifkan
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {modalOpen && (
          <div
            className="menus-modal-overlay"
            onClick={closeModal}
          >
            <section
              className="menus-modal"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="menus-modal-header">
                <div>
                  <span>BOTRAM MANAGEMENT</span>
                  <h2>{editing ? "Edit Menu" : "Tambah Menu Baru"}</h2>
                  <p>
                    Lengkapi informasi menu dan kuota yang tersedia.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  aria-label="Tutup"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSave}>
                <div className="menus-form-grid">
                  <label>
                    Kode Menu
                    <input
                      type="text"
                      value={form.menu_code}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          menu_code: event.target.value.toUpperCase(),
                        })
                      }
                      placeholder="Contoh: NAS"
                      maxLength={20}
                      disabled={editing}
                      required
                    />
                    {editing && (
                      <small>Kode menu tidak dapat diubah.</small>
                    )}
                  </label>

                  <label>
                    Nama Menu
                    <input
                      type="text"
                      value={form.menu_name}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          menu_name: event.target.value,
                        })
                      }
                      placeholder="Contoh: Nasi Liwet"
                      required
                    />
                  </label>

                  <label>
                    Nama Tenant
                    <input
                      type="text"
                      value={form.store_name}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          store_name: event.target.value,
                        })
                      }
                      placeholder="Nama tenant atau penyedia"
                      required
                    />
                  </label>

                  <label>
                    Kuota
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={form.quota}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          quota: event.target.value,
                        })
                      }
                      placeholder="Contoh: 100"
                      required
                    />
                  </label>

                  <label>
                    Urutan Tampilan
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={form.sort_order}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          sort_order: event.target.value,
                        })
                      }
                    />
                    <small>Angka lebih kecil tampil lebih dahulu.</small>
                  </label>

                  <label className="menus-form-full">
                    Deskripsi Menu
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          description: event.target.value,
                        })
                      }
                      placeholder="Deskripsi singkat menu (opsional)"
                    />
                  </label>
                </div>

                <label className="menus-active-toggle">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        is_active: event.target.checked,
                      })
                    }
                  />
                  <span>
                    <strong>Menu aktif</strong>
                    <small>
                      Menu tersedia untuk dipilih pada pendaftaran baru.
                    </small>
                  </span>
                </label>

                {error && (
                  <div className="menus-alert is-error">
                    {error}
                  </div>
                )}

                <div className="menus-modal-actions">
                  <button
                    type="button"
                    className="menus-cancel-button"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="menus-submit-button"
                    disabled={saving}
                  >
                    {saving
                      ? "Menyimpan..."
                      : editing
                        ? "Simpan Perubahan"
                        : "Tambah Menu"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </main>
    </AdminShell>
  );
}
