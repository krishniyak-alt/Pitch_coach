export interface FillerWordCount {
  word: string;
  count: number;
}

export interface SpeechTelemetry {
  wpm: number;
  totalWords: number;
  fillerWords: FillerWordCount[];
  audioLevel: number; // 0 - 100 for mic volume meter
}

const COMMON_FILLER_WORDS = [
  "um",
  "uh",
  "like",
  "basically",
  "you know",
  "actually",
  "literally",
  "sort of",
  "kind of",
  "so yeah",
];

export function countFillerWords(transcript: string): FillerWordCount[] {
  const lower = ` ${transcript.toLowerCase().replace(/[^a-z0-9 ]/g, " ")} `;
  const results: FillerWordCount[] = [];

  for (const word of COMMON_FILLER_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "g");
    const matches = lower.match(regex);
    const count = matches ? matches.length : 0;
    if (count > 0) {
      results.push({ word, count });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

export function calculateWpm(wordCount: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 5 || wordCount === 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * Speech Recognition and Audio Level manager using Web Speech API + Web Audio API.
 */
export class SpeechTracker {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private isListening: boolean = false;
  private finalTranscript: string = "";
  private interimTranscript: string = "";

  public onTranscriptChange: (full: string, interim: string) => void = () => {};
  public onAudioLevelChange: (level: number) => void = () => {};
  public onError: (err: string) => void = () => {};

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public async start(): Promise<boolean> {
    this.finalTranscript = "";
    this.interimTranscript = "";
    this.isListening = true;

    // 1. Setup Audio Context for volume metering
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          const source = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          source.connect(this.analyser);

          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          const updateLevel = () => {
            if (!this.isListening || !this.analyser) return;
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avg = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((avg / 128) * 100));
            this.onAudioLevelChange(normalized);
            this.animFrameId = requestAnimationFrame(updateLevel);
          };
          this.animFrameId = requestAnimationFrame(updateLevel);
        }
      }
    } catch (err: any) {
      console.warn("Microphone access or AudioContext error:", err);
      this.onError("Microphone permission denied or unavailable. Web speech might still work.");
    }

    // 2. Setup Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.onError("Browser Speech Recognition not supported. You can still test with sample transcript.");
      return false;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event: any) => {
        let currentInterim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || "";
          if (item.isFinal) {
            this.finalTranscript += (this.finalTranscript ? " " : "") + text.trim();
          } else {
            currentInterim += " " + text;
          }
        }
        this.interimTranscript = currentInterim;
        const total = (this.finalTranscript + " " + this.interimTranscript).trim();
        this.onTranscriptChange(total, this.interimTranscript);
      };

      this.recognition.onerror = (event: any) => {
        if (event.error !== "no-speech") {
          console.warn("Speech recognition error:", event.error);
        }
      };

      this.recognition.onend = () => {
        // Automatically resume if user hasn't explicitly stopped
        if (this.isListening && this.recognition) {
          try {
            this.recognition.start();
          } catch {
            // ignore if already started
          }
        }
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      console.error("Failed to start speech recognition:", e);
      this.onError(e.message || "Failed to start speech recognition");
      return false;
    }
  }

  public stop(): string {
    this.isListening = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
      this.recognition = null;
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }

    this.onAudioLevelChange(0);
    return (this.finalTranscript + " " + this.interimTranscript).trim();
  }

  public getTranscript(): string {
    return (this.finalTranscript + " " + this.interimTranscript).trim();
  }
}
