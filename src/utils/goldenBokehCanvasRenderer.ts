import { InvitationData } from "../types";
import { DEFAULT_BRIDE_PHOTO, DEFAULT_GROOM_PHOTO } from "../components/GoldenBokehPlayer";
import {
  getCachedMosqueImage,
  loadMosqueImage,
  DEFAULT_MOSQUE_PHOTOS,
} from "./mosqueImageLoader";

// Simple image cache for bride & groom portrait photos in canvas export
const imageCache = new Map<string, HTMLImageElement>();

export function getCachedPortraitImage(url: string): HTMLImageElement | null {
  const cached = imageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  if (!cached) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    imageCache.set(url, img);
  }
  return null;
}

export function preloadPortraitImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          if (!url) return resolve();
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            imageCache.set(url, img);
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = url;
        })
    )
  );
}

/**
 * Renders a single frame of the Cinematic Golden Bokeh template onto an off-screen canvas at time `t`.
 * Total Duration: ~54 seconds.
 */
export function renderGoldenBokehVideoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  // 1. CLEAR & CAMERA ZOOM
  ctx.save();
  const cameraZoom = 1 + (t % 54) * 0.0015;
  ctx.translate(W * 0.5, H * 0.5);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-W * 0.5, -H * 0.5);

  // Background backdrop preset & custom photo integration
  const bgPreset = data.calligraphyBgPreset || "nabawi";
  const bgOpacity = data.calligraphyBgOpacity !== undefined ? data.calligraphyBgOpacity : 0.65;

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

  // Draw base tone
  if (bgPreset === "emerald") {
    const emGrad = ctx.createLinearGradient(0, 0, 0, H);
    emGrad.addColorStop(0, "#0e2417");
    emGrad.addColorStop(0.6, "#08170f");
    emGrad.addColorStop(1, "#040c08");
    ctx.fillStyle = emGrad;
    ctx.fillRect(0, 0, W, H);
  } else if (bgPreset === "parchment") {
    const parchGrad = ctx.createLinearGradient(0, 0, 0, H);
    parchGrad.addColorStop(0, "#2a221b");
    parchGrad.addColorStop(0.6, "#1c1611");
    parchGrad.addColorStop(1, "#0f0b08");
    ctx.fillStyle = parchGrad;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = "#0a0604";
    ctx.fillRect(0, 0, W, H);
  }

  // Draw photographic backdrop if available
  if (bgImgSrc) {
    let img = getCachedMosqueImage(bgImgSrc);
    if (!img) {
      img = getCachedPortraitImage(bgImgSrc);
    }
    if (!img) {
      loadMosqueImage(bgImgSrc);
    }
    if (img && img.naturalWidth > 0) {
      ctx.save();
      ctx.globalAlpha = bgOpacity;

      // Subtle Ken Burns slow pan/drift
      const kenBurnsScale = 1.05 + 0.02 * Math.sin(t * 0.2);
      const imgW = W * kenBurnsScale;
      const imgH = (imgW / img.naturalWidth) * img.naturalHeight;
      const renderH = Math.max(H * kenBurnsScale, imgH);
      const renderW = (renderH / img.naturalHeight) * img.naturalWidth;
      const offsetX = (W - renderW) * 0.5 + Math.sin(t * 0.2) * (8 * scale);
      const offsetY = (H - renderH) * 0.5;

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      ctx.restore();
    }
  }

  // 2. DEEP WARM CINEMATIC BACKDROP (Dark amber/chocolate velvet grading)
  const bgGrad = ctx.createRadialGradient(
    W * 0.85,
    H * 0.15,
    30 * scale,
    W * 0.5,
    H * 0.5,
    W * 0.95
  );
  if (bgImgSrc) {
    bgGrad.addColorStop(0, "rgba(68, 38, 16, 0.55)");
    bgGrad.addColorStop(0.45, "rgba(32, 18, 9, 0.72)");
    bgGrad.addColorStop(1, "rgba(10, 6, 4, 0.88)");
  } else {
    bgGrad.addColorStop(0, "#442610");
    bgGrad.addColorStop(0.45, "#201209");
    bgGrad.addColorStop(1, "#0a0604");
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-20 * scale, -20 * scale, W + 40 * scale, H + 40 * scale);

  // 3. ANAMORPHIC GOLDEN SUN FLARE IN UPPER RIGHT
  const flareX = W * 0.88;
  const flareY = H * 0.12;
  const flareGrad = ctx.createRadialGradient(
    flareX,
    flareY,
    10 * scale,
    flareX,
    flareY,
    W * 0.65
  );
  flareGrad.addColorStop(0, "rgba(255, 230, 160, 0.75)");
  flareGrad.addColorStop(0.35, "rgba(220, 165, 60, 0.35)");
  flareGrad.addColorStop(0.7, "rgba(180, 110, 30, 0.1)");
  flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, 0, W, H);

  // Anamorphic Diagonal Flare Streak
  ctx.save();
  ctx.translate(W, 0);
  ctx.rotate(-Math.PI / 4);
  const streakGrad = ctx.createLinearGradient(0, 0, W * 0.8, 0);
  streakGrad.addColorStop(0, "rgba(255, 235, 180, 0.35)");
  streakGrad.addColorStop(0.6, "rgba(220, 160, 50, 0.15)");
  streakGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = streakGrad;
  ctx.fillRect(0, -30 * scale, W * 0.9, 60 * scale);
  ctx.restore();

  // 4. DRIFTING GOLDEN BOKEH ORBS
  const orbCount = 20;
  for (let i = 0; i < orbCount; i++) {
    const seed = i * 137.5;
    const speed = 25 + (i % 5) * 12;
    const rawY = (seed + t * speed) % (H + 160 * scale);
    const orbY = H + 80 * scale - rawY;
    const wobbleX = Math.sin(t * 0.7 + i * 1.5) * (18 * scale);
    const orbX = (W * 0.08) + ((seed * 7) % (W * 0.84)) + wobbleX;
    const orbRadius = (26 + (i % 6) * 16) * scale;
    const pulse = 0.55 + Math.sin(t * 2 + i * 2.5) * 0.35;
    const alpha = (0.08 + (i % 4) * 0.05) * pulse;

    const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius);
    orbGrad.addColorStop(0, `rgba(255, 225, 150, ${alpha * 2})`);
    orbGrad.addColorStop(0.5, `rgba(230, 180, 80, ${alpha})`);
    orbGrad.addColorStop(1, "rgba(200, 140, 50, 0)");

    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. CINEMATIC LETTERBOX BARS (Top & Bottom subtle vignette)
  const topBarGrad = ctx.createLinearGradient(0, 0, 0, 65 * scale);
  topBarGrad.addColorStop(0, "rgba(0, 0, 0, 0.8)");
  topBarGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topBarGrad;
  ctx.fillRect(0, 0, W, 65 * scale);

  const botBarGrad = ctx.createLinearGradient(0, H, 0, H - 65 * scale);
  botBarGrad.addColorStop(0, "rgba(0, 0, 0, 0.8)");
  botBarGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = botBarGrad;
  ctx.fillRect(0, H - 65 * scale, W, 65 * scale);

  ctx.restore(); // restore camera transform

  // =========================================================
  // SCENE DISPATCHER
  // =========================================================
  if (t >= 0 && t < 5.8) {
    renderScene1Heart(ctx, W, H, scale, t, data);
  } else if (t >= 5.8 && t < 11.8) {
    renderScene2BigDay(ctx, W, H, scale, t - 5.8, data);
  } else if (t >= 11.8 && t < 18.2) {
    renderScene3Bride(ctx, W, H, scale, t - 11.8, data);
  } else if (t >= 18.2 && t < 24.8) {
    renderScene4Groom(ctx, W, H, scale, t - 18.2, data);
  } else if (t >= 24.8 && t < 31.8) {
    renderScene5LoveStory(ctx, W, H, scale, t - 24.8, data);
  } else if (t >= 31.8 && t < 39.8) {
    renderScene6CeremonyRings(ctx, W, H, scale, t - 31.8, data);
  } else if (t >= 39.8 && t < 47.2) {
    renderScene7FunctionBox(ctx, W, H, scale, t - 39.8, data);
  } else {
    renderScene8PresenceMonogram(ctx, W, H, scale, t - 47.2, data);
  }
}

// --------------------------------------------------------------------------
// SCENE 1: WEDDING INVITATION & ANIMATED PARTICLE HEART
// --------------------------------------------------------------------------
function renderScene1Heart(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, t / 0.6);
  const fadeOut = t > 5.0 ? Math.max(0, 1 - (t - 5.0) / 0.8) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const cx = W * 0.5;
  const cy = H * 0.48;
  const hScale = scale * 1.5;

  // Draw Animated Sparkling Heart
  const drawProgress = Math.min(1, Math.max(0, (t - 0.2) / 2.2));
  ctx.save();
  ctx.strokeStyle = "rgba(224, 187, 79, 0.85)";
  ctx.lineWidth = 2.4 * scale;
  ctx.shadowColor = "rgba(224, 187, 79, 0.7)";
  ctx.shadowBlur = 14 * scale;

  ctx.beginPath();
  // Standard parametric heart curve: x = 16 sin^3(theta), y = -(13 cos(theta) - 5 cos(2theta) - 2 cos(3theta) - cos(4theta))
  const maxAngle = Math.PI * 2 * drawProgress;
  let first = true;
  for (let a = 0; a <= maxAngle; a += 0.04) {
    const x = cx + 16 * Math.pow(Math.sin(a), 3) * (6 * hScale);
    const y =
      cy -
      (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) *
        (6 * hScale) -
      (15 * scale);
    if (first) {
      ctx.moveTo(x, y);
      first = false;
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  // Tip Sparkle Star
  if (drawProgress > 0 && drawProgress < 1) {
    const tipA = maxAngle;
    const tipX = cx + 16 * Math.pow(Math.sin(tipA), 3) * (6 * hScale);
    const tipY =
      cy -
      (13 * Math.cos(tipA) - 5 * Math.cos(2 * tipA) - 2 * Math.cos(3 * tipA) - Math.cos(4 * tipA)) *
        (6 * hScale) -
      (15 * scale);
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(tipX, tipY, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Main Script Title: Wedding Invitation
  ctx.save();
  ctx.font = `400 ${48 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f6e6b4";
  ctx.shadowColor = "rgba(224, 187, 79, 0.6)";
  ctx.shadowBlur = 16 * scale;
  ctx.fillText("Wedding Invitation", cx, cy - 10 * scale);

  // Date under heart
  ctx.font = `500 ${18 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#e6c687";
  ctx.shadowBlur = 6 * scale;
  ctx.fillText(data.eventDate || "28.04.2026", cx, cy + 90 * scale);
  ctx.restore();

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 2: THE BIG DAY • OUR WEDDING & HOST FAMILIES
// --------------------------------------------------------------------------
function renderScene2BigDay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const fadeOut = localT > 5.2 ? Math.max(0, 1 - (localT - 5.2) / 0.8) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  const cx = W * 0.5;

  // The Big Day
  ctx.font = `400 ${56 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.fillStyle = "#fff7d6";
  ctx.shadowColor = "rgba(224, 187, 79, 0.7)";
  ctx.shadowBlur = 20 * scale;
  ctx.fillText("The Big Day", cx, H * 0.36);

  // Accent Lines & OUR WEDDING
  ctx.font = `600 ${16 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${5 * scale}px`;
  ctx.fillStyle = "#ecd4a2";
  ctx.fillText(data.eventHeading?.toUpperCase() || "OUR WEDDING", cx, H * 0.43);

  // Horizontal gold lines
  ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(cx - 160 * scale, H * 0.43 - 5 * scale);
  ctx.lineTo(cx - 75 * scale, H * 0.43 - 5 * scale);
  ctx.moveTo(cx + 75 * scale, H * 0.43 - 5 * scale);
  ctx.lineTo(cx + 160 * scale, H * 0.43 - 5 * scale);
  ctx.stroke();

  // Host Families Announcement
  ctx.font = `300 ${14 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#ab9475";
  ctx.shadowBlur = 0;
  ctx.fillText(data.familyIntro || "THE FAMILIES OF", cx, H * 0.52);

  ctx.font = `600 ${22 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#f2e6cb";
  ctx.fillText(data.familyLateFather, cx, H * 0.58);

  ctx.font = `italic ${18 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#c2ab87";
  ctx.fillText("&", cx, H * 0.63);

  ctx.font = `600 ${22 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#f2e6cb";
  ctx.fillText(data.familySecondFather, cx, H * 0.68);

  ctx.font = `italic ${16 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#d6b77c";
  ctx.fillText(data.invitationPhrase || "cordially invite you to celebrate the union of", cx, H * 0.75);

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 3: BRIDE SPOTLIGHT (Photo + Name)
// --------------------------------------------------------------------------
function renderScene3Bride(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const fadeOut = localT > 5.5 ? Math.max(0, 1 - (localT - 5.5) / 0.7) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  const cx = W * 0.5;
  const cy = H * 0.42;
  const photoRadius = 110 * scale;

  // Outer Golden Halo
  ctx.save();
  const haloGrad = ctx.createRadialGradient(cx, cy, photoRadius * 0.7, cx, cy, photoRadius * 1.3);
  haloGrad.addColorStop(0, "rgba(240, 196, 92, 0.4)");
  haloGrad.addColorStop(1, "rgba(180, 120, 30, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius * 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Circular Clip & Photo Drawing (with Ken Burns subtle zoom)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius, 0, Math.PI * 2);
  ctx.clip();

  const photoUrl = data.bridePhotoUrl || DEFAULT_BRIDE_PHOTO;
  const img = getCachedPortraitImage(photoUrl);
  if (img && img.naturalWidth > 0) {
    const zoom = 1.04 + localT * 0.012;
    const destW = photoRadius * 2 * zoom;
    const destH = (destW / img.naturalWidth) * img.naturalHeight;
    ctx.drawImage(img, cx - destW * 0.5, cy - destH * 0.5, destW, destH);
  } else {
    ctx.fillStyle = "#1e150d";
    ctx.fillRect(cx - photoRadius, cy - photoRadius, photoRadius * 2, photoRadius * 2);
  }

  // Warm light sheen overlay inside photo
  const sheen = ctx.createLinearGradient(0, cy - photoRadius, 0, cy + photoRadius);
  sheen.addColorStop(0, "rgba(255, 220, 120, 0.15)");
  sheen.addColorStop(0.7, "rgba(0, 0, 0, 0)");
  sheen.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = sheen;
  ctx.fillRect(cx - photoRadius, cy - photoRadius, photoRadius * 2, photoRadius * 2);
  ctx.restore();

  // Circular Gold Ring Border
  ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
  ctx.lineWidth = 2.5 * scale;
  ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
  ctx.shadowBlur = 10 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Bride Name in Script
  ctx.font = `400 ${46 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(230, 197, 107, 0.7)";
  ctx.shadowBlur = 18 * scale;
  ctx.fillText(data.brideName || "Aisha Umar Ali", cx, H * 0.68);

  // BRIDE Label
  ctx.font = `600 ${15 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${5 * scale}px`;
  ctx.fillStyle = "#d6b77c";
  ctx.shadowBlur = 4 * scale;
  const label = data.brideNick ? `BRIDE (${data.brideNick})` : "BRIDE";
  ctx.fillText(label, cx, H * 0.74);

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 4: GROOM SPOTLIGHT (Photo + Name)
// --------------------------------------------------------------------------
function renderScene4Groom(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const fadeOut = localT > 5.5 ? Math.max(0, 1 - (localT - 5.5) / 0.8) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  const cx = W * 0.5;
  const cy = H * 0.42;
  const photoRadius = 110 * scale;

  // Outer Golden Halo
  ctx.save();
  const haloGrad = ctx.createRadialGradient(cx, cy, photoRadius * 0.7, cx, cy, photoRadius * 1.3);
  haloGrad.addColorStop(0, "rgba(240, 196, 92, 0.4)");
  haloGrad.addColorStop(1, "rgba(180, 120, 30, 0)");
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius * 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Circular Clip & Photo Drawing
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius, 0, Math.PI * 2);
  ctx.clip();

  const photoUrl = data.groomPhotoUrl || DEFAULT_GROOM_PHOTO;
  const img = getCachedPortraitImage(photoUrl);
  if (img && img.naturalWidth > 0) {
    const zoom = 1.04 + localT * 0.012;
    const destW = photoRadius * 2 * zoom;
    const destH = (destW / img.naturalWidth) * img.naturalHeight;
    ctx.drawImage(img, cx - destW * 0.5, cy - destH * 0.5, destW, destH);
  } else {
    ctx.fillStyle = "#1e150d";
    ctx.fillRect(cx - photoRadius, cy - photoRadius, photoRadius * 2, photoRadius * 2);
  }

  const sheen = ctx.createLinearGradient(0, cy - photoRadius, 0, cy + photoRadius);
  sheen.addColorStop(0, "rgba(255, 220, 120, 0.15)");
  sheen.addColorStop(0.7, "rgba(0, 0, 0, 0)");
  sheen.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = sheen;
  ctx.fillRect(cx - photoRadius, cy - photoRadius, photoRadius * 2, photoRadius * 2);
  ctx.restore();

  // Circular Gold Ring Border
  ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
  ctx.lineWidth = 2.5 * scale;
  ctx.shadowColor = "rgba(212, 175, 55, 0.5)";
  ctx.shadowBlur = 10 * scale;
  ctx.beginPath();
  ctx.arc(cx, cy, photoRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Groom Name in Script
  ctx.font = `400 ${46 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(230, 197, 107, 0.7)";
  ctx.shadowBlur = 18 * scale;
  ctx.fillText(data.groomName || "Hassan Yakubu Abubakar", cx, H * 0.68);

  // GROOM Label
  ctx.font = `600 ${15 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${5 * scale}px`;
  ctx.fillStyle = "#d6b77c";
  ctx.shadowBlur = 4 * scale;
  const label = data.groomNick ? `GROOM (${data.groomNick})` : "GROOM";
  ctx.fillText(label, cx, H * 0.74);

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 5: ROMANTIC / SACRED LOVE QUOTE
// --------------------------------------------------------------------------
function renderScene5LoveStory(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const fadeOut = localT > 6.0 ? Math.max(0, 1 - (localT - 6.0) / 0.8) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  const cx = W * 0.5;

  // A TRUE
  ctx.font = `300 ${16 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${6 * scale}px`;
  ctx.fillStyle = "#c5a059";
  ctx.fillText("A TRUE", cx, H * 0.38);

  // Love Story
  ctx.font = `400 ${64 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.fillStyle = "#fff7d6";
  ctx.shadowColor = "rgba(224, 187, 79, 0.8)";
  ctx.shadowBlur = 24 * scale;
  ctx.fillText("Love Story", cx, H * 0.46);

  // NEVER ENDS with Diamond Stars
  ctx.font = `600 ${16 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#eed6a8";
  ctx.shadowBlur = 8 * scale;
  ctx.fillText("✦  NEVER ENDS  ✦", cx, H * 0.53);

  // Sacred Quranic Verse
  ctx.font = `italic ${18 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#d6c4a5";
  ctx.fillText(data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", cx, H * 0.63);

  ctx.font = `italic ${16 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#baa382";
  ctx.fillText('"And We created you in pairs."', cx, H * 0.68);

  ctx.font = `300 ${12 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "#8e7a63";
  ctx.fillText("SURAH AN-NABA (78:8)", cx, H * 0.72);

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 6: WEDDING CEREMONY & INTERLOCKING RINGS
// --------------------------------------------------------------------------
function renderScene6CeremonyRings(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const fadeOut = localT > 7.0 ? Math.max(0, 1 - (localT - 7.0) / 0.8) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  const cx = W * 0.5;

  // Top Date
  ctx.font = `400 ${16 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${5 * scale}px`;
  ctx.fillStyle = "#d6b77c";
  ctx.fillText(`=  ${data.eventDate?.toUpperCase() || "28 APR 2026"}  =`, cx, H * 0.35);

  // WEDDING CEREMONY + Rings
  ctx.font = `600 ${24 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.fillStyle = "#f2e6cb";
  ctx.shadowColor = "rgba(224, 187, 79, 0.5)";
  ctx.shadowBlur = 10 * scale;
  ctx.fillText("WEDDING", cx - 80 * scale, H * 0.44);
  ctx.fillText("CEREMONY", cx + 80 * scale, H * 0.44);

  // Interlocking 3D Rings in center
  ctx.save();
  ctx.strokeStyle = "#e6c56b";
  ctx.lineWidth = 3.5 * scale;
  ctx.shadowColor = "rgba(230, 197, 107, 0.8)";
  ctx.shadowBlur = 12 * scale;
  ctx.beginPath();
  ctx.arc(cx - 10 * scale, H * 0.44 - 6 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx + 10 * scale, H * 0.44 - 6 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // TIME
  ctx.font = `500 ${16 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.fillStyle = "#c5a059";
  ctx.shadowBlur = 0;
  ctx.fillText(`TIME: ${data.eventTime || "10:00 AM"}`, cx, H * 0.52);

  // VENUE & ADDRESS
  ctx.font = `300 ${13 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#a89073";
  ctx.fillText("VENUE", cx, H * 0.60);

  ctx.font = `400 ${18 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#f2e6cb";
  ctx.fillText(data.venueAddress || "Grand Palace Banquet Hall, Turaki Way, Jalingo.", cx, H * 0.65);

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 7: RECEPTION & WALIMA GEOMETRIC FRAME
// --------------------------------------------------------------------------
function renderScene7FunctionBox(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const fadeOut = localT > 6.4 ? Math.max(0, 1 - (localT - 6.4) / 0.8) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  const cx = W * 0.5;
  const cy = H * 0.5;

  const boxW = 420 * scale;
  const boxH = 220 * scale;
  const x1 = cx - boxW * 0.5;
  const y1 = cy - boxH * 0.5;

  // Background box fill
  ctx.fillStyle = "rgba(24, 15, 8, 0.85)";
  ctx.fillRect(x1, y1, boxW, boxH);

  // Outer gold stroke
  ctx.strokeStyle = "rgba(197, 160, 89, 0.7)";
  ctx.lineWidth = 1.8 * scale;
  ctx.strokeRect(x1, y1, boxW, boxH);

  // Inner delicate hairline
  ctx.strokeStyle = "rgba(222, 184, 110, 0.35)";
  ctx.lineWidth = 1 * scale;
  ctx.strokeRect(x1 + 6 * scale, y1 + 6 * scale, boxW - 12 * scale, boxH - 12 * scale);

  // Ornate Corner Scrollwork
  const cornerLen = 18 * scale;
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 2.4 * scale;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(x1 - 4 * scale, y1 + cornerLen);
  ctx.lineTo(x1 - 4 * scale, y1 - 4 * scale);
  ctx.lineTo(x1 + cornerLen, y1 - 4 * scale);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(x1 + boxW + 4 * scale, y1 + cornerLen);
  ctx.lineTo(x1 + boxW + 4 * scale, y1 - 4 * scale);
  ctx.lineTo(x1 + boxW - cornerLen, y1 - 4 * scale);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(x1 - 4 * scale, y1 + boxH - cornerLen);
  ctx.lineTo(x1 - 4 * scale, y1 + boxH + 4 * scale);
  ctx.lineTo(x1 + cornerLen, y1 + boxH + 4 * scale);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(x1 + boxW + 4 * scale, y1 + boxH - cornerLen);
  ctx.lineTo(x1 + boxW + 4 * scale, y1 + boxH + 4 * scale);
  ctx.lineTo(x1 + boxW - cornerLen, y1 + boxH + 4 * scale);
  ctx.stroke();

  // Top Badge: FUNCTION
  ctx.font = `600 ${12 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.fillStyle = "#e6c56b";
  ctx.fillText("FUNCTION", cx, y1 - 8 * scale);

  // Main Function Name: Maiya & Sangeet / Walima & Reception
  ctx.font = `400 ${44 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.fillStyle = "#fff2c6";
  ctx.shadowColor = "rgba(224, 187, 79, 0.6)";
  ctx.shadowBlur = 16 * scale;
  ctx.fillText(data.goldenBokehFunctionTitle || data.receptionNote || "Walima & Reception", cx, cy - 8 * scale);

  // Sub location & date
  ctx.font = `300 ${13 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.fillStyle = "#c2ab87";
  ctx.shadowBlur = 0;
  ctx.fillText("AT OUR RESIDENCE", cx, cy + 35 * scale);

  ctx.font = `400 ${15 * scale}px 'Cormorant Garamond', serif`;
  ctx.fillStyle = "#e6c687";
  ctx.fillText(data.eventDate || "", cx, cy + 62 * scale);

  ctx.restore();
}

// --------------------------------------------------------------------------
// SCENE 8: CLOSING BLESSING & MONOGRAM SEAL
// --------------------------------------------------------------------------
function renderScene8PresenceMonogram(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  localT: number,
  data: InvitationData
) {
  const fadeIn = Math.min(1, localT / 0.7);
  const alpha = fadeIn;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.textAlign = "center";
  const cx = W * 0.5;

  // Closing cursive message
  ctx.font = `400 ${36 * scale}px 'Great Vibes', 'Alex Brush', cursive`;
  ctx.fillStyle = "#fff7d6";
  ctx.shadowColor = "rgba(224, 187, 79, 0.7)";
  ctx.shadowBlur = 18 * scale;
  ctx.fillText("Looking forward for your precious presence", cx, H * 0.36);

  // Royal Circular Monogram Seal (matching 01:01 in video)
  const sealY = H * 0.50;
  const sealR = 54 * scale;

  // Outer dashed spinning circle
  ctx.save();
  ctx.translate(cx, sealY);
  ctx.rotate(localT * 0.2);
  ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
  ctx.lineWidth = 1.2 * scale;
  ctx.setLineDash([4 * scale, 4 * scale]);
  ctx.beginPath();
  ctx.arc(0, 0, sealR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Solid inner gold circle
  ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = "rgba(212, 175, 55, 0.6)";
  ctx.shadowBlur = 12 * scale;
  ctx.beginPath();
  ctx.arc(cx, sealY, sealR - 4 * scale, 0, Math.PI * 2);
  ctx.stroke();

  // Monogram Initials
  const gInit = data.groomName?.charAt(0) || "H";
  const bInit = data.brideName?.charAt(0) || "A";
  ctx.font = `700 ${30 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "#ffd984";
  ctx.fillText(`${gInit} & ${bInit}`, cx, sealY + 8 * scale);

  ctx.font = `600 ${9 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${3 * scale}px`;
  ctx.fillStyle = "#d4af37";
  ctx.fillText("ROYAL UNION", cx, sealY + 28 * scale);

  // RSVP Contacts
  ctx.font = `600 ${14 * scale}px 'Cinzel', serif`;
  ctx.letterSpacing = `${4 * scale}px`;
  ctx.fillStyle = "#a89073";
  ctx.shadowBlur = 0;
  ctx.fillText(data.rsvpLabel || "RSVP", cx, H * 0.68);

  ctx.font = `400 ${15 * scale}px 'Montserrat', sans-serif`;
  ctx.fillStyle = "#ecd4a2";
  ctx.fillText(data.rsvpNumbers?.join("   •   ") || "", cx, H * 0.73);

  if (data.courtesyName) {
    ctx.font = `italic ${15 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#b39e80";
    ctx.fillText(`With Best Compliments: ${data.courtesyName}`, cx, H * 0.79);
  }

  ctx.restore();
}
