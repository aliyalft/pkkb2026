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
              <strong>KOTA KITA, INDONESIA</strong>
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

            <a href="#" aria-label="Instagram">
              Instagram ↗︎
            </a>

            <a href="#" aria-label="TikTok">
              TikTok ↗︎
            </a>

            <a href="#" aria-label="Email">
              Email ↗︎
            </a>
          </div>
        </div>

        {/* Big word */}
        <div className="pkkb-footer-big">
          <span>PKKB</span>
          <span>2026</span>
        </div>

        {/* Bottom */}
        <div className="pkkb-footer-bottom">
          <span>© 2026 PKKB. ALL RIGHTS RESERVED.</span>

          <div>
            <a href="#">PRIVACY</a>
            <a href="#">TERMS</a>
          </div>

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            BACK TO TOP ↑
          </button>
        </div>
      </div>
    </footer>
  );
}