import React, { useMemo, useRef, useEffect } from "react";
import { InvitationData } from "../types";
import { Sparkles, Heart } from "lucide-react";
import { DEFAULT_MOSQUE_PHOTOS } from "../utils/mosqueImageLoader";
import { getSceneTransition } from "../utils/transitionHelper";

interface GoldenBokehPlayerProps {
  data: InvitationData;
  currentTime: number;
}

export const DEFAULT_BRIDE_PHOTO =
  "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=900&auto=format&fit=crop";
export const DEFAULT_GROOM_PHOTO =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop";

export const GoldenBokehPlayer: React.FC<GoldenBokehPlayerProps> = ({
  data,
  currentTime: t,
}) => {
  const bridePhoto = data.bridePhotoUrl || DEFAULT_BRIDE_PHOTO;
  const groomPhoto = data.groomPhotoUrl || DEFAULT_GROOM_PHOTO;

  // Background backdrop preset & custom photo integration
  const bgPreset = data.calligraphyBgPreset || "nabawi";
  const bgOpacity = data.calligraphyBgOpacity !== undefined ? data.calligraphyBgOpacity : 0.65;
  const bgBlur = data.calligraphyBgBlur !== undefined ? data.calligraphyBgBlur : 0.4;

  const photos = data.mosquePhotos || DEFAULT_MOSQUE_PHOTOS;
  let bgImgSrc: string | null = null;

  if (bgPreset === "custom" && data.calligraphyCustomBgUrl) {
    bgImgSrc = data.calligraphyCustomBgUrl;
  } else if (bgPreset === "amberGlow") {
    bgImgSrc = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";
  } else if (bgPreset === "nabawi") {
    bgImgSrc = photos.nabawi || DEFAULT_MOSQUE_PHOTOS.nabawi;
  } else if (bgPreset === "zayed") {
    bgImgSrc = photos.zayed || DEFAULT_MOSQUE_PHOTOS.zayed;
  } else if (bgPreset === "haram") {
    bgImgSrc = photos.haram || DEFAULT_MOSQUE_PHOTOS.haram;
  } else if (bgPreset === "aqsa") {
    bgImgSrc = photos.aqsa || DEFAULT_MOSQUE_PHOTOS.aqsa;
  } else if (bgPreset === "auto") {
    if (t < 11.8) bgImgSrc = photos.nabawi || DEFAULT_MOSQUE_PHOTOS.nabawi;
    else if (t < 24.8) bgImgSrc = photos.zayed || DEFAULT_MOSQUE_PHOTOS.zayed;
    else if (t < 39.8) bgImgSrc = photos.haram || DEFAULT_MOSQUE_PHOTOS.haram;
    else bgImgSrc = photos.aqsa || DEFAULT_MOSQUE_PHOTOS.aqsa;
  }

  // Preload photos
  useEffect(() => {
    const img1 = new Image();
    img1.src = bridePhoto;
    const img2 = new Image();
    img2.src = groomPhoto;
    if (bgImgSrc) {
      const imgBg = new Image();
      imgBg.src = bgImgSrc;
    }
  }, [bridePhoto, groomPhoto, bgImgSrc]);

  // Generate deterministic floating bokeh orbs
  const bokehOrbs = useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => {
      const seed = i * 137.5;
      const size = 35 + (i % 6) * 22;
      const speed = 0.08 + (i % 5) * 0.04;
      const baseX = 8 + ((seed * 7) % 84);
      const baseY = ((seed * 13) % 100);
      const blur = 8 + (i % 4) * 8;
      const opacity = 0.25 + (i % 4) * 0.15;
      const hue = i % 2 === 0 ? "rgba(255, 220, 140, " : "rgba(235, 185, 90, ";
      return { id: i, size, speed, baseX, baseY, blur, opacity, hue };
    });
  }, []);

  // Scene timing thresholds (Total 54s)
  // Scene 1: 0.0 - 5.5s (Wedding Invitation with Animated Particle Heart)
  // Scene 2: 5.5 - 11.5s (The Big Day - Our Wedding / Families)
  // Scene 3: 11.5 - 18.0s (Bride Spotlight)
  // Scene 4: 18.0 - 24.5s (Groom Spotlight)
  // Scene 5: 24.5 - 31.5s (Love Story / Sacred Quote)
  // Scene 6: 31.5 - 39.5s (Wedding Ceremony & Interlocking Rings)
  // Scene 7: 39.5 - 47.0s (Functions / Reception in Geometric Gold Frame)
  // Scene 8: 47.0 - 54.0s (Looking forward to your presence & Royal Monogram)

  // Camera slow zoom
  const cameraScale = 1 + (t % 54) * 0.0015;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#0a0705] font-sans flex flex-col justify-between">
      {/* 0. PHOTOGRAPHIC MOSQUE / LUXURY TEXTURE BACKDROP */}
      {bgImgSrc ? (
        <div
          className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700"
          style={{
            opacity: bgOpacity,
            filter: `blur(${bgBlur}px)`,
          }}
        >
          <img
            src={bgImgSrc}
            alt="Backdrop"
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${cameraScale * 1.06}) translate3d(${Math.sin(t * 0.2) * 8}px, 0, 0)`,
            }}
            referrerPolicy="no-referrer"
          />
          {/* Subtle warm amber/dark chocolate grading overlay to fuse with gold bokeh */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(45, 25, 10, 0.35) 0%, rgba(20, 10, 5, 0.65) 60%, rgba(8, 5, 3, 0.88) 100%)",
            }}
          />
        </div>
      ) : bgPreset === "emerald" ? (
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0e2417] via-[#08170f] to-[#040c08]" />
      ) : bgPreset === "parchment" ? (
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#2a221b] via-[#1c1611] to-[#0f0b08]" />
      ) : null}

      {/* 1. CINEMATIC BACKGROUND: WARM AMBER & DEEP MAHOGANY VELVET WITH BOKEH */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `scale(${cameraScale})`,
          background: bgImgSrc
            ? "radial-gradient(ellipse at 85% 15%, rgba(68, 38, 16, 0.6) 0%, rgba(32, 18, 9, 0.75) 45%, rgba(10, 6, 4, 0.85) 100%)"
            : "radial-gradient(ellipse at 85% 15%, rgba(68, 38, 16, 0.95) 0%, rgba(32, 18, 9, 0.98) 45%, rgba(10, 6, 4, 1) 100%)",
        }}
      >
        {/* Anamorphic Golden Sun Flare in Upper Right */}
        <div
          className="absolute -top-12 -right-12 w-96 h-96 rounded-full pointer-events-none opacity-80 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 230, 160, 0.75) 0%, rgba(220, 165, 60, 0.35) 40%, rgba(180, 110, 30, 0.1) 70%, transparent 80%)",
            filter: "blur(20px)",
          }}
        />

        {/* Diagonal Anamorphic Flare Ray */}
        <div
          className="absolute top-0 right-0 w-[600px] h-32 origin-top-right -rotate-45 pointer-events-none opacity-30 mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, rgba(255, 235, 180, 0.6) 0%, rgba(220, 160, 50, 0.2) 60%, transparent 100%)",
            filter: "blur(18px)",
          }}
        />

        {/* Drifting Golden Bokeh Orbs */}
        {bokehOrbs.map((orb) => {
          const currentY = (orb.baseY - t * orb.speed * 18) % 120;
          const yPos = currentY < 0 ? currentY + 120 : currentY;
          const wobbleX = Math.sin(t * 0.8 + orb.id) * 3;
          return (
            <div
              key={orb.id}
              className="absolute rounded-full pointer-events-none mix-blend-screen transition-opacity duration-1000"
              style={{
                width: `${orb.size}px`,
                height: `${orb.size}px`,
                left: `${orb.baseX + wobbleX}%`,
                top: `${yPos}%`,
                background: `radial-gradient(circle, ${orb.hue}${orb.opacity}) 0%, ${orb.hue}${orb.opacity * 0.4}) 50%, transparent 75%)`,
                filter: `blur(${orb.blur}px)`,
              }}
            />
          );
        })}

        {/* Shimmering Starburst Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute w-2 h-2 rounded-full bg-[#fff2c6] opacity-75 animate-ping"
            style={{ top: "18%", left: "24%", animationDuration: "3.2s" }}
          />
          <div
            className="absolute w-1.5 h-1.5 rounded-full bg-[#fce096] opacity-80 animate-ping"
            style={{ top: "32%", right: "28%", animationDuration: "4.1s" }}
          />
          <div
            className="absolute w-2 h-2 rounded-full bg-[#ffd875] opacity-60 animate-ping"
            style={{ bottom: "25%", left: "18%", animationDuration: "3.8s" }}
          />
          <div
            className="absolute w-1 h-1 rounded-full bg-[#ffffff] opacity-90 animate-ping"
            style={{ bottom: "42%", right: "22%", animationDuration: "2.9s" }}
          />
        </div>
      </div>

      {/* 2. CINEMATIC LETTERBOX BARS (Top & Bottom filmic bars as seen in video) */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/85 via-black/40 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20 pointer-events-none" />

      {/* 3. SCENE CONTENT CONTAINER */}
      {(() => {
        const s1 = getSceneTransition(t, 0.0, 5.8, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s2 = getSceneTransition(t, 5.5, 11.8, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s3 = getSceneTransition(t, 11.5, 18.2, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s4 = getSceneTransition(t, 18.0, 24.8, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s5 = getSceneTransition(t, 24.5, 31.8, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s6 = getSceneTransition(t, 31.5, 39.8, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s7 = getSceneTransition(t, 39.5, 47.5, { fadeInDuration: 0.7, fadeOutDuration: 0.6, entryTranslateY: 15 });
        const s8 = getSceneTransition(t, 47.0, 55.0, { fadeInDuration: 0.7, fadeOutDuration: 0.2, exitScale: 1.0, entryTranslateY: 15 });

        return (
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-8 text-center">
            {/* ========================================================= */}
            {/* SCENE 1: WEDDING INVITATION & SPARKLING HEART (0 - 5.5s) */}
            {/* ========================================================= */}
            {s1.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-xs"
                style={s1.style}
              >
                {/* Animated Particle Heart SVG that draws around the title */}
                <div className="relative w-64 h-52 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 180"
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  >
                    <defs>
                      <linearGradient id="goldHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffebb3" />
                        <stop offset="35%" stopColor="#d4af37" />
                        <stop offset="70%" stopColor="#f3e5ab" />
                        <stop offset="100%" stopColor="#aa771c" />
                      </linearGradient>
                      <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2.5" result="glow" />
                        <feMerge>
                          <feMergeNode in="glow" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Heart Path with progressive stroke drawing */}
                    {(() => {
                      const drawProgress = Math.min(1, Math.max(0, (t - 0.2) / 2.2));
                      const pathLength = 540;
                      const dashOffset = pathLength * (1 - drawProgress);
                      return (
                        <path
                          d="M 100 160 C 20 100, 10 35, 60 15 C 85 5, 95 25, 100 35 C 105 25, 115 5, 140 15 C 190 35, 180 100, 100 160 Z"
                          fill="none"
                          stroke="url(#goldHeartGrad)"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          filter="url(#heartGlow)"
                          style={{
                            strokeDasharray: pathLength,
                            strokeDashoffset: dashOffset,
                            transition: "stroke-dashoffset 0.1s linear",
                          }}
                        />
                      );
                    })()}

                    {/* Glowing Sparkle star at the tip of drawing */}
                    {t > 0.3 && t < 3.2 && (
                      <circle
                        cx="100"
                        cy="35"
                        r="3.5"
                        fill="#ffffff"
                        filter="url(#heartGlow)"
                        className="animate-pulse"
                      />
                    )}
                  </svg>

                  {/* Title nestled inside the heart: "Wedding Invitation" */}
                  <div className="relative z-10 flex flex-col items-center">
                    <h1
                      className="font-serif italic text-3xl sm:text-4xl text-transparent bg-clip-text font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      style={{
                        fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                        backgroundImage:
                          "linear-gradient(135deg, #fff3cf 0%, #d4af37 40%, #f6e6b4 70%, #aa7a22 100%)",
                        textShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
                      }}
                    >
                      Wedding Invitation
                    </h1>

                    {/* Date under the heart tip */}
                    <div className="mt-6 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#e6c687] font-serif font-light">
                      <span className="w-4 h-[1px] bg-[#c5a059]/60" />
                      <span>{data.eventDate || "28.04.2026"}</span>
                      <span className="w-4 h-[1px] bg-[#c5a059]/60" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 2: THE BIG DAY • OUR WEDDING (5.5 - 11.5s)          */}
            {/* ========================================================= */}
            {s2.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-md"
                style={s2.style}
              >
                {/* Elegant Script: The Big Day */}
                <h2
                  className="text-4xl sm:text-5xl font-serif italic text-transparent bg-clip-text font-normal mb-2 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
                  style={{
                    fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                    backgroundImage:
                      "linear-gradient(135deg, #fff7d6 0%, #e0bb4f 35%, #fce9b8 65%, #9d6d1b 100%)",
                    textShadow: "0 0 25px rgba(224, 187, 79, 0.5)",
                  }}
                >
                  The Big Day
                </h2>

                {/* Dual Line Accent: OUR WEDDING */}
                <div className="flex items-center justify-center gap-3 w-full my-2">
                  <div className="flex-1 max-w-[60px] h-[1px] bg-gradient-to-r from-transparent to-[#c5a059]" />
                  <div className="text-[11px] sm:text-xs font-serif tracking-[0.3em] uppercase text-[#ecd4a2] font-semibold">
                    {data.eventHeading?.toUpperCase() || "OUR WEDDING"}
                  </div>
                  <div className="flex-1 max-w-[60px] h-[1px] bg-gradient-to-l from-transparent to-[#c5a059]" />
                </div>

                {/* Host Families Intro */}
                <div className="mt-5 space-y-1.5 px-4">
                  <p className="text-[10px] tracking-[0.25em] text-[#ab9475] uppercase font-light">
                    {data.familyIntro || "THE FAMILIES OF"}
                  </p>
                  <p className="text-sm sm:text-base font-serif text-[#f2e6cb] font-medium leading-snug">
                    {data.familyLateFather}
                  </p>
                  <p className="text-xs text-[#c2ab87] italic">&amp;</p>
                  <p className="text-sm sm:text-base font-serif text-[#f2e6cb] font-medium leading-snug">
                    {data.familySecondFather}
                  </p>
                  <p className="text-[11px] text-[#d6b77c] italic mt-2">
                    {data.invitationPhrase || "cordially invite you to celebrate the union of"}
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 3: BRIDE SPOTLIGHT (11.5 - 18.0s)                   */}
            {/* ========================================================= */}
            {s3.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-sm"
                style={s3.style}
              >
                {/* Bride Portrait with Soft Feathered Glowing Frame */}
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-4">
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none opacity-70 animate-pulse"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(240, 196, 92, 0.4) 0%, rgba(180, 120, 30, 0.15) 60%, transparent 75%)",
                      filter: "blur(12px)",
                    }}
                  />

                  <div className="absolute inset-0 rounded-full border border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.4)] pointer-events-none z-10" />

                  <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative">
                    <img
                      src={bridePhoto}
                      alt={data.brideName}
                      className="w-full h-full object-cover transform transition-transform duration-[6000ms] ease-out scale-105 hover:scale-110"
                      style={{
                        transform: `scale(${1.04 + (t - 11.5) * 0.015})`,
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-amber-400/10 pointer-events-none" />
                  </div>

                  <div className="absolute -top-1 right-2 text-[#ffd875] text-lg animate-spin" style={{ animationDuration: "8s" }}>
                    ✦
                  </div>
                </div>

                <h3
                  className="text-3xl sm:text-4xl font-serif italic text-transparent bg-clip-text font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                    backgroundImage:
                      "linear-gradient(135deg, #ffffff 0%, #e6c56b 40%, #ffd984 70%, #b38025 100%)",
                    textShadow: "0 0 18px rgba(230, 197, 107, 0.4)",
                  }}
                >
                  {data.brideName || "Aisha Umar Ali"}
                </h3>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.35em] text-[#d6b77c] uppercase font-semibold font-serif">
                    BRIDE
                  </span>
                  {data.brideNick && (
                    <span className="text-xs text-[#a89073] italic">({data.brideNick})</span>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 4: GROOM SPOTLIGHT (18.0 - 24.5s)                   */}
            {/* ========================================================= */}
            {s4.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-sm"
                style={s4.style}
              >
                <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-4">
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none opacity-70 animate-pulse"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(240, 196, 92, 0.4) 0%, rgba(180, 120, 30, 0.15) 60%, transparent 75%)",
                      filter: "blur(12px)",
                    }}
                  />

                  <div className="absolute inset-0 rounded-full border border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.4)] pointer-events-none z-10" />

                  <div className="w-full h-full rounded-full overflow-hidden shadow-2xl relative">
                    <img
                      src={groomPhoto}
                      alt={data.groomName}
                      className="w-full h-full object-cover transform transition-transform duration-[6000ms] ease-out scale-105 hover:scale-110"
                      style={{
                        transform: `scale(${1.04 + (t - 18.0) * 0.015})`,
                      }}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-amber-400/10 pointer-events-none" />
                  </div>

                  <div className="absolute -top-1 left-2 text-[#ffd875] text-lg animate-spin" style={{ animationDuration: "8s" }}>
                    ✦
                  </div>
                </div>

                <h3
                  className="text-3xl sm:text-4xl font-serif italic text-transparent bg-clip-text font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                    backgroundImage:
                      "linear-gradient(135deg, #ffffff 0%, #e6c56b 40%, #ffd984 70%, #b38025 100%)",
                    textShadow: "0 0 18px rgba(230, 197, 107, 0.4)",
                  }}
                >
                  {data.groomName || "Hassan Yakubu Abubakar"}
                </h3>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] tracking-[0.35em] text-[#d6b77c] uppercase font-semibold font-serif">
                    GROOM
                  </span>
                  {data.groomNick && (
                    <span className="text-xs text-[#a89073] italic">({data.groomNick})</span>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 5: ROMANTIC / SACRED LOVE QUOTE (24.5 - 31.5s)      */}
            {/* ========================================================= */}
            {s5.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-sm"
                style={s5.style}
              >
                <p className="text-xs tracking-[0.4em] uppercase text-[#c5a059] font-serif font-light mb-1">
                  A TRUE
                </p>

                <h2
                  className="text-5xl sm:text-6xl font-serif italic text-transparent bg-clip-text font-normal my-2 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
                  style={{
                    fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                    backgroundImage:
                      "linear-gradient(135deg, #fff7d6 0%, #e0bb4f 35%, #fce9b8 65%, #9d6d1b 100%)",
                    textShadow: "0 0 30px rgba(224, 187, 79, 0.6)",
                  }}
                >
                  Love Story
                </h2>

                <div className="flex items-center gap-2.5 my-3 text-xs tracking-[0.3em] uppercase text-[#eed6a8] font-serif font-medium">
                  <span className="text-[#ffd875]">✦</span>
                  <span>NEVER ENDS</span>
                  <span className="text-[#ffd875]">✦</span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-black/30 border border-[#c5a059]/20 backdrop-blur-sm max-w-xs">
                  <p
                    className="text-xs text-[#d6c4a5] font-serif leading-relaxed italic"
                    dir="rtl"
                  >
                    {data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
                  </p>
                  <p className="text-[11px] text-[#baa382] font-serif italic mt-1.5 leading-snug">
                    "And We created you in pairs."
                    <span className="block text-[9px] text-[#8e7a63] not-italic mt-0.5">
                      Surah An-Naba (78:8)
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 6: WEDDING CEREMONY & INTERLOCKING RINGS (31.5 - 39.5s) */}
            {/* ========================================================= */}
            {s6.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-md"
                style={s6.style}
              >
                <div className="text-xs tracking-[0.35em] text-[#d6b77c] uppercase font-serif font-light mb-3">
                  = {data.eventDate || "28 APR 2026"} =
                </div>

                <div className="flex items-center justify-center gap-3 my-2 flex-wrap">
                  <span className="text-lg sm:text-xl font-serif tracking-[0.2em] uppercase text-[#f2e6cb] font-semibold">
                    WEDDING
                  </span>

                  <div className="relative w-12 h-9 flex items-center justify-center">
                    <svg viewBox="0 0 50 35" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fff2c6" />
                          <stop offset="50%" stopColor="#d4af37" />
                          <stop offset="100%" stopColor="#8a6015" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="18"
                        cy="18"
                        r="12"
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth="3.2"
                      />
                      <circle
                        cx="32"
                        cy="18"
                        r="12"
                        fill="none"
                        stroke="url(#ringGrad)"
                        strokeWidth="3.2"
                      />
                      <polygon
                        points="32,2 35,6 32,10 29,6"
                        fill="#ffffff"
                        filter="drop-shadow(0 0 4px #ffd875)"
                      />
                    </svg>
                  </div>

                  <span className="text-lg sm:text-xl font-serif tracking-[0.2em] uppercase text-[#f2e6cb] font-semibold">
                    CEREMONY
                  </span>
                </div>

                <div className="text-xs text-[#c5a059] tracking-widest font-serif mt-2">
                  TIME: {data.eventTime || "10:00 AM"}
                </div>

                <div className="mt-4 px-6 py-3 rounded-2xl bg-black/40 border border-[#c5a059]/25 backdrop-blur-sm max-w-xs">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#a89073] block mb-1">
                    VENUE
                  </span>
                  <p className="text-xs sm:text-sm font-serif text-[#f2e6cb] leading-relaxed">
                    {data.venueAddress || "Grand Palace Banquet Hall, Turaki Way, Jalingo."}
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 7: RECEPTION & WALIMA GEOMETRIC FRAME (39.5 - 47.0s) */}
            {/* ========================================================= */}
            {s7.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-sm"
                style={s7.style}
              >
                <div className="relative w-full p-6 sm:p-7 rounded-lg border border-[#c5a059]/60 shadow-[0_0_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(197,160,89,0.1)] bg-gradient-to-b from-[#1c120a]/85 via-[#120b06]/90 to-[#0e0804]/95">
                  <div className="absolute inset-1.5 border border-[#deb86e]/30 pointer-events-none rounded" />
                  <div className="absolute -top-2.5 -left-2.5 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] pointer-events-none" />
                  <div className="absolute -top-2.5 -right-2.5 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] pointer-events-none" />
                  <div className="absolute -bottom-2.5 -left-2.5 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] pointer-events-none" />
                  <div className="absolute -bottom-2.5 -right-2.5 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] pointer-events-none" />

                  <div className="flex justify-center -mt-9 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#2a1a0f] border border-[#c5a059]/70 text-[9px] tracking-[0.3em] uppercase text-[#e6c56b] font-serif shadow-md">
                      FUNCTION
                    </span>
                  </div>

                  <h3
                    className="text-3xl sm:text-4xl font-serif italic text-transparent bg-clip-text font-normal my-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                    style={{
                      fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                      backgroundImage:
                        "linear-gradient(135deg, #ffffff 0%, #e6c56b 40%, #ffd984 70%, #b38025 100%)",
                    }}
                  >
                    {data.goldenBokehFunctionTitle || data.receptionNote || "Walima & Reception"}
                  </h3>

                  <p className="text-[11px] tracking-[0.2em] uppercase text-[#c2ab87] font-serif mt-2">
                    AT OUR RESIDENCE
                  </p>

                  <p className="text-xs text-[#e6c687] font-serif font-light mt-1">
                    {data.eventDate}
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* SCENE 8: CLOSING BLESSING & MONOGRAM SEAL (47.0 - 54.0s)  */}
            {/* ========================================================= */}
            {s8.isVisible && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-sm"
                style={s8.style}
              >
                <h3
                  className="text-2xl sm:text-3xl font-serif italic text-transparent bg-clip-text font-normal mb-4 leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  style={{
                    fontFamily: "'Great Vibes', 'Alex Brush', cursive",
                    backgroundImage:
                      "linear-gradient(135deg, #fff7d6 0%, #e0bb4f 40%, #fce9b8 70%, #9d6d1b 100%)",
                  }}
                >
                  Looking forward for your precious presence
                </h3>

                <div className="relative w-24 h-24 my-3 flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full border border-dashed border-[#c5a059]/60 animate-spin"
                    style={{ animationDuration: "25s" }}
                  />
                  <div className="absolute inset-1.5 rounded-full border border-[#d4af37]/80 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />

                  <div className="flex flex-col items-center justify-center z-10">
                    <span
                      className="text-2xl font-serif font-bold text-transparent bg-clip-text tracking-wider"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #ffffff 0%, #ffd984 50%, #b38025 100%)",
                      }}
                    >
                      {data.groomName?.charAt(0) || "H"} &amp; {data.brideName?.charAt(0) || "A"}
                    </span>
                    <span className="text-[7px] tracking-[0.25em] text-[#d4af37] uppercase mt-0.5">
                      ROYAL UNION
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-[#a89073] block mb-1">
                    {data.rsvpLabel || "RSVP"}
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 text-xs font-mono text-[#ecd4a2]">
                    {data.rsvpNumbers?.map((num, idx) => (
                      <span key={idx} className="bg-black/30 px-2 py-0.5 rounded border border-[#c5a059]/30">
                        {num}
                      </span>
                    ))}
                  </div>
                  {data.courtesyName && (
                    <p className="text-[11px] text-[#b39e80] italic mt-2">
                      With Best Compliments: {data.courtesyName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
