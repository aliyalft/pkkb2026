
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  FormEvent,
} from "react";
import "./register.css";

type Region = {
  id: string;
  name: string;
};

type RegistrationData = {
  name: string;
  phone: string;
  email: string;
  city: string;
  cityId: string;
  district: string;
  districtId: string;
};

const REGION_API =
  "https://www.emsifa.com/api-wilayah-indonesia/api";

const INITIAL_DATA: RegistrationData = {
  name: "",
  phone: "",
  email: "",
  city: "",
  cityId: "",
  district: "",
  districtId: "",
};

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.7 12.8c0-2.1 1.7-3.1 1.8-3.2a3.9 3.9 0 0 0-3.1-1.7c-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8a4.1 4.1 0 0 0-3.5 2.1c-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.5 2.1s1.4-.7 2.7-.7 1.7.7 2.8.7 1.8-1 2.5-2.1a9.4 9.4 0 0 0 1.1-2.4 3.7 3.7 0 0 1-1.8-3.3ZM14.6 6.5A3.9 3.9 0 0 0 15.5 3a4 4 0 0 0-3 1.5 3.7 3.7 0 0 0-.9 3.3 3.3 3.3 0 0 0 3-1.3Z"
      />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#34A853" d="M3.5 2.5 13 12 3.5 21.5V2.5Z" />
      <path fill="#4285F4" d="m3.5 2.5 12 6.7-2.5 2.8-9.5-9.5Z" />
      <path fill="#FBBC04" d="m15.5 9.2 4.1 2.3c.8.4.8.8 0 1.2l-4.1 2.3-2.5-3 2.5-2.8Z" />
      <path fill="#EA4335" d="m3.5 21.5 12-6.7-2.5-2.8-9.5 9.5Z" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchableRegionField({
  label,
  placeholder,
  value,
  options,
  onInputChange,
  onSelect,
  disabled = false,
  loading = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: Region[];
  onInputChange: (value: string) => void;
  onSelect: (option: Region) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    const keyword = value.trim().toLowerCase();

    if (!keyword) return options.slice(0, 30);

    return options
      .filter((option) =>
        option.name.toLowerCase().includes(keyword)
      )
      .slice(0, 40);
  }, [options, value]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="botram-field" ref={wrapperRef}>
      <label className="botram-label">{label}</label>

      <div
        className={`botram-input-wrap botram-combobox ${
          open ? "is-open" : ""
        } ${disabled ? "is-disabled" : ""}`}
      >
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onInputChange(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
        />

        <span className={`botram-combobox-icon ${open ? "is-open" : ""}`}>
          {loading ? (
            <span className="botram-spinner" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="m6 9 6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </div>

      {open && !disabled && (
        <div className="botram-dropdown">
          {loading ? (
            <div className="botram-dropdown-message">
              Memuat data wilayah...
            </div>
          ) : filteredOptions.length > 0 ? (
            <>
              <div className="botram-dropdown-caption">
                {value.trim()
                  ? `${filteredOptions.length} hasil ditemukan`
                  : "PILIH WILAYAH"}
              </div>

              <div className="botram-dropdown-list">
                {filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className={
                      value === option.name ? "is-selected" : ""
                    }
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onSelect(option);
                      setOpen(false);
                    }}
                  >
                    <span>{option.name}</span>
                    {value === option.name && (
                      <span className="botram-option-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="botram-dropdown-message">
              Wilayah tidak ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);

  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [proof, setProof] = useState<File | null>(null);
  const [downloadConfirmed, setDownloadConfirmed] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const stepPanelRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Arahkan layar ke panel yang aktif, bukan ke bagian paling atas halaman.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    requestAnimationFrame(() => {
      stepPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [step]);

  const updateField = useCallback(
    (field: keyof RegistrationData, value: string) => {
      setData((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    []
  );

  // Ambil seluruh kabupaten/kota di Indonesia.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchCities() {
      setLoadingCities(true);
      setError("");

      try {
        const provinceResponse = await fetch(
          `${REGION_API}/provinces.json`,
          { signal: controller.signal }
        );

        if (!provinceResponse.ok) {
          throw new Error("Gagal mengambil data provinsi.");
        }

        const provinces: Region[] = await provinceResponse.json();

        const regencyResults = await Promise.all(
          provinces.map(async (province) => {
            const response = await fetch(
              `${REGION_API}/regencies/${province.id}.json`,
              { signal: controller.signal }
            );

            if (!response.ok) {
              throw new Error(
                `Gagal mengambil wilayah ${province.name}.`
              );
            }

            const result: Region[] = await response.json();
            return result;
          })
        );

        const allCities = regencyResults
          .flat()
          .sort((a, b) => a.name.localeCompare(b.name, "id"));

        setCities(allCities);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError(
            "Data kota/kabupaten gagal dimuat. Silakan refresh halaman."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCities(false);
        }
      }
    }

    fetchCities();

    return () => controller.abort();
  }, []);

  // Ambil kecamatan berdasarkan kabupaten/kota terpilih.
  useEffect(() => {
    if (!data.cityId) {
      setDistricts([]);
      setLoadingDistricts(false);
      return;
    }

    const controller = new AbortController();

    async function fetchDistricts() {
      setLoadingDistricts(true);
      setDistricts([]);

      try {
        const response = await fetch(
          `${REGION_API}/districts/${data.cityId}.json`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data kecamatan.");
        }

        const result: Region[] = await response.json();

        setDistricts(
          result.sort((a, b) =>
            a.name.localeCompare(b.name, "id")
          )
        );
      } catch (err) {
        if (
          err instanceof Error &&
          err.name !== "AbortError"
        ) {
          setError("Data kecamatan gagal dimuat. Coba kembali.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDistricts(false);
        }
      }
    }

    fetchDistricts();

    return () => controller.abort();
  }, [data.cityId]);

  function handleCityInput(value: string) {
    setData((previous) => ({
      ...previous,
      city: value,
      cityId: "",
      district: "",
      districtId: "",
    }));

    setDistricts([]);
    setError("");
  }

  function handleCitySelect(option: Region) {
    setData((previous) => ({
      ...previous,
      city: option.name,
      cityId: option.id,
      district: "",
      districtId: "",
    }));

    setError("");
  }

  function handleDistrictInput(value: string) {
    setData((previous) => ({
      ...previous,
      district: value,
      districtId: "",
    }));

    setError("");
  }

  function handleDistrictSelect(option: Region) {
    setData((previous) => ({
      ...previous,
      district: option.name,
      districtId: option.id,
    }));

    setError("");
  }

  function nextStep() {
    if (!data.name.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!data.phone.trim()) {
      setError("Nomor WhatsApp wajib diisi.");
      return;
    }

    if (
      data.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    ) {
      setError("Format email tidak valid.");
      return;
    }

    if (!data.cityId) {
      setError("Silakan pilih kota atau kabupaten dari dropdown.");
      return;
    }

    if (!data.districtId) {
      setError("Silakan pilih kecamatan dari dropdown.");
      return;
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(data.phone.trim())) {
      setError("Format nomor WhatsApp tidak valid.");
      return;
    }

    setError("");
    setStep(2);
  }

  function previousStep() {
    setError("");
    setStep(1);
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Gunakan format JPG, PNG, atau WEBP.");
      event.target.value = "";
      setProof(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      event.target.value = "";
      setProof(null);
      return;
    }

    setError("");
    setProof(file);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!proof) {
      setError("Silakan upload bukti download TactLink.");
      return;
    }

    if (!downloadConfirmed) {
      setError("Silakan konfirmasi download TactLink.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());
      formData.append("phone", data.phone.trim());
      formData.append("email", data.email.trim());
      formData.append("city", data.city);
      formData.append("cityId", data.cityId);
      formData.append("district", data.district);
      formData.append("districtId", data.districtId);
      formData.append("proof", proof);

      const response = await fetch("/api/botram/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Registrasi gagal. Silakan coba kembali."
        );
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan. Silakan coba kembali."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="botram-register-page botram-success-page">
        <div className="botram-success-orb" />

        

        <section className="botram-success-card">
          <div className="botram-success-mark">✓</div>

          <span className="botram-eyebrow">
            REGISTRATION COMPLETE
          </span>

          <h1>
            Sampai
            <br />
            <em style={{ display: "inline-block", marginTop: "0.08em" }}>
              jumpa.
            </em>
          </h1>

          <p>
            Registrasimu berhasil diterima.
            Terima kasih telah menjadi bagian dari
            Botram PKKB 2026. Kami tunggu kehadiranmu
            di perayaan kebudayaan Kota Bandung!
          </p>

          <a href="/" className="botram-button botram-button-dark">
            KEMBALI KE BERANDA
          </a>

          <span className="botram-success-note">
            PEKAN KEBUDAYAAN KOTA BANDUNG · 2026
          </span>
        </section>
      </main>
    );
  }

  return (
    <main className="botram-register-page">
      <div className="botram-bg-orb botram-bg-orb-top" />
      <div className="botram-bg-orb botram-bg-orb-bottom" />

      <a href="/" className="botram-back-link">
        <span>←</span> BACK TO PKKB
      </a>

      <div className="botram-register-shell">
        <header className="botram-heading">
          <div className="botram-eyebrow">
            <span />
            PKKB 2026 / BOTRAM REGISTRATION
          </div>

          <h1>
            Sampai
            <br />
            <em style={{ display: "inline-block", marginTop: "0.08em" }}>
              jumpa.
            </em>
          </h1>

          <p>
            Isi data singkat berikut untuk menjadi
            bagian dari Botram PKKB 2026.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="botram-form">
          <div className="botram-stepper-card">
            <div className="botram-stepper-track">
              <div
                className={`botram-stepper-progress ${
                  step === 2 ? "step-two" : ""
                }`}
              />
            </div>

            <div className="botram-stepper-items">
              <div
                className={`botram-step ${
                  step === 1 ? "active" : "completed"
                }`}
              >
                <div className="botram-step-number">
                  {step === 2 ? "✓" : "01"}
                </div>
                <strong>Data Pengunjung</strong>
                <span>Informasi dasar</span>
              </div>

              <div
                className={`botram-step ${
                  step === 2 ? "active" : ""
                }`}
              >
                <div className="botram-step-number">02</div>
                <strong>TactLink</strong>
                <span>Download & Upload Bukti</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <section
              ref={stepPanelRef}
              className="botram-panel-card"
              style={{ scrollMarginTop: "24px" }}
            >
              <div className="botram-section-heading">
                <span className="botram-section-number">01</span>

                <div>
                  <span className="botram-eyebrow">
                    DATA PENGUNJUNG
                  </span>
                  <h2>Kenali pengunjung.</h2>
                  <p>
                    Lengkapi informasi diri untuk kebutuhan
                    pendataan kehadiran Botram PKKB 2026.
                  </p>
                </div>
              </div>

              <div className="botram-fields">
                <label className="botram-field">
                  <span className="botram-label">
                    NAMA LENGKAP <b>*</b>
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Masukkan nama lengkap"
                    value={data.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="botram-field">
                  <span className="botram-label">
                    NOMOR WHATSAPP <b>*</b>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Contoh: 081234567890"
                    value={data.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="botram-field botram-field-full">
                  <span className="botram-label">
                    EMAIL <small>(OPSIONAL)</small>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="nama@email.com"
                    value={data.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                  />
                </label>

                <SearchableRegionField
                  label="KOTA / KABUPATEN *"
                  placeholder={
                    loadingCities
                      ? "Memuat wilayah Indonesia..."
                      : "Ketik nama kota atau kabupaten"
                  }
                  value={data.city}
                  options={cities}
                  loading={loadingCities}
                  onInputChange={handleCityInput}
                  onSelect={handleCitySelect}
                />

                <SearchableRegionField
                  label="KECAMATAN *"
                  placeholder={
                    !data.cityId
                      ? "Pilih kota/kabupaten terlebih dahulu"
                      : "Ketik nama kecamatan"
                  }
                  value={data.district}
                  options={districts}
                  disabled={!data.cityId}
                  loading={loadingDistricts}
                  onInputChange={handleDistrictInput}
                  onSelect={handleDistrictSelect}
                />
              </div>

              {error && (
                <div className="botram-error">
                  <span>!</span> {error}
                </div>
              )}

              <div className="botram-form-actions">
                <p>
                  Pastikan informasi yang kamu masukkan
                  sudah benar.
                </p>
                <button
                  type="button"
                  onClick={nextStep}
                  className="botram-button botram-button-dark"
                >
                  LANJUTKAN
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section
              ref={stepPanelRef}
              className="botram-panel-card"
              style={{ scrollMarginTop: "24px" }}
            >
              <div className="botram-section-heading">
                <span className="botram-section-number">02</span>

                <div>
                  <span className="botram-eyebrow">
                    TACTLINK APPLICATION
                  </span>
                  <h2>Satu langkah lagi.</h2>
                  <p>
                    Download aplikasi TactLink dan unggah
                    bukti sebagai bagian dari proses
                    registrasi Botram.
                  </p>
                </div>
              </div>

              <div className="botram-download-card">
                <div className="botram-download-brand">
                  <div className="botram-app-logo">
                    <img
                      src="/image/tactlink.png"
                      alt="TactLink Logo"
                    />
                  </div>

                  <div className="botram-download-info">
                    <span>PKKB OFFICIAL APPLICATION</span>
                    <h3>Download TactLink</h3>
                    <p>
                      Akses aplikasi melalui perangkat
                      yang kamu gunakan.
                    </p>
                  </div>
                </div>

                <div className="botram-store-buttons">
                  <a
                    href="https://apps.apple.com/id/app/tactlink/id1469516661"
                    target="_blank"
                    rel="noreferrer"
                    className="botram-store-button"
                  >
                    <AppleIcon />
                    <span>
                      <small>Download on the</small>
                      <strong>App Store</strong>
                    </span>
                  </a>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.tactlink.app"
                    target="_blank"
                    rel="noreferrer"
                    className="botram-store-button"
                  >
                    <GooglePlayIcon />
                    <span>
                      <small>GET IT ON</small>
                      <strong>Google Play</strong>
                    </span>
                  </a>
                </div>
              </div>

              <a
                href="https://www.youtube.com/shorts/JuYtU3TVvYo"
                target="_blank"
                rel="noreferrer"
                className="botram-tutorial-link"
              >
                <span className="botram-tutorial-icon">?</span>
                <span>
                  <strong>Butuh bantuan?</strong>
                  <small>
                    Pelajari cara download aplikasi TactLink.
                  </small>
                </span>
                <span className="botram-tutorial-action">
                  LIHAT TUTORIAL
                </span>
              </a>

              <div className="botram-upload-section">
                <div className="botram-upload-heading">
                  <div>
                    <h3>Upload bukti download</h3>
                    <p>
                      Unggah screenshot aplikasi TactLink
                      yang sudah terpasang di perangkatmu.
                    </p>
                  </div>
                  <span className="botram-required-tag">
                    WAJIB
                  </span>
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  hidden
                />

                <button
                  type="button"
                  className={`botram-upload-box ${
                    proof ? "has-file" : ""
                  }`}
                  onClick={() => fileRef.current?.click()}
                >
                  {proof ? (
                    <>
                      <span className="botram-upload-symbol">
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="m5 12 4.5 4.5L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <strong>{proof.name}</strong>
                      <small>
                        {(proof.size / 1024 / 1024).toFixed(2)} MB
                        · Klik untuk mengganti gambar
                      </small>
                    </>
                  ) : (
                    <>
                      <span className="botram-upload-symbol">
                        <UploadIcon />
                      </span>
                      <strong>
                        Klik untuk mengunggah bukti
                      </strong>
                      <small>
                        JPG, PNG, atau WEBP · Maksimal 5 MB
                      </small>
                    </>
                  )}
                </button>
              </div>

              <label className="botram-confirmation">
                <input
                  type="checkbox"
                  checked={downloadConfirmed}
                  onChange={(event) =>
                    setDownloadConfirmed(event.target.checked)
                  }
                />
                <span>
                  Saya menyatakan bahwa aplikasi TactLink
                  telah berhasil diunduh dan bukti yang
                  saya unggah sesuai dengan kondisi sebenarnya.
                </span>
              </label>

              {error && (
                <div className="botram-error">
                  <span>!</span> {error}
                </div>
              )}

              <div className="botram-form-actions botram-step-two-actions">
                <button
                  type="button"
                  onClick={previousStep}
                  className="botram-button botram-button-outline"
                  disabled={isSubmitting}
                >
                  KEMBALI
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="botram-button botram-button-dark"
                >
                  {isSubmitting ? "MENGIRIM..." : "KIRIM REGISTRASI"}
                </button>
              </div>
            </section>
          )}
        </form>

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
            <span>BOTRAM · PKKB 2026</span>
            <span>MERAYAKAN KEBUDAYAAN KOTA BANDUNG</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
