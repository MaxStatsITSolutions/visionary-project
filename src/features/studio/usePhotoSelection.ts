import { useEffect, useRef, useState } from 'react';
import { allowedPhotoTypes, maxPhotoSize } from './constants';
import type { PhotoSelection } from './types';

export function usePhotoSelection() {
  const [photo, setPhoto] = useState<PhotoSelection | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  // Когато излезем от екрана, освобождаваме паметта на preview адреса.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function selectPhoto(file: File) {
    if (!allowedPhotoTypes.includes(file.type)) {
      setPhotoError('Allowed formats: JPEG, PNG or WebP.');
      return;
    }
    if (file.size > maxPhotoSize) {
      setPhotoError('This photo is too large. The maximum size is 10 MB.');
      return;
    }

    setPhotoError(null);
    setPhotoConfirmed(false); // нова снимка = ново потвърждение
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setPhoto({ file, previewUrl });
  }

  function removePhoto() {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
    setPhoto(null);
    setPhotoError(null);
    setPhotoConfirmed(false);
  }

  return {
    photo,
    photoError,
    photoConfirmed,
    setPhotoConfirmed,
    selectPhoto,
    removePhoto,
  };
}