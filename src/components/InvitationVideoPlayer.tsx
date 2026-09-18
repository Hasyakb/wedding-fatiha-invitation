import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Sparkles,
  Camera,
  Music,
} from "lucide-react";
import { InvitationData } from "../types";
import { Butterfly3D } from "./Butterfly3D";
import { Envelope3D } from "./Envelope3D";
import { weddingAudio } from "../utils/audio";
import { VideoDownloadModal } from "./VideoDownloadModal";
import { RoyalCinematicBackground } from "./RoyalCinematicBackground";
import { CalligraphyPenPlayer } from "./CalligraphyPenPlayer";
import { GoldenBokehPlayer } from "./GoldenBokehPlayer";
import { BaroqueTablescapePlayer } from "./BaroqueTablescapePlayer";
import { OliveRusticTablescapePlayer } from "./OliveRusticTablescapePlayer";
import { EmeraldLanternPlayer } from "./EmeraldLanternPlayer";

interface InvitationVideoPlayerProps {
  data: InvitationData;
  onShareClick?: () => void;
  onDownloadClick?: () => void;
  onAudioClick?: () => void;
}

export const InvitationVideoPlayer: React.FC<InvitationVideoPlayerProps> = ({
  data,
  onShareClick,
  onDownloadClick,
  onAudioClick,
}) => {
  const TOTAL_DURATION =
    data.templateStyle === "oliveRusticTablescape"
      ? 38.0
      : data.templateStyle === "goldenBokeh"
      ? 54.0
      : data.templateStyle === "baroqueTablescape"
      ? 34.0
      : data.templateStyle === "calligraphyPen"
      ? 42.0
      : 24.0;
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoStageRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Reset/clamp currentTime when template changes
  useEffect(() => {
    if (currentTime > TOTAL_DURATION) {
      setCurrentTime(0);
      if (isPlaying) {
        weddingAudio.playAudio(0);
      }
    }
  }, [data.templateStyle, TOTAL_DURATION]);

  // Play/Pause handling
  const togglePlay = () => {
    if (!isPlaying) {
      const startAt = currentTime >= TOTAL_DURATION ? 0 : currentTime;
      if (currentTime >= TOTAL_DURATION) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
      weddingAudio.setMuted(isMuted);
      weddingAudio.playAudio(startAt);
    } else {
      setIsPlaying(false);
      weddingAudio.stopAudio();
    }
  };

  const restartVideo = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    weddingAudio.setMuted(isMuted);
    weddingAudio.playEnvelopeSwoosh();
    weddingAudio.playAudio(0);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    weddingAudio.setMuted(nextMuted);
  };

  // Main animation loop for accurate timing
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const step = (timestamp: number) => {
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      const delta = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + delta * playbackSpeed;
        if (next >= TOTAL_DURATION) {
          setIsPlaying(false);
          weddingAudio.stopAudio();
          return TOTAL_DURATION;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (isPlaying) {
      weddingAudio.stopAudio();
      weddingAudio.playAudio(targetTime);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Compute envelope unfold progress (0 to 1 during 0.0s - 3.2s)
  const envelopeProgress = Math.min(1, Math.max(0, currentTime / 3.0));

  // Compute butterfly emergence, flight, and fade-out
  // 0s to 3s: emerges from center (50%) up to resting spot (16%)
  // After its first appearance (~3.5s - 4.5s), the butterfly gracefully fades out & disappears
  const butterflyFlyProgress = Math.min(1, Math.max(0, (currentTime - 1.2) / 2.3));
  const butterflyTopPercent = 48 - butterflyFlyProgress * 32; // from 48% down to 16%
  const butterflyScale = 0.85 + Math.min(0.25, butterflyFlyProgress * 0.25);
  const isButterflyFlying = currentTime > 0.8 && currentTime < 3.8;

  // Butterfly disappears after opening appearance (fades out completely by 4.5s)
  const butterflyOpacity =
    currentTime < 0.6
      ? 0
      : currentTime < 1.2
      ? Math.min(1, (currentTime - 0.6) / 0.6)
      : currentTime < 3.8
      ? 1
      : currentTime < 4.6
      ? Math.max(0, 1 - (currentTime - 3.8) / 0.8)
      : 0;

  // Scenes timing
  const isOpening = currentTime < 3.5;
  const isSceneFamily = currentTime >= 3.5 && currentTime < 8.2;
  const isSceneCouple = currentTime >= 8.2 && currentTime < 13.8;
  const isSceneDetails = currentTime >= 13.8 && currentTime < 18.8;
  const isSceneRSVP = currentTime >= 18.8;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Quick snapshot download of current frame as high-res PNG
  const captureSnapshot = async () => {
    if (!videoStageRef.current) return;
    try {
      // Use html-to-canvas style canvas drawing
      const element = videoStageRef.current;
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw elegant royal backdrop
      const grad = ctx.createLinearGradient(0, 0, 0, 1920);
      grad.addColorStop(0, "#fcf9f2");
      grad.addColorStop(0.5, "#f6efe3");
      grad.addColorStop(1, "#eee4d2");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1920);

      // Royal rosette watermark behind center
      ctx.save();
      ctx.translate(540, 960);
      ctx.strokeStyle = "rgba(197, 160, 89, 0.12)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 360, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 260, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * 360, Math.sin(ang) * 360);
        ctx.stroke();
      }
      ctx.restore();

      // Gold border
      ctx.strokeStyle = "#c5a059";
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 1000, 1840);
      ctx.strokeStyle = "#e8d8b5";
      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, 960, 1800);

      // Typography
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

      // Groom & Bride
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

      // Date & Venue
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

      // RSVP
      ctx.font = "600 28px 'Cinzel', serif";
      ctx.fillStyle = "#6e5730";
      ctx.fillText("RSVP", 540, 1690);
      ctx.font = "400 30px 'Montserrat', sans-serif";
      ctx.fillStyle = "#2d2416";
      ctx.fillText(data.rsvpNumbers.join("  •  "), 540, 1740);

      // Download
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `Wedding_Fatiha_Invitation_${data.groomName.split(" ")[0]}_and_${data.brideName.split(" ")[0]}.png`;
      a.click();
    } catch (e) {
      console.error("Capture snapshot failed", e);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center relative w-full ${
        isFullscreen ? "fixed inset-0 z-50 bg-black p-4" : ""
      }`}
    >
      {/* Phone Mockup Frame / 9:16 Vertical Aspect Player Container */}
      <div className="relative w-full max-w-[390px] aspect-[9/16] rounded-3xl p-3 bg-gradient-to-b from-[#2a2622] via-[#1a1715] to-[#0f0e0d] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(197,160,89,0.25)] flex flex-col justify-between">
        {/* Top Phone Speaker / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-[#12100e] flex items-center justify-center gap-2 z-40 shadow-inner">
          <div className="w-8 h-1 rounded-full bg-[#26211c]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#1c1712] border border-[#382f25]" />
        </div>

        {/* Screen Bezel / Stage */}
        <div
          ref={videoStageRef}
          className="relative w-full h-full rounded-[22px] overflow-hidden select-none bg-[#12100e] shadow-inner"
          style={{
            perspective: "1200px",
          }}
        >
          {data.templateStyle === "oliveRusticTablescape" ? (
            <OliveRusticTablescapePlayer data={data} currentTime={currentTime} />
          ) : data.templateStyle === "baroqueTablescape" ? (
            <BaroqueTablescapePlayer data={data} currentTime={currentTime} />
          ) : data.templateStyle === "goldenBokeh" ? (
            <GoldenBokehPlayer data={data} currentTime={currentTime} />
          ) : data.templateStyle === "calligraphyPen" ? (
            <CalligraphyPenPlayer data={data} currentTime={currentTime} />
          ) : data.templateStyle === "emeraldLantern" ? (
            <EmeraldLanternPlayer data={data} currentTime={currentTime} />
          ) : (
            <>
              {/* Dynamic Moving Royal Cinematic Background Canvas */}
              <RoyalCinematicBackground
                currentTime={currentTime}
                themeColor={data.themeColor}
                mosqueTheme={data.mosqueTheme}
                mosquePhotos={data.mosquePhotos}
                mosqueDisplayMode={data.mosqueDisplayMode}
                mosquePhotoOpacity={data.mosquePhotoOpacity}
                mosquePhotoBlur={data.mosquePhotoBlur}
                className="z-0"
              />

              {/* Luxury Floral Border Framing & Filigree Overlay */}
              <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Embossed Luxury Floral Border Framing */}
            <svg
              viewBox="0 0 400 710"
              className="absolute inset-0 w-full h-full pointer-events-none opacity-45"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="cardEmboss" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
                  <feOffset in="blur" dx="-0.8" dy="-0.8" result="light" />
                  <feOffset in="blur" dx="1.2" dy="1.2" result="shadow" />
                  <feMerge>
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g filter="url(#cardEmboss)" stroke="#c5b08e" fill="none" strokeWidth="1">
                {/* Outer frame */}
                <rect x="14" y="14" width="372" height="682" rx="14" strokeWidth="1.2" />
                <rect x="20" y="20" width="360" height="670" rx="10" strokeWidth="0.6" strokeDasharray="3 3" />

                {/* Corner Floral Ornaments */}
                {/* Top Left Corner */}
                <path d="M 22 70 Q 40 40 70 22" strokeWidth="1.5" />
                <circle cx="36" cy="36" r="6" />
                <circle cx="56" cy="30" r="4" />
                <circle cx="30" cy="56" r="4" />
                <path d="M 36 36 C 45 45, 55 35, 65 42" />

                {/* Top Right Corner */}
                <path d="M 378 70 Q 360 40 330 22" strokeWidth="1.5" />
                <circle cx="364" cy="36" r="6" />
                <circle cx="344" cy="30" r="4" />
                <circle cx="370" cy="56" r="4" />

                {/* Bottom Left Corner */}
                <path d="M 22 640 Q 40 670 70 688" strokeWidth="1.5" />
                <circle cx="36" cy="674" r="6" />
                <circle cx="56" cy="680" r="4" />
                <circle cx="30" cy="654" r="4" />

                {/* Bottom Right Corner */}
                <path d="M 378 640 Q 360 670 330 688" strokeWidth="1.5" />
                <circle cx="364" cy="674" r="6" />
                <circle cx="344" cy="680" r="4" />
                <circle cx="370" cy="654" r="4" />
              </g>
            </svg>

            {/* Golden Sparkles & Floating Dust Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-[#d6b46c] opacity-60 animate-ping"
                style={{ top: "25%", left: "20%", animationDuration: "3.5s" }}
              />
              <div
                className="absolute w-1 h-1 rounded-full bg-[#f2e2be] opacity-75 animate-ping"
                style={{ top: "35%", right: "22%", animationDuration: "4.2s" }}
              />
              <div
                className="absolute w-2 h-2 rounded-full bg-[#c5a059] opacity-40 animate-pulse"
                style={{ bottom: "28%", left: "18%", animationDuration: "5s" }}
              />
              <div
                className="absolute w-1.5 h-1.5 rounded-full bg-[#e3cd96] opacity-50 animate-pulse"
                style={{ bottom: "40%", right: "20%", animationDuration: "3.8s" }}
              />
            </div>
          </div>

          {/* 3D Envelope Layer (folds open at start) */}
          <Envelope3D progress={envelopeProgress}>
            {/* The butterfly hovering/resting above the text, disappearing after opening */}
            {butterflyOpacity > 0 && (
              <div
                className="absolute left-1/2 -translate-x-1/2 z-30 transition-opacity duration-500 ease-out pointer-events-none"
                style={{
                  top: `${butterflyTopPercent}%`,
                  opacity: butterflyOpacity,
                }}
              >
                <Butterfly3D isFlying={isButterflyFlying} scale={butterflyScale} />
              </div>
            )}

            {/* SCENES CONTENT CONTAINER (lowered positioning & balanced spacing) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between p-4 pt-14 pb-5 text-center">
              {/* TOP HEADER: BISMILLAH / BLESSING */}
              <div className="min-h-[46px] flex flex-col items-center justify-center pt-2">
                {data.bismillah && (
                  <div className="px-5 py-1.5 rounded-full bg-[#fffefb]/85 backdrop-blur-sm border border-[#dfcca8]/70 text-[#6f4f1d] font-luxury text-lg md:text-xl font-bold tracking-wide shadow-sm text-glow-light animate-royal-glide-down">
                    {data.bismillahText}
                  </div>
                )}
              </div>

              {/* DYNAMIC SCENE DISPLAY WITH LUMINOUS PEDESTAL (positioned comfortably lower) */}
              <div className="flex-1 flex flex-col items-center justify-center relative my-4 pt-2 min-h-[400px]">
                {/* SCENE 0: ENVELOPE OPENING / TEASER (0s - 3.5s) */}
                {isOpening && (
                  <div className="w-full max-w-[330px] px-6 py-7 rounded-2xl bg-[#fffefb]/85 backdrop-blur-md border border-[#dfcca8]/80 shadow-[0_8px_28px_rgba(180,140,70,0.15)] flex flex-col items-center justify-center animate-royal-scale-in">
                    <div className="text-[#755526] font-cinzel text-xs tracking-[0.35em] uppercase font-bold text-gold-emboss mb-2">
                      ✦ A Royal Celebration ✦
                    </div>
                    <div className="text-[#1f160c] font-script text-5xl leading-tight font-bold gold-shimmer-text drop-shadow-sm">
                      You are Invited
                    </div>
                    <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mt-3" />
                  </div>
                )}

                {/* SCENE 1: FAMILIES INVITATION (3.5s - 8.2s) */}
                {isSceneFamily && (
                  <div className="w-full max-w-[338px] px-5 py-6 rounded-2xl bg-[#fffefb]/88 backdrop-blur-md border border-[#dfcca8]/80 shadow-[0_10px_32px_rgba(180,140,70,0.16)] flex flex-col items-center justify-center space-y-3 relative overflow-hidden animate-royal-scale-in">
                    {/* Corner Ornaments */}
                    <div className="absolute top-2 left-2 text-[#c5a059]/40 text-xs select-none">✦</div>
                    <div className="absolute top-2 right-2 text-[#c5a059]/40 text-xs select-none">✦</div>
                    <div className="absolute bottom-2 left-2 text-[#c5a059]/40 text-xs select-none">✦</div>
                    <div className="absolute bottom-2 right-2 text-[#c5a059]/40 text-xs select-none">✦</div>

                    {/* Step 1: Intro */}
                    <div
                      className="text-[#694d22] font-cinzel text-[11px] tracking-[0.32em] uppercase font-bold text-gold-emboss animate-royal-glide-down"
                      style={{ animationDelay: "0ms" }}
                    >
                      {data.familyIntro}
                    </div>

                    {/* Step 2: Father 1 */}
                    <div
                      className="text-[#140e08] font-luxury text-[22px] font-bold leading-snug px-2 text-glow-light animate-royal-glide-up"
                      style={{ animationDelay: "180ms" }}
                    >
                      {data.familyLateFather}
                    </div>

                    {/* Step 3: AND divider */}
                    <div
                      className="flex items-center gap-2 my-0.5 animate-royal-scale-in"
                      style={{ animationDelay: "320ms" }}
                    >
                      <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#c5a059]" />
                      <span className="text-[#8c672b] font-cinzel text-xs tracking-[0.25em] font-bold">
                        AND
                      </span>
                      <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#c5a059]" />
                    </div>

                    {/* Step 4: Father 2 */}
                    <div
                      className="text-[#140e08] font-luxury text-[22px] font-bold leading-snug px-2 text-glow-light animate-royal-glide-up"
                      style={{ animationDelay: "450ms" }}
                    >
                      {data.familySecondFather}
                    </div>

                    {/* Step 5: Invitation Phrase */}
                    <div
                      className="pt-1 text-[#785721] font-script text-[26px] drop-shadow-sm animate-royal-glide-up"
                      style={{ animationDelay: "600ms" }}
                    >
                      {data.invitationPhrase}
                    </div>
                  </div>
                )}

                {/* SCENE 2: WEDDING FATIHA & THE COUPLE (8.2s - 13.8s) */}
                {isSceneCouple && (
                  <div className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#fffefb]/90 backdrop-blur-md border border-[#dfcca8]/85 shadow-[0_12px_36px_rgba(180,140,70,0.18)] flex flex-col items-center justify-center space-y-2.5 relative overflow-hidden animate-royal-scale-in">
                    {/* Soft ambient center halo */}
                    <div className="absolute inset-0 bg-radial from-[#ebdcc2]/30 to-transparent pointer-events-none" />

                    {/* Step 1: Event Heading */}
                    <div
                      className="text-5xl font-script leading-tight font-bold gold-shimmer-text drop-shadow-[0_2px_4px_rgba(180,140,70,0.22)] animate-royal-glide-down"
                      style={{ animationDelay: "0ms" }}
                    >
                      {data.eventHeading}
                    </div>

                    {/* Step 2: Phrase */}
                    <div
                      className="text-[#6b522b] font-cinzel text-[11px] tracking-[0.28em] uppercase font-bold text-gold-emboss animate-royal-glide-down"
                      style={{ animationDelay: "180ms" }}
                    >
                      {data.childrenPhrase}
                    </div>

                    {/* Step 3: Groom Card */}
                    <div
                      className="pt-1 flex flex-col items-center animate-royal-glide-up"
                      style={{ animationDelay: "340ms" }}
                    >
                      <div className="text-[#120d07] font-luxury text-[26px] font-bold tracking-tight text-glow-light">
                        {data.groomName}
                      </div>
                      {data.groomNick && (
                        <div className="text-[#876226] font-luxury italic text-sm font-semibold tracking-wide">
                          ({data.groomNick})
                        </div>
                      )}
                    </div>

                    {/* Step 4: Ampersand */}
                    <div
                      className="text-[#b58735] font-script text-4xl my-0 leading-none drop-shadow-sm animate-royal-scale-in"
                      style={{ animationDelay: "480ms" }}
                    >
                      &
                    </div>

                    {/* Step 5: Bride Card */}
                    <div
                      className="flex flex-col items-center animate-royal-glide-up"
                      style={{ animationDelay: "620ms" }}
                    >
                      <div className="text-[#120d07] font-luxury text-[26px] font-bold tracking-tight text-glow-light">
                        {data.brideName}
                      </div>
                      {data.brideNick && (
                        <div className="text-[#876226] font-luxury italic text-sm font-semibold tracking-wide">
                          ({data.brideNick})
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SCENE 3: VENUE, DATE & TIME (13.8s - 18.8s) */}
                {isSceneDetails && (
                  <div className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#fffefb]/90 backdrop-blur-md border border-[#dfcca8]/85 shadow-[0_12px_36px_rgba(180,140,70,0.18)] flex flex-col items-center justify-center space-y-3 relative overflow-hidden animate-royal-scale-in">
                    {/* Step 1: Date Heading */}
                    <div
                      className="text-[#6b522b] font-cinzel text-[11px] tracking-[0.32em] uppercase font-bold text-gold-emboss animate-royal-glide-down"
                      style={{ animationDelay: "0ms" }}
                    >
                      ✦ Date & Time ✦
                    </div>

                    {/* Step 2: Full Date */}
                    <div
                      className="text-[#120d07] font-cinzel text-lg font-bold tracking-wide text-glow-light animate-royal-glide-up"
                      style={{ animationDelay: "180ms" }}
                    >
                      {data.eventDate}
                    </div>

                    {/* Step 3: Time Badge */}
                    <div
                      className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-[#f9efe0] via-[#fff9ef] to-[#f9efe0] border border-[#d6be96] text-[#543b16] font-cinzel text-xs font-bold tracking-widest shadow-sm animate-royal-scale-in"
                      style={{ animationDelay: "320ms" }}
                    >
                      TIME: {data.eventTime}
                    </div>

                    {/* Separator Line */}
                    <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent my-1" />

                    {/* Step 4: Venue */}
                    <div
                      className="text-[#6b522b] font-cinzel text-[11px] tracking-[0.32em] uppercase font-bold text-gold-emboss pt-0.5 animate-royal-glide-up"
                      style={{ animationDelay: "450ms" }}
                    >
                      {data.venueLabel}
                    </div>

                    <div
                      className="text-[#1a130b] font-luxury text-[19px] leading-snug font-bold px-2 text-glow-light animate-royal-glide-up"
                      style={{ animationDelay: "580ms" }}
                    >
                      {data.venueAddress}
                    </div>

                    {/* Step 5: Reception Note */}
                    <div
                      className="text-[#996e21] font-script text-[26px] pt-1 drop-shadow-sm animate-royal-glide-up"
                      style={{ animationDelay: "700ms" }}
                    >
                      ✨ {data.receptionNote} ✨
                    </div>
                  </div>
                )}

                {/* SCENE 4: RSVP & CELEBRATION (18.8s - 24.0s) */}
                {isSceneRSVP && (
                  <div className="w-full max-w-[340px] px-5 py-6 rounded-2xl bg-[#fffefb]/90 backdrop-blur-md border border-[#dfcca8]/85 shadow-[0_12px_36px_rgba(180,140,70,0.18)] flex flex-col items-center justify-center space-y-3 relative overflow-hidden animate-royal-scale-in">
                    {/* Step 1: Kindly RSVP */}
                    <div
                      className="text-[#1b140c] font-script text-4xl font-bold gold-shimmer-text drop-shadow-sm animate-royal-glide-down"
                      style={{ animationDelay: "0ms" }}
                    >
                      Kindly RSVP
                    </div>

                    <div
                      className="text-[#694e25] font-cinzel text-[11px] tracking-[0.3em] uppercase font-bold text-gold-emboss"
                      style={{ animationDelay: "150ms" }}
                    >
                      {data.rsvpLabel}
                    </div>

                    {/* Step 2: Phone Numbers */}
                    <div className="space-y-2 py-1 w-full max-w-[260px]">
                      {data.rsvpNumbers.map((num, idx) => (
                        <div
                          key={idx}
                          className="text-[#120e09] font-clean font-semibold text-sm tracking-wider bg-gradient-to-r from-[#fffcf7] via-[#fbf3e6] to-[#fffcf7] px-4 py-1.5 rounded-xl border border-[#dbc6a4] shadow-sm flex items-center justify-center gap-2 animate-royal-glide-up"
                          style={{ animationDelay: `${250 + idx * 120}ms` }}
                        >
                          <span className="text-[#c5a059] text-xs">📞</span>
                          <span>{num}</span>
                        </div>
                      ))}
                    </div>

                    <div
                      className="text-[#523d1e] font-luxury text-sm font-semibold italic pt-1 animate-royal-glide-up"
                      style={{ animationDelay: "620ms" }}
                    >
                      Turaki (A), Jalingo, Taraba State
                    </div>

                    <div
                      className="text-[#966b1e] font-script text-[27px] drop-shadow-sm animate-royal-scale-in"
                      style={{ animationDelay: "750ms" }}
                    >
                      May Allah bless this union
                    </div>
                  </div>
                )}
              </div>

              {/* BOTTOM CARD FOOTER */}
              <div className="text-center pt-1 flex flex-col items-center">
                <div className="text-[#aa9066] text-[9.5px] font-cinzel tracking-[0.25em] uppercase opacity-80">
                  ✦ {data.groomNick || data.groomName} & {data.brideNick || data.brideName} • {data.eventHeading} ✦
                </div>
              </div>
            </div>
          </Envelope3D>
          </>
          )}

          {/* Quick Overlay Play button if video is paused */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 z-30 bg-black/20 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity"
            >
              <button
                type="button"
                className="w-16 h-16 rounded-full bg-[#fbf8f2]/95 text-[#5e4b2a] flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-transform border border-[#c5a059]"
                aria-label="Play video invitation"
              >
                <Play className="w-7 h-7 ml-1 fill-[#5e4b2a]" />
              </button>
            </div>
          )}
        </div>

        {/* BOTTOM VIDEO CONTROLS BAR (Sleek Glassmorphic Bar) */}
        <div className="mt-3 px-1 space-y-2 z-40">
          {/* Progress scrubber bar with scene markers */}
          <div className="relative flex items-center">
            <input
              type="range"
              min="0"
              max={TOTAL_DURATION}
              step="0.05"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#2c2621] rounded-lg appearance-none cursor-pointer accent-[#c5a059]"
            />
          </div>

          {/* Controls button row */}
          <div className="flex items-center justify-between text-xs text-[#cfc2af]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-lg bg-[#241f1a] hover:bg-[#342d26] text-[#e0cfb8] transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={restartVideo}
                className="p-1.5 rounded-lg bg-[#241f1a] hover:bg-[#342d26] text-[#cfbeaa] transition-colors"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-lg bg-[#241f1a] hover:bg-[#342d26] text-[#cfbeaa] transition-colors"
                title={isMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#c5a059]" />}
              </button>

              <span className="font-clean text-[11px] text-[#9c8e7e] ml-1">
                {formatTime(currentTime)} / {formatTime(TOTAL_DURATION)}
              </span>
            </div>

            {/* Right-side action buttons */}
            <div className="flex items-center gap-1.5">
              {/* Playback Speed selector */}
              <button
                type="button"
                onClick={() => {
                  const speeds = [0.75, 1, 1.25];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-1.5 py-1 rounded bg-[#241f1a] text-[10px] font-semibold text-[#b8a691] hover:text-white"
                title="Playback speed"
              >
                {playbackSpeed}x
              </button>

              <button
                type="button"
                onClick={captureSnapshot}
                className="p-1.5 rounded-lg bg-[#241f1a] hover:bg-[#342d26] text-[#cfbeaa] hover:text-white transition-colors"
                title="Download High-Res Card Image (PNG)"
              >
                <Camera className="w-4 h-4" />
              </button>

              {/* Background Music button */}
              {onAudioClick && (
                <button
                  type="button"
                  onClick={onAudioClick}
                  className="p-1.5 rounded-lg bg-[#241f1a] hover:bg-[#342d26] text-[#c5a059] transition-colors"
                  title="Upload / Change Background Sound"
                >
                  <Music className="w-4 h-4" />
                </button>
              )}

              {/* Download Video Button */}
              <button
                type="button"
                onClick={() => {
                  if (onDownloadClick) onDownloadClick();
                  else setShowDownloadModal(true);
                }}
                className="px-2 py-1 rounded-lg bg-[#c5a059] hover:bg-[#d9b366] text-[#1c150c] font-semibold text-[11px] transition-all flex items-center gap-1 shadow-sm active:scale-95"
                title="Download Video (.mp4 / .webm)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Video</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg bg-[#241f1a] hover:bg-[#342d26] text-[#cfbeaa] hover:text-white transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Action Buttons: Download Video & Upload Background Sound */}
      <div className="w-full max-w-[390px] mt-3.5 flex flex-col gap-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              if (onDownloadClick) onDownloadClick();
              else setShowDownloadModal(true);
            }}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#b58735] via-[#dfb969] to-[#c5a059] text-[#1a140b] font-semibold text-xs transition-all shadow-lg shadow-[#c5a059]/20 hover:brightness-105 active:scale-[0.99] flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#1a140b]" />
            <span>Download Video</span>
          </button>

          {onAudioClick && (
            <button
              type="button"
              onClick={onAudioClick}
              className="py-2.5 px-3 rounded-xl bg-[#282119] hover:bg-[#382d23] text-[#f2e5d0] border border-[#4d3c2b] font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Music className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>Upload Sound</span>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-[#9c8a77]">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#c5a059]" /> 720x1280 Vertical HD
          </span>
          <span className="truncate max-w-[200px] text-right">
            Track: {weddingAudio.getTrackName()}
          </span>
        </div>
      </div>

      {/* Download Video Modal */}
      <VideoDownloadModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        data={data}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
