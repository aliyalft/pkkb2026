
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import "./register.css";
import {
  Fish,
  Leaf,
  Wheat,
  Utensils,
  Soup,
  Candy,
} from "lucide-react";

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

type MenuItem = {
  code: string;
  name: string;
  store: string;
  quota: number;
  claimed: number;
  available: number;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  id?: string;
  ticketCode?: string;
  menus?: MenuItem[];
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

/* ICON MAKANAN BERDASARKAN JENIS MENU */

function FoodIcon({ name }: { name?: string }) {
  const lowerName = name?.toLowerCase() ?? "";

  if (lowerName.includes("ikan") || lowerName.includes("fish")) {
    return <Fish size={22} strokeWidth={1.7} aria-hidden="true" />;
  }

  if (
    lowerName.includes("sayur") ||
    lowerName.includes("vegetable") ||
    lowerName.includes("leaf")
  ) {
    return <Leaf size={22} strokeWidth={1.7} aria-hidden="true" />;
  }

  if (
    lowerName.includes("gandum") ||
    lowerName.includes("wheat") ||
    lowerName.includes("roti") ||
    lowerName.includes("bread")
  ) {
    return <Wheat size={22} strokeWidth={1.7} aria-hidden="true" />;
  }

  if (
    lowerName.includes("makanan") ||
    lowerName.includes("nasi") ||
    lowerName.includes("bakso") ||
    lowerName.includes("rice") ||
    lowerName.includes("noodle")
  ) {
    return <Soup size={22} strokeWidth={1.7} aria-hidden="true" />;
  }

  if (
    lowerName.includes("manis") ||
    lowerName.includes("cake") ||
    lowerName.includes("dessert") ||
    lowerName.includes("candy") ||
    lowerName.includes("sweet")
  ) {
    return <Candy size={22} strokeWidth={1.7} aria-hidden="true" />;
  }

  return (
    <Utensils
      size={22}
      strokeWidth={1.7}
      aria-hidden="true"
    />
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m4 10 4 4 8-8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 12H5m0 0 6.5-6.5M5 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
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

    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
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
                      <span className="botram-option-check">
                        <CheckIcon />
                      </span>
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
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [data, setData] = useState(INITIAL_DATA);

  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [loadingMenus, setLoadingMenus] = useState(false);
  const [menuLoadError, setMenuLoadError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const stepPanelRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);
  const submitLockRef = useRef(false);

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

  // ==========================================
  // FETCH MENU STOCK
  // ==========================================

  const fetchMenuStock = useCallback(async () => {
    setLoadingMenus(true);
    setMenuLoadError("");

    try {
      const response = await fetch("/api/botram/menu-stock", {
        cache: "no-store",
      });

      const responseText = await response.text();

      let result: ApiResponse = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Respons server stok menu tidak valid (HTTP ${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Stok menu gagal dimuat."
        );
      }

      setMenus(Array.isArray(result.menus) ? result.menus : []);
    } catch (err) {
      setMenuLoadError(
        err instanceof Error
          ? err.message
          : "Stok menu gagal dimuat. Silakan coba kembali."
      );
    } finally {
      setLoadingMenus(false);
    }
  }, []);

  useEffect(() => {
    if (step !== 2) return;

    fetchMenuStock();

    const interval = window.setInterval(fetchMenuStock, 15000);
    const handleFocus = () => fetchMenuStock();

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [step, fetchMenuStock]);

  const updateField = useCallback(
    (field: keyof RegistrationData, value: string) => {
      setData((previous) => ({
        ...previous,
        [field]: value,
      }));
    },
    []
  );

  // ==========================================
  // FETCH CITY DATA
  // ==========================================

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

            return (await response.json()) as Region[];
          })
        );

        if (!controller.signal.aborted) {
          setCities(
            regencyResults
              .flat()
              .sort((a, b) => a.name.localeCompare(b.name, "id"))
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
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

  // ==========================================
  // FETCH DISTRICT DATA
  // ==========================================

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

        if (!controller.signal.aborted) {
          setDistricts(
            result.sort((a, b) => a.name.localeCompare(b.name, "id"))
          );
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
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

  // ==========================================
  // REGION HANDLERS
  // ==========================================

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

  // ==========================================
  // STEP VALIDATION
  // ==========================================

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

  // ==========================================
  // REGISTER SUBMISSION
  // ==========================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitLockRef.current || isSubmitting) return;


    if (!selectedMenu) {
      setError("Silakan pilih satu menu makanan Botram.");
      return;
    }

    submitLockRef.current = true;
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
      formData.append("menuCode", selectedMenu);

      const response = await fetch("/api/botram/register", {
        method: "POST",
        body: formData,
      });

      const responseText = await response.text();

      let result: ApiResponse = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        console.error("BOTRAM INVALID API RESPONSE:", {
          status: response.status,
          body: responseText,
        });

        if (response.status === 413) {
          throw new Error(
            "Data yang dikirim terlalu besar. Silakan periksa kembali isian formulir."
          );
        }

        throw new Error(
          `Server memberikan respons tidak valid (HTTP ${response.status}). Silakan coba kembali.`
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message || "Registrasi gagal. Silakan coba kembali."
        );
      }

      if (!result.success || !result.id) {
        throw new Error(
          result.message ||
            "Data tiket tidak ditemukan. Silakan hubungi panitia."
        );
      }

      router.push(
        `/ticket/${encodeURIComponent(String(result.id))}`
      );
    } catch (err) {
      console.error("BOTRAM FRONTEND REGISTRATION ERROR:", err);

      if (
        err instanceof TypeError &&
        err.message.toLowerCase().includes("fetch")
      ) {
        setError(
          "Koneksi ke server gagal. Periksa internet kamu dan coba kembali."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan. Silakan coba kembali."
        );
      }
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <main className="botram-register-page">
      <div className="botram-bg-orb botram-bg-orb-top" />
      <div className="botram-bg-orb botram-bg-orb-bottom" />

      <a href="/" className="botram-back-link">
        <ArrowLeftIcon />
        <span>BACK TO PKKB</span>
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
            <em>jumpa.</em>
          </h1>

          <p>
            Isi data singkat berikut untuk menjadi bagian dari Botram PKKB 2026.
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
                  {step > 1 ? <CheckIcon /> : "01"}
                </div>
                <strong>Data Pengunjung</strong>
                <span>Informasi dasar</span>
              </div>

              <div
                className={`botram-step ${step === 2 ? "active" : ""}`}
              >
                <div className="botram-step-number">02</div>
                <strong>Menu Botram</strong>
                <span>Pilih makanan</span>
              </div>
            </div>
          </div>

          {/* STEP 1: DATA PENGUNJUNG */}

          {step === 1 && (
            <section
              ref={stepPanelRef}
              className="botram-panel-card"
              style={{ scrollMarginTop: "24px" }}
            >
              <div className="botram-section-heading">
                <span className="botram-section-number">01</span>
                <div>
                  <span className="botram-eyebrow">DATA PENGUNJUNG</span>
                  <h2>Kenali pengunjung.</h2>
                  <p>
                    Lengkapi informasi diri untuk kebutuhan pendataan kehadiran
                    Botram PKKB 2026.
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
                <p>Pastikan informasi yang kamu masukkan sudah benar.</p>
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

          {/* STEP 2: MENU BOTRAM */}

          {step === 2 && (
            <section
              ref={stepPanelRef}
              className="botram-panel-card"
              style={{ scrollMarginTop: "24px" }}
            >
              <div className="botram-section-heading">
                <span className="botram-section-number">02</span>
                <div>
                  <span className="botram-eyebrow">MENU BOTRAM</span>
                  <h2>Pilih sajianmu.</h2>
                  <p>
                    Pilih satu menu makanan untuk dinikmati saat Botram. Setiap
                    pengunjung hanya dapat memilih satu porsi.
                  </p>
                </div>
              </div>

              <div className="botram-menu-heading">
                <div>
                  <strong>MENU MAKANAN</strong>
                  <span>Pilih satu sajian Botram yang tersedia.</span>
                </div>
                <span className="botram-menu-counter">
                  {selectedMenu ? "1 MENU DIPILIH" : "PILIH 1 MENU"}
                </span>
              </div>

              {loadingMenus && menus.length === 0 ? (
                <div className="botram-menu-status">
                  Memuat ketersediaan menu...
                </div>
              ) : menuLoadError ? (
                <div className="botram-menu-status is-error">
                  <span>{menuLoadError}</span>
                  <button type="button" onClick={fetchMenuStock}>
                    Coba lagi
                  </button>
                </div>
              ) : (
                <div className="botram-menu-grid">
                  {menus.map((menu) => {
                    const soldOut = menu.available <= 0;
                    const isSelected = selectedMenu === menu.code;

                    return (
                      <button
                        type="button"
                        key={menu.code}
                        disabled={soldOut}
                        aria-pressed={isSelected}
                        className={`botram-menu-card ${
                          isSelected ? "is-selected" : ""
                        } ${soldOut ? "is-sold-out" : ""}`}
                        onClick={() => {
                          setSelectedMenu(menu.code);
                          setError("");
                        }}
                      >
                        <span className="botram-menu-icon">
                          <FoodIcon name={menu.name} />
                        </span>

                        <span className="botram-menu-copy">
                          <strong>{menu.name}</strong>
                          <small>{menu.store}</small>
                          <span className="botram-menu-stock">
                            {soldOut
                              ? "Stok habis"
                              : `${menu.available}/${menu.quota} tersedia`}
                          </span>
                        </span>

                        <span className="botram-menu-check">
                          {soldOut ? (
                            <span className="botram-menu-sold-label">
                              HABIS
                            </span>
                          ) : isSelected ? (
                            <span className="botram-menu-selected-mark">
                              <CheckIcon />
                            </span>
                          ) : (
                            <span className="botram-menu-radio" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <p className="botram-menu-note">
                Ketersediaan menu diperbarui otomatis. Pilihan akan dikonfirmasi
                saat registrasi berhasil dikirim.
              </p>

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
                  disabled={
                    isSubmitting ||
                    !selectedMenu ||
                    loadingMenus ||
                    !!menuLoadError
                  }
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
            <span className="botram-footer-copyright">
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
      </div>
    </main>
  );
}
