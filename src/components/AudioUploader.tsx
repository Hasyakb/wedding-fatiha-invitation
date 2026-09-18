import React, { useState, useRef } from "react";
import {
  Music,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Trash2,
  Check,
  Sparkles,
  Headphones,
  Sliders,
  AlertCircle,
  FileAudio,
} from "lucide-react";
import { weddingAudio } from "../utils/audio";

interface AudioUploaderProps {
  onAudioChanged?: () => void;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioChanged }) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [currentMode, setCurrentMode] = useState<'harp' | 'strings' | 'custom'>(weddingAudio.getAudioMode());
  const [trackName, setTrackName] = useState<string>(weddingAudio.getTrackName());
  const [trackDuration, setTrackDuration] = useState<number>(weddingAudio.getCustomTrackDuration());
  const [volume, setVolume] = useState<number>(Math.round(weddingAudio.getVolume() * 100));
  const [isMuted, setIsMuted] = useState<boolean>(weddingAudio.getMuted());
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDuration = (secs: number) => {
    if (!secs || isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleFile = async (file: File) => {
    setErrorMessage(null);
    setIsUploading(true);

    try {
      const result = await weddingAudio.loadCustomAudioFile(file);
      if (result.success) {
        setCurrentMode('custom');
        setTrackName(result.name);
        setTrackDuration(result.duration);
        if (isPlayingPreview) {
          weddingAudio.stopAudio();
          weddingAudio.playAudio(0);
        }
        if (onAudioChanged) onAudioChanged();
      } else {
        setErrorMessage(result.error || "Could not process audio file.");
      }
    } catch {
      setErrorMessage("Failed to upload audio file. Please try an MP3, WAV, or M4A file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("audio/")) {
      handleFile(file);
    } else if (file) {
      handleFile(file); // try decoding anyway
    }
  };

  const togglePreview = () => {
    if (isPlayingPreview) {
      weddingAudio.stopAudio();
      setIsPlayingPreview(false);
    } else {
      weddingAudio.setMuted(false);
      setIsMuted(false);
      weddingAudio.playAudio(0);
      setIsPlayingPreview(true);
    }
  };

  const handleSelectPreset = (preset: 'harp' | 'strings') => {
    weddingAudio.selectPreset(preset);
    setCurrentMode(preset);
    setTrackName(preset === 'harp' ? "Romantic Harp Arpeggios" : "Warm Strings & Chimes");
    setTrackDuration(0);
    if (isPlayingPreview) {
      weddingAudio.stopAudio();
      weddingAudio.playAudio(0);
    }
    if (onAudioChanged) onAudioChanged();
  };

  const handleRemoveCustomAudio = () => {
    weddingAudio.removeCustomAudio();
    setCurrentMode('harp');
    setTrackName("Procedural Romantic Harp");
    setTrackDuration(0);
    if (isPlayingPreview) {
      weddingAudio.stopAudio();
      setIsPlayingPreview(false);
    }
    if (onAudioChanged) onAudioChanged();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    weddingAudio.setVolume(val / 100);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    weddingAudio.setMuted(nextMuted);
    if (nextMuted && isPlayingPreview) {
      setIsPlayingPreview(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-5 rounded-2xl bg-[#1d1813] border border-[#382b1d] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#c5a059]/20 flex items-center justify-center border border-[#c5a059]/30">
              <Headphones className="w-5 h-5 text-[#c5a059]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold font-luxury text-[#f4e7d4]">
                Background Audio & Wedding Music
              </h3>
              <p className="text-xs text-[#a0907e]">
                Upload your custom Islamic nasheed, romantic soundtrack, or instrumental track
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={togglePreview}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
              isPlayingPreview
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-[#c5a059] text-[#1c150c] hover:bg-[#d8b165]"
            }`}
          >
            {isPlayingPreview ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Audition</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Audition Audio</span>
              </>
            )}
          </button>
        </div>

        {/* Current Active Sound Badge */}
        <div className="p-3.5 rounded-xl bg-[#251d16] border border-[#443524] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#382b1c] flex items-center justify-center text-[#c5a059]">
              <FileAudio className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#f5ebd9]">
                  {trackName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-[#c5a059]/20 text-[#ddba76] border border-[#c5a059]/30">
                  {currentMode === 'custom' ? "Custom Upload" : "Built-in Preset"}
                </span>
              </div>
              <p className="text-[11px] text-[#9c8976]">
                {currentMode === 'custom'
                  ? `Duration: ${formatDuration(trackDuration)} • Plays during video & embedded in export`
                  : "Gentle romantic acoustic arpeggios crafted for luxury invitations"}
              </p>
            </div>
          </div>

          {currentMode === 'custom' && (
            <button
              type="button"
              onClick={handleRemoveCustomAudio}
              className="p-1.5 text-[#9e8671] hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
              title="Remove custom audio and revert to default harp"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* UPLOAD SECTION: Drag & Drop Area */}
      <div className="p-5 rounded-2xl bg-[#1a1612] border border-[#332619] space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#eedec9] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#c5a059]" />
            Upload Custom Audio File
          </span>
          <span className="text-[11px] text-[#8e7b68]">
            Supported: MP3, WAV, M4A, AAC, OGG
          </span>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-6 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-[#c5a059] bg-[#c5a059]/10"
              : "border-[#403121] hover:border-[#634e38] bg-[#211a14]/60 hover:bg-[#251e18]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-[#2e2318] flex items-center justify-center mb-3 border border-[#4d3b27] text-[#c5a059] group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>

          <div className="text-xs font-semibold text-[#f0e3d1] mb-1">
            {isUploading ? "Decoding Audio Track..." : "Click to select or drag and drop audio file here"}
          </div>
          <p className="text-[11px] text-[#998774] max-w-sm">
            Add a personal Quranic recitation, traditional Hausa wedding song, Nasheed, or your favorite classical instrumental piece.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/40 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* SOUND PRESETS SELECTION */}
      <div className="p-5 rounded-2xl bg-[#1a1612] border border-[#332619] space-y-3.5">
        <span className="text-xs font-semibold text-[#eedec9] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c5a059]" />
          Or Choose a Preset Soundtrack
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Preset 1: Romantic Harp */}
          <div
            onClick={() => handleSelectPreset('harp')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              currentMode === 'harp'
                ? "bg-[#282017] border-[#c5a059] shadow-md shadow-[#c5a059]/10"
                : "bg-[#1f1914] border-[#382b1d] hover:border-[#52402d]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                currentMode === 'harp' ? "border-[#c5a059] bg-[#c5a059]" : "border-[#5c4936]"
              }`}
            >
              {currentMode === 'harp' && <div className="w-1.5 h-1.5 rounded-full bg-[#18120d]" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-[#f5ebd9]">
                Romantic Harp Arpeggios
              </div>
              <p className="text-[11px] text-[#9c8975] mt-0.5">
                Gentle warm pentatonic F-Major acoustic harp, perfect for royalty & wedding invitations.
              </p>
            </div>
          </div>

          {/* Preset 2: Warm Strings & Chimes */}
          <div
            onClick={() => handleSelectPreset('strings')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
              currentMode === 'strings'
                ? "bg-[#282017] border-[#c5a059] shadow-md shadow-[#c5a059]/10"
                : "bg-[#1f1914] border-[#382b1d] hover:border-[#52402d]"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center ${
                currentMode === 'strings' ? "border-[#c5a059] bg-[#c5a059]" : "border-[#5c4936]"
              }`}
            >
              {currentMode === 'strings' && <div className="w-1.5 h-1.5 rounded-full bg-[#18120d]" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-[#f5ebd9]">
                Warm Strings & Chimes
              </div>
              <p className="text-[11px] text-[#9c8975] mt-0.5">
                Lush atmospheric string pads blended with soft golden crystalline harmonics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VOLUME & MIXER CONTROLS */}
      <div className="p-4 rounded-2xl bg-[#1a1612] border border-[#332619] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#ddcebc]">
          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 rounded-lg bg-[#261e17] hover:bg-[#382c20] text-[#c5a059] transition-colors"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span>Volume: {isMuted ? "Muted" : `${volume}%`}</span>
        </div>

        <div className="flex-1 max-w-xs flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            disabled={isMuted}
            className="w-full accent-[#c5a059] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
