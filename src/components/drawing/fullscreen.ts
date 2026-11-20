/** Ask the browser for real full screen; harmless if the frame refuses. Call from a click. */
export function enterBrowserFullscreen() {
  try {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => undefined);
  } catch {
    /* not allowed here: the dialog still fills the window */
  }
}

export function exitBrowserFullscreen() {
  try {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  } catch {
    /* ignore */
  }
}
