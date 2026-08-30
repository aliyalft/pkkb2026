"use client";

import { FormEvent, useState } from "react";

type RegistrationType = "selection" | "public" | "tenant";

export default function RegisterPage() {
  const [type, setType] =
    useState<RegistrationType>("selection");

  if (type === "public") {
    return (
      <RegistrationForm
        type="public"
        onBack={() => setType("selection")}
      />
    );
  }

  if (type === "tenant") {
    return (
      <RegistrationForm
        type="tenant"
        onBack={() => setType("selection")}
      />
    );
  }

  return (
    <main className="register-page">
      <a href="/" className="register-home">
        <span>←</span>
        BACK TO PKKB
      </a>

      <div className="register-orb register-orb-one" />
      <div className="register-orb register-orb-two" />

      <div className="register-shell">
        <div className="register-top">
          <div className="register-eyebrow">
            <span />
            PKKB 2026 / REGISTRATION
          </div>

          <div className="register-year">2026</div>
        </div>

        <div className="register-heading">
          <p>SELAMAT DATANG</p>

          <h1>
            Mau hadir
            <br />
            sebagai <em>apa?</em>
          </h1>
        </div>

        <div className="register-options">
          {/* PUBLIC */}
          <button
            type="button"
            className="register-option register-option-public"
            onClick={() => setType("public")}
          >
            <div className="register-option-top">
              <span>01</span>
              <span>FOR EVERYONE</span>
            </div>

            <div className="register-option-icon">✦</div>

            <div className="register-option-content">
              <h2>
                Saya mau
                <br />
                <strong>Datang.</strong>
              </h2>

              <p>
                Daftar sebagai pengunjung dan nikmati
                rangkaian program, pertunjukan, kuliner,
                dan ruang kebudayaan PKKB 2026.
              </p>
            </div>

            <div className="register-option-footer">
              <span>PUBLIC REGISTRATION</span>

              <span className="register-option-arrow">
                ↗
              </span>
            </div>
          </button>

          {/* TENANT */}
          <button
            type="button"
            className="register-option register-option-tenant"
            onClick={() => setType("tenant")}
          >
            <div className="register-option-top">
              <span>02</span>
              <span>FOR CREATORS & BUSINESSES</span>
            </div>

            <div className="register-option-icon">+</div>

            <div className="register-option-content">
              <h2>
                Saya mau
                <br />
                <strong>Berbagi.</strong>
              </h2>

              <p>
                Daftar sebagai tenant untuk membawa
                produk, karya, kuliner, atau brand kamu
                ke dalam perayaan PKKB 2026.
              </p>
            </div>

            <div className="register-option-footer">
              <span>TENANT REGISTRATION</span>

              <span className="register-option-arrow">
                ↗
              </span>
            </div>
          </button>
        </div>

        <div className="register-bottom">
          <span>PEKAN KEBUDAYAAN KOTA BANDUNG</span>

          <span>NGAMUMULE BUDAYA / NGAWANGUN KOTA</span>
        </div>
      </div>
    </main>
  );
}

/* =====================================================
   REGISTRATION FORM
===================================================== */

function RegistrationForm({
  type,
  onBack,
}: {
  type: "public" | "tenant";
  onBack: () => void;
}) {
  const isTenant = type === "tenant";

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    console.log(
      "PKKB Registration:",
      Object.fromEntries(formData)
    );

    // DEMO SUBMIT
    // Nanti bagian ini tinggal diganti dengan API/backend.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  if (submitted) {
    return (
      <RegistrationSuccess
        type={type}
        onBack={onBack}
      />
    );
  }

  return (
    <main className="register-form-page">
      <div className="register-form-background" />

      <a href="/" className="register-home">
        <span>←</span>
        BACK TO PKKB
      </a>

      <div className="register-form-shell">
        {/* HEADER */}
        <div className="register-form-header">
          <button
            type="button"
            className="register-back"
            onClick={onBack}
          >
            ← CHANGE REGISTRATION TYPE
          </button>

          <div className="register-form-number">
            {isTenant ? "02" : "01"}
          </div>
        </div>

        {/* TITLE */}
        <div className="register-form-title">
          <div className="register-eyebrow">
            <span />
            {isTenant
              ? "TENANT REGISTRATION"
              : "PUBLIC REGISTRATION"}
          </div>

          <h1>
            {isTenant ? (
              <>
                Bawa
                <br />
                <em>ceritamu.</em>
              </>
            ) : (
              <>
                Sampai
                <br />
                <em>jumpa.</em>
              </>
            )}
          </h1>

          <p>
            {isTenant
              ? "Ceritakan tentang brand atau usaha yang ingin kamu bawa ke PKKB 2026."
              : "Isi data singkat berikut untuk menjadi bagian dari PKKB 2026."}
          </p>
        </div>

        {/* FORM */}
        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          {/* SECTION 01 */}
          <div className="register-form-section">
            <span className="register-form-section-number">
              01
            </span>

            <div>
              <h2>
                {isTenant
                  ? "Tentang kamu & brand"
                  : "Tentang kamu"}
              </h2>

              <p>
                {isTenant
                  ? "Kenalan dulu dengan kami."
                  : "Data ini digunakan untuk kebutuhan registrasi."}
              </p>
            </div>
          </div>

          <div className="register-fields">
            <label>
              <span>FULL NAME *</span>

              <input
                type="text"
                name="name"
                placeholder="Nama lengkap"
                required
              />
            </label>

            <label>
              <span>EMAIL *</span>

              <input
                type="email"
                name="email"
                placeholder="nama@email.com"
                required
              />
            </label>

            <label>
              <span>PHONE / WHATSAPP *</span>

              <input
                type="tel"
                name="phone"
                placeholder="+62 8..."
                required
              />
            </label>

            {isTenant && (
              <>
                <label>
                  <span>BRAND / BUSINESS NAME *</span>

                  <input
                    type="text"
                    name="brand"
                    placeholder="Nama brand / usaha"
                    required
                  />
                </label>

                <label>
                  <span>CATEGORY *</span>

                  <select
                    name="category"
                    defaultValue=""
                    required
                  >
                    <option value="" disabled>
                      Pilih kategori
                    </option>

                    <option value="food">
                      Food & Beverage
                    </option>

                    <option value="fashion">
                      Fashion
                    </option>

                    <option value="craft">
                      Craft & Handmade
                    </option>

                    <option value="creative">
                      Creative Industry
                    </option>

                    <option value="community">
                      Community
                    </option>

                    <option value="other">
                      Other
                    </option>
                  </select>
                </label>

                <label>
                  <span>INSTAGRAM / SOCIAL MEDIA</span>

                  <input
                    type="text"
                    name="social"
                    placeholder="@yourbrand"
                  />
                </label>
              </>
            )}
          </div>

          {/* SECTION 02 */}
          <div className="register-form-section">
            <span className="register-form-section-number">
              02
            </span>

            <div>
              <h2>
                {isTenant
                  ? "Sedikit lebih detail"
                  : "Rencana kunjungan"}
              </h2>

              <p>
                {isTenant
                  ? "Biar kami bisa memahami kebutuhanmu."
                  : "Bantu kami mempersiapkan pengalaman terbaik."}
              </p>
            </div>
          </div>

          <div className="register-fields">
            {!isTenant && (
              <>
                <label>
                  <span>NUMBER OF VISITORS</span>

                  <select
                    name="visitors"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih jumlah
                    </option>

                    <option value="1">
                      1 orang
                    </option>

                    <option value="2-3">
                      2–3 orang
                    </option>

                    <option value="4-5">
                      4–5 orang
                    </option>

                    <option value="6+">
                      6+ orang
                    </option>
                  </select>
                </label>

                <label>
                  <span>PROGRAM INTEREST</span>

                  <select
                    name="interest"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih program
                    </option>

                    <option value="pangan">
                      Pangan
                    </option>

                    <option value="seni">
                      Seni
                    </option>

                    <option value="tradisi">
                      Tradisi
                    </option>

                    <option value="komunitas">
                      Komunitas
                    </option>

                    <option value="ruang-kota">
                      Ruang Kota
                    </option>
                  </select>
                </label>
              </>
            )}

            {isTenant && (
              <>
                <label className="register-field-full">
                  <span>WHAT WILL YOU BRING? *</span>

                  <textarea
                    name="description"
                    placeholder="Ceritakan produk atau karya yang akan kamu bawa..."
                    required
                  />
                </label>

                <label>
                  <span>ESTIMATED SPACE NEEDED</span>

                  <select
                    name="space"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Pilih kebutuhan
                    </option>

                    <option value="small">
                      Small booth
                    </option>

                    <option value="medium">
                      Medium booth
                    </option>

                    <option value="large">
                      Large booth
                    </option>
                  </select>
                </label>
              </>
            )}
          </div>

          {/* SUBMIT */}
          <div className="register-submit-area">
            <p>
              Dengan mengirimkan formulir ini, kamu
              menyetujui proses registrasi PKKB 2026.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting
                  ? "SUBMITTING..."
                  : isTenant
                    ? "SUBMIT TENANT REGISTRATION"
                    : "COMPLETE REGISTRATION"}
              </span>

              <strong>
                {isSubmitting ? "..." : "↗"}
              </strong>
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

/* =====================================================
   SUCCESS PAGE
===================================================== */

function RegistrationSuccess({
  type,
  onBack,
}: {
  type: "public" | "tenant";
  onBack: () => void;
}) {
  const isTenant = type === "tenant";

  return (
    <main className="register-success-page">
      <div className="register-success-orb register-success-orb-one" />
      <div className="register-success-orb register-success-orb-two" />

      <a href="/" className="register-home">
        <span>←</span>
        BACK TO PKKB
      </a>

      <div className="register-success">
        <div className="register-success-top">
          <span>PKKB 2026</span>

          <span>REGISTRATION COMPLETE</span>
        </div>

        <div className="register-success-content">
          <div className="register-success-symbol">
            ✓
          </div>

          <div className="register-eyebrow">
            <span />
            YOU&apos;RE IN
          </div>

          <h1>
            Sampai
            <br />
            <em>jumpa.</em>
          </h1>

          <p>
            {isTenant
              ? "Terima kasih sudah mendaftarkan brand kamu sebagai tenant PKKB 2026. Tim kami akan menghubungi kamu untuk informasi selanjutnya."
              : "Registrasimu sudah diterima. Bersiap untuk menjadi bagian dari PKKB 2026 dan menikmati berbagai ruang kebudayaan yang kami hadirkan."}
          </p>

          <div className="register-success-ticket">
            <div>
              <span>REGISTRATION TYPE</span>

              <strong>
                {isTenant ? "TENANT" : "PUBLIC"}
              </strong>
            </div>

            <div>
              <span>STATUS</span>

              <strong>REGISTERED ✓</strong>
            </div>

            <div>
              <span>EVENT</span>

              <strong>PKKB 2026</strong>
            </div>
          </div>

          <div className="register-success-actions">
            <a
              href="/"
              className="register-success-primary"
            >
              BACK TO HOME

              <strong>↗</strong>
            </a>

            <button
              type="button"
              onClick={onBack}
              className="register-success-secondary"
            >
              REGISTER ANOTHER
            </button>
          </div>
        </div>

        <div className="register-success-footer">
          <span>
            NGAMUMULE BUDAYA / NGAWANGUN KOTA
          </span>

          <span>2026</span>
        </div>
      </div>
    </main>
  );
}