import React, { useState } from "react";
import {
  Sparkles,
  Edit3,
  Video,
  Share2,
  Calendar,
  Heart,
  Music,
  Check,
  Copy,
  Download,
  Film,
  Landmark,
  Layers,
  Palette,
} from "lucide-react";
import { InvitationData } from "./types";
import { InvitationVideoPlayer } from "./components/InvitationVideoPlayer";
import { TextCustomizer } from "./components/TextCustomizer";
import { GeminiVideoAnalyzer } from "./components/GeminiVideoAnalyzer";
import { VideoDownloadModal } from "./components/VideoDownloadModal";
import { AudioUploader } from "./components/AudioUploader";
import { MosquePhotoManager } from "./components/MosquePhotoManager";
import { TemplateSelector } from "./components/TemplateSelector";
import { CalligraphyBgSelector } from "./components/CalligraphyBgSelector";
import { DEFAULT_MOSQUE_PHOTOS } from "./utils/mosqueImageLoader";
import { DEFAULT_BRIDE_PHOTO, DEFAULT_GROOM_PHOTO } from "./components/GoldenBokehPlayer";

const DEFAULT_INVITATION_DATA: InvitationData = {
  templateStyle: "goldenBokeh",
  bridePhotoUrl: DEFAULT_BRIDE_PHOTO,
  groomPhotoUrl: DEFAULT_GROOM_PHOTO,
  goldenBokehQuoteTitle: "A TRUE Love Story NEVER ENDS",
  goldenBokehFunctionTitle: "Walima & Reception",
  calligraphyBgPreset: "nabawi",
  calligraphyBgOpacity: 0.7,
  calligraphyBgBlur: 0.3,
  courtesyName: "Alh. Isma'il.",
  bismillah: true,
  bismillahText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  familyIntro: "THE FAMILIES OF",
  familyLateFather: "Late. Mal. Yakubu Abubakar Muhammad",
  familySecondFather: "Mal. Umar Ali Umar (Maimuri)",
  invitationPhrase: "cordially invite you to the",
  eventHeading: "Wedding Fatiha",
  childrenPhrase: "of their beloved children",
  groomName: "Hassan Yakabu Ababakar",
  groomNick: "Mal. Hassan",
  brideName: "Aisha Umar Ali",
  brideNick: "Ameerah",
  eventDate: "Saturday, 12th December, 2026",
  eventTime: "10:00 AM",
  venueLabel: "VENUE",
  venueAddress: "09. Waziri Malle Residence. Palace Way, Turaki (A), Jalingo.",
  receptionNote: "Reception follows immediately",
  rsvpLabel: "RSVP",
  rsvpNumbers: ["07068647965", "08130365373", "08061932522"],
  themeColor: "gold",
  mosqueTheme: "auto",
  mosqueDisplayMode: "both",
  mosquePhotos: { ...DEFAULT_MOSQUE_PHOTOS },
  mosquePhotoOpacity: 0.38,
  mosquePhotoBlur: 0.8,
  baroqueMonogram: "",
  baroqueQuranArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
  baroqueQuranTranslation: '"And We created you in pairs"',
  baroqueForeverTitle: "WE HAVE DECIDED ON",
  baroqueForeverQuote: "Forever",
  baroqueValimaTitle: "Insha Allah Valima:",
  baroqueValimaDate: "Tuesday 14 October 2025",
  baroqueValimaVenue: "Anjuman Shadi Sabha Mahal, Behind Nayara Petroleum, Masur",
  oliveMonogram: "",
  oliveQuranQuote: "AND WE CREATED YOU IN PAIRS",
  oliveQuranRef: "[QURAN 78:8]",
  oliveNikahTime: "AT 04:00PM",
  oliveReceptionTime: "AT 07:00PM",
  oliveReceptionVenue: "@ FATHIMA'S HOUSE KAPPAD",
  oliveVenueTitle: "VENUE",
  oliveFinaleText: "INSHA ALLAH",
};

export default function App() {
  const [invitationData, setInvitationData] = useState<InvitationData>(DEFAULT_INVITATION_DATA);
  const [activeTab, setActiveTab] = useState<"editor" | "templates" | "mosques" | "music" | "analyzer" | "share">("editor");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyPartial = (updates: Partial<InvitationData>) => {
    setInvitationData((prev) => ({
      ...prev,
      ...updates,
    }));
    showToast("Updated video invitation text with Gemini Pro extracted details!");
    setActiveTab("editor");
  };

  const resetToDefault = () => {
    setInvitationData(DEFAULT_INVITATION_DATA);
    showToast("Reset to Hassan & Aisha Wedding Fatiha details.");
  };

  const handleWhatsAppShare = () => {
    const text = `*Wedding Fatiha Invitation* 💍\n\nTHE FAMILIES OF\n*${invitationData.familyLateFather}*\nAND\n*${invitationData.familySecondFather}*\n\nCordially invite you to the Wedding Fatiha of their children:\n*${invitationData.groomName}* (${invitationData.groomNick})\n&\n*${invitationData.brideName}* (${invitationData.brideNick})\n\n📅 *DATE:* ${invitationData.eventDate}\n⏰ *TIME:* ${invitationData.eventTime}\n📍 *VENUE:* ${invitationData.venueAddress}\n✨ ${invitationData.receptionNote}\n\n📞 *RSVP:* ${invitationData.rsvpNumbers.join(", ")}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#141210] via-[#100e0d] to-[#0a0908] text-[#f7f3eb] flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#2a221a] bg-[#171412]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c5a059] to-[#8a6e38] flex items-center justify-center shadow-lg shadow-[#c5a059]/20 border border-[#e8d2a5]/30">
              <Heart className="w-5 h-5 text-[#1a140c] fill-[#1a140c]" />
            </div>
            <div>
              <h1 className="text-base font-semibold font-luxury text-[#f2e5d0] leading-tight">
                Wedding Fatiha Video Studio
              </h1>
              <p className="text-[11px] text-[#9e8f7e]">
                Hassan & Aisha • Saturday, 12th Dec 2026 • Jalingo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Direct Download Video CTA */}
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#b58735] via-[#dfb969] to-[#c5a059] text-xs font-semibold text-[#1a140b] shadow-md shadow-[#c5a059]/20 hover:brightness-105 active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-[#1a140b]" />
              <span>Download Video</span>
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#231d17] hover:bg-[#332a21] text-xs font-medium text-[#e2d5c3] border border-[#3d3124] transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-[#c5a059]" />
              <span className="hidden sm:inline">Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Vertical Video Player & Animation Stage */}
          <div className="lg:col-span-5 flex flex-col items-center">
            {/* Quick Template Switcher Pills */}
            <div className="w-full flex items-center justify-between gap-1.5 p-1.5 mb-3 rounded-2xl bg-[#1c1713] border border-[#35291e] shadow-sm">
              <button
                type="button"
                onClick={() => setInvitationData((prev) => ({ ...prev, templateStyle: "goldenBokeh" }))}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  (invitationData.templateStyle || "goldenBokeh") === "goldenBokeh"
                    ? "bg-gradient-to-r from-[#f59e0b] via-[#d97706] to-[#78350f] text-white font-bold shadow-md ring-1 ring-amber-300/40"
                    : "text-[#a89785] hover:text-[#f4e8da] hover:bg-[#27201a]"
                }`}
                title="Cinematic Golden Bokeh with particle heart & couple spotlight"
              >
                <span>✨</span>
                <span className="truncate">Golden Bokeh</span>
              </button>

              <button
                type="button"
                onClick={() => setInvitationData((prev) => ({ ...prev, templateStyle: "calligraphyPen" }))}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  invitationData.templateStyle === "calligraphyPen"
                    ? "bg-gradient-to-r from-[#d4af37] to-[#967424] text-[#140e06] font-bold shadow-md ring-1 ring-[#fce4a6]/40"
                    : "text-[#a89785] hover:text-[#f4e8da] hover:bg-[#27201a]"
                }`}
                title="Realistic handwriting fountain pen"
              >
                <span>🖋️</span>
                <span className="truncate">Calligraphy Pen</span>
              </button>

              <button
                type="button"
                onClick={() => setInvitationData((prev) => ({ ...prev, templateStyle: "royalEnvelope" }))}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  invitationData.templateStyle === "royalEnvelope"
                    ? "bg-gradient-to-r from-[#c5a059] to-[#88692c] text-[#140e06] font-bold shadow-md ring-1 ring-[#fce4a6]/40"
                    : "text-[#a89785] hover:text-[#f4e8da] hover:bg-[#27201a]"
                }`}
                title="Classic ivory & gold envelope with flying butterfly"
              >
                <span>✉️</span>
                <span className="truncate">3D Envelope</span>
              </button>
            </div>

            <div className="w-full flex items-center justify-between mb-2.5 px-2">
              <div className="flex items-center gap-1.5 text-xs text-[#d5c5b2] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Video Preview (9:16)
              </div>
              <div className="text-[11px] text-[#998776]">
                {invitationData.templateStyle === "goldenBokeh"
                  ? "Golden Heart, Couple Spotlights & Interlocking Rings"
                  : invitationData.templateStyle === "calligraphyPen"
                  ? "Realistic Fountain Pen & Sacred Mosque Backdrop"
                  : "Interactive 3D Envelope & Butterfly"}
              </div>
            </div>

            <InvitationVideoPlayer
              data={invitationData}
              onShareClick={handleWhatsAppShare}
              onDownloadClick={() => setIsDownloadModalOpen(true)}
              onAudioClick={() => setActiveTab("music")}
            />

            {/* Quick Backdrop Switcher for Calligraphy Pen & Golden Bokeh Templates */}
            {(invitationData.templateStyle === "calligraphyPen" ||
              invitationData.templateStyle === "goldenBokeh" ||
              !invitationData.templateStyle) && (
              <div className="w-full mt-3 p-3 rounded-2xl bg-[#1a1510]/95 border border-[#382d21] shadow-md">
                <CalligraphyBgSelector
                  data={invitationData}
                  onChange={setInvitationData}
                  compact={true}
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Tab Navigation & Tools */}
          <div className="lg:col-span-7 space-y-4">
            {/* Tab Selector Buttons */}
            <div className="flex flex-wrap items-center p-1 rounded-xl bg-[#1d1814] border border-[#30261c] text-xs gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("templates")}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "templates"
                    ? "bg-[#c5a059] text-[#1c150c] shadow-md font-semibold"
                    : "text-[#b09e8c] hover:text-[#f0e2d1]"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "editor"
                    ? "bg-[#c5a059] text-[#1c150c] shadow-md font-semibold"
                    : "text-[#b09e8c] hover:text-[#f0e2d1]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Text Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("mosques")}
                className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "mosques"
                    ? "bg-[#c5a059] text-[#1c150c] shadow-md font-semibold"
                    : "text-[#b09e8c] hover:text-[#f0e2d1]"
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Real Mosques</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("music")}
                className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "music"
                    ? "bg-[#c5a059] text-[#1c150c] shadow-md font-semibold"
                    : "text-[#b09e8c] hover:text-[#f0e2d1]"
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Audio Track</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("analyzer")}
                className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "analyzer"
                    ? "bg-[#c5a059] text-[#1c150c] shadow-md font-semibold"
                    : "text-[#b09e8c] hover:text-[#f0e2d1]"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini AI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("share")}
                className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === "share"
                    ? "bg-[#c5a059] text-[#1c150c] shadow-md font-semibold"
                    : "text-[#b09e8c] hover:text-[#f0e2d1]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>RSVP & Share</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all bg-[#2a221a] hover:bg-[#382d23] text-[#f2e5d0] border border-[#443525]"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Download</span>
              </button>
            </div>

            {/* TAB 0: TEMPLATE SELECTOR */}
            {activeTab === "templates" && (
              <div className="p-5 rounded-2xl bg-[#1d1814] border border-[#382d22] shadow-xl space-y-4">
                <TemplateSelector
                  currentStyle={invitationData.templateStyle || "calligraphyPen"}
                  onSelect={(style) => {
                    setInvitationData((prev) => ({ ...prev, templateStyle: style }));
                    showToast(
                      `Switched to ${
                        style === "calligraphyPen"
                          ? "Calligraphy Pen"
                          : style === "emeraldLantern"
                          ? "Emerald Lanterns"
                          : "Royal 3D Envelope"
                      }!`
                    );
                  }}
                />
              </div>
            )}

            {/* TAB 1: TEXT CUSTOMIZER */}
            {activeTab === "editor" && (
              <TextCustomizer
                data={invitationData}
                onChange={setInvitationData}
                onReset={resetToDefault}
                onDownloadClick={() => setIsDownloadModalOpen(true)}
                onAudioClick={() => setActiveTab("music")}
                onOpenMosquePhotos={() => setActiveTab("mosques")}
              />
            )}

            {/* TAB 2: REAL MOSQUE PHOTOGRAPHY MANAGER */}
            {activeTab === "mosques" && (
              <MosquePhotoManager
                data={invitationData}
                onChange={setInvitationData}
                onPreviewScene={(timestamp) => {
                  showToast("Jumped to sacred mosque scene!");
                }}
              />
            )}

            {/* TAB 2: BACKGROUND AUDIO & MUSIC UPLOADER */}
            {activeTab === "music" && (
              <AudioUploader
                onAudioChanged={() => showToast("Updated background audio track!")}
              />
            )}

            {/* TAB 3: GEMINI 3.1 PRO VIDEO UNDERSTANDING */}
            {activeTab === "analyzer" && (
              <GeminiVideoAnalyzer
                currentData={invitationData}
                onApplyData={handleApplyPartial}
              />
            )}

            {/* TAB 3: SHARE & RSVP DETAILS */}
            {activeTab === "share" && (
              <div className="bg-[#1b1815]/90 border border-[#332a21] rounded-2xl p-5 text-[#ebe5db] space-y-5 shadow-xl backdrop-blur-sm">
                <div>
                  <h2 className="text-lg font-semibold font-luxury text-[#f2e6d0] flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#c5a059]" />
                    Distribute & Save Event
                  </h2>
                  <p className="text-xs text-[#a39482] mt-0.5">
                    Share the invitation directly with family and guests across messaging apps.
                  </p>
                </div>

                {/* Video Export Feature Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#292017] to-[#1c1611] border border-[#c5a059]/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#f4e6d3]">
                      <Film className="w-4 h-4 text-[#c5a059]" />
                      Download Video Invitation File
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#3b2d1c] text-[#dfcdb9] font-medium">
                      MP4 / WebM HD
                    </span>
                  </div>
                  <p className="text-xs text-[#b3a18e]">
                    Export the full 24-second animated video with the 3D unfolding envelope, fluttering pearlescent butterfly, and romantic harp soundtrack.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#b58735] via-[#dfb969] to-[#c5a059] text-[#1c150c] font-semibold text-xs transition-all shadow-md shadow-[#c5a059]/20 hover:brightness-105 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Open Video Downloader
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#231d17] border border-[#382b1e] space-y-3">
                  <div className="text-xs font-semibold text-[#f0e3d2]">
                    Quick WhatsApp / SMS Text
                  </div>
                  <div className="p-3 rounded-lg bg-[#17130f] border border-[#312519] text-xs font-mono text-[#dcd0bf] whitespace-pre-wrap">
                    {`THE FAMILIES OF Late. Mal. Yakubu Abubakar Muhammad AND Mal. Umar Ali Umar (Maimuri) cordially invite you to the Wedding Fatiha of their children:\n\n👰 Aisha Umar Ali (Ameerah)\n🤵 Hassan Yakabu Ababakar (Mal. Hassan)\n\n📍 VENUE: 09. Waziri Malle Residence. Palace Way, Turaki (A), Jalingo.\n📅 DATE: Saturday, 12th December, 2026\n⏰ TIME: 10:00 AM\n✨ Reception follows immediately\n\nRSVP: ${invitationData.rsvpNumbers.join(" • ")}`}
                  </div>
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
                  >
                    <Share2 className="w-4 h-4" />
                    Send via WhatsApp
                  </button>
                </div>

                {/* Event Summary Card */}
                <div className="p-4 rounded-xl bg-[#231d17] border border-[#382b1e] text-xs space-y-2">
                  <div className="font-semibold text-[#f2e5d3] text-sm">
                    Event Summary
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[#cfc0ae]">
                    <div>
                      <span className="text-[#968472] block">Event:</span>
                      Wedding Fatiha
                    </div>
                    <div>
                      <span className="text-[#968472] block">Date:</span>
                      12th December 2026
                    </div>
                    <div>
                      <span className="text-[#968472] block">City:</span>
                      Jalingo, Taraba State
                    </div>
                    <div>
                      <span className="text-[#968472] block">Time:</span>
                      10:00 AM
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Video Download Modal */}
      <VideoDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        data={invitationData}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#241c14] border border-[#c5a059] text-xs text-[#f4ebdc] shadow-2xl">
            <Check className="w-4 h-4 text-[#c5a059]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#231b14] py-4 text-center text-xs text-[#807060]">
        Wedding Fatiha of Hassan Yakabu Ababakar & Aisha Umar Ali • Saturday, 12th December, 2026
      </footer>
    </div>
  );
}
