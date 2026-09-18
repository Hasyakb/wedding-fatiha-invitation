/**
 * Procedural Web Audio API synthesizer for elegant wedding harp arpeggios
 * and envelope opening chime effects.
 */

class WeddingAudioPlayer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private intervalId: number | null = null;
  private extraDestination: AudioNode | null = null;

  // Custom uploaded audio state
  private customBuffer: AudioBuffer | null = null;
  private customSourceNode: AudioBufferSourceNode | null = null;
  private customTrackName: string = "Procedural Romantic Harp";
  private customTrackDuration: number = 0;
  private audioMode: 'harp' | 'strings' | 'custom' = 'harp';
  private volume: number = 0.85;
  private isPlaying: boolean = false;
  private startTimeOffset: number = 0;
  private playStartedAt: number = 0;

  // Pentatonic romantic harp scale frequencies (F Major / D minor warmth)
  private readonly harpPitches = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.0,  // G4
    440.0,  // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    698.46, // F5
    783.99, // G5
    880.0,  // A5
  ];

  // Warm classical strings progression chords
  private readonly stringsChords = [
    [220, 261.63, 329.63, 440], // Am
    [174.61, 220, 261.63, 349.23], // F
    [261.63, 329.63, 392, 523.25], // C
    [196, 246.94, 293.66, 392], // G
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initCtx();
    }
    if (this.customSourceNode && muted) {
      this.stopCustomSource();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public getAudioMode(): 'harp' | 'strings' | 'custom' {
    return this.audioMode;
  }

  public getTrackName(): string {
    return this.customTrackName;
  }

  public getCustomTrackDuration(): number {
    return this.customTrackDuration;
  }

  /**
   * Decodes an uploaded user audio file (MP3, WAV, OGG, M4A, etc.)
   */
  public async loadCustomAudioFile(file: File): Promise<{ success: boolean; duration: number; name: string; error?: string }> {
    this.initCtx();
    if (!this.ctx) {
      return { success: false, duration: 0, name: file.name, error: "Audio context not supported" };
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      // Decode audio data safely
      const decodedBuffer = await this.ctx.decodeAudioData(arrayBuffer);

      this.customBuffer = decodedBuffer;
      this.customTrackName = file.name;
      this.customTrackDuration = decodedBuffer.duration;
      this.audioMode = 'custom';

      return {
        success: true,
        duration: decodedBuffer.duration,
        name: file.name,
      };
    } catch (err) {
      console.error("Failed to decode audio file", err);
      return {
        success: false,
        duration: 0,
        name: file.name,
        error: "Could not decode audio file. Please try a valid MP3, WAV, or M4A file.",
      };
    }
  }

  public selectPreset(preset: 'harp' | 'strings') {
    this.stopAudio();
    this.audioMode = preset;
    this.customTrackName = preset === 'harp' ? "Romantic Harp Arpeggios" : "Warm Strings & Chimes";
  }

  public removeCustomAudio() {
    this.stopAudio();
    this.customBuffer = null;
    this.customTrackDuration = 0;
    this.audioMode = 'harp';
    this.customTrackName = "Procedural Romantic Harp";
  }

  public playEnvelopeSwoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playHarpPluck(freq, 2.0, 0.05 * this.volume);
        }, idx * 90);
      });
    } catch {
      // Ignore
    }
  }

  public playHarpPluck(freq: number, duration: number = 2.4, gainLevel: number = 0.08) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Warm harmonic overtone
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      const finalGain = gainLevel * this.volume;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(finalGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      if (this.extraDestination) {
        try {
          gain.connect(this.extraDestination);
        } catch {
          // ignore
        }
      }

      osc.start(now);
      osc2.start(now);
      osc.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  private playStringsPad(chordIdx: number) {
    if (this.isMuted || !this.ctx) return;
    const chord = this.stringsChords[chordIdx % this.stringsChords.length];
    const now = this.ctx.currentTime;
    const dur = 3.5;

    chord.forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const targetGain = 0.025 * this.volume;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      if (this.extraDestination) {
        try { gain.connect(this.extraDestination); } catch {}
      }

      osc.start(now);
      osc.stop(now + dur);
    });
  }

  private startProceduralPlayback() {
    if (this.intervalId) return;
    let step = 0;
    const progression = [0, 2, 4, 7, 5, 4, 2, 0, 3, 5, 7, 9, 7, 5, 4, 2];

    this.intervalId = window.setInterval(() => {
      if (!this.isMuted) {
        if (this.audioMode === 'harp') {
          const pitchIndex = progression[step % progression.length];
          const freq = this.harpPitches[pitchIndex % this.harpPitches.length];
          this.playHarpPluck(freq, 2.2, 0.045);
        } else if (this.audioMode === 'strings') {
          if (step % 4 === 0) {
            this.playStringsPad(Math.floor(step / 4));
          }
          // gentle harp arpeggio over strings
          const pitchIndex = progression[step % progression.length];
          const freq = this.harpPitches[pitchIndex % this.harpPitches.length];
          this.playHarpPluck(freq, 2.0, 0.03);
        }
        step++;
      }
    }, 650);
  }

  private stopCustomSource() {
    if (this.customSourceNode) {
      try {
        this.customSourceNode.stop();
        this.customSourceNode.disconnect();
      } catch {
        // already stopped
      }
      this.customSourceNode = null;
    }
  }

  /**
   * Starts playing audio (custom uploaded track OR procedural synth)
   */
  public playAudio(offsetSeconds: number = 0) {
    this.initCtx();
    if (!this.ctx || this.isMuted) return;

    this.isPlaying = true;
    this.startTimeOffset = offsetSeconds;
    this.playStartedAt = this.ctx.currentTime;

    if (this.audioMode === 'custom' && this.customBuffer) {
      this.stopCustomSource();

      try {
        const source = this.ctx.createBufferSource();
        source.buffer = this.customBuffer;
        source.loop = true;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        if (this.extraDestination) {
          try {
            gainNode.connect(this.extraDestination);
          } catch {}
        }

        const bufferDuration = this.customBuffer.duration;
        const startOffset = bufferDuration > 0 ? (offsetSeconds % bufferDuration) : 0;
        source.start(0, startOffset);
        this.customSourceNode = source;
      } catch (e) {
        console.error("Error starting custom audio playback", e);
      }
    } else {
      this.startProceduralPlayback();
    }
  }

  /**
   * Stops audio playback
   */
  public stopAudio() {
    this.isPlaying = false;
    this.stopCustomSource();
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Backwards compatibility aliases
  public startBackgroundHarp(offsetSeconds: number = 0) {
    this.playAudio(offsetSeconds);
  }

  public stopBackgroundHarp() {
    this.stopAudio();
  }

  public getAudioStreamDestination(): MediaStreamAudioDestinationNode | null {
    this.initCtx();
    if (!this.ctx) return null;
    try {
      const dest = this.ctx.createMediaStreamDestination();
      this.extraDestination = dest;
      return dest;
    } catch {
      return null;
    }
  }

  public clearAudioStreamDestination() {
    this.extraDestination = null;
  }
}

export const weddingAudio = new WeddingAudioPlayer();
