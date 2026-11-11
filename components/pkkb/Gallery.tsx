
"use client";

import { useEffect, useRef, useState } from "react";

const galleryItems = [
  {
    id: 1,
    image:
      "https://cdn.antaranews.com/cache/1200x800/2026/01/10/CjkinzN000031_20260109_CBMFN0A001.jpg",
    category: "PERFORMANCE",
    caption: "Gerak Jaipong, ekspresi budaya Sunda.",
    size: "large",
  },
  {
    id: 2,
    image:
      "https://asset.kompas.com/crops/TYG58cAof7H1gI7AMOtEpBqbM44%3D/0x0%3A750x500/750x500/data/photo/2022/11/01/6360fc943185f.jpg",
    category: "COMMUNITY",
    caption: "Bersama menjaga bunyi tradisi.",
    size: "small",
  },
  {
  id: 3,
  category: "BOTRAM",
  caption: "Makan, berbagi, dan bercerita.",
  image: "/image/03-botram.png",
  size: "medium",
},
  {
    id: 4,
    image:
      "https://assets.jabarekspres.com/main/2021/11/Peserta-Pasanggiri-Pencasilat-Padungdung-Bandung-2021-unjuk-kebolehan.jpg",
    category: "FESTIVAL",
    caption: "Tradisi bergerak di ruang bersama.",
    size: "medium",
  },
  {
    id: 5,
    image:
      "https://assets.pikiran-rakyat.com/crop/0x0%3A0x0/720x0/webp/photo/2023/10/04/572283766.jpg",
    category: "CULTURE",
    caption: "Cerita Sunda hidup lewat wayang golek.",
    size: "small",
  },
  {
    id: 6,
    image:
      "https://awsimages.detik.net.id/community/media/visual/2016/03/08/3fb4b3ff-761d-4701-96ba-4110fa4da159_169.jpg?w=1200",
    category: "MUSIC",
    caption: "Nada angklung menyatukan banyak suara.",
    size: "large",
  },
];

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);

  const galleryTrackRef = useRef<HTMLDivElement>(null);

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

    const index = (currentIndex + 1) % galleryItems.length;

    setSelected(galleryItems[index]!.id);
  };

  // Update active dot when the mobile slider is swiped.
  const handleGalleryScroll = () => {
    const track = galleryTrackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];

    if (!cards.length) return;

    const trackLeft = track.getBoundingClientRect().left;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const distance = Math.abs(
        card.getBoundingClientRect().left - trackLeft
      );

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setMobileIndex(closestIndex);
  };

  // Navigate to a selected slide using the dots.
  const goToSlide = (index: number) => {
    const track = galleryTrackRef.current;
    if (!track) return;

    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;

    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: "smooth",
    });

    setMobileIndex(index);
  };

  // Lightbox keyboard controls.
  useEffect(() => {
    if (selected === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }

      if (event.key === "ArrowLeft") {
        setSelected((currentId) => {
          const index = galleryItems.findIndex(
            (item) => item.id === currentId
          );

          if (index < 0) return currentId;

          return galleryItems[
            (index - 1 + galleryItems.length) % galleryItems.length
          ]!.id;
        });
      }

      if (event.key === "ArrowRight") {
        setSelected((currentId) => {
          const index = galleryItems.findIndex(
            (item) => item.id === currentId
          );

          if (index < 0) return currentId;

          return galleryItems[(index + 1) % galleryItems.length]!.id;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selected]);

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
          <div
            ref={galleryTrackRef}
            className="pkkb-gallery-grid"
            onScroll={handleGalleryScroll}
          >
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`pkkb-gallery-item pkkb-gallery-${item.size}`}
                onClick={() => setSelected(item.id)}
                aria-label={`Lihat foto ${item.category}: ${item.caption}`}
              >
                <div
                  className="pkkb-gallery-image"
                  style={{
                    backgroundImage: `url("${item.image}")`,
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
                </div>
              </button>
            ))}
          </div>

          {/* Mobile slider dots */}
          <div className="pkkb-gallery-dots" aria-label="Gallery navigation">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={`pkkb-gallery-dot ${
                  mobileIndex === index ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Lihat foto ${index + 1}`}
                aria-current={mobileIndex === index ? "true" : undefined}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="pkkb-gallery-footer">
            

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
          aria-label="Gallery image preview"
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
                backgroundImage: `url("${current.image}")`,
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
