"use client";

export default function FinalCTA() {
  return (
    <section id="register" className="pkkb-final-cta pkkb-section">
      <div className="pkkb-container">
        <div className="pkkb-final-cta-card">
          {/* Decorative elements */}
          <div className="pkkb-final-cta-orbit pkkb-final-cta-orbit-1" />
          <div className="pkkb-final-cta-orbit pkkb-final-cta-orbit-2" />

          <div className="pkkb-final-cta-content">
            <div className="pkkb-section-eyebrow pkkb-final-cta-eyebrow">
              <span />
              SEE YOU THERE
            </div>

            <h2>
              Mari bertemu
              <br />
              <em>di sini.</em>
            </h2>

            <p>
              Datang, berbagi cerita, menikmati karya,
              dan menjadi bagian dari perayaan kebudayaan
              bersama PKKB 2026.
            </p>

            <div className="pkkb-final-cta-actions">
              <a href="/register" className="pkkb-final-cta-button">
                <span>DAFTAR SEKARANG</span>
                <strong>↗︎</strong>
              </a>

              
            </div>
          </div>

          <div className="pkkb-final-cta-mark">
            <span>PKKB</span>
            <small>2026</small>
          </div>
        </div>
      </div>
    </section>
  );
}