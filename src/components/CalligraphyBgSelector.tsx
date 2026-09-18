import React, { useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Sparkles,
  Layers,
  Sliders,
  Check,
} from "lucide-react";
import { InvitationData, CalligraphyBgPreset } from "../types";
import { DEFAULT_MOSQUE_PHOTOS } from "../utils/mosqueImageLoader";

interface CalligraphyBgSelectorProps {
  data: InvitationData;
  onChange: (updated: InvitationData) => void;
  compact?: boolean;
}

export function CalligraphyBgSelector({
  data,
  onChange,
  compact = false,
}: CalligraphyBgSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPreset = data.calligraphyBgPreset || "nabawi";
  const opacity = data.calligraphyBgOpacity !== undefined ? data.calligraphyBgOpacity : 0.7;
  const blur = data.calligraphyBgBlur !== undefined ? data.calligraphyBgBlur : 0.3;

  const presets: {
    id: CalligraphyBgPreset;
    title: string;
    subtitle: string;
    icon: string;
    previewUrl?: string;
  }[] = [
    {
      id: "nabawi",
      title: "Medina Mosque",
      subtitle: "Masjid an-Nabawi Night",
      icon: "🕌",
      previewUrl: data.mosquePhotos?.nabawi || DEFAULT_MOSQUE_PHOTOS.nabawi,
    },
    {
      id: "zayed",
      title: "Sheikh Zayed",
      subtitle: "Grand Mosque Twilight",
      icon: "🏛️",
      previewUrl: data.mosquePhotos?.zayed || DEFAULT_MOSQUE_PHOTOS.zayed,
    },
    {
      id: "haram",
      title: "Makkah Haram",
      subtitle: "Holy Kaaba Plaza",
      icon: "🕋",
      previewUrl: data.mosquePhotos?.haram || DEFAULT_MOSQUE_PHOTOS.haram,
    },
    {
      id: "aqsa",
      title: "Al-Aqsa Dome",
      subtitle: "Golden Dome & Porticos",
      icon: "✨",
      previewUrl: data.mosquePhotos?.aqsa || DEFAULT_MOSQUE_PHOTOS.aqsa,
    },
    {
      id: "auto",
      title: "Auto-Rotate",
      subtitle: "Changes with each scene",
      icon: "🔄",
      previewUrl: data.mosquePhotos?.nabawi || DEFAULT_MOSQUE_PHOTOS.nabawi,
    },
    {
      id: "amberGlow",
      title: "Amber Golden Bokeh",
      subtitle: "Radiant golden sparkles & sunlit dusk",
      icon: "✨",
      previewUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: "velvet",
      title: "Velvet Noir",
      subtitle: "Deep obsidian & gold glow",
      icon: "🌑",
    },
    {
      id: "parchment",
      title: "Vintage Parchment",
      subtitle: "Antique royal manuscript",
      icon: "📜",
    },
    {
      id: "emerald",
      title: "Emerald Damask",
      subtitle: "Royal emerald velvet",
      icon: "🌿",
    },
    {
      id: "custom",
      title: "Custom Photo",
      subtitle: "Upload your own backdrop",
      icon: "📸",
      previewUrl: data.calligraphyCustomBgUrl,
    },
  ];

  const handleSelectPreset = (preset: CalligraphyBgPreset) => {
    onChange({
      ...data,
      calligraphyBgPreset: preset,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChange({
          ...data,
          calligraphyBgPreset: "custom",
          calligraphyCustomBgUrl: result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#d8c5b0] font-medium flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
            Background Backdrop
          </span>
          <span className="text-[11px] text-[#9a8876]">
            {presets.find((p) => p.id === currentPreset)?.title}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {presets.slice(0, 6).map((preset) => {
            const isSelected = currentPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-left text-xs transition-all ${
                  isSelected
                    ? "bg-[#33261a] border-[#c5a059] text-[#fbe5be] ring-1 ring-[#c5a059]/40"
                    : "bg-[#1f1914] border-[#382d23] text-[#a89785] hover:text-[#f4e8da] hover:bg-[#28211a]"
                }`}
              >
                <span className="text-sm shrink-0">{preset.icon}</span>
                <span className="truncate font-medium text-[11px]">{preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-[#1c1713]/90 border border-[#382d22] space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#33271d] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c5a059] to-[#88692c] flex items-center justify-center text-[#140e06] shadow-sm">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f5e7d4] font-luxury">
              {data.templateStyle === "goldenBokeh"
                ? "Cinematic Bokeh Background Backdrop"
                : "Sacred Mosque & Cinematic Backdrop"}
            </h3>
            <p className="text-[11px] text-[#a4917e]">
              {data.templateStyle === "goldenBokeh"
                ? "Blend sacred mosque photos or golden dusk lighting behind the bokeh particles."
                : "Blend sacred mosque photography or luxury textures behind the calligraphy."}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange({
              ...data,
              calligraphyBgPreset: "nabawi",
              calligraphyBgOpacity: 0.38,
              calligraphyBgBlur: 0.5,
            })
          }
          className="flex items-center gap-1 text-[11px] text-[#9c8977] hover:text-[#e8dac8] transition-colors p-1"
          title="Reset background to default Medina Mosque"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {presets.map((preset) => {
          const isSelected = currentPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (preset.id === "custom" && !data.calligraphyCustomBgUrl) {
                  fileInputRef.current?.click();
                } else {
                  handleSelectPreset(preset.id);
                }
              }}
              className={`relative overflow-hidden rounded-xl border p-2.5 flex flex-col items-start text-left transition-all group ${
                isSelected
                  ? "bg-[#2d2116] border-[#c5a059] shadow-md ring-1 ring-[#c5a059]/40"
                  : "bg-[#18130f] border-[#352a1f] hover:border-[#4d3d2c] hover:bg-[#201812]"
              }`}
            >
              {/* Thumbnail preview if available */}
              {preset.previewUrl && (
                <div className="w-full h-12 rounded-lg overflow-hidden mb-2 relative bg-black/40 border border-[#382b20]">
                  <img
                    src={preset.previewUrl}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140e06] via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-xs">{preset.icon}</span>
                </div>
              )}

              {!preset.previewUrl && (
                <div className="w-full h-12 rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br from-[#292017] to-[#14100c] border border-[#382b20]">
                  <span className="text-xl">{preset.icon}</span>
                </div>
              )}

              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-xs text-[#ebdcc9] truncate">
                  {preset.title}
                </span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#c5a059] text-[#140e06] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </div>

              <span className="text-[10px] text-[#93816f] truncate w-full mt-0.5">
                {preset.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Photo Upload Section if Custom is Selected */}
      {currentPreset === "custom" && (
        <div className="p-3 rounded-xl bg-[#231b14] border border-[#443526] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#f0dfcc]">Custom Background Photo</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-[11px] text-[#c5a059] hover:underline"
            >
              <Upload className="w-3 h-3" />
              <span>Choose Photo</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {data.calligraphyCustomBgUrl ? (
            <div className="relative w-full h-24 rounded-lg overflow-hidden border border-[#3e3022]">
              <img
                src={data.calligraphyCustomBgUrl}
                alt="Custom Backdrop"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-medium"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace Image</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border border-dashed border-[#4d3d2c] rounded-lg text-center hover:border-[#c5a059] transition-colors"
            >
              <Upload className="w-5 h-5 mx-auto text-[#a89582] mb-1" />
              <p className="text-xs text-[#d5c3af]">Click to upload a custom background photo</p>
              <p className="text-[10px] text-[#8e7c6b]">JPG, PNG or WebP</p>
            </button>
          )}
        </div>
      )}

      {/* Opacity and Blur Tuning Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2e2319]">
        {/* Opacity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c7b6a4] font-medium flex items-center gap-1.5">
              <Sliders className="w-3 h-3 text-[#c5a059]" />
              Backdrop Visibility
            </span>
            <span className="text-[11px] font-mono text-[#c5a059]">
              {Math.round(opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.15"
            max="0.80"
            step="0.05"
            value={opacity}
            onChange={(e) =>
              onChange({
                ...data,
                calligraphyBgOpacity: parseFloat(e.target.value),
              })
            }
            className="w-full accent-[#c5a059] bg-[#2a2119] rounded-lg h-1.5 cursor-pointer"
          />
        </div>

        {/* Blur */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#c7b6a4] font-medium">Soft Focus / Blur</span>
            <span className="text-[11px] font-mono text-[#c5a059]">{blur.toFixed(1)}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="3.0"
            step="0.5"
            value={blur}
            onChange={(e) =>
              onChange({
                ...data,
                calligraphyBgBlur: parseFloat(e.target.value),
              })
            }
            className="w-full accent-[#c5a059] bg-[#2a2119] rounded-lg h-1.5 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
