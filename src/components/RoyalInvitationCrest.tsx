import React from "react";

interface RoyalInvitationCrestProps {
  className?: string;
  width?: number;
  height?: number;
}

export const RoyalInvitationCrest: React.FC<RoyalInvitationCrestProps> = ({
  className = "",
  width = 340,
  height = 95,
}) => {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 360 100"
        width={width}
        height={height}
        className="w-full max-w-[360px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradientCrest" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5e0aa" />
            <stop offset="30%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="70%" stopColor="#c59b27" />
            <stop offset="100%" stopColor="#8a691e" />
          </linearGradient>

          <linearGradient id="crestDarkBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14110e" />
            <stop offset="60%" stopColor="#1a1510" />
            <stop offset="100%" stopColor="#0e0c0a" />
          </linearGradient>

          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Curved Header Arch Silhouette */}
        <path
          d="M 10 0 
             C 80 15, 110 5, 180 5 
             C 250 5, 280 15, 350 0 
             L 360 0 
             L 360 30 
             C 330 45, 300 35, 270 48
             C 240 60, 210 65, 180 65
             C 150 65, 120 60, 90 48
             C 60 35, 30 45, 0 30
             L 0 0 Z"
          fill="url(#crestDarkBg)"
          stroke="url(#goldGradientCrest)"
          strokeWidth="1.2"
        />

        {/* Bottom Scalloped Border Arch & Beads */}
        <path
          d="M 25 25
             C 70 38, 120 54, 180 54
             C 240 54, 290 38, 335 25"
          stroke="url(#goldGradientCrest)"
          strokeWidth="1.5"
          strokeDasharray="4 2"
          opacity="0.85"
        />

        {/* Royal Crown / Tiara at Top Center */}
        <g transform="translate(166, 6) scale(0.65)" filter="url(#goldGlow)">
          <path
            d="M 5 22 L 9 8 L 17 17 L 23 4 L 29 17 L 37 8 L 41 22 Z"
            fill="url(#goldGradientCrest)"
            stroke="#5c4412"
            strokeWidth="0.8"
          />
          <circle cx="9" cy="7" r="1.5" fill="#fff" />
          <circle cx="23" cy="3" r="2" fill="#fff" />
          <circle cx="37" cy="7" r="1.5" fill="#fff" />
          <path d="M 4 23 L 42 23" stroke="url(#goldGradientCrest)" strokeWidth="1.5" />
        </g>

        {/* Filigree Acanthus Flourishes - Left */}
        <g stroke="url(#goldGradientCrest)" strokeWidth="1.3" fill="none">
          <path d="M 135 22 C 115 12, 95 18, 75 14 C 65 12, 55 16, 42 22" />
          <path d="M 125 25 C 105 20, 85 24, 70 20" opacity="0.75" />
          <circle cx="58" cy="18" r="1.5" fill="url(#goldGradientCrest)" />
          <circle cx="95" cy="19" r="1.2" fill="url(#goldGradientCrest)" />
        </g>

        {/* Filigree Acanthus Flourishes - Right */}
        <g stroke="url(#goldGradientCrest)" strokeWidth="1.3" fill="none">
          <path d="M 225 22 C 245 12, 265 18, 285 14 C 295 12, 305 16, 318 22" />
          <path d="M 235 25 C 255 20, 275 24, 290 20" opacity="0.75" />
          <circle cx="302" cy="18" r="1.5" fill="url(#goldGradientCrest)" />
          <circle cx="265" cy="19" r="1.2" fill="url(#goldGradientCrest)" />
        </g>

        {/* INVITATION Header Ribbon / Text */}
        <text
          x="180"
          y="28"
          textAnchor="middle"
          fill="url(#goldGradientCrest)"
          fontSize="11"
          fontFamily="'Cinzel', serif"
          fontWeight="700"
          letterSpacing="4"
          filter="url(#goldGlow)"
        >
          INVITATION
        </text>

        {/* Decorative Golden Dots & Floral Centerpiece below text */}
        <g transform="translate(180, 40)" fill="url(#goldGradientCrest)">
          <circle cx="0" cy="0" r="2.5" />
          <circle cx="-12" cy="0" r="1.5" />
          <circle cx="12" cy="0" r="1.5" />
          <circle cx="-24" cy="0" r="1" />
          <circle cx="24" cy="0" r="1" />
          <path d="M -8 3 Q 0 8 8 3" stroke="url(#goldGradientCrest)" strokeWidth="1" fill="none" />
          <path d="M 0 3 L 0 9" stroke="url(#goldGradientCrest)" strokeWidth="1.2" />
          <circle cx="0" cy="11" r="1.5" />
        </g>
      </svg>
    </div>
  );
};
