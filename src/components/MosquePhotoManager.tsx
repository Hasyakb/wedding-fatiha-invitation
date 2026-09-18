import React, { useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Check,
  Landmark,
  Eye,
  Sliders,
  Play,
  Layers,
} from "lucide-react";
import { InvitationData, MosquePhotoSet } from "../types";
import { DEFAULT_MOSQUE_PHOTOS } from "../utils/mosqueImageLoader";

interface MosquePhotoManagerProps {
  data: InvitationData;
  onChange: (newData: InvitationData) => void;
  onPreviewScene?: (timestamp: number) => void;
}

interface MosqueMeta {
  key: keyof MosquePhotoSet;
  name: string;
  location: string;
  featuredIn: string;
  timestamp: number;
  description: string;
  emoji: string;
}

const MOSQUE_CONFIGS: MosqueMeta[] = [
  {
    key: "nabawi",
    name: "Masjid an-Nabawi",
    location: "Al-Madinah al-Munawwarah",
    featuredIn: "Scene 0 (Opening) & Scene 2 (The Couple)",
    timestamp: 9.5,
    description: "The Prophet's Mosque featuring the Green Dome and graceful Medina courtyard canopies.",
    emoji: "🕌",
  },
  {
    key: "haram",
    name: "Masjid al-Haram",
    location: "Makkah al-Mukarramah",
    featuredIn: "Scene 1 (The Host Families)",
    timestamp: 5.5,
    description: "The Great Sanctuary featuring the Holy Kaaba and grand illuminated colonnades.",
    emoji: "🕋",
  },
  {
    key: "aqsa",
    name: "Masjid al-Aqsa",
    location: "Al-Quds Ash-Sharif",
    featuredIn: "Scene 3 (Date, Time & Venue Details)",
    timestamp: 15.5,
    description: "The Golden Dome of the Rock framed by ancient archway porticos and sacred plaza.",
    emoji: "✨",
  },
  {
    key: "zayed",
    name: "Grand Islamic Mosque",
    location: "Abu Dhabi",
    featuredIn: "Scene 4 (RSVP & Union Blessing Finale)",
    timestamp: 21.0,
    description: "Cascading pure white marble domes, Moorish archways, and soaring minarets.",
    emoji: "🌙",
  },
];

export const MosquePhotoManager: React.FC<MosquePhotoManagerProps> = ({
  data,
  onChange,
  onPreviewScene,
}) => {
  const [uploadSuccessKey, setUploadSuccessKey] = useState<string | null>(null);
  const [draggingKey, setDraggingKey] = useState<string | null>(null);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  const currentPhotos: MosquePhotoSet = {
    ...DEFAULT_MOSQUE_PHOTOS,
    ...(data.mosquePhotos || {}),
  };

  const handlePhotoUpload = (key: keyof MosquePhotoSet, file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        const updatedPhotos: MosquePhotoSet = {
          ...currentPhotos,
          [key]: result,
        };
        onChange({
          ...data,
          mosquePhotos: updatedPhotos,
        });
        setUploadSuccessKey(key);
        setTimeout(() => setUploadSuccessKey(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetSingle = (key: keyof MosquePhotoSet) => {
    const updatedPhotos: MosquePhotoSet = {
      ...currentPhotos,
      [key]: DEFAULT_MOSQUE_PHOTOS[key],
    };
    onChange({
      ...data,
      mosquePhotos: updatedPhotos,
    });
  };

  const handleResetAll = () => {
    onChange({
      ...data,
      mosquePhotos: { ...DEFAULT_MOSQUE_PHOTOS },
      mosquePhotoOpacity: 0.38,
      mosquePhotoBlur: 0.8,
      mosqueDisplayMode: "both",
    });
    setUploadSuccessKey("all");
    setTimeout(() => setUploadSuccessKey(null), 3000);
  };

  const currentMode = data.mosqueDisplayMode || "both";
  const opacityPercent = Math.round((data.mosquePhotoOpacity ?? 0.38) * 100);
  const blurVal = data.mosquePhotoBlur ?? 0.8;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2a2116] via-[#1f1810] to-[#16120e] border border-[#c5a059]/40 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#3d2e1b]/80 border border-[#c5a059]/50 text-[#e9d6b8] text-[11px] font-cinzel tracking-wider uppercase mb-2">
              <Landmark className="w-3.5 h-3.5 text-[#c5a059]" />
              Sacred Mosque Photography
            </div>
            <h2 className="text-base font-cinzel font-bold text-[#f5ebd9] tracking-wide">
              Real Mosque Photographic Backdrops
            </h2>
            <p className="text-xs text-[#b8a690] mt-1 leading-relaxed">
              Elevate Hassan & Aisha&apos;s wedding invitation with real photos of the holiest Islamic mosques.
              Upload custom photography or enjoy our curated high-resolution pictures.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetAll}
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-[#261e14] hover:bg-[#342718] border border-[#4a3924] text-[#d6c5ac] hover:text-[#f4e8d4] text-xs transition-colors flex items-center gap-1.5"
            title="Reset all mosque images to default realistic photography"
          >
            <RotateCcw className="w-3 h-3 text-[#c5a059]" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Global Display Style & Appearance Controls */}
      <div className="p-4 rounded-2xl bg-[#1c1611] border border-[#382b1e] space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#ddcebb]">
          <Layers className="w-4 h-4 text-[#c5a059]" />
          <span>Atmospheric Background Presentation</span>
        </div>

        {/* Display Mode Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => onChange({ ...data, mosqueDisplayMode: "both" })}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
              currentMode === "both"
                ? "bg-[#2e2316] border-[#c5a059] text-[#f4e6d2] shadow-sm font-semibold ring-1 ring-[#c5a059]"
                : "bg-[#14100c] border-[#2e2216] text-[#9e8d7a] hover:text-[#e4d4be]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[12px] text-[#e8d7bf]">Photo + Contours</span>
              {currentMode === "both" && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
            </div>
            <p className="text-[11px] text-[#9c8976] leading-tight">
              Real high-res photography layered with delicate gold architectural vector lines.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...data, mosqueDisplayMode: "photo" })}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
              currentMode === "photo"
                ? "bg-[#2e2316] border-[#c5a059] text-[#f4e6d2] shadow-sm font-semibold ring-1 ring-[#c5a059]"
                : "bg-[#14100c] border-[#2e2216] text-[#9e8d7a] hover:text-[#e4d4be]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[12px] text-[#e8d7bf]">Pure Photo Film</span>
              {currentMode === "photo" && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
            </div>
            <p className="text-[11px] text-[#9c8976] leading-tight">
              Cinematic real photograph with Ken Burns pan, zoom, and soft champagne vignette.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...data, mosqueDisplayMode: "silhouette" })}
            className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
              currentMode === "silhouette"
                ? "bg-[#2e2316] border-[#c5a059] text-[#f4e6d2] shadow-sm font-semibold ring-1 ring-[#c5a059]"
                : "bg-[#14100c] border-[#2e2216] text-[#9e8d7a] hover:text-[#e4d4be]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[12px] text-[#e8d7bf]">Vector Silhouette</span>
              {currentMode === "silhouette" && <Check className="w-3.5 h-3.5 text-[#c5a059]" />}
            </div>
            <p className="text-[11px] text-[#9c8976] leading-tight">
              Hand-crafted architectural shadow lines and minarets in warm palace gold.
            </p>
          </button>
        </div>

        {/* Sliders: Opacity & Blur */}
        {currentMode !== "silhouette" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2e2216]">
            {/* Opacity Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[#cfc0ae] flex items-center gap-1.5">
                  <Sliders className="w-3 h-3 text-[#c5a059]" />
                  Photo Presence (Opacity)
                </label>
                <span className="text-[#e2c792] font-mono text-[11px]">{opacityPercent}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.85"
                step="0.02"
                value={data.mosquePhotoOpacity ?? 0.5}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({
                    ...data,
                    mosquePhotoOpacity: val,
                    calligraphyBgOpacity: val,
                  });
                }}
                className="w-full accent-[#c5a059] h-1.5 bg-[#2d2217] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#7d6e5d]">
                <span>Delicate Whisper</span>
                <span>Rich Cinematic</span>
              </div>
            </div>

            {/* Blur Softness */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-[#cfc0ae] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#c5a059]" />
                  Soft Focus (Atmosphere)
                </label>
                <span className="text-[#e2c792] font-mono text-[11px]">{blurVal.toFixed(1)}px</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.2"
                value={data.mosquePhotoBlur ?? 0.5}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({
                    ...data,
                    mosquePhotoBlur: val,
                    calligraphyBgBlur: val,
                  });
                }}
                className="w-full accent-[#c5a059] h-1.5 bg-[#2d2217] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#7d6e5d]">
                <span>Crisp Architecture</span>
                <span>Dreamy Depth</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mosque Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#aa957d] font-cinzel">
            Sacred Mosques for Hassan & Aisha Ceremony
          </h3>
          <span className="text-[10px] text-[#c5a059] font-medium">
            4 Sacred Backdrops Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOSQUE_CONFIGS.map((cfg) => {
            const photoSrc = currentPhotos[cfg.key];
            const isCustom = photoSrc !== DEFAULT_MOSQUE_PHOTOS[cfg.key];
            const isDragging = draggingKey === cfg.key;
            const isRecentlyUploaded = uploadSuccessKey === cfg.key;

            return (
              <div
                key={cfg.key}
                className={`relative rounded-2xl p-4 bg-[#1e1711] border transition-all ${
                  isDragging
                    ? "border-[#c5a059] bg-[#291e13] ring-2 ring-[#c5a059]/50 shadow-xl"
                    : isRecentlyUploaded
                    ? "border-emerald-500/60 bg-[#1a231b] ring-1 ring-emerald-500/40"
                    : "border-[#3a2c1d] hover:border-[#523e2a]"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDraggingKey(cfg.key);
                }}
                onDragLeave={() => setDraggingKey(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDraggingKey(null);
                  if (e.dataTransfer.files?.[0]) {
                    handlePhotoUpload(cfg.key, e.dataTransfer.files[0]);
                  }
                }}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{cfg.emoji}</span>
                      <h4 className="font-cinzel font-bold text-sm text-[#f6eee2]">
                        {cfg.name}
                      </h4>
                    </div>
                    <div className="text-[11px] text-[#c5a059] font-medium mt-0.5">
                      {cfg.location}
                    </div>
                  </div>

                  <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-[#2c2014] text-[#dfccb6] border border-[#443320] text-right font-medium">
                    {cfg.featuredIn.split(" (")[0]}
                  </span>
                </div>

                {/* Photo Preview Container */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#3f3122] bg-[#120e0a] group mb-3 shadow-inner">
                  <img
                    src={photoSrc}
                    alt={cfg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

                  {/* Scene Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] text-[#eedec8] font-cinzel border border-[#c5a059]/40">
                    {cfg.featuredIn}
                  </div>

                  {/* Custom Indicator */}
                  {isCustom && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-emerald-950/80 backdrop-blur-xs text-[10px] text-emerald-300 border border-emerald-500/50 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      Custom Real Photo
                    </div>
                  )}

                  {/* Hover action bar */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-between pointer-events-auto">
                    {onPreviewScene && (
                      <button
                        type="button"
                        onClick={() => onPreviewScene(cfg.timestamp)}
                        className="px-2.5 py-1 rounded-lg bg-[#2c2114]/90 hover:bg-[#3d2e1b] backdrop-blur-xs text-[#f0e3d2] text-[10px] font-medium border border-[#c5a059]/50 flex items-center gap-1 transition-transform active:scale-95 shadow-md"
                        title="Seek live video player to this mosque scene"
                      >
                        <Play className="w-2.5 h-2.5 fill-[#c5a059] text-[#c5a059]" />
                        <span>Preview in Video</span>
                      </button>
                    )}

                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleResetSingle(cfg.key)}
                        className="px-2 py-1 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-xs text-[#d8c8b4] text-[10px] border border-[#523f2b] flex items-center gap-1 transition-colors ml-auto"
                        title="Reset to initial curated real photo"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Default</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload & Description */}
                <div className="space-y-2">
                  <p className="text-[11px] text-[#9c8975] leading-relaxed">
                    {cfg.description}
                  </p>

                  <input
                    ref={(el) => {
                      fileInputsRef.current[cfg.key] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handlePhotoUpload(cfg.key, e.target.files[0]);
                      }
                    }}
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputsRef.current[cfg.key]?.click()}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#b58735] via-[#dfb969] to-[#c5a059] hover:brightness-110 active:scale-98 text-[#1c150c] font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#c5a059]/20"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isCustom ? "Replace Real Photo" : "Upload Real Photo"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
