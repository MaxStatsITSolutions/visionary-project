import { useEffect, useState } from 'react';
import { getPhotoUrl } from './projectsService';

type PhotoState = { status: 'none' | 'loading' | 'ready' | 'failed'; url: string | null };

/** Resolves a private Storage path to a short-lived signed URL (spec §12.4). */
export function useSignedPhoto(path: string | null) {
  const [state, setState] = useState<PhotoState>(() => ({ status: path ? 'loading' : 'none', url: null }));
  const [prevPath, setPrevPath] = useState(path);

  // Reset when the path changes (derived during render, no extra effect pass).
  if (prevPath !== path) {
    setPrevPath(path);
    setState({ status: path ? 'loading' : 'none', url: null });
  }

  useEffect(() => {
    if (!path) return;
    let cancelled = false;
    getPhotoUrl(path)
      .then((url) => {
        if (!cancelled) setState(url ? { status: 'ready', url } : { status: 'failed', url: null });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'failed', url: null });
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}
