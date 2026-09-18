/**
 * Procedural Vector Mosque Shadows / Silhouettes for Royal Islamic Wedding Invitation
 * Features:
 * - Masjid an-Nabawi (The Prophet's Mosque in Medina) with the iconic Green Dome & Medina Minarets
 * - Masjid al-Haram (The Holy Sanctuary in Mecca) with the Kaaba & Grand Minarets
 * - Masjid al-Aqsa & Dome of the Rock (Qubbat al-Sakhrah) with the octagonal drum & golden dome
 * - Sheikh Zayed Grand Mosque with cascading domes & quadruple minarets
 * - Smooth per-scene crossfades and subtle sacred radiant auras
 */

export type MosqueId = "nabawi" | "haram" | "aqsa" | "zayed";

export interface MosqueSceneInfo {
  name: string;
  subtitle: string;
}

export const MOSQUE_INFO: Record<MosqueId, MosqueSceneInfo> = {
  nabawi: {
    name: "Masjid an-Nabawi",
    subtitle: "Al-Madinah al-Munawwarah",
  },
  haram: {
    name: "Masjid al-Haram",
    subtitle: "Makkah al-Mukarramah",
  },
  aqsa: {
    name: "Masjid al-Aqsa",
    subtitle: "Al-Quds Ash-Sharif",
  },
  zayed: {
    name: "Grand Islamic Mosque",
    subtitle: "Sacred Architectural Heritage",
  },
};

/**
 * Helper to draw a crescent moon with finial spire
 */
function drawCrescentSpire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  spireHeight: number,
  scale: number
) {
  // Spire rod
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - spireHeight);
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  // Crescent
  const cy = y - spireHeight - r * 0.8;
  ctx.beginPath();
  ctx.arc(x, cy, r, -0.6 * Math.PI, 0.6 * Math.PI, false);
  ctx.arc(x + r * 0.45, cy, r * 0.85, 0.6 * Math.PI, -0.6 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
}

/**
 * 1. Masjid an-Nabawi (The Prophet's Mosque, Medina)
 * Featuring the iconic Green Dome (Gumbad-e-Khizra), White Dome, and Medina Minarets
 */
export function drawMasjidNabawi(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  alpha: number,
  color: string = "rgba(180, 145, 80, "
) {
  ctx.save();
  ctx.fillStyle = `${color}${alpha})`;
  ctx.strokeStyle = `${color}${alpha * 1.35})`;

  // Sacred radiant halo behind the Green Dome
  const domeRadius = 48 * scale;
  const domeX = cx - 18 * scale;
  const domeDrumY = baseY - 70 * scale;

  const aura = ctx.createRadialGradient(
    domeX,
    domeDrumY - domeRadius * 0.6,
    10 * scale,
    domeX,
    domeDrumY,
    160 * scale
  );
  aura.addColorStop(0, `${color}${alpha * 0.45})`);
  aura.addColorStop(0.6, `${color}${alpha * 0.12})`);
  aura.addColorStop(1, `${color}0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(domeX, domeDrumY, 160 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `${color}${alpha})`;

  // Lower Colonnade / Wall with arched niches
  const wallW = 320 * scale;
  const wallH = 45 * scale;
  ctx.fillRect(cx - wallW * 0.5, baseY - wallH, wallW, wallH);

  // Decorative roof battlement line
  ctx.beginPath();
  for (let x = cx - wallW * 0.5; x <= cx + wallW * 0.5; x += 12 * scale) {
    ctx.rect(x, baseY - wallH - 4 * scale, 6 * scale, 4 * scale);
  }
  ctx.fill();

  // Arched niches on wall
  ctx.fillStyle = `${color}${alpha * 0.5})`;
  for (let x = cx - wallW * 0.42; x <= cx + wallW * 0.42; x += 22 * scale) {
    ctx.beginPath();
    ctx.arc(x, baseY - 26 * scale, 5 * scale, Math.PI, 0);
    ctx.lineTo(x + 5 * scale, baseY - 4 * scale);
    ctx.lineTo(x - 5 * scale, baseY - 4 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = `${color}${alpha})`;

  // THE GREEN DOME (Gumbad-e-Khizra)
  // Dome drum (cylindrical base with arched windows)
  const drumW = 68 * scale;
  const drumH = 26 * scale;
  ctx.fillRect(domeX - drumW * 0.5, domeDrumY, drumW, drumH);

  // Dome profile (parabolic bulbous shape with high peak)
  ctx.beginPath();
  ctx.moveTo(domeX - drumW * 0.5, domeDrumY);
  ctx.bezierCurveTo(
    domeX - drumW * 0.55,
    domeDrumY - domeRadius * 0.7,
    domeX - domeRadius * 0.4,
    domeDrumY - domeRadius * 1.35,
    domeX,
    domeDrumY - domeRadius * 1.45
  );
  ctx.bezierCurveTo(
    domeX + domeRadius * 0.4,
    domeDrumY - domeRadius * 1.35,
    domeX + drumW * 0.55,
    domeDrumY - domeRadius * 0.7,
    domeX + drumW * 0.5,
    domeDrumY
  );
  ctx.closePath();
  ctx.fill();

  // Crescent Spire on Green Dome
  drawCrescentSpire(ctx, domeX, domeDrumY - domeRadius * 1.45, 3.5 * scale, 16 * scale, scale);

  // SECONDARY SILVER DOME (beside Green Dome)
  const silverX = domeX + 54 * scale;
  const silverR = 24 * scale;
  const silverDrumY = baseY - 62 * scale;
  ctx.fillRect(silverX - 16 * scale, silverDrumY, 32 * scale, 18 * scale);
  ctx.beginPath();
  ctx.arc(silverX, silverDrumY, 16 * scale, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  drawCrescentSpire(ctx, silverX, silverDrumY - 16 * scale, 2.5 * scale, 10 * scale, scale);

  // MEDINA COURTYARD FOLDING UMBRELLAS
  const drawUmbrella = (ux: number) => {
    ctx.beginPath();
    ctx.moveTo(ux, baseY - wallH);
    ctx.lineTo(ux, baseY - wallH - 32 * scale);
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Inverted triangular canopy
    ctx.beginPath();
    ctx.moveTo(ux - 16 * scale, baseY - wallH - 42 * scale);
    ctx.lineTo(ux + 16 * scale, baseY - wallH - 42 * scale);
    ctx.lineTo(ux, baseY - wallH - 32 * scale);
    ctx.closePath();
    ctx.fill();
  };

  drawUmbrella(cx - 88 * scale);
  drawUmbrella(cx + 94 * scale);

  // MEDINA MINARETS (Tall, slender, multifaceted with balconies)
  const drawMedinaMinaret = (mx: number, height: number, isRight: boolean = false) => {
    // Base tier
    const bW = 18 * scale;
    ctx.fillRect(mx - bW * 0.5, baseY - height * 0.35, bW, height * 0.35);

    // Balcony 1
    const bal1W = 24 * scale;
    ctx.fillRect(mx - bal1W * 0.5, baseY - height * 0.38, bal1W, 4 * scale);

    // Shaft tier 2
    const sW = 14 * scale;
    ctx.fillRect(mx - sW * 0.5, baseY - height * 0.7, sW, height * 0.32);

    // Balcony 2
    const bal2W = 20 * scale;
    ctx.fillRect(mx - bal2W * 0.5, baseY - height * 0.73, bal2W, 4 * scale);

    // Shaft tier 3 (Lantern)
    const lW = 10 * scale;
    ctx.fillRect(mx - lW * 0.5, baseY - height * 0.9, lW, height * 0.17);

    // Conical spire cap
    ctx.beginPath();
    ctx.moveTo(mx - lW * 0.5, baseY - height * 0.9);
    ctx.lineTo(mx + lW * 0.5, baseY - height * 0.9);
    ctx.lineTo(mx, baseY - height);
    ctx.closePath();
    ctx.fill();

    // Spire with triple globes & crescent
    drawCrescentSpire(ctx, mx, baseY - height, 3 * scale, 14 * scale, scale);
  };

  // Left & Right Minarets
  drawMedinaMinaret(cx - 138 * scale, 185 * scale, false);
  drawMedinaMinaret(cx + 138 * scale, 195 * scale, true);
  drawMedinaMinaret(cx - 172 * scale, 145 * scale, false);
  drawMedinaMinaret(cx + 172 * scale, 150 * scale, true);

  ctx.restore();
}

/**
 * 2. Masjid al-Haram (The Holy Mosque in Mecca)
 * Featuring the Holy Kaaba silhouette, soaring Haram minarets, and colonnades
 */
export function drawMasjidHaram(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  alpha: number,
  color: string = "rgba(180, 145, 80, "
) {
  ctx.save();
  ctx.fillStyle = `${color}${alpha})`;
  ctx.strokeStyle = `${color}${alpha * 1.35})`;

  // Central aura of peace
  const aura = ctx.createRadialGradient(cx, baseY - 60 * scale, 10 * scale, cx, baseY - 60 * scale, 180 * scale);
  aura.addColorStop(0, `${color}${alpha * 0.4})`);
  aura.addColorStop(0.5, `${color}${alpha * 0.12})`);
  aura.addColorStop(1, `${color}0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, baseY - 60 * scale, 180 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `${color}${alpha})`;

  // Multi-tier Colonnade Sanctuary Walls
  const wallW = 340 * scale;
  const wallH = 42 * scale;
  ctx.fillRect(cx - wallW * 0.5, baseY - wallH, wallW, wallH);

  // Arched bays of the Mataf
  ctx.fillStyle = `${color}${alpha * 0.45})`;
  for (let x = cx - wallW * 0.45; x <= cx + wallW * 0.45; x += 18 * scale) {
    if (Math.abs(x - cx) < 32 * scale) continue; // Leave center for Kaaba
    ctx.beginPath();
    ctx.arc(x, baseY - 24 * scale, 4.5 * scale, Math.PI, 0);
    ctx.lineTo(x + 4.5 * scale, baseY - 2 * scale);
    ctx.lineTo(x - 4.5 * scale, baseY - 2 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = `${color}${alpha})`;

  // THE HOLY KAABA (Centerpiece)
  const kaabaW = 44 * scale;
  const kaabaH = 50 * scale;
  const kaabaX = cx - kaabaW * 0.5;
  const kaabaY = baseY - kaabaH;

  ctx.fillRect(kaabaX, kaabaY, kaabaW, kaabaH);

  // Golden Kiswa band accent
  ctx.strokeStyle = `${color}${alpha * 2})`;
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(kaabaX, kaabaY + 12 * scale);
  ctx.lineTo(kaabaX + kaabaW, kaabaY + 12 * scale);
  ctx.stroke();

  // Golden door (Bab al-Kaaba)
  ctx.fillStyle = `${color}${alpha * 1.8})`;
  ctx.fillRect(kaabaX + kaabaW * 0.58, kaabaY + 16 * scale, 9 * scale, 18 * scale);
  ctx.fillStyle = `${color}${alpha})`;

  // HARAM TALL MINARETS (Pair of iconic soaring minarets)
  const drawHaramMinaret = (mx: number, height: number) => {
    // Base square
    const bW = 16 * scale;
    ctx.fillRect(mx - bW * 0.5, baseY - height * 0.3, bW, height * 0.3);

    // Balcony 1
    ctx.fillRect(mx - 22 * scale * 0.5, baseY - height * 0.33, 22 * scale, 4 * scale);

    // Octagonal body
    const oW = 13 * scale;
    ctx.fillRect(mx - oW * 0.5, baseY - height * 0.65, oW, height * 0.32);

    // Balcony 2
    ctx.fillRect(mx - 18 * scale * 0.5, baseY - height * 0.68, 18 * scale, 3.5 * scale);

    // Upper lantern
    const uW = 9 * scale;
    ctx.fillRect(mx - uW * 0.5, baseY - height * 0.88, uW, height * 0.2);

    // Conical spire
    ctx.beginPath();
    ctx.moveTo(mx - uW * 0.5, baseY - height * 0.88);
    ctx.lineTo(mx + uW * 0.5, baseY - height * 0.88);
    ctx.lineTo(mx, baseY - height);
    ctx.closePath();
    ctx.fill();

    drawCrescentSpire(ctx, mx, baseY - height, 3 * scale, 15 * scale, scale);
  };

  drawHaramMinaret(cx - 105 * scale, 190 * scale);
  drawHaramMinaret(cx + 105 * scale, 190 * scale);
  drawHaramMinaret(cx - 150 * scale, 155 * scale);
  drawHaramMinaret(cx + 150 * scale, 155 * scale);

  ctx.restore();
}

/**
 * 3. Masjid al-Aqsa & Dome of the Rock (Qubbat al-Sakhrah)
 * Featuring the famous octagonal arcade building, grand golden dome, and Mawazin arches
 */
export function drawMasjidAqsa(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  alpha: number,
  color: string = "rgba(180, 145, 80, "
) {
  ctx.save();
  ctx.fillStyle = `${color}${alpha})`;
  ctx.strokeStyle = `${color}${alpha * 1.35})`;

  // Radiant sacred dome glow
  const domeRadius = 46 * scale;
  const domeY = baseY - 78 * scale;

  const aura = ctx.createRadialGradient(cx, domeY - domeRadius * 0.5, 10 * scale, cx, domeY, 170 * scale);
  aura.addColorStop(0, `${color}${alpha * 0.42})`);
  aura.addColorStop(0.55, `${color}${alpha * 0.12})`);
  aura.addColorStop(1, `${color}0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, domeY, 170 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `${color}${alpha})`;

  // Octagonal base building
  const baseW = 170 * scale;
  const baseH = 48 * scale;
  ctx.fillRect(cx - baseW * 0.5, baseY - baseH, baseW, baseH);

  // Arched porticoes across the octagonal facades
  ctx.fillStyle = `${color}${alpha * 0.45})`;
  for (let x = cx - baseW * 0.42; x <= cx + baseW * 0.42; x += 16 * scale) {
    ctx.beginPath();
    ctx.arc(x, baseY - 32 * scale, 4 * scale, Math.PI, 0);
    ctx.lineTo(x + 4 * scale, baseY - 4 * scale);
    ctx.lineTo(x - 4 * scale, baseY - 4 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = `${color}${alpha})`;

  // High circular/octagonal drum
  const drumW = 78 * scale;
  const drumH = 28 * scale;
  ctx.fillRect(cx - drumW * 0.5, baseY - baseH - drumH, drumW, drumH);

  // Arched windows in drum
  ctx.fillStyle = `${color}${alpha * 0.5})`;
  for (let x = cx - drumW * 0.38; x <= cx + drumW * 0.38; x += 12 * scale) {
    ctx.beginPath();
    ctx.arc(x, baseY - baseH - drumH + 12 * scale, 3 * scale, Math.PI, 0);
    ctx.lineTo(x + 3 * scale, baseY - baseH - 4 * scale);
    ctx.lineTo(x - 3 * scale, baseY - baseH - 4 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = `${color}${alpha})`;

  // GRAND GOLDEN DOME
  const domeBaseY = baseY - baseH - drumH;
  ctx.beginPath();
  ctx.arc(cx, domeBaseY, domeRadius, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();

  // Spire & Crescent on top
  drawCrescentSpire(ctx, cx, domeBaseY - domeRadius, 4 * scale, 18 * scale, scale);

  // MAWAZIN (Freestanding arched gate colonnades flanking the podium)
  const drawMawazin = (mx: number) => {
    const mW = 55 * scale;
    const mH = 34 * scale;
    ctx.fillRect(mx - mW * 0.5, baseY - mH, mW, 5 * scale); // lintel

    // 4 columns and 3 arches
    for (let c = 0; c < 4; c++) {
      const colX = mx - mW * 0.5 + c * (mW / 3);
      ctx.fillRect(colX - 1.5 * scale, baseY - mH, 3 * scale, mH);
    }
  };

  drawMawazin(cx - 130 * scale);
  drawMawazin(cx + 130 * scale);

  // Slender Al-Aqsa historical minarets
  const drawAqsaMinaret = (mx: number, height: number) => {
    const sW = 12 * scale;
    ctx.fillRect(mx - sW * 0.5, baseY - height * 0.8, sW, height * 0.8);
    ctx.fillRect(mx - 16 * scale * 0.5, baseY - height * 0.82, 16 * scale, 3 * scale);
    ctx.fillRect(mx - 8 * scale * 0.5, baseY - height * 0.94, 8 * scale, height * 0.12);

    ctx.beginPath();
    ctx.moveTo(mx - 8 * scale * 0.5, baseY - height * 0.94);
    ctx.lineTo(mx + 8 * scale * 0.5, baseY - height * 0.94);
    ctx.lineTo(mx, baseY - height);
    ctx.closePath();
    ctx.fill();

    drawCrescentSpire(ctx, mx, baseY - height, 2.5 * scale, 10 * scale, scale);
  };

  drawAqsaMinaret(cx - 170 * scale, 155 * scale);
  drawAqsaMinaret(cx + 170 * scale, 155 * scale);

  ctx.restore();
}

/**
 * 4. Sheikh Zayed Grand Mosque / Grand Islamic Colonnade
 * Featuring cascading domes, reflection arches, and quadruple minarets
 */
export function drawGrandMosque(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  scale: number,
  alpha: number,
  color: string = "rgba(180, 145, 80, "
) {
  ctx.save();
  ctx.fillStyle = `${color}${alpha})`;
  ctx.strokeStyle = `${color}${alpha * 1.35})`;

  // Central aura
  const aura = ctx.createRadialGradient(cx, baseY - 70 * scale, 10 * scale, cx, baseY - 70 * scale, 175 * scale);
  aura.addColorStop(0, `${color}${alpha * 0.4})`);
  aura.addColorStop(0.55, `${color}${alpha * 0.12})`);
  aura.addColorStop(1, `${color}0)`);
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, baseY - 70 * scale, 175 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `${color}${alpha})`;

  // Colonnade arcade base with Moorish horseshoe arches
  const wallW = 320 * scale;
  const wallH = 40 * scale;
  ctx.fillRect(cx - wallW * 0.5, baseY - wallH, wallW, wallH);

  // Arched niches
  ctx.fillStyle = `${color}${alpha * 0.5})`;
  for (let x = cx - wallW * 0.44; x <= cx + wallW * 0.44; x += 20 * scale) {
    ctx.beginPath();
    ctx.arc(x, baseY - 24 * scale, 5 * scale, Math.PI, 0);
    ctx.lineTo(x + 5 * scale, baseY - 2 * scale);
    ctx.lineTo(x - 5 * scale, baseY - 2 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillStyle = `${color}${alpha})`;

  // TRIPLE CASCADING ONION DOMES
  // Central Major Dome
  const cR = 42 * scale;
  const cDrumY = baseY - 58 * scale;
  ctx.fillRect(cx - 32 * scale, cDrumY, 64 * scale, 18 * scale);
  ctx.beginPath();
  ctx.arc(cx, cDrumY, cR, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  drawCrescentSpire(ctx, cx, cDrumY - cR, 3.5 * scale, 16 * scale, scale);

  // Left Dome
  const leftX = cx - 58 * scale;
  const lR = 26 * scale;
  const lDrumY = baseY - 50 * scale;
  ctx.fillRect(leftX - 20 * scale, lDrumY, 40 * scale, 10 * scale);
  ctx.beginPath();
  ctx.arc(leftX, lDrumY, lR, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  drawCrescentSpire(ctx, leftX, lDrumY - lR, 2.5 * scale, 12 * scale, scale);

  // Right Dome
  const rightX = cx + 58 * scale;
  const rR = 26 * scale;
  const rDrumY = baseY - 50 * scale;
  ctx.fillRect(rightX - 20 * scale, rDrumY, 40 * scale, 10 * scale);
  ctx.beginPath();
  ctx.arc(rightX, rDrumY, rR, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  drawCrescentSpire(ctx, rightX, rDrumY - rR, 2.5 * scale, 12 * scale, scale);

  // Smaller flanking outer domes
  const drawMiniDome = (dx: number) => {
    const mR = 14 * scale;
    const mY = baseY - wallH;
    ctx.beginPath();
    ctx.arc(dx, mY, mR, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    drawCrescentSpire(ctx, dx, mY - mR, 2 * scale, 8 * scale, scale);
  };
  drawMiniDome(cx - 98 * scale);
  drawMiniDome(cx + 98 * scale);

  // Quadruple Corner Minarets
  const drawGrandMinaret = (mx: number, height: number) => {
    const sW = 12 * scale;
    ctx.fillRect(mx - sW * 0.5, baseY - height * 0.45, sW, height * 0.45);
    ctx.fillRect(mx - 18 * scale * 0.5, baseY - height * 0.48, 18 * scale, 3 * scale);
    ctx.fillRect(mx - 9 * scale * 0.5, baseY - height * 0.82, 9 * scale, height * 0.34);
    ctx.fillRect(mx - 14 * scale * 0.5, baseY - height * 0.85, 14 * scale, 3 * scale);
    ctx.fillRect(mx - 6 * scale * 0.5, baseY - height * 0.94, 6 * scale, height * 0.09);

    ctx.beginPath();
    ctx.moveTo(mx - 6 * scale * 0.5, baseY - height * 0.94);
    ctx.lineTo(mx + 6 * scale * 0.5, baseY - height * 0.94);
    ctx.lineTo(mx, baseY - height);
    ctx.closePath();
    ctx.fill();

    drawCrescentSpire(ctx, mx, baseY - height, 3 * scale, 14 * scale, scale);
  };

  drawGrandMinaret(cx - 135 * scale, 185 * scale);
  drawGrandMinaret(cx + 135 * scale, 185 * scale);
  drawGrandMinaret(cx - 165 * scale, 145 * scale);
  drawGrandMinaret(cx + 165 * scale, 145 * scale);

  ctx.restore();
}

/**
 * Master Scene-Based Shadow Mosque Renderer
 * Maps time `t` to the corresponding sacred mosque with smooth cinematic dissolve crossfades!
 *
 * Show Breakdown:
 * - Scene 0 (0.0s - 3.5s): Masjid an-Nabawi (The Prophet's Mosque, Medina)
 * - Scene 1 (3.5s - 8.2s): Masjid al-Haram (The Holy Sanctuary, Mecca)
 * - Scene 2 (8.2s - 13.8s): Masjid an-Nabawi (Grand Green Dome Focus for the Wedding Fatiha)
 * - Scene 3 (13.8s - 18.8s): Masjid al-Aqsa (Dome of the Rock, Jerusalem)
 * - Scene 4 (18.8s - 24.0s): Sheikh Zayed Grand Mosque (Abu Dhabi)
 */
export function drawSceneMosqueShadow(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  scale: number,
  t: number,
  themeColor: string = "gold",
  forcedMosque?: string
) {
  let color = "rgba(185, 145, 80, ";
  if (themeColor === "roseGold") {
    color = "rgba(188, 125, 125, ";
  } else if (themeColor === "emeraldGold") {
    color = "rgba(135, 160, 125, ";
  }

  // Base Y positioning: sits gracefully in the lower third behind text pedestal
  const baseY = H * 0.88;
  const cx = W * 0.5;

  if (forcedMosque && forcedMosque !== "auto") {
    // If pinned to a specific mosque
    const alpha = 0.22;
    if (forcedMosque === "nabawi") drawMasjidNabawi(ctx, cx, baseY, scale, alpha, color);
    else if (forcedMosque === "haram") drawMasjidHaram(ctx, cx, baseY, scale, alpha, color);
    else if (forcedMosque === "aqsa") drawMasjidAqsa(ctx, cx, baseY, scale, alpha, color);
    else if (forcedMosque === "zayed") drawGrandMosque(ctx, cx, baseY, scale, alpha, color);
    return;
  }

  // Automatic timeline-based scene mapping
  // Transition windows with crossfades
  const TRANSITION = 0.8; // 800ms smooth crossfade

  const scenes: { start: number; end: number; mosque: MosqueId }[] = [
    { start: 0.0, end: 3.5, mosque: "nabawi" }, // Scene 0: Welcome / Opening
    { start: 3.5, end: 8.2, mosque: "haram" },  // Scene 1: Families
    { start: 8.2, end: 13.8, mosque: "nabawi" }, // Scene 2: Wedding Fatiha & Couple
    { start: 13.8, end: 18.8, mosque: "aqsa" },  // Scene 3: Schedule & Venue
    { start: 18.8, end: 26.0, mosque: "zayed" }, // Scene 4: RSVP & Finale
  ];

  const maxAlpha = 0.22;

  // Find active scene
  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    if (t >= s.start && t < s.end) {
      const timeInScene = t - s.start;
      const timeLeft = s.end - t;

      // In-phase weight
      let alpha = maxAlpha;
      if (timeInScene < TRANSITION && i > 0) {
        alpha = maxAlpha * (timeInScene / TRANSITION);
        // Also draw previous scene fading out
        const prev = scenes[i - 1];
        const prevAlpha = maxAlpha * (1 - timeInScene / TRANSITION);
        renderMosque(prev.mosque, prevAlpha);
      } else if (timeLeft < TRANSITION && i < scenes.length - 1) {
        alpha = maxAlpha * (timeLeft / TRANSITION);
        // Also draw next scene fading in
        const next = scenes[i + 1];
        const nextAlpha = maxAlpha * (1 - timeLeft / TRANSITION);
        renderMosque(next.mosque, nextAlpha);
      }

      renderMosque(s.mosque, alpha);
      break;
    }
  }

  function renderMosque(id: MosqueId, a: number) {
    if (a <= 0.01) return;
    if (id === "nabawi") drawMasjidNabawi(ctx, cx, baseY, scale, a, color);
    else if (id === "haram") drawMasjidHaram(ctx, cx, baseY, scale, a, color);
    else if (id === "aqsa") drawMasjidAqsa(ctx, cx, baseY, scale, a, color);
    else if (id === "zayed") drawGrandMosque(ctx, cx, baseY, scale, a, color);
  }
}
