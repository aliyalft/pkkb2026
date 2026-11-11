
"use client";

const popolahData = [
  {
    number: "01",
    date: "25 JULI 2026",
    title: "Merawat Ruang Berkesenian",
    location: "Komunitas Celah-Celah Langit (CCL)",
    description:
      "Merawat ruang bagi kesenian dan ekspresi untuk terus tumbuh. Sebuah perjumpaan yang membuka kesempatan bagi komunitas dan warga untuk berbagi praktik serta pengalaman berkesenian.",
  },
  {
    number: "02",
    date: "15 AGUSTUS 2026",
    title: "Merawat Hubungan Manusia dan Sungai",
    location: "Kawasan Sungai Cikapundung, Tamansari",
    description:
      "Mengajak warga melihat kembali hubungan antara manusia, sungai, dan lingkungan. Sebuah ruang untuk membangun kepedulian terhadap sungai sebagai bagian dari kehidupan kota.",
  },
  {
    number: "03",
    date: "5 SEPTEMBER 2026",
    title: "Merawat Percakapan Kota",
    location: "Poka Kanayakan, Bandung",
    description:
      "Membuka ruang percakapan tentang kota melalui pertukaran gagasan, pengalaman, dan sudut pandang. Menghubungkan berbagai cerita yang membentuk kehidupan warga Bandung.",
  },
  {
    number: "04",
    date: "8 NOVEMBER 2026",
    title: "Merawat Ekosistem Kampung Produksi",
    location: "Kampung Cibuntu",
    description:
      "Mengenali ekosistem kampung produksi sebagai bagian dari kebudayaan kota. Merawat pengetahuan, keterampilan, dan aktivitas warga yang tumbuh dalam keseharian.",
  },
];

export default function Popolah() {
  return (
    <section className="popolah-section" id="popolah">
      <div className="popolah-bg-word" aria-hidden="true">
        POPO
      </div>

      <div className="popolah-container">
        <header className="popolah-header">
          <div className="popolah-heading">
            <span className="popolah-eyebrow">
              <span className="popolah-eyebrow-dot" />
              RANGKAIAN MENUJU BOTRAM
            </span>

            <h2>
              POPO<span>LAH</span>
            </h2>
          </div>

          <div className="popolah-intro">
            <span className="popolah-intro-line" />
            <p>
              Sebelum Botram, POPOlah hadir sebagai rangkaian perjumpaan
              untuk merawat berbagai praktik kebudayaan, ruang hidup,
              dan cerita yang tumbuh di Kota Bandung.
            </p>
          </div>
        </header>

        <div className="popolah-list">
          {popolahData.map((item) => (
            <article className="popolah-item" key={item.number}>
              <div className="popolah-divider">
                <div className="popolah-divider-number">
                  <span>{item.number}</span>
                </div>

                <div className="popolah-divider-line">
                  <span />
                </div>

                <span className="popolah-divider-date">
                  {item.date}
                </span>
              </div>

              <div className="popolah-grid">
                <div className="popolah-info">
                  <h3>{item.title}</h3>

                  <div className="popolah-location">
                    <span className="popolah-location-dot" />
                    <span>{item.location}</span>
                  </div>

                  <p className="popolah-description">
                    {item.description}
                  </p>
                </div>

                
              </div>
            </article>
          ))}
        </div>

        <footer className="popolah-footer">
          <span>NGAMUMULE BUDAYA, NGAWANGUN KOTA</span>
          <p>
            Empat perjumpaan, satu semangat untuk merawat kebudayaan kota.
          </p>
        </footer>
      </div>
    </section>
  );
}
