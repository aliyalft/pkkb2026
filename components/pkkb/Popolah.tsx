"use client";

const popolahData = [
  {
    number: "01",
    date: "25 JUL 2026",
    title: "Merawat Ruang Berkesenian",
    location: "Komunitas Celah-Celah Langit",
    description:
      "Ruang berkesenian menjadi bagian penting dari kehidupan budaya kota. Melalui ruang yang dirawat bersama, kreativitas dan ekspresi terus tumbuh di tengah masyarakat.",
    images: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    number: "02",
    date: "15 AUG 2026",
    title: "Merawat Hubungan Manusia dan Sungai",
    location: "Sungai Cikapundung · Tamansari",
    description:
      "Sungai bukan hanya bagian dari lanskap kota, tetapi juga ruang yang mempertemukan manusia dan lingkungan. Merawat sungai berarti merawat hubungan yang hidup di sekitarnya.",
    images: [
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    number: "03",
    date: "05 SEP 2026",
    title: "Merawat Percakapan Kota",
    location: "Poka Kanayakan · Bandung",
    description:
      "Kota tumbuh melalui percakapan. Beragam gagasan, pengalaman, dan cerita menjadi cara masyarakat memahami ruang yang mereka tinggali bersama.",
    images: [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=700&q=80",
    ],
  },
  {
    number: "04",
    date: "12 SEP 2026",
    title: "Merawat Ekosistem Kampung Produksi",
    location: "Kampung Cibuntu",
    description:
      "Kampung produksi memperlihatkan bagaimana kebudayaan tumbuh dari keseharian. Pengetahuan, keterampilan, dan aktivitas warga menjadi bagian dari ekosistem budaya kota.",
    images: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80",
    ],
  },
];

export default function Popolah() {
  return (
    <section className="popolah-section" id="popolah">
      <div className="popolah-bg-word" aria-hidden="true">
        POPO
      </div>

      <div className="popolah-container">
        {/* HEADER */}
        <div className="popolah-header">
          <div className="popolah-heading">
            <span className="popolah-eyebrow">
              <span className="popolah-eyebrow-dot" />
              POPOlah
            </span>

            <h2>
              Merawat yang
              <br />
              <span>tumbuh di kota.</span>
            </h2>
          </div>

          <div className="popolah-intro">
            <span className="popolah-intro-line" />

            <p>
              Sebelum menjadi perayaan, kebudayaan tumbuh dari ruang-ruang
              yang dirawat bersama. POPOlah menghadirkan cerita dari berbagai
              sudut kota Bandung.
            </p>
          </div>
        </div>

        {/* LIST */}
        <div className="popolah-list">
          {popolahData.map((item) => (
            <article className="popolah-item" key={item.number}>
              {/* TOP DIVIDER */}
              <div className="popolah-divider">
                <div className="popolah-divider-number">
                  <span>{item.number}</span>
                </div>

                <div className="popolah-divider-line">
                  <span />
                </div>

                <div className="popolah-divider-date">
                  {item.date}
                </div>
              </div>

              {/* CONTENT */}
              <div className="popolah-grid">
                {/* LEFT */}
                <div className="popolah-info">
                  <h3>{item.title}</h3>

                  <div className="popolah-location">
                    <span className="popolah-location-dot" />
                    {item.location}
                  </div>

                  <p className="popolah-description">
                    {item.description}
                  </p>
                </div>

                {/* RIGHT - GALLERY */}
                <div className="popolah-gallery">
                  <div className="popolah-gallery-main">
                    <img src={item.images[0]} alt={item.title} />
                  </div>

                  <div className="popolah-gallery-side">
                    <div className="popolah-gallery-small">
                      <img src={item.images[1]} alt="" />
                    </div>

                    <div className="popolah-gallery-small">
                      <img src={item.images[2]} alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* FOOTER */}
        <div className="popolah-footer">
          <span>PERJALANAN KEBUDAYAAN</span>

          <p>
            Dari ruang berkesenian, sungai, percakapan, hingga kampung
            produksi — semuanya menjadi bagian dari cerita kota.
          </p>
        </div>
      </div>
    </section>
  );
}