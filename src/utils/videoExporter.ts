import { InvitationData } from "../types";
import { weddingAudio } from "./audio";
import { drawSceneMosqueShadow } from "./mosqueSilhouettes";
import { drawRealMosqueSceneBackground } from "./realMosqueRenderer";
import { preloadMosquePhotoSet, DEFAULT_MOSQUE_PHOTOS } from "./mosqueImageLoader";
import { renderCalligraphyPenVideoFrame } from "./calligraphyPenCanvasRenderer";
import { renderEmeraldLanternVideoFrame } from "./emeraldLanternCanvasRenderer";
import {
  renderGoldenBokehVideoFrame,
  preloadPortraitImages,
} from "./goldenBokehCanvasRenderer";
import { renderBaroqueTablescapeVideoFrame } from "./baroqueTablescapeCanvasRenderer";
import { renderOliveRusticTablescapeVideoFrame } from "./oliveRusticTablescapeCanvasRenderer";
import {
  DEFAULT_BRIDE_PHOTO,
  DEFAULT_GROOM_PHOTO,
} from "../components/GoldenBokehPlayer";

export interface VideoExportOptions {
  duration?: number; // duration in seconds (default 24s)
  width?: number; // default 720
  height?: number; // default 1280
  fps?: number; // default 30
  includeAudio?: boolean;
  onProgress?: (progress: number, stageText: string) => void;
}

export function getSupportedVideoMimeType(): { mimeType: string; extension: string } {
  if (typeof MediaRecorder === "undefined") {
    return { mimeType: "video/webm", extension: "webm" };
  }

  const candidateTypes = [
    { mime: "video/mp4;codecs=avc1,mp4a.40.2", ext: "mp4" },
    { mime: "video/mp4;codecs=avc1", ext: "mp4" },
    { mime: "video/mp4", ext: "mp4" },
    { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
    { mime: "video/webm;codecs=vp8,opus", ext: "webm" },
    { mime: "video/webm", ext: "webm" },
  ];

  for (const candidate of candidateTypes) {
    if (MediaRecorder.isTypeSupported(candidate.mime)) {
      return { mimeType: candidate.mime, extension: candidate.ext };
    }
  }

  return { mimeType: "video/webm", extension: "webm" };
}

/**
 * Renders a single frame of the Wedding Invitation video onto a 2D canvas at time `t`.
 */
export function renderInvitationFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  data: InvitationData
) {
  const W = width;
  const H = height;
  const scale = W / 720;

  // Clear canvas
  ctx.clearRect(0, 0, W, H);

  // 0. Support Multiple Video Template Styles
  if (data.templateStyle === "oliveRusticTablescape") {
    renderOliveRusticTablescapeVideoFrame(ctx, W, H, scale, t, data);
    return;
  }
  if (data.templateStyle === "baroqueTablescape") {
    renderBaroqueTablescapeVideoFrame(ctx, W, H, scale, t, data);
    return;
  }
  if (data.templateStyle === "goldenBokeh") {
    renderGoldenBokehVideoFrame(ctx, W, H, scale, t, data);
    return;
  }
  if (data.templateStyle === "calligraphyPen") {
    renderCalligraphyPenVideoFrame(ctx, W, H, scale, t, data);
    return;
  }
  if (data.templateStyle === "emeraldLantern") {
    renderEmeraldLanternVideoFrame(ctx, W, H, scale, t, data);
    return;
  }

  // 1. Royal Cinematic Moving Background (Camera Zoom, Silk Waves, Mandalas, Bokeh & Petals)
  drawRoyalCinematicBackground(ctx, W, H, scale, t, data);

  // 2. Embossed Luxury Borders
  ctx.save();
  // Outer gold frame
  ctx.strokeStyle = "#c5a059";
  ctx.lineWidth = 4 * scale;
  const m1 = 24 * scale;
  ctx.strokeRect(m1, m1, W - m1 * 2, H - m1 * 2);

  // Inner dashed delicate frame
  ctx.strokeStyle = "#deb86e";
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([6 * scale, 4 * scale]);
  const m2 = 34 * scale;
  ctx.strokeRect(m2, m2, W - m2 * 2, H - m2 * 2);
  ctx.setLineDash([]);

  // Corner ornaments
  const drawCorner = (x: number, y: number, rot: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24 * scale, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 24 * scale);
    ctx.moveTo(8 * scale, 8 * scale);
    ctx.arc(8 * scale, 8 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  drawCorner(m1 + 2 * scale, m1 + 2 * scale, 0);
  drawCorner(W - m1 - 2 * scale, m1 + 2 * scale, Math.PI / 2);
  drawCorner(W - m1 - 2 * scale, H - m1 - 2 * scale, Math.PI);
  drawCorner(m1 + 2 * scale, H - m1 - 2 * scale, -Math.PI / 2);
  ctx.restore();

  // 3. Envelope Animation Phase (t: 0s to 3.5s)
  if (t < 3.8) {
    const envProgress = Math.min(1, Math.max(0, t / 2.8));
    drawEnvelopeFlaps(ctx, W, H, scale, envProgress, t);
  }

  // 5. 3D Morphing Butterfly (Flight from 0.8s to 3.5s, resting afterwards at top center)
  drawButterfly(ctx, W, H, scale, t);

  // 6. Text and Scenes Rendering
  ctx.textAlign = "center";

  // Always subtle top Arabic Bismillah header (fades in after 2.5s)
  if (t >= 2.0 && data.bismillah) {
    const bismillahAlpha = Math.min(1, (t - 2.0) / 1.0);
    ctx.save();
    ctx.globalAlpha = bismillahAlpha;
    ctx.fillStyle = "#8a6d3b";
    ctx.font = `italic ${26 * scale}px 'Cormorant Garamond', 'Amiri', serif`;
    ctx.fillText(data.bismillahText, W * 0.5, 185 * scale);
    ctx.restore();
  }

  // Determine current active scene
  // Scene 1: 3.2s - 8.2s (Host Families)
  // Scene 2: 8.2s - 13.8s (Ceremony & Couple)
  // Scene 3: 13.8s - 18.8s (Date, Time, Venue)
  // Scene 4: 18.8s - 24.0s (Grand Finale & RSVP)

  if (t >= 3.2 && t < 8.2) {
    renderScene1Families(ctx, W, H, scale, t, data);
  } else if (t >= 8.2 && t < 13.8) {
    renderScene2Couple(ctx, W, H, scale, t, data);
  } else if (t >= 13.8 && t < 18.8) {
    renderScene3Details(ctx, W, H, scale, t, data);
  } else if (t >= 18.8) {
    renderScene4Finale(ctx, W, H, scale, t, data);
  }

  // Persistent subtle bottom seal & signature
  const groomText = (data.groomNick || data.groomName).toUpperCase();
  const brideText = (data.brideNick || data.brideName).toUpperCase();
  const headingText = (data.eventHeading || "WEDDING FATIHA").toUpperCase();

  ctx.save();
  ctx.fillStyle = "#a88e63";
  ctx.font = `600 ${13 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.globalAlpha = 0.8;
  ctx.fillText(`✦ ${groomText} & ${brideText} • ${headingText} ✦`, W * 0.5, H - 48 * scale);
  ctx.restore();
}

function getStagger(localT: number, delay: number, duration = 0.55) {
  if (localT < delay) return { alpha: 0, yOffset: 14 };
  const p = Math.min(1, (localT - delay) / duration);
  const ease = 1 - Math.pow(1 - p, 3); // cubic ease-out
  return {
    alpha: ease,
    yOffset: (1 - ease) * 14,
  };
}

function drawLuminousPedestal(
  ctx: CanvasRenderingContext2D,
  W: number,
  cardY: number,
  cardH: number,
  scale: number,
  alpha: number
) {
  const cardW = W * 0.86;
  const cardX = (W - cardW) * 0.5;

  ctx.save();
  ctx.globalAlpha = alpha * 0.92;
  ctx.fillStyle = "rgba(255, 254, 251, 0.92)";
  ctx.shadowColor = "rgba(180, 140, 70, 0.22)";
  ctx.shadowBlur = 24 * scale;
  roundRect(ctx, cardX, cardY, cardW, cardH, 20 * scale);
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(223, 204, 168, 0.85)";
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  // Corner subtle gold star accents
  ctx.fillStyle = "rgba(197, 160, 89, 0.5)";
  ctx.font = `600 ${14 * scale}px sans-serif`;
  ctx.fillText("✦", cardX + 16 * scale, cardY + 22 * scale);
  ctx.fillText("✦", cardX + cardW - 16 * scale, cardY + 22 * scale);
  ctx.fillText("✦", cardX + 16 * scale, cardY + cardH - 12 * scale);
  ctx.fillText("✦", cardX + cardW - 16 * scale, cardY + cardH - 12 * scale);

  ctx.restore();
}

/**
 * Scene 1: The Host Families
 */
function renderScene1Families(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  const localT = t - 3.2;
  const fadeIn = Math.min(1, localT / 0.6);
  const fadeOut = localT > 4.3 ? Math.max(0, 1 - (localT - 4.3) / 0.7) : 1;
  const baseAlpha = fadeIn * fadeOut;

  drawLuminousPedestal(ctx, W, 290 * scale, 470 * scale, scale, baseAlpha);

  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetY = 1 * scale;

  // 1. Intro phrase
  const s1 = getStagger(localT, 0.0);
  ctx.globalAlpha = baseAlpha * s1.alpha;
  ctx.font = `700 ${20 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#694d22";
  ctx.fillText(data.familyIntro, W * 0.5, (345 + s1.yOffset) * scale);

  // Divider line
  ctx.strokeStyle = "#c5a059";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(W * 0.5 - 55 * scale, (370 + s1.yOffset) * scale);
  ctx.lineTo(W * 0.5 + 55 * scale, (370 + s1.yOffset) * scale);
  ctx.stroke();

  // 2. Late father
  const s2 = getStagger(localT, 0.2);
  ctx.globalAlpha = baseAlpha * s2.alpha;
  ctx.font = `italic 700 ${34 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#140e08";
  ctx.fillText(data.familyLateFather, W * 0.5, (430 + s2.yOffset) * scale);

  // 3. AND
  const s3 = getStagger(localT, 0.35);
  ctx.globalAlpha = baseAlpha * s3.alpha;
  ctx.font = `700 ${20 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "#8c672b";
  ctx.fillText("AND", W * 0.5, (485 + s3.yOffset) * scale);

  // 4. Second father
  const s4 = getStagger(localT, 0.5);
  ctx.globalAlpha = baseAlpha * s4.alpha;
  ctx.font = `italic 700 ${34 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#140e08";
  ctx.fillText(data.familySecondFather, W * 0.5, (545 + s4.yOffset) * scale);

  // 5. Invitation phrase
  const s5 = getStagger(localT, 0.65);
  ctx.globalAlpha = baseAlpha * s5.alpha;
  ctx.font = `italic ${28 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#785721";
  ctx.fillText(data.invitationPhrase, W * 0.5, (615 + s5.yOffset) * scale);

  // 6. Event title preview
  const s6 = getStagger(localT, 0.8);
  ctx.globalAlpha = baseAlpha * s6.alpha;
  ctx.font = `700 ${50 * scale}px 'Alex Brush', cursive`;
  ctx.fillStyle = "#b58735";
  ctx.fillText(data.eventHeading, W * 0.5, (695 + s6.yOffset) * scale);

  ctx.restore();
}

/**
 * Scene 2: The Ceremony & Couple
 */
function renderScene2Couple(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  const localT = t - 8.2;
  const fadeIn = Math.min(1, localT / 0.6);
  const fadeOut = localT > 4.7 ? Math.max(0, 1 - (localT - 4.7) / 0.7) : 1;
  const baseAlpha = fadeIn * fadeOut;

  drawLuminousPedestal(ctx, W, 260 * scale, 500 * scale, scale, baseAlpha);

  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetY = 1 * scale;

  // 1. Event Heading (Wedding Fatiha)
  const s1 = getStagger(localT, 0.0);
  ctx.globalAlpha = baseAlpha * s1.alpha;
  ctx.font = `700 ${68 * scale}px 'Alex Brush', cursive`;
  ctx.fillStyle = "#b58735";
  ctx.fillText(data.eventHeading, W * 0.5, (335 + s1.yOffset) * scale);

  // 2. "of their beloved children"
  const s2 = getStagger(localT, 0.2);
  ctx.globalAlpha = baseAlpha * s2.alpha;
  ctx.font = `700 ${18 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3.5 * scale}px`;
  ctx.fillStyle = "#6b522b";
  ctx.fillText(data.childrenPhrase, W * 0.5, (390 + s2.yOffset) * scale);

  // 3. Groom Name
  const s3 = getStagger(localT, 0.38);
  ctx.globalAlpha = baseAlpha * s3.alpha;
  ctx.font = `700 ${46 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#120d07";
  ctx.fillText(data.groomName, W * 0.5, (470 + s3.yOffset) * scale);

  if (data.groomNick) {
    ctx.font = `italic 600 ${24 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#876226";
    ctx.fillText(`(${data.groomNick})`, W * 0.5, (510 + s3.yOffset) * scale);
  }

  // 4. Ornamental "&"
  const s4 = getStagger(localT, 0.54);
  ctx.globalAlpha = baseAlpha * s4.alpha;
  ctx.font = `italic 700 ${46 * scale}px 'Alex Brush', cursive`;
  ctx.fillStyle = "#b58735";
  ctx.fillText("&", W * 0.5, (570 + s4.yOffset) * scale);

  // 5. Bride Name
  const s5 = getStagger(localT, 0.7);
  ctx.globalAlpha = baseAlpha * s5.alpha;
  ctx.font = `700 ${46 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#120d07";
  ctx.fillText(data.brideName, W * 0.5, (640 + s5.yOffset) * scale);

  if (data.brideNick) {
    ctx.font = `italic 600 ${24 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#876226";
    ctx.fillText(`(${data.brideNick})`, W * 0.5, (680 + s5.yOffset) * scale);
  }

  // Golden separator line
  ctx.strokeStyle = "#c5a059";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(W * 0.5 - 65 * scale, 725 * scale);
  ctx.lineTo(W * 0.5 + 65 * scale, 725 * scale);
  ctx.stroke();

  ctx.restore();
}

/**
 * Scene 3: Event Schedule & Venue
 */
function renderScene3Details(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  const localT = t - 13.8;
  const fadeIn = Math.min(1, localT / 0.6);
  const fadeOut = localT > 4.3 ? Math.max(0, 1 - (localT - 4.3) / 0.7) : 1;
  const baseAlpha = fadeIn * fadeOut;

  drawLuminousPedestal(ctx, W, 270 * scale, 480 * scale, scale, baseAlpha);

  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetY = 1 * scale;

  // 1. Title
  const s1 = getStagger(localT, 0.0);
  ctx.globalAlpha = baseAlpha * s1.alpha;
  ctx.font = `700 ${20 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#6b522b";
  ctx.fillText("✦ DATE & TIME ✦", W * 0.5, (330 + s1.yOffset) * scale);

  // 2. Date banner
  const s2 = getStagger(localT, 0.2);
  ctx.globalAlpha = baseAlpha * s2.alpha;
  ctx.font = `700 ${32 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "#120d07";
  ctx.fillText(data.eventDate.toUpperCase(), W * 0.5, (400 + s2.yOffset) * scale);

  // 3. Time Pill
  const s3 = getStagger(localT, 0.35);
  ctx.globalAlpha = baseAlpha * s3.alpha;
  const pillW = 260 * scale;
  const pillH = 42 * scale;
  const pillX = (W - pillW) * 0.5;
  const pillY = (435 + s3.yOffset) * scale;
  ctx.fillStyle = "rgba(249, 239, 224, 0.9)";
  ctx.strokeStyle = "#d6be96";
  ctx.lineWidth = 1.2 * scale;
  roundRect(ctx, pillX, pillY, pillW, pillH, 21 * scale);
  ctx.fill();
  ctx.stroke();

  ctx.font = `700 ${22 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${2 * scale}px`;
  ctx.fillStyle = "#543b16";
  ctx.fillText(`TIME: ${data.eventTime}`, W * 0.5, pillY + 27 * scale);

  // 4. Venue Heading
  const s4 = getStagger(localT, 0.5);
  ctx.globalAlpha = baseAlpha * s4.alpha;
  ctx.font = `700 ${19 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.fillStyle = "#6b522b";
  ctx.fillText("VENUE", W * 0.5, (535 + s4.yOffset) * scale);

  // 5. Venue Address
  const s5 = getStagger(localT, 0.65);
  ctx.globalAlpha = baseAlpha * s5.alpha;
  ctx.font = `600 ${25 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#1a130b";
  wrapText(ctx, data.venueAddress, W * 0.5, (575 + s5.yOffset) * scale, W * 0.78, 34 * scale);

  // 6. Reception note
  const s6 = getStagger(localT, 0.8);
  ctx.globalAlpha = baseAlpha * s6.alpha;
  ctx.font = `italic 700 ${26 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#996e21";
  ctx.fillText(`✨ ${data.receptionNote} ✨`, W * 0.5, (695 + s6.yOffset) * scale);

  ctx.restore();
}

/**
 * Scene 4: Grand Finale & RSVP
 */
function renderScene4Finale(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  const localT = t - 18.8;
  const fadeIn = Math.min(1, localT / 0.6);
  const baseAlpha = fadeIn;

  drawLuminousPedestal(ctx, W, 260 * scale, 500 * scale, scale, baseAlpha);

  ctx.save();
  ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 4 * scale;
  ctx.shadowOffsetY = 1 * scale;

  // 1. Kindly RSVP
  const s1 = getStagger(localT, 0.0);
  ctx.globalAlpha = baseAlpha * s1.alpha;
  ctx.font = `700 ${56 * scale}px 'Alex Brush', cursive`;
  ctx.fillStyle = "#b58735";
  ctx.fillText("Kindly RSVP", W * 0.5, (330 + s1.yOffset) * scale);

  // 2. RSVP Contacts Label
  const s2 = getStagger(localT, 0.2);
  ctx.globalAlpha = baseAlpha * s2.alpha;
  ctx.font = `700 ${18 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3.5 * scale}px`;
  ctx.fillStyle = "#694e25";
  ctx.fillText(data.rsvpLabel.toUpperCase(), W * 0.5, (380 + s2.yOffset) * scale);

  // 3. Contact Numbers Box
  const s3 = getStagger(localT, 0.38);
  ctx.globalAlpha = baseAlpha * s3.alpha;
  const boxW = W * 0.74;
  const boxH = (data.rsvpNumbers.length * 44 + 20) * scale;
  const boxX = (W - boxW) * 0.5;
  const boxY = (410 + s3.yOffset) * scale;

  ctx.fillStyle = "rgba(251, 243, 230, 0.85)";
  ctx.strokeStyle = "#dbc6a4";
  ctx.lineWidth = 1.2 * scale;
  roundRect(ctx, boxX, boxY, boxW, boxH, 16 * scale);
  ctx.fill();
  ctx.stroke();

  data.rsvpNumbers.forEach((num, idx) => {
    ctx.font = `600 ${22 * scale}px 'Montserrat', sans-serif`;
    ctx.fillStyle = "#120e09";
    ctx.fillText(`📞  ${num}`, W * 0.5, boxY + (36 + idx * 42) * scale);
  });

  // 4. City note
  const s4 = getStagger(localT, 0.55);
  ctx.globalAlpha = baseAlpha * s4.alpha;
  ctx.font = `italic 600 ${22 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#523d1e";
  ctx.fillText("Turaki (A), Jalingo, Taraba State", W * 0.5, (boxY + boxH + 35 * scale));

  // 5. Blessing
  const s5 = getStagger(localT, 0.7);
  ctx.globalAlpha = baseAlpha * s5.alpha;
  ctx.font = `700 ${36 * scale}px 'Alex Brush', cursive`;
  ctx.fillStyle = "#966b1e";
  ctx.fillText("May Allah bless this union", W * 0.5, (boxY + boxH + 85 * scale));

  ctx.restore();
}

/**
 * Envelope 3D unfolding visual on canvas
 */
function drawEnvelopeFlaps(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  progress: number,
  t: number
) {
  const envW = 440 * scale;
  const envH = 340 * scale;
  const cx = W * 0.5;
  const cy = H * 0.52;

  ctx.save();

  // Disappear / fade envelope as progress reaches 1.0
  const envAlpha = progress > 0.8 ? Math.max(0, 1 - (progress - 0.8) / 0.2) : 1;
  ctx.globalAlpha = envAlpha;

  // Envelope Body
  ctx.fillStyle = "#f5eee0";
  ctx.strokeStyle = "#c5a059";
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = "rgba(0,0,0,0.15)";
  ctx.shadowBlur = 15 * scale;
  ctx.fillRect(cx - envW * 0.5, cy - envH * 0.5, envW, envH);
  ctx.shadowBlur = 0;
  ctx.strokeRect(cx - envW * 0.5, cy - envH * 0.5, envW, envH);

  // Interior gold card peaking out
  const cardRise = progress * 100 * scale;
  ctx.fillStyle = "#fffcf7";
  ctx.fillRect(cx - envW * 0.44, cy - envH * 0.44 - cardRise, envW * 0.88, envH * 0.88);
  ctx.strokeStyle = "#deb86e";
  ctx.strokeRect(cx - envW * 0.44, cy - envH * 0.44 - cardRise, envW * 0.88, envH * 0.88);

  // Top Flap opening (simulating 3D perspective fold)
  // At progress 0: angle is 0 (pointing down)
  // At progress 1: angle is PI (pointing up)
  const flapAngle = progress * Math.PI;
  const flapH = Math.cos(flapAngle) * (envH * 0.5);

  ctx.beginPath();
  ctx.moveTo(cx - envW * 0.5, cy - envH * 0.5);
  ctx.lineTo(cx + envW * 0.5, cy - envH * 0.5);
  ctx.lineTo(cx, cy - envH * 0.5 + flapH);
  ctx.closePath();

  const flapGrad = ctx.createLinearGradient(cx, cy - envH * 0.5, cx, cy - envH * 0.5 + flapH);
  if (Math.cos(flapAngle) >= 0) {
    flapGrad.addColorStop(0, "#f3ebdd");
    flapGrad.addColorStop(1, "#eae0cf");
  } else {
    flapGrad.addColorStop(0, "#efe5d3");
    flapGrad.addColorStop(1, "#fcf8f0");
  }
  ctx.fillStyle = flapGrad;
  ctx.fill();
  ctx.stroke();

  // Wax Gold Seal on flap
  if (progress < 0.4) {
    const sealAlpha = 1 - progress / 0.4;
    ctx.save();
    ctx.globalAlpha = envAlpha * sealAlpha;
    ctx.beginPath();
    ctx.arc(cx, cy - envH * 0.5 + flapH, 22 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "#c5a059";
    ctx.shadowColor = "rgba(197, 160, 89, 0.5)";
    ctx.shadowBlur = 10 * scale;
    ctx.fill();
    ctx.strokeStyle = "#f3e1b8";
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 3D Pearlescent Butterfly
 */
function drawButterfly(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number
) {
  // Disappear after first appearance (complete fade out by 4.6s)
  if (t < 0.6 || t > 4.6) return;

  const alpha =
    t < 1.2
      ? Math.min(1, (t - 0.6) / 0.6)
      : t < 3.8
      ? 1
      : Math.max(0, 1 - (t - 3.8) / 0.8);

  if (alpha <= 0) return;

  // Flight trajectory
  // From t = 0.8 to 3.5: ascends from center of envelope up to resting top position
  const flyProg = Math.min(1, Math.max(0, (t - 0.8) / 2.5));
  const isFlying = t > 0.8 && t < 3.5;

  // Coordinates
  const targetX = W * 0.5;
  const targetY = 95 * scale;
  const startX = W * 0.5;
  const startY = H * 0.52;

  // Smooth easeInOut trajectory
  const easeY = 0.5 - 0.5 * Math.cos(flyProg * Math.PI);
  // Add gentle natural horizontal wobble during flight
  const wobbleX = isFlying ? Math.sin(t * 7) * 22 * scale : 0;
  const curX = startX + (targetX - startX) * easeY + wobbleX;
  const curY = startY + (targetY - startY) * easeY;

  // Wing flap frequency (fast when flying, gentle breathing when resting)
  const flapSpeed = isFlying ? 22 : 4.5;
  const flapAngle = Math.sin(t * flapSpeed);
  // Perspective wing width compression: between 0.2 and 1.0
  const wingScaleX = 0.25 + 0.75 * Math.abs(flapAngle);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(curX, curY);

  // Slight flight tilt
  const tilt = isFlying ? Math.sin(t * 5) * 0.15 : Math.sin(t * 1.5) * 0.04;
  ctx.rotate(tilt);

  const bScale = scale * 0.95;

  // Draw Wings (Left & Right)
  const drawWing = (side: 1 | -1) => {
    ctx.save();
    ctx.scale(side * wingScaleX, 1);

    // Forewing (Upper Wing)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(25 * bScale, -35 * bScale, 55 * bScale, -45 * bScale, 58 * bScale, -25 * bScale);
    ctx.bezierCurveTo(60 * bScale, -5 * bScale, 45 * bScale, 15 * bScale, 0, 0);

    const gradUpper = ctx.createRadialGradient(25 * bScale, -20 * bScale, 5 * bScale, 30 * bScale, -20 * bScale, 40 * bScale);
    gradUpper.addColorStop(0, "rgba(255, 255, 255, 0.95)"); // Pearl
    gradUpper.addColorStop(0.4, "rgba(195, 225, 250, 0.88)"); // Soft Sky Blue
    gradUpper.addColorStop(0.8, "rgba(235, 205, 150, 0.9)"); // Gold edge
    gradUpper.addColorStop(1, "rgba(197, 160, 89, 0.95)");
    ctx.fillStyle = gradUpper;
    ctx.fill();
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 1.2 * bScale;
    ctx.stroke();

    // Hindwing (Lower Wing)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(20 * bScale, 10 * bScale, 45 * bScale, 20 * bScale, 40 * bScale, 35 * bScale);
    ctx.bezierCurveTo(30 * bScale, 45 * bScale, 10 * bScale, 30 * bScale, 0, 0);

    const gradLower = ctx.createRadialGradient(15 * bScale, 15 * bScale, 3 * bScale, 20 * bScale, 20 * bScale, 30 * bScale);
    gradLower.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    gradLower.addColorStop(0.5, "rgba(180, 215, 245, 0.8)");
    gradLower.addColorStop(1, "rgba(197, 160, 89, 0.85)");
    ctx.fillStyle = gradLower;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  };

  drawWing(1); // Right
  drawWing(-1); // Left

  // Butterfly Body & Antennae
  ctx.fillStyle = "#332617";
  ctx.beginPath();
  ctx.ellipse(0, 0, 3 * bScale, 14 * bScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(0, -15 * bScale, 4 * bScale, 0, Math.PI * 2);
  ctx.fillStyle = "#c5a059";
  ctx.fill();

  // Antennae
  ctx.strokeStyle = "#8a6e38";
  ctx.lineWidth = 1 * bScale;
  ctx.beginPath();
  ctx.moveTo(0, -17 * bScale);
  ctx.quadraticCurveTo(-6 * bScale, -26 * bScale, -12 * bScale, -28 * bScale);
  ctx.moveTo(0, -17 * bScale);
  ctx.quadraticCurveTo(6 * bScale, -26 * bScale, 12 * bScale, -28 * bScale);
  ctx.stroke();

  ctx.restore();
}

/**
 * Text wrapping helper
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

/**
 * Rounded rectangle helper
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Royal Cinematic Moving Background for Video Export
 * Features:
 * - Dynamic camera dolly zoom & subtle vertical drift
 * - Moving anamorphic golden sun flares & light leaks
 * - Moving royal silk fabric waves / shimmering ribbons
 * - Rotating Sacred Islamic Geometric Mandalas (Arabesque rosettes)
 * - Drifting soft-focus bokeh orbs with glowing radial gradients
 * - Shimmering diamond star crosses (✦) and crystalline micro-embers
 * - Floating royal champagne gold rose petals with 3D tumble physics
 */
function drawRoyalCinematicBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  const themeColor = data.themeColor || "gold";
  const mosqueTheme = data.mosqueTheme || "auto";

  // Palette setup
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

  // 1. Camera Zoom & Drift
  const cameraZoom = 1 + Math.sin(t * 0.15) * 0.025;
  const cameraPanY = Math.cos(t * 0.2) * (14 * scale);

  ctx.save();
  ctx.translate(W * 0.5, H * 0.5);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-W * 0.5, -H * 0.5 + cameraPanY);

  // Base luxury gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 0, H);
  baseGrad.addColorStop(0, baseTop);
  baseGrad.addColorStop(0.4, baseMid);
  baseGrad.addColorStop(0.85, baseBot);
  baseGrad.addColorStop(1, "#dfcca8");
  ctx.fillStyle = baseGrad;
  ctx.fillRect(-40 * scale, -40 * scale, W + 80 * scale, H + 80 * scale);

  // 2. Cinematic Moving Anamorphic Light Leaks & Sun Flares
  const flare1X = W * 0.3 + Math.sin(t * 0.4) * (W * 0.35);
  const flare1Y = H * 0.12 + Math.cos(t * 0.3) * (H * 0.06);
  const rad1 = W * 0.7;
  const flare1 = ctx.createRadialGradient(flare1X, flare1Y, 15 * scale, flare1X, flare1Y, rad1);
  flare1.addColorStop(0, `${lightLeak}0.42)`);
  flare1.addColorStop(0.45, `${lightLeak}0.16)`);
  flare1.addColorStop(1, `${lightLeak}0)`);
  ctx.fillStyle = flare1;
  ctx.fillRect(0, 0, W, H);

  const flare2X = W * 0.7 + Math.cos(t * 0.35) * (W * 0.25);
  const flare2Y = H * 0.82 + Math.sin(t * 0.28) * (H * 0.08);
  const rad2 = W * 0.6;
  const flare2 = ctx.createRadialGradient(flare2X, flare2Y, 20 * scale, flare2X, flare2Y, rad2);
  flare2.addColorStop(0, `${goldBright}0.28)`);
  flare2.addColorStop(0.5, `${goldBright}0.09)`);
  flare2.addColorStop(1, `${goldBright}0)`);
  ctx.fillStyle = flare2;
  ctx.fillRect(0, 0, W, H);

  // 3. Moving Royal Silk Fabric Waves / Shimmer Ribbons
  for (let wave = 0; wave < 3; wave++) {
    ctx.save();
    const waveOffset = wave * 1.8;
    const waveAlpha = 0.09 + Math.sin(t * 0.8 + wave) * 0.035;
    ctx.strokeStyle = `${goldPrimary}${waveAlpha})`;
    ctx.lineWidth = (35 + wave * 22) * scale;
    ctx.beginPath();

    const startY = H * (0.2 + wave * 0.28);
    ctx.moveTo(-30 * scale, startY + Math.sin(t * 0.7 + waveOffset) * 40 * scale);

    for (let x = 0; x <= W + 60 * scale; x += 45 * scale) {
      const y =
        startY +
        Math.sin(x * 0.005 + t * 0.9 + waveOffset) * 55 * scale +
        Math.cos(x * 0.01 - t * 0.6) * 25 * scale;
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
    ctx.lineWidth = 1.8 * scale;

    const points = 8;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([6 * scale, 6 * scale]);
    ctx.arc(0, 0, radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

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
      ctx.arc(x1, y1, 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = `${goldBright}${alpha * 1.5})`;
      ctx.fill();

      ctx.beginPath();
      ctx.quadraticCurveTo(x2, y2, x1, y1);
      ctx.stroke();
    }

    ctx.restore();
  };

  drawMandala(W * 0.5, H * 0.18, 170 * scale, 0.04, 0.13);
  drawMandala(W * 0.5, H * 0.52, 250 * scale, -0.025, 0.1);
  drawMandala(W * 0.5, H * 0.86, 200 * scale, 0.035, 0.11);

  // 5. Sacred Mosque Photographic Backdrop & Architectural Contours
  drawRealMosqueSceneBackground(ctx, W, H, scale, t, data.mosquePhotos || DEFAULT_MOSQUE_PHOTOS, {
    themeColor: data.themeColor,
    forcedMosque: data.mosqueTheme,
    displayMode: data.mosqueDisplayMode,
    opacity: data.mosquePhotoOpacity,
    blur: data.mosquePhotoBlur,
  });

  // 6. Drifting Cinematic Bokeh Orbs
  const orbCount = 14;
  for (let i = 0; i < orbCount; i++) {
    const orbSeed = i * 137.5;
    const speedY = 32 + (i % 4) * 12;
    const rawY = (orbSeed + t * speedY) % (H + 200);
    const orbY = H + 100 - rawY;
    const orbX = (W * 0.5) + Math.sin(t * 0.5 + i * 1.4) * (W * 0.44);
    const orbRadius = (28 + (i % 5) * 20) * scale;
    const orbPulse = 0.5 + Math.sin(t * 2.2 + i * 3) * 0.35;
    const orbAlpha = (0.07 + (i % 3) * 0.05) * orbPulse;

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
  const sparkleCount = 26;
  for (let i = 0; i < sparkleCount; i++) {
    const speed = 45 + (i % 5) * 18;
    const py = (H + 80) - ((i * 127 + t * speed) % (H + 160));
    const px = (W * 0.08) + ((i * 243.3) % (W * 0.84)) + Math.sin(t * 1.2 + i) * 25 * scale;
    const twinkle = Math.max(0, Math.sin(t * 3.5 + i * 2.1));
    const starSize = (3.5 + (i % 3) * 2.8) * twinkle * scale;
    const alpha = twinkle * 0.85;

    if (alpha > 0.05) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(t * 0.5 + i);
      ctx.fillStyle = `${goldBright}${alpha})`;

      ctx.beginPath();
      ctx.moveTo(0, -starSize * 2.5);
      ctx.quadraticCurveTo(0, 0, starSize * 2.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, starSize * 2.5);
      ctx.quadraticCurveTo(0, 0, -starSize * 2.5, 0);
      ctx.quadraticCurveTo(0, 0, 0, -starSize * 2.5);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, starSize * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  // 7. Floating Royal Champagne Rose Petals (3D Tumble)
  const petalCount = 8;
  for (let i = 0; i < petalCount; i++) {
    const pSpeedY = 40 + (i % 3) * 15;
    const rawY = (i * 180 + t * pSpeedY) % (H + 120);
    const py = rawY - 60;
    const px = (W * 0.15) + ((i * 220) % (W * 0.7)) + Math.sin(t * 0.8 + i) * 50 * scale;
    const rot = t * (0.8 + i * 0.2) + i;
    const tumbleScaleX = Math.cos(t * 1.5 + i * 2);
    const pSize = (14 + (i % 3) * 6) * scale;
    const pAlpha = 0.22 + Math.sin(t + i) * 0.09;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.scale(tumbleScaleX, 1);

    ctx.fillStyle = `${goldBright}${pAlpha})`;
    ctx.strokeStyle = `${goldPrimary}${pAlpha * 1.4})`;
    ctx.lineWidth = 1.2 * scale;
    ctx.beginPath();
    ctx.moveTo(0, -pSize);
    ctx.bezierCurveTo(pSize * 0.9, -pSize * 0.5, pSize * 0.9, pSize * 0.6, 0, pSize);
    ctx.bezierCurveTo(-pSize * 0.9, pSize * 0.6, -pSize * 0.9, -pSize * 0.5, 0, -pSize);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore(); // Restore camera transform

  // Subtle edge golden vignette
  const edgeVignette = ctx.createRadialGradient(W * 0.5, H * 0.5, W * 0.4, W * 0.5, H * 0.5, W * 0.78);
  edgeVignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  edgeVignette.addColorStop(0.7, `${goldPrimary}0.05)`);
  edgeVignette.addColorStop(1, `${goldPrimary}0.2)`);
  ctx.fillStyle = edgeVignette;
  ctx.fillRect(0, 0, W, H);
}

/**
 * Core Video Exporter that records canvas + audio stream and produces a downloaded video file (.mp4 / .webm).
 */
export async function exportInvitationVideo(
  data: InvitationData,
  options: VideoExportOptions = {}
): Promise<{ success: boolean; filename: string; blobUrl?: string; error?: string }> {
  const defaultDuration =
    data.templateStyle === "oliveRusticTablescape"
      ? 38.0
      : data.templateStyle === "goldenBokeh"
      ? 54.0
      : data.templateStyle === "baroqueTablescape"
      ? 34.0
      : data.templateStyle === "calligraphyPen"
      ? 42.0
      : 24.0;
  const duration = options.duration || defaultDuration;
  const width = options.width || 720;
  const height = options.height || 1280;
  const fps = options.fps || 30;
  const includeAudio = options.includeAudio !== false;

  // 1. Preload sacred mosque high-res photography & portrait images
  options.onProgress?.(0.02, "Loading sacred mosque photography & portraits...");
  try {
    await Promise.all([
      preloadMosquePhotoSet(data.mosquePhotos || DEFAULT_MOSQUE_PHOTOS),
      preloadPortraitImages([
        data.bridePhotoUrl || DEFAULT_BRIDE_PHOTO,
        data.groomPhotoUrl || DEFAULT_GROOM_PHOTO,
        ...(data.calligraphyCustomBgUrl ? [data.calligraphyCustomBgUrl] : []),
      ]),
    ]);
  } catch (e) {
    console.warn("Asset preloading warning:", e);
  }

  // 2. Create off-screen canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    return { success: false, filename: "", error: "Could not initialize 2D canvas context" };
  }

  // 2. Setup video stream from canvas
  const canvasStream = canvas.captureStream(fps);

  // 3. Setup optional audio stream
  let audioDest: MediaStreamAudioDestinationNode | null = null;
  let combinedStream: MediaStream = canvasStream;

  if (includeAudio) {
    try {
      audioDest = weddingAudio.getAudioStreamDestination();
      if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
        combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...audioDest.stream.getAudioTracks(),
        ]);
      }
    } catch (e) {
      console.warn("Audio stream capture not supported or blocked", e);
    }
  }

  // 4. Select supported mime type
  const { mimeType, extension } = getSupportedVideoMimeType();

  let mediaRecorder: MediaRecorder;
  try {
    mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 3_500_000, // High quality 3.5 Mbps
    });
  } catch {
    // Fallback without bitrate
    mediaRecorder = new MediaRecorder(combinedStream);
  }

  const recordedChunks: Blob[] = [];
  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  const filename = `Wedding_Fatiha_Invitation_${data.groomName.split(" ")[0]}_and_${data.brideName.split(" ")[0]}.${extension}`;

  return new Promise((resolve) => {
    mediaRecorder.onstop = () => {
      weddingAudio.stopBackgroundHarp();
      weddingAudio.clearAudioStreamDestination();

      const blob = new Blob(recordedChunks, { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);

      // Trigger automatic browser download
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      resolve({
        success: true,
        filename,
        blobUrl,
      });
    };

    // Start recorder
    mediaRecorder.start(100);

    // Play chime and harp into destination
    if (includeAudio) {
      weddingAudio.setMuted(false);
      weddingAudio.playEnvelopeSwoosh();
      weddingAudio.startBackgroundHarp();
    }

    // Render loop
    const startTime = performance.now();
    let currentProgress = 0;

    const intervalId = window.setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      currentProgress = Math.min(100, Math.round((elapsed / duration) * 100));

      let stageText = "Rendering video scene...";
      if (data.templateStyle === "oliveRusticTablescape") {
        if (elapsed < 3.2) stageText = "Rendering Aesthetic Tablescape Pan & Intro...";
        else if (elapsed < 6.5) stageText = "Rendering Flat-Lay Bismillah Card on Silk...";
        else if (elapsed < 9.8) stageText = "Rendering Gold Wire Arch 'Hold Our Date'...";
        else if (elapsed < 14.5) stageText = "Rendering Botanical Olive Main Invitation Card...";
        else if (elapsed < 18.2) stageText = "Rendering Dark Olive Arched Ceremony Sign...";
        else if (elapsed < 22.0) stageText = "Rendering Venue Rounded Pill Card...";
        else if (elapsed < 25.5) stageText = "Rendering 'And We Created You in Pairs' Card...";
        else if (elapsed < 29.5) stageText = "Rendering Vintage Open Book with Pampas Grass...";
        else if (elapsed < 33.0) stageText = "Rendering Arched Ceremony Schedule...";
        else if (elapsed < 35.5) stageText = "Rendering Main Invitation Botanical Close-up...";
        else stageText = "Rendering 'Insha Allah' Finale & Golden Blessing...";
      } else if (data.templateStyle === "baroqueTablescape") {
        if (elapsed < 3.8) stageText = "Rendering White Ceramic Wedding Arch...";
        else if (elapsed < 7.0) stageText = "Rendering Groom's Round Medallion...";
        else if (elapsed < 10.2) stageText = "Rendering Bride's Round Medallion...";
        else if (elapsed < 13.5) stageText = "Rendering 'We Have Decided on Forever' Plaque...";
        else if (elapsed < 17.0) stageText = "Rendering Gold Easel & Quranic Verse...";
        else if (elapsed < 19.5) stageText = "Rendering Antique Baroque Swivel Mirror...";
        else if (elapsed < 23.5) stageText = "Rendering Golden Desktop Frame with Glowing Heart...";
        else if (elapsed < 26.5) stageText = "Rendering Royal Monogram Crest Plinth...";
        else if (elapsed < 30.5) stageText = "Rendering Flat-Lay Gold Filigree Tray Card...";
        else if (elapsed < 32.5) stageText = "Rendering Valima / Reception Gold Easel...";
        else stageText = "Rendering Palace Archway & Finale...";
      } else if (data.templateStyle === "goldenBokeh") {
        if (elapsed < 5.8) stageText = "Rendering Sparkling Heart & Title...";
        else if (elapsed < 11.8) stageText = "Rendering The Big Day & Families...";
        else if (elapsed < 18.2) stageText = "Rendering Bride Spotlight...";
        else if (elapsed < 24.8) stageText = "Rendering Groom Spotlight...";
        else if (elapsed < 31.8) stageText = "Rendering Romantic Love Story Quote...";
        else if (elapsed < 39.8) stageText = "Rendering Ceremony & Interlocking Rings...";
        else if (elapsed < 47.2) stageText = "Rendering Reception & Walima Frame...";
        else stageText = "Rendering Royal Monogram Seal & RSVP...";
      } else if (data.templateStyle === "calligraphyPen") {
        if (elapsed < 10.8) stageText = "Writing Host Families & Invitation with Pen...";
        else if (elapsed < 17.5) stageText = "Writing Wedding Fatiha Title...";
        else if (elapsed < 26.5) stageText = "Writing Groom & Bride Names...";
        else if (elapsed < 35.8) stageText = "Writing Date, Time & Venue Details...";
        else stageText = "Writing Courtesy & RSVP Contacts...";
      } else {
        if (elapsed < 3.2) stageText = "Rendering Envelope Opening...";
        else if (elapsed < 8.2) stageText = "Rendering Host Families Scene...";
        else if (elapsed < 13.8) stageText = "Rendering Groom & Bride Announcement...";
        else if (elapsed < 18.8) stageText = "Rendering Schedule, Venue & Reception...";
        else stageText = "Rendering Grand Finale & RSVP Contacts...";
      }

      if (options.onProgress) {
        options.onProgress(currentProgress, stageText);
      }

      // Draw frame
      renderInvitationFrame(ctx, width, height, elapsed, data);

      // Check if finished
      if (elapsed >= duration) {
        clearInterval(intervalId);
        if (options.onProgress) {
          options.onProgress(100, "Packaging video file...");
        }
        setTimeout(() => {
          if (mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
          }
        }, 400);
      }
    }, 1000 / fps);
  });
}
