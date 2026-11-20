/**
 * One shared animation loop for every scroll/pointer effect on the site.
 *
 * - Native scrolling is never hijacked (§7): we only *read* scrollY.
 * - Pointer and scroll velocity are smoothed here once, so every effect
 *   feels like part of the same physical system.
 * - The loop only runs while something is subscribed and the tab is visible.
 * - With prefers-reduced-motion, subscribers are not called at all.
 */

export type FrameState = {
  /** Current scroll position (px). */
  scrollY: number;
  /** Smoothed scroll velocity in px/frame (signed). */
  velocity: number;
  /** Pointer position normalised to -1..1 from the viewport centre, smoothed. */
  pointer: { x: number; y: number };
  /** Raw pointer position in px (for followers). */
  pointerPx: { x: number; y: number };
  viewport: { w: number; h: number };
  /** Milliseconds since the previous frame (clamped). */
  dt: number;
  time: number;
};

type Subscriber = (state: FrameState) => void;

const subscribers = new Set<Subscriber>();
let rafId = 0;
let lastTime = 0;
let lastScroll = 0;
let pointerTarget = { x: 0, y: 0 };
let listening = false;

const state: FrameState = {
  scrollY: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  pointerPx: { x: -100, y: -100 },
  viewport: { w: 0, h: 0 },
  dt: 16,
  time: 0,
};

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Frame-rate independent exponential smoothing factor. */
export const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * (dt / 1000));

function onPointer(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return;
  state.pointerPx.x = e.clientX;
  state.pointerPx.y = e.clientY;
  pointerTarget = {
    x: (e.clientX / window.innerWidth) * 2 - 1,
    y: (e.clientY / window.innerHeight) * 2 - 1,
  };
}

function tick(now: number) {
  rafId = 0;
  const dt = Math.min(64, lastTime ? now - lastTime : 16);
  lastTime = now;
  const y = window.scrollY;
  const rawVelocity = (y - lastScroll) * (16 / dt);
  lastScroll = y;

  state.dt = dt;
  state.time = now;
  state.scrollY = y;
  state.velocity += (rawVelocity - state.velocity) * damp(10, dt);
  const k = damp(6, dt);
  state.pointer.x += (pointerTarget.x - state.pointer.x) * k;
  state.pointer.y += (pointerTarget.y - state.pointer.y) * k;
  state.viewport.w = window.innerWidth;
  state.viewport.h = window.innerHeight;

  subscribers.forEach((fn) => fn(state));
  if (subscribers.size && !document.hidden) rafId = requestAnimationFrame(tick);
}

function start() {
  if (!rafId && subscribers.size && !document.hidden) {
    lastTime = 0;
    lastScroll = window.scrollY;
    rafId = requestAnimationFrame(tick);
  }
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', start);
}

/** Run `fn` on every animation frame. Returns an unsubscribe function. */
export function subscribe(fn: Subscriber) {
  if (reducedMotion()) return () => {};
  listen();
  subscribers.add(fn);
  start();
  return () => {
    subscribers.delete(fn);
  };
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
