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
  Maximize2,
  Square,
  Smartphone,
  Tv,
} from "lucide-react";
import { AspectRatioType, InvitationData } from "../types";
import {
  exportInvitationVideo,
  getSupportedVideoMimeType,
} from "../utils/videoExporter";
import { weddingAudio } from "../utils/audio";

interface VideoDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
  onAspectRatioChange?: (ratio: AspectRatioType) => void;
}

export const VideoDownloadModal: React.FC<VideoDownloadModalProps> = ({
  isOpen,
  onClose,
  data,
  onAspectRatioChange,
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
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(data.aspectRatio || "9:16");
  const [resolution, setResolution] = useState<"1080p" | "720p">("1080p");
  const [includeAudio, setIncludeAudio] = useState(true);
  const [currentTrackName, setCurrentTrackName] = useState(weddingAudio.getTrackName());
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const { extension } = getSupportedVideoMimeType();

  const handleRatioSelect = (ratio: AspectRatioType) => {
    setSelectedRatio(ratio);
    onAspectRatioChange?.(ratio);
  };

  // Calculate export resolution based on ratio
  let exportW = 1080;
  let exportH = 1920;
  if (selectedRatio === "16:9") {
    exportW = resolution === "1080p" ? 1920 : 1280;
    exportH = resolution === "1080p" ? 1080 : 720;
  } else if (selectedRatio === "1:1") {
    exportW = resolution === "1080p" ? 1080 : 720;
    exportH = resolution === "1080p" ? 1080 : 720;
  } else {
    exportW = resolution === "1080p" ? 1080 : 720;
    exportH = resolution === "1080p" ? 1920 : 1280;
  }

  const handleStartExport = async () => {
    setExporting(true);
    setProgress(0);
    setStageText(`Initializing ${selectedRatio} canvas (${exportW}x${exportH})...`);
    setCompletedFile(null);
    setCompletedUrl(null);

    try {
      const exportData: InvitationData = {
        ...data,
        aspectRatio: selectedRatio,
      };

      const result = await exportInvitationVideo(exportData, {
        duration: selectedDuration,
        width: exportW,
        height: exportH,
        fps: 30,
        includeAudio,
        aspectRatio: selectedRatio,
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

  // Instant PNG card download - adapts mathematically to 16:9, 1:1, or 9:16
  const handleDownloadPng = () => {
    const W = selectedRatio === "16:9" ? 1920 : 1080;
    const H = selectedRatio === "16:9" ? 1080 : selectedRatio === "1:1" ? 1080 : 1920;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Elegant background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#fcf9f2");
    grad.addColorStop(0.5, "#f6efe3");
    grad.addColorStop(1, "#eee4d2");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Adaptive scale & centering calculations
    const scale = selectedRatio === "16:9" ? 0.90 : selectedRatio === "1:1" ? 0.94 : 1.0;
    const cx = W / 2;
    // For 9:16 reference center is ~960; in 16:9 or 1:1 shift vertically so content is centered
    const yCenterRef = 960 * scale;
    const yOff = (H / 2) - yCenterRef;

    // Outer and inner gold borders
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 12 * scale;
    const pad = 36 * scale;
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

    ctx.strokeStyle = "#e8d8b5";
    ctx.lineWidth = 3 * scale;
    const pad2 = 54 * scale;
    ctx.strokeRect(pad2, pad2, W - pad2 * 2, H - pad2 * 2);

    // Central watermark rosette
    ctx.save();
    ctx.translate(cx, H / 2);
    ctx.strokeStyle = "rgba(197, 160, 89, 0.12)";
    ctx.lineWidth = 2.5 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, 240 * scale, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const ang = (i * Math.PI * 2) / 8;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * 240 * scale, Math.sin(ang) * 240 * scale);
      ctx.stroke();
    }
    ctx.restore();

    // Helper for rendering centered text
    const drawText = (
      text: string,
      yRef: number,
      fontStr: string,
      fillColor: string,
      letterSpacing?: number
    ) => {
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillStyle = fillColor;
      ctx.font = fontStr;
      if (letterSpacing && "letterSpacing" in ctx) {
        // @ts-ignore
        ctx.letterSpacing = `${letterSpacing * scale}px`;
      }
      ctx.fillText(text, cx, yRef * scale + yOff);
      ctx.restore();
    };

    drawText(data.bismillahText, 240, `italic ${Math.round(36 * scale)}px 'Cormorant Garamond', serif`, "#8a6d3b");
    drawText(data.familyIntro, 350, `600 ${Math.round(30 * scale)}px 'Cinzel', serif`, "#5c4825", 5);
    drawText(data.familyLateFather, 430, `italic ${Math.round(42 * scale)}px 'Cormorant Garamond', serif`, "#2d2416");
    drawText("AND", 490, `600 ${Math.round(28 * scale)}px 'Cinzel', serif`, "#5c4825", 4);
    drawText(data.familySecondFather, 550, `italic ${Math.round(42 * scale)}px 'Cormorant Garamond', serif`, "#2d2416");
    drawText(data.invitationPhrase, 645, `italic ${Math.round(34 * scale)}px 'Cormorant Garamond', serif`, "#7a633d");

    drawText(data.eventHeading, 765, `700 ${Math.round(80 * scale)}px 'Alex Brush', cursive`, "#b38938");
    drawText(data.childrenPhrase, 845, `500 ${Math.round(28 * scale)}px 'Cinzel', serif`, "#6e5730", 3);

    // Groom & Bride
    const groomTitle = data.groomNick ? `${data.groomName} (${data.groomNick})` : data.groomName;
    drawText(groomTitle, 960, `700 ${Math.round(62 * scale)}px 'Cormorant Garamond', serif`, "#1e1810");
    drawText("&", 1030, `italic ${Math.round(52 * scale)}px 'Alex Brush', cursive`, "#c5a059");
    const brideTitle = data.brideNick ? `${data.brideName} (${data.brideNick})` : data.brideName;
    drawText(brideTitle, 1110, `700 ${Math.round(62 * scale)}px 'Cormorant Garamond', serif`, "#1e1810");

    // Divider line
    ctx.strokeStyle = "#c5a059";
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - 200 * scale, 1180 * scale + yOff);
    ctx.lineTo(cx + 200 * scale, 1180 * scale + yOff);
    ctx.stroke();

    drawText(data.eventDate.toUpperCase(), 1240, `600 ${Math.round(34 * scale)}px 'Cinzel', serif`, "#2d2416", 2);
    drawText(`TIME: ${data.eventTime}`, 1295, `500 ${Math.round(30 * scale)}px 'Cinzel', serif`, "#2d2416", 2);
    drawText(data.venueAddress, 1370, `400 ${Math.round(32 * scale)}px 'Cormorant Garamond', serif`, "#473922");
    drawText(data.receptionNote, 1435, `italic ${Math.round(30 * scale)}px 'Cormorant Garamond', serif`, "#8a6d3b");

    drawText("RSVP", 1520, `600 ${Math.round(26 * scale)}px 'Cinzel', serif`, "#6e5730", 4);
    drawText(data.rsvpNumbers.join("  •  "), 1565, `400 ${Math.round(28 * scale)}px 'Montserrat', sans-serif`, "#2d2416");

    const ratioLabel = selectedRatio.replace(":", "x");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `Wedding_Fatiha_Invitation_Card_${ratioLabel}_${data.groomName.split(" ")[0]}_and_${data.brideName.split(" ")[0]}.png`;
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
              {/* Aspect Ratio Selector (9:16, 1:1, 16:9) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#ddcebc] block">
                    Aspect Ratio & Canvas Size
                  </label>
                  <span className="text-[11px] text-[#c5a059] font-mono">
                    {exportW} × {exportH} px
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* 9:16 Vertical Story */}
                  <button
                    type="button"
                    onClick={() => handleRatioSelect("9:16")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedRatio === "9:16"
                        ? "bg-[#2b2219] border-[#c5a059] shadow-md shadow-[#c5a059]/15 text-[#faeedd]"
                        : "bg-[#1d1813] border-[#382a1d] text-[#a89582] hover:border-[#523e2b]"
                    }`}
                  >
                    <div className="w-5 h-8 border-2 border-current rounded-sm flex items-center justify-center">
                      <Smartphone className="w-3 h-3" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold leading-tight">9:16</div>
                      <div className="text-[10px] text-[#8e7b68] leading-tight">Story / Reel</div>
                    </div>
                  </button>

                  {/* 1:1 Square Feed */}
                  <button
                    type="button"
                    onClick={() => handleRatioSelect("1:1")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedRatio === "1:1"
                        ? "bg-[#2b2219] border-[#c5a059] shadow-md shadow-[#c5a059]/15 text-[#faeedd]"
                        : "bg-[#1d1813] border-[#382a1d] text-[#a89582] hover:border-[#523e2b]"
                    }`}
                  >
                    <div className="w-6 h-6 border-2 border-current rounded-sm flex items-center justify-center">
                      <Square className="w-3 h-3" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold leading-tight">1:1</div>
                      <div className="text-[10px] text-[#8e7b68] leading-tight">Square Post</div>
                    </div>
                  </button>

                  {/* 16:9 Cinema Widescreen */}
                  <button
                    type="button"
                    onClick={() => handleRatioSelect("16:9")}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center gap-1.5 ${
                      selectedRatio === "16:9"
                        ? "bg-[#2b2219] border-[#c5a059] shadow-md shadow-[#c5a059]/15 text-[#faeedd]"
                        : "bg-[#1d1813] border-[#382a1d] text-[#a89582] hover:border-[#523e2b]"
                    }`}
                  >
                    <div className="w-8 h-5 border-2 border-current rounded-sm flex items-center justify-center">
                      <Tv className="w-3 h-3" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold leading-tight">16:9</div>
                      <div className="text-[10px] text-[#8e7b68] leading-tight">Widescreen / TV</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quality & Resolution Selection */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#201913] border border-[#36271a] text-xs">
                <span className="text-[#c7b5a1] font-medium">Render Quality:</span>
                <div className="flex items-center gap-1 bg-[#15110d] p-0.5 rounded-lg border border-[#2b1f14]">
                  <button
                    type="button"
                    onClick={() => setResolution("1080p")}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      resolution === "1080p"
                        ? "bg-[#c5a059] text-[#1c150c] shadow-sm"
                        : "text-[#9e8c79] hover:text-[#e4d6c4]"
                    }`}
                  >
                    1080p (Full HD)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution("720p")}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      resolution === "720p"
                        ? "bg-[#c5a059] text-[#1c150c] shadow-sm"
                        : "text-[#9e8c79] hover:text-[#e4d6c4]"
                    }`}
                  >
                    720p (Fast)
                  </button>
                </div>
              </div>

              <label className="text-xs font-semibold text-[#ddcebc] block pt-1">
                Select Video Duration & Sequence
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
                  Instant print-ready PNG in {selectedRatio} ({selectedRatio === "16:9" ? "1920x1080" : selectedRatio === "1:1" ? "1080x1080" : "1080x1920"})
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
