import React, { useMemo } from "react";
import { InvitationData } from "../types";
import { Sparkles, Heart } from "lucide-react";
import { getCoupleMonogram } from "../utils/monogramHelper";
import { getSceneTransition } from "../utils/transitionHelper";

interface BaroqueTablescapePlayerProps {
  data: InvitationData;
  currentTime: number;
}

export const BaroqueTablescapePlayer: React.FC<BaroqueTablescapePlayerProps> = ({
  data,
  currentTime: t,
}) => {
  // Extract custom text values or sensible defaults from user data
  const groomDisplay = data.groomNick || data.groomName.split(" ")[0] || "Shakeeb";
  const brideDisplay = data.brideNick || data.brideName.split(" ")[0] || "Saniya";
  const groomFullName = data.groomName || "Abdul Shakeeb";
  const brideFullName = data.brideName || "Saniya";
  const dateDisplay = data.eventDate || "13 OCTOBER 2025";
  const venueDisplay = data.venueAddress || data.venueLabel || "'AMBEDKAR BHAVAN' Near Kadamandalagi Road, Behind Bus-Depot, Byadgi";
  
  // Dynamic Monogram from couple's first letters (e.g. HA for Hassan & Aisha, SS for Shakeeb & Saniya)
  const monogram = getCoupleMonogram(data);

  const quranArabic = data.baroqueQuranArabic || "وَخَلَقْنَاكُمْ أَزْوَاجًا";
  const quranTranslation = data.baroqueQuranTranslation || '"And We created you in pairs"';
  const foreverTitle = data.baroqueForeverTitle || "WE HAVE DECIDED ON";
  const foreverQuote = data.baroqueForeverQuote || "Forever";
  const valimaTitle = data.baroqueValimaTitle || "Insha Allah Valima:";
  const valimaDate = data.baroqueValimaDate || "Tuesday 14 October 2025";
  const valimaVenue = data.baroqueValimaVenue || "Anjuman Shadi Sabha Mahal, Behind Nayara Petroleum, Masur";

  // Slow subtle camera breathing
  const cameraZoom = 1 + (t % 34) * 0.0018;

  // Floating ambient dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      x: 10 + ((i * 19.3) % 80),
      y: 10 + ((i * 31.7) % 80),
      size: 2 + (i % 3),
      delay: (i * 0.4) % 3,
    }));
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#f4eee6] font-sans flex flex-col justify-between text-[#241c14]">
      {/* ========================================================================= */}
      {/* 1. ULTRA-LUXURY WHITE SATIN & GOLD CANDLELIGHT TABLESCAPE BACKDROP        */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${cameraZoom})`,
          background:
            "radial-gradient(ellipse at 50% 30%, #ffffff 0%, #fbf7f0 35%, #efe7db 70%, #dfd4c4 100%)",
        }}
      >
        {/* Soft Silky Draping Shadows */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            background:
              "repeating-linear-gradient(115deg, rgba(210, 195, 175, 0.25) 0px, rgba(210, 195, 175, 0.25) 35px, transparent 35px, transparent 90px)",
            filter: "blur(20px)",
          }}
        />

        {/* Golden Candlelight Glow in upper right */}
        <div
          className="absolute -top-10 right-4 w-72 h-72 rounded-full pointer-events-none opacity-60 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 215, 120, 0.8) 0%, rgba(245, 170, 60, 0.3) 45%, transparent 75%)",
            filter: "blur(25px)",
          }}
        />

        {/* Ambient Silver Crystal Candelabra Sparkle in upper left */}
        <div
          className="absolute top-12 -left-8 w-60 h-60 rounded-full pointer-events-none opacity-45 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 245, 230, 0.9) 0%, rgba(220, 210, 200, 0.3) 50%, transparent 75%)",
            filter: "blur(20px)",
          }}
        />

        {/* Ambient floating gold/crystal dust particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#fde9b8] opacity-70 animate-pulse pointer-events-none"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDuration: "3s",
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 6px rgba(230, 180, 80, 0.7)",
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. FOREGROUND DECORATIVE TABLE ELEMENTS (White roses, candles, pearls)   */}
      {/* ========================================================================= */}
      {/* Bottom reflective silver tray & scattered white peonies motif */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10 flex items-end justify-between px-3 pb-2 opacity-90">
        {/* Left white floral bouquet impression */}
        <div className="flex items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ffffff] via-[#f7f2ea] to-[#e6dccf] shadow-md border border-[#eee4d6] flex items-center justify-center opacity-85">
            <span className="text-xl">🌸</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ffffff] to-[#ede3d4] shadow-sm border border-[#eee4d6] -ml-4 -mt-3 flex items-center justify-center opacity-80">
            <span className="text-base">🤍</span>
          </div>
        </div>

        {/* Center reflective silver vanity tray edge */}
        <div className="flex-1 mx-3 h-5 rounded-full bg-gradient-to-r from-[#d8d0c4] via-[#f5f2ec] to-[#cfc5b8] shadow-inner border border-[#c4baa8]/60 opacity-60 flex items-center justify-center">
          <div className="w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#b49e82] to-transparent" />
        </div>

        {/* Right golden spheres & pearls */}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#c5a059] to-[#fff2c6] shadow-sm" />
          <div className="w-3 h-3 rounded-full bg-[#ffffff] shadow-sm border border-[#e5dcce]" />
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#d4af37] to-[#ffeebf] shadow-sm" />
        </div>
      </div>

      {/* Top right candlelight taper flame */}
      <div className="absolute top-2 right-6 pointer-events-none z-10 flex flex-col items-center opacity-85">
        <div className="w-2 h-4 rounded-full bg-gradient-to-t from-[#f59e0b] via-[#fbbf24] to-[#fffbeb] shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse" />
        <div className="w-2.5 h-10 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#b45309] rounded-t-sm shadow-sm" />
      </div>

      {/* Top left crystal candelabra motif */}
      <div className="absolute top-2 left-6 pointer-events-none z-10 flex flex-col items-center opacity-75">
        <div className="w-1.5 h-3 rounded-full bg-gradient-to-t from-[#f59e0b] to-[#fffbeb] shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
        <div className="w-2 h-8 bg-gradient-to-r from-[#b5a798] via-[#e2ded7] to-[#9c8e7f] rounded-t-sm" />
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC SCENES CONTAINER (Synchronized to exact 34s progression)       */}
      {/* ========================================================================= */}
      {(() => {
        const s1 = getSceneTransition(t, 0.0, 3.9, { fadeInDuration: 0.6, fadeOutDuration: 0.45 });
        const s2 = getSceneTransition(t, 3.8, 7.1, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s3 = getSceneTransition(t, 7.0, 10.3, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s4 = getSceneTransition(t, 10.2, 13.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s5 = getSceneTransition(t, 13.5, 17.1, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s6 = getSceneTransition(t, 17.0, 19.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s7 = getSceneTransition(t, 19.5, 23.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s8 = getSceneTransition(t, 23.5, 26.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s9 = getSceneTransition(t, 26.5, 30.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s10 = getSceneTransition(t, 30.5, 32.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s11 = getSceneTransition(t, 32.5, 35.0, { fadeInDuration: 0.6, fadeOutDuration: 0.2, exitScale: 1.0 });

        return (
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 py-8 text-center">
            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 1 (0.0s - 3.8s): WHITE CERAMIC WEDDING ARCH WITH FLORAL EMBOSS   */}
            {/* ----------------------------------------------------------------------- */}
            {s1.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s1.style}>
                {/* White Acrylic Sculpted Double Arch Stand */}
                <div className="relative w-full aspect-[4/5] max-h-[380px] bg-gradient-to-b from-[#ffffff] via-[#fbf9f5] to-[#f4ede3] rounded-t-full shadow-[0_20px_45px_rgba(160,130,90,0.22)] border-2 border-[#eee5d8] p-5 flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="absolute top-2 right-2 w-3/4 h-5/6 rounded-t-full border border-[#e8ded0] pointer-events-none opacity-40" />

                  {/* 3D Pearl and Ceramic Flower Embellishments on rim */}
                  <div className="absolute top-8 right-5 flex flex-col items-center gap-1 pointer-events-none">
                    <span className="text-2xl drop-shadow-sm">🌸</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-white shadow-md border border-[#dfd4c5]" />
                    <div className="w-3.5 h-3.5 rounded-full bg-[#fcf9f2] shadow-sm border border-[#d9ccb9]" />
                    <span className="text-lg -mt-1">✨</span>
                  </div>

                  {/* Left corner floral bunch */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 pointer-events-none">
                    <span className="text-xl">🌸</span>
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm border border-[#ded3c2]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#fff4db] shadow-sm border border-[#e5d9c7]" />
                  </div>

                  {/* Center Script Text as in video: "Wedding" */}
                  <div className="space-y-1.5 z-10">
                    <div className="text-[11px] font-cinzel tracking-[0.35em] text-[#917852] uppercase font-bold">
                      The Celebration Of
                    </div>
                    <h1
                      className="text-6xl sm:text-7xl font-bold tracking-tight text-[#1c150e] leading-none"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      Wedding
                    </h1>
                    <div className="w-12 h-[1.5px] bg-[#c5a059] mx-auto my-2" />
                    <div className="text-xs font-cinzel tracking-[0.2em] text-[#695438] font-semibold">
                      {groomDisplay} & {brideDisplay}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 2 (3.8s - 7.0s): GROOM'S ORNATE SILVER/GOLD ROUND MEDALLION     */}
            {/* ----------------------------------------------------------------------- */}
            {s2.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s2.style}>
                <div className="relative w-56 h-56 rounded-full p-3.5 bg-gradient-to-br from-[#cfc5b6] via-[#8f8576] to-[#4a4237] shadow-[0_18px_40px_rgba(70,55,40,0.35)] border-4 border-[#eae3d5] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#ffffff]/70 pointer-events-none" />
                  <div className="absolute inset-3 rounded-full border border-[#2b241c]/40 pointer-events-none" />

                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffffff] via-[#faf6ef] to-[#ede3d4] shadow-inner flex flex-col items-center justify-center p-4 text-center border border-[#d6c7b2]">
                    <div className="text-[10px] font-cinzel tracking-[0.3em] text-[#8a7250] uppercase font-bold mb-1">
                      The Groom
                    </div>
                    <div
                      className="text-4xl sm:text-5xl font-bold text-[#1a140d] leading-none px-2"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      {groomDisplay}
                    </div>
                    <div className="text-[10px] text-[#715c40] font-luxury mt-1.5 tracking-wider truncate max-w-[150px]">
                      {groomFullName}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 3 (7.0s - 10.2s): BRIDE'S ORNATE SILVER/GOLD ROUND MEDALLION    */}
            {/* ----------------------------------------------------------------------- */}
            {s3.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s3.style}>
                <div className="relative w-56 h-56 rounded-full p-3.5 bg-gradient-to-br from-[#cfc5b6] via-[#8f8576] to-[#4a4237] shadow-[0_18px_40px_rgba(70,55,40,0.35)] border-4 border-[#eae3d5] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#ffffff]/70 pointer-events-none" />
                  <div className="absolute inset-3 rounded-full border border-[#2b241c]/40 pointer-events-none" />

                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ffffff] via-[#faf6ef] to-[#ede3d4] shadow-inner flex flex-col items-center justify-center p-4 text-center border border-[#d6c7b2]">
                    <div className="text-[10px] font-cinzel tracking-[0.3em] text-[#8a7250] uppercase font-bold mb-1">
                      The Bride
                    </div>
                    <div
                      className="text-4xl sm:text-5xl font-bold text-[#1a140d] leading-none px-2"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      {brideDisplay}
                    </div>
                    <div className="text-[10px] text-[#715c40] font-luxury mt-1.5 tracking-wider truncate max-w-[150px]">
                      {brideFullName}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 4 (10.2s - 13.5s): DIE-CUT SCALLOPED "DECIDED ON FOREVER" PLAQUE */}
            {/* ----------------------------------------------------------------------- */}
            {s4.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s4.style}>
                <div
                  className="relative w-full max-w-[290px] py-9 px-6 bg-gradient-to-b from-[#ffffff] via-[#fcf9f4] to-[#f4ede2] rounded-3xl shadow-[0_18px_45px_rgba(130,105,75,0.25)] border-2 border-[#e6dac7] flex flex-col items-center justify-center text-center overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(10% 0%, 90% 0%, 100% 12%, 100% 88%, 90% 100%, 10% 100%, 0% 88%, 0% 12%)",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-gold-sweep" />
                  <div
                    className="absolute inset-2 pointer-events-none border border-[#c5a059]/70"
                    style={{
                      clipPath:
                        "polygon(10% 0%, 90% 0%, 100% 12%, 100% 88%, 90% 100%, 10% 100%, 0% 88%, 0% 12%)",
                    }}
                  />
                  <div
                    className="absolute inset-3.5 pointer-events-none border border-[#c5a059]/40"
                    style={{
                      clipPath:
                        "polygon(10% 0%, 90% 0%, 100% 12%, 100% 88%, 90% 100%, 10% 100%, 0% 88%, 0% 12%)",
                    }}
                  />

                  <div className="z-10 space-y-1">
                    <div className="text-[12px] font-cinzel tracking-[0.24em] font-semibold text-[#6e583c] uppercase">
                      {foreverTitle}
                    </div>
                    <div
                      className="text-5xl sm:text-6xl font-bold text-[#1e1710] leading-tight"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      {foreverQuote}
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1 text-[#c5a059]">
                      <span className="text-xs">✦</span>
                      <span className="text-[11px] font-cinzel tracking-widest text-[#8a7250]">
                        TWO SOULS • ONE DESTINY
                      </span>
                      <span className="text-xs">✦</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 5 (13.5s - 17.0s): MINI GOLD OVAL EASEL WITH QURANIC VERSE        */}
            {/* ----------------------------------------------------------------------- */}
            {s5.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s5.style}>
                <div className="relative w-64 h-48 rounded-[50%] p-3.5 bg-gradient-to-b from-[#e8c878] via-[#c5a059] to-[#7a5b23] shadow-[0_18px_45px_rgba(160,120,50,0.35)] border-2 border-[#fff3cc] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd983]/20 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="absolute -bottom-4 left-10 w-2 h-6 bg-gradient-to-b from-[#a38038] to-[#594317] rounded-sm pointer-events-none" />
                  <div className="absolute -bottom-4 right-10 w-2 h-6 bg-gradient-to-b from-[#a38038] to-[#594317] rounded-sm pointer-events-none" />

                  <div className="w-full h-full rounded-[50%] bg-gradient-to-b from-[#ffffff] via-[#fcf8f2] to-[#ede3d4] shadow-inner flex flex-col items-center justify-center px-4 py-2 text-center border border-[#d6c7b2]">
                    <div
                      className="text-2xl sm:text-3xl font-bold text-[#1c150e] leading-relaxed"
                      style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                    >
                      {quranArabic}
                    </div>
                    <div className="text-[11px] font-serif italic text-[#59462e] tracking-wide mt-1">
                      {quranTranslation}
                    </div>
                    <div className="text-[9px] font-cinzel text-[#8c7450] tracking-widest uppercase mt-1">
                      Surah An-Naba • 78:8
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 6 (17.0s - 19.5s): VINTAGE BAROQUE SWIVEL MIRROR REFLECTION       */}
            {/* ----------------------------------------------------------------------- */}
            {s6.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s6.style}>
                <div className="relative w-56 h-72 rounded-[50%] p-4 bg-gradient-to-b from-[#dfd7cc] via-[#948b7e] to-[#4e4539] shadow-[0_20px_45px_rgba(60,50,40,0.38)] border-4 border-[#f0eae0] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 rounded-t-full bg-[#c5baaa] border border-white flex items-center justify-center">
                    <span className="text-xs">👑</span>
                  </div>

                  <div className="w-full h-full rounded-[50%] bg-gradient-to-tr from-[#ede6db] via-[#ffffff] to-[#d6ccc0] shadow-inner flex flex-col items-center justify-center p-4 text-center relative overflow-hidden border border-[#bcb0a1]">
                    <div className="absolute -top-20 -left-20 w-40 h-80 bg-white/40 rotate-45 pointer-events-none blur-md animate-pulse" />

                    <div className="z-10 space-y-1">
                      <span className="text-2xl">💍</span>
                      <div className="text-xs font-cinzel tracking-[0.25em] text-[#5e4b33] font-bold uppercase">
                        Reflecting Love
                      </div>
                      <div
                        className="text-2xl font-bold text-[#1f170f]"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {groomDisplay} & {brideDisplay}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 7 (19.5s - 23.5s): GOLDEN DESKTOP FRAME INVITATION WITH GLOW HEART*/}
            {/* ----------------------------------------------------------------------- */}
            {s7.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s7.style}>
                <div className="relative w-full max-w-[290px] p-3.5 bg-gradient-to-b from-[#eed48f] via-[#c5a059] to-[#785b24] rounded-xl shadow-[0_22px_50px_rgba(140,105,40,0.35)] border-2 border-[#fff3cc] flex flex-col items-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="w-full bg-gradient-to-b from-[#ffffff] via-[#fcf8f2] to-[#f4ece0] rounded-lg p-4 border border-[#cfc0ab] shadow-inner text-center relative overflow-hidden">
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-rose-400/25 blur-sm flex items-center justify-center animate-ping pointer-events-none" />
                    <div className="absolute top-7 left-1/2 -translate-x-1/2 text-rose-500/80 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)] pointer-events-none">
                      <Heart className="w-6 h-6 fill-rose-400/70 stroke-rose-400" />
                    </div>

                    <div className="text-sm font-arabic font-bold text-[#8c7450] mb-3 mt-4">
                      {data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
                    </div>

                    <div className="text-[9px] font-cinzel text-[#705a3e] tracking-wider uppercase mb-2">
                      Together with our families, we cordially invite you to celebrate the Wedding Ceremony of
                    </div>

                    <div className="space-y-0.5 my-2">
                      <div className="text-base font-bold font-serif text-[#1c150e]">
                        {groomFullName}
                      </div>
                      <div className="text-xs text-[#c5a059] font-bold font-script">♥</div>
                      <div className="text-base font-bold font-serif text-[#1c150e]">
                        {brideFullName}
                      </div>
                    </div>

                    <div className="text-[10px] font-cinzel font-bold text-[#1f170f] tracking-widest uppercase my-1.5 border-y border-[#d9cdba] py-1">
                      ON : {dateDisplay}
                    </div>

                    <div className="text-[9px] text-[#5e4b33] font-serif leading-tight mt-1 line-clamp-2">
                      venue: {venueDisplay}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 8 (23.5s - 26.5s): ROYAL MONOGRAM CREST ON FLUTED MARBLE PLINTH   */}
            {/* ----------------------------------------------------------------------- */}
            {s8.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s8.style}>
                <div className="relative w-64 py-6 px-4 bg-gradient-to-b from-[#ffffff] via-[#faf6ef] to-[#ede3d4] rounded-2xl shadow-[0_20px_45px_rgba(100,85,65,0.28)] border-2 border-[#ded1bf] flex flex-col items-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none animate-gold-sweep" />
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none opacity-30"
                    style={{
                      background:
                        "repeating-linear-gradient(90deg, transparent 0px, transparent 12px, rgba(160, 140, 115, 0.3) 12px, rgba(160, 140, 115, 0.3) 14px)",
                    }}
                  />

                  <div className="absolute top-2 left-2 text-xs text-[#9a8c79]">✦</div>
                  <div className="absolute top-2 right-2 text-xs text-[#9a8c79]">✦</div>
                  <div className="absolute bottom-2 left-2 text-xs text-[#9a8c79]">✦</div>
                  <div className="absolute bottom-2 right-2 text-xs text-[#9a8c79]">✦</div>

                  <div className="relative w-40 h-48 rounded-[50%] p-3 bg-gradient-to-b from-[#ebd188] via-[#c5a059] to-[#6e501b] shadow-[0_12px_30px_rgba(140,105,40,0.35)] border-2 border-[#fff5d6] flex items-center justify-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-gradient-to-r from-[#c5a059] to-[#edd38c] rounded-full border border-white/60 shadow-sm flex items-center justify-center text-[10px] text-[#1c140c]">
                      👑
                    </div>

                    <div className="w-full h-full rounded-[50%] bg-gradient-to-b from-[#ffffff] to-[#f5ede0] shadow-inner flex flex-col items-center justify-center border border-[#d6c7b2]">
                      <div
                        className="text-5xl font-bold tracking-wider text-[#3d2c14] drop-shadow-sm"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {monogram}
                      </div>
                      <div className="w-8 h-[1px] bg-[#c5a059] my-1" />
                      <div className="text-[8px] font-cinzel text-[#8c7450] tracking-widest uppercase">
                        EST. 2025
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 9 (26.5s - 30.5s): FLAT-LAY GOLD FILIGREE TRAY INVITATION CARD   */}
            {/* ----------------------------------------------------------------------- */}
            {s9.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s9.style}>
                <div className="relative w-full max-w-[290px] p-3.5 bg-gradient-to-br from-[#e0d6c5] via-[#a89b88] to-[#594e40] rounded-2xl shadow-[0_24px_55px_rgba(70,55,40,0.4)] border-2 border-[#f7f2ea] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="w-full bg-gradient-to-b from-[#ffffff] via-[#fdfaf5] to-[#f4ebe0] rounded-xl p-4 border border-[#c5a059]/60 shadow-inner text-center space-y-1.5">
                    <div className="text-sm font-arabic font-bold text-[#8c7450]">
                      {data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"}
                    </div>
                    <div className="text-[8px] font-cinzel text-[#695438] tracking-widest uppercase">
                      In the Name of Allah, the Most Beneficent, the Most Merciful
                    </div>

                    <div className="w-16 h-[1px] bg-[#c5a059] mx-auto my-1" />

                    <div className="space-y-0.5 my-1">
                      <div className="text-sm font-bold font-serif text-[#1c150e]">
                        {groomFullName}
                      </div>
                      <div className="text-[11px] text-[#c5a059] font-script">♥</div>
                      <div className="text-sm font-bold font-serif text-[#1c150e]">
                        {brideFullName}
                      </div>
                    </div>

                    <div className="text-[9px] font-cinzel font-bold text-[#1f170f] tracking-widest uppercase border-y border-[#d9cdba] py-0.5">
                      ON : {dateDisplay}
                    </div>

                    <div className="text-[8px] text-[#5e4b33] font-serif leading-tight">
                      venue: {venueDisplay}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 10 (30.5s - 32.5s): VALIMA / RECEPTION GOLD FILIGREE EASEL        */}
            {/* ----------------------------------------------------------------------- */}
            {s10.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s10.style}>
                <div className="relative w-64 p-3.5 bg-gradient-to-b from-[#eed48f] via-[#c5a059] to-[#785b24] rounded-xl shadow-[0_18px_45px_rgba(140,105,40,0.35)] border border-[#fff3cc] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="w-full bg-gradient-to-b from-[#ffffff] via-[#faf6ef] to-[#f4ede3] rounded-lg p-3.5 border border-[#dfcca8] shadow-inner text-center space-y-1">
                    <div className="text-sm font-serif font-bold text-[#1f170e]">
                      {valimaTitle}
                    </div>
                    <div className="text-[10px] font-cinzel text-[#8c7450] font-semibold tracking-wider">
                      on {valimaDate}
                    </div>
                    <div className="w-12 h-[1px] bg-[#c5a059] mx-auto my-1" />
                    <div className="text-[9px] text-[#59462e] font-serif leading-tight">
                      {valimaVenue}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 11 (32.5s - 34.0s): GRAND PALACE AISLE CARD - WALKING INTO FOREVER*/}
            {/* ----------------------------------------------------------------------- */}
            {s11.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s11.style}>
                <div className="relative w-64 aspect-[3/4] p-3.5 bg-gradient-to-b from-[#ffffff] via-[#faf6f0] to-[#ede3d4] rounded-2xl shadow-[0_20px_50px_rgba(120,95,65,0.3)] border-2 border-[#d9cca8] flex flex-col items-center justify-between text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-gold-sweep" />
                  <div className="w-full flex-1 flex flex-col items-center justify-center relative">
                    <div className="text-4xl mb-1">🏰</div>
                    <div className="flex items-center gap-1.5 text-[#1c150e] font-serif text-lg font-bold">
                      <span>🤵</span>
                      <Heart className="w-4 h-4 fill-amber-400 stroke-amber-500 animate-pulse" />
                      <span>👰</span>
                    </div>
                    <div className="text-[10px] font-cinzel tracking-[0.25em] text-[#8a7250] uppercase mt-2 font-bold">
                      Together Forever
                    </div>
                    <div
                      className="text-2xl font-bold text-[#1f170f] mt-0.5"
                      style={{ fontFamily: "'Great Vibes', cursive" }}
                    >
                      {groomDisplay} & {brideDisplay}
                    </div>
                  </div>

                  <div className="w-full pt-1 border-t border-[#dfcca8]/70 text-[9px] font-cinzel tracking-widest text-[#715c40]">
                    BARAKALLAHU LAKUMA
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Subtle bottom timestamp / playback progress indicator bar */}
      <div className="relative z-30 w-full px-6 pb-2 flex items-center justify-between text-[10px] text-[#8c7450] opacity-70">
        <span>{Math.floor(t)}s</span>
        <span className="font-cinzel tracking-widest uppercase">Baroque Tablescape</span>
        <span>34s</span>
      </div>
    </div>
  );
};
