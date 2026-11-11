
"use client";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Program", href: "#program" },
  { label: "Schedule", href: "#schedule" },
  { label: "Talent", href: "#talent" },
  { label: "Venue", href: "#venue" },
];

export default function Footer() {
  return (
    <footer className="pkkb-footer">
      <div className="pkkb-container">
        {/* Main Footer */}
        <div className="pkkb-footer-top">
          {/* Brand */}
          <div className="pkkb-footer-brand">
            <div className="pkkb-footer-logo">
              PKKB<span>°</span>
            </div>

            <p>
              Perayaan kebudayaan yang mempertemukan
              manusia, cerita, dan ruang kota.
            </p>

            <div className="pkkb-footer-location">
              <span>BASED IN</span>
              <strong>BANDUNG, JAWA BARAT</strong>
            </div>
          </div>

          {/* Navigation */}
          <div className="pkkb-footer-nav">
            <span className="pkkb-footer-label">EXPLORE</span>

            <nav>
              {footerLinks.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="pkkb-footer-social">
            <span className="pkkb-footer-label">FOLLOW ALONG</span>

            <a
              href="https://www.instagram.com/pekankebudayaankotabandung/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram PKKB"
              className="pkkb-footer-instagram"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="17.5"
                  cy="6.8"
                  r="1.1"
                  fill="currentColor"
                />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>

    
      </div>

      {/* Credit Strip */}
      <div className="pkkb-footer-credit">
        <div className="pkkb-footer-credit-inner">
          <p className="pkkb-footer-copyright">
            © 2026 Pekan Kebudayaan Kota Bandung
          </p>

          <div className="pkkb-footer-powered">
            <span>Powered by</span>
            <img
              src="/image/tactlink.png"
              alt="TactLink"
            />
          </div>

          <p className="pkkb-footer-developer">
            Dev by{" "}
            <a
              href="https://www.linkedin.com/in/aliyahalfitarossa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Aliyah Alfita Rossa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
