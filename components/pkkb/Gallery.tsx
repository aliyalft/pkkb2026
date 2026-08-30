"use client";

import { useEffect, useState } from "react";

const galleryItems = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
    category: "PERFORMANCE",
    caption: "Ruang untuk berekspresi.",
    size: "large",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=900&q=85",
    category: "COMMUNITY",
    caption: "Bertemu dalam keberagaman.",
    size: "small",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=85",
    category: "BOTRAM",
    caption: "Makan, berbagi, bercerita.",
    size: "medium",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
    category: "FESTIVAL",
    caption: "Kota yang ikut merayakan.",
    size: "medium",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=85",
    category: "CULTURE",
    caption: "Tradisi bertemu hari ini.",
    size: "small",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=85",
    category: "MUSIC",
    caption: "Suara dari berbagai cerita.",
    size: "large",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const currentIndex =
    selected !== null
      ? galleryItems.findIndex((item) => item.id === selected)
      : -1;

  const current =
    currentIndex >= 0 ? galleryItems[currentIndex] : null;

  const closeLightbox = () => setSelected(null);

  const previous = () => {
    if (currentIndex < 0) return;

    const index =
      (currentIndex - 1 + galleryItems.length) %
      galleryItems.length;

    setSelected(galleryItems[index]!.id);
  };

  const next = () => {
    if (currentIndex < 0) return;

    const index =
      (currentIndex + 1) % galleryItems.length;

    setSelected(galleryItems[index]!.id);
  };

  useEffect(() => {
    if (selected === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected, currentIndex]);

  return (
    <>
      <section id="gallery" className="pkkb-gallery pkkb-section">
        <div className="pkkb-container">
          {/* Header */}
          <div className="pkkb-gallery-header">
            <div>
              <div className="pkkb-section-eyebrow">
                <span />
                GALLERY
              </div>

              <h2>
                Kota dalam
                <br />
                <em>cerita.</em>
              </h2>
            </div>

            <div className="pkkb-gallery-intro">
              <span>PKKB / VISUAL ARCHIVE</span>

              <p>
                Potongan kecil dari ruang, manusia, dan
                momen yang membuat kebudayaan terus hidup.
              </p>
            </div>
          </div>

          {/* Gallery */}
          <div className="pkkb-gallery-grid">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`pkkb-gallery-item pkkb-gallery-${item.size}`}
                onClick={() => setSelected(item.id)}
              >
                <div
                  className="pkkb-gallery-image"
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                />

                <div className="pkkb-gallery-item-overlay" />

                <div className="pkkb-gallery-item-top">
                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span>{item.category}</span>
                </div>

                <div className="pkkb-gallery-item-bottom">
                  <span>{item.caption}</span>

                  <i>↗</i>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="pkkb-gallery-footer">
            <span>06 — STORIES</span>

            <p>
              Setiap sudut kota menyimpan cerita.
              <br />
              Mari temukan ceritamu sendiri.
            </p>

            <span>PKKB 2026</span>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div
          className="pkkb-lightbox"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="pkkb-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            ×
          </button>

          <button
            type="button"
            className="pkkb-lightbox-arrow pkkb-lightbox-prev"
            onClick={(event) => {
              event.stopPropagation();
              previous();
            }}
            aria-label="Previous image"
          >
            ←
          </button>

          <div
            className="pkkb-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="pkkb-lightbox-image"
              style={{
                backgroundImage: `url(${current.image})`,
              }}
            />

            <div className="pkkb-lightbox-info">
              <div>
                <span>
                  {String(currentIndex + 1).padStart(2, "0")} /{" "}
                  {String(galleryItems.length).padStart(2, "0")}
                </span>

                <strong>{current.category}</strong>
              </div>

              <p>{current.caption}</p>
            </div>
          </div>

          <button
            type="button"
            className="pkkb-lightbox-arrow pkkb-lightbox-next"
            onClick={(event) => {
              event.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}