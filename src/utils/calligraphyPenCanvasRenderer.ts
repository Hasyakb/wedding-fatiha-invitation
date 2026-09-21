import { InvitationData } from "../types";
import {
  getCachedMosqueImage,
  loadMosqueImage,
  DEFAULT_MOSQUE_PHOTOS,
} from "./mosqueImageLoader";

interface ScriptLineDef {
  id: string;
  text: string;
  start: number;
  end: number;
  y: number; // in 720x1280 virtual canvas coordinates
  font: (scale: number) => string;
  color: string;
  isCursive?: boolean;
  letterSpacing?: number;
}

interface ScriptSceneDef {
  sceneId: number;
  start: number;
  end: number;
  lines: ScriptLineDef[];
}

export function renderCalligraphyPenVideoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  // 1. Photographic Mosque or Luxury Texture Backdrop
  const bgPreset = data.calligraphyBgPreset || "nabawi";
  const bgOpacity = data.calligraphyBgOpacity !== undefined ? data.calligraphyBgOpacity : 0.7;

  let bgImgSrc: string | null = null;
  const photos = data.mosquePhotos || DEFAULT_MOSQUE_PHOTOS;

  if (bgPreset === "custom" && data.calligraphyCustomBgUrl) {
    bgImgSrc = data.calligraphyCustomBgUrl;
  } else if (bgPreset === "nabawi") {
    bgImgSrc = photos.nabawi || "/images/mosques/nabawi.jpg";
  } else if (bgPreset === "zayed") {
    bgImgSrc = photos.zayed || "/images/mosques/zayed.jpg";
  } else if (bgPreset === "haram") {
    bgImgSrc = photos.haram || "/images/mosques/haram.jpg";
  } else if (bgPreset === "aqsa") {
    bgImgSrc = photos.aqsa || "/images/mosques/aqsa.jpg";
  } else if (bgPreset === "auto") {
    if (t < 8.2) bgImgSrc = photos.nabawi || "/images/mosques/nabawi.jpg";
    else if (t < 17.5) bgImgSrc = photos.haram || "/images/mosques/haram.jpg";
    else if (t < 26.5) bgImgSrc = photos.zayed || "/images/mosques/zayed.jpg";
    else if (t < 35.8) bgImgSrc = photos.aqsa || "/images/mosques/aqsa.jpg";
    else bgImgSrc = photos.nabawi || "/images/mosques/nabawi.jpg";
  }

  // Draw base dark luxury tone
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  if (bgPreset === "emerald") {
    bgGrad.addColorStop(0, "#0e1a14");
    bgGrad.addColorStop(0.5, "#08120c");
    bgGrad.addColorStop(1, "#040805");
  } else if (bgPreset === "parchment") {
    bgGrad.addColorStop(0, "#2a221b");
    bgGrad.addColorStop(0.5, "#1c1611");
    bgGrad.addColorStop(1, "#0f0b08");
  } else {
    bgGrad.addColorStop(0, "#161311");
    bgGrad.addColorStop(0.5, "#0d0b09");
    bgGrad.addColorStop(1, "#070605");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // If photo is available, draw it with cinematic slow drift and cover sizing
  if (bgImgSrc) {
    let img = getCachedMosqueImage(bgImgSrc);
    if (!img) {
      loadMosqueImage(bgImgSrc);
    }
    if (img && img.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = bgOpacity;

      // Subtle Ken Burns slow drift
      const kenBurnsScale = 1.04 + 0.02 * Math.sin(t * 0.25);
      const imgW = W * kenBurnsScale;
      const imgH = (imgW / img.naturalWidth) * img.naturalHeight;
      const renderH = Math.max(H * kenBurnsScale, imgH);
      const renderW = (renderH / img.naturalHeight) * img.naturalWidth;
      const offsetX = (W - renderW) * 0.5 + Math.sin(t * 0.2) * (10 * scale);
      const offsetY = (H - renderH) * 0.5;

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    }
  }

  // Soft edge vignette overlay to keep text legible while displaying full mosque beauty
  const vignette = ctx.createRadialGradient(
    W * 0.5,
    H * 0.5,
    60 * scale,
    W * 0.5,
    H * 0.5,
    440 * scale
  );
  vignette.addColorStop(0, "rgba(10, 8, 6, 0.08)");
  vignette.addColorStop(0.65, "rgba(10, 8, 6, 0.32)");
  vignette.addColorStop(1, "rgba(4, 3, 2, 0.72)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);

  // Central warm radial gold glow
  const radialGlow = ctx.createRadialGradient(
    W * 0.5,
    H * 0.45,
    20 * scale,
    W * 0.5,
    H * 0.45,
    360 * scale
  );
  radialGlow.addColorStop(0, "rgba(197, 160, 89, 0.16)");
  radialGlow.addColorStop(0.65, "rgba(20, 16, 12, 0.45)");
  radialGlow.addColorStop(1, "rgba(0, 0, 0, 0.85)");
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, W, H);

  // Delicate Corner Gold Brackets
  ctx.save();
  ctx.strokeStyle = "rgba(197, 160, 89, 0.45)";
  ctx.lineWidth = 1.5 * scale;
  const m = 20 * scale;
  const s = 25 * scale;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(m, m + s);
  ctx.lineTo(m, m);
  ctx.lineTo(m + s, m);
  // Top-right
  ctx.moveTo(W - m - s, m);
  ctx.lineTo(W - m, m);
  ctx.lineTo(W - m, m + s);
  // Bottom-left
  ctx.moveTo(m, H - m - s);
  ctx.lineTo(m, H - m);
  ctx.lineTo(m + s, H - m);
  // Bottom-right
  ctx.moveTo(W - m - s, H - m);
  ctx.lineTo(W - m, H - m);
  ctx.lineTo(W - m, H - m - s);
  ctx.stroke();
  ctx.restore();

  // 2. Top Ornate Vintage Gold Header Crest
  drawTopOrnateGoldCrest(ctx, W, scale);

  // 3. Define the Scenes and Timing
  const groomNick = data.groomNick ? `(${data.groomNick})` : "";
  const brideNick = data.brideNick ? `(${data.brideNick})` : "";

  const scenes: ScriptSceneDef[] = [
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
          y: 280,
          font: (s) => `500 ${22 * s}px 'Cinzel', serif`,
          color: "#eedab2",
          letterSpacing: 3 * scale,
        },
        {
          id: "s1-l2",
          text: data.familyLateFather || "Alh. Ibrahim Rukadawa.",
          start: 2.2,
          end: 4.4,
          y: 355,
          font: (s) => `700 ${34 * s}px 'Cormorant Garamond', serif`,
          color: "#fbe4b2",
        },
        {
          id: "s1-l3",
          text: "And that of",
          start: 4.4,
          end: 5.6,
          y: 420,
          font: (s) => `500 ${20 * s}px 'Cinzel', serif`,
          color: "#eedab2",
          letterSpacing: 2.5 * scale,
        },
        {
          id: "s1-l4",
          text: data.familySecondFather || "Alh. Baba Maidansa Zango.",
          start: 5.6,
          end: 7.8,
          y: 495,
          font: (s) => `700 ${34 * s}px 'Cormorant Garamond', serif`,
          color: "#fbe4b2",
        },
        {
          id: "s1-l5",
          text: "Cordially",
          start: 7.8,
          end: 9.4,
          y: 630,
          font: (s) => `700 ${88 * s}px 'Alex Brush', cursive`,
          color: "#ffd982",
          isCursive: true,
        },
        {
          id: "s1-l6",
          text: data.invitationPhrase || "Invite you",
          start: 9.4,
          end: 10.6,
          y: 730,
          font: (s) => `600 ${24 * s}px 'Cinzel', serif`,
          color: "#eedab2",
          letterSpacing: 4 * scale,
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
          y: 360,
          font: (s) => `600 ${30 * s}px 'Cinzel', serif`,
          color: "#eedab2",
          letterSpacing: 4 * scale,
        },
        {
          id: "s2-l2",
          text: data.eventHeading || "Wedding",
          start: 12.8,
          end: 15.2,
          y: 520,
          font: (s) => `700 ${110 * s}px 'Alex Brush', cursive`,
          color: "#ffe08d",
          isCursive: true,
        },
        {
          id: "s2-l3",
          text: data.childrenPhrase || "Fatiha of their Children",
          start: 15.2,
          end: 17.2,
          y: 660,
          font: (s) => `600 ${36 * s}px 'Cormorant Garamond', serif`,
          color: "#f7e3b8",
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
          y: 320,
          font: (s) => `700 ${38 * s}px 'Cormorant Garamond', serif`,
          color: "#fbe4b2",
        },
        {
          id: "s3-l2",
          text: groomNick || "(Baban Hajiya)",
          start: 20.2,
          end: 21.4,
          y: 380,
          font: (s) => `italic 500 ${28 * s}px 'Cormorant Garamond', serif`,
          color: "#d9bc84",
        },
        {
          id: "s3-l3",
          text: "Weds.",
          start: 21.4,
          end: 22.8,
          y: 500,
          font: (s) => `700 ${85 * s}px 'Alex Brush', cursive`,
          color: "#ffd982",
          isCursive: true,
        },
        {
          id: "s3-l4",
          text: data.brideName || "Maimunatu Sani Muhammad.",
          start: 22.8,
          end: 25.0,
          y: 620,
          font: (s) => `700 ${38 * s}px 'Cormorant Garamond', serif`,
          color: "#fbe4b2",
        },
        {
          id: "s3-l5",
          text: brideNick || "(Ummi)",
          start: 25.0,
          end: 26.2,
          y: 680,
          font: (s) => `italic 500 ${28 * s}px 'Cormorant Garamond', serif`,
          color: "#d9bc84",
        },
      ],
    },

    // SCENE 4: Schedule, Venue & Reception (26.5s - 35.8s)
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
          y: 310,
          font: (s) => `700 ${20 * s}px 'Cinzel', serif`,
          color: "#dfba74",
          letterSpacing: 4 * scale,
        },
        {
          id: "s4-l2",
          text: `DATE: ${data.eventDate}`,
          start: 28.5,
          end: 30.5,
          y: 400,
          font: (s) => `500 ${22 * s}px 'Montserrat', sans-serif`,
          color: "#eedab2",
        },
        {
          id: "s4-l3",
          text: `TIME: ${data.eventTime} Prompt`,
          start: 30.5,
          end: 32.0,
          y: 460,
          font: (s) => `500 ${22 * s}px 'Montserrat', sans-serif`,
          color: "#eedab2",
        },
        {
          id: "s4-l4",
          text: `VENUE: ${data.venueAddress}`,
          start: 32.0,
          end: 34.0,
          y: 535,
          font: (s) => `500 ${21 * s}px 'Montserrat', sans-serif`,
          color: "#eedab2",
        },
        {
          id: "s4-l5",
          text: data.receptionNote || "Reception follows immediately after the wedding.",
          start: 34.0,
          end: 35.6,
          y: 670,
          font: (s) => `italic 500 ${26 * s}px 'Cormorant Garamond', serif`,
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
          y: 380,
          font: (s) => `700 ${100 * s}px 'Alex Brush', cursive`,
          color: "#ffd982",
          isCursive: true,
        },
        {
          id: "s5-l2",
          text: data.courtesyName || "Alh. Isma'il.",
          start: 38.0,
          end: 39.8,
          y: 520,
          font: (s) => `700 ${42 * s}px 'Cormorant Garamond', serif`,
          color: "#fbe4b2",
        },
        {
          id: "s5-l3",
          text: `RSVP: ${data.rsvpNumbers.join("  •  ")}`,
          start: 39.8,
          end: 41.8,
          y: 650,
          font: (s) => `500 ${20 * s}px 'Montserrat', sans-serif`,
          color: "#eedab2",
        },
      ],
    },
  ];

  // Find active scene
  const activeScene = scenes.find((s) => t >= s.start && t < s.end) || scenes[scenes.length - 1];

  let penTargetX = W * 0.5;
  let penTargetY = H * 0.6;
  let isPenWriting = false;
  let hasActiveLine = false;

  if (activeScene) {
    ctx.save();
    ctx.textAlign = "left";

    for (const line of activeScene.lines) {
      const lineProg =
        t <= line.start ? 0 : t >= line.end ? 1 : (t - line.start) / (line.end - line.start);

      if (lineProg <= 0) continue;

      ctx.font = line.font(scale);
      ctx.fillStyle = line.color;

      if (line.isCursive) {
        ctx.shadowColor = "rgba(255, 224, 141, 0.75)";
        ctx.shadowBlur = 14 * scale;
      } else {
        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowBlur = 6 * scale;
      }

      const fullMetrics = ctx.measureText(line.text);
      const startX = (W - fullMetrics.width) * 0.5;
      const isLandscape = W / H > 1.3;
      const isSquare = Math.abs(W / H - 1) < 0.2;
      const yOffset = isLandscape || isSquare ? H * 0.5 - 460 * scale : 0;
      const yPos = line.y * scale + yOffset;

      if (lineProg >= 1) {
        // Entire line is fully drawn
        ctx.fillText(line.text, startX, yPos);
      } else {
        // Partially revealed text clipped right at current ink progress
        const currentWidth = fullMetrics.width * lineProg;
        ctx.save();
        ctx.beginPath();
        ctx.rect(startX - 5 * scale, yPos - 120 * scale, currentWidth + 5 * scale, 180 * scale);
        ctx.clip();
        ctx.fillText(line.text, startX, yPos);
        ctx.restore();

        // Lock pen nib precisely to the leading edge of the ink
        if (!hasActiveLine) {
          hasActiveLine = true;
          isPenWriting = true;
          penTargetX = startX + currentWidth;
          penTargetY = yPos - 2 * scale;
        }
      }
    }
    ctx.restore();
  }

  // If between lines, pen glides smoothly from previous line end to next line start
  if (!hasActiveLine && activeScene) {
    let prevLine: ScriptLineDef | null = null;
    let nextLine: ScriptLineDef | null = null;
    const isLandscape = W / H > 1.3;
    const isSquare = Math.abs(W / H - 1) < 0.2;
    const yOffset = isLandscape || isSquare ? H * 0.5 - 460 * scale : 0;

    for (let i = 0; i < activeScene.lines.length; i++) {
      if (t < activeScene.lines[i].start) {
        nextLine = activeScene.lines[i];
        prevLine = i > 0 ? activeScene.lines[i - 1] : null;
        break;
      }
    }

    if (nextLine) {
      ctx.font = nextLine.font(scale);
      const nextMetrics = ctx.measureText(nextLine.text);
      const nextStartX = (W - nextMetrics.width) * 0.5;
      const nextY = nextLine.y * scale + yOffset - 2 * scale;

      if (prevLine) {
        ctx.font = prevLine.font(scale);
        const prevMetrics = ctx.measureText(prevLine.text);
        const prevEndX = (W - prevMetrics.width) * 0.5 + prevMetrics.width;
        const prevY = prevLine.y * scale + yOffset - 2 * scale;

        const transDuration = Math.max(0.01, nextLine.start - prevLine.end);
        const transProg = Math.min(1, Math.max(0, (t - prevLine.end) / transDuration));
        const ease = 0.5 - 0.5 * Math.cos(transProg * Math.PI);

        penTargetX = prevEndX + (nextStartX - prevEndX) * ease;
        penTargetY = prevY + (nextY - prevY) * ease;
      } else {
        penTargetX = nextStartX;
        penTargetY = nextY;
      }
      isPenWriting = false;
    }
  }

  // 4. Draw the Animated Hand with Fountain Pen on Canvas
  if (t > 0.4) {
    drawHandAndPenOnCanvas(ctx, penTargetX, penTargetY, scale, isPenWriting, t);
  }

  // 5. Bottom event tag
  ctx.save();
  ctx.font = `600 ${14 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "rgba(168, 144, 103, 0.75)";
  ctx.textAlign = "center";
  ctx.fillText(
    `✦ ${(data.groomNick || data.groomName).toUpperCase()} & ${(data.brideNick || data.brideName).toUpperCase()} • ${data.eventHeading.toUpperCase()} ✦`,
    W * 0.5,
    H - 24 * scale
  );
  ctx.restore();
}

/**
 * Draws the top vintage ornate gold crest on canvas
 */
function drawTopOrnateGoldCrest(ctx: CanvasRenderingContext2D, W: number, scale: number) {
  const cx = W * 0.5;
  const cy = 60 * scale;

  ctx.save();

  // Dark curved arch header silhouette
  const archW = 340 * scale;
  const archH = 95 * scale;
  ctx.fillStyle = "#120f0d";
  ctx.strokeStyle = "#c59b27";
  ctx.lineWidth = 1.5 * scale;

  ctx.beginPath();
  ctx.ellipse(cx, 10 * scale, archW * 0.5, archH * 0.7, 0, 0, Math.PI);
  ctx.fill();
  ctx.stroke();

  // Crown at top center
  ctx.fillStyle = "#fae7b5";
  ctx.beginPath();
  ctx.moveTo(cx - 20 * scale, cy - 25 * scale);
  ctx.lineTo(cx - 15 * scale, cy - 42 * scale);
  ctx.lineTo(cx - 5 * scale, cy - 32 * scale);
  ctx.lineTo(cx, cy - 48 * scale);
  ctx.lineTo(cx + 5 * scale, cy - 32 * scale);
  ctx.lineTo(cx + 15 * scale, cy - 42 * scale);
  ctx.lineTo(cx + 20 * scale, cy - 25 * scale);
  ctx.closePath();
  ctx.fill();

  // "INVITATION" Banner Text
  ctx.font = `700 ${18 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "#fce3a6";
  ctx.shadowColor = "rgba(252, 227, 166, 0.6)";
  ctx.shadowBlur = 8 * scale;
  ctx.textAlign = "center";
  ctx.fillText("✦ INVITATION ✦", cx, cy + 2 * scale);

  // Filigree scrolls left & right
  ctx.strokeStyle = "#deb86e";
  ctx.lineWidth = 1.8 * scale;
  ctx.beginPath();
  // Left scroll
  ctx.moveTo(cx - 95 * scale, cy - 2 * scale);
  ctx.bezierCurveTo(cx - 130 * scale, cy - 18 * scale, cx - 150 * scale, cy + 6 * scale, cx - 165 * scale, cy - 4 * scale);
  // Right scroll
  ctx.moveTo(cx + 95 * scale, cy - 2 * scale);
  ctx.bezierCurveTo(cx + 130 * scale, cy - 18 * scale, cx + 150 * scale, cy + 6 * scale, cx + 165 * scale, cy - 4 * scale);
  ctx.stroke();

  // Dangling gold beads
  ctx.fillStyle = "#ffd982";
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(cx + i * 14 * scale, cy + 22 * scale, (2.5 - Math.abs(i) * 0.4) * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws the realistic hand holding an executive fountain pen onto the 2D canvas
 */
function drawHandAndPenOnCanvas(
  ctx: CanvasRenderingContext2D,
  tipX: number,
  tipY: number,
  scale: number,
  isWriting: boolean,
  t: number
) {
  ctx.save();

  // Handwriting jitter when writing
  const jitterX = isWriting ? Math.sin(t * 32) * 1.5 * scale : 0;
  const jitterY = isWriting ? Math.cos(t * 38) * 1.0 * scale : 0;
  const liftOffset = isWriting ? 0 : 10 * scale;

  const nx = tipX + jitterX + liftOffset;
  const ny = tipY + jitterY - liftOffset;

  // 1. Drop shadow beneath the pen and fingers
  ctx.save();
  ctx.translate(nx + 35 * scale, ny + 40 * scale);
  ctx.rotate((38 * Math.PI) / 180);
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 80 * scale, 30 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. The Fountain Pen
  ctx.save();
  ctx.translate(nx, ny);
  ctx.rotate((40 * Math.PI) / 180); // Tilted naturally towards bottom right

  // Gold Nib
  const nibGrad = ctx.createLinearGradient(-10 * scale, 0, 10 * scale, 40 * scale);
  nibGrad.addColorStop(0, "#fae7b5");
  nibGrad.addColorStop(0.5, "#d8ab43");
  nibGrad.addColorStop(1, "#8f6717");
  ctx.fillStyle = nibGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0); // Nib tip!
  ctx.lineTo(8 * scale, 20 * scale);
  ctx.lineTo(6 * scale, 36 * scale);
  ctx.lineTo(-6 * scale, 36 * scale);
  ctx.lineTo(-8 * scale, 20 * scale);
  ctx.closePath();
  ctx.fill();

  // Nib slit & breather hole
  ctx.strokeStyle = "#4d380f";
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 22 * scale);
  ctx.stroke();
  ctx.fillStyle = "#4d380f";
  ctx.beginPath();
  ctx.arc(0, 22 * scale, 1.8 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Pen grip section (polished charcoal)
  ctx.fillStyle = "#1e1a17";
  ctx.fillRect(-9 * scale, 36 * scale, 18 * scale, 45 * scale);

  // Gold trim ring
  ctx.fillStyle = nibGrad;
  ctx.fillRect(-10.5 * scale, 81 * scale, 21 * scale, 7 * scale);

  // Pen Barrel (deep black lacquer with reflection)
  ctx.fillStyle = "#12100e";
  ctx.fillRect(-11 * scale, 88 * scale, 22 * scale, 170 * scale);

  // High gloss streak
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillRect(-6 * scale, 88 * scale, 3 * scale, 160 * scale);

  // Gold Clip
  ctx.fillStyle = nibGrad;
  ctx.fillRect(8 * scale, 110 * scale, 4.5 * scale, 90 * scale);

  ctx.restore();

  // 3. The Hand Gripping the Pen
  ctx.save();
  ctx.translate(nx, ny);

  // Skin tone gradient
  const skinGrad = ctx.createLinearGradient(40 * scale, 40 * scale, 180 * scale, 240 * scale);
  skinGrad.addColorStop(0, "#f2c7a5");
  skinGrad.addColorStop(0.4, "#d8966f");
  skinGrad.addColorStop(0.85, "#b97349");
  skinGrad.addColorStop(1, "#8e4e29");

  // Forefinger (gripping the lower pen barrel)
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.moveTo(35 * scale, 45 * scale);
  ctx.bezierCurveTo(28 * scale, 65 * scale, 35 * scale, 95 * scale, 55 * scale, 95 * scale);
  ctx.bezierCurveTo(75 * scale, 95 * scale, 78 * scale, 75 * scale, 68 * scale, 55 * scale);
  ctx.bezierCurveTo(60 * scale, 40 * scale, 45 * scale, 35 * scale, 35 * scale, 45 * scale);
  ctx.fill();

  // Index finger nail highlight
  ctx.fillStyle = "rgba(255, 240, 230, 0.55)";
  ctx.beginPath();
  ctx.ellipse(36 * scale, 60 * scale, 5 * scale, 8 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Thumb clamping across
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.moveTo(55 * scale, 45 * scale);
  ctx.bezierCurveTo(55 * scale, 25 * scale, 75 * scale, 18 * scale, 95 * scale, 22 * scale);
  ctx.bezierCurveTo(115 * scale, 26 * scale, 115 * scale, 55 * scale, 95 * scale, 68 * scale);
  ctx.bezierCurveTo(80 * scale, 75 * scale, 65 * scale, 65 * scale, 55 * scale, 45 * scale);
  ctx.fill();

  // Hand body & wrist extending to bottom right
  ctx.fillStyle = skinGrad;
  ctx.beginPath();
  ctx.moveTo(75 * scale, 75 * scale);
  ctx.bezierCurveTo(110 * scale, 100 * scale, 150 * scale, 140 * scale, 200 * scale, 220 * scale);
  ctx.lineTo(260 * scale, 280 * scale);
  ctx.lineTo(170 * scale, 320 * scale);
  ctx.bezierCurveTo(130 * scale, 220 * scale, 90 * scale, 160 * scale, 65 * scale, 110 * scale);
  ctx.closePath();
  ctx.fill();

  // Ink shine at tip when writing
  if (isWriting) {
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#fde047";
    ctx.shadowBlur = 10 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();

  ctx.restore();
}
