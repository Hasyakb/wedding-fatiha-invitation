import React from "react";
import { InvitationData } from "../types";
import { getSceneTransition } from "../utils/transitionHelper";

interface EmeraldLanternPlayerProps {
  data: InvitationData;
  currentTime: number;
}

export const EmeraldLanternPlayer: React.FC<EmeraldLanternPlayerProps> = ({
  data,
  currentTime,
}) => {
  // Scene transitions
  const s0 = getSceneTransition(currentTime, 0.0, 3.8, { fadeInDuration: 0.6, fadeOutDuration: 0.5, entryTranslateY: 15 });
  const s1 = getSceneTransition(currentTime, 3.5, 8.5, { fadeInDuration: 0.6, fadeOutDuration: 0.5, entryTranslateY: 15 });
  const s2 = getSceneTransition(currentTime, 8.2, 14.1, { fadeInDuration: 0.6, fadeOutDuration: 0.5, entryTranslateY: 15 });
  const s3 = getSceneTransition(currentTime, 13.8, 19.1, { fadeInDuration: 0.6, fadeOutDuration: 0.5, entryTranslateY: 15 });
  const s4 = getSceneTransition(currentTime, 18.8, 24.0, { fadeInDuration: 0.6, fadeOutDuration: 0.2, exitScale: 1.0, entryTranslateY: 15 });

  // Gentle lantern sway calculation
  const sway1 = Math.sin(currentTime * 1.5) * 2.5;
  const sway2 = Math.cos(currentTime * 1.3) * 3.0;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#062418] via-[#03170f] to-[#020d09] text-[#f7f2ea] flex flex-col justify-between overflow-hidden select-none">
      {/* Background Islamic Geometric Pattern & Warm Emerald Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 35%, rgba(20, 184, 166, 0.15) 0%, rgba(6, 36, 24, 0.65) 60%, rgba(2, 13, 9, 0.98) 100%)",
          }}
        />

        {/* Decorative Golden Arch Frame */}
        <div className="absolute inset-2 border border-[#d4af37]/35 rounded-[32px] pointer-events-none" />
        <div className="absolute inset-3 border border-[#d4af37]/20 rounded-[28px] pointer-events-none" />

        {/* Corner Arabesque accents */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/60 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/60 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/60 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/60 rounded-br-lg" />

        {/* Floating golden specks */}
        <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 rounded-full bg-[#fde047] opacity-40 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-[#eab308] opacity-35 animate-pulse" />
      </div>

      {/* TOP: HANGING GOLDEN FANOOS LANTERNS */}
      <div className="relative z-20 pt-1 px-4 flex justify-between items-start pointer-events-none">
        {/* Left Hanging Lantern */}
        <div
          className="origin-top transition-transform ease-in-out"
          style={{ transform: `rotate(${sway1}deg)` }}
        >
          <svg width="45" height="110" viewBox="0 0 45 110" fill="none">
            <line x1="22.5" y1="0" x2="22.5" y2="40" stroke="#d4af37" strokeWidth="1.2" />
            <circle cx="22.5" cy="40" r="3" fill="#d4af37" />
            <path
              d="M 12 45 L 33 45 L 38 65 L 30 85 L 15 85 L 7 65 Z"
              fill="#062418"
              stroke="#d4af37"
              strokeWidth="1.2"
            />
            {/* Glowing lantern bulb */}
            <circle cx="22.5" cy="65" r="7" fill="#fef08a" opacity="0.85" filter="drop-shadow(0 0 8px #eab308)" />
            <polygon points="22.5,85 18,92 27,92" fill="#d4af37" />
            <circle cx="22.5" cy="94" r="1.5" fill="#d4af37" />
          </svg>
        </div>

        {/* Center Crescent Moon & Bismillah */}
        <div className="flex flex-col items-center pt-3">
          <div className="w-9 h-9 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mb-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M 21 12.79 A 9 9 0 1 1 11.21 3 A 7 7 0 0 0 21 12.79 Z"
                fill="#fde047"
                stroke="#d4af37"
                strokeWidth="1"
              />
            </svg>
          </div>
          {data.bismillah && (
            <div className="px-4 py-1 rounded-full bg-[#031d13]/85 border border-[#d4af37]/50 text-[#fde68a] font-luxury text-base font-bold tracking-wide shadow-sm">
              {data.bismillahText}
            </div>
          )}
        </div>

        {/* Right Hanging Lantern */}
        <div
          className="origin-top transition-transform ease-in-out"
          style={{ transform: `rotate(${sway2}deg)` }}
        >
          <svg width="45" height="110" viewBox="0 0 45 110" fill="none">
            <line x1="22.5" y1="0" x2="22.5" y2="40" stroke="#d4af37" strokeWidth="1.2" />
            <circle cx="22.5" cy="40" r="3" fill="#d4af37" />
            <path
              d="M 12 45 L 33 45 L 38 65 L 30 85 L 15 85 L 7 65 Z"
              fill="#062418"
              stroke="#d4af37"
              strokeWidth="1.2"
            />
            <circle cx="22.5" cy="65" r="7" fill="#fef08a" opacity="0.85" filter="drop-shadow(0 0 8px #eab308)" />
            <polygon points="22.5,85 18,92 27,92" fill="#d4af37" />
            <circle cx="22.5" cy="94" r="1.5" fill="#d4af37" />
          </svg>
        </div>
      </div>

      {/* DYNAMIC SCENE DISPLAY WITH SMOOTH TRANSITIONS */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center p-4 text-center">
        {/* SCENE 0: INTRO */}
        {s0.isVisible && (
          <div
            className="w-full max-w-[320px] px-6 py-7 rounded-2xl bg-[#062619]/90 border border-[#d4af37]/60 shadow-[0_12px_36px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center"
            style={s0.style}
          >
            <div className="text-[#fde047] font-cinzel text-xs tracking-[0.35em] uppercase font-bold mb-2">
              ✦ Blessed Celebration ✦
            </div>
            <div className="text-[#fef3c7] font-script text-5xl font-bold drop-shadow-sm">
              You are Invited
            </div>
            <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-3" />
          </div>
        )}

        {/* SCENE 1: FAMILIES */}
        {s1.isVisible && (
          <div
            className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#062619]/90 border border-[#d4af37]/60 shadow-[0_12px_36px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center space-y-2.5"
            style={s1.style}
          >
            <div className="text-[#fde047] font-cinzel text-xs tracking-[0.3em] uppercase font-bold">
              {data.familyIntro}
            </div>
            <div className="w-16 h-[1px] bg-[#d4af37]/50" />
            <div className="text-[#ffffff] font-luxury text-xl font-bold">
              {data.familyLateFather}
            </div>
            <div className="text-[#fde68a] font-cinzel text-[11px] tracking-widest font-semibold">
              AND
            </div>
            <div className="text-[#ffffff] font-luxury text-xl font-bold">
              {data.familySecondFather}
            </div>
            <div className="text-[#e2d5be] font-luxury italic text-sm pt-1">
              {data.invitationPhrase}
            </div>
            <div className="text-[#fde047] font-script text-4xl pt-0.5">
              {data.eventHeading}
            </div>
          </div>
        )}

        {/* SCENE 2: COUPLE */}
        {s2.isVisible && (
          <div
            className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#062619]/90 border border-[#d4af37]/60 shadow-[0_12px_36px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center space-y-2"
            style={s2.style}
          >
            <div className="text-[#fde047] font-cinzel text-xs tracking-[0.3em] uppercase font-bold">
              ✦ {data.eventHeading} ✦
            </div>
            <div className="text-[#ffffff] font-luxury text-2xl font-bold pt-1">
              {data.groomName}
            </div>
            {data.groomNick && (
              <div className="text-[#fde68a] font-luxury italic text-sm">
                ({data.groomNick})
              </div>
            )}
            <div className="text-[#fde047] font-script text-4xl leading-none">&</div>
            <div className="text-[#ffffff] font-luxury text-2xl font-bold">
              {data.brideName}
            </div>
            {data.brideNick && (
              <div className="text-[#fde68a] font-luxury italic text-sm">
                ({data.brideNick})
              </div>
            )}
          </div>
        )}

        {/* SCENE 3: DETAILS */}
        {s3.isVisible && (
          <div
            className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#062619]/90 border border-[#d4af37]/60 shadow-[0_12px_36px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center space-y-3"
            style={s3.style}
          >
            <div className="text-[#fde047] font-cinzel text-xs tracking-[0.3em] uppercase font-bold">
              ✦ Date & Venue ✦
            </div>
            <div className="text-[#ffffff] font-clean font-semibold text-sm">
              {data.eventDate} • {data.eventTime}
            </div>
            <div className="text-[#e2d5be] font-clean text-xs px-2">
              {data.venueAddress}
            </div>
            <div className="text-[#fde047] font-script text-2xl pt-1">
              ✨ {data.receptionNote} ✨
            </div>
          </div>
        )}

        {/* SCENE 4: RSVP */}
        {s4.isVisible && (
          <div
            className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#062619]/90 border border-[#d4af37]/60 shadow-[0_12px_36px_rgba(4,120,87,0.3)] flex flex-col items-center justify-center space-y-3"
            style={s4.style}
          >
            <div className="text-[#fef3c7] font-script text-4xl font-bold">
              Kindly RSVP
            </div>
            <div className="space-y-1.5 w-full max-w-[240px]">
              {data.rsvpNumbers.map((num, idx) => (
                <div
                  key={idx}
                  className="text-[#ffffff] font-clean font-semibold text-xs tracking-wider bg-[#031d13] px-3 py-1.5 rounded-lg border border-[#d4af37]/40 shadow-sm"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER */}
      <div className="relative z-20 pb-3 text-center flex flex-col items-center">
        <div className="text-[#d4af37] text-[9.5px] font-cinzel tracking-[0.25em] uppercase opacity-80">
          ✦ {data.groomNick || data.groomName} & {data.brideNick || data.brideName} • {data.eventHeading} ✦
        </div>
      </div>
    </div>
  );
};
