import React, { useState, useRef } from "react";
import {
  Download,
  Film,
  Sparkles,
  CheckCircle2,
  X,
  Volume2,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  Share2,
  Play,
  Music,
  Upload,
} from "lucide-react";
import { InvitationData } from "../types";
import {
  exportInvitationVideo,
  getSupportedVideoMimeType,
} from "../utils/videoExporter";
import { weddingAudio } from "../utils/audio";

interface VideoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
}

export const VideoDownloadModal: React.FC<VideoDownloadModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState("");
  const fullDuration =
    data.templateStyle === "oliveRusticTablescape"
      ? 38
      : data.templateStyle === "goldenBokeh"
      ? 54
      : data.templateStyle === "baroqueTablescape"
      ? 34
      : data.templateStyle === "calligraphyPen"
      ? 42
      : 24;
  const [completedFile, setCompletedFile] = useState<string | null>(null);
  const [completedUrl, setCompletedUrl] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(fullDuration);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [currentTrackName, setCurrentTrackName] = useState(weddingAudio.getTrackName());
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const { extension } = getSupportedVideoMimeType();

  const handleStartExport = async () => {
    setExporting(true);
    setProgress(0);
    setStageText("Initializing video canvas...");
    setCompletedFile(null);
    setCompletedUrl(null);

    try {
      const result = await exportInvitationVideo(data, {
        duration: selectedDuration,
        width: 720,
        height: 1280,
        fps: 30,
        includeAudio,
        onProgress: (p, text) => {
          setProgress(p);
          setStageText(text);
        },
      });

      if (result.success) {
        setCompletedFile(result.filename);
        if (result.blobUrl) {
          setCompletedUrl(result.blobUrl);
        }
      }
    } catch (err) {
      console.error("Video export failed", err);
      setStageText("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Instant PNG card download
  const handleDownloadPng = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Elegant background
    const grad = ctx.createLinearGradient(0, 0, 0, 1920);
    grad.addColorStop(0, "#fcf9f2");
    grad.addColorStop(0.5, "#f6efe3");
    grad.addColorStop(1, "#eee4d2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    // Gold borders
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, 1000, 1840);
    ctx.strokeStyle = "#e8d8b5";
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 960, 1800);

    // Text
    ctx.textAlign = "center";
    ctx.fillStyle = "#8a6d3b";
    ctx.font = "italic 36px 'Cormorant Garamond', serif";
    ctx.fillText(data.bismillahText, 540, 240);

    ctx.font = "600 32px 'Cinzel', serif";
    ctx.letterSpacing = "6px";
    ctx.fillStyle = "#5c4825";
    ctx.fillText(data.familyIntro, 540, 360);

    ctx.font = "italic 44px 'Cormorant Garamond', serif";
    ctx.fillStyle = "#2d2416";
    ctx.fillText(data.familyLateFather, 540, 440);
    ctx.font = "32px 'Cinzel', serif";
    ctx.fillText("AND", 540, 500);
    ctx.font = "italic 44px 'Cormorant Garamond', serif";
    ctx.fillText(data.familySecondFather, 540, 560);

    ctx.font = "italic 36px 'Cormorant Garamond', serif";
    ctx.fillStyle = "#7a633d";
    ctx.fillText(data.invitationPhrase, 540, 660);

    ctx.font = "700 82px 'Alex Brush', cursive";
    ctx.fillStyle = "#b38938";
    ctx.fillText(data.eventHeading, 540, 780);

    ctx.font = "500 30px 'Cinzel', serif";
    ctx.fillStyle = "#6e5730";
    ctx.fillText(data.childrenPhrase, 540, 860);

    ctx.font = "700 68px 'Cormorant Garamond', serif";
    ctx.fillStyle = "#1e1810";
    ctx.fillText(data.groomName, 540, 980);
    if (data.groomNick) {
      ctx.font = "italic 38px 'Cormorant Garamond', serif";
      ctx.fillStyle = "#7a633d";
      ctx.fillText(`(${data.groomNick})`, 540, 1035);
    }

    ctx.font = "italic 52px 'Alex Brush', cursive";
    ctx.fillStyle = "#c5a059";
    ctx.fillText("&", 540, 1110);

    ctx.font = "700 68px 'Cormorant Garamond', serif";
    ctx.fillStyle = "#1e1810";
    ctx.fillText(data.brideName, 540, 1200);
    if (data.brideNick) {
      ctx.font = "italic 38px 'Cormorant Garamond', serif";
      ctx.fillStyle = "#7a633d";
      ctx.fillText(`(${data.brideNick})`, 540, 1255);
    }

    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 1330);
    ctx.lineTo(740, 1330);
    ctx.stroke();

    ctx.font = "600 36px 'Cinzel', serif";
    ctx.fillStyle = "#2d2416";
    ctx.fillText(data.eventDate.toUpperCase(), 540, 1390);
    ctx.font = "500 32px 'Cinzel', serif";
    ctx.fillText(`TIME: ${data.eventTime}`, 540, 1445);

    ctx.font = "400 34px 'Cormorant Garamond', serif";
    ctx.fillStyle = "#473922";
    ctx.fillText(data.venueAddress, 540, 1530);

    ctx.font = "italic 32px 'Cormorant Garamond', serif";
    ctx.fillStyle = "#8a6d3b";
    ctx.fillText(data.receptionNote, 540, 1600);

    ctx.font = "600 28px 'Cinzel', serif";
    ctx.fillStyle = "#6e5730";
    ctx.fillText("RSVP", 540, 1690);
    ctx.font = "400 30px 'Montserrat', sans-serif";
    ctx.fillStyle = "#2d2416";
    ctx.fillText(data.rsvpNumbers.join("  •  "), 540, 1740);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wedding_Fatiha_Invitation_Card_${data.groomName.split(" ")[0]}_and_${data.brideName.split(" ")[0]}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#1a1714] border border-[#3d3124] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#ebe3d7] animate-fadeIn">
        {/* Header */}
        <div className="p-5 border-b border-[#2d241b] flex items-center justify-between bg-[#201c18]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 flex items-center justify-center border border-[#c5a059]/30">
              <Film className="w-4 h-4 text-[#c5a059]" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-luxury text-[#f2e6d2]">
                Download Wedding Invitation Video
              </h3>
              <p className="text-xs text-[#a0907e]">
                Export animated 9:16 vertical video with music & effects
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={exporting}
            className="p-1.5 rounded-lg text-[#998776] hover:text-white hover:bg-[#2b241c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Ongoing Export Progress State */}
          {exporting && (
            <div className="p-5 rounded-xl bg-[#231d17] border border-[#423424] space-y-3.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#f0e3d1] flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#c5a059] animate-spin" />
                  {stageText || "Generating video frames..."}
                </span>
                <span className="font-clean font-bold text-[#c5a059] text-sm">
                  {progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-[#17130f] rounded-full overflow-hidden p-0.5 border border-[#33281c]">
                <div
                  className="h-full bg-gradient-to-r from-[#b38938] via-[#e2be72] to-[#c5a059] rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[11px] text-[#9c8a77]">
                Capturing animated 3D envelope opening, fluttering butterfly, and Arabic typography with high-fidelity audio...
              </p>
            </div>
          )}

          {/* Completed Success Banner */}
          {completedFile && !exporting && (
            <div className="p-4 rounded-xl bg-[#1d271f] border border-emerald-600/40 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Video Download Ready!
              </div>
              <p className="text-[#bfdac4]">
                Downloaded: <span className="font-semibold text-white">{completedFile}</span>
              </p>
              {completedUrl && (
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={completedUrl}
                    download={completedFile}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Again
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Export Options & Settings */}
          {!exporting && (
            <div className="space-y-4">
              <label className="text-xs font-semibold text-[#ddcebc] block">
                Select Video Format & Length
              </label>

              {/* Option 1: Full Animated Video */}
              <div
                onClick={() => setSelectedDuration(fullDuration)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDuration === fullDuration
                    ? "bg-[#272019] border-[#c5a059] shadow-md shadow-[#c5a059]/10"
                    : "bg-[#1f1a15] border-[#33271c] hover:border-[#4a3a2a]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                    selectedDuration === fullDuration
                      ? "border-[#c5a059] bg-[#c5a059]"
                      : "border-[#665441]"
                  }`}
                >
                  {selectedDuration === fullDuration && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#18130e]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f4e6d4]">
                      Full Invitation Video ({fullDuration}s)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#33281c] text-[#dfcdb9] font-medium">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9c8a77] mt-0.5">
                    {data.templateStyle === "oliveRusticTablescape"
                      ? "Complete 38-second rustic botanical sequence: White roses, retro radio, wax seal, open vintage book with pampas & dark olive cards."
                      : data.templateStyle === "baroqueTablescape"
                      ? "Complete 34-second royal tablescape sequence: White satin vanity, groom & bride medallions, gold easel plaques & monogram plinth."
                      : data.templateStyle === "goldenBokeh"
                      ? "Complete 54-second cinematic golden bokeh: Heart animation, spotlight portraits, 3D rings, and ceremony schedule."
                      : data.templateStyle === "calligraphyPen"
                      ? "Complete 42-second handwriting sequence: Realistic executive fountain pen writing host families, title, groom & bride names, schedule, venue, courtesy sponsor, and RSVP."
                      : data.templateStyle === "emeraldLantern"
                      ? "Complete 24-second animation: Deep emerald velvet, swaying glowing lanterns, and gold arabesque cards."
                      : "Complete 24-second animation: 3D Envelope unfolding, fluttering pearlescent butterfly, both host families, ceremony details, venue & RSVP numbers."}
                  </p>
                </div>
              </div>

              {/* Option 2: Short 10s Highlight Reel */}
              <div
                onClick={() => setSelectedDuration(10)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDuration === 10
                    ? "bg-[#272019] border-[#c5a059] shadow-md shadow-[#c5a059]/10"
                    : "bg-[#1f1a15] border-[#33271c] hover:border-[#4a3a2a]"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                    selectedDuration === 10
                      ? "border-[#c5a059] bg-[#c5a059]"
                      : "border-[#665441]"
                  }`}
                >
                  {selectedDuration === 10 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#18130e]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f4e6d4]">
                      Quick WhatsApp Story / Reel (10s)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[#33281c] text-[#dfcdb9] font-medium">
                      Fast Export
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9c8a77] mt-0.5">
                    Fast 10-second version featuring envelope reveal and the bride & groom announcement.
                  </p>
                </div>
              </div>

              {/* Audio Track & Custom Sound Upload */}
              <div className="p-3.5 rounded-xl bg-[#211a14] border border-[#35281c] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#ddcebb]">
                    <Volume2 className="w-4 h-4 text-[#c5a059]" />
                    <span className="font-medium">Include Background Soundtrack</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeAudio}
                    onChange={(e) => setIncludeAudio(e.target.checked)}
                    className="rounded bg-[#17130f] border-[#443628] text-[#c5a059] focus:ring-0 cursor-pointer"
                  />
                </div>

                {includeAudio && (
                  <div className="pt-2 border-t border-[#312519] flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-[#a89785] truncate max-w-[200px]">
                      <Music className="w-3.5 h-3.5 text-[#c5a059] shrink-0" />
                      <span className="truncate">{currentTrackName}</span>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*,.mp3,.wav,.m4a,.aac"
                      className="hidden"
                      onChange={async (e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setUploadingAudio(true);
                          const res = await weddingAudio.loadCustomAudioFile(f);
                          if (res.success) {
                            setCurrentTrackName(res.name);
                          }
                          setUploadingAudio(false);
                        }
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAudio}
                      className="px-2.5 py-1 rounded-lg bg-[#2e2318] hover:bg-[#3d3021] text-[#e0cfb8] border border-[#483726] transition-colors flex items-center gap-1 font-medium"
                    >
                      <Upload className="w-3 h-3 text-[#c5a059]" />
                      <span>{uploadingAudio ? "Loading..." : "Change Audio"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Alternative: Instant High-Res Image Card */}
          {!exporting && (
            <div className="pt-2 border-t border-[#2b2218] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#ddcebc] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
                  Need a Still Image Card instead?
                </span>
                <p className="text-[11px] text-[#9c8a77]">
                  Instant print-ready PNG (1080x1920)
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadPng}
                className="px-3 py-1.5 rounded-lg bg-[#261f18] hover:bg-[#382e23] text-xs font-medium text-[#decbbe] border border-[#3e3124] transition-colors"
              >
                Download PNG
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#2d241b] bg-[#201c18] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={exporting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#b09e8b] hover:text-white transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleStartExport}
            disabled={exporting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b58735] via-[#dfb969] to-[#c5a059] text-[#1c150c] font-semibold text-xs hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-[#c5a059]/20"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1c150c]" />
                <span>Exporting Video ({progress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#1c150c]" />
                <span>Download Video (.{extension})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
