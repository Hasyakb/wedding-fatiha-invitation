import React, { useMemo, useRef, useEffect, useState } from "react";
import { InvitationData } from "../types";
import { RoyalInvitationCrest } from "./RoyalInvitationCrest";
import { FountainPenHand } from "./FountainPenHand";
import {
  DEFAULT_MOSQUE_PHOTOS,
  preloadMosquePhotoSet,
  loadMosqueImage,
} from "../utils/mosqueImageLoader";
import { getSceneTransition } from "../utils/transitionHelper";

interface CalligraphyPenPlayerProps {
  data: InvitationData;
  currentTime: number;
}

interface ScriptLine {
  id: string;
  text: string;
  start: number;
  end: number;
  y: number; // Y position in pixels from top
  fontClass: string;
  fontSize: string;
  color: string;
  letterSpacing?: string;
  isCursive?: boolean;
}

interface ScriptScene {
  sceneId: number;
  start: number;
  end: number;
  lines: ScriptLine[];
}

export const CalligraphyPenPlayer: React.FC<CalligraphyPenPlayerProps> = ({
  data,
  currentTime,
}) => {
  // Define the scenes and lines with timings corresponding to the video
  const scenes: ScriptScene[] = useMemo(() => {
    const groomNick = data.groomNick ? `(${data.groomNick})` : "";
    const brideNick = data.brideNick ? `(${data.brideNick})` : "";

    return [
      // SCENE 1: Families & Invitation (0.0s - 10.8s)
      {
        sceneId: 1,
        start: 0.0,
        end: 10.8,
        lines: [
          {
            id: "s1-l1",
            text: data.familyIntro || "The families of",
            start: 0.8,
            end: 2.2,
            y: 145,
            fontClass: "font-cinzel font-medium",
            fontSize: "text-[15px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.18em]",
          },
          {
            id: "s1-l2",
            text: data.familyLateFather || "Alh. Ibrahim Rukadawa.",
            start: 2.2,
            end: 4.4,
            y: 185,
            fontClass: "font-luxury font-bold",
            fontSize: "text-[21px]",
            color: "#fbe4b2",
            letterSpacing: "tracking-[0.05em]",
          },
          {
            id: "s1-l3",
            text: "And that of",
            start: 4.4,
            end: 5.6,
            y: 220,
            fontClass: "font-cinzel font-medium",
            fontSize: "text-[14px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.16em]",
          },
          {
            id: "s1-l4",
            text: data.familySecondFather || "Alh. Baba Maidansa Zango.",
            start: 5.6,
            end: 7.8,
            y: 260,
            fontClass: "font-luxury font-bold",
            fontSize: "text-[21px]",
            color: "#fbe4b2",
            letterSpacing: "tracking-[0.05em]",
          },
          {
            id: "s1-l5",
            text: "Cordially",
            start: 7.8,
            end: 9.4,
            y: 335,
            fontClass: "font-script font-bold",
            fontSize: "text-[52px]",
            color: "#ffd982",
            isCursive: true,
          },
          {
            id: "s1-l6",
            text: data.invitationPhrase || "Invite you",
            start: 9.4,
            end: 10.6,
            y: 395,
            fontClass: "font-cinzel font-medium",
            fontSize: "text-[16px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.2em]",
          },
        ],
      },

      // SCENE 2: The Wedding Fatiha (10.8s - 17.5s)
      {
        sceneId: 2,
        start: 10.8,
        end: 17.5,
        lines: [
          {
            id: "s2-l1",
            text: "To the",
            start: 11.4,
            end: 12.8,
            y: 200,
            fontClass: "font-cinzel font-semibold",
            fontSize: "text-[19px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.22em]",
          },
          {
            id: "s2-l2",
            text: data.eventHeading || "Wedding",
            start: 12.8,
            end: 15.2,
            y: 280,
            fontClass: "font-script font-bold",
            fontSize: "text-[62px]",
            color: "#ffe08d",
            isCursive: true,
          },
          {
            id: "s2-l3",
            text: data.childrenPhrase || "Fatiha of their Children",
            start: 15.2,
            end: 17.2,
            y: 360,
            fontClass: "font-luxury font-semibold",
            fontSize: "text-[23px]",
            color: "#f7e3b8",
            letterSpacing: "tracking-[0.08em]",
          },
        ],
      },

      // SCENE 3: The Couple (17.5s - 26.5s)
      {
        sceneId: 3,
        start: 17.5,
        end: 26.5,
        lines: [
          {
            id: "s3-l1",
            text: data.groomName || "Alh. Umar Ibrahim.",
            start: 18.0,
            end: 20.2,
            y: 170,
            fontClass: "font-luxury font-bold",
            fontSize: "text-[24px]",
            color: "#fbe4b2",
            letterSpacing: "tracking-[0.06em]",
          },
          {
            id: "s3-l2",
            text: groomNick || "(Baban Hajiya)",
            start: 20.2,
            end: 21.4,
            y: 205,
            fontClass: "font-luxury italic",
            fontSize: "text-[17px]",
            color: "#d9bc84",
          },
          {
            id: "s3-l3",
            text: "Weds.",
            start: 21.4,
            end: 22.8,
            y: 275,
            fontClass: "font-script font-bold",
            fontSize: "text-[48px]",
            color: "#ffd982",
            isCursive: true,
          },
          {
            id: "s3-l4",
            text: data.brideName || "Maimunatu Sani Muhammad.",
            start: 22.8,
            end: 25.0,
            y: 345,
            fontClass: "font-luxury font-bold",
            fontSize: "text-[24px]",
            color: "#fbe4b2",
            letterSpacing: "tracking-[0.06em]",
          },
          {
            id: "s3-l5",
            text: brideNick || "(Ummi)",
            start: 25.0,
            end: 26.2,
            y: 380,
            fontClass: "font-luxury italic",
            fontSize: "text-[17px]",
            color: "#d9bc84",
          },
        ],
      },

      // SCENE 4: Date, Time & Venue (26.5s - 35.8s)
      {
        sceneId: 4,
        start: 26.5,
        end: 35.8,
        lines: [
          {
            id: "s4-l1",
            text: "WHICH WILL TAKE PLACE AS FOLLOWS.",
            start: 27.0,
            end: 28.5,
            y: 165,
            fontClass: "font-cinzel font-bold",
            fontSize: "text-[13px]",
            color: "#dfba74",
            letterSpacing: "tracking-[0.22em]",
          },
          {
            id: "s4-l2",
            text: `DATE: ${data.eventDate}`,
            start: 28.5,
            end: 30.5,
            y: 220,
            fontClass: "font-clean font-medium",
            fontSize: "text-[12px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.05em]",
          },
          {
            id: "s4-l3",
            text: `TIME: ${data.eventTime} Prompt`,
            start: 30.5,
            end: 32.0,
            y: 255,
            fontClass: "font-clean font-medium",
            fontSize: "text-[12px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.05em]",
          },
          {
            id: "s4-l4",
            text: `VENUE: ${data.venueAddress}`,
            start: 32.0,
            end: 34.0,
            y: 295,
            fontClass: "font-clean font-medium",
            fontSize: "text-[12px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.03em]",
          },
          {
            id: "s4-l5",
            text: data.receptionNote || "Reception follows immediately after the wedding.",
            start: 34.0,
            end: 35.6,
            y: 375,
            fontClass: "font-luxury italic font-medium",
            fontSize: "text-[15px]",
            color: "#dec28d",
          },
        ],
      },

      // SCENE 5: Courtesy & RSVP (35.8s - 42.0s)
      {
        sceneId: 5,
        start: 35.8,
        end: 42.0,
        lines: [
          {
            id: "s5-l1",
            text: "Courtesy",
            start: 36.2,
            end: 38.0,
            y: 200,
            fontClass: "font-script font-bold",
            fontSize: "text-[58px]",
            color: "#ffd982",
            isCursive: true,
          },
          {
            id: "s5-l2",
            text: data.courtesyName || "Alh. Isma'il.",
            start: 38.0,
            end: 39.8,
            y: 280,
            fontClass: "font-luxury font-bold",
            fontSize: "text-[26px]",
            color: "#fbe4b2",
            letterSpacing: "tracking-[0.08em]",
          },
          {
            id: "s5-l3",
            text: `RSVP: ${data.rsvpNumbers.join(" • ")}`,
            start: 39.8,
            end: 41.8,
            y: 350,
            fontClass: "font-clean font-medium",
            fontSize: "text-[12px]",
            color: "#eedab2",
            letterSpacing: "tracking-[0.1em]",
          },
        ],
      },
    ];
  }, [data]);

  // Reference to stage and lines for sub-pixel text tracking
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<{ [id: string]: HTMLElement }>({});

  // Determine which scene is active
  const activeScene =
    scenes.find((s) => currentTime >= s.start && currentTime < s.end) ||
    scenes[scenes.length - 1];

  // Calculate handwriting state for lines in active scene
  // Also determine current pen nib position (X, Y)
  const penState = useMemo(() => {
    let activeLine: ScriptLine | null = null;
    let lineProgress = 0;
    let isWriting = false;
    let prevLine: ScriptLine | null = null;
    let nextLine: ScriptLine | null = null;

    if (activeScene) {
      for (let i = 0; i < activeScene.lines.length; i++) {
        const line = activeScene.lines[i];
        if (currentTime >= line.start && currentTime < line.end) {
          activeLine = line;
          lineProgress = (currentTime - line.start) / (line.end - line.start);
          isWriting = true;
          break;
        } else if (currentTime < line.start) {
          nextLine = line;
          prevLine = i > 0 ? activeScene.lines[i - 1] : null;
          break;
        }
      }
    }

    const stageEl = stageRef.current;
    const stageWidth = stageEl ? stageEl.clientWidth : 350;

    if (activeLine) {
      const lineEl = lineRefs.current[activeLine.id];
      if (lineEl && stageEl) {
        const lineRect = lineEl.getBoundingClientRect();
        const stageRect = stageEl.getBoundingClientRect();
        const startX = lineRect.left - stageRect.left;
        const width = lineRect.width;
        // Text vertical baseline: cursive fonts sit slightly higher
        const baselineOffset = activeLine.isCursive
          ? lineRect.height * 0.70
          : lineRect.height * 0.74;
        const penX = startX + width * lineProgress;
        const penY = (lineRect.top - stageRect.top) + baselineOffset;

        return { penX, penY, isWriting: true, opacity: 1 };
      }

      // Mathematical fallback before DOM mount
      const charWidth = activeLine.isCursive ? 14 : 8.5;
      const estimatedWidth = Math.min(stageWidth - 32, activeLine.text.length * charWidth);
      const startX = (stageWidth - estimatedWidth) / 2;
      const penX = startX + estimatedWidth * lineProgress;
      const penY = activeLine.y + (activeLine.isCursive ? 30 : 16);

      return { penX, penY, isWriting: true, opacity: 1 };
    }

    // Between lines transition: smooth ease glide from previous line end to next line start
    if (nextLine) {
      const nextEl = lineRefs.current[nextLine.id];
      const prevEl = prevLine ? lineRefs.current[prevLine.id] : null;

      let nextStartX = stageWidth * 0.5 - 60;
      let nextY = nextLine.y + (nextLine.isCursive ? 30 : 16);

      if (nextEl && stageEl) {
        const nr = nextEl.getBoundingClientRect();
        const sr = stageEl.getBoundingClientRect();
        nextStartX = nr.left - sr.left;
        nextY = (nr.top - sr.top) + (nextLine.isCursive ? nr.height * 0.70 : nr.height * 0.74);
      }

      if (prevLine && prevEl && stageEl) {
        const pr = prevEl.getBoundingClientRect();
        const sr = stageEl.getBoundingClientRect();
        const prevEndX = (pr.left - sr.left) + pr.width;
        const prevY = (pr.top - sr.top) + (prevLine.isCursive ? pr.height * 0.70 : pr.height * 0.74);

        const transDuration = Math.max(0.01, nextLine.start - prevLine.end);
        const transProg = Math.min(1, Math.max(0, (currentTime - prevLine.end) / transDuration));
        const ease = 0.5 - 0.5 * Math.cos(transProg * Math.PI);

        const penX = prevEndX + (nextStartX - prevEndX) * ease;
        const penY = prevY + (nextY - prevY) * ease;

        return { penX, penY, isWriting: false, opacity: 1 };
      }

      return { penX: nextStartX, penY: nextY, isWriting: false, opacity: 1 };
    }

    // Default resting position
    return {
      penX: stageWidth / 2 + 50,
      penY: 480,
      isWriting: false,
      opacity: currentTime > 0.4 ? 0.6 : 0,
    };
  }, [activeScene, currentTime]);

  // Resolve background photo / texture based on user preference
  const bgPreset = data.calligraphyBgPreset || "nabawi";
  const bgOpacity = data.calligraphyBgOpacity !== undefined ? data.calligraphyBgOpacity : 0.7;
  const bgBlur = data.calligraphyBgBlur !== undefined ? data.calligraphyBgBlur : 0.3;

  let bgImageUrl: string | null = null;
  let bgLabel = "Sacred Backdrop";
  const photos = data.mosquePhotos || DEFAULT_MOSQUE_PHOTOS;

  useEffect(() => {
    preloadMosquePhotoSet(photos);
    if (data.calligraphyCustomBgUrl) {
      loadMosqueImage(data.calligraphyCustomBgUrl);
    }
  }, [photos, data.calligraphyCustomBgUrl]);

  if (bgPreset === "custom" && data.calligraphyCustomBgUrl) {
    bgImageUrl = data.calligraphyCustomBgUrl;
    bgLabel = "Custom Photo";
  } else if (bgPreset === "nabawi") {
    bgImageUrl = photos.nabawi || "/images/mosques/nabawi.jpg";
    bgLabel = "Masjid an-Nabawi, Medina";
  } else if (bgPreset === "zayed") {
    bgImageUrl = photos.zayed || "/images/mosques/zayed.jpg";
    bgLabel = "Sheikh Zayed Grand Mosque";
  } else if (bgPreset === "haram") {
    bgImageUrl = photos.haram || "/images/mosques/haram.jpg";
    bgLabel = "Masjid al-Haram, Makkah";
  } else if (bgPreset === "aqsa") {
    bgImageUrl = photos.aqsa || "/images/mosques/aqsa.jpg";
    bgLabel = "Masjid al-Aqsa, Al-Quds";
  } else if (bgPreset === "auto") {
    const sceneMosqueMap: Record<number, { url: string; label: string }> = {
      1: { url: photos.nabawi || "/images/mosques/nabawi.jpg", label: "Masjid an-Nabawi" },
      2: { url: photos.haram || "/images/mosques/haram.jpg", label: "Masjid al-Haram" },
      3: { url: photos.zayed || "/images/mosques/zayed.jpg", label: "Sheikh Zayed Mosque" },
      4: { url: photos.aqsa || "/images/mosques/aqsa.jpg", label: "Masjid al-Aqsa" },
      5: { url: photos.nabawi || "/images/mosques/nabawi.jpg", label: "Masjid an-Nabawi" },
    };
    const sceneInfo = sceneMosqueMap[activeScene?.sceneId || 1] || sceneMosqueMap[1];
    bgImageUrl = sceneInfo.url;
    bgLabel = sceneInfo.label;
  }

  return (
    <div
      ref={stageRef}
      className={`relative w-full h-full overflow-hidden select-none ${
        bgPreset === "parchment"
          ? "bg-[#25201a] text-[#f4eee6]"
          : bgPreset === "emerald"
          ? "bg-[#0b1610] text-[#f7f2ea]"
          : "bg-[#0d0b09] text-[#f7f2ea]"
      }`}
    >
      {/* 1. PHOTOGRAPHIC MOSQUE / CUSTOM BACKGROUND LAYER */}
      {bgImageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={bgImageUrl}
            alt={bgLabel}
            key={bgImageUrl}
            className="w-full h-full object-cover transform scale-105 transition-all duration-700 ease-out"
            style={{
              opacity: bgOpacity,
              filter: `blur(${bgBlur}px) saturate(1.2) brightness(1.02)`,
            }}
            referrerPolicy="no-referrer"
          />

          {/* Luxury soft edge vignette overlay - keeps the mosque center crisp & luminous */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 50%, rgba(10, 8, 6, 0.08) 0%, rgba(10, 8, 6, 0.32) 65%, rgba(6, 5, 4, 0.72) 100%)",
            }}
          />

          {/* Delicate warm Islamic golden hue sheen */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: "linear-gradient(180deg, rgba(212, 175, 55, 0.35) 0%, rgba(138, 100, 36, 0.2) 100%)",
            }}
          />
        </div>
      )}

      {/* 2. TEXTURE OVERLAYS (For Velvet / Parchment / Emerald) */}
      {bgPreset === "parchment" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(240, 225, 195, 0.15) 0%, rgba(40, 32, 22, 0.8) 100%)",
          }}
        />
      )}

      {bgPreset === "emerald" && (
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(16, 75, 50, 0.35) 0%, rgba(7, 24, 16, 0.85) 65%, rgba(3, 10, 7, 0.98) 100%)",
          }}
        />
      )}

      {/* 3. CENTRAL GOLDEN LIGHT GLOW & CORNER BRACKETS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft warm gold ambient glow in center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(197, 160, 89, 0.12) 0%, rgba(20, 16, 12, 0.18) 60%, rgba(6, 5, 4, 0.45) 100%)",
          }}
        />

        {/* Subtle decorative gold frame corners */}
        <div className="absolute top-2 left-2 w-7 h-7 border-t border-l border-[#c5a059]/40 rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-7 h-7 border-t border-r border-[#c5a059]/40 rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-7 h-7 border-b border-l border-[#c5a059]/40 rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-7 h-7 border-b border-r border-[#c5a059]/40 rounded-br-sm pointer-events-none" />

        {/* Subtle central watermark ring */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#d4af37]/10 pointer-events-none opacity-50"
          style={{
            boxShadow: "inset 0 0 50px rgba(212, 175, 55, 0.06)",
          }}
        />

        {/* Ambient floating gold specks */}
        <div className="absolute top-1/4 left-1/5 w-1 h-1 rounded-full bg-[#fce5b2] opacity-40 animate-pulse" />
        <div className="absolute top-3/5 right-1/4 w-1.5 h-1.5 rounded-full bg-[#dfb969] opacity-35 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 rounded-full bg-[#fce5b2] opacity-30 animate-pulse" />
      </div>

      {/* TOP HEADER: ORNATE GOLD CREST WITH "INVITATION" */}
      <div className="absolute top-2 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <RoyalInvitationCrest width={330} height={85} />
      </div>

      {/* SCRIPT LINES LAYER WITH ANIMATED APPEARANCE & SCENE TRANSITIONS */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {scenes.map((scene) => {
          const trans = getSceneTransition(currentTime, scene.start, scene.end, {
            fadeInDuration: 0.6,
            fadeOutDuration: 0.5,
            entryTranslateY: 12,
            exitScale: 0.98,
          });

          if (!trans.isVisible) return null;

          return (
            <div
              key={`calligraphy-scene-${scene.sceneId}`}
              className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
              style={trans.style}
            >
              {scene.lines.map((line) => {
                const lineProg =
                  currentTime <= line.start
                    ? 0
                    : currentTime >= line.end
                    ? 1
                    : (currentTime - line.start) / (line.end - line.start);

                if (lineProg <= 0) return null;

                return (
                  <div
                    key={line.id}
                    className="absolute left-0 right-0 flex justify-center pointer-events-none px-3"
                    style={{ top: `${line.y}px` }}
                  >
                    <div
                      ref={(el) => {
                        if (el) lineRefs.current[line.id] = el;
                      }}
                      className="relative inline-block max-w-full"
                    >
                      <span
                        className={`${line.fontClass} ${line.fontSize} ${line.letterSpacing || ""} whitespace-nowrap block text-center`}
                        style={{
                          color: line.color,
                          clipPath:
                            lineProg >= 1
                              ? "none"
                              : `inset(0 ${Math.max(0, (1 - lineProg) * 100)}% 0 0)`,
                          WebkitClipPath:
                            lineProg >= 1
                              ? "none"
                              : `inset(0 ${Math.max(0, (1 - lineProg) * 100)}% 0 0)`,
                          textShadow: line.isCursive
                            ? "0 0 14px rgba(255, 224, 141, 0.65), 0 1px 3px rgba(0,0,0,0.9)"
                            : "0 0 8px rgba(238, 218, 178, 0.45), 0 1px 2px rgba(0,0,0,0.9)",
                        }}
                      >
                        {line.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* THE LIVE WRITING FOUNTAIN PEN & HAND */}
      {penState.opacity > 0 && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-visible">
          <FountainPenHand
            x={penState.penX}
            y={penState.penY}
            isWriting={penState.isWriting}
            scale={0.88}
            opacity={penState.opacity}
          />
        </div>
      )}

      {/* BOTTOM FOOTER WATERMARK */}
      <div className="absolute bottom-2 left-0 right-0 z-10 text-center flex flex-col items-center pointer-events-none">
        <div className="text-[#a89067] text-[9px] font-cinzel tracking-[0.25em] uppercase opacity-75">
          ✦ {data.groomNick || data.groomName} & {data.brideNick || data.brideName} • {data.eventHeading} ✦
        </div>
      </div>
    </div>
  );
};
