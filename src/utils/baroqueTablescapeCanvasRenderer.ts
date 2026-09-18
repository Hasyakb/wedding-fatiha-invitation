import { InvitationData } from "../types";
import { getCoupleMonogram } from "./monogramHelper";

/**
 * High-Performance Offscreen Canvas Renderer for the Baroque Tablescape Template
 * Renders all 11 luxury vanity scenes in 9:16 vertical video aspect ratio.
 */
export function renderBaroqueTablescapeVideoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  // 1. CLEAR & CAMERA ZOOM BREATHING
  ctx.save();
  const cameraZoom = 1 + (t % 34) * 0.0018;
  ctx.translate(W * 0.5, H * 0.5);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-W * 0.5, -H * 0.5);

  // 2. ULTRA-LUXURY WHITE SATIN & GOLD CANDLELIGHT TABLESCAPE BACKDROP
  const bgGrad = ctx.createRadialGradient(
    W * 0.5,
    H * 0.3,
    50 * scale,
    W * 0.5,
    H * 0.5,
    W * 0.85
  );
  bgGrad.addColorStop(0, "#ffffff");
  bgGrad.addColorStop(0.35, "#fbf7f0");
  bgGrad.addColorStop(0.7, "#efe7db");
  bgGrad.addColorStop(1, "#dfd4c4");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-20 * scale, -20 * scale, W + 40 * scale, H + 40 * scale);

  // Warm Amber Candlelight Flare in Upper Right
  const candleFlare = ctx.createRadialGradient(
    W * 0.82,
    H * 0.1,
    10 * scale,
    W * 0.82,
    H * 0.1,
    W * 0.55
  );
  candleFlare.addColorStop(0, "rgba(255, 215, 120, 0.45)");
  candleFlare.addColorStop(0.5, "rgba(245, 170, 60, 0.15)");
  candleFlare.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = candleFlare;
  ctx.fillRect(0, 0, W, H);

  // Subtle Silver Crystal Candelabra Sparkle in Upper Left
  const silverFlare = ctx.createRadialGradient(
    W * 0.18,
    H * 0.12,
    10 * scale,
    W * 0.18,
    H * 0.12,
    W * 0.45
  );
  silverFlare.addColorStop(0, "rgba(255, 245, 230, 0.4)");
  silverFlare.addColorStop(0.5, "rgba(220, 210, 200, 0.12)");
  silverFlare.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = silverFlare;
  ctx.fillRect(0, 0, W, H);

  // 3. TABLE MOTIFS (Candle tapers, silver tray reflection, white peonies)
  // Bottom silver vanity tray arc
  ctx.save();
  ctx.fillStyle = "rgba(216, 208, 196, 0.5)";
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.96, W * 0.42, 22 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(196, 186, 168, 0.7)";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Floating dust particles
  for (let i = 0; i < 14; i++) {
    const px = W * (0.1 + ((i * 19.3) % 80) / 100);
    const py = H * (0.1 + ((i * 31.7) % 80) / 100);
    const pSize = (1.5 + (i % 3)) * scale;
    const pulse = 0.4 + 0.3 * Math.sin(t * 2 + i);
    ctx.fillStyle = `rgba(253, 233, 184, ${pulse})`;
    ctx.beginPath();
    ctx.arc(px, py, pSize, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. DATA FIELDS
  const groomDisplay = data.groomNick || data.groomName.split(" ")[0] || "Shakeeb";
  const brideDisplay = data.brideNick || data.brideName.split(" ")[0] || "Saniya";
  const groomFullName = data.groomName || "Abdul Shakeeb";
  const brideFullName = data.brideName || "Saniya";
  const dateDisplay = data.eventDate || "13 OCTOBER 2025";
  const venueDisplay = data.venueAddress || data.venueLabel || "'AMBEDKAR BHAVAN', Near Kadamandalagi Road, Byadgi";

  // Dynamic Monogram from couple's first letters (e.g. HA for Hassan & Aisha, SS for Shakeeb & Saniya)
  const monogram = getCoupleMonogram(data);

  const quranArabic = data.baroqueQuranArabic || "وَخَلَقْنَاكُمْ أَزْوَاجًا";
  const quranTranslation = data.baroqueQuranTranslation || '"And We created you in pairs"';
  const foreverTitle = data.baroqueForeverTitle || "WE HAVE DECIDED ON";
  const foreverQuote = data.baroqueForeverQuote || "Forever";
  const valimaTitle = data.baroqueValimaTitle || "Insha Allah Valima:";
  const valimaDate = data.baroqueValimaDate || "Tuesday 14 October 2025";
  const valimaVenue = data.baroqueValimaVenue || "Anjuman Shadi Sabha Mahal, Masur";

  // =========================================================================
  // SCENE 1 (0.0s - 3.8s): WHITE CERAMIC WEDDING ARCH
  // =========================================================================
  if (t >= 0 && t < 3.8) {
    const archW = W * 0.72;
    const archH = H * 0.48;
    const archX = (W - archW) * 0.5;
    const archY = H * 0.26;

    // Shadow
    ctx.fillStyle = "rgba(160, 130, 90, 0.18)";
    roundRect(ctx, archX + 8 * scale, archY + 12 * scale, archW, archH, archW * 0.5, true, false);

    // Arch base
    const archGrad = ctx.createLinearGradient(archX, archY, archX, archY + archH);
    archGrad.addColorStop(0, "#ffffff");
    archGrad.addColorStop(0.5, "#fbf9f5");
    archGrad.addColorStop(1, "#f4ede3");
    ctx.fillStyle = archGrad;
    roundRect(ctx, archX, archY, archW, archH, archW * 0.5, true, false);

    ctx.strokeStyle = "#eee5d8";
    ctx.lineWidth = 3 * scale;
    roundRect(ctx, archX, archY, archW, archH, archW * 0.5, false, true);

    // Text: "The Celebration Of"
    ctx.textAlign = "center";
    ctx.fillStyle = "#917852";
    ctx.font = `bold ${13 * scale}px 'Cinzel', serif`;
    ctx.fillText("THE CELEBRATION OF", W * 0.5, archY + archH * 0.42);

    // Text: "Wedding"
    ctx.fillStyle = "#1c150e";
    ctx.font = `bold ${58 * scale}px 'Great Vibes', cursive`;
    ctx.fillText("Wedding", W * 0.5, archY + archH * 0.58);

    // Gold divider
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    ctx.moveTo(W * 0.5 - 35 * scale, archY + archH * 0.65);
    ctx.lineTo(W * 0.5 + 35 * scale, archY + archH * 0.65);
    ctx.stroke();

    // Couple Subtitle
    ctx.fillStyle = "#695438";
    ctx.font = `600 ${14 * scale}px 'Cinzel', serif`;
    ctx.fillText(`${groomDisplay} & ${brideDisplay}`, W * 0.5, archY + archH * 0.74);
  }

  // =========================================================================
  // SCENE 2 (3.8s - 7.0s): GROOM'S ROUND GADROONED MEDALLION
  // =========================================================================
  else if (t >= 3.8 && t < 7.0) {
    const r = W * 0.28;
    const cx = W * 0.5;
    const cy = H * 0.48;

    // Medallion outer frame
    const medGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    medGrad.addColorStop(0, "#cfc5b6");
    medGrad.addColorStop(0.5, "#8f8576");
    medGrad.addColorStop(1, "#4a4237");
    ctx.fillStyle = medGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // Inner parchment face
    const innerGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    innerGrad.addColorStop(0, "#ffffff");
    innerGrad.addColorStop(0.5, "#faf6ef");
    innerGrad.addColorStop(1, "#ede3d4");
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    // Gadroon border dashes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([4 * scale, 3 * scale]);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Text: Groom
    ctx.textAlign = "center";
    ctx.fillStyle = "#8a7250";
    ctx.font = `bold ${12 * scale}px 'Cinzel', serif`;
    ctx.fillText("THE GROOM", cx, cy - 25 * scale);

    ctx.fillStyle = "#1a140d";
    ctx.font = `bold ${44 * scale}px 'Great Vibes', cursive`;
    ctx.fillText(groomDisplay, cx, cy + 18 * scale);

    ctx.fillStyle = "#715c40";
    ctx.font = `italic ${12 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(groomFullName, cx, cy + 42 * scale);
  }

  // =========================================================================
  // SCENE 3 (7.0s - 10.2s): BRIDE'S ROUND GADROONED MEDALLION
  // =========================================================================
  else if (t >= 7.0 && t < 10.2) {
    const r = W * 0.28;
    const cx = W * 0.5;
    const cy = H * 0.48;

    const medGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    medGrad.addColorStop(0, "#cfc5b6");
    medGrad.addColorStop(0.5, "#8f8576");
    medGrad.addColorStop(1, "#4a4237");
    ctx.fillStyle = medGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    const innerGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    innerGrad.addColorStop(0, "#ffffff");
    innerGrad.addColorStop(0.5, "#faf6ef");
    innerGrad.addColorStop(1, "#ede3d4");
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.84, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([4 * scale, 3 * scale]);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.textAlign = "center";
    ctx.fillStyle = "#8a7250";
    ctx.font = `bold ${12 * scale}px 'Cinzel', serif`;
    ctx.fillText("THE BRIDE", cx, cy - 25 * scale);

    ctx.fillStyle = "#1a140d";
    ctx.font = `bold ${44 * scale}px 'Great Vibes', cursive`;
    ctx.fillText(brideDisplay, cx, cy + 18 * scale);

    ctx.fillStyle = "#715c40";
    ctx.font = `italic ${12 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(brideFullName, cx, cy + 42 * scale);
  }

  // =========================================================================
  // SCENE 4 (10.2s - 13.5s): DIE-CUT SCALLOPED "DECIDED ON FOREVER" PLAQUE
  // =========================================================================
  else if (t >= 10.2 && t < 13.5) {
    const plaqueW = W * 0.72;
    const plaqueH = H * 0.28;
    const px = (W - plaqueW) * 0.5;
    const py = (H - plaqueH) * 0.5;

    // Plaque background
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, px, py, plaqueW, plaqueH, 24 * scale, true, false);

    // Double gold border
    ctx.strokeStyle = "rgba(197, 160, 89, 0.7)";
    ctx.lineWidth = 1.8 * scale;
    roundRect(ctx, px + 6 * scale, py + 6 * scale, plaqueW - 12 * scale, plaqueH - 12 * scale, 18 * scale, false, true);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
    ctx.lineWidth = 1 * scale;
    roundRect(ctx, px + 12 * scale, py + 12 * scale, plaqueW - 24 * scale, plaqueH - 24 * scale, 14 * scale, false, true);

    ctx.textAlign = "center";
    ctx.fillStyle = "#6e583c";
    ctx.font = `600 ${13 * scale}px 'Cinzel', serif`;
    ctx.fillText(foreverTitle, W * 0.5, py + plaqueH * 0.35);

    ctx.fillStyle = "#1e1710";
    ctx.font = `bold ${52 * scale}px 'Great Vibes', cursive`;
    ctx.fillText(foreverQuote, W * 0.5, py + plaqueH * 0.65);

    ctx.fillStyle = "#8a7250";
    ctx.font = `bold ${10 * scale}px 'Cinzel', serif`;
    ctx.fillText("✦ TWO SOULS • ONE DESTINY ✦", W * 0.5, py + plaqueH * 0.85);
  }

  // =========================================================================
  // SCENE 5 (13.5s - 17.0s): MINI GOLD OVAL EASEL WITH QURANIC VERSE
  // =========================================================================
  else if (t >= 13.5 && t < 17.0) {
    const rx = W * 0.35;
    const ry = H * 0.16;
    const cx = W * 0.5;
    const cy = H * 0.48;

    // Gold frame
    const goldGrad = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
    goldGrad.addColorStop(0, "#eed48f");
    goldGrad.addColorStop(0.5, "#c5a059");
    goldGrad.addColorStop(1, "#785b24");
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner white oval face
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.88, ry * 0.84, 0, 0, Math.PI * 2);
    ctx.fill();

    // Text: Arabic
    ctx.textAlign = "center";
    ctx.fillStyle = "#1c150e";
    ctx.font = `bold ${26 * scale}px 'Scheherazade New', 'Amiri', serif`;
    ctx.fillText(quranArabic, cx, cy - 8 * scale);

    // Text: English translation
    ctx.fillStyle = "#59462e";
    ctx.font = `italic ${12 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(quranTranslation, cx, cy + 22 * scale);

    ctx.fillStyle = "#8c7450";
    ctx.font = `${9 * scale}px 'Cinzel', serif`;
    ctx.fillText("SURAH AN-NABA • 78:8", cx, cy + 42 * scale);
  }

  // =========================================================================
  // SCENE 6 (17.0s - 19.5s): VINTAGE BAROQUE SWIVEL MIRROR REFLECTION
  // =========================================================================
  else if (t >= 17.0 && t < 19.5) {
    const rx = W * 0.28;
    const ry = H * 0.22;
    const cx = W * 0.5;
    const cy = H * 0.48;

    const pewterGrad = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
    pewterGrad.addColorStop(0, "#dfd7cc");
    pewterGrad.addColorStop(0.5, "#948b7e");
    pewterGrad.addColorStop(1, "#4e4539");
    ctx.fillStyle = pewterGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mirror face
    const mirrorGrad = ctx.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
    mirrorGrad.addColorStop(0, "#ede6db");
    mirrorGrad.addColorStop(0.5, "#ffffff");
    mirrorGrad.addColorStop(1, "#d6ccc0");
    ctx.fillStyle = mirrorGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.88, ry * 0.88, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "#5e4b33";
    ctx.font = `bold ${12 * scale}px 'Cinzel', serif`;
    ctx.fillText("REFLECTING LOVE", cx, cy - 15 * scale);

    ctx.fillStyle = "#1f170f";
    ctx.font = `bold ${32 * scale}px 'Great Vibes', cursive`;
    ctx.fillText(`${groomDisplay} & ${brideDisplay}`, cx, cy + 24 * scale);
  }

  // =========================================================================
  // SCENE 7 (19.5s - 23.5s): GOLDEN DESKTOP FRAME INVITATION WITH GLOW HEART
  // =========================================================================
  else if (t >= 19.5 && t < 23.5) {
    const frameW = W * 0.76;
    const frameH = H * 0.56;
    const fx = (W - frameW) * 0.5;
    const fy = (H - frameH) * 0.5;

    // Beveled gold frame
    const fGrad = ctx.createLinearGradient(fx, fy, fx, fy + frameH);
    fGrad.addColorStop(0, "#eed48f");
    fGrad.addColorStop(0.5, "#c5a059");
    fGrad.addColorStop(1, "#785b24");
    ctx.fillStyle = fGrad;
    roundRect(ctx, fx, fy, frameW, frameH, 14 * scale, true, false);

    // Inner paper
    ctx.fillStyle = "#fcf9f2";
    roundRect(ctx, fx + 8 * scale, fy + 8 * scale, frameW - 16 * scale, frameH - 16 * scale, 8 * scale, true, false);

    // Soft glowing heart
    const heartY = fy + frameH * 0.16;
    ctx.fillStyle = "rgba(244, 63, 94, 0.25)";
    ctx.beginPath();
    ctx.arc(W * 0.5, heartY, 14 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e11d48";
    ctx.font = `bold ${18 * scale}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("♥", W * 0.5, heartY + 6 * scale);

    // Bismillah
    ctx.fillStyle = "#8c7450";
    ctx.font = `bold ${15 * scale}px 'Scheherazade New', 'Amiri', serif`;
    ctx.fillText(data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", W * 0.5, fy + frameH * 0.27);

    // Intro
    ctx.fillStyle = "#705a3e";
    ctx.font = `${9 * scale}px 'Cinzel', serif`;
    ctx.fillText("TOGETHER WITH OUR FAMILIES", W * 0.5, fy + frameH * 0.35);
    ctx.fillText("CORDIALLY INVITE YOU TO CELEBRATE", W * 0.5, fy + frameH * 0.39);

    // Names
    ctx.fillStyle = "#1c150e";
    ctx.font = `bold ${19 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(groomFullName, W * 0.5, fy + frameH * 0.49);

    ctx.fillStyle = "#c5a059";
    ctx.font = `bold ${14 * scale}px sans-serif`;
    ctx.fillText("♥", W * 0.5, fy + frameH * 0.54);

    ctx.fillStyle = "#1c150e";
    ctx.font = `bold ${19 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(brideFullName, W * 0.5, fy + frameH * 0.60);

    // Date
    ctx.strokeStyle = "#d9cdba";
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(fx + 25 * scale, fy + frameH * 0.67);
    ctx.lineTo(fx + frameW - 25 * scale, fy + frameH * 0.67);
    ctx.stroke();

    ctx.fillStyle = "#1f170f";
    ctx.font = `bold ${12 * scale}px 'Cinzel', serif`;
    ctx.fillText(`ON : ${dateDisplay}`, W * 0.5, fy + frameH * 0.74);

    // Venue
    ctx.fillStyle = "#5e4b33";
    ctx.font = `${9 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(`venue: ${venueDisplay.slice(0, 48)}`, W * 0.5, fy + frameH * 0.83);
  }

  // =========================================================================
  // SCENE 8 (23.5s - 26.5s): ROYAL MONOGRAM CREST ON FLUTED MARBLE PLINTH
  // =========================================================================
  else if (t >= 23.5 && t < 26.5) {
    const plinthW = W * 0.68;
    const plinthH = H * 0.44;
    const px = (W - plinthW) * 0.5;
    const py = (H - plinthH) * 0.5;

    ctx.fillStyle = "#ffffff";
    roundRect(ctx, px, py, plinthW, plinthH, 18 * scale, true, false);

    // Gold oval frame
    const rx = plinthW * 0.32;
    const ry = plinthH * 0.36;
    const cx = W * 0.5;
    const cy = H * 0.5;

    const goldGrad = ctx.createLinearGradient(cx, cy - ry, cx, cy + ry);
    goldGrad.addColorStop(0, "#ebd188");
    goldGrad.addColorStop(0.5, "#c5a059");
    goldGrad.addColorStop(1, "#6e501b");
    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inner white disc
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 0.84, ry * 0.84, 0, 0, Math.PI * 2);
    ctx.fill();

    // Monogram letters
    ctx.textAlign = "center";
    ctx.fillStyle = "#3d2c14";
    ctx.font = `bold ${48 * scale}px 'Playfair Display', serif`;
    ctx.fillText(monogram, cx, cy + 14 * scale);

    ctx.fillStyle = "#8c7450";
    ctx.font = `${9 * scale}px 'Cinzel', serif`;
    ctx.fillText("EST. 2025", cx, cy + 34 * scale);
  }

  // =========================================================================
  // SCENE 9 (26.5s - 30.5s): FLAT-LAY GOLD FILIGREE TRAY INVITATION CARD
  // =========================================================================
  else if (t >= 26.5 && t < 30.5) {
    const trayW = W * 0.78;
    const trayH = H * 0.52;
    const tx = (W - trayW) * 0.5;
    const ty = (H - trayH) * 0.5;

    // Filigree tray rim
    const tGrad = ctx.createLinearGradient(tx, ty, tx + trayW, ty + trayH);
    tGrad.addColorStop(0, "#e0d6c5");
    tGrad.addColorStop(0.5, "#a89b88");
    tGrad.addColorStop(1, "#594e40");
    ctx.fillStyle = tGrad;
    roundRect(ctx, tx, ty, trayW, trayH, 20 * scale, true, false);

    // Card face
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, tx + 10 * scale, ty + 10 * scale, trayW - 20 * scale, trayH - 20 * scale, 12 * scale, true, false);

    ctx.textAlign = "center";
    ctx.fillStyle = "#8c7450";
    ctx.font = `bold ${14 * scale}px 'Scheherazade New', 'Amiri', serif`;
    ctx.fillText(data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", W * 0.5, ty + trayH * 0.22);

    ctx.fillStyle = "#695438";
    ctx.font = `${8 * scale}px 'Cinzel', serif`;
    ctx.fillText("IN THE NAME OF ALLAH, THE MOST BENEFICENT, THE MOST MERCIFUL", W * 0.5, ty + trayH * 0.30);

    ctx.fillStyle = "#1c150e";
    ctx.font = `bold ${18 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(groomFullName, W * 0.5, ty + trayH * 0.44);

    ctx.fillStyle = "#c5a059";
    ctx.font = `bold ${12 * scale}px sans-serif`;
    ctx.fillText("♥", W * 0.5, ty + trayH * 0.51);

    ctx.fillStyle = "#1c150e";
    ctx.font = `bold ${18 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(brideFullName, W * 0.5, ty + trayH * 0.58);

    ctx.fillStyle = "#1f170f";
    ctx.font = `bold ${11 * scale}px 'Cinzel', serif`;
    ctx.fillText(`ON : ${dateDisplay}`, W * 0.5, ty + trayH * 0.70);

    ctx.fillStyle = "#5e4b33";
    ctx.font = `${8.5 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(`venue: ${venueDisplay.slice(0, 48)}`, W * 0.5, ty + trayH * 0.80);
  }

  // =========================================================================
  // SCENE 10 (30.5s - 32.5s): VALIMA / RECEPTION GOLD EASEL
  // =========================================================================
  else if (t >= 30.5 && t < 32.5) {
    const cardW = W * 0.68;
    const cardH = H * 0.32;
    const cx = (W - cardW) * 0.5;
    const cy = (H - cardH) * 0.5;

    ctx.fillStyle = "#c5a059";
    roundRect(ctx, cx, cy, cardW, cardH, 14 * scale, true, false);

    ctx.fillStyle = "#ffffff";
    roundRect(ctx, cx + 5 * scale, cy + 5 * scale, cardW - 10 * scale, cardH - 10 * scale, 10 * scale, true, false);

    ctx.textAlign = "center";
    ctx.fillStyle = "#1f170e";
    ctx.font = `bold ${16 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(valimaTitle, W * 0.5, cy + cardH * 0.35);

    ctx.fillStyle = "#8c7450";
    ctx.font = `600 ${11 * scale}px 'Cinzel', serif`;
    ctx.fillText(`on ${valimaDate}`, W * 0.5, cy + cardH * 0.52);

    ctx.fillStyle = "#59462e";
    ctx.font = `${9.5 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillText(valimaVenue.slice(0, 45), W * 0.5, cy + cardH * 0.75);
  }

  // =========================================================================
  // SCENE 11 (32.5s - 34.0s): PALACE ARCHWAY - WALKING INTO FOREVER
  // =========================================================================
  else {
    const cardW = W * 0.68;
    const cardH = H * 0.46;
    const cx = (W - cardW) * 0.5;
    const cy = (H - cardH) * 0.5;

    ctx.fillStyle = "#ffffff";
    roundRect(ctx, cx, cy, cardW, cardH, 16 * scale, true, false);
    ctx.strokeStyle = "#d9cca8";
    ctx.lineWidth = 2 * scale;
    roundRect(ctx, cx, cy, cardW, cardH, 16 * scale, false, true);

    ctx.textAlign = "center";
    ctx.fillStyle = "#8a7250";
    ctx.font = `bold ${12 * scale}px 'Cinzel', serif`;
    ctx.fillText("TOGETHER FOREVER", W * 0.5, cy + cardH * 0.42);

    ctx.fillStyle = "#1f170f";
    ctx.font = `bold ${32 * scale}px 'Great Vibes', cursive`;
    ctx.fillText(`${groomDisplay} & ${brideDisplay}`, W * 0.5, cy + cardH * 0.60);

    ctx.fillStyle = "#715c40";
    ctx.font = `bold ${10 * scale}px 'Cinzel', serif`;
    ctx.fillText("BARAKALLAHU LAKUMA", W * 0.5, cy + cardH * 0.82);
  }

  ctx.restore();
}

/**
 * Helper to draw rounded rectangle on 2D context
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill: boolean,
  stroke: boolean
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
