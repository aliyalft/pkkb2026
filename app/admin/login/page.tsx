
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import "../admin.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError || !data.user) {
        throw new Error("Email atau password tidak sesuai.");
      }

      const { data: admin, error: adminError } = await supabase
        .from("botram_admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        throw new Error("Akun ini tidak memiliki akses admin.");
      }

      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login gagal. Silakan coba kembali."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-decoration" />

      <a href="/" className="admin-back-home">
        ← KEMBALI KE PKKB
      </a>

      <section className="admin-login-card">
        <div className="admin-brand-mark">P</div>

        <span className="admin-eyebrow">
          PEKAN KEBUDAYAAN KOTA BANDUNG
        </span>

        <h1>
          Admin
          <br />
          <em>Portal.</em>
        </h1>

        <p className="admin-login-description">
          Masuk untuk mengelola registrasi
          Botram PKKB 2026.
        </p>

        <form onSubmit={handleLogin}>
          <label className="admin-input-group">
            <span>EMAIL ADMIN</span>
            <input
              type="email"
              placeholder="admin@email.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="username"
              required
            />
          </label>

          <label className="admin-input-group">
            <span>PASSWORD</span>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-error">{error}</div>
          )}

          <button
            type="submit"
            className="admin-primary-button"
            disabled={loading}
          >
            {loading ? "MEMERIKSA..." : "MASUK DASHBOARD"}
          </button>
        </form>

        <div className="admin-login-footer">
          BOTRAM · PKKB 2026
        </div>
      </section>
    </main>
  );
}
