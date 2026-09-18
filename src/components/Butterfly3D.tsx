import React from "react";

interface ButterflyProps {
  isFlying?: boolean;
  scale?: number;
  className?: string;
  glowColor?: string;
}

export const Butterfly3D: React.FC<ButterflyProps> = ({
  isFlying = false,
  scale = 1,
  className = "",
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{
        transform: `scale(${scale})`,
        perspective: "1000px",
      }}
    >
      {/* Dynamic Drop Shadow on the card surface */}
      <div
        className="absolute rounded-full filter blur-[6px] opacity-40 transition-all duration-700"
        style={{
          width: isFlying ? "60px" : "85px",
          height: isFlying ? "25px" : "32px",
          top: isFlying ? "95px" : "60px",
          backgroundColor: "#3a2a1a",
          transform: isFlying ? "scale(0.85)" : "scale(1)",
        }}
      />

      {/* Butterfly Container */}
      <div
        className="relative flex items-center justify-center transition-transform duration-1000"
        style={{
          transformStyle: "preserve-3d",
          animation: isFlying
            ? "gentleHover 3s ease-in-out infinite"
            : "gentleRest 4s ease-in-out infinite",
        }}
      >
        {/* LEFT WING */}
        <div
          className="relative origin-right"
          style={{
            transformStyle: "preserve-3d",
            animation: isFlying
              ? "wingFlapLeftFast 0.35s ease-in-out infinite alternate"
              : "wingFlapLeftSlow 3.2s ease-in-out infinite alternate",
          }}
        >
          <svg
            width="68"
            height="85"
            viewBox="0 0 68 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          >
            <defs>
              <linearGradient id="leftWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8d6b4f" />
                <stop offset="25%" stopColor="#faf7f0" />
                <stop offset="55%" stopColor="#dce8f5" />
                <stop offset="85%" stopColor="#f7f3e8" />
                <stop offset="100%" stopColor="#7a5538" />
              </linearGradient>
              <linearGradient id="shimmerLeft" x1="10%" y1="0%" x2="90%" y2="80%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#bdd3ed" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Forewing */}
            <path
              d="M66 42 C64 25, 48 5, 26 2 C10 0, 0 12, 4 30 C8 44, 25 56, 66 52 Z"
              fill="url(#leftWingGrad)"
              stroke="#6b4c33"
              strokeWidth="1.2"
            />
            {/* Forewing Shimmer Overlay */}
            <path
              d="M60 40 C58 28, 45 10, 28 6 C15 4, 8 14, 11 26 C15 36, 30 46, 60 44 Z"
              fill="url(#shimmerLeft)"
            />
            {/* Wing Veins */}
            <path
              d="M64 45 C48 38, 30 25, 18 10 M64 45 C42 42, 22 34, 10 24 M64 45 C44 48, 25 45, 14 38"
              stroke="#82624a"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Hindwing */}
            <path
              d="M65 48 C62 58, 48 78, 30 82 C16 85, 8 72, 14 58 C20 46, 45 46, 65 48 Z"
              fill="url(#leftWingGrad)"
              stroke="#6b4c33"
              strokeWidth="1.2"
            />
            <path
              d="M62 52 C50 62, 35 72, 22 75 C14 74, 12 65, 16 55 C22 47, 44 48, 62 52 Z"
              fill="url(#shimmerLeft)"
            />
            {/* Hindwing scalloped edge dots */}
            <circle cx="20" cy="80" r="1.5" fill="#54371f" />
            <circle cx="28" cy="82" r="1.5" fill="#54371f" />
            <circle cx="38" cy="80" r="1.5" fill="#54371f" />
          </svg>
        </div>

        {/* BODY & ANTENNAE */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Antennae */}
          <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="-mb-2">
            <path
              d="M12 18 C11 12, 6 4, 2 2 M12 18 C13 12, 18 4, 22 2"
              stroke="#4a3321"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle cx="2" cy="2" r="1.2" fill="#4a3321" />
            <circle cx="22" cy="2" r="1.2" fill="#4a3321" />
          </svg>
          {/* Head & Thorax & Abdomen */}
          <div className="w-[5px] h-[34px] rounded-full bg-gradient-to-b from-[#5c3e27] via-[#452b17] to-[#2e1c0d] shadow-sm flex flex-col items-center">
            <div className="w-[6px] h-[6px] rounded-full bg-[#3d2411] -mt-[1px]" />
          </div>
        </div>

        {/* RIGHT WING */}
        <div
          className="relative origin-left"
          style={{
            transformStyle: "preserve-3d",
            animation: isFlying
              ? "wingFlapRightFast 0.35s ease-in-out infinite alternate"
              : "wingFlapRightSlow 3.2s ease-in-out infinite alternate",
          }}
        >
          <svg
            width="68"
            height="85"
            viewBox="0 0 68 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
          >
            <defs>
              <linearGradient id="rightWingGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8d6b4f" />
                <stop offset="25%" stopColor="#faf7f0" />
                <stop offset="55%" stopColor="#dce8f5" />
                <stop offset="85%" stopColor="#f7f3e8" />
                <stop offset="100%" stopColor="#7a5538" />
              </linearGradient>
              <linearGradient id="shimmerRight" x1="90%" y1="0%" x2="10%" y2="80%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#bdd3ed" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Forewing */}
            <path
              d="M2 42 C4 25, 20 5, 42 2 C58 0, 68 12, 64 30 C60 44, 43 56, 2 52 Z"
              fill="url(#rightWingGrad)"
              stroke="#6b4c33"
              strokeWidth="1.2"
            />
            <path
              d="M8 40 C10 28, 23 10, 40 6 C53 4, 60 14, 57 26 C53 36, 38 46, 8 44 Z"
              fill="url(#shimmerRight)"
            />
            {/* Wing Veins */}
            <path
              d="M4 45 C20 38, 38 25, 50 10 M4 45 C26 42, 46 34, 58 24 M4 45 C24 48, 43 45, 54 38"
              stroke="#82624a"
              strokeWidth="0.8"
              strokeOpacity="0.5"
            />
            {/* Hindwing */}
            <path
              d="M3 48 C6 58, 20 78, 38 82 C52 85, 60 72, 54 58 C48 46, 23 46, 3 48 Z"
              fill="url(#rightWingGrad)"
              stroke="#6b4c33"
              strokeWidth="1.2"
            />
            <path
              d="M6 52 C18 62, 33 72, 46 75 C54 74, 56 65, 52 55 C46 47, 24 48, 6 52 Z"
              fill="url(#shimmerRight)"
            />
            {/* Hindwing scalloped edge dots */}
            <circle cx="48" cy="80" r="1.5" fill="#54371f" />
            <circle cx="40" cy="82" r="1.5" fill="#54371f" />
            <circle cx="30" cy="80" r="1.5" fill="#54371f" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes wingFlapLeftFast {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(68deg); }
        }
        @keyframes wingFlapRightFast {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-68deg); }
        }
        @keyframes wingFlapLeftSlow {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(28deg); }
          100% { transform: rotateY(5deg); }
        }
        @keyframes wingFlapRightSlow {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(-28deg); }
          100% { transform: rotateY(-5deg); }
        }
        @keyframes gentleHover {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes gentleRest {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
};
