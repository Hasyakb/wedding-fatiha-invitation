import { MosquePhotoSet } from "../types";
import { getCachedMosqueImage, loadMosqueImage } from "./mosqueImageLoader";
import { drawSceneMosqueShadow } from "./mosqueSilhouettes";

interface RenderRealMosqueOptions {
  themeColor?: string;
  forcedMosque?: string;
  displayMode?: "photo" | "silhouette" | "both" | string;
  opacity?: number; // default ~0.35
  blur?: number; // default ~1.0
}

/**
 * Renders the real mosque photographic background on canvas with cinematic Ken Burns drift,
 * soft atmospheric blending, and scene crossfades.
 */
export function drawRealMosqueSceneBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  photos?: MosquePhotoSet,
  options: RenderRealMosqueOptions = {}
) {
  const mode = options.displayMode || "both";
  const baseOpacity = options.opacity !== undefined ? options.opacity : 0.36;
  const blurPx = options.blur !== undefined ? options.blur : 1.0;
  const themeColor = options.themeColor || "gold";
  const forced = options.forcedMosque && options.forcedMosque !== "auto" ? options.forcedMosque : null;

  // If silhouette only requested, jump straight to vector silhouettes
  if (mode === "silhouette" || !photos) {
    drawSceneMosqueShadow(ctx, W, H, scale, t, themeColor, options.forcedMosque);
    return;
  }

  // Scene mapping:
  // 0.0s - 3.5s: Opening & Welcome -> nabawi
  // 3.5s - 8.2s: Families -> haram
  // 8.2s - 13.8s: The Couple -> nabawi
  // 13.8s - 18.8s: Venue & Details -> aqsa
  // 18.8s - 26.0s: RSVP & Finale -> zayed
  const sceneTimeline: { start: number; end: number; key: keyof MosquePhotoSet }[] = [
    { start: 0.0, end: 3.5, key: "nabawi" },
    { start: 3.5, end: 8.2, key: "haram" },
    { start: 8.2, end: 13.8, key: "nabawi" },
    { start: 13.8, end: 18.8, key: "aqsa" },
    { start: 18.8, end: 26.0, key: "zayed" },
  ];

  const FADE_DUR = 0.8; // 800ms crossfade duration

  // Helper to draw single image with Ken Burns pan & zoom
  const renderSinglePhoto = (
    imgKey: keyof MosquePhotoSet,
    alpha: number,
    sceneTimeOffset: number
  ) => {
    if (alpha <= 0.01) return;
    const src = photos[imgKey];
    if (!src) return;

    let img = getCachedMosqueImage(src);
    if (!img) {
      // Trigger lazy load
      loadMosqueImage(src);
      // While loading, fallback to vector silhouette
      drawSceneMosqueShadow(ctx, W, H, scale, t, themeColor, imgKey);
      return;
    }

    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, alpha * baseOpacity));

    // Optional subtle blur for cinematic depth of field
    if (blurPx > 0 && typeof ctx.filter !== "undefined") {
      ctx.filter = `blur(${blurPx * scale}px)`;
    }

    // Ken Burns slow zoom (1.0 to 1.07) & subtle drift
    const kenBurnsScale = 1.02 + Math.sin(sceneTimeOffset * 0.18) * 0.035;
    const panX = Math.sin(sceneTimeOffset * 0.12) * (14 * scale);
    const panY = Math.cos(sceneTimeOffset * 0.14) * (10 * scale);

    const targetW = W * kenBurnsScale;
    const targetH = H * kenBurnsScale;
    const drawX = (W - targetW) / 2 + panX;
    const drawY = (H - targetH) / 2 + panY;

    // Draw the image filling the canvas with cover
    const nw = img.naturalWidth || 720;
    const nh = img.naturalHeight || 1280;
    const imgAspect = nw / nh;
    const canvasAspect = W / H;

    let sx = 0;
    let sy = 0;
    let sw = nw;
    let sh = nh;

    if (imgAspect > canvasAspect) {
      // Image is wider than canvas -> crop sides
      sw = nh * canvasAspect;
      sx = (nw - sw) / 2;
    } else {
      // Image is taller than canvas -> crop bottom/top with center-high bias for domes
      sh = nw / canvasAspect;
      sy = Math.max(0, (nh - sh) * 0.28);
    }

    ctx.drawImage(img, sx, sy, sw, sh, drawX, drawY, targetW, targetH);
    ctx.restore();
  };

  if (forced) {
    const key = forced as keyof MosquePhotoSet;
    renderSinglePhoto(key, 1.0, t);
  } else {
    // Determine active scenes and crossfades
    for (let i = 0; i < sceneTimeline.length; i++) {
      const sc = sceneTimeline[i];
      if (t >= sc.start && t < sc.end) {
        const sceneProgress = t - sc.start;
        const remaining = sc.end - t;

        // Check if in transition to next scene
        if (remaining < FADE_DUR && i < sceneTimeline.length - 1) {
          const fadeProgress = 1 - remaining / FADE_DUR; // 0 to 1
          const nextScene = sceneTimeline[i + 1];
          renderSinglePhoto(sc.key, 1 - fadeProgress, sceneProgress);
          renderSinglePhoto(nextScene.key, fadeProgress, fadeProgress * FADE_DUR);
        } else {
          renderSinglePhoto(sc.key, 1.0, sceneProgress);
        }
        break;
      }
    }
  }

  // Atmospheric radial vignette & warm gold light wash to blend the photo into the parchment canvas
  ctx.save();
  const grad = ctx.createRadialGradient(
    W * 0.5,
    H * 0.5,
    W * 0.25,
    W * 0.5,
    H * 0.5,
    W * 0.85
  );

  if (themeColor === "roseGold") {
    grad.addColorStop(0, "rgba(253, 249, 247, 0.0)");
    grad.addColorStop(0.65, "rgba(251, 243, 240, 0.45)");
    grad.addColorStop(1, "rgba(242, 222, 215, 0.88)");
  } else if (themeColor === "emeraldGold") {
    grad.addColorStop(0, "rgba(250, 252, 248, 0.0)");
    grad.addColorStop(0.65, "rgba(244, 249, 242, 0.45)");
    grad.addColorStop(1, "rgba(224, 238, 222, 0.88)");
  } else {
    // Palace Gold
    grad.addColorStop(0, "rgba(253, 250, 244, 0.0)");
    grad.addColorStop(0.65, "rgba(251, 246, 236, 0.45)");
    grad.addColorStop(1, "rgba(242, 230, 208, 0.88)");
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // If "both" mode is selected, also overlay the subtle golden architectural silhouette lines!
  if (mode === "both") {
    ctx.save();
    ctx.globalAlpha = 0.65;
    drawSceneMosqueShadow(ctx, W, H, scale, t, themeColor, options.forcedMosque);
    ctx.restore();
  }
}
