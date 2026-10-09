/**
 * Tiny Web Audio engine.
 *
 * - Background music: plays `birthdayConfig.music.src` if provided, otherwise
 *   a gently synthesized music-box "Happy Birthday" (public-domain melody),
 *   so no audio asset is required and nothing can 404.
 * - Sound effects are synthesized chimes, only audible once sound is enabled.
 *
 * Everything is created lazily inside a user gesture (browser autoplay rules).
 */

export type SfxName = "open" | "blow" | "paper" | "sparkle" | "chime" | "pluck";

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

// [midi, beats, bass?] — 3/4 time with a one-beat pickup.
const SONG: ReadonlyArray<readonly [number, number, number?]> = [
  [67, 0.75], [67, 0.25],
  [69, 1, 48], [67, 1], [72, 1],
  [71, 2, 43], [67, 0.75], [67, 0.25],
  [69, 1, 43], [67, 1], [74, 1],
  [72, 2, 48], [67, 0.75], [67, 0.25],
  [79, 1, 48], [76, 1], [72, 1],
  [71, 1, 41], [69, 1], [77, 0.75], [77, 0.25],
  [76, 1, 48], [72, 1], [74, 1, 43],
  [72, 3, 48],
  [0, 3], // breath before the loop
];

const BPM = 80;
const BEAT = 60 / BPM;
const LOOKAHEAD = 0.5;

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer: number | null = null;
  private stopTimer: number | null = null;
  private step = 0;
  private nextTime = 0;
  private audioEl: HTMLAudioElement | null = null;
  private fileFailed = false;

  constructor(
    private readonly src: string | null,
    private readonly volume: number,
  ) {}

  /** Must be called synchronously inside a user gesture (unlocks iOS audio). */
  private ensureContext() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    }
    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
    if (!Ctor) return null;

    const ctx = new Ctor();
    const master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // Soft echo for a dreamy, music-box-in-a-big-room feel.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.34;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.28;
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    const wet = ctx.createGain();
    wet.gain.value = 0.32;
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    tone.connect(wet);
    wet.connect(master);

    const musicBus = ctx.createGain();
    musicBus.gain.value = 0;
    musicBus.connect(master);
    musicBus.connect(delay);

    const sfxBus = ctx.createGain();
    sfxBus.gain.value = 0.55;
    sfxBus.connect(master);
    sfxBus.connect(delay);

    this.ctx = ctx;
    this.master = master;
    this.musicBus = musicBus;
    this.sfxBus = sfxBus;
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  }

  /** Returns false if audio is unavailable in this browser. */
  startMusic(): boolean {
    if (this.stopTimer !== null) {
      window.clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }

    if (this.src && !this.fileFailed) {
      // Unlock the context too, so sound effects work alongside the file.
      this.ensureContext();
      if (!this.audioEl) {
        const el = new Audio(this.src);
        el.loop = true;
        el.preload = "auto";
        el.addEventListener("error", () => {
          this.fileFailed = true;
          if (this.audioEl === el && !el.paused) el.pause();
          this.audioEl = null;
          this.startBox();
        });
        this.audioEl = el;
      }
      this.audioEl.volume = this.volume;
      this.audioEl.play().catch(() => {
        this.fileFailed = true;
        this.audioEl = null;
        this.startBox();
      });
      return true;
    }

    return this.startBox();
  }

  private startBox(): boolean {
    const ctx = this.ensureContext();
    if (!ctx || !this.musicBus) return false;
    const now = ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, now);
    this.musicBus.gain.linearRampToValueAtTime(this.volume, now + 1.2);

    if (this.timer === null) {
      this.step = 0;
      this.nextTime = now + 0.15;
      this.timer = window.setInterval(() => this.schedule(), 120);
      this.schedule();
    }
    return true;
  }

  stopMusic() {
    this.audioEl?.pause();
    const ctx = this.ctx;
    if (!ctx || !this.musicBus) return;
    const now = ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(now);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, now);
    this.musicBus.gain.linearRampToValueAtTime(0, now + 0.6);
    if (this.stopTimer !== null) window.clearTimeout(this.stopTimer);
    this.stopTimer = window.setTimeout(() => {
      if (this.timer !== null) window.clearInterval(this.timer);
      this.timer = null;
      this.stopTimer = null;
    }, 700);
  }

  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.musicBus) return;
    while (this.nextTime < ctx.currentTime + LOOKAHEAD) {
      const [note, beats, bass] = SONG[this.step];
      if (note > 0) {
        // A tiny, deterministic swing keeps it from sounding mechanical.
        const vel = 0.16 + ((this.step * 7) % 5) * 0.012;
        this.bell(this.musicBus, midiToHz(note), this.nextTime, vel, 1.8);
      }
      if (bass) this.softBass(this.musicBus, midiToHz(bass), this.nextTime);
      this.nextTime += beats * BEAT;
      this.step = (this.step + 1) % SONG.length;
    }
  }

  /** Music-box style bell: sine partials with fast attack and exponential decay. */
  private bell(dest: AudioNode, freq: number, t: number, vel: number, decay: number) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    env.connect(dest);

    const partials: Array<[number, number]> = [
      [1, 1],
      [2.0, 0.28],
      [4.07, 0.07],
    ];
    for (const [ratio, gain] of partials) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * ratio;
      const g = ctx.createGain();
      g.gain.value = gain;
      osc.connect(g);
      g.connect(env);
      osc.start(t);
      osc.stop(t + decay + 0.05);
    }
  }

  private softBass(dest: AudioNode, freq: number, t: number) {
    const ctx = this.ctx!;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.09, t + 0.04);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    env.connect(dest);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = freq;
    osc.connect(env);
    osc.start(t);
    osc.stop(t + 2.5);
  }

  private noiseBuffer() {
    const ctx = this.ctx!;
    if (this.noise) return this.noise;
    const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 1;
    for (let i = 0; i < data.length; i++) {
      seed = (seed * 16807) % 2147483647;
      data[i] = (seed / 2147483647) * 2 - 1;
    }
    this.noise = buffer;
    return buffer;
  }

  private whoosh(t: number, from: number, to: number, dur: number, gain: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 0.9;
    filter.frequency.setValueAtTime(from, t);
    filter.frequency.exponentialRampToValueAtTime(to, t + dur);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(gain, t + dur * 0.25);
    env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter);
    filter.connect(env);
    env.connect(this.sfxBus!);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  playSfx(name: SfxName, variant = 0) {
    const ctx = this.ensureContext();
    if (!ctx || !this.sfxBus) return;
    const t = ctx.currentTime + 0.02;
    const bus = this.sfxBus;

    switch (name) {
      case "open":
        [72, 76, 79, 84, 88, 91].forEach((n, i) =>
          this.bell(bus, midiToHz(n), t + i * 0.075, 0.13, 1.6),
        );
        break;
      case "blow":
        this.whoosh(t, 1400, 380, 0.55, 0.22);
        [84, 88].forEach((n, i) => this.bell(bus, midiToHz(n), t + 0.45 + i * 0.12, 0.1, 1.8));
        break;
      case "paper":
        this.whoosh(t, 3200, 1800, 0.18, 0.08);
        this.whoosh(t + 0.22, 2800, 1600, 0.22, 0.07);
        [76, 81].forEach((n, i) => this.bell(bus, midiToHz(n), t + 0.35 + i * 0.14, 0.09, 1.6));
        break;
      case "sparkle":
        [96, 91, 98, 93, 100, 95, 103].forEach((n, i) =>
          this.bell(bus, midiToHz(n), t + i * 0.09, 0.05, 1.1),
        );
        break;
      case "chime":
        this.bell(bus, midiToHz(84), t, 0.1, 1.6);
        break;
      case "pluck": {
        const scale = [79, 81, 84, 86, 88];
        const n = scale[variant % scale.length];
        this.bell(bus, midiToHz(n), t, 0.12, 1.5);
        this.bell(bus, midiToHz(n + 12), t + 0.09, 0.05, 1.2);
        break;
      }
    }
  }

  dispose() {
    if (this.timer !== null) window.clearInterval(this.timer);
    if (this.stopTimer !== null) window.clearTimeout(this.stopTimer);
    this.timer = null;
    this.audioEl?.pause();
    this.audioEl = null;
    void this.ctx?.close();
    this.ctx = null;
  }
}
