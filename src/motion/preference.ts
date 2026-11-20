/**
 * Motion preference. By default the site follows the operating system
 * (prefers-reduced-motion, §15). Visitors can override it with the Motion
 * toggle; the choice is remembered in this browser only.
 *
 * Note: many laptops ship with "Animation effects" off (Windows) or
 * "Reduce motion" on (macOS), which is why the override exists.
 */
export type MotionPref = 'system' | 'on' | 'off';

const KEY = 'vz-motion';
const QUERY = '(prefers-reduced-motion: reduce)';
export const MOTION_EVENT = 'vz-motion-change';

const hasWindow = typeof window !== 'undefined';

export const systemPrefersReduced = () => hasWindow && window.matchMedia(QUERY).matches;

function readPref(): MotionPref {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'on' || v === 'off' ? v : 'system';
  } catch {
    return 'system';
  }
}

let pref: MotionPref = hasWindow ? readPref() : 'system';
let reduced = compute();

function compute() {
  if (pref === 'on') return false;
  if (pref === 'off') return true;
  return systemPrefersReduced();
}

function apply() {
  reduced = compute();
  if (hasWindow) document.documentElement.classList.toggle('vz-reduced', reduced);
}

export const getMotionPref = () => pref;
export const isMotionReduced = () => reduced;

export function setMotionPref(next: MotionPref) {
  pref = next;
  try {
    if (next === 'system') window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, next);
  } catch {
    /* storage unavailable: the choice lasts for this page view */
  }
  apply();
  window.dispatchEvent(new Event(MOTION_EVENT));
}

if (hasWindow) {
  apply();
  window.matchMedia(QUERY).addEventListener('change', () => {
    if (pref !== 'system') return;
    apply();
    window.dispatchEvent(new Event(MOTION_EVENT));
  });
}
