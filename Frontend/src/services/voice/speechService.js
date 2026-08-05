/**
 * speechService.js
 * Browser-native Text-To-Speech (TTS) engine using Web Speech API (SpeechSynthesis).
 * Zero external API keys or server latency required.
 */

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isMuted = false;
    this.voices = [];
    this.selectedVoice = null;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  isSupported() {
    return !!this.synth;
  }

  loadVoices() {
    if (!this.synth) return [];
    this.voices = this.synth.getVoices();

    // Prefer high quality English voices (Google, Microsoft, Apple, or natural)
    const preferredVoices = this.voices.filter(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Microsoft') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Alex'))
    );

    if (preferredVoices.length > 0) {
      this.selectedVoice = preferredVoices[0];
    } else {
      this.selectedVoice = this.voices.find((v) => v.lang.startsWith('en')) || this.voices[0] || null;
    }

    return this.voices;
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  getMuted() {
    return this.isMuted;
  }

  /**
   * Strip markdown syntax from text to ensure clean natural speech output.
   */
  cleanTextForSpeech(text) {
    if (!text) return '';
    return text
      .replace(/```[\s\S]*?```/g, ' Code snippet provided in workspace. ') // replace code blocks
      .replace(/`([^`]+)`/g, '$1') // replace inline code
      .replace(/\*\*([^*]+)\*\*/g, '$1') // bold
      .replace(/\*([^*]+)\*/g, '$1') // italic
      .replace(/#+\s+(.*)/g, '$1') // headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
      .replace(/[-*+]\s+/g, '') // bullets
      .replace(/💡|🚀|🤖|⚙️|🎯|💬|✅|❌/g, '') // emojis
      .replace(/\n+/g, ' ') // newlines
      .trim();
  }

  /**
   * Speak input text using SpeechSynthesisUtterance.
   */
  speak(text, { onStart, onEnd, onError, rate = 1.0, pitch = 1.0 } = {}) {
    if (!this.synth || this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    // Stop any ongoing speech
    this.stop();

    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = rate;
    utterance.pitch = pitch;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.currentUtterance = null;
      if (onError) onError(e);
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * Cancel and stop speech synthesis.
   */
  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }
}

export const speechService = new SpeechService();
export default speechService;
