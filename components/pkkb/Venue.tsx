
"use client";

export default function Venue() {
  return (
    <section id="venue" className="pkkb-venue pkkb-section">
      <div className="pkkb-container">
        {/* Header */}
        <div className="pkkb-venue-header">
          <div>
            <div className="pkkb-section-eyebrow">
              <span />
              VENUE
            </div>

            <h2>
              Bertemu
              <br />
              <em>di tengah kota.</em>
            </h2>
          </div>

          <p>
            Satu kota, banyak cerita. Temukan ruang
            perjumpaan dalam perayaan Pekan Kebudayaan
            Kota Bandung 2026.
          </p>
        </div>

        {/* Main venue */}
        <div className="pkkb-venue-main">
          {/* Map */}
          <div className="pkkb-venue-map-wrap">
            <iframe
              title="Peta lokasi Botram PKKB 2026"
              src="https://www.google.com/maps?q=Jalan+Soekarno,+Cikapundung+River+Side,+Bandung&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            <div className="pkkb-venue-map-tag">
              <span />
              BOTRAM PKKB 2026
            </div>

            <div className="pkkb-venue-map-caption">
              <span>JALAN SOEKARNO</span>
              <span>CIKAPUNDUNG RIVER SIDE</span>
            </div>
          </div>

          {/* Information */}
          <div className="pkkb-venue-info">
            <div className="pkkb-venue-info-top">
              <span>MAIN FESTIVAL</span>

              <span className="pkkb-venue-status">
                <i />
                OPEN FOR EVERYONE
              </span>
            </div>

            <div className="pkkb-venue-title">
              <h3>
                Botram
                <br />
                PKKB 2026
              </h3>

              <p>
                Kawasan Jalan Soekarno
                <br />
                dan Cikapundung River Side,
                <br />
                Bandung, Jawa Barat
              </p>
            </div>

            <div className="pkkb-venue-facts">
              <div>
                <span>DATE</span>
                <strong>13–15 November 2026</strong>
              </div>

              <div>
                <span>AREA</span>
                <strong>City Center</strong>
              </div>

              <div>
                <span>ACCESS</span>
                <strong>Public</strong>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Jalan+Soekarno+Bandung+Cikapundung+River+Side"
              target="_blank"
              rel="noopener noreferrer"
              className="pkkb-venue-directions"
            >
              <span>LIHAT LOKASI DI GOOGLE MAPS</span>
            </a>
          </div>
        </div>

        

        
      </div>
    </section>
  );
}
