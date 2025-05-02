
/// <reference types="vite/client" />

// Extend Window interface for Speech Synthesis
interface SpeechSynthesisUtterance {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
  rate: number;
  text: string;
  lang: string;
  volume: number;
  
  onstart: () => void;
  onend: () => void;
  onerror: () => void;
}

interface SpeechSynthesisVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

interface SpeechSynthesis {
  pending: boolean;
  speaking: boolean;
  paused: boolean;
  
  onvoiceschanged: () => void;
  getVoices(): SpeechSynthesisVoice[];
  speak(utterance: SpeechSynthesisUtterance): void;
  cancel(): void;
  pause(): void;
  resume(): void;
}

interface Window {
  speechSynthesis: SpeechSynthesis;
  SpeechSynthesisUtterance: {
    prototype: SpeechSynthesisUtterance;
    new(text: string): SpeechSynthesisUtterance;
  };
}
