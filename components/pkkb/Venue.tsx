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
            Satu kota, banyak cerita. Temukan ruang tempat
            seluruh rangkaian PKKB 2026 berlangsung.
          </p>
        </div>

        {/* Main venue */}
        <div className="pkkb-venue-main">
          {/* Image */}
          <div className="pkkb-venue-image-wrap">
            <div className="pkkb-venue-image" />

            <div className="pkkb-venue-image-overlay" />

            {/* Coordinates */}
            <div className="pkkb-venue-coordinates">
              <span>06°54'32"S</span>
              <span>107°36'15"E</span>
            </div>

            {/* Location pin */}
            <div className="pkkb-venue-pin">
              <span>PKKB</span>
              <div />
            </div>

            {/* Image label */}
            <div className="pkkb-venue-image-label">
              <span>01</span>
              <span>BANDUNG / JAWA BARAT</span>
            </div>
          </div>

          {/* Information */}
          <div className="pkkb-venue-info">
            <div className="pkkb-venue-info-top">
              <span>MAIN VENUE</span>

              <span className="pkkb-venue-status">
                <i />
                OPEN FOR EVERYONE
              </span>
            </div>

            <div className="pkkb-venue-title">
              <h3>
                Balai Kota
                <br />
                Bandung
              </h3>

              <p>
                Jl. Wastukencana No. 2,
                <br />
                Babakan Ciamis, Sumur Bandung
              </p>
            </div>

            <div className="pkkb-venue-facts">
              <div>
                <span>AREA</span>
                <strong>City Center</strong>
              </div>

              <div>
                <span>ACCESS</span>
                <strong>Public</strong>
              </div>

              <div>
                <span>EVENT</span>
                <strong>PKKB 2026</strong>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Balai+Kota+Bandung"
              target="_blank"
              rel="noreferrer"
              className="pkkb-venue-directions"
            >
              <span>GET DIRECTIONS</span>
              <strong>↗︎</strong>
            </a>
          </div>
        </div>

        {/* Mini locations */}
        <div className="pkkb-venue-bottom">
          <div className="pkkb-venue-bottom-label">
            <span>02</span>
            <p>AROUND THE CITY</p>
          </div>

          <div className="pkkb-venue-mini-grid">
            <div className="pkkb-venue-mini">
              <span>SPACE 01</span>
              <strong>Taman Dewi Sartika</strong>
              <small>EVENT SPACE</small>
            </div>

            <div className="pkkb-venue-mini">
              <span>SPACE 02</span>
              <strong>Taman Badak</strong>
              <small>COMMUNITY SPACE</small>
            </div>

            <div className="pkkb-venue-mini">
              <span>SPACE 03</span>
              <strong>Ruang Kota</strong>
              <small>CREATIVE SPACE</small>
            </div>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="pkkb-venue-statement">
          <span>✦</span>

          <p>
            Datang bukan hanya untuk melihat,
            <br />
            tapi untuk menjadi bagian dari perayaan.
          </p>
        </div>
      </div>
    </section>
  );
}