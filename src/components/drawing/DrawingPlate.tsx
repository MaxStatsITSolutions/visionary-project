import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Box } from '@mui/material';
import { colors, fonts } from '../../theme/tokens';
import { beforeImage } from '../../content/styles';
import { ARCH, BACK_WALL, DIMENSIONS, NOTES, PENDANT, RADIATOR, ROOM_EDGES, SHEET, SILL, VP, WINDOW } from '../../content/room';
import { InteriorImage } from '../common/InteriorImage';
import { useFrame } from '../../motion/useFrame';
import { damp, reducedMotion } from '../../motion/engine';
import { ALL_LAYERS, type Layers, type Proposal } from './layers';


type DrawingPlateProps = {
  proposal: Proposal;
  /** Start the plotting sequence (lines → photo → notes → lens). */
  play: boolean;
  layers?: Layers;
  /** Lens = proposal seen through a moving circle; otherwise the full proposal. */
  lens?: boolean;
  sizes: string;
  priority?: boolean;
};

/** When each stage of the plot starts, in ms (mirrors the CSS delays below). */
const LENS_AT = 5200;

const d = (seconds: number, duration?: number) =>
  ({ '--d': `${seconds}s`, ...(duration ? { '--dur': `${duration}s` } : {}) }) as CSSProperties;

const stroke = { fill: 'none', stroke: colors.ink, strokeWidth: 1.25, vectorEffect: 'non-scaling-stroke' as const };

/**
 * Sheet A-101: the demo room as an architectural drawing.
 * The survey linework is plotted first, the photo develops underneath it,
 * renovation notes are added, and then a lens shows the proposal.
 * Everything shares one 1536×1024 coordinate system with the photos, and the
 * plate keeps their 3:2 ratio, so drawing and photo always line up.
 */
export function DrawingPlate({ proposal, play, layers = ALL_LAYERS, lens = true, sizes, priority = false }: DrawingPlateProps) {
  const plateRef = useRef<HTMLDivElement>(null);
  const proposalRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lensState = useRef({ x: 0, y: 0, tx: 0, ty: 0, r: 0, manual: false, last: 0, init: false, pressed: false });
  const [plotted, setPlotted] = useState(false);
  const reduced = reducedMotion();
  const lensReady = play && (plotted || reduced);

  useEffect(() => {
    if (!play || reduced) return;
    const t = window.setTimeout(() => setPlotted(true), LENS_AT);
    return () => window.clearTimeout(t);
  }, [play, reduced]);

  const lensRadius = (w: number) => Math.max(56, Math.min(200, w * 0.13));

  const paintLens = () => {
    const el = plateRef.current;
    const prop = proposalRef.current;
    const ring = ringRef.current;
    if (!el || !prop || !ring) return;
    const s = lensState.current;
    if (!lens) {
      prop.style.clipPath = 'none';
      ring.style.opacity = '0';
      return;
    }
    prop.style.clipPath = `circle(${s.r.toFixed(1)}px at ${s.x.toFixed(1)}px ${s.y.toFixed(1)}px)`;
    ring.style.width = ring.style.height = `${(s.r * 2).toFixed(1)}px`;
    ring.style.transform = `translate(${(s.x - s.r).toFixed(1)}px, ${(s.y - s.r).toFixed(1)}px)`;
    ring.style.opacity = s.r > 4 ? '1' : '0';
  };

  // Lens physics on the shared loop (not called at all with reduced motion).
  useFrame(({ dt, time }) => {
    const el = plateRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const s = lensState.current;
    if (!s.manual || time - s.last > 3500) {
      s.manual = false;
      const t = time / 1000;
      s.tx = w * (0.56 + 0.17 * Math.sin(t * 0.42));
      s.ty = h * (0.42 + 0.1 * Math.sin(t * 0.67 + 1));
    }
    if (!s.init) {
      s.x = s.tx;
      s.y = s.ty;
      s.init = true;
    }
    const target = lensReady && layers.proposal ? lensRadius(w) * (s.pressed ? 1.6 : 1) : 0;
    const k = damp(8, dt);
    s.x += (s.tx - s.x) * k;
    s.y += (s.ty - s.y) * k;
    s.r += (target - s.r) * damp(7, dt);
    paintLens();
  });

  // Reduced motion: a still lens, centred on the window, moved only by the user.
  useEffect(() => {
    if (!reduced) return;
    const el = plateRef.current;
    if (!el) return;
    const s = lensState.current;
    if (!s.init) {
      s.x = el.clientWidth * 0.52;
      s.y = el.clientHeight * 0.42;
      s.init = true;
    }
    s.r = lensReady && layers.proposal ? lensRadius(el.clientWidth) : 0;
    paintLens();
  });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const s = lensState.current;
    s.tx = e.clientX - rect.left;
    s.ty = e.clientY - rect.top;
    s.manual = true;
    s.last = performance.now();
    if (reduced) {
      s.x = s.tx;
      s.y = s.ty;
      paintLens();
    }
  };

  const layer = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: 'opacity 400ms' });

  return (
    <Box
      ref={plateRef}
      className={`vz-paper${play ? ' is-playing' : ''}`}
      onPointerMove={onMove}
      onPointerDown={(e) => {
        onMove(e);
        lensState.current.pressed = true;
      }}
      onPointerUp={() => (lensState.current.pressed = false)}
      onPointerLeave={() => {
        lensState.current.manual = false;
        lensState.current.pressed = false;
      }}
      data-cursor={lens ? 'Look' : undefined}
      sx={{
        position: 'relative',
        aspectRatio: '3 / 2',
        overflow: 'hidden',
        outline: `1px solid ${colors.ink}`,
        touchAction: 'pan-y',
        userSelect: 'none',
        isolation: 'isolate',
      }}
    >
      {/* Photo develops under the linework */}
      <Box sx={{ position: 'absolute', inset: 0 }} style={layer(layers.photo)}>
        <Box className="vz-photo" sx={{ position: 'absolute', inset: 0 }}>
          <InteriorImage name={beforeImage} sizes={sizes} priority={priority} alt="Survey photo of the empty living room" />
        </Box>
      </Box>

      {/* Proposal (through the lens) */}
      <Box ref={proposalRef} sx={{ position: 'absolute', inset: 0, clipPath: 'circle(0 at 50% 50%)' }}>
        <InteriorImage key={proposal.image} name={proposal.image} sizes={sizes} alt={`Proposal revision ${proposal.rev}: ${proposal.name}`} />
      </Box>

      <svg
        viewBox={`0 0 ${SHEET.w} ${SHEET.h}`}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* Construction: horizon, vanishing point, perspective rays */}
        <g style={layer(layers.construction)}>
          <g className="vz-soften-construction" stroke={colors.copper} strokeWidth={1} fill="none" style={{ vectorEffect: 'non-scaling-stroke' } as CSSProperties}>
            <path className="vz-draw" pathLength={1} d={`M0 ${VP.y} H${SHEET.w}`} style={d(0.1, 1.4)} vectorEffect="non-scaling-stroke" />
            {ROOM_EDGES.map((e, i) => (
              <path
                key={i}
                className="vz-draw"
                pathLength={1}
                d={`M${VP.x} ${VP.y} L${e.to[0]} ${e.to[1]}`}
                style={d(0.35 + i * 0.12, 1.1)}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <circle className="vz-dot" cx={VP.x} cy={VP.y} r={7} fill={colors.copper} stroke="none" style={d(0.25)} />
            <text className="vz-pop" x={VP.x + 16} y={VP.y - 14} fill={colors.copper} stroke="none" fontSize={20} fontFamily={fonts.mono} letterSpacing={2} style={d(0.4)}>
              VP
            </text>
          </g>
        </g>

        {/* Survey linework */}
        <g style={layer(layers.linework)}>
          <g className="vz-soften-lines">
            <path
              {...stroke}
              className="vz-draw"
              pathLength={1}
              d={`M${BACK_WALL.x0} ${BACK_WALL.y0} H${BACK_WALL.x1} V${BACK_WALL.y1} H${BACK_WALL.x0} Z`}
              style={d(1.0, 1.3)}
            />
            {ROOM_EDGES.map((e, i) => (
              <path key={i} {...stroke} className="vz-draw" pathLength={1} d={`M${e.from[0]} ${e.from[1]} L${e.to[0]} ${e.to[1]}`} style={d(1.25 + i * 0.1, 0.9)} />
            ))}
            <path {...stroke} className="vz-draw" pathLength={1} d={`M${BACK_WALL.x0} ${BACK_WALL.y1 - 12} H${BACK_WALL.x1}`} style={d(1.8, 0.8)} />
            {/* Window W1 */}
            <path {...stroke} className="vz-draw" pathLength={1} d={`M${WINDOW.x0} ${WINDOW.y0} H${WINDOW.x1} V${WINDOW.y1} H${WINDOW.x0} Z`} style={d(1.7, 1)} />
            <path
              {...stroke}
              className="vz-draw"
              pathLength={1}
              d={`M${WINDOW.mullions[0]} ${WINDOW.y0} V${WINDOW.y1} M${WINDOW.mullions[1]} ${WINDOW.y0} V${WINDOW.y1} M${WINDOW.x0} ${WINDOW.transom} H${WINDOW.mullions[0]} M${WINDOW.mullions[1]} ${WINDOW.transom} H${WINDOW.x1}`}
              style={d(2.1, 0.9)}
            />
            <path {...stroke} className="vz-draw" pathLength={1} d={`M${SILL.x0} ${SILL.y0} H${SILL.x1} V${SILL.y1} H${SILL.x0} Z`} style={d(2.4, 0.6)} />
            {/* Arch D1 */}
            <path
              {...stroke}
              className="vz-draw"
              pathLength={1}
              d={`M${ARCH.x0} ${ARCH.footLeft} V${ARCH.spring} A${(ARCH.x1 - ARCH.x0) / 2} ${ARCH.spring - ARCH.apex} 0 0 1 ${ARCH.x1} ${ARCH.spring} V${ARCH.footRight}`}
              style={d(1.9, 1.2)}
            />
            {/* Radiator R1 with fins */}
            <path {...stroke} className="vz-draw" pathLength={1} d={`M${RADIATOR.x0} ${RADIATOR.y0} H${RADIATOR.x1} V${RADIATOR.y1} H${RADIATOR.x0} Z`} style={d(2.5, 0.7)} />
            <path
              {...stroke}
              strokeWidth={0.75}
              className="vz-draw"
              pathLength={1}
              d={Array.from({ length: 20 }, (_, i) => `M${RADIATOR.x0 + 16 + i * 18} ${RADIATOR.y0 + 8} V${RADIATOR.y1 - 8}`).join(' ')}
              style={d(2.8, 0.9)}
            />
            {/* Pendant */}
            <path {...stroke} className="vz-draw" pathLength={1} d={`M${PENDANT.x} ${PENDANT.top} V${PENDANT.bulbY - PENDANT.r}`} style={d(2.3, 0.5)} />
            <circle {...stroke} className="vz-draw" pathLength={1} cx={PENDANT.x} cy={PENDANT.bulbY} r={PENDANT.r} style={d(2.6, 0.5)} />
          </g>

          {/* Dimensions */}
          <g fontFamily={fonts.mono} fontSize={20} letterSpacing={2}>
            {DIMENSIONS.map((dim, i) => {
              const delay = 2.6 + i * 0.2;
              const mid = dim.labelAt;
              if (dim.axis === 'x') {
                return (
                  <g key={dim.id}>
                    <path
                      {...stroke}
                      className="vz-draw"
                      pathLength={1}
                      d={`M${dim.from} ${dim.at} H${dim.to} M${dim.from - 8} ${dim.at + 8} L${dim.from + 8} ${dim.at - 8} M${dim.to - 8} ${dim.at + 8} L${dim.to + 8} ${dim.at - 8}`}
                      style={d(delay, 0.8)}
                    />
                    <text className="vz-pop vz-label" x={mid} y={dim.at - 10} textAnchor="middle" style={d(delay + 0.5)}>
                      {dim.label}
                    </text>
                  </g>
                );
              }
              return (
                <g key={dim.id}>
                  <path
                    {...stroke}
                    className="vz-draw"
                    pathLength={1}
                    d={`M${dim.at} ${dim.from} V${dim.to} M${dim.at - 8} ${dim.from + 8} L${dim.at + 8} ${dim.from - 8} M${dim.at - 8} ${dim.to + 8} L${dim.at + 8} ${dim.to - 8}`}
                    style={d(delay, 0.8)}
                  />
                  <text
                    className="vz-pop vz-label"
                    x={dim.at + 14}
                    y={mid}
                    transform={`rotate(-90 ${dim.at + 14} ${mid})`}
                    textAnchor="middle"
                    dominantBaseline="hanging"
                    style={d(delay + 0.5)}
                  >
                    {dim.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>

        {/* Renovation notes */}
        <g style={layer(layers.notes)} fontFamily={fonts.mono} fontSize={22} letterSpacing={1.5}>
          {NOTES.map((n, i) => {
            const delay = 4.2 + i * 0.18;
            return (
              <g key={n.id}>
                <path {...stroke} strokeWidth={1.5} className="vz-draw" pathLength={1} d={n.path} style={d(delay, 0.8)} />
                <circle className="vz-dot" cx={n.dot[0]} cy={n.dot[1]} r={10} fill={colors.copper} stroke={colors.canvas} strokeWidth={3} style={d(delay)} />
                <text className="vz-pop vz-label" x={n.label[0]} y={n.label[1]} style={d(delay + 0.4)}>
                  {n.text}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Lens ring */}
      <Box
        ref={ringRef}
        aria-hidden
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          opacity: 0,
          borderRadius: '50%',
          border: `1px solid ${colors.canvas}`,
          boxShadow: `0 0 0 1px ${colors.ink}, 0 24px 60px rgba(25,27,26,0.35)`,
          pointerEvents: 'none',
          transition: 'opacity 300ms',
          '&::before, &::after': { content: '""', position: 'absolute', left: '50%', top: '50%', bgcolor: colors.canvas },
          '&::before': { width: 13, height: '1px', transform: 'translate(-50%, -50%)' },
          '&::after': { width: '1px', height: 13, transform: 'translate(-50%, -50%)' },
        }}
      >
        <Box
          component="span"
          sx={{
            position: 'absolute',
            left: '50%',
            top: '100%',
            transform: 'translate(-50%, 10px)',
            whiteSpace: 'nowrap',
            px: 1,
            py: 0.5,
            bgcolor: colors.ink,
            color: colors.canvas,
            fontFamily: fonts.mono,
            fontSize: '0.66rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Rev {proposal.rev} · {proposal.name}
        </Box>
      </Box>
    </Box>
  );
}
