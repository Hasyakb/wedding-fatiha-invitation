import { InvitationData } from "../types";

export function renderEmeraldLanternVideoFrame(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  data: InvitationData
) {
  // 1. Rich Emerald Velvet Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "#052015");
  bgGrad.addColorStop(0.5, "#02150d");
  bgGrad.addColorStop(1, "#010b07");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Central Emerald Glow
  const glow = ctx.createRadialGradient(W * 0.5, H * 0.4, 30 * scale, W * 0.5, H * 0.4, 400 * scale);
  glow.addColorStop(0, "rgba(16, 185, 129, 0.2)");
  glow.addColorStop(0.65, "rgba(4, 40, 26, 0.6)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0.95)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Arabesque Gold Borders
  ctx.save();
  ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
  ctx.lineWidth = 2 * scale;
  const m = 24 * scale;
  ctx.strokeRect(m, m, W - m * 2, H - m * 2);

  ctx.strokeStyle = "rgba(212, 175, 55, 0.25)";
  ctx.lineWidth = 1 * scale;
  const m2 = 32 * scale;
  ctx.strokeRect(m2, m2, W - m2 * 2, H - m2 * 2);
  ctx.restore();

  // 2. Hanging Lanterns on Left & Right
  const sway1 = Math.sin(t * 1.5) * 0.04;
  const sway2 = Math.cos(t * 1.3) * 0.045;
  drawHangingLantern(ctx, 80 * scale, 0, scale, sway1);
  drawHangingLantern(ctx, W - 80 * scale, 0, scale, sway2);

  // 3. Top Crescent & Bismillah
  ctx.save();
  ctx.fillStyle = "#fde047";
  ctx.shadowColor = "rgba(253, 224, 71, 0.6)";
  ctx.shadowBlur = 12 * scale;
  ctx.beginPath();
  ctx.arc(W * 0.5, 75 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#031a10";
  ctx.beginPath();
  ctx.arc(W * 0.5 + 7 * scale, 72 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (data.bismillah) {
    ctx.save();
    ctx.font = `700 ${24 * scale}px 'Amiri', 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#fef08a";
    ctx.textAlign = "center";
    ctx.fillText(data.bismillahText, W * 0.5, 125 * scale);
    ctx.restore();
  }

  // 4. Scenes on Luminous Emerald & Gold Card
  const cardW = 600 * scale;
  const cardH = 680 * scale;
  const cardX = (W - cardW) * 0.5;
  const cardY = 240 * scale;

  ctx.save();
  ctx.fillStyle = "rgba(4, 38, 25, 0.9)";
  ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
  ctx.lineWidth = 1.5 * scale;
  ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
  ctx.shadowBlur = 24 * scale;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 24 * scale);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Timeline scenes
  ctx.save();
  ctx.textAlign = "center";

  if (t < 3.5) {
    // Intro
    ctx.font = `700 ${22 * scale}px 'Cinzel', serif`;
    ctx.fillStyle = "#fde047";
    ctx.fillText("✦ BLESSED CELEBRATION ✦", W * 0.5, cardY + 260 * scale);
    ctx.font = `700 ${80 * scale}px 'Alex Brush', cursive`;
    ctx.fillStyle = "#fef3c7";
    ctx.fillText("You are Invited", W * 0.5, cardY + 380 * scale);
  } else if (t >= 3.5 && t < 8.2) {
    // Families
    ctx.font = `700 ${22 * scale}px 'Cinzel', serif`;
    ctx.fillStyle = "#fde047";
    ctx.fillText(data.familyIntro, W * 0.5, cardY + 140 * scale);
    ctx.font = `700 ${32 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.familyLateFather, W * 0.5, cardY + 220 * scale);
    ctx.font = `700 ${20 * scale}px 'Cinzel', serif`;
    ctx.fillStyle = "#fde68a";
    ctx.fillText("AND", W * 0.5, cardY + 280 * scale);
    ctx.font = `700 ${32 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.familySecondFather, W * 0.5, cardY + 340 * scale);
    ctx.font = `italic 500 ${26 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#e2d5be";
    ctx.fillText(data.invitationPhrase, W * 0.5, cardY + 420 * scale);
    ctx.font = `700 ${65 * scale}px 'Alex Brush', cursive`;
    ctx.fillStyle = "#fde047";
    ctx.fillText(data.eventHeading, W * 0.5, cardY + 520 * scale);
  } else if (t >= 8.2 && t < 13.8) {
    // Couple
    ctx.font = `700 ${22 * scale}px 'Cinzel', serif`;
    ctx.fillStyle = "#fde047";
    ctx.fillText(`✦ ${data.eventHeading.toUpperCase()} ✦`, W * 0.5, cardY + 140 * scale);
    ctx.font = `700 ${44 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.groomName, W * 0.5, cardY + 230 * scale);
    if (data.groomNick) {
      ctx.font = `italic 500 ${26 * scale}px 'Cormorant Garamond', serif`;
      ctx.fillStyle = "#fde68a";
      ctx.fillText(`(${data.groomNick})`, W * 0.5, cardY + 275 * scale);
    }
    ctx.font = `700 ${60 * scale}px 'Alex Brush', cursive`;
    ctx.fillStyle = "#fde047";
    ctx.fillText("&", W * 0.5, cardY + 370 * scale);
    ctx.font = `700 ${44 * scale}px 'Cormorant Garamond', serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(data.brideName, W * 0.5, cardY + 460 * scale);
    if (data.brideNick) {
      ctx.font = `italic 500 ${26 * scale}px 'Cormorant Garamond', serif`;
      ctx.fillStyle = "#fde68a";
      ctx.fillText(`(${data.brideNick})`, W * 0.5, cardY + 505 * scale);
    }
  } else if (t >= 13.8 && t < 18.8) {
    // Details
    ctx.font = `700 ${22 * scale}px 'Cinzel', serif`;
    ctx.fillStyle = "#fde047";
    ctx.fillText("✦ DATE & VENUE ✦", W * 0.5, cardY + 160 * scale);
    ctx.font = `600 ${28 * scale}px 'Montserrat', sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`${data.eventDate} • ${data.eventTime}`, W * 0.5, cardY + 260 * scale);
    ctx.font = `400 ${22 * scale}px 'Montserrat', sans-serif`;
    ctx.fillStyle = "#e2d5be";
    ctx.fillText(data.venueAddress, W * 0.5, cardY + 340 * scale);
    ctx.font = `700 ${50 * scale}px 'Alex Brush', cursive`;
    ctx.fillStyle = "#fde047";
    ctx.fillText(`✨ ${data.receptionNote} ✨`, W * 0.5, cardY + 470 * scale);
  } else {
    // RSVP
    ctx.font = `700 ${75 * scale}px 'Alex Brush', cursive`;
    ctx.fillStyle = "#fef3c7";
    ctx.fillText("Kindly RSVP", W * 0.5, cardY + 200 * scale);
    ctx.font = `600 ${26 * scale}px 'Montserrat', sans-serif`;
    ctx.fillStyle = "#ffffff";
    data.rsvpNumbers.forEach((num, idx) => {
      ctx.fillText(num, W * 0.5, cardY + (320 + idx * 60) * scale);
    });
  }

  ctx.restore();

  // Bottom seal
  ctx.save();
  ctx.font = `600 ${14 * scale}px 'Cinzel', serif`;
  ctx.fillStyle = "#d4af37";
  ctx.textAlign = "center";
  ctx.fillText(
    `✦ ${(data.groomNick || data.groomName).toUpperCase()} & ${(data.brideNick || data.brideName).toUpperCase()} • ${data.eventHeading.toUpperCase()} ✦`,
    W * 0.5,
    H - 24 * scale
  );
  ctx.restore();
}

function drawHangingLantern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  angle: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Chain
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 70 * scale);
  ctx.stroke();

  // Lantern Body
  ctx.translate(0, 70 * scale);
  ctx.fillStyle = "#042014";
  ctx.strokeStyle = "#d4af37";
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(-18 * scale, 0);
  ctx.lineTo(18 * scale, 0);
  ctx.lineTo(26 * scale, 35 * scale);
  ctx.lineTo(12 * scale, 75 * scale);
  ctx.lineTo(-12 * scale, 75 * scale);
  ctx.lineTo(-26 * scale, 35 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Glowing core
  ctx.fillStyle = "#fef08a";
  ctx.shadowColor = "#eab308";
  ctx.shadowBlur = 16 * scale;
  ctx.beginPath();
  ctx.arc(0, 35 * scale, 10 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
