// Haute Couture Ambient Sound Engine (Procedural Web Audio API)
// Provides a runway catwalk audio atmosphere with 0 external dependencies.

class CoutureAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.analyser = null;
    this.oscillators = [];
    this.pulseInterval = null;
    this.subGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;

    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  toggle() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  start() {
    if (this.isPlaying) return;
    this.init();
    this.isPlaying = true;

    const t = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(0.001, t);
    this.masterGain.gain.exponentialRampToValueAtTime(0.28, t + 2.5);

    // Ethereal Atelier chord: D Minor 9th (D3, F3, A3, C4, E4)
    const freqs = [146.83, 174.61, 220.00, 261.63, 329.63];
    this.oscillators = [];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Gentle slow vibrato detune for warm organic silk texture
      osc.detune.setValueAtTime((idx - 2) * 4, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, t);
      filter.Q.setValueAtTime(2.0, t);

      gain.gain.setValueAtTime(0.08 / freqs.length, t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      this.oscillators.push({ osc, gain });
    });

    // Catwalk Pulse: Deep Sub-bass heartbeat pulse (60 BPM)
    this.startRunwayHeartbeat();
  }

  startRunwayHeartbeat() {
    const triggerPulse = () => {
      if (!this.isPlaying || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(55, t); // 55 Hz (A1)
        subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.6);

        subGain.gain.setValueAtTime(0.35, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        subOsc.connect(subGain);
        subGain.connect(this.masterGain);

        subOsc.start(t);
        subOsc.stop(t + 0.65);
      } catch (e) {
        // Safe fallback
      }
    };

    triggerPulse();
    this.pulseInterval = setInterval(triggerPulse, 2000); // 30-60 BPM cadence
  }

  stop() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    const t = this.ctx ? this.ctx.currentTime : 0;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(t);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, t);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    }

    setTimeout(() => {
      this.oscillators.forEach(({ osc }) => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.oscillators = [];
      if (this.pulseInterval) {
        clearInterval(this.pulseInterval);
        this.pulseInterval = null;
      }
    }, 1300);
  }

  getFrequencyData() {
    if (!this.analyser || !this.isPlaying) return [0, 0, 0, 0];
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return [
      dataArray[2] / 255,
      dataArray[6] / 255,
      dataArray[12] / 255,
      dataArray[18] / 255
    ];
  }
}

export const soundEngine = new CoutureAudioEngine();
