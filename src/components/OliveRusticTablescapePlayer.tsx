import React, { useMemo } from "react";
import { InvitationData } from "../types";
import { Sparkles, Heart } from "lucide-react";
import { getCoupleMonogram } from "../utils/monogramHelper";
import { getSceneTransition } from "../utils/transitionHelper";

interface OliveRusticTablescapePlayerProps {
  data: InvitationData;
  currentTime: number;
}

export const OliveRusticTablescapePlayer: React.FC<OliveRusticTablescapePlayerProps> = ({
  data,
  currentTime: t,
}) => {
  // Extract custom text values or sensible defaults matching the 5th video
  const groomDisplay = data.groomNick || data.groomName.split(" ")[0] || "Arshad";
  const brideDisplay = data.brideNick || data.brideName.split(" ")[0] || "Batool";
  const groomFullName = data.groomName || "MUHAMMAD ARSHAD";
  const brideFullName = data.brideName || "FATHIMA AL BATOOL";
  const dateDisplay = data.eventDate || "17TH NOVEMBER 2024";
  const venueDisplay = data.venueAddress || data.venueLabel || "@ PURAKKATTIRI JUMA MASJID";
  
  // Dynamic Monogram derived from couple initials
  const monogram = data.oliveMonogram || getCoupleMonogram(data);
  const monogramSeparated = `${monogram[0] || "A"} | ${monogram[1] || "B"}`;
  const monogramAnd = `${monogram[0] || "A"}&${monogram[1] || "B"}`;

  const bismillahText = data.oliveBismillahText || data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const holdDateText = data.oliveHoldDateText || "HOLD Our DATE";
  const quranQuote = data.oliveQuranQuote || "AND WE CREATED YOU IN PAIRS";
  const quranRef = data.oliveQuranRef || "[QURAN 78:8]";
  const nikahTime = data.oliveNikahTime || (data.eventTime ? `AT ${data.eventTime}` : "AT 04:00PM");
  const receptionTime = data.oliveReceptionTime || "AT 07:00PM";
  const receptionVenue = data.oliveReceptionVenue || (data.receptionNote ? `@ ${data.receptionNote}` : "@ FATHIMA'S HOUSE KAPPAD");
  const venueTitle = data.oliveVenueTitle || "VENUE";
  const finaleText = data.oliveFinaleText || "INSHA ALLAH";

  // Slow subtle camera breathing
  const cameraZoom = 1 + (t % 38) * 0.0015;

  // Floating ambient warm dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: 12 + ((i * 17.3) % 76),
      y: 12 + ((i * 29.7) % 76),
      size: 2 + (i % 3),
      delay: (i * 0.45) % 3,
    }));
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#eae6df] font-sans flex flex-col justify-between text-[#1f2e22]">
      {/* ========================================================================= */}
      {/* 1. REALISTIC AESTHETIC TABLESCAPE BACKDROP                                */}
      {/* (White brick wall, draped white silk satin, warm candlelight)             */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${cameraZoom})`,
          background: "radial-gradient(ellipse at 50% 25%, #faf8f5 0%, #eee9e0 45%, #ded8cb 100%)",
        }}
      >
        {/* Subtle white painted brick wall pattern in upper half */}
        <div
          className="absolute top-0 left-0 right-0 h-2/5 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(200,190,180,0.4) 1px, transparent 1px)`,
            backgroundSize: "44px 18px",
          }}
        />

        {/* Silky Draped Satin Shadows */}
        <div
          className="absolute inset-0 opacity-45 mix-blend-multiply pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(125deg, rgba(210, 200, 185, 0.3) 0px, rgba(210, 200, 185, 0.3) 40px, transparent 40px, transparent 100px)",
            filter: "blur(24px)",
          }}
        />

        {/* Warm Golden Candlelight Flare on Center-Right */}
        <div
          className="absolute top-1/4 right-2 w-72 h-72 rounded-full pointer-events-none opacity-60 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, rgba(255, 220, 140, 0.8) 0%, rgba(240, 180, 80, 0.25) 50%, transparent 75%)",
            filter: "blur(30px)",
          }}
        />

        {/* Realistic Botanical Olive Branch & Leaf Sunlight Shadow Cast on Background */}
        <div
          className="absolute -top-12 -left-8 w-[125%] h-[120%] pointer-events-none opacity-40 mix-blend-multiply transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${Math.sin(t * 0.9) * 8}px, ${Math.cos(t * 0.7) * 5}px) rotate(${Math.sin(t * 0.5) * 1.5}deg)`,
            filter: "blur(9px)",
          }}
        >
          <svg viewBox="0 0 500 800" className="w-full h-full fill-[#2c3d2f] stroke-[#2c3d2f]">
            {/* Main sweeping branch */}
            <path
              d="M -30,60 Q 120,160 220,310 T 360,540 Q 420,640 480,720"
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
            />
            {/* Secondary branches */}
            <path d="M 80,130 Q 160,110 260,140" fill="none" strokeWidth="8" strokeLinecap="round" />
            <path d="M 170,240 Q 280,260 360,220" fill="none" strokeWidth="7" strokeLinecap="round" />
            <path d="M 220,310 Q 270,410 230,520" fill="none" strokeWidth="8" strokeLinecap="round" />
            <path d="M 280,420 Q 380,460 450,420" fill="none" strokeWidth="6" strokeLinecap="round" />

            {/* Clusters of realistic olive leaves along the branches */}
            <ellipse cx="60" cy="110" rx="28" ry="11" transform="rotate(-30 60 110)" />
            <ellipse cx="110" cy="115" rx="32" ry="12" transform="rotate(-15 110 115)" />
            <ellipse cx="160" cy="105" rx="30" ry="11" transform="rotate(-40 160 105)" />
            <ellipse cx="205" cy="120" rx="26" ry="10" transform="rotate(-10 205 120)" />
            <ellipse cx="250" cy="135" rx="28" ry="11" transform="rotate(20 250 135)" />

            <ellipse cx="140" cy="190" rx="32" ry="12" transform="rotate(35 140 190)" />
            <ellipse cx="185" cy="220" rx="30" ry="11" transform="rotate(-25 185 220)" />
            <ellipse cx="230" cy="250" rx="34" ry="13" transform="rotate(15 230 250)" />
            <ellipse cx="290" cy="255" rx="30" ry="12" transform="rotate(45 290 255)" />
            <ellipse cx="340" cy="235" rx="28" ry="11" transform="rotate(-10 340 235)" />

            <ellipse cx="190" cy="290" rx="35" ry="13" transform="rotate(-50 190 290)" />
            <ellipse cx="230" cy="340" rx="36" ry="14" transform="rotate(65 230 340)" />
            <ellipse cx="280" cy="350" rx="32" ry="12" transform="rotate(-20 280 350)" />
            <ellipse cx="320" cy="390" rx="34" ry="13" transform="rotate(30 320 390)" />

            <ellipse cx="250" cy="430" rx="36" ry="14" transform="rotate(-45 250 430)" />
            <ellipse cx="330" cy="450" rx="35" ry="13" transform="rotate(25 330 450)" />
            <ellipse cx="400" cy="450" rx="32" ry="12" transform="rotate(-35 400 450)" />
            <ellipse cx="440" cy="425" rx="28" ry="11" transform="rotate(10 440 425)" />

            <ellipse cx="220" cy="510" rx="34" ry="13" transform="rotate(-30 220 510)" />
            <ellipse cx="270" cy="530" rx="36" ry="14" transform="rotate(50 270 530)" />
            <ellipse cx="340" cy="535" rx="35" ry="13" transform="rotate(-15 340 535)" />
            <ellipse cx="390" cy="590" rx="36" ry="14" transform="rotate(40 390 590)" />
            <ellipse cx="450" cy="670" rx="34" ry="13" transform="rotate(-25 450 670)" />
          </svg>
        </div>

        {/* Ambient floating gold dust specks */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-[#fde9b8] opacity-60 animate-pulse pointer-events-none"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDuration: "3.2s",
              animationDelay: `${p.delay}s`,
              boxShadow: "0 0 5px rgba(230, 190, 90, 0.6)",
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. AUTHENTIC TABLESCAPE ACCENT OBJECTS (Mirror, Vase, Radio, Candle, Jute)*/}
      {/* ========================================================================= */}

      {/* BACKGROUND LEFT: White Ornate Carved Vanity Swivel Mirror */}
      <div className="absolute top-2 left-3 pointer-events-none z-5 opacity-85">
        <div className="relative w-28 h-40 rounded-t-[50px] rounded-b-[40px] border-4 border-[#ffffff] shadow-[0_10px_25px_rgba(0,0,0,0.08)] bg-gradient-to-b from-[#f8f6f2] via-[#ffffff] to-[#eee8dd] p-1 flex items-center justify-center">
          {/* Swivel stand base */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-2 rounded-full bg-[#e8e2d5] border border-white" />
          <div className="w-full h-full rounded-t-[44px] rounded-b-[34px] bg-gradient-to-tr from-[#ebe4d8] via-[#ffffff] to-[#ded5c5] opacity-80 relative overflow-hidden">
            {/* Mirror soft reflection gleam */}
            <div className="absolute -top-10 -left-10 w-24 h-48 bg-white/40 rotate-45 blur-sm" />
          </div>
        </div>
      </div>

      {/* TOP LEFT: Ceramic Vase with Blooming White English Roses & Green Foliage */}
      <div className="absolute top-4 left-6 pointer-events-none z-10 flex flex-col items-center opacity-90">
        {/* White Roses Flower Cluster */}
        <div className="relative -mb-3 flex items-center justify-center">
          {/* Main White Garden Rose */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fbf9f4] to-[#ebe1d1] shadow-md border border-[#eee4d6] flex items-center justify-center relative">
            <span className="text-2xl drop-shadow-sm">🌸</span>
            {/* Green leaf peeking */}
            <div className="absolute -top-1 -right-1 w-4 h-6 rounded-full bg-[#5a725b] rotate-45 opacity-80" />
            <div className="absolute -bottom-1 -left-1 w-3 h-5 rounded-full bg-[#6b856c] -rotate-30 opacity-75" />
          </div>
          {/* Secondary smaller white rose */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffffff] to-[#ede3d4] shadow-sm border border-[#eee4d6] -ml-4 mt-2 flex items-center justify-center">
            <span className="text-lg">🤍</span>
          </div>
        </div>
        {/* Cylindrical Ceramic Ribbed Vase */}
        <div className="w-11 h-20 bg-gradient-to-r from-[#e8e1d5] via-[#ffffff] to-[#dcd3c4] rounded-b-xl shadow-lg border border-[#f0e9dd] relative overflow-hidden">
          <div className="absolute inset-y-0 left-2 w-[1px] bg-[#d9d0be]" />
          <div className="absolute inset-y-0 right-2 w-[1px] bg-[#d9d0be]" />
        </div>
      </div>

      {/* CENTER-RIGHT: Rustic Distressed Turned Wooden Candle Pedestal */}
      <div className="absolute top-8 right-20 pointer-events-none z-5 flex flex-col items-center opacity-85">
        <div className="w-10 h-3 rounded-full bg-[#2a241e] shadow-sm" />
        <div className="w-6 h-14 bg-gradient-to-b from-[#ffffff] via-[#ede6d9] to-[#ded5c5] rounded-lg border border-[#e4dccf] shadow-sm relative overflow-hidden">
          {/* Distressed marks */}
          <div className="absolute top-3 left-1 w-2 h-1 bg-[#8c7a65]/40 rounded-full" />
          <div className="absolute top-8 right-1 w-1.5 h-2 bg-[#8c7a65]/35 rounded-full" />
        </div>
        <div className="w-12 h-4 rounded-full bg-[#eae3d6] border border-[#d6cbba] shadow-sm" />
      </div>

      {/* FAR RIGHT: Gold Wire Cylinder Lantern with Tall Pillar Candle & Flame */}
      <div className="absolute top-10 right-3 pointer-events-none z-10 flex flex-col items-center opacity-90">
        {/* Animated flickering candle flame */}
        <div className="w-2.5 h-5 rounded-full bg-gradient-to-t from-[#f59e0b] via-[#fbbf24] to-[#fffbeb] shadow-[0_0_15px_rgba(245,158,11,0.95)] animate-pulse" />
        {/* Tall Cream Pillar Candle */}
        <div className="w-7 h-24 bg-gradient-to-r from-[#fffbf0] via-[#f7f0df] to-[#ede1c7] rounded-t-sm shadow-md border-t border-[#fff9e6] relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-[#ecd9b5] rounded-t-sm" />
        </div>
        {/* Golden wire cage base */}
        <div className="w-11 h-10 border-2 border-[#c5a059] rounded-b-lg shadow-sm -mt-4 bg-transparent flex justify-around items-end pb-1">
          <div className="w-[1.5px] h-full bg-[#c5a059]" />
          <div className="w-[1.5px] h-full bg-[#c5a059]" />
        </div>
      </div>

      {/* LOWER LEFT: Vintage Retro Ivory Radio Player */}
      <div className="absolute bottom-12 left-2 pointer-events-none z-15 opacity-90">
        <div className="relative w-24 h-16 rounded-xl bg-gradient-to-b from-[#ffffff] via-[#fbf7ee] to-[#ede3d1] border-2 border-[#d9ccb6] shadow-[0_10px_25px_rgba(50,40,30,0.18)] p-1.5 flex flex-col justify-between">
          {/* Top Brass Curved Handle */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-14 h-4 rounded-t-full border-2 border-[#c5a059] pointer-events-none" />
          {/* Horizontal Speaker Slats */}
          <div className="w-11 space-y-1 mt-1">
            <div className="h-1 bg-[#d6c7af] rounded-full" />
            <div className="h-1 bg-[#d6c7af] rounded-full" />
            <div className="h-1 bg-[#d6c7af] rounded-full" />
          </div>
          {/* Tuning Knob on Right */}
          <div className="absolute right-2 top-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#dfd2be] to-[#b39e7c] border border-[#8c7450] shadow-inner flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-[#594326]" />
          </div>
        </div>
      </div>

      {/* BOTTOM LEFT: Antique Turned Wooden Brass Wax Seal Stamp */}
      <div className="absolute bottom-10 left-28 pointer-events-none z-15 flex flex-col items-center opacity-85">
        <div className="w-3.5 h-10 bg-gradient-to-r from-[#634832] via-[#8a6646] to-[#422e1e] rounded-t-full shadow-md" />
        <div className="w-5 h-2.5 bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa8322] rounded-sm shadow-sm" />
      </div>

      {/* BOTTOM RIGHT: Scented Candle Jar with Twine ("JASMINE") */}
      <div className="absolute bottom-10 right-4 pointer-events-none z-15 flex flex-col items-center opacity-85">
        <div className="relative w-14 h-14 rounded-lg bg-gradient-to-b from-white/80 via-[#fcf6e8]/90 to-[#ede0c8]/80 border border-[#d6cbba] shadow-md flex items-center justify-center overflow-hidden">
          {/* Natural kraft paper label */}
          <div className="w-10 py-1 bg-[#f3ebd9] rounded border border-[#d6c8b0] text-center shadow-inner">
            <div className="text-[6px] font-sans text-[#8a7250] uppercase tracking-wider">HERBAL CANDLE</div>
            <div className="text-[7.5px] font-serif font-bold text-[#3d2f1f] tracking-widest">JASMINE</div>
          </div>
          {/* Jute string tied around rim */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#a38f72]" />
        </div>
        {/* Dried pampas bunny tails */}
        <div className="flex gap-1 -mt-1 pointer-events-none">
          <div className="w-1 h-6 bg-[#b59e7a] rotate-25 rounded-full" />
          <div className="w-1.5 h-4 bg-[#cbb898] -rotate-15 rounded-full" />
        </div>
      </div>

      {/* BOTTOM FOREGROUND: Round Woven Jute Mat */}
      <div className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-10 flex items-end justify-center overflow-hidden opacity-90">
        <div
          className="w-[120%] -mb-14 h-36 rounded-[50%] shadow-[0_-10px_30px_rgba(90,70,40,0.15)] border-4 border-[#bda682]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #c4ad88 0%, #b89f78 40%, #9e8560 80%, #7d6745 100%)",
            boxShadow: "inset 0 0 20px rgba(70, 50, 30, 0.3)",
          }}
        >
          {/* Woven concentric rings */}
          <div className="absolute inset-4 rounded-[50%] border border-[#a88f6a]/60" />
          <div className="absolute inset-8 rounded-[50%] border border-[#a88f6a]/40" />
          <div className="absolute inset-12 rounded-[50%] border border-[#a88f6a]/30" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC SCENES CONTAINER (Synchronized to exact 38s progression)       */}
      {/* ========================================================================= */}
      {(() => {
        const s1 = getSceneTransition(t, 0.0, 3.3, { fadeInDuration: 0.6, fadeOutDuration: 0.45 });
        const s2 = getSceneTransition(t, 3.2, 6.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s3 = getSceneTransition(t, 6.5, 9.9, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s4 = getSceneTransition(t, 9.8, 14.6, { fadeInDuration: 0.6, fadeOutDuration: 0.5 });
        const s5 = getSceneTransition(t, 14.5, 18.3, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s6 = getSceneTransition(t, 18.2, 22.1, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s7 = getSceneTransition(t, 22.0, 25.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s8 = getSceneTransition(t, 25.5, 29.6, { fadeInDuration: 0.6, fadeOutDuration: 0.5 });
        const s9 = getSceneTransition(t, 29.5, 33.1, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s10 = getSceneTransition(t, 33.0, 35.6, { fadeInDuration: 0.55, fadeOutDuration: 0.45 });
        const s11 = getSceneTransition(t, 35.5, 38.0, { fadeInDuration: 0.6, fadeOutDuration: 0.2, exitScale: 1.0 });

        return (
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-4 py-8 text-center">
            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 1 (0.0s - 3.2s): INTRO PANNING OVER AESTHETIC TABLESCAPE          */}
            {/* ----------------------------------------------------------------------- */}
            {s1.isVisible && (
              <div className="w-full max-w-[300px] flex flex-col items-center justify-center" style={s1.style}>
                <div className="relative">
                  {/* Soft background shadow cast onto tablescape */}
                  <div className="absolute -inset-2 -bottom-3 bg-[#0d1a10]/35 rounded-full blur-xl -z-10 pointer-events-none transform translate-y-3" />
                  <div className="bg-[#ffffff]/85 backdrop-blur-md py-3 px-5 rounded-full shadow-[0_12px_30px_rgba(30,50,35,0.18)] border border-[#d6ccb8] flex items-center gap-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-gold-sweep" />
                    <span className="text-xs text-[#526e54]">✦</span>
                    <span className="text-[11px] font-cinzel font-semibold tracking-[0.25em] text-[#2c3d2e] uppercase">
                      A Beautiful Union
                    </span>
                    <span className="text-xs text-[#526e54]">✦</span>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 2 (3.2s - 6.5s): FLAT-LAY BISMILLAH CARD ON SILK & JUTE MAT       */}
            {/* ----------------------------------------------------------------------- */}
            {s2.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s2.style}>
                {/* Deep Olive Horizontal Rectangular Card with rich background cast shadow */}
                <div className="relative w-full max-w-[280px]">
                  <div className="absolute -inset-3 -bottom-5 bg-[#0a170e]/55 rounded-2xl blur-xl -z-10 pointer-events-none transform translate-y-5 translate-x-1.5" />
                  <div className="absolute -inset-1 -bottom-2 bg-black/40 rounded-xl blur-md -z-10 pointer-events-none transform translate-y-2" />
                  <div className="relative w-full p-5 bg-gradient-to-b from-[#243928] via-[#1c2e20] to-[#152418] rounded-xl shadow-[0_20px_45px_rgba(20,35,25,0.45)] border border-[#3e5942] text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="absolute inset-2 rounded-lg border border-[#c5a059]/40 pointer-events-none" />

                    <div
                      className="text-2xl sm:text-3xl font-bold text-[#f5ebd7] leading-relaxed drop-shadow-sm pt-1"
                      style={{ fontFamily: "'Scheherazade New', 'Amiri', serif" }}
                    >
                      {bismillahText}
                    </div>
                    <div className="w-12 h-[1px] bg-[#c5a059] mx-auto my-2 opacity-70" />
                    <div className="text-[9px] font-cinzel text-[#d4c5ab] tracking-widest uppercase">
                      In the Name of Allah, the Most Gracious, the Most Merciful
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 3 (6.5s - 9.8s): GOLD WIRE ARCH STAND - "HOLD Our DATE"           */}
            {/* ----------------------------------------------------------------------- */}
            {s3.isVisible && (
              <div className="w-full max-w-[300px] flex flex-col items-center justify-center" style={s3.style}>
                <div className="relative w-56 aspect-[3/4]">
                  <div className="absolute inset-0 bg-[#3a2e1c]/45 rounded-t-full blur-xl -z-10 transform translate-y-6 translate-x-3 pointer-events-none" />
                  <div className="absolute -bottom-2 inset-x-4 h-4 bg-black/40 blur-md -z-10 pointer-events-none" />
                  <div className="w-full h-full rounded-t-full border-4 border-[#c5a059] bg-gradient-to-b from-white/70 via-white/40 to-white/15 backdrop-blur-sm shadow-[0_20px_45px_rgba(60,50,30,0.25)] p-4 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffd983]/15 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="absolute inset-2 rounded-t-full border border-[#eed794]/60 pointer-events-none" />
                    <div className="absolute bottom-0 inset-x-2 h-1 bg-[#c5a059]" />

                    <div className="space-y-0.5 z-10">
                      <div
                        className="text-3xl font-extrabold tracking-[0.2em] text-[#8a6b2d] uppercase drop-shadow-sm"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        HOLD
                      </div>
                      <div
                        className="text-4xl font-bold text-[#6d521d] -my-1"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        Our
                      </div>
                      <div
                        className="text-3xl font-extrabold tracking-[0.2em] text-[#8a6b2d] uppercase drop-shadow-sm"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        DATE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 4 (9.8s - 14.5s): MAIN BOTANICAL OLIVE INVITATION CARD            */}
            {/* ----------------------------------------------------------------------- */}
            {s4.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s4.style}>
                <div className="relative w-full max-w-[280px]">
                  <div className="absolute -inset-3 -bottom-6 bg-[#08140b]/60 rounded-3xl blur-2xl -z-10 pointer-events-none transform translate-y-7 translate-x-2" />
                  <div className="absolute -inset-1 -bottom-2 bg-black/40 rounded-2xl blur-md -z-10 pointer-events-none transform translate-y-2.5" />
                  <div className="relative w-full p-5 bg-gradient-to-b from-[#233829] via-[#1b2c1f] to-[#142318] rounded-2xl shadow-[0_25px_50px_rgba(15,30,20,0.5)] border border-[#446349] text-center space-y-1.5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="absolute top-2 left-2 text-xs text-[#a4bd9a]/50 pointer-events-none">🌿</div>
                    <div className="absolute top-2 right-2 text-xs text-[#a4bd9a]/50 pointer-events-none">🌿</div>
                    <div className="absolute bottom-2 left-2 text-xs text-[#a4bd9a]/50 pointer-events-none">🌿</div>
                    <div className="absolute bottom-2 right-2 text-xs text-[#a4bd9a]/50 pointer-events-none">🌿</div>

                    <div
                      className="text-lg font-bold tracking-[0.2em] text-[#eedcb8] pb-1 border-b border-[#3b543f]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {monogramAnd}
                    </div>

                    <div className="text-[8px] font-cinzel text-[#b5c7b6] tracking-widest uppercase pt-0.5">
                      IN THE NAME OF ALLAH THE MOST GRACIOUS AND THE MOST MERCIFUL
                    </div>

                    <div className="text-[7.5px] font-cinzel text-[#8da890] tracking-wider uppercase">
                      TOGETHER WITH OUR FAMILIES
                    </div>

                    <div
                      className="text-base sm:text-lg font-bold text-[#ffffff] tracking-wider pt-1"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {groomFullName}
                    </div>

                    <div className="text-xs text-[#eedcb8] font-script italic">and</div>

                    <div
                      className="text-base sm:text-lg font-bold text-[#ffffff] tracking-wider"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {brideFullName}
                    </div>

                    <div className="w-12 h-[1px] bg-[#c5a059] mx-auto my-1.5 opacity-60" />

                    <div className="text-[8px] font-cinzel text-[#c8d9c7] tracking-wider uppercase">
                      WE REQUEST THE HONOR OF YOUR PRESENCE ON OUR NIKKAH CEREMONY
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 5 (14.5s - 18.2s): DARK OLIVE ARCHED CEREMONY & RECEPTION SIGN    */}
            {/* ----------------------------------------------------------------------- */}
            {s5.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s5.style}>
                <div className="relative w-60 aspect-[3/4.6]">
                  <div className="absolute inset-0 bg-[#08140b]/55 rounded-t-full rounded-b-xl blur-2xl -z-10 pointer-events-none transform translate-y-7 translate-x-2.5" />
                  <div className="absolute inset-x-2 bottom-0 h-4 bg-black/45 blur-md -z-10 pointer-events-none" />
                  <div className="w-full h-full bg-gradient-to-b from-[#223627] via-[#1a2b1e] to-[#132217] rounded-t-full rounded-b-xl shadow-[0_24px_50px_rgba(15,30,20,0.48)] border border-[#3e5a43] p-4 flex flex-col items-center justify-between text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="pt-2">
                      <div
                        className="text-base font-bold tracking-[0.25em] text-[#eedcb8]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {monogramSeparated}
                      </div>
                      <div className="text-[9.5px] font-cinzel tracking-widest text-[#9cb39d] uppercase mt-0.5">
                        {groomDisplay} & {brideDisplay}
                      </div>
                    </div>

                    <div className="space-y-0.5 my-1">
                      <div
                        className="text-xl sm:text-2xl font-bold text-[#f7f2ea] leading-tight"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        Nikkah Ceremony
                      </div>
                      <div className="text-[10px] font-cinzel font-bold text-[#eedcb8] tracking-widest uppercase">
                        {dateDisplay}
                      </div>
                      <div className="text-[8.5px] font-cinzel text-[#a2b8a3] tracking-wider uppercase">
                        {nikahTime}
                      </div>
                      <div className="text-[8.5px] text-[#c2d4c0] font-serif leading-tight pt-0.5">
                        {venueDisplay}
                      </div>
                    </div>

                    <div className="w-full pt-1.5 border-t border-[#37523c] space-y-0.5 pb-1">
                      <div
                        className="text-base font-bold text-[#eedcb8] leading-tight"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        Reception
                      </div>
                      <div className="text-[8px] font-cinzel text-[#a2b8a3] tracking-wider uppercase">
                        {receptionTime}
                      </div>
                      <div className="text-[8px] text-[#c2d4c0] font-serif leading-tight">
                        {receptionVenue}
                      </div>
                    </div>

                    <div className="text-[10px] text-[#86a386]/60 pointer-events-none pb-0.5">
                      🌿 ─── ✦ ─── 🌿
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 6 (18.2s - 22.0s): CLOSE-UP "VENUE" ROUNDED PILL CARD             */}
            {/* ----------------------------------------------------------------------- */}
            {s6.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s6.style}>
                <div className="relative w-full max-w-[270px]">
                  <div className="absolute -inset-2 -bottom-4 bg-[#08140b]/50 rounded-full blur-xl -z-10 pointer-events-none transform translate-y-4" />
                  <div className="absolute -inset-0.5 -bottom-1.5 bg-black/35 rounded-full blur-sm -z-10 pointer-events-none transform translate-y-1.5" />
                  <div className="relative w-full py-6 px-4 bg-gradient-to-b from-[#223627] via-[#1a2b1e] to-[#132217] rounded-full shadow-[0_20px_45px_rgba(15,30,20,0.4)] border border-[#3e5a43] text-center space-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="absolute inset-1 rounded-full border border-[#c5a059]/30 pointer-events-none" />

                    <div
                      className="text-sm font-bold tracking-[0.3em] text-[#eedcb8] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {venueTitle}
                    </div>
                    <div className="w-8 h-[1px] bg-[#c5a059] mx-auto opacity-70" />
                    <div className="text-[10px] text-[#ffffff] font-serif font-semibold tracking-wider">
                      {venueDisplay}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 7 (22.0s - 25.5s): MINIATURE "AND WE CREATED YOU IN PAIRS" CARD   */}
            {/* ----------------------------------------------------------------------- */}
            {s7.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s7.style}>
                <div className="relative w-full max-w-[280px]">
                  <div className="absolute -inset-2 -bottom-4 bg-[#08140b]/50 rounded-2xl blur-xl -z-10 pointer-events-none transform translate-y-4" />
                  <div className="absolute -inset-0.5 -bottom-1.5 bg-black/35 rounded-xl blur-sm -z-10 pointer-events-none transform translate-y-1.5" />
                  <div className="relative w-full py-5 px-4 bg-gradient-to-b from-[#233829] via-[#1b2c1f] to-[#142318] rounded-lg shadow-[0_20px_45px_rgba(15,30,20,0.4)] border border-[#3e5a43] text-center space-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="absolute inset-1.5 rounded-md border border-[#c5a059]/35 pointer-events-none" />

                    <div
                      className="text-xs sm:text-sm font-bold tracking-[0.16em] text-[#f7f2ea] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {quranQuote}
                    </div>
                    <div className="text-[9px] font-cinzel text-[#eedcb8] tracking-widest">
                      {quranRef}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 8 (25.5s - 29.5s): VINTAGE OPEN BOOK WITH DRIED PAMPAS & BOOKMARK */}
            {/* ----------------------------------------------------------------------- */}
            {s8.isVisible && (
              <div className="w-full max-w-[330px] flex flex-col items-center justify-center" style={s8.style}>
                <div className="relative w-full max-w-[290px] aspect-[4/3]">
                  <div className="absolute -inset-4 -bottom-8 bg-[#2e2316]/55 rounded-2xl blur-2xl -z-10 pointer-events-none transform translate-y-7" />
                  <div className="absolute -inset-1 -bottom-2 bg-black/40 rounded-lg blur-md -z-10 pointer-events-none transform translate-y-2" />
                  <div className="relative w-full h-full bg-[#f8f3ea] rounded-md shadow-[0_22px_50px_rgba(50,40,25,0.25)] border border-[#d6c9b4] p-3 flex justify-between overflow-hidden">
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-transparent via-[#453725]/25 to-transparent pointer-events-none" />

                    <div className="w-[46%] space-y-1 opacity-40 text-left pointer-events-none">
                      <div className="h-1 bg-[#4a3b2b] rounded w-full" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-4/5" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-5/6" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-3/4" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-full" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-2/3" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-5/6" />
                    </div>

                    <div className="w-[46%] space-y-1 opacity-40 text-left pointer-events-none">
                      <div className="h-1 bg-[#4a3b2b] rounded w-full" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-3/4" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-5/6" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-4/5" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-full" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-2/3" />
                      <div className="h-1 bg-[#4a3b2b] rounded w-4/5" />
                    </div>

                    <div className="absolute top-2 left-1/3 -rotate-45 pointer-events-none opacity-85">
                      <div className="w-3 h-9 bg-gradient-to-t from-[#c5ad88] to-[#eeddc2] rounded-full shadow-sm" />
                      <div className="w-0.5 h-12 bg-[#8c7450] -mt-1 ml-1" />
                    </div>

                    <div className="absolute inset-x-5 inset-y-6 bg-gradient-to-b from-[#243928] via-[#1c2e20] to-[#142318] rounded-lg shadow-[0_15px_35px_rgba(10,25,15,0.45)] border border-[#3e5a43] -rotate-6 flex flex-col items-center justify-center p-3 text-center z-10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                      <div
                        className="text-xl sm:text-2xl font-bold text-[#ffffff] leading-tight"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {groomDisplay}
                      </div>
                      <div className="text-xs text-[#c5a059] font-script">♥</div>
                      <div
                        className="text-xl sm:text-2xl font-bold text-[#ffffff] leading-tight"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        {brideDisplay}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 9 (29.5s - 33.0s): ARCHED CEREMONY DETAILS (RECAP)                */}
            {/* ----------------------------------------------------------------------- */}
            {s9.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s9.style}>
                <div className="relative w-60 aspect-[3/4.6]">
                  <div className="absolute inset-0 bg-[#08140b]/55 rounded-t-full rounded-b-xl blur-2xl -z-10 pointer-events-none transform translate-y-7 translate-x-2.5" />
                  <div className="absolute inset-x-2 bottom-0 h-4 bg-black/45 blur-md -z-10 pointer-events-none" />
                  <div className="w-full h-full bg-gradient-to-b from-[#223627] via-[#1a2b1e] to-[#132217] rounded-t-full rounded-b-xl shadow-[0_24px_50px_rgba(15,30,20,0.48)] border border-[#3e5a43] p-4 flex flex-col items-center justify-between text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="pt-2">
                      <div
                        className="text-base font-bold tracking-[0.25em] text-[#eedcb8]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {monogramSeparated}
                      </div>
                      <div className="text-[9.5px] font-cinzel tracking-widest text-[#9cb39d] uppercase mt-0.5">
                        {groomDisplay} & {brideDisplay}
                      </div>
                    </div>

                    <div className="space-y-0.5 my-1">
                      <div
                        className="text-xl sm:text-2xl font-bold text-[#f7f2ea] leading-tight"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        Nikkah Ceremony
                      </div>
                      <div className="text-[10px] font-cinzel font-bold text-[#eedcb8] tracking-widest uppercase">
                        {dateDisplay}
                      </div>
                      <div className="text-[8.5px] font-cinzel text-[#a2b8a3] tracking-wider uppercase">
                        {nikahTime}
                      </div>
                      <div className="text-[8.5px] text-[#c2d4c0] font-serif leading-tight pt-0.5">
                        {venueDisplay}
                      </div>
                    </div>

                    <div className="w-full pt-1.5 border-t border-[#37523c] space-y-0.5 pb-1">
                      <div
                        className="text-base font-bold text-[#eedcb8] leading-tight"
                        style={{ fontFamily: "'Great Vibes', cursive" }}
                      >
                        Reception
                      </div>
                      <div className="text-[8px] font-cinzel text-[#a2b8a3] tracking-wider uppercase">
                        {receptionTime}
                      </div>
                      <div className="text-[8px] text-[#c2d4c0] font-serif leading-tight">
                        {receptionVenue}
                      </div>
                    </div>

                    <div className="text-[10px] text-[#86a386]/60 pointer-events-none pb-0.5">
                      🌿 ─── ✦ ─── 🌿
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 10 (33.0s - 35.5s): BOTANICAL MAIN INVITATION CARD CLOSE-UP       */}
            {/* ----------------------------------------------------------------------- */}
            {s10.isVisible && (
              <div className="w-full max-w-[320px] flex flex-col items-center justify-center" style={s10.style}>
                <div className="relative w-full max-w-[280px]">
                  <div className="absolute -inset-3 -bottom-6 bg-[#08140b]/60 rounded-3xl blur-2xl -z-10 pointer-events-none transform translate-y-7 translate-x-2" />
                  <div className="absolute -inset-1 -bottom-2 bg-black/40 rounded-2xl blur-md -z-10 pointer-events-none transform translate-y-2.5" />
                  <div className="relative w-full p-5 bg-gradient-to-b from-[#233829] via-[#1b2c1f] to-[#142318] rounded-2xl shadow-[0_25px_50px_rgba(15,30,20,0.5)] border border-[#446349] text-center space-y-1.5 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div
                      className="text-lg font-bold tracking-[0.2em] text-[#eedcb8] pb-1 border-b border-[#3b543f]"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {monogramAnd}
                    </div>

                    <div className="text-[8px] font-cinzel text-[#b5c7b6] tracking-widest uppercase pt-0.5">
                      IN THE NAME OF ALLAH THE MOST GRACIOUS AND THE MOST MERCIFUL
                    </div>

                    <div
                      className="text-base sm:text-lg font-bold text-[#ffffff] tracking-wider pt-1"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {groomFullName}
                    </div>

                    <div className="text-xs text-[#eedcb8] font-script italic">and</div>

                    <div
                      className="text-base sm:text-lg font-bold text-[#ffffff] tracking-wider"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {brideFullName}
                    </div>

                    <div className="w-12 h-[1px] bg-[#c5a059] mx-auto my-1.5 opacity-60" />

                    <div className="text-[8px] font-cinzel text-[#c8d9c7] tracking-wider uppercase">
                      WE REQUEST THE HONOR OF YOUR PRESENCE
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------------------------- */}
            {/* SCENE 11 (35.5s - 38.0s): "INSHA ALLAH" PILL CARD & GOLDEN FINALE      */}
            {/* ----------------------------------------------------------------------- */}
            {s11.isVisible && (
              <div className="w-full max-w-[310px] flex flex-col items-center justify-center" style={s11.style}>
                <div className="relative w-full max-w-[260px]">
                  <div className="absolute -inset-2 -bottom-4 bg-[#08140b]/50 rounded-full blur-xl -z-10 pointer-events-none transform translate-y-4" />
                  <div className="absolute -inset-0.5 -bottom-1.5 bg-black/35 rounded-full blur-sm -z-10 pointer-events-none transform translate-y-1.5" />
                  <div className="relative w-full py-6 px-4 bg-gradient-to-b from-[#223627] via-[#1a2b1e] to-[#132217] rounded-full shadow-[0_20px_45px_rgba(15,30,20,0.4)] border border-[#3e5a43] text-center space-y-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff]/10 to-transparent pointer-events-none animate-gold-sweep" />
                    <div className="absolute inset-1 rounded-full border border-[#c5a059]/30 pointer-events-none" />

                    <div
                      className="text-lg font-bold tracking-[0.25em] text-[#ffffff] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {finaleText}
                    </div>
                    <div className="text-[9px] font-cinzel text-[#c5a059] tracking-widest uppercase">
                      BARAKALLAHU LAKUMA
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Subtle bottom timestamp / playback progress indicator bar */}
      <div className="relative z-30 w-full px-6 pb-2 flex items-center justify-between text-[10px] text-[#556b57] opacity-75">
        <span>{Math.floor(t)}s</span>
        <span className="font-cinzel tracking-widest uppercase">Olive Rustic Tablescape</span>
        <span>38s</span>
      </div>
    </div>
  );
};
