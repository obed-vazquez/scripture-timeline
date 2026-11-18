import { select, Selection } from 'd3-selection';
import { zoom, zoomIdentity, ZoomBehavior, ZoomTransform } from 'd3-zoom';
import { interrupt } from 'd3-transition';
import 'd3-transition';
import { easeCubicInOut } from 'd3-ease';
import { interpolateZoom } from 'd3-interpolate';
import { Insets, Rect, clamp } from './geometry';

export type SettleReason = 'user' | 'program';

/**
 * Prezi-like camera over a plain HTML element.
 *  - drag with the left button from anywhere (also over objects), one finger on touch
 *  - mouse wheel zooms towards the cursor (smoothed)
 *  - touchpad: two fingers pan, pinch zooms
 *  - pinch on touch screens
 *  - inertia after a drag
 *  - smooth "fly to" transitions (van Wijk & Nuij: out, across and in, in one curve)
 */
export class Camera {
  t: ZoomTransform = zoomIdentity;
  onChange: (t: ZoomTransform) => void = () => {};
  onSettle: (reason: SettleReason) => void = () => {};
  onUserStart: () => void = () => {};
  reducedMotion = false;
  speed = 1;

  private sel: Selection<HTMLElement, unknown, null, undefined>;
  private zb: ZoomBehavior<HTMLElement, unknown>;
  private samples: { x: number; y: number; time: number }[] = [];
  private inertiaRaf = 0;
  private wheelRaf = 0;
  private wheelTarget: ZoomTransform | null = null;
  private wheelPoint: [number, number] = [0, 0];
  private wheeling = false;
  private suppressEnd = false;
  private wheelEnd: ReturnType<typeof setTimeout> | undefined;
  private lastWheelAt = 0;
  private lastWheelKind: 'zoom' | 'pan' = 'zoom';
  private flying = false;

  constructor(private el: HTMLElement) {
    this.sel = select(el);
    this.zb = zoom<HTMLElement, unknown>()
      .filter((ev: Event) => {
        if (ev.type === 'wheel' || ev.type === 'dblclick') return false;
        const me = ev as MouseEvent;
        if (me.button) return false;
        const target = ev.target as Element | null;
        return !target?.closest?.('[data-nopan]');
      })
      .clickDistance(6)
      .tapDistance(12)
      .on('start', (ev) => {
        if (ev.sourceEvent) {
          this.stopInertia();
          this.stopWheel();
          this.flying = false;
          this.onUserStart();
        }
        this.samples = [];
      })
      .on('zoom', (ev) => {
        this.t = ev.transform;
        const se = ev.sourceEvent as Event | null;
        if (se && (se.type === 'mousemove' || se.type === 'touchmove' || se.type === 'pointermove')) {
          this.samples.push({ x: this.t.x, y: this.t.y, time: performance.now() });
          if (this.samples.length > 8) this.samples.shift();
        }
        this.onChange(this.t);
      })
      .on('end', (ev) => {
        if (this.wheeling || this.suppressEnd) return;
        if (ev.sourceEvent) {
          if (!this.startInertia()) this.onSettle('user');
        } else if (!this.flying) {
          this.onSettle('program');
        }
      });
    this.sel.call(this.zb).on('dblclick.zoom', null);
    el.addEventListener('wheel', this.onWheel, { passive: false });
  }

  destroy(): void {
    this.el.removeEventListener('wheel', this.onWheel);
    this.sel.on('.zoom', null);
    this.stopInertia();
    this.stopWheel();
  }

  get width(): number {
    return this.el.clientWidth;
  }
  get height(): number {
    return this.el.clientHeight;
  }

  setLimits(bounds: Rect, minK: number, maxK: number): void {
    const mx = bounds.w * 0.35;
    const my = bounds.h * 0.35;
    this.zb
      .scaleExtent([minK, maxK])
      .translateExtent([
        [bounds.x - mx, bounds.y - my],
        [bounds.x + bounds.w + mx, bounds.y + bounds.h + my],
      ]);
  }

  /** Transform that frames `r` in the viewport minus `insets`. */
  fitTransform(r: Rect, insets: Insets, mode: 'fit' | 'top' = 'fit'): ZoomTransform {
    const aw = Math.max(40, this.width - insets.left - insets.right);
    const ah = Math.max(40, this.height - insets.top - insets.bottom);
    let k = Math.min(aw / r.w, ah / r.h);
    if (mode === 'top') k = aw / r.w;
    const tx = insets.left + (aw - r.w * k) / 2 - r.x * k;
    const ty = mode === 'top' && r.h * k > ah ? insets.top - r.y * k : insets.top + (ah - r.h * k) / 2 - r.y * k;
    return zoomIdentity.translate(tx, ty).scale(k);
  }

  /** Smoothly moves the camera to frame `r`. Resolves when it arrives (or is interrupted). */
  flyTo(r: Rect, insets: Insets, mode: 'fit' | 'top' = 'fit', opts: { instant?: boolean } = {}): Promise<void> {
    const target = this.fitTransform(r, insets, mode);
    return this.flyToTransform(target, opts);
  }

  flyToTransform(target: ZoomTransform, opts: { instant?: boolean } = {}): Promise<void> {
    this.stopInertia();
    this.stopWheel();
    interrupt(this.el, 'fly');
    if (opts.instant || this.reducedMotion) {
      this.flying = false;
      this.sel.call(this.zb.transform, target);
      return Promise.resolve();
    }
    const duration = this.durationTo(target);
    this.flying = true;
    return new Promise<void>((resolve) => {
      this.sel
        .transition('fly')
        .duration(duration)
        .ease(easeCubicInOut)
        .call(this.zb.transform, target)
        .on('end', () => {
          this.flying = false;
          this.onSettle('program');
          resolve();
        })
        .on('interrupt', () => {
          this.flying = false;
          resolve();
        });
    });
  }

  zoomBy(factor: number): void {
    this.flyToTransform(this.scaledAround(this.t, factor, [this.width / 2, this.height / 2]));
  }

  stop(): void {
    interrupt(this.el, 'fly');
    this.flying = false;
    this.stopInertia();
    this.stopWheel();
  }

  /** World point at the centre of the viewport. */
  center(): [number, number] {
    return this.t.invert([this.width / 2, this.height / 2]) as [number, number];
  }

  // ── internals ─────────────────────────────────────────────

  private durationTo(target: ZoomTransform): number {
    const w = this.width;
    const h = this.height;
    const c0 = this.t.invert([w / 2, h / 2]);
    const c1 = target.invert([w / 2, h / 2]);
    const i = interpolateZoom([c0[0], c0[1], w / this.t.k], [c1[0], c1[1], w / target.k]);
    return clamp(i.duration * 0.7, 650, 2300) / this.speed;
  }

  private scaledAround(t: ZoomTransform, factor: number, p: [number, number]): ZoomTransform {
    const [lo, hi] = this.zb.scaleExtent();
    const k = clamp(t.k * factor, lo, hi);
    const wx = (p[0] - t.x) / t.k;
    const wy = (p[1] - t.y) / t.k;
    return zoomIdentity.translate(p[0] - wx * k, p[1] - wy * k).scale(k);
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if ((e.target as Element | null)?.closest?.('[data-nopan]')) return;
    const now = performance.now();
    const kind = this.classifyWheel(e, now);
    if (!this.wheeling) {
      this.wheeling = true;
      this.stopInertia();
      interrupt(this.el, 'fly');
      this.flying = false;
      this.onUserStart();
    }
    const box = this.el.getBoundingClientRect();
    const p: [number, number] = [e.clientX - box.left, e.clientY - box.top];
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? box.height : 1;

    if (kind === 'pan') {
      this.stopWheel();
      let dx = e.deltaX * unit;
      let dy = e.deltaY * unit;
      if (e.shiftKey && !dx) {
        dx = dy;
        dy = 0;
      }
      this.zb.translateBy(this.sel, -dx / this.t.k, -dy / this.t.k);
    } else if (e.ctrlKey) {
      // touchpad pinch: already smooth, apply directly
      this.stopWheel();
      const factor = Math.pow(2, -e.deltaY * unit * 0.01);
      this.zb.scaleTo(this.sel, this.t.k * factor, p);
    } else {
      // mouse wheel: accumulate a target and glide towards it
      const factor = Math.pow(2, -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 0.002) * 1.15);
      const base = this.wheelTarget ?? this.t;
      this.wheelTarget = this.scaledAround(base, factor, p);
      this.wheelPoint = p;
      if (!this.wheelRaf) this.wheelRaf = requestAnimationFrame(this.wheelStep);
    }
    clearTimeout(this.wheelEnd);
    this.wheelEnd = setTimeout(() => {
      if (this.wheelRaf) return; // the glide finishes it
      this.wheeling = false;
      this.onSettle('user');
    }, 200);
  };

  private wheelStep = () => {
    this.wheelRaf = 0;
    const target = this.wheelTarget;
    if (!target) return;
    const t = this.t;
    const a = 0.24;
    const k = t.k * Math.pow(target.k / t.k, a);
    const done = Math.abs(Math.log(target.k / t.k)) < 0.002;
    const next = done ? target : this.scaledAround(t, k / t.k, this.wheelPoint);
    // keep the point under the cursor fixed while gliding
    this.sel.call(this.zb.transform, next);
    if (done) {
      this.wheelTarget = null;
      clearTimeout(this.wheelEnd);
      this.wheelEnd = setTimeout(() => {
        this.wheeling = false;
        this.onSettle('user');
      }, 120);
      return;
    }
    this.wheelRaf = requestAnimationFrame(this.wheelStep);
  };

  private stopWheel(): void {
    if (this.wheelRaf) cancelAnimationFrame(this.wheelRaf);
    this.wheelRaf = 0;
    this.wheelTarget = null;
  }

  private classifyWheel(e: WheelEvent, now: number): 'zoom' | 'pan' {
    if (e.ctrlKey) return 'zoom';
    if (now - this.lastWheelAt < 140) {
      this.lastWheelAt = now;
      return this.lastWheelKind;
    }
    const wd = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
    let kind: 'zoom' | 'pan';
    if (e.deltaMode !== 0) kind = 'zoom';
    else if (Math.abs(e.deltaX) > 0.5) kind = 'pan';
    else if (typeof wd === 'number' && wd !== 0 && Math.abs(wd) % 120 === 0) kind = 'zoom';
    else if (!Number.isInteger(e.deltaY)) kind = 'pan';
    else kind = Math.abs(e.deltaY) >= 50 ? 'zoom' : 'pan';
    this.lastWheelAt = now;
    this.lastWheelKind = kind;
    return kind;
  }

  private startInertia(): boolean {
    const s = this.samples;
    if (s.length < 2 || this.reducedMotion) return false;
    const last = s[s.length - 1];
    if (performance.now() - last.time > 80) return false;
    const first = s.find((p) => last.time - p.time < 110) ?? s[0];
    const dt = Math.max(24, last.time - first.time);
    let vx = (last.x - first.x) / dt;
    let vy = (last.y - first.y) / dt;
    const speed = Math.hypot(vx, vy);
    if (speed < 0.25) return false;
    const maxSpeed = 2.6; // px per ms: a strong flick, never a jump across the canvas
    if (speed > maxSpeed) {
      vx *= maxSpeed / speed;
      vy *= maxSpeed / speed;
    }
    let prev = performance.now();
    const step = () => {
      const now = performance.now();
      const d = now - prev;
      prev = now;
      const decay = Math.exp(-d / 320);
      vx *= decay;
      vy *= decay;
      this.zb.translateBy(this.sel, (vx * d) / this.t.k, (vy * d) / this.t.k);
      if (Math.hypot(vx, vy) < 0.02) {
        this.inertiaRaf = 0;
        this.suppressEnd = false;
        this.onSettle('user');
        return;
      }
      this.inertiaRaf = requestAnimationFrame(step);
    };
    this.suppressEnd = true; // swallow the 'end' events fired by translateBy
    this.inertiaRaf = requestAnimationFrame(step);
    return true;
  }

  private stopInertia(): void {
    if (this.inertiaRaf) cancelAnimationFrame(this.inertiaRaf);
    this.inertiaRaf = 0;
    this.suppressEnd = false;
  }
}
