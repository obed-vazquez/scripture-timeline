import { Injectable, NgZone, computed, inject, signal } from '@angular/core';

/** YouTube video used as background music (chosen by the user). */
export const MUSIC_VIDEO = { youtube: 'LI8INlvOeJ8', title: 'God I Look to You · Christian Music Time' };
const MUSIC_VOLUME_KEY = 'timeline-music-volume';

export type PlayerKind = 'video' | 'music';
export type PlayerState = 'loading' | 'playing' | 'paused' | 'ended';

export interface Player {
  /** Unique key: the scene node of the video block, or 'music'. */
  key: string;
  /** Numeric id used by the YouTube postMessage protocol. */
  pid: number;
  kind: PlayerKind;
  youtube: string;
  title: string;
  /** Scene node of the video block (videos only). */
  nodeId?: string;
  /** Start muted (autoplay without a user gesture is only allowed muted). */
  muted: boolean;
}

/**
 * Videos and background music (both YouTube). Only one plays at a time: starting one pauses
 * the others, and a video pauses the music until it stops. A video that leaves the screen keeps
 * playing in a small player docked in a corner; several docked players sit side by side.
 */
@Injectable({ providedIn: 'root' })
export class MediaService {
  private zone = inject(NgZone);
  private nextPid = 1;
  private frames = new Map<number, HTMLIFrameElement>();

  readonly players = signal<Player[]>([]);
  readonly states = signal<Record<number, PlayerState>>({});
  /**
   * Videos shown over their block on the canvas (the rest are docked), and whether the camera
   * rests on that block. Written by the stage only when it changes; the stage moves the players.
   */
  readonly attached = signal<Record<string, { current: boolean }>>({});
  readonly volume = signal(readVolume());

  readonly music = computed(() => this.players().find((p) => p.kind === 'music') ?? null);
  readonly musicOn = computed(() => !!this.music());
  /** The music was paused by a video and comes back when the video stops. */
  private musicHeld = false;
  private waitingGesture = false;

  constructor() {
    window.addEventListener('message', (e) => this.onMessage(e));
  }

  // ── videos ────────────────────────────────────────────────

  playVideo(nodeId: string, youtube: string, title: string): void {
    const existing = this.players().find((p) => p.key === nodeId);
    if (existing) {
      this.command(existing, 'playVideo');
      return;
    }
    this.add({ key: nodeId, pid: this.nextPid++, kind: 'video', youtube, title, nodeId, muted: false });
  }

  close(p: Player): void {
    this.command(p, 'stopVideo');
    this.players.update((list) => list.filter((x) => x !== p));
    this.frames.delete(p.pid);
    if (p.kind === 'music') this.musicHeld = false;
    else this.resumeMusicIfIdle();
  }

  // ── music ─────────────────────────────────────────────────

  toggleMusic(): void {
    const m = this.music();
    if (m) this.close(m);
    else this.startMusic(false);
  }

  /** Starts the music. From a shared link (no gesture yet) it starts muted and unmutes on the first gesture. */
  startMusic(fromLink: boolean): void {
    if (this.music()) return;
    this.add({ key: 'music', pid: this.nextPid++, kind: 'music', youtube: MUSIC_VIDEO.youtube, title: MUSIC_VIDEO.title, muted: fromLink });
    if (fromLink) this.waitForGesture();
  }

  setVolume(v: number): void {
    const vol = Math.max(0, Math.min(100, Math.round(v)));
    this.volume.set(vol);
    try {
      localStorage.setItem(MUSIC_VOLUME_KEY, `${vol}`);
    } catch {
      /* storage unavailable */
    }
    const m = this.music();
    if (m) this.command(m, 'setVolume', [vol]);
  }

  // ── iframe wiring (called by the dock) ────────────────────

  src(p: Player): string {
    const params = new URLSearchParams({
      autoplay: '1',
      enablejsapi: '1',
      rel: '0',
      playsinline: '1',
      origin: location.origin,
    });
    if (p.muted) params.set('mute', '1');
    if (p.kind === 'music') {
      params.set('loop', '1');
      params.set('playlist', p.youtube);
    }
    return `https://www.youtube-nocookie.com/embed/${p.youtube}?${params}`;
  }

  /** The iframe loaded: ask it to report its state changes. */
  registerFrame(p: Player, frame: HTMLIFrameElement): void {
    this.frames.set(p.pid, frame);
    const hello = () => frame.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: p.pid, channel: 'widget' }), '*');
    hello();
    // The player only answers once it is ready; repeat the handshake for a few seconds.
    let n = 0;
    const timer = setInterval(() => {
      if (++n > 10 || this.states()[p.pid] && this.states()[p.pid] !== 'loading') clearInterval(timer);
      else hello();
    }, 500);
    if (p.kind === 'music') setTimeout(() => this.command(p, 'setVolume', [this.volume()]), 1200);
  }

  stateOf(p: Player): PlayerState {
    return this.states()[p.pid] ?? 'loading';
  }

  // ── internals ─────────────────────────────────────────────

  private add(p: Player): void {
    this.players.update((list) => [...list, p]);
    this.states.update((s) => ({ ...s, [p.pid]: 'loading' }));
    // a new video takes over: pause whatever else is playing
    this.pauseOthers(p);
  }

  private command(p: Player, func: string, args: unknown[] = []): void {
    this.frames.get(p.pid)?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args, id: p.pid }), '*');
  }

  private pauseOthers(p: Player): void {
    for (const o of this.players()) {
      if (o === p || this.stateOf(o) !== 'playing') continue;
      if (o.kind === 'music' && p.kind === 'video') this.musicHeld = true;
      this.command(o, 'pauseVideo');
    }
  }

  private resumeMusicIfIdle(): void {
    if (!this.musicHeld) return;
    const busy = this.players().some((x) => x.kind === 'video' && this.stateOf(x) === 'playing');
    const m = this.music();
    if (busy || !m) return;
    this.musicHeld = false;
    this.command(m, 'playVideo');
  }

  private onMessage(e: MessageEvent): void {
    if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(e.origin)) return;
    let data: { event?: string; id?: number; info?: unknown };
    try {
      data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
    } catch {
      return;
    }
    let code: number | undefined;
    if (data.event === 'onStateChange' && typeof data.info === 'number') code = data.info;
    else if (data.event === 'infoDelivery' && data.info && typeof (data.info as { playerState?: number }).playerState === 'number') {
      code = (data.info as { playerState: number }).playerState;
    }
    if (code === undefined) return;
    const pid = data.id ?? this.pidForSource(e.source);
    if (pid === undefined) return;
    // 1 playing · 2 paused · 0 ended (buffering, cued and unstarted change nothing)
    const state: PlayerState | null = code === 1 ? 'playing' : code === 2 ? 'paused' : code === 0 ? 'ended' : null;
    if (!state || this.states()[pid] === state) return;
    this.zone.run(() => {
      this.states.update((s) => ({ ...s, [pid]: state }));
      const p = this.players().find((x) => x.pid === pid);
      if (!p) return;
      if (state === 'playing') this.pauseOthers(p);
      else if (p.kind === 'video') this.resumeMusicIfIdle();
    });
  }

  private pidForSource(src: MessageEventSource | null): number | undefined {
    for (const [pid, f] of this.frames) if (f.contentWindow === src) return pid;
    return undefined;
  }

  /** Autoplay with sound needs a user gesture: the music starts muted and unmutes on the first one. */
  private waitForGesture(): void {
    if (this.waitingGesture) return;
    this.waitingGesture = true;
    const kinds = ['pointerdown', 'keydown', 'touchend', 'wheel'];
    const go = () => {
      kinds.forEach((k) => document.removeEventListener(k, go, true));
      this.waitingGesture = false;
      const m = this.music();
      if (!m) return;
      this.command(m, 'unMute');
      this.command(m, 'setVolume', [this.volume()]);
      this.command(m, 'playVideo');
    };
    kinds.forEach((k) => document.addEventListener(k, go, true));
  }
}

function readVolume(): number {
  try {
    const v = Number(localStorage.getItem(MUSIC_VOLUME_KEY));
    if (v >= 0 && v <= 100 && localStorage.getItem(MUSIC_VOLUME_KEY) !== null) return v;
  } catch {
    /* storage unavailable */
  }
  return 30;
}
