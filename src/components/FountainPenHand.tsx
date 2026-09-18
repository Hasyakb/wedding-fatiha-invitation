import React from "react";

interface FountainPenHandProps {
  x: number; // Target X coordinate for the nib tip (in pixels)
  y: number; // Target Y coordinate for the nib tip (in pixels)
  isWriting: boolean; // Whether the pen is currently writing letters
  scale?: number;
  opacity?: number;
}

export const FountainPenHand: React.FC<FountainPenHandProps> = ({
  x,
  y,
  isWriting,
  scale = 1,
  opacity = 1,
}) => {
  // Add subtle handwriting jitter when actively writing
  const jitterX = isWriting ? Math.sin(Date.now() / 60) * 1.2 : 0;
  const jitterY = isWriting ? Math.cos(Date.now() / 75) * 0.8 : 0;

  // When not writing, the pen lifts slightly (+14px right, -8px up)
  const liftOffsetX = isWriting ? 0 : 12;
  const liftOffsetY = isWriting ? 0 : -8;

  return (
    <div
      className="absolute pointer-events-none z-40 will-change-transform"
      style={{
        left: `${x + jitterX + liftOffsetX}px`,
        top: `${y + jitterY + liftOffsetY}px`,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "0px 0px",
      }}
    >
      <svg
        width="280"
        height="320"
        viewBox="0 0 280 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible select-none drop-shadow-[0_16px_24px_rgba(0,0,0,0.65)]"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="nibGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fae7b5" />
            <stop offset="35%" stopColor="#d8ab43" />
            <stop offset="70%" stopColor="#fdf3cf" />
            <stop offset="100%" stopColor="#9a7322" />
          </linearGradient>

          <linearGradient id="penBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c2826" />
            <stop offset="30%" stopColor="#141211" />
            <stop offset="70%" stopColor="#0a0909" />
            <stop offset="100%" stopColor="#1a1715" />
          </linearGradient>

          <linearGradient id="penHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>

          {/* Skin Tone Gradients */}
          <linearGradient id="skinTone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8b28f" />
            <stop offset="40%" stopColor="#d39169" />
            <stop offset="85%" stopColor="#b67149" />
            <stop offset="100%" stopColor="#91522f" />
          </linearGradient>

          <linearGradient id="skinHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f3c6a6" />
            <stop offset="100%" stopColor="#d39169" />
          </linearGradient>

          {/* Glow filter for active ink tip */}
          <filter id="inkGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- INK SPARKLE AT NIB TIP --- */}
        {isWriting && (
          <g filter="url(#inkGlow)">
            <circle cx="0" cy="0" r="2.5" fill="#fdf3cf" opacity="0.9" />
            <circle cx="0" cy="0" r="5" fill="#d8ab43" opacity="0.4" />
          </g>
        )}

        {/* --- SHADOW UNDER HAND & PEN --- */}
        <ellipse
          cx="60"
          cy="65"
          rx="50"
          ry="30"
          fill="rgba(0,0,0,0.35)"
          transform="rotate(28 60 65)"
          filter="blur(8px)"
        />

        {/* --- THE LUXURY FOUNTAIN PEN --- */}
        {/* Tilted along angle: pointing directly from (0,0) down-right to (120, 100) */}
        <g transform="rotate(40 0 0)">
          {/* 1. Fine Metallic Nib Tip (starts exactly at 0, 0) */}
          <path
            d="M 0 0 
               L 5 12 
               L 4 22 
               L -4 22 
               L -5 12 Z"
            fill="url(#nibGold)"
            stroke="#7c5a17"
            strokeWidth="0.6"
          />
          {/* Nib Breather Hole and Slit */}
          <line x1="0" y1="0" x2="0" y2="14" stroke="#48330d" strokeWidth="0.6" />
          <circle cx="0" cy="14" r="1.1" fill="#48330d" />

          {/* 2. Nib Collar / Feed Section */}
          <rect x="-4.5" y="22" width="9" height="7" fill="#14110f" stroke="#000" strokeWidth="0.4" />

          {/* 3. Gold Band 1 */}
          <rect x="-6" y="29" width="12" height="3" fill="url(#nibGold)" />

          {/* 4. Pen Grip Section */}
          <path
            d="M -6 32 L -7 60 L 7 60 L 6 32 Z"
            fill="#1e1a17"
            stroke="#110e0c"
            strokeWidth="0.5"
          />

          {/* 5. Central Gold Trim Ring */}
          <rect x="-7.5" y="60" width="15" height="4.5" fill="url(#nibGold)" rx="0.5" />

          {/* 6. Pen Barrel (Lacquered Black Body) */}
          <path
            d="M -7.5 64.5 L -8.5 170 C -8.5 176, 8.5 176, 8.5 170 L 7.5 64.5 Z"
            fill="url(#penBody)"
          />
          {/* High-gloss shine streak along the barrel */}
          <path
            d="M -4 65 L -4 165 L -2 165 L -2 65 Z"
            fill="url(#penHighlight)"
            opacity="0.65"
          />

          {/* 7. Gold Pocket Clip */}
          <path
            d="M 6 85 L 11 90 L 11 145 L 8 150 L 6 150 Z"
            fill="url(#nibGold)"
            stroke="#6e5015"
            strokeWidth="0.5"
          />
        </g>

        {/* --- THE HAND GRIPPING THE PEN --- */}
        {/* Natural hand drawing with fingers wrapped around the pen barrel */}
        <g transform="translate(18, 20)">
          {/* Back of Hand & Wrist */}
          <path
            d="M 65 95 
               C 85 105, 120 120, 160 160 
               C 185 185, 210 220, 240 270 
               L 180 300 
               C 140 240, 110 200, 85 170 
               C 65 145, 55 125, 45 105 Z"
            fill="url(#skinTone)"
            stroke="#874723"
            strokeWidth="1.2"
          />

          {/* Forefinger / Index Finger (Extending along and gripping the pen grip) */}
          <path
            d="M 28 35 
               C 22 45, 18 60, 22 75 
               C 25 85, 36 92, 48 88 
               C 60 84, 65 72, 60 58 
               C 55 45, 42 32, 28 35 Z"
            fill="url(#skinHighlight)"
            stroke="#874723"
            strokeWidth="1"
          />
          {/* Fingernail Highlight on Index Finger */}
          <ellipse cx="27" cy="46" rx="4" ry="7" fill="#fce2ce" opacity="0.6" transform="rotate(-15 27 46)" />

          {/* Middle Finger (Supporting underneath) */}
          <path
            d="M 40 70 
               C 35 85, 34 102, 44 115 
               C 54 125, 68 120, 75 110 
               C 80 100, 78 85, 68 75 Z"
            fill="url(#skinTone)"
            stroke="#874723"
            strokeWidth="1"
          />

          {/* Thumb (Clamping over the pen) */}
          <path
            d="M 45 40 
               C 42 30, 52 18, 68 18 
               C 84 18, 95 28, 92 45 
               C 90 60, 78 72, 64 72 
               C 52 72, 46 55, 45 40 Z"
            fill="url(#skinHighlight)"
            stroke="#874723"
            strokeWidth="1.2"
          />
          {/* Thumb knuckle & nail detail */}
          <ellipse cx="62" cy="24" rx="6" ry="4.5" fill="#fce2ce" opacity="0.55" />

          {/* Ring & Pinky Fingers resting naturally folded */}
          <path
            d="M 70 105 
               C 85 115, 95 130, 92 145 
               C 88 155, 78 158, 68 150 
               C 60 142, 62 125, 68 112 Z"
            fill="url(#skinTone)"
            opacity="0.9"
            stroke="#874723"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </div>
  );
};
