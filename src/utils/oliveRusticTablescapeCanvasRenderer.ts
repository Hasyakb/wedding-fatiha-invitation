import { InvitationData } from "../types";
import { getCoupleMonogram } from "./monogramHelper";

/**
 * High-Performance Offscreen Canvas Renderer for the 5th Template: Olive Rustic Tablescape
 * Renders all 11 scenes in 9:16 vertical video aspect ratio (0 to 38s).
 */
export function renderOliveRusticTablescapeVideoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  ctx.save();

  // 1. Subtle camera breathing zoom
  const cameraZoom = 1 + (t % 38) * 0.0015;
  ctx.translate(W * 0.5, H * 0.5);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-W * 0.5, -H * 0.5);

  // 2. Realistic tablescape background: white satin fabric and subtle wall gradient
  const bgGrad = ctx.createRadialGradient(
    W * 0.5,
    H * 0.25,
    40 * scale,
    W * 0.5,
    H * 0.6,
    W * 0.9
  );
  bgGrad.addColorStop(0, "#faf8f5");
  bgGrad.addColorStop(0.45, "#eee9e0");
  bgGrad.addColorStop(1, "#ded8cb");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(-20 * scale, -20 * scale, W + 40 * scale, H + 40 * scale);

  // Subtle brick line pattern in upper 40%
  ctx.strokeStyle = "rgba(200, 190, 180, 0.25)";
  ctx.lineWidth = 1 * scale;
  const brickH = 18 * scale;
  const brickW = 44 * scale;
  for (let y = 0; y < H * 0.4; y += brickH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
    const offset = (Math.floor(y / brickH) % 2) * (brickW * 0.5);
    for (let x = offset; x < W; x += brickW) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + brickH);
      ctx.stroke();
    }
  }

  // Soft satin diagonal folds
  const satinGrad = ctx.createLinearGradient(0, 0, W, H);
  satinGrad.addColorStop(0, "rgba(255, 255, 255, 0.4)");
  satinGrad.addColorStop(0.3, "rgba(220, 210, 195, 0.2)");
  satinGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.35)");
  satinGrad.addColorStop(1, "rgba(215, 205, 190, 0.25)");
  ctx.fillStyle = satinGrad;
  ctx.fillRect(0, 0, W, H);

  // Warm Amber Candlelight Glow in upper right
  const candleGlow = ctx.createRadialGradient(
    W * 0.85,
    H * 0.15,
    10 * scale,
    W * 0.85,
    H * 0.15,
    W * 0.6
  );
  candleGlow.addColorStop(0, "rgba(255, 220, 140, 0.7)");
  candleGlow.addColorStop(0.4, "rgba(240, 180, 80, 0.2)");
  candleGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = candleGlow;
  ctx.fillRect(0, 0, W, H);

  // Realistic Botanical Olive Branch & Leaf Sunlight Shadow cast across Background
  ctx.save();
  const swayX = Math.sin(t * 0.9) * 8 * scale;
  const swayY = Math.cos(t * 0.7) * 5 * scale;
  const swayAngle = Math.sin(t * 0.5) * 0.025;
  ctx.translate(swayX, swayY);
  ctx.rotate(swayAngle);
  ctx.fillStyle = "rgba(35, 50, 38, 0.30)";
  ctx.strokeStyle = "rgba(35, 50, 38, 0.30)";
  ctx.lineWidth = 14 * scale;
  ctx.lineCap = "round";

  // Main branch stem
  ctx.beginPath();
  ctx.moveTo(-20 * scale, 60 * scale);
  ctx.quadraticCurveTo(W * 0.25, H * 0.18, W * 0.45, H * 0.38);
  ctx.quadraticCurveTo(W * 0.65, H * 0.58, W * 0.85, H * 0.82);
  ctx.stroke();

  // Lateral stems
  ctx.lineWidth = 7 * scale;
  ctx.beginPath();
  ctx.moveTo(W * 0.18, H * 0.14);
  ctx.quadraticCurveTo(W * 0.32, H * 0.11, W * 0.52, H * 0.16);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(W * 0.32, H * 0.26);
  ctx.quadraticCurveTo(W * 0.52, H * 0.30, W * 0.70, H * 0.24);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(W * 0.45, H * 0.38);
  ctx.quadraticCurveTo(W * 0.55, H * 0.50, W * 0.48, H * 0.62);
  ctx.stroke();

  // Dappled Olive Leaves
  const foliageLeaves = [
    { x: W * 0.10, y: H * 0.12, rx: 28, ry: 10, a: -0.4 },
    { x: W * 0.22, y: H * 0.13, rx: 32, ry: 11, a: -0.2 },
    { x: W * 0.32, y: H * 0.12, rx: 30, ry: 11, a: -0.6 },
    { x: W * 0.44, y: H * 0.15, rx: 26, ry: 10, a: 0.2 },
    { x: W * 0.26, y: H * 0.22, rx: 32, ry: 11, a: 0.5 },
    { x: W * 0.40, y: H * 0.28, rx: 34, ry: 12, a: 0.3 },
    { x: W * 0.56, y: H * 0.29, rx: 30, ry: 11, a: 0.6 },
    { x: W * 0.66, y: H * 0.26, rx: 28, ry: 10, a: -0.2 },
    { x: W * 0.36, y: H * 0.34, rx: 35, ry: 12, a: -0.7 },
    { x: W * 0.46, y: H * 0.41, rx: 36, ry: 13, a: 0.8 },
    { x: W * 0.56, y: H * 0.43, rx: 32, ry: 11, a: -0.3 },
    { x: W * 0.50, y: H * 0.52, rx: 34, ry: 12, a: -0.4 },
    { x: W * 0.60, y: H * 0.63, rx: 36, ry: 13, a: 0.6 },
    { x: W * 0.76, y: H * 0.72, rx: 34, ry: 12, a: -0.3 },
  ];

  for (const lf of foliageLeaves) {
    ctx.beginPath();
    ctx.ellipse(lf.x, lf.y, lf.rx * scale, lf.ry * scale, lf.a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Ambient tablescape objects
  // Vanity Mirror Reflection (Upper Left)
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3 * scale;
  ctx.fillStyle = "rgba(245, 240, 230, 0.7)";
  ctx.beginPath();
  ctx.ellipse(W * 0.18, H * 0.12, 38 * scale, 55 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // White Ceramic Vase with Roses (Upper Left)
  ctx.save();
  ctx.fillStyle = "#f5f0e6";
  ctx.strokeStyle = "#e5dcce";
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.roundRect(W * 0.13, H * 0.14, 28 * scale, 50 * scale, [4 * scale, 4 * scale, 12 * scale, 12 * scale]);
  ctx.fill();
  ctx.stroke();
  // Blooming white rose circle
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(W * 0.18, H * 0.11, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#ded5c5";
  ctx.stroke();
  // Green leaf
  ctx.fillStyle = "#5a725b";
  ctx.beginPath();
  ctx.ellipse(W * 0.23, H * 0.10, 8 * scale, 4 * scale, Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tall Candle with Flame (Upper Right)
  ctx.save();
  // Candle wax
  ctx.fillStyle = "#fffcf2";
  ctx.fillRect(W * 0.82, H * 0.10, 18 * scale, 55 * scale);
  // Flickering Flame
  const flamePulse = 1 + Math.sin(t * 8) * 0.15;
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.ellipse(W * 0.85, H * 0.08, 4 * scale * flamePulse, 8 * scale * flamePulse, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.ellipse(W * 0.85, H * 0.082, 2.5 * scale * flamePulse, 5 * scale * flamePulse, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Retro Radio (Lower Left)
  ctx.save();
  ctx.fillStyle = "#faf5ea";
  ctx.strokeStyle = "#d6c7af";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.roundRect(W * 0.05, H * 0.78, 65 * scale, 45 * scale, 8 * scale);
  ctx.fill();
  ctx.stroke();
  // Speaker slats
  ctx.fillStyle = "#d6c7af";
  ctx.fillRect(W * 0.08, H * 0.82, 28 * scale, 3 * scale);
  ctx.fillRect(W * 0.08, H * 0.86, 28 * scale, 3 * scale);
  ctx.fillRect(W * 0.08, H * 0.90, 28 * scale, 3 * scale);
  // Radio Knob
  ctx.fillStyle = "#c5a059";
  ctx.beginPath();
  ctx.arc(W * 0.17, H * 0.86, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Jute Coaster (Bottom Foreground)
  ctx.save();
  ctx.fillStyle = "#b89f78";
  ctx.beginPath();
  ctx.ellipse(W * 0.5, H * 0.98, W * 0.6, 60 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#9e8560";
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // Data variables
  const groomDisplay = data.groomNick || data.groomName.split(" ")[0] || "Arshad";
  const brideDisplay = data.brideNick || data.brideName.split(" ")[0] || "Batool";
  const groomFullName = data.groomName || "MUHAMMAD ARSHAD";
  const brideFullName = data.brideName || "FATHIMA AL BATOOL";
  const dateDisplay = data.eventDate || "17TH NOVEMBER 2024";
  const venueDisplay = data.venueAddress || data.venueLabel || "@ PURAKKATTIRI JUMA MASJID";

  const monogram = data.oliveMonogram || getCoupleMonogram(data);
  const monogramSeparated = `${monogram[0] || "A"} | ${monogram[1] || "B"}`;
  const monogramAnd = `${monogram[0] || "A"}&${monogram[1] || "B"}`;

  const bismillahText = data.oliveBismillahText || data.bismillahText || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
  const quranQuote = data.oliveQuranQuote || "AND WE CREATED YOU IN PAIRS";
  const quranRef = data.oliveQuranRef || "[QURAN 78:8]";
  const nikahTime = data.oliveNikahTime || (data.eventTime ? `AT ${data.eventTime}` : "AT 04:00PM");
  const receptionTime = data.oliveReceptionTime || "AT 07:00PM";
  const receptionVenue = data.oliveReceptionVenue || (data.receptionNote ? `@ ${data.receptionNote}` : "@ FATHIMA'S HOUSE KAPPAD");
  const venueTitle = data.oliveVenueTitle || "VENUE";
  const finaleText = data.oliveFinaleText || "INSHA ALLAH";

  // Helper for drawing dark olive cards with realistic cast background shadow
  function drawOliveCard(x: number, y: number, w: number, h: number, r: number) {
    ctx.save();
    // 1. Broad soft ambient background shadow onto tablescape
    ctx.save();
    ctx.fillStyle = "rgba(8, 20, 11, 0.48)";
    ctx.shadowColor = "rgba(8, 20, 11, 0.55)";
    ctx.shadowBlur = 32 * scale;
    ctx.shadowOffsetY = 16 * scale;
    ctx.shadowOffsetX = 3 * scale;
    ctx.beginPath();
    ctx.roundRect(x + 2 * scale, y + 6 * scale, w - 4 * scale, h - 4 * scale, r);
    ctx.fill();
    ctx.restore();

    // 2. Card surface with subtle contact shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * scale;
    ctx.shadowOffsetY = 4 * scale;
    const cardGrad = ctx.createLinearGradient(x, y, x, y + h);
    cardGrad.addColorStop(0, "#243928");
    cardGrad.addColorStop(0.5, "#1c2e20");
    cardGrad.addColorStop(1, "#142318");
    ctx.fillStyle = cardGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#3e5a43";
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Inner gold border
    ctx.strokeStyle = "rgba(197, 160, 89, 0.35)";
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.roundRect(x + 5 * scale, y + 5 * scale, w - 10 * scale, h - 10 * scale, Math.max(2, r - 3 * scale));
    ctx.stroke();
    ctx.restore();
  }

  // Helper for drawing arched dark olive card with realistic background shadow
  function drawOliveArchCard(x: number, y: number, w: number, h: number) {
    ctx.save();
    // 1. Broad background shadow
    ctx.save();
    ctx.fillStyle = "rgba(8, 20, 11, 0.52)";
    ctx.shadowColor = "rgba(8, 20, 11, 0.60)";
    ctx.shadowBlur = 35 * scale;
    ctx.shadowOffsetY = 18 * scale;
    ctx.shadowOffsetX = 3 * scale;
    ctx.beginPath();
    ctx.roundRect(x + 2 * scale, y + 8 * scale, w - 4 * scale, h - 6 * scale, [w * 0.5, w * 0.5, 14 * scale, 14 * scale]);
    ctx.fill();
    ctx.restore();

    // 2. Card surface
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 12 * scale;
    ctx.shadowOffsetY = 4 * scale;
    const cardGrad = ctx.createLinearGradient(x, y, x, y + h);
    cardGrad.addColorStop(0, "#223627");
    cardGrad.addColorStop(0.5, "#1a2b1e");
    cardGrad.addColorStop(1, "#132217");
    ctx.fillStyle = cardGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, [w * 0.5, w * 0.5, 14 * scale, 14 * scale]);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "#3e5a43";
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // 4. SCENE RENDERING BASED ON TIME t (0s - 38s)
  if (t >= 0 && t < 3.2) {
    // SCENE 1: Aesthetic Tablescape Pan & Intro
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.shadowColor = "rgba(30, 50, 35, 0.12)";
    ctx.shadowBlur = 18 * scale;
    ctx.beginPath();
    ctx.roundRect(W * 0.22, H * 0.44, W * 0.56, 44 * scale, 22 * scale);
    ctx.fill();
    ctx.strokeStyle = "#d6ccb8";
    ctx.stroke();

    ctx.fillStyle = "#2c3d2e";
    ctx.font = `600 ${11 * scale}px "Cinzel", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.fillText("✦  A BEAUTIFUL UNION  ✦", W * 0.5, H * 0.44 + 26 * scale);
    ctx.restore();

  } else if (t >= 3.2 && t < 6.5) {
    // SCENE 2: Flat-lay Bismillah Card on Silk & Jute
    const cardW = W * 0.72;
    const cardH = 120 * scale;
    const cardX = (W - cardW) * 0.5;
    const cardY = H * 0.38;
    drawOliveCard(cardX, cardY, cardW, cardH, 12 * scale);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#f5ebd7";
    ctx.font = `bold ${22 * scale}px "Amiri", "Scheherazade New", serif`;
    ctx.fillText(bismillahText, W * 0.5, cardY + 54 * scale);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(W * 0.35, cardY + 70 * scale);
    ctx.lineTo(W * 0.65, cardY + 70 * scale);
    ctx.stroke();

    ctx.fillStyle = "#d4c5ab";
    ctx.font = `600 ${7.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("IN THE NAME OF ALLAH THE MOST GRACIOUS", W * 0.5, cardY + 88 * scale);
    ctx.fillText("AND THE MOST MERCIFUL", W * 0.5, cardY + 102 * scale);
    ctx.restore();

  } else if (t >= 6.5 && t < 9.8) {
    // SCENE 3: Gold Wire Arch Stand "HOLD Our DATE"
    const standW = W * 0.58;
    const standH = 220 * scale;
    const standX = (W - standW) * 0.5;
    const standY = H * 0.32;

    ctx.save();
    ctx.shadowColor = "rgba(60, 50, 30, 0.25)";
    ctx.shadowBlur = 24 * scale;
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.beginPath();
    ctx.roundRect(standX, standY, standW, standH, [standW * 0.5, standW * 0.5, 8 * scale, 8 * scale]);
    ctx.fill();
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 4 * scale;
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.fillStyle = "#8a6b2d";
    ctx.font = `bold ${26 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("HOLD", W * 0.5, standY + 95 * scale);

    ctx.fillStyle = "#6d521d";
    ctx.font = `bold ${34 * scale}px "Great Vibes", cursive`;
    ctx.fillText("Our", W * 0.5, standY + 135 * scale);

    ctx.fillStyle = "#8a6b2d";
    ctx.font = `bold ${26 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("DATE", W * 0.5, standY + 175 * scale);
    ctx.restore();

  } else if (t >= 9.8 && t < 14.5) {
    // SCENE 4: Botanical Olive Main Invitation Card
    const cardW = W * 0.76;
    const cardH = 260 * scale;
    const cardX = (W - cardW) * 0.5;
    const cardY = H * 0.26;
    drawOliveCard(cardX, cardY, cardW, cardH, 18 * scale);

    ctx.save();
    ctx.textAlign = "center";

    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${16 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(monogramAnd, W * 0.5, cardY + 34 * scale);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.4)";
    ctx.beginPath();
    ctx.moveTo(W * 0.38, cardY + 44 * scale);
    ctx.lineTo(W * 0.62, cardY + 44 * scale);
    ctx.stroke();

    ctx.fillStyle = "#b5c7b6";
    ctx.font = `600 ${7 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("IN THE NAME OF ALLAH THE MOST GRACIOUS", W * 0.5, cardY + 60 * scale);
    ctx.fillText("AND THE MOST MERCIFUL", W * 0.5, cardY + 72 * scale);

    ctx.fillStyle = "#8da890";
    ctx.font = `600 ${6.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("TOGETHER WITH OUR FAMILIES", W * 0.5, cardY + 90 * scale);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${14 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(groomFullName, W * 0.5, cardY + 120 * scale);

    ctx.fillStyle = "#eedcb8";
    ctx.font = `italic ${12 * scale}px Georgia, serif`;
    ctx.fillText("and", W * 0.5, cardY + 142 * scale);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${14 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(brideFullName, W * 0.5, cardY + 168 * scale);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.45)";
    ctx.beginPath();
    ctx.moveTo(W * 0.4, cardY + 185 * scale);
    ctx.lineTo(W * 0.6, cardY + 185 * scale);
    ctx.stroke();

    ctx.fillStyle = "#c8d9c7";
    ctx.font = `600 ${7 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("WE REQUEST THE HONOR OF YOUR PRESENCE", W * 0.5, cardY + 205 * scale);
    ctx.fillText("ON OUR NIKKAH CEREMONY", W * 0.5, cardY + 220 * scale);
    ctx.restore();

  } else if (t >= 14.5 && t < 18.2) {
    // SCENE 5: Dark Olive Arched Ceremony & Reception Sign
    const cardW = W * 0.68;
    const cardH = 280 * scale;
    const cardX = (W - cardW) * 0.5;
    const cardY = H * 0.24;
    drawOliveArchCard(cardX, cardY, cardW, cardH);

    ctx.save();
    ctx.textAlign = "center";

    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${14 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(monogramSeparated, W * 0.5, cardY + 45 * scale);

    ctx.fillStyle = "#9cb39d";
    ctx.font = `600 ${8.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(`${groomDisplay} & ${brideDisplay}`, W * 0.5, cardY + 62 * scale);

    ctx.fillStyle = "#f7f2ea";
    ctx.font = `bold ${20 * scale}px "Great Vibes", cursive`;
    ctx.fillText("Nikkah Ceremony", W * 0.5, cardY + 105 * scale);

    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${9.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(dateDisplay, W * 0.5, cardY + 128 * scale);

    ctx.fillStyle = "#a2b8a3";
    ctx.font = `600 ${8 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(nikahTime, W * 0.5, cardY + 144 * scale);

    ctx.fillStyle = "#c2d4c0";
    ctx.font = `${8 * scale}px Georgia, serif`;
    ctx.fillText(venueDisplay, W * 0.5, cardY + 162 * scale);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.35)";
    ctx.beginPath();
    ctx.moveTo(W * 0.25, cardY + 180 * scale);
    ctx.lineTo(W * 0.75, cardY + 180 * scale);
    ctx.stroke();

    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${16 * scale}px "Great Vibes", cursive`;
    ctx.fillText("Reception", W * 0.5, cardY + 208 * scale);

    ctx.fillStyle = "#a2b8a3";
    ctx.font = `600 ${7.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(receptionTime, W * 0.5, cardY + 224 * scale);

    ctx.fillStyle = "#c2d4c0";
    ctx.font = `${7.5 * scale}px Georgia, serif`;
    ctx.fillText(receptionVenue, W * 0.5, cardY + 240 * scale);
    ctx.restore();

  } else if (t >= 18.2 && t < 22.0) {
    // SCENE 6: Close-up "VENUE" Rounded Pill Card
    const pillW = W * 0.74;
    const pillH = 75 * scale;
    const pillX = (W - pillW) * 0.5;
    const pillY = H * 0.44;
    drawOliveCard(pillX, pillY, pillW, pillH, pillH * 0.5);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${13 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(venueTitle, W * 0.5, pillY + 30 * scale);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.6)";
    ctx.beginPath();
    ctx.moveTo(W * 0.4, pillY + 40 * scale);
    ctx.lineTo(W * 0.6, pillY + 40 * scale);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${9.5 * scale}px Georgia, serif`;
    ctx.fillText(venueDisplay, W * 0.5, pillY + 56 * scale);
    ctx.restore();

  } else if (t >= 22.0 && t < 25.5) {
    // SCENE 7: Miniature "AND WE CREATED YOU IN PAIRS" Card
    const cardW = W * 0.75;
    const cardH = 80 * scale;
    const cardX = (W - cardW) * 0.5;
    const cardY = H * 0.43;
    drawOliveCard(cardX, cardY, cardW, cardH, 10 * scale);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#f7f2ea";
    ctx.font = `bold ${10.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(quranQuote, W * 0.5, cardY + 38 * scale);

    ctx.fillStyle = "#eedcb8";
    ctx.font = `600 ${8.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(quranRef, W * 0.5, cardY + 58 * scale);
    ctx.restore();

  } else if (t >= 25.5 && t < 29.5) {
    // SCENE 8: Vintage Open Book with Pampas Grass & Couple Bookmark
    const bookW = W * 0.78;
    const bookH = 180 * scale;
    const bookX = (W - bookW) * 0.5;
    const bookY = H * 0.32;

    ctx.save();
    // Deep realistic background shadow cast onto table
    ctx.save();
    ctx.fillStyle = "rgba(46, 35, 22, 0.45)";
    ctx.shadowColor = "rgba(46, 35, 22, 0.55)";
    ctx.shadowBlur = 36 * scale;
    ctx.shadowOffsetY = 18 * scale;
    ctx.beginPath();
    ctx.roundRect(bookX - 4 * scale, bookY + 6 * scale, bookW + 8 * scale, bookH, 12 * scale);
    ctx.fill();
    ctx.restore();

    // Book pages
    ctx.fillStyle = "#f8f3ea";
    ctx.shadowColor = "rgba(50, 40, 25, 0.20)";
    ctx.shadowBlur = 16 * scale;
    ctx.beginPath();
    ctx.roundRect(bookX, bookY, bookW, bookH, 8 * scale);
    ctx.fill();
    ctx.strokeStyle = "#d6c9b4";
    ctx.stroke();

    // Center spine shadow
    const spineGrad = ctx.createLinearGradient(W * 0.48, bookY, W * 0.52, bookY);
    spineGrad.addColorStop(0, "rgba(0,0,0,0)");
    spineGrad.addColorStop(0.5, "rgba(70,55,40,0.2)");
    spineGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = spineGrad;
    ctx.fillRect(W * 0.46, bookY, W * 0.08, bookH);

    // Book lines
    ctx.fillStyle = "rgba(74, 59, 43, 0.25)";
    for (let i = 0; i < 7; i++) {
      ctx.fillRect(bookX + 15 * scale, bookY + (30 + i * 18) * scale, bookW * 0.38, 3 * scale);
      ctx.fillRect(bookX + bookW * 0.54, bookY + (30 + i * 18) * scale, bookW * 0.38, 3 * scale);
    }

    // Angled Olive Bookmark Card
    ctx.translate(W * 0.5, bookY + bookH * 0.5);
    ctx.rotate(-0.08);
    const bmW = W * 0.55;
    const bmH = 75 * scale;
    drawOliveCard(-bmW * 0.5, -bmH * 0.5, bmW, bmH, 8 * scale);

    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${16 * scale}px "Great Vibes", cursive`;
    ctx.fillText(groomDisplay, 0, -8 * scale);

    ctx.fillStyle = "#c5a059";
    ctx.font = `12 * scale px sans-serif`;
    ctx.fillText("♥", 0, 8 * scale);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${16 * scale}px "Great Vibes", cursive`;
    ctx.fillText(brideDisplay, 0, 26 * scale);
    ctx.restore();

  } else if (t >= 29.5 && t < 33.0) {
    // SCENE 9: Arched Ceremony Schedule (Recap)
    const cardW = W * 0.68;
    const cardH = 280 * scale;
    const cardX = (W - cardW) * 0.5;
    const cardY = H * 0.24;
    drawOliveArchCard(cardX, cardY, cardW, cardH);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${14 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(monogramSeparated, W * 0.5, cardY + 45 * scale);

    ctx.fillStyle = "#9cb39d";
    ctx.font = `600 ${8.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(`${groomDisplay} & ${brideDisplay}`, W * 0.5, cardY + 62 * scale);

    ctx.fillStyle = "#f7f2ea";
    ctx.font = `bold ${20 * scale}px "Great Vibes", cursive`;
    ctx.fillText("Nikkah Ceremony", W * 0.5, cardY + 105 * scale);

    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${9.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(dateDisplay, W * 0.5, cardY + 128 * scale);

    ctx.fillStyle = "#a2b8a3";
    ctx.font = `600 ${8 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(nikahTime, W * 0.5, cardY + 144 * scale);

    ctx.fillStyle = "#c2d4c0";
    ctx.font = `${8 * scale}px Georgia, serif`;
    ctx.fillText(venueDisplay, W * 0.5, cardY + 162 * scale);
    ctx.restore();

  } else if (t >= 33.0 && t < 35.5) {
    // SCENE 10: Botanical Main Invitation Card Close-up
    const cardW = W * 0.76;
    const cardH = 240 * scale;
    const cardX = (W - cardW) * 0.5;
    const cardY = H * 0.28;
    drawOliveCard(cardX, cardY, cardW, cardH, 18 * scale);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#eedcb8";
    ctx.font = `bold ${16 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(monogramAnd, W * 0.5, cardY + 36 * scale);

    ctx.fillStyle = "#b5c7b6";
    ctx.font = `600 ${7 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("IN THE NAME OF ALLAH THE MOST GRACIOUS", W * 0.5, cardY + 62 * scale);
    ctx.fillText("AND THE MOST MERCIFUL", W * 0.5, cardY + 74 * scale);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${14 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(groomFullName, W * 0.5, cardY + 106 * scale);

    ctx.fillStyle = "#eedcb8";
    ctx.font = `italic ${12 * scale}px Georgia, serif`;
    ctx.fillText("and", W * 0.5, cardY + 128 * scale);

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${14 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(brideFullName, W * 0.5, cardY + 154 * scale);

    ctx.fillStyle = "#c8d9c7";
    ctx.font = `600 ${7 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("WE REQUEST THE HONOR OF YOUR PRESENCE", W * 0.5, cardY + 195 * scale);
    ctx.restore();

  } else {
    // SCENE 11: "INSHA ALLAH" Pill Card & Golden Finale (35.5s - 38.0s)
    const pillW = W * 0.72;
    const pillH = 75 * scale;
    const pillX = (W - pillW) * 0.5;
    const pillY = H * 0.44;
    drawOliveCard(pillX, pillY, pillW, pillH, pillH * 0.5);

    ctx.save();
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${16 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText(finaleText, W * 0.5, pillY + 34 * scale);

    ctx.fillStyle = "#c5a059";
    ctx.font = `600 ${8.5 * scale}px "Cinzel", Georgia, serif`;
    ctx.fillText("BARAKALLAHU LAKUMA", W * 0.5, pillY + 54 * scale);
    ctx.restore();
  }

  ctx.restore();
}
