import { useEffect, type RefObject } from 'react';

/**
 * Shrinks an element's font-size just enough for its longest line to fit on
 * one line at the final (condensed) width. Lines never wrap or clip, at any
 * screen size; on wide screens the theme size is kept.
 */
export function useFitText(ref: RefObject<HTMLElement | null>, lines: string[], wdth = 62) {
  const key = lines.join('\u0000');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const texts = key.split('\u0000');
    let lastWidth = -1;

    const fit = () => {
      const avail = el.clientWidth;
      if (avail <= 0 || avail === lastWidth) return;
      lastWidth = avail;
      el.style.fontSize = '';
      const cs = getComputedStyle(el);
      const base = parseFloat(cs.fontSize);
      const probe = document.createElement('span');
      Object.assign(probe.style, {
        position: 'absolute',
        left: '-99999px',
        top: '0',
        visibility: 'hidden',
        whiteSpace: 'nowrap',
        fontFamily: cs.fontFamily,
        fontWeight: cs.fontWeight,
        fontSize: `${base}px`,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        fontVariationSettings: `"wdth" ${wdth}`,
      });
      document.body.appendChild(probe);
      let widest = 0;
      for (const t of texts) {
        probe.textContent = t;
        widest = Math.max(widest, probe.getBoundingClientRect().width);
      }
      probe.remove();
      if (widest > avail) el.style.fontSize = `${((base * avail) / widest) * 0.97}px`;
    };

    fit();
    document.fonts?.ready.then(() => {
      lastWidth = -1;
      fit();
    });
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, key, wdth]);
}
