"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame = 0;
    let time = 0;

    const mouse = {
      x: 0.5,
      y: 0.5,
    };

    const targetMouse = {
      x: 0.5,
      y: 0.5,
    };

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width =
        window.innerWidth * dpr;

      canvas.height =
        window.innerHeight * dpr;

      canvas.style.width =
        `${window.innerWidth}px`;

      canvas.style.height =
        `${window.innerHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      targetMouse.x =
        event.clientX /
        window.innerWidth;

      targetMouse.y =
        event.clientY /
        window.innerHeight;
    };

    const drawBlob = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string,
      rotation: number
    ) => {
      context.save();

      context.translate(x, y);
      context.rotate(rotation);

      context.beginPath();

      const points = 18;

      for (
        let i = 0;
        i <= points;
        i++
      ) {
        const angle =
          (Math.PI * 2 * i) /
          points;

        const variation =
          1 +
          Math.sin(
            angle * 3 +
              rotation * 2
          ) *
            0.08 +
          Math.sin(
            angle * 5 -
              rotation
          ) *
            0.05;

        const px =
          Math.cos(angle) *
          radius *
          variation;

        const py =
          Math.sin(angle) *
          radius *
          variation;

        if (i === 0) {
          context.moveTo(
            px,
            py
          );
        } else {
          context.lineTo(
            px,
            py
          );
        }
      }

      context.closePath();

      context.fillStyle = color;

      context.filter =
        "blur(35px)";

      context.fill();

      context.restore();

      context.filter = "none";
    };

    const draw = () => {
      time += 0.003;

      mouse.x +=
        (targetMouse.x - mouse.x) *
        0.04;

      mouse.y +=
        (targetMouse.y - mouse.y) *
        0.04;

      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /*
       * PKKB atmospheric background
       */

      const gradient =
        ctx.createRadialGradient(
          width *
            (0.35 +
              (mouse.x - 0.5) *
                0.12),

          height *
            (0.35 +
              (mouse.y - 0.5) *
                0.12),

          0,

          width * 0.55,
          height * 0.5,
          width * 0.9
        );

      gradient.addColorStop(
        0,
        "#7569B8"
      );

      gradient.addColorStop(
        0.42,
        "#6187F3"
      );

      gradient.addColorStop(
        0.75,
        "#192246"
      );

      gradient.addColorStop(
        1,
        "#192246"
      );

      ctx.fillStyle = gradient;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /*
       * Soft atmospheric blobs
       */

      drawBlob(
        ctx,
        width *
          (0.2 +
            mouse.x * 0.05),

        height * 0.28,

        width * 0.22,

        "rgba(117, 105, 184, 0.32)",

        time
      );

      drawBlob(
        ctx,
        width * 0.82,

        height *
          (0.3 +
            mouse.y * 0.06),

        width * 0.26,

        "rgba(97, 135, 243, 0.22)",

        -time * 0.8
      );

      drawBlob(
        ctx,
        width * 0.56,

        height * 0.82,

        width * 0.3,

        "rgba(117, 105, 184, 0.16)",

        time * 0.6
      );

      animationFrame =
        requestAnimationFrame(
          draw
        );
    };

    resize();

    draw();

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );
    };
  }, []);

  return (
    <section
      id="hero"
      className="pkkb-hero"
    >

      {/* =========================================
          INTERACTIVE ATMOSPHERIC BACKGROUND
      ========================================= */}

      <canvas
        ref={canvasRef}
        className="pkkb-hero-canvas"
        aria-hidden="true"
      />

      {/* =========================================
          DARK OVERLAY
      ========================================= */}

      <div
        className="pkkb-hero-overlay"
        aria-hidden="true"
      />


      {/* =========================================
          HERO CONTENT
      ========================================= */}

      <div className="pkkb-hero-content pkkb-container">


        {/* =======================================
            MAIN COPY
        ======================================= */}

        <div className="pkkb-hero-copy">

          <div className="pkkb-hero-eyebrow">

            <span className="pkkb-hero-eyebrow-dot" />

            NGAMUMULE BUDAYA,
            NGAWANGUN KOTA

          </div>


          <h1 className="pkkb-hero-title">

            Pekan
            <br />

            Kebudayaan
            <br />

            <span>
              Kota Bandung
            </span>

          </h1>


          <p className="pkkb-hero-description">

            Merayakan keberagaman budaya,
            mempertemukan komunitas,
            dan menghidupkan ruang kota
            melalui karya serta tradisi
            warga Bandung.

          </p>

        </div>


        {/* =======================================
            RIGHT SIDE — EVENT INFO
        ======================================= */}

        <div className="pkkb-hero-side">


          {/* DATE CARD */}

          <div
            className="
              pkkb-hero-info-card
              pkkb-hero-date-card
            "
          >

            <div className="pkkb-hero-card-top">

              <span className="pkkb-hero-card-number">
                01
              </span>

              <span className="pkkb-hero-card-label">
                DATE
              </span>

            </div>


            <div className="pkkb-hero-card-main">
  <strong>
    07 November
  </strong>

  <span>
    Sabtu, 07 November 2026
  </span>
</div>

          </div>


          {/* VENUE CARD */}

          <div
            className="
              pkkb-hero-info-card
              pkkb-hero-venue-card
            "
          >

            <div className="pkkb-hero-card-top">

              <span className="pkkb-hero-card-number">
                02
              </span>

              <span className="pkkb-hero-card-label">
                VENUE
              </span>

            </div>


            <div className="pkkb-hero-card-main">

              <strong>
                Balai Kota
                <br />
                Bandung
              </strong>

              <span>
                Taman Dewi Sartika &amp; Taman Badak
              </span>

            </div>

          </div>

        </div>
        <div className="pkkb-hero-mobile-badge">
  <strong>07 November 2026</strong>
  <i>•</i>
  <span>Balai Kota Bandung</span>
</div>

        {/* MOBILE-ONLY COMBINED BADGE */}



        {/* =======================================
            BUTTONS
        ======================================= */}

        <div className="pkkb-hero-actions">

          <a
            href="#program"
            className="
              pkkb-button
              pkkb-button-primary
            "
          >
            Jelajahi PKKB
          </a>


          <a
            href="#register"
            className="
              pkkb-button
              pkkb-button-outline
            "
          >
            Daftar Sekarang
          </a>

        </div>


      </div>

    </section>
  );
}