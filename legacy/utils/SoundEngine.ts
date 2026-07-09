"use client";

class SoundEngine {
    private ctx: AudioContext | null = null;
    private oscillator: OscillatorNode | null = null;
    private gainNode: GainNode | null = null;

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.oscillator = this.ctx.createOscillator();
        this.gainNode = this.ctx.createGain();

        this.oscillator.type = "sine";
        this.oscillator.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A hum
        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
        this.oscillator.start();
    }

    start() {
        if (!this.ctx || !this.gainNode) return;
        this.gainNode.gain.setTargetAtTime(0.05, this.ctx.currentTime, 2);
    }

    setTone(status: "SUCCESS" | "FAILURE") {
        if (!this.ctx || !this.oscillator) return;
        const freq = status === "SUCCESS" ? 65.41 : 51.91; // C2 vs Ab1
        this.oscillator.frequency.setTargetAtTime(freq, this.ctx.currentTime, 1);
    }

    stop() {
        if (!this.gainNode || !this.ctx) return;
        this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 1);
    }
}

export const soundEngine = new SoundEngine();
