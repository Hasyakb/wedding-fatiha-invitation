import React from "react";
import { Mail, Feather, Moon, Sparkles, Check, Crown, BookOpen } from "lucide-react";
import { InvitationData, InvitationTemplateStyle } from "../types";

interface TemplateSelectorProps {
  currentStyle: InvitationTemplateStyle;
  onSelect: (style: InvitationTemplateStyle) => void;
  className?: string;
}

interface TemplateOption {
  id: InvitationTemplateStyle;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  badge: string;
  duration: string;
  features: string[];
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "oliveRusticTablescape",
    title: "Aesthetic Olive Tablescape",
    subtitle: "White roses, retro radio, wax seal, open vintage book with pampas & dark olive botanical cards",
    icon: BookOpen,
    accentColor: "from-[#2e4732] via-[#223626] to-[#142417]",
    badge: "5th Template • Rustic Botanical",
    duration: "38s",
    features: [
      "White Roses & Vintage Radio",
      "Gold Wire 'Hold Our Date' Arch",
      "Open Vintage Book with Pampas",
      "Botanical Olive Green Cards",
    ],
  },
  {
    id: "baroqueTablescape",
    title: "Royal Baroque Tablescape",
    subtitle: "White satin vanity, round groom & bride medallions, gold easel plaques & monogram plinth",
    icon: Crown,
    accentColor: "from-[#eae3d5] via-[#c5a059] to-[#785b24]",
    badge: "White & Gold Luxury",
    duration: "34s",
    features: [
      "White Ceramic Arch Sign",
      "Groom & Bride Round Medallions",
      "Gold Easel & Quranic Verse",
      "Royal Monogram Crest Plinth",
    ],
  },
  {
    id: "goldenBokeh",
    title: "Cinematic Golden Bokeh",
    subtitle: "Animated particle heart, bride & groom spotlight portraits, interlocking 3D rings & romantic quotes",
    icon: Sparkles,
    accentColor: "from-[#f59e0b] via-[#d97706] to-[#78350f]",
    badge: "Amber & Gold",
    duration: "54s",
    features: [
      "Animated Particle Heart",
      "Bride & Groom Spotlights",
      "Interlocking 3D Gold Rings",
      "Romantic Love Story Quote",
    ],
  },
  {
    id: "calligraphyPen",
    title: "Luxury Calligraphy Pen",
    subtitle: "Realistic handwriting fountain pen with sacred mosque backdrops",
    icon: Feather,
    accentColor: "from-[#d4af37] to-[#8a6519]",
    badge: "Handcrafted Script",
    duration: "42s",
    features: [
      "Executive Fountain Pen",
      "Vintage Gold Crest",
      "Sacred Mosque Backdrops",
      "Live Pen Stroke Writing",
    ],
  },
  {
    id: "royalEnvelope",
    title: "Royal 3D Envelope",
    subtitle: "Ivory & gold envelope with flying 3D butterfly",
    icon: Mail,
    accentColor: "from-[#c5a059] to-[#785b24]",
    badge: "Classic Luxury",
    duration: "24s",
    features: [
      "3D Folding Envelope",
      "Flying Morphing Butterfly",
      "Sacred Mosque Backdrops",
      "Ivory & Gold",
    ],
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentStyle,
  onSelect,
  className = "",
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          <h3 className="text-sm font-semibold text-[#f2e6d0] font-luxury">
            Select Video Invitation Template Style
          </h3>
        </div>
        <span className="text-[11px] text-[#a59483]">
          {TEMPLATE_OPTIONS.length} Designs Available
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {TEMPLATE_OPTIONS.map((opt) => {
          const isSelected = currentStyle === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={`relative p-3.5 rounded-xl text-left transition-all flex flex-col justify-between border ${
                isSelected
                  ? "bg-gradient-to-br from-[#29221a] via-[#201a14] to-[#17130f] border-[#d4af37] shadow-lg shadow-[#c5a059]/20 ring-1 ring-[#d4af37]/60 scale-[1.02]"
                  : "bg-[#171412]/80 hover:bg-[#221c17] border-[#382d22] text-[#beb0a0] hover:text-[#f4e8da]"
              }`}
            >
              {/* Top Row: Icon + Badge + Checkmark */}
              <div className="flex items-center justify-between w-full mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isSelected
                      ? "bg-gradient-to-br from-[#d4af37] to-[#8a6519] text-[#140e06] border-[#ffe8b2]"
                      : "bg-[#27211b] text-[#c5a059] border-[#443627]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${
                      opt.id === "calligraphyPen"
                        ? "bg-[#d4af37]/20 border-[#d4af37]/60 text-[#ffd982]"
                        : "bg-[#2d251d] border-[#423528] text-[#c4b3a1]"
                    }`}
                  >
                    {opt.badge}
                  </span>

                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-[#d4af37] text-[#120d06] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h4
                  className={`text-sm font-bold font-luxury ${
                    isSelected ? "text-[#f7ebd7]" : "text-[#d8cbbe]"
                  }`}
                >
                  {opt.title}
                </h4>
                <p className="text-[11px] text-[#9b8b7a] leading-tight mt-0.5">
                  {opt.subtitle}
                </p>
              </div>

              {/* Footer Features & Timing */}
              <div className="mt-3 pt-2.5 border-t border-[#33271c] flex items-center justify-between text-[10px] text-[#aa9987]">
                <span>Timeline: {opt.duration}</span>
                <span className="text-[#d4af37] font-medium">
                  {opt.features[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
