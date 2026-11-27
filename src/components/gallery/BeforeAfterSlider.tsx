import { useEffect, useRef, useState } from 'react';
import { Box, Chip, Slider, Typography } from '@mui/material';

export interface BeforeAfterSliderProps {
  title: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
}

export function BeforeAfterSlider({
  title,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [beforeImg, setBeforeImg] = useState(beforeSrc);
  const [afterImg, setAfterImg] = useState(afterSrc);
  const [beforeFailed, setBeforeFailed] = useState(false);
  const [afterFailed, setAfterFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBeforeImg(beforeSrc);
    setAfterImg(afterSrc);
    setBeforeFailed(false);
    setAfterFailed(false);
  }, [beforeSrc, afterSrc]);

  const updateFromPointer = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  };

  return (
    <Box
      ref={containerRef}
      onPointerDown={(e) => updateFromPointer(e.clientX)}
      onPointerMove={(e) => {
        if (e.buttons === 1) updateFromPointer(e.clientX);
      }}
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 10',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#D9D4C8',
        cursor: 'ew-resize',
        userSelect: 'none',
      }}
    >
      {afterFailed ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: '#B87957',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Demo preview · {title}
          </Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={afterImg}
          alt={afterAlt}
          onError={() => setAfterFailed(true)}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 ${100 - position}% 0 0)`,
        }}
      >
        {beforeFailed ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: '#D9D4C8',
              color: '#191B1A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Before · {title}
            </Typography>
          </Box>
        ) : (
          <Box
            component="img"
            src={beforeImg}
            alt={beforeAlt}
            onError={() => setBeforeFailed(true)}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>

      <Chip
        label="Before"
        size="small"
        sx={{ position: 'absolute', top: 12, left: 12, bgcolor: '#191B1A', color: '#F4F1EA' }}
      />
      <Chip
        label="After · Demo preview"
        size="small"
        sx={{ position: 'absolute', top: 12, right: 12, bgcolor: '#B87957', color: '#FFFFFF' }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${position}%`,
          width: 2,
          bgcolor: '#FFFFFF',
          pointerEvents: 'none',
        }}
      />

      <Slider
        aria-label={`Compare before and after for ${title}`}
        value={position}
        min={0}
        max={100}
        onChange={(_, val) => {
          if (typeof val === 'number') setPosition(val);
        }}
        sx={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 8,
          width: 'auto',
          color: '#FFFFFF',
          '& .MuiSlider-thumb': {
            width: 44,
            height: 44,
            bgcolor: '#FFFFFF',
            border: '2px solid #191B1A',
          },
        }}
      />
    </Box>
  );
}
