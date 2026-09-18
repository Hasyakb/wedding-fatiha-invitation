import React from "react";

interface Envelope3DProps {
  progress: number; // 0 to 1 (0 = closed, 1 = fully open)
  children?: React.ReactNode;
}

export const Envelope3D: React.FC<Envelope3DProps> = ({ progress, children }) => {
  // Angle calculated from progress (0 deg when closed to 180 deg when fully open)
  const unfoldAngle = Math.min(180, Math.max(0, progress * 180));
  const isFullyOpen = progress >= 0.98;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background card surface */}
      <div className="absolute inset-0 z-0">{children}</div>

      {/* Flaps container (hidden when fully open so card underneath is clear) */}
      {!isFullyOpen && (
        <div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
            opacity: Math.max(0, 1 - (progress - 0.7) * 3.3),
            transition: "opacity 0.2s ease-out",
          }}
        >
          {/* TOP FLAP */}
          <div
            className="absolute top-0 left-0 right-0 h-1/2 origin-top"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${unfoldAngle}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <div className="w-full h-full relative overflow-hidden">
              <svg
                viewBox="0 0 400 350"
                className="w-full h-full object-cover filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="ivoryPaperTop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f7f3ea" />
                    <stop offset="60%" stopColor="#f2ece1" />
                    <stop offset="100%" stopColor="#e7dfd1" />
                  </linearGradient>
                  <filter id="embossTop" x="-10%" y="-10%" width="120%" height="120%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" result="blur" />
                    <feOffset in="blur" dx="-1" dy="-1" result="offsetLight" />
                    <feOffset in="blur" dx="1.5" dy="1.5" result="offsetShadow" />
                    <feMerge>
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                {/* Triangular pointed flap */}
                <polygon
                  points="0,0 400,0 200,320"
                  fill="url(#ivoryPaperTop)"
                  stroke="#dfd6c5"
                  strokeWidth="1.5"
                />
                {/* Embossed floral patterns on top flap */}
                <g filter="url(#embossTop)" opacity="0.45" stroke="#d5c7b0" fill="none" strokeWidth="1.2">
                  <path d="M 200 40 Q 180 80 160 110 Q 190 120 200 150 Q 210 120 240 110 Z" />
                  <circle cx="200" cy="90" r="14" />
                  <path d="M 140 60 Q 120 100 135 130" />
                  <path d="M 260 60 Q 280 100 265 130" />
                  <circle cx="160" cy="140" r="8" />
                  <circle cx="240" cy="140" r="8" />
                  <path d="M 180 200 Q 200 230 200 270" strokeWidth="2" />
                  <circle cx="200" cy="240" r="12" />
                </g>
              </svg>
            </div>
          </div>

          {/* BOTTOM FLAP */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1/2 origin-bottom"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${-unfoldAngle}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <div className="w-full h-full relative overflow-hidden">
              <svg
                viewBox="0 0 400 350"
                className="w-full h-full object-cover filter drop-shadow-[0_-8px_16px_rgba(0,0,0,0.18)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,350 400,350 200,30"
                  fill="#f3ede2"
                  stroke="#ded4c3"
                  strokeWidth="1.5"
                />
                <g opacity="0.4" stroke="#d0c2ab" fill="none" strokeWidth="1.2">
                  <path d="M 120 280 Q 200 240 280 280" />
                  <circle cx="200" cy="200" r="16" />
                  <path d="M 170 170 Q 200 150 230 170" />
                </g>
              </svg>
            </div>
          </div>

          {/* LEFT FLAP */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 origin-left"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-unfoldAngle}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <div className="w-full h-full relative overflow-hidden">
              <svg
                viewBox="0 0 200 650"
                className="w-full h-full object-cover filter drop-shadow-[8px_0_16px_rgba(0,0,0,0.15)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,0 0,650 190,325"
                  fill="#f6f2e8"
                  stroke="#ded5c5"
                  strokeWidth="1.5"
                />
                <g opacity="0.4" stroke="#d2c5b0" fill="none" strokeWidth="1.2">
                  <path d="M 20 200 Q 80 260 120 325" />
                  <circle cx="70" cy="270" r="14" />
                  <circle cx="80" cy="380" r="12" />
                </g>
              </svg>
            </div>
          </div>

          {/* RIGHT FLAP */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 origin-right"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${unfoldAngle}deg)`,
              transition: "transform 0.1s linear",
            }}
          >
            <div className="w-full h-full relative overflow-hidden">
              <svg
                viewBox="0 0 200 650"
                className="w-full h-full object-cover filter drop-shadow-[-8px_0_16px_rgba(0,0,0,0.15)]"
                preserveAspectRatio="none"
              >
                <polygon
                  points="200,0 200,650 10,325"
                  fill="#f4eee4"
                  stroke="#ded5c5"
                  strokeWidth="1.5"
                />
                <g opacity="0.4" stroke="#d2c5b0" fill="none" strokeWidth="1.2">
                  <path d="M 180 200 Q 120 260 80 325" />
                  <circle cx="130" cy="270" r="14" />
                  <circle cx="120" cy="380" r="12" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
