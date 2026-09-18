import React, { useState } from "react";
import {
  Edit3,
  Copy,
  Check,
  Calendar,
  RotateCcw,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  Users,
  Phone,
  BookOpen,
  Download,
  Music,
  Landmark,
  Upload,
  Camera,
  Crown,
} from "lucide-react";
import { InvitationData } from "../types";
import { TemplateSelector } from "./TemplateSelector";
import { CalligraphyBgSelector } from "./CalligraphyBgSelector";
import { getCoupleMonogram } from "../utils/monogramHelper";

interface TextCustomizerProps {
  data: InvitationData;
  onChange: (newData: InvitationData) => void;
  onReset: () => void;
  onDownloadClick?: () => void;
  onAudioClick?: () => void;
  onOpenMosquePhotos?: () => void;
}

export const TextCustomizer: React.FC<TextCustomizerProps> = ({
  data,
  onChange,
  onReset,
  onDownloadClick,
  onAudioClick,
  onOpenMosquePhotos,
}) => {
  const [copied, setCopied] = useState(false);
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);

  const updateField = <K extends keyof InvitationData>(key: K, val: InvitationData[K]) => {
    onChange({
      ...data,
      [key]: val,
    });
  };

  const handleRsvpChange = (index: number, val: string) => {
    const updated = [...data.rsvpNumbers];
    updated[index] = val;
    updateField("rsvpNumbers", updated);
  };

  const addRsvpNumber = () => {
    updateField("rsvpNumbers", [...data.rsvpNumbers, ""]);
  };

  const removeRsvpNumber = (index: number) => {
    if (data.rsvpNumbers.length <= 1) return;
    const updated = data.rsvpNumbers.filter((_, i) => i !== index);
    updateField("rsvpNumbers", updated);
  };

  // Copy full wedding invitation text
  const copyFullText = () => {
    const fullText = `${data.bismillah ? data.bismillahText + "\n\n" : ""}${data.familyIntro}
${data.familyLateFather} AND ${data.familySecondFather}
${data.invitationPhrase}
${data.eventHeading} of their children:
${data.groomName} (${data.groomNick})
&
${data.brideName} (${data.brideNick})

VENUE: ${data.venueAddress}
DATE: ${data.eventDate} | TIME: ${data.eventTime}
${data.receptionNote}

RSVP: ${data.rsvpNumbers.join(", ")}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download .ics calendar event
  const downloadCalendarFile = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding Fatiha Invitation//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:wedding-fatiha-hassan-aisha-20261212@studio
DTSTAMP:20260916T000000Z
DTSTART:20261212T090000Z
DTEND:20261212T150000Z
SUMMARY:Wedding Fatiha: Hassan Yakabu Ababakar & Aisha Umar Ali
DESCRIPTION:The families of Late. Mal. Yakubu Abubakar Muhammad and Mal. Umar Ali Umar (Maimuri) cordially invite you to the Wedding Fatiha of their children Hassan & Aisha.\\n\\nVenue: 09. Waziri Malle Residence. Palace Way, Turaki (A), Jalingo.\\nReception follows immediately.\\nRSVP: ${data.rsvpNumbers.join(", ")}
LOCATION:09. Waziri Malle Residence, Palace Way, Turaki (A), Jalingo
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Wedding_Fatiha_Hassan_and_Aisha.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCalendarDownloaded(true);
    setTimeout(() => setCalendarDownloaded(false), 2500);
  };

  return (
    <div className="bg-[#1b1815]/90 border border-[#332a21] rounded-2xl p-5 text-[#ebe5db] space-y-6 shadow-xl backdrop-blur-sm">
      {/* Header with Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30261c] pb-4">
        <div>
          <h2 className="text-lg font-semibold font-luxury text-[#f2e6d0] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#c5a059]" />
            Video Text & Details Editor
          </h2>
          <p className="text-xs text-[#a39482] mt-0.5">
            Modify any text in the video invitation in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onDownloadClick && (
            <button
              type="button"
              onClick={onDownloadClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d9b366] text-xs font-semibold text-[#1c150c] transition-colors shadow-sm"
              title="Download Invitation Video"
            >
              <Download className="w-3.5 h-3.5 text-[#1c150c]" />
              <span>Download Video</span>
            </button>
          )}

          <button
            type="button"
            onClick={copyFullText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27211b] hover:bg-[#382f26] text-xs font-medium text-[#dfd0be] transition-colors border border-[#3d3227]"
            title="Copy invitation message to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#c5a059]" />}
            <span>{copied ? "Copied!" : "Copy Text"}</span>
          </button>

          <button
            type="button"
            onClick={downloadCalendarFile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27211b] hover:bg-[#382f26] text-xs font-medium text-[#dfd0be] transition-colors border border-[#3d3227]"
            title="Download Calendar (.ics) event"
          >
            {calendarDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />}
            <span>{calendarDownloaded ? "Added!" : "Save Date"}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="p-1.5 rounded-lg bg-[#27211b] hover:bg-[#382f26] text-[#b8a691] hover:text-white transition-colors border border-[#3d3227]"
            title="Reset to default requested text"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Background Audio Quick Banner */}
      {onAudioClick && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-gradient-to-r from-[#292017] to-[#1f1913] border border-[#443524] text-xs">
          <div className="flex items-center gap-2.5 text-[#e2d2bd]">
            <div className="w-7 h-7 rounded-lg bg-[#3b2d1c] flex items-center justify-center text-[#c5a059] shrink-0">
              <Music className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold block text-[#f4e7d4]">Background Sound & Music</span>
              <span className="text-[11px] text-[#9c8976]">Upload a custom MP3/WAV track or choose an instrumental preset</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onAudioClick}
            className="px-3 py-1.5 rounded-lg bg-[#3a2d1d] hover:bg-[#4d3c27] text-[#c5a059] font-semibold text-[11px] transition-colors flex items-center gap-1 ml-auto"
          >
            <span>Upload Sound</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Template Style Selector */}
      <div className="p-4 rounded-xl bg-[#231d17]/80 border border-[#3d3124] shadow-sm">
        <TemplateSelector
          currentStyle={data.templateStyle || "calligraphyPen"}
          onSelect={(style) => updateField("templateStyle", style)}
        />
      </div>

      {/* Dedicated 4th Option Text Customizer for Royal Baroque Tablescape */}
      {data.templateStyle === "baroqueTablescape" && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#251e17] via-[#1d1712] to-[#17120e] border border-[#c5a059]/60 shadow-lg shadow-[#c5a059]/10 space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#3d3023] pb-2.5">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#c5a059]" />
              <div>
                <h4 className="font-semibold text-[#f5ebd7] text-sm font-luxury">
                  4th Option: Baroque Tablescape Text Editor
                </h4>
                <p className="text-[10px] text-[#a89582]">
                  Customize and replace all text appearing across the 11 scenes
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onChange({
                  ...data,
                  groomName: "Abdul Shakeeb",
                  groomNick: "Shakeeb",
                  brideName: "Saniya",
                  brideNick: "Saniya",
                  eventDate: "13 OCTOBER 2025",
                  eventTime: "11:30 AM",
                  venueAddress: "'AMBEDKAR BHAVAN' Near Kadamandalagi Road, Behind Bus-Depot, Byadgi",
                  baroqueMonogram: "",
                  baroqueForeverTitle: "WE HAVE DECIDED ON",
                  baroqueForeverQuote: "Forever",
                  baroqueQuranArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
                  baroqueQuranTranslation: '"And We created you in pairs"',
                  baroqueValimaTitle: "Insha Allah Valima:",
                  baroqueValimaDate: "Tuesday 14 October 2025",
                  baroqueValimaVenue: "Anjuman Shadi Sabha Mahal, Behind Nayara Petroleum, Masur",
                });
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#33271b] hover:bg-[#473624] text-[#f4dca6] border border-[#c5a059]/50 transition-colors shadow-sm"
              title="Auto-fill with exact sample text from the wedding video"
            >
              Fill Video Sample Text
            </button>
          </div>

          {/* 1. Monogram Crest & Medallion Names */}
          {(() => {
            const autoMonogram = getCoupleMonogram({
              groomName: data.groomName,
              groomNick: data.groomNick,
              brideName: data.brideName,
              brideNick: data.brideNick,
            });
            const activeMonogram = data.baroqueMonogram && data.baroqueMonogram.trim() !== ""
              ? data.baroqueMonogram.trim().toUpperCase()
              : autoMonogram;

            return (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#ddcebb] block">
                  1. Royal Monogram & Medallion Names
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-[#9c8b78] block">Monogram Initials</span>
                      {data.baroqueMonogram && data.baroqueMonogram.trim() !== "" && (
                        <button
                          type="button"
                          onClick={() => updateField("baroqueMonogram", "")}
                          className="text-[9px] text-[#c5a059] hover:underline"
                          title="Reset to 1st letters of Groom & Bride"
                        >
                          Auto ({autoMonogram})
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={data.baroqueMonogram || ""}
                      onChange={(e) => updateField("baroqueMonogram", e.target.value.toUpperCase())}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#f4dca6] text-center font-bold tracking-widest text-sm focus:outline-none focus:border-[#c5a059]"
                      placeholder={autoMonogram}
                    />
                    <span className="text-[9px] text-[#8c7b6c] block mt-0.5 text-center">
                      Active: <strong className="text-[#f4dca6]">{activeMonogram}</strong>
                      {!data.baroqueMonogram ? ` (1st letters of couple)` : ` (Custom)`}
                    </span>
                  </div>

              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Groom Medallion</span>
                <input
                  type="text"
                  value={data.groomNick || data.groomName || ""}
                  onChange={(e) => updateField("groomNick", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder="Shakeeb"
                />
              </div>

              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Bride Medallion</span>
                <input
                  type="text"
                  value={data.brideNick || data.brideName || ""}
                  onChange={(e) => updateField("brideNick", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder="Saniya"
                />
              </div>
            </div>
          </div>
        );
      })()}

          {/* 2. Plaque Title & Quote ("Forever") */}
          <div className="space-y-2 pt-1 border-t border-[#382c20]/60">
            <label className="text-[11px] font-semibold text-[#ddcebb] block">
              2. Ornate Die-Cut Plaque (Scene 4)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Plaque Title</span>
                <input
                  type="text"
                  value={data.baroqueForeverTitle || "WE HAVE DECIDED ON"}
                  onChange={(e) => updateField("baroqueForeverTitle", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder="WE HAVE DECIDED ON"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Calligraphic Quote</span>
                <input
                  type="text"
                  value={data.baroqueForeverQuote || "Forever"}
                  onChange={(e) => updateField("baroqueForeverQuote", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder="Forever"
                />
              </div>
            </div>
          </div>

          {/* 3. Gold Miniature Easel: Quranic Verse */}
          <div className="space-y-2 pt-1 border-t border-[#382c20]/60">
            <label className="text-[11px] font-semibold text-[#ddcebb] block">
              3. Gold Easel Quranic Verse (Scene 5)
            </label>
            <div className="space-y-1.5">
              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Arabic Calligraphy</span>
                <input
                  type="text"
                  value={data.baroqueQuranArabic || "وَخَلَقْنَاكُمْ أَزْوَاجًا"}
                  onChange={(e) => updateField("baroqueQuranArabic", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] text-right text-sm font-arabic focus:outline-none focus:border-[#c5a059]"
                  placeholder="وَخَلَقْنَاكُمْ أَزْوَاجًا"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">English Translation</span>
                <input
                  type="text"
                  value={data.baroqueQuranTranslation || '"And We created you in pairs"'}
                  onChange={(e) => updateField("baroqueQuranTranslation", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder='"And We created you in pairs"'
                />
              </div>
            </div>
          </div>

          {/* 4. Valima / Reception Plaque */}
          <div className="space-y-2 pt-1 border-t border-[#382c20]/60">
            <label className="text-[11px] font-semibold text-[#ddcebb] block">
              4. Valima / Reception Easel (Scene 10)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Valima Heading</span>
                <input
                  type="text"
                  value={data.baroqueValimaTitle || "Insha Allah Valima:"}
                  onChange={(e) => updateField("baroqueValimaTitle", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder="Insha Allah Valima:"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#9c8b78] block mb-0.5">Valima Date</span>
                <input
                  type="text"
                  value={data.baroqueValimaDate || "Tuesday 14 October 2025"}
                  onChange={(e) => updateField("baroqueValimaDate", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                  placeholder="Tuesday 14 October 2025"
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-[#9c8b78] block mb-0.5">Valima Venue Address</span>
              <input
                type="text"
                value={data.baroqueValimaVenue || "Anjuman Shadi Sabha Mahal, Behind Nayara Petroleum, Masur"}
                onChange={(e) => updateField("baroqueValimaVenue", e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                placeholder="Anjuman Shadi Sabha Mahal, Behind Nayara Petroleum, Masur"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dedicated 5th Option Text Customizer for Aesthetic Olive Tablescape */}
      {data.templateStyle === "oliveRusticTablescape" && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#1b2b1d] via-[#142216] to-[#0d170f] border border-[#527a56]/60 shadow-lg shadow-[#1b2b1d]/20 space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#2d4730] pb-2.5">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#85b58a]" />
              <div>
                <h4 className="font-semibold text-[#f0f7f1] text-sm font-luxury">
                  5th Option: Aesthetic Olive Tablescape Text Editor
                </h4>
                <p className="text-[10px] text-[#93a895]">
                  Customize cards, open book, calligraphy quote & reception details
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onChange({
                  ...data,
                  groomName: "MUHAMMAD ARSHAD",
                  groomNick: "Arshad",
                  brideName: "FATHIMA AL BATOOL",
                  brideNick: "Batool",
                  eventDate: "17TH NOVEMBER 2024",
                  eventTime: "04:00 PM",
                  venueAddress: "PURAKKATTIRI JUMA MASJID",
                  oliveMonogram: "",
                  oliveQuranQuote: "AND WE CREATED YOU IN PAIRS",
                  oliveQuranRef: "[QURAN 78:8]",
                  oliveNikahTime: "AT 04:00PM",
                  oliveReceptionTime: "AT 07:00PM",
                  oliveReceptionVenue: "@ FATHIMA'S HOUSE KAPPAD",
                  oliveVenueTitle: "VENUE",
                  oliveFinaleText: "INSHA ALLAH",
                });
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#223924] hover:bg-[#2e4d31] text-[#c9e8cb] border border-[#527a56]/60 transition-colors shadow-sm"
              title="Auto-fill with exact sample text from the 5th wedding video"
            >
              Fill 5th Video Sample Text
            </button>
          </div>

          {/* 1. Monogram Initials & Names */}
          {(() => {
            const autoMonogram = getCoupleMonogram({
              groomName: data.groomName,
              groomNick: data.groomNick,
              brideName: data.brideName,
              brideNick: data.brideNick,
            });
            const activeMonogram = data.oliveMonogram && data.oliveMonogram.trim() !== ""
              ? data.oliveMonogram.trim().toUpperCase()
              : autoMonogram;

            return (
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-[#cfe0d0] block">
                  1. Monogram Initials & Couple Names
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-[#8ea891] block">Monogram Initials</span>
                      {data.oliveMonogram && data.oliveMonogram.trim() !== "" && (
                        <button
                          type="button"
                          onClick={() => updateField("oliveMonogram", "")}
                          className="text-[9px] text-[#91bf95] hover:underline"
                        >
                          Auto ({autoMonogram})
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      maxLength={4}
                      value={activeMonogram}
                      onChange={(e) => updateField("oliveMonogram", e.target.value.toUpperCase())}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] text-center font-bold font-serif focus:outline-none focus:border-[#679f6c]"
                      placeholder={autoMonogram}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8ea891] block mb-0.5">Groom Name</span>
                    <input
                      type="text"
                      value={data.groomName}
                      onChange={(e) => updateField("groomName", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                      placeholder="MUHAMMAD ARSHAD"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8ea891] block mb-0.5">Bride Name</span>
                    <input
                      type="text"
                      value={data.brideName}
                      onChange={(e) => updateField("brideName", e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                      placeholder="FATHIMA AL BATOOL"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 2. Schedule & Reception */}
          <div className="space-y-2 pt-1 border-t border-[#253b27]">
            <label className="text-[11px] font-semibold text-[#cfe0d0] block">
              2. Date, Ceremony & Reception
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Wedding Date</span>
                <input
                  type="text"
                  value={data.eventDate}
                  onChange={(e) => updateField("eventDate", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="17TH NOVEMBER 2024"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Nikkah Ceremony Time</span>
                <input
                  type="text"
                  value={data.oliveNikahTime || "AT 04:00PM"}
                  onChange={(e) => updateField("oliveNikahTime", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="AT 04:00PM"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Reception Time</span>
                <input
                  type="text"
                  value={data.oliveReceptionTime || "AT 07:00PM"}
                  onChange={(e) => updateField("oliveReceptionTime", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="AT 07:00PM"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Nikkah Venue</span>
                <input
                  type="text"
                  value={data.venueAddress}
                  onChange={(e) => updateField("venueAddress", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="PURAKKATTIRI JUMA MASJID"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Reception Venue</span>
                <input
                  type="text"
                  value={data.oliveReceptionVenue || "@ FATHIMA'S HOUSE KAPPAD"}
                  onChange={(e) => updateField("oliveReceptionVenue", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="@ FATHIMA'S HOUSE KAPPAD"
                />
              </div>
            </div>
          </div>

          {/* 3. Quran Quote & Finale */}
          <div className="space-y-2 pt-1 border-t border-[#253b27]">
            <label className="text-[11px] font-semibold text-[#cfe0d0] block">
              3. Quran Verse & Finale Text
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="sm:col-span-2">
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Quran Quote</span>
                <input
                  type="text"
                  value={data.oliveQuranQuote || "AND WE CREATED YOU IN PAIRS"}
                  onChange={(e) => updateField("oliveQuranQuote", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="AND WE CREATED YOU IN PAIRS"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#8ea891] block mb-0.5">Finale Blessing</span>
                <input
                  type="text"
                  value={data.oliveFinaleText || "INSHA ALLAH"}
                  onChange={(e) => updateField("oliveFinaleText", e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0f1a10] border border-[#2d4730] text-[#e8f5e9] focus:outline-none focus:border-[#679f6c]"
                  placeholder="INSHA ALLAH"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Customizer for Cinematic & Calligraphy Templates */}
      {(data.templateStyle === "calligraphyPen" ||
        data.templateStyle === "goldenBokeh" ||
        !data.templateStyle) && (
        <CalligraphyBgSelector
          data={data}
          onChange={onChange}
        />
      )}

      {/* Accordion / Sections */}
      <div className="space-y-4 text-xs">
        {/* Islamic Header / Bismillah */}
        <div className="p-3 rounded-xl bg-[#231d17]/60 border border-[#382c20]">
          <div className="flex items-center justify-between mb-2">
            <label className="font-semibold text-[#ddcebb] flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#c5a059]" />
              Islamic Opening Blessing (Bismillah)
            </label>
            <input
              type="checkbox"
              checked={data.bismillah}
              onChange={(e) => updateField("bismillah", e.target.checked)}
              className="rounded bg-[#1a1511] border-[#443628] text-[#c5a059] focus:ring-0 cursor-pointer"
            />
          </div>
          {data.bismillah && (
            <input
              type="text"
              value={data.bismillahText}
              onChange={(e) => updateField("bismillahText", e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059] font-luxury text-sm"
              placeholder="بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
            />
          )}
        </div>

        {/* The Families Section */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2.5">
          <div className="font-semibold text-[#ddcebb] flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-[#c5a059]" />
            The Host Families
          </div>

          <div>
            <label className="text-[11px] text-[#9c8b78] block mb-1">Intro Phrase</label>
            <input
              type="text"
              value={data.familyIntro}
              onChange={(e) => updateField("familyIntro", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#9c8b78] block mb-1">First Family / Father</label>
            <input
              type="text"
              value={data.familyLateFather}
              onChange={(e) => updateField("familyLateFather", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#9c8b78] block mb-1">Second Family / Father</label>
            <input
              type="text"
              value={data.familySecondFather}
              onChange={(e) => updateField("familySecondFather", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#9c8b78] block mb-1">Invitation Line</label>
            <input
              type="text"
              value={data.invitationPhrase}
              onChange={(e) => updateField("invitationPhrase", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* The Couple (Groom & Bride) */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2.5">
          <div className="font-semibold text-[#ddcebb] flex items-center gap-2 mb-1">
            <Heart className="w-3.5 h-3.5 text-[#c5a059]" />
            The Couple (Groom & Bride)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-[#9c8b78] block mb-1">Groom Name</label>
              <input
                type="text"
                value={data.groomName}
                onChange={(e) => updateField("groomName", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9c8b78] block mb-1">Groom Title / Nick</label>
              <input
                type="text"
                value={data.groomNick}
                onChange={(e) => updateField("groomNick", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-[#9c8b78] block mb-1">Bride Name</label>
              <input
                type="text"
                value={data.brideName}
                onChange={(e) => updateField("brideName", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9c8b78] block mb-1">Bride Title / Nick</label>
              <input
                type="text"
                value={data.brideNick}
                onChange={(e) => updateField("brideNick", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Bride & Groom Portrait Photos (Special for Cinematic Bokeh & Spotlight Templates) */}
          <div className="pt-2 border-t border-[#382c20]/60">
            <div className="text-[11px] font-medium text-[#c5a059] flex items-center gap-1.5 mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Portrait Photos (For Cinematic Spotlight Scenes)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Groom Photo */}
              <div className="p-2.5 rounded-lg bg-[#1a1510] border border-[#3b2e21] flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c5a059]/60 shrink-0 bg-black/40">
                  <img
                    src={data.groomPhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=900&auto=format&fit=crop"}
                    alt="Groom"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] text-[#9c8b78] block">Groom Photo</label>
                  <label className="inline-flex items-center gap-1 mt-1 text-[11px] text-[#c5a059] hover:text-[#ffd875] cursor-pointer font-medium">
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const r = new FileReader();
                          r.onload = (ev) => updateField("groomPhotoUrl", ev.target?.result as string);
                          r.readAsDataURL(f);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Bride Photo */}
              <div className="p-2.5 rounded-lg bg-[#1a1510] border border-[#3b2e21] flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-[#c5a059]/60 shrink-0 bg-black/40">
                  <img
                    src={data.bridePhotoUrl || "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=900&auto=format&fit=crop"}
                    alt="Bride"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] text-[#9c8b78] block">Bride Photo</label>
                  <label className="inline-flex items-center gap-1 mt-1 text-[11px] text-[#c5a059] hover:text-[#ffd875] cursor-pointer font-medium">
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const r = new FileReader();
                          r.onload = (ev) => updateField("bridePhotoUrl", ev.target?.result as string);
                          r.readAsDataURL(f);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Venue, Date & Time */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2.5">
          <div className="font-semibold text-[#ddcebb] flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
            Event Schedule & Venue
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-[#9c8b78] block mb-1">Date</label>
              <input
                type="text"
                value={data.eventDate}
                onChange={(e) => updateField("eventDate", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#9c8b78] block mb-1">Time</label>
              <input
                type="text"
                value={data.eventTime}
                onChange={(e) => updateField("eventTime", e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-[#9c8b78] block mb-1">Venue Address</label>
            <textarea
              rows={2}
              value={data.venueAddress}
              onChange={(e) => updateField("venueAddress", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059] resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#9c8b78] block mb-1">Reception Note</label>
            <input
              type="text"
              value={data.receptionNote}
              onChange={(e) => updateField("receptionNote", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* RSVP Contacts */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-[#ddcebb] flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#c5a059]" />
              RSVP Contact Numbers
            </label>
            <button
              type="button"
              onClick={addRsvpNumber}
              className="text-[11px] text-[#c5a059] hover:text-[#e4be71] font-medium"
            >
              + Add Phone
            </button>
          </div>

          {data.rsvpNumbers.map((phone, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => handleRsvpChange(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
                placeholder="080XXXXXXXX"
              />
              {data.rsvpNumbers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRsvpNumber(idx)}
                  className="px-2 py-1 text-red-400 hover:text-red-300 font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Courtesy Sponsor Name (Especially prominent for Calligraphy Pen template) */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2">
          <label className="font-semibold text-[#ddcebb] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            Courtesy Sponsor / Presenter
          </label>
          <input
            type="text"
            value={data.courtesyName || ""}
            onChange={(e) => updateField("courtesyName", e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] focus:outline-none focus:border-[#c5a059]"
            placeholder="e.g. Alh. Isma'il."
          />
          <p className="text-[11px] text-[#9c8976]">
            Written with realistic fountain pen in Scene 5 of the Calligraphy style.
          </p>
        </div>

        {/* Royal Cinematic Theme & Palette */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2.5">
          <label className="font-semibold text-[#ddcebb] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            Cinematic Royal Theme & Palette
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => updateField("themeColor", "gold")}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                data.themeColor === "gold"
                  ? "bg-[#2e2417] border-[#c5a059] text-[#f4e6d2] shadow-sm font-semibold ring-1 ring-[#c5a059]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#c5a059] to-[#ebdcc2] border border-[#a8823d]" />
              <span className="text-[11px]">Palace Gold</span>
            </button>

            <button
              type="button"
              onClick={() => updateField("themeColor", "roseGold")}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                data.themeColor === "roseGold"
                  ? "bg-[#2e1f1f] border-[#d49999] text-[#f7e8e8] shadow-sm font-semibold ring-1 ring-[#d49999]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#c78989] to-[#ecd5cb] border border-[#a66868]" />
              <span className="text-[11px]">Rose Gold</span>
            </button>

            <button
              type="button"
              onClick={() => updateField("themeColor", "emeraldGold")}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                data.themeColor === "emeraldGold"
                  ? "bg-[#1b2b1e] border-[#8fad8f] text-[#e8f7e8] shadow-sm font-semibold ring-1 ring-[#8fad8f]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#688a68] to-[#dbebd8] border border-[#4d6b4d]" />
              <span className="text-[11px]">Emerald Royal</span>
            </button>
          </div>
        </div>

        {/* Sacred Mosque Shadow Background Selector */}
        <div className="p-3.5 rounded-xl bg-[#231d17]/60 border border-[#382c20] space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-[#ddcebb] flex items-center gap-2">
              <Landmark className="w-3.5 h-3.5 text-[#c5a059]" />
              Sacred Mosque Shadow Background
            </label>
            <span className="text-[10px] text-[#c5a059] font-medium px-2 py-0.5 rounded-full bg-[#2f2518] border border-[#4d3d29]">
              {data.mosqueTheme === "auto" || !data.mosqueTheme ? "Dynamic per Scene" : "Fixed Mosque"}
            </span>
          </div>
          <p className="text-[11px] text-[#9c8976]">
            Architectural silhouette watermark rendered in the background of each ceremony scene.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
            <button
              type="button"
              onClick={() => updateField("mosqueTheme", "auto")}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                data.mosqueTheme === "auto" || !data.mosqueTheme
                  ? "bg-[#2e2417] border-[#c5a059] text-[#f4e6d2] font-semibold ring-1 ring-[#c5a059]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#c5a059]">
                <span className="text-sm">🕌</span>
                <span className="font-bold text-[11px]">Dynamic Shows</span>
              </div>
              <span className="text-[10px] text-[#9c8b78] leading-tight">
                Nabawi, Haram, Nabawi, Aqsa, & Grand Mosque
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateField("mosqueTheme", "nabawi")}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                data.mosqueTheme === "nabawi"
                  ? "bg-[#2e2417] border-[#c5a059] text-[#f4e6d2] font-semibold ring-1 ring-[#c5a059]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#c5a059]">
                <span className="text-sm">🟢</span>
                <span className="font-bold text-[11px]">Masjid an-Nabawi</span>
              </div>
              <span className="text-[10px] text-[#9c8b78] leading-tight">
                Green Dome & Medina Minarets
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateField("mosqueTheme", "haram")}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                data.mosqueTheme === "haram"
                  ? "bg-[#2e2417] border-[#c5a059] text-[#f4e6d2] font-semibold ring-1 ring-[#c5a059]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#c5a059]">
                <span className="text-sm">🕋</span>
                <span className="font-bold text-[11px]">Masjid al-Haram</span>
              </div>
              <span className="text-[10px] text-[#9c8b78] leading-tight">
                The Holy Kaaba & Grand Minarets
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateField("mosqueTheme", "aqsa")}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                data.mosqueTheme === "aqsa"
                  ? "bg-[#2e2417] border-[#c5a059] text-[#f4e6d2] font-semibold ring-1 ring-[#c5a059]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#c5a059]">
                <span className="text-sm">✨</span>
                <span className="font-bold text-[11px]">Masjid al-Aqsa</span>
              </div>
              <span className="text-[10px] text-[#9c8b78] leading-tight">
                Golden Dome of the Rock & Arches
              </span>
            </button>

            <button
              type="button"
              onClick={() => updateField("mosqueTheme", "zayed")}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                data.mosqueTheme === "zayed"
                  ? "bg-[#2e2417] border-[#c5a059] text-[#f4e6d2] font-semibold ring-1 ring-[#c5a059]"
                  : "bg-[#17130f] border-[#382b1d] text-[#a89886] hover:text-[#e4d4be]"
              }`}
            >
              <div className="flex items-center gap-1.5 text-[#c5a059]">
                <span className="text-sm">🌙</span>
                <span className="font-bold text-[11px]">Grand Mosque</span>
              </div>
              <span className="text-[10px] text-[#9c8b78] leading-tight">
                Triple Domes & Four Corner Minarets
              </span>
            </button>
          </div>

          {onOpenMosquePhotos && (
            <div className="pt-2 border-t border-[#382b1d]">
              <button
                type="button"
                onClick={onOpenMosquePhotos}
                className="w-full py-2 px-3 rounded-xl bg-[#281f15] hover:bg-[#342718] border border-[#c5a059]/40 text-[#f4e6d2] font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Upload & Personalize Real Mosque Photography</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
