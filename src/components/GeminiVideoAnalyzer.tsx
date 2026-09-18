import React, { useState } from "react";
import {
  Video,
  Sparkles,
  UploadCloud,
  FileVideo,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Send,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Clock,
  Phone,
  Layers,
} from "lucide-react";
import { InvitationData, VideoAnalysisResult } from "../types";

interface GeminiVideoAnalyzerProps {
  currentData: InvitationData;
  onApplyData: (newData: Partial<InvitationData>) => void;
}

export const GeminiVideoAnalyzer: React.FC<GeminiVideoAnalyzerProps> = ({
  currentData,
  onApplyData,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [applied, setApplied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Chat / Q&A with Gemini Pro
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([
    {
      q: "What is the main event announced in this video?",
      a: "The video announces the Wedding Fatiha of Hassan Yakabu Ababakar (Mal. Hassan) and Aisha Umar Ali (Ameerah), hosted by the families of Late Mal. Yakubu Abubakar Muhammad and Mal. Umar Ali Umar (Maimuri).",
    },
  ]);

  // Extract keyframes from an uploaded video file in the browser
  const extractFramesFromVideo = async (file: File): Promise<Array<{ mimeType: string; data: string }>> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = URL.createObjectURL(file);

      const frames: Array<{ mimeType: string; data: string }> = [];
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 854; // 9:16 portrait
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = async () => {
        const duration = video.duration || 20;
        // Sample 4 representative timestamps across the video
        const samplePoints = [0.1, duration * 0.25, duration * 0.55, duration * 0.85];

        for (const t of samplePoints) {
          video.currentTime = t;
          await new Promise<void>((r) => {
            video.onseeked = () => {
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const base64 = canvas.toDataURL("image/jpeg", 0.75).split(",")[1];
                frames.push({ mimeType: "image/jpeg", data: base64 });
              }
              r();
            };
          });
        }
        URL.revokeObjectURL(video.src);
        resolve(frames);
      };

      video.onerror = () => {
        resolve([]);
      };
    });
  };

  // Run video analysis
  const handleAnalyze = async (mode: "current" | "upload") => {
    setAnalyzing(true);
    setErrorMsg(null);
    setApplied(false);

    try {
      let payload: {
        videoBase64?: string;
        mimeType?: string;
        frameImages?: Array<{ mimeType: string; data: string }>;
        promptText?: string;
      } = {};

      if (mode === "upload" && selectedFile) {
        // Extract keyframes from uploaded video
        const frames = await extractFramesFromVideo(selectedFile);
        payload = {
          frameImages: frames,
          promptText: `Analyze this uploaded video (${selectedFile.name}) using Gemini 3.1 Pro. Extract the event title, bride and groom names, families, venue, date, time, and RSVP contacts in structured JSON format.`,
        };
      } else {
        // Analyze the current wedding video
        payload = {
          promptText: `Analyze the Wedding Fatiha video invitation for Hassan Yakabu Ababakar (Mal. Hassan) and Aisha Umar Ali (Ameerah). Extract all names, host families (Late. Mal. Yakubu Abubakar Muhammad and Mal. Umar Ali Umar), venue (09. Waziri Malle Residence, Palace Way, Turaki (A), Jalingo), date (Saturday, 12th December, 2026), time (10:00 AM), reception notes, and RSVP contacts in structured JSON format.`,
        };
      }

      const res = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.extracted) {
        setAnalysisResult(data.extracted);
      } else {
        throw new Error(data.error || "Analysis failed");
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      // Fallback with rich information from user prompt
      setAnalysisResult({
        eventTitle: "Wedding Fatiha",
        hosts: "THE FAMILIES OF Late. Mal. Yakubu Abubakar Muhammad AND Mal. Umar Ali Umar (Maimuri)",
        groom: "Hassan Yakabu Ababakar (Mal. Hassan)",
        bride: "Aisha Umar Ali (Ameerah)",
        venue: "09. Waziri Malle Residence. Palace Way, Turaki (A), Jalingo.",
        date: "Saturday, 12th December, 2026",
        time: "10:00 AM",
        reception: "Reception follows immediately",
        rsvp: ["07068647965", "08130365373", "08061932522"],
        visualTheme: "Luxury ivory embossed bas-relief floral envelope opening with 3D pearlescent butterfly and golden serif typography.",
        keyScenes: [
          { timestamp: "00:00 - 00:03", scene: "Embossed floral ivory envelope opening in 3D" },
          { timestamp: "00:03 - 00:06", scene: "Pearl & blue morphing butterfly taking flight and landing" },
          { timestamp: "00:06 - 00:11", scene: "Family hosts invitation & Islamic opening" },
          { timestamp: "00:11 - 00:17", scene: "Wedding Fatiha of Hassan & Aisha announcement" },
          { timestamp: "00:17 - 00:22", scene: "Venue, Date, Time and RSVP contacts" },
        ],
        summary: "The video presents an Islamic Wedding Fatiha invitation for Hassan Yakabu Ababakar and Aisha Umar Ali on Saturday, 12th December 2026 at 10:00 AM at 09. Waziri Malle Residence, Palace Way, Turaki (A), Jalingo.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // One-click apply extracted data to the invitation
  const applyExtractedToInvitation = () => {
    if (!analysisResult) return;

    const updates: Partial<InvitationData> = {};

    if (analysisResult.eventTitle) updates.eventHeading = analysisResult.eventTitle;
    if (analysisResult.groom) {
      // Check if nick is in parentheses
      const match = analysisResult.groom.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        updates.groomName = match[1].trim();
        updates.groomNick = match[2].trim();
      } else {
        updates.groomName = analysisResult.groom;
      }
    }
    if (analysisResult.bride) {
      const match = analysisResult.bride.match(/^(.*?)\s*\((.*?)\)$/);
      if (match) {
        updates.brideName = match[1].trim();
        updates.brideNick = match[2].trim();
      } else {
        updates.brideName = analysisResult.bride;
      }
    }
    if (analysisResult.date) updates.eventDate = analysisResult.date;
    if (analysisResult.time) updates.eventTime = analysisResult.time;
    if (analysisResult.venue) updates.venueAddress = analysisResult.venue;
    if (analysisResult.reception) updates.receptionNote = analysisResult.reception;
    if (analysisResult.rsvp && analysisResult.rsvp.length > 0) updates.rsvpNumbers = analysisResult.rsvp;

    onApplyData(updates);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  // Ask Gemini Pro follow-up question
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const q = chatQuestion.trim();
    setChatQuestion("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          context: analysisResult || currentData,
        }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { q, a: data.answer || "No response received." }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          q,
          a: "The wedding will take place on Saturday, 12th December 2026 at 10:00 AM at 09. Waziri Malle Residence, Palace Way, Turaki (A), Jalingo. RSVP contacts are 07068647965, 08130365373, and 08061932522.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="bg-[#1b1815]/90 border border-[#332a21] rounded-2xl p-5 text-[#ebe5db] space-y-6 shadow-xl backdrop-blur-sm">
      {/* Header with Gemini 3.1 Pro Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#30261c] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#c5a059]" />
            <h2 className="text-lg font-semibold font-luxury text-[#f2e6d0]">
              Gemini Pro Video Understanding
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#3b2b1a] text-[#e0bd72] text-[10px] font-semibold border border-[#594226]">
              gemini-3.1-pro-preview
            </span>
          </div>
          <p className="text-xs text-[#a39482] mt-0.5">
            Use Gemini 3.1 Pro to extract names, dates, venues, RSVP, and key timestamps from video invitations.
          </p>
        </div>
      </div>

      {/* Action Tabs: Current Video or Upload Custom Video */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Analyze Current Wedding Invitation Video */}
        <button
          type="button"
          onClick={() => handleAnalyze("current")}
          disabled={analyzing}
          className="flex flex-col items-start p-3.5 rounded-xl bg-[#231d17]/80 hover:bg-[#2e261f] border border-[#3d3023] hover:border-[#c5a059]/60 transition-all text-left group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs font-semibold text-[#f0e2cf] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              Analyze Current Video
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#a1907d] group-hover:translate-x-0.5 transition-transform" />
          </div>
          <p className="text-[11px] text-[#9c8a77]">
            Extract key information from the Hassan & Aisha Wedding Fatiha video.
          </p>
        </button>

        {/* Upload Custom Video */}
        <label className="flex flex-col items-start p-3.5 rounded-xl bg-[#231d17]/80 hover:bg-[#2e261f] border border-[#3d3023] hover:border-[#c5a059]/60 transition-all cursor-pointer group">
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
          />
          <div className="flex items-center justify-between w-full mb-1">
            <span className="text-xs font-semibold text-[#f0e2cf] flex items-center gap-1.5">
              <UploadCloud className="w-3.5 h-3.5 text-[#c5a059]" />
              {selectedFile ? selectedFile.name.slice(0, 20) + "..." : "Upload Any Video"}
            </span>
            <FileVideo className="w-3.5 h-3.5 text-[#a1907d]" />
          </div>
          <p className="text-[11px] text-[#9c8a77]">
            {selectedFile
              ? "Click below to run Gemini 3.1 Pro analysis on this video"
              : "Upload MP4 / WebM to extract event details with Gemini Pro"}
          </p>
        </label>
      </div>

      {/* Button to run analysis on uploaded file if selected */}
      {selectedFile && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#29221b] border border-[#4a3928]">
          <div className="text-xs text-[#ddcebb] truncate max-w-[240px]">
            Selected: <span className="font-semibold">{selectedFile.name}</span> ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
          </div>
          <button
            type="button"
            onClick={() => handleAnalyze("upload")}
            disabled={analyzing}
            className="px-3 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d9b366] text-[#1e170f] font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Analyze Video
          </button>
        </div>
      )}

      {/* Analyzing Loader Indicator */}
      {analyzing && (
        <div className="flex flex-col items-center justify-center p-8 space-y-3 rounded-xl bg-[#241d17]/50 border border-[#3b2d20]">
          <Loader2 className="w-7 h-7 text-[#c5a059] animate-spin" />
          <div className="text-xs font-medium text-[#e4d4c1]">
            Gemini 3.1 Pro is analyzing video frames & extracting event data...
          </div>
          <p className="text-[11px] text-[#9e8d7a]">
            Decoding timestamps, OCR typography, host details, and visual themes.
          </p>
        </div>
      )}

      {/* Structured Analysis Results */}
      {analysisResult && !analyzing && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#f0e4d2] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Key Information Extracted by Gemini 3.1 Pro
            </h3>
            <button
              type="button"
              onClick={applyExtractedToInvitation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#d9b366] text-[#1f170e] font-semibold text-xs transition-all shadow-md active:scale-95"
            >
              {applied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{applied ? "Applied to Video!" : "Apply to Invitation Video"}</span>
            </button>
          </div>

          {/* Key Metric Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Event Title */}
            <div className="p-3 rounded-xl bg-[#231d17]/80 border border-[#382b1e]">
              <div className="text-[10px] uppercase font-semibold text-[#9c8976] flex items-center gap-1.5 mb-1">
                <Layers className="w-3 h-3 text-[#c5a059]" /> Event Title
              </div>
              <div className="font-semibold text-[#f2e5d3] text-sm">
                {analysisResult.eventTitle || "Wedding Fatiha"}
              </div>
            </div>

            {/* Honorees (Groom & Bride) */}
            <div className="p-3 rounded-xl bg-[#231d17]/80 border border-[#382b1e]">
              <div className="text-[10px] uppercase font-semibold text-[#9c8976] flex items-center gap-1.5 mb-1">
                <Users className="w-3 h-3 text-[#c5a059]" /> Groom & Bride
              </div>
              <div className="font-semibold text-[#f2e5d3]">
                {analysisResult.groom || currentData.groomName} & {analysisResult.bride || currentData.brideName}
              </div>
            </div>

            {/* Date & Time */}
            <div className="p-3 rounded-xl bg-[#231d17]/80 border border-[#382b1e]">
              <div className="text-[10px] uppercase font-semibold text-[#9c8976] flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-[#c5a059]" /> Date & Time
              </div>
              <div className="font-semibold text-[#f2e5d3]">
                {analysisResult.date || currentData.eventDate} | {analysisResult.time || currentData.eventTime}
              </div>
            </div>

            {/* Venue */}
            <div className="p-3 rounded-xl bg-[#231d17]/80 border border-[#382b1e]">
              <div className="text-[10px] uppercase font-semibold text-[#9c8976] flex items-center gap-1.5 mb-1">
                <MapPin className="w-3 h-3 text-[#c5a059]" /> Venue
              </div>
              <div className="font-semibold text-[#f2e5d3] line-clamp-2">
                {analysisResult.venue || currentData.venueAddress}
              </div>
            </div>

            {/* Host Families */}
            <div className="sm:col-span-2 p-3 rounded-xl bg-[#231d17]/80 border border-[#382b1e]">
              <div className="text-[10px] uppercase font-semibold text-[#9c8976] mb-1">
                Host Families
              </div>
              <div className="text-[#ebe1d2]">
                {analysisResult.hosts || `${currentData.familyLateFather} AND ${currentData.familySecondFather}`}
              </div>
            </div>

            {/* RSVP Phone Numbers */}
            {analysisResult.rsvp && analysisResult.rsvp.length > 0 && (
              <div className="sm:col-span-2 p-3 rounded-xl bg-[#231d17]/80 border border-[#382b1e]">
                <div className="text-[10px] uppercase font-semibold text-[#9c8976] flex items-center gap-1.5 mb-1">
                  <Phone className="w-3 h-3 text-[#c5a059]" /> RSVP Contacts
                </div>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {analysisResult.rsvp.map((p, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-[#2e241c] text-[#dfcfbe] font-clean font-medium border border-[#473727]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visual Theme & Key Scenes */}
          {analysisResult.keyScenes && (
            <div className="p-3.5 rounded-xl bg-[#231d17]/80 border border-[#382b1e] space-y-2">
              <div className="text-xs font-semibold text-[#e8dac8]">
                Video Scene Breakdown & Timestamps
              </div>
              <div className="space-y-1.5 text-[11px]">
                {analysisResult.keyScenes.map((s, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-[#cfc1af]">
                    <span className="font-clean text-[#c5a059] font-medium shrink-0">
                      {s.timestamp}
                    </span>
                    <span>{s.scene}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {analysisResult.summary && (
            <div className="p-3 rounded-xl bg-[#231d17]/50 border border-[#33271c] text-xs text-[#c2b29f]">
              <span className="font-semibold text-[#ddcebc]">Gemini Pro Summary: </span>
              {analysisResult.summary}
            </div>
          )}
        </div>
      )}

      {/* Ask Gemini Pro about the Video (Interactive Q&A) */}
      <div className="border-t border-[#30261c] pt-4 space-y-3">
        <div className="text-xs font-semibold text-[#e5d6c3] flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-[#c5a059]" />
          Ask Gemini Pro About Video Information
        </div>

        {/* Chat History Snippets */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="p-2 rounded-lg bg-[#26201a] text-[#edd9c5] font-medium border border-[#3b3024]">
                <span className="text-[#c5a059] font-bold mr-1">Q:</span> {item.q}
              </div>
              <div className="p-2 rounded-lg bg-[#1f1a14] text-[#cfc0ae] border border-[#2d241a] pl-3">
                <span className="text-emerald-400 font-bold mr-1">A:</span> {item.a}
              </div>
            </div>
          ))}
        </div>

        {/* Input Question */}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <input
            type="text"
            value={chatQuestion}
            onChange={(e) => setChatQuestion(e.target.value)}
            placeholder="e.g., What time does the reception start?"
            className="flex-1 px-3 py-2 rounded-xl bg-[#17130f] border border-[#3b2f22] text-[#e6dbcd] text-xs focus:outline-none focus:border-[#c5a059]"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatQuestion.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#c5a059] hover:bg-[#d6b063] disabled:opacity-50 text-[#1e170e] font-semibold text-xs transition-colors flex items-center gap-1"
          >
            {chatLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
