import React, { useRef, useEffect } from "react";
import { MosqueId } from "../utils/mosqueSilhouettes";
import { drawRealMosqueSceneBackground } from "../utils/realMosqueRenderer";
import { preloadMosquePhotoSet, DEFAULT_MOSQUE_PHOTOS } from "../utils/mosqueImageLoader";
import { MosquePhotoSet } from "../types";

interface RoyalCinematicBackgroundProps {
  currentTime: number;
  themeColor?: "gold" | "roseGold" | "emeraldGold";
  mosqueTheme?: "auto" | MosqueId | string;
  mosquePhotos?: MosquePhotoSet;
  mosqueDisplayMode?: "photo" | "silhouette" | "both";
  mosquePhotoOpacity?: number;
  mosquePhotoBlur?: number;
  className?: string;
}

/**
 * Royal Cinematic Background for the Invitation Video Player
 * Features:
 * - Sweeping anamorphic golden light flare / lens rays
 * - Undulating royal silk light waves & specular highlights
 * - Real Photographic Backdrops of Islamic Mosques (Masjid an-Nabawi, Masjid al-Haram, Masjid al-Aqsa, Grand Mosque)
 * - Layered with Islamic Arabesque mandala rosettes and delicate architectural contours
 * - Drifting soft-focus bokeh orbs with glowing radial gradients
 * - Shimmering floating gold dust stars (✦) and crystalline particles
 * - Floating soft champagne flower petals with 3D tumble physics
 * - Deterministic rendering driven directly by currentTime for pause/seek sync
 */
export const RoyalCinematicBackground: React.FC<RoyalCinematicBackgroundProps> = ({
  currentTime: t,
  themeColor = "gold",
  mosqueTheme = "auto",
  mosquePhotos = DEFAULT_MOSQUE_PHOTOS,
  mosqueDisplayMode = "both",
  mosquePhotoOpacity = 0.38,
  mosquePhotoBlur = 0.8,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preload mosque photo set on mount or photo change
  useEffect(() => {
    preloadMosquePhotoSet(mosquePhotos);
  }, [mosquePhotos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const scale = W / 400;

    // Palette setup based on theme
    let baseTop = "#fdfaf4";
    let baseMid = "#f7efe0";
    let baseBot = "#ebdcc2";
    let goldPrimary = "rgba(197, 160, 89, ";
    let goldBright = "rgba(235, 196, 120, ";
    let lightLeak = "rgba(245, 218, 165, ";

    if (themeColor === "roseGold") {
      baseTop = "#fdf9f7";
      baseMid = "#f9eee9";
      baseBot = "#ecd5cb";
      goldPrimary = "rgba(199, 137, 137, ";
      goldBright = "rgba(238, 178, 178, ";
      lightLeak = "rgba(247, 205, 200, ";
    } else if (themeColor === "emeraldGold") {
      baseTop = "#fafcf8";
      baseMid = "#eff6ed";
      baseBot = "#dbebd8";
      goldPrimary = "rgba(163, 148, 85, ";
      goldBright = "rgba(205, 185, 110, ";
      lightLeak = "rgba(215, 235, 210, ";
    }

    ctx.clearRect(0, 0, W, H);

    // 1. Base Gradient with Subtle Cinematic Zoom / Pan
    const cameraZoom = 1 + Math.sin(t * 0.15) * 0.02;
    const cameraPanY = Math.cos(t * 0.2) * 8 * scale;

    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-W * 0.5, -H * 0.5 + cameraPanY);

    const baseGrad = ctx.createLinearGradient(0, 0, 0, H);
    baseGrad.addColorStop(0, baseTop);
    baseGrad.addColorStop(0.4, baseMid);
    baseGrad.addColorStop(0.85, baseBot);
    baseGrad.addColorStop(1, "#dfcca8");
    ctx.fillStyle = baseGrad;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // 2. Cinematic Moving Anamorphic Light Leaks & Sun Flare
    // Flare 1: Moves smoothly across the top
    const flare1X = W * 0.3 + Math.sin(t * 0.4) * (W * 0.35);
    const flare1Y = H * 0.12 + Math.cos(t * 0.3) * (H * 0.06);
    const rad1 = W * 0.65;
    const flare1 = ctx.createRadialGradient(flare1X, flare1Y, 10, flare1X, flare1Y, rad1);
    flare1.addColorStop(0, `${lightLeak}0.38)`);
    flare1.addColorStop(0.45, `${lightLeak}0.15)`);
    flare1.addColorStop(1, `${lightLeak}0)`);
    ctx.fillStyle = flare1;
    ctx.fillRect(0, 0, W, H);

    // Flare 2: Moving diagonal bottom accent
    const flare2X = W * 0.7 + Math.cos(t * 0.35) * (W * 0.25);
    const flare2Y = H * 0.82 + Math.sin(t * 0.28) * (H * 0.08);
    const rad2 = W * 0.55;
    const flare2 = ctx.createRadialGradient(flare2X, flare2Y, 15, flare2X, flare2Y, rad2);
    flare2.addColorStop(0, `${goldBright}0.25)`);
    flare2.addColorStop(0.5, `${goldBright}0.08)`);
    flare2.addColorStop(1, `${goldBright}0)`);
    ctx.fillStyle = flare2;
    ctx.fillRect(0, 0, W, H);

    // 3. Moving Royal Silk Fabric Waves / Shimmer Ribbons
    for (let wave = 0; wave < 3; wave++) {
      ctx.save();
      const waveOffset = wave * 1.8;
      const waveAlpha = 0.08 + Math.sin(t * 0.8 + wave) * 0.03;
      ctx.strokeStyle = `${goldPrimary}${waveAlpha})`;
      ctx.lineWidth = (22 + wave * 14) * scale;
      ctx.beginPath();

      const startY = H * (0.2 + wave * 0.28);
      ctx.moveTo(-20, startY + Math.sin(t * 0.7 + waveOffset) * 25 * scale);

      for (let x = 0; x <= W + 40; x += 30 * scale) {
        const y =
          startY +
          Math.sin(x * 0.008 + t * 0.9 + waveOffset) * 35 * scale +
          Math.cos(x * 0.015 - t * 0.6) * 15 * scale;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Rotating Sacred Islamic Geometric Mandalas (Arabesque Rosettes)
    const drawMandala = (
      cx: number,
      cy: number,
      radius: number,
      rotSpeed: number,
      alpha: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * rotSpeed);
      ctx.strokeStyle = `${goldPrimary}${alpha})`;
      ctx.lineWidth = 1.2 * scale;

      const points = 8; // 8-pointed star rosette
      // Outer ring
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dashed ring
      ctx.beginPath();
      ctx.setLineDash([4 * scale, 4 * scale]);
      ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Star interlacing
      for (let i = 0; i < points; i++) {
        const angle = (i * Math.PI * 2) / points;
        const x1 = Math.cos(angle) * radius;
        const y1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + (Math.PI * 2) / 3) * (radius * 0.5);
        const y2 = Math.sin(angle + (Math.PI * 2) / 3) * (radius * 0.5);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x1, y1, 2.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `${goldBright}${alpha * 1.5})`;
        ctx.fill();

        // Arabesque petal curves
        ctx.beginPath();
        ctx.quadraticCurveTo(x2, y2, x1, y1);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Upper Islamic Rosette (drifting slowly behind top bismillah/family text)
    drawMandala(W * 0.5, H * 0.18, 95 * scale, 0.04, 0.12);

    // Center Grand Royal Mandala (slow reverse counter-rotation)
    drawMandala(W * 0.5, H * 0.52, 140 * scale, -0.025, 0.09);

    // Lower Ornate Rosette (slow forward rotation)
    drawMandala(W * 0.5, H * 0.86, 110 * scale, 0.035, 0.1);

    // 5. Sacred Mosque Photographic Backdrop & Architectural Contours
    drawRealMosqueSceneBackground(ctx, W, H, scale, t, mosquePhotos, {
      themeColor,
      forcedMosque: mosqueTheme,
      displayMode: mosqueDisplayMode,
      opacity: mosquePhotoOpacity,
      blur: mosquePhotoBlur,
    });

    // 6. Drifting Cinematic Bokeh Orbs (Soft focus light spheres)
    const orbCount = 12;
    for (let i = 0; i < orbCount; i++) {
      const orbSeed = i * 137.5;
      const speedY = 22 + (i % 4) * 8;
      const rawY = (orbSeed + t * speedY) % (H + 120);
      const orbY = H + 60 - rawY; // Float upward
      const orbX = (W * 0.5) + Math.sin(t * 0.5 + i * 1.4) * (W * 0.42);
      const orbRadius = (16 + (i % 5) * 12) * scale;
      const orbPulse = 0.5 + Math.sin(t * 2.2 + i * 3) * 0.35;
      const orbAlpha = (0.06 + (i % 3) * 0.04) * orbPulse;

      const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
      orbGrad.addColorStop(0, `${goldBright}${orbAlpha * 2})`);
      orbGrad.addColorStop(0.6, `${goldPrimary}${orbAlpha})`);
      orbGrad.addColorStop(1, `${goldPrimary}0)`);

      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 6. Shimmering Diamond Star Crosses (✦) & Golden Micro-Embers
    const sparkleCount = 20;
    for (let i = 0; i < sparkleCount; i++) {
      const speed = 30 + (i % 5) * 12;
      const py = (H + 50) - ((i * 89 + t * speed) % (H + 100));
      const px = (W * 0.08) + ((i * 157.3) % (W * 0.84)) + Math.sin(t * 1.2 + i) * 15 * scale;
      const twinkle = Math.max(0, Math.sin(t * 3.5 + i * 2.1));
      const starSize = (2.2 + (i % 3) * 1.8) * twinkle * scale;
      const alpha = twinkle * 0.75;

      if (alpha > 0.05) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(t * 0.5 + i);
        ctx.fillStyle = `${goldBright}${alpha})`;

        // 4-point sparkle cross
        ctx.beginPath();
        ctx.moveTo(0, -starSize * 2.5);
        ctx.quadraticCurveTo(0, 0, starSize * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, starSize * 2.5);
        ctx.quadraticCurveTo(0, 0, -starSize * 2.5, 0);
        ctx.quadraticCurveTo(0, 0, 0, -starSize * 2.5);
        ctx.fill();

        // Center glow dot
        ctx.beginPath();
        ctx.arc(0, 0, starSize * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
        ctx.restore();
      }
    }

    // 7. Floating Royal Champagne Rose Petals (3D Tumble)
    const petalCount = 7;
    for (let i = 0; i < petalCount; i++) {
      const pSpeedY = 25 + (i % 3) * 10;
      const rawY = (i * 120 + t * pSpeedY) % (H + 80);
      const py = rawY - 40; // float downward like a gentle breeze
      const px = (W * 0.15) + ((i * 143) % (W * 0.7)) + Math.sin(t * 0.8 + i) * 35 * scale;
      const rot = t * (0.8 + i * 0.2) + i;
      const tumbleScaleX = Math.cos(t * 1.5 + i * 2); // 3D flip effect
      const tumbleScaleY = Math.sin(t * 1.2 + i);
      const pSize = (8 + (i % 3) * 4) * scale;
      const pAlpha = 0.18 + Math.sin(t + i) * 0.08;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.scale(tumbleScaleX, 1);

      // Petal shape
      ctx.fillStyle = `${goldBright}${pAlpha})`;
      ctx.strokeStyle = `${goldPrimary}${pAlpha * 1.4})`;
      ctx.lineWidth = 0.8 * scale;
      ctx.beginPath();
      ctx.moveTo(0, -pSize);
      ctx.bezierCurveTo(pSize * 0.9, -pSize * 0.5, pSize * 0.9, pSize * 0.6, 0, pSize);
      ctx.bezierCurveTo(-pSize * 0.9, pSize * 0.6, -pSize * 0.9, -pSize * 0.5, 0, -pSize);
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    }

    // 8. Subtle Ornate Royal Border Pulse
    ctx.restore(); // restore camera transform

    // Subtle edge golden vignette
    const edgeVignette = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.4, W * 0.5, H * 0.5, W * 0.75);
    edgeVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
    edgeVignette.addColorStop(0.7, `${goldPrimary}0.04)`);
    edgeVignette.addColorStop(1, `${goldPrimary}0.18)`);
    ctx.fillStyle = edgeVignette;
    ctx.fillRect(0, 0, W, H);

  }, [t, themeColor]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={710}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};
