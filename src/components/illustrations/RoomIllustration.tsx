import { useId } from 'react';
import { colors } from '../../theme/tokens';

export type RoomPalette = {
  wall: string;
  wallLight: string;
  sideWall: string;
  ceiling: string;
  floor: string;
  floorLight: string;
  sofa: string;
  sofaShade: string;
  cushion: string;
  wood: string;
  metal: string;
  rug: string;
  art: [string, string];
  plant: string;
  pot: string;
  doorway: string;
};

type RoomIllustrationProps = {
  variant: 'sketch' | 'render';
  palette: RoomPalette;
  /** Accessible description; pass '' to mark decorative. */
  title: string;
};

// One-point perspective. Vanishing point and room box in a 1600×1000 viewBox.
const VP = { x: 800, y: 420 };
const BACK = { x1: 420, y1: 200, x2: 1180, y2: 640 };
const corners: [number, number][] = [
  [0, 0],
  [1600, 0],
  [0, 1000],
  [1600, 1000],
];

/**
 * Authorial interior illustration (§6.3). The same geometry renders as an
 * architect's sketch ("before") or as a styled concept ("after"), so a
 * before/after comparison is pixel-aligned from the same viewpoint.
 */
export function RoomIllustration({ variant, palette: p, title }: RoomIllustrationProps) {
  const uid = useId().replace(/:/g, '');
  const sketch = variant === 'sketch';
  const ink = colors.ink;
  const stroke = sketch ? ink : 'none';
  const sw = sketch ? 1.6 : 0;
  // In the sketch, objects are filled with paper so they occlude what is behind them.
  const fill = (c: string) => (sketch ? colors.canvas : c);
  const shell = (c: string) => (sketch ? 'none' : c);
  const g = (name: string) => `url(#${name}-${uid})`;

  return (
    <svg
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor={p.wall} />
          <stop offset="0.75" stopColor={p.wallLight} />
          <stop offset="1" stopColor={p.wall} />
        </linearGradient>
        <linearGradient id={`floor-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.floor} />
          <stop offset="1" stopColor={p.floorLight} />
        </linearGradient>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE9C7" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFE9C7" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`shadow-${uid}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={ink} stopOpacity="0.28" />
          <stop offset="1" stopColor={ink} stopOpacity="0" />
        </radialGradient>
        <pattern id={`paper-${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke={ink} strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
      </defs>

      {/* ---------- Shell ---------- */}
      {sketch ? (
        <>
          <rect width="1600" height="1000" fill={colors.canvas} />
          <rect width="1600" height="1000" fill={g('paper')} />
          {/* Construction lines to the vanishing point */}
          <g stroke={colors.copper} strokeOpacity="0.55" strokeWidth="1" strokeDasharray="6 8">
            {corners.map(([x, y]) => (
              <line key={`${x}-${y}`} x1={x} y1={y} x2={VP.x} y2={VP.y} />
            ))}
            <line x1="0" y1={VP.y} x2="1600" y2={VP.y} />
          </g>
          <circle cx={VP.x} cy={VP.y} r="5" fill={colors.copper} />
          <text x={VP.x + 14} y={VP.y - 12} fill={colors.copper} fontSize="18" fontFamily="Inter, sans-serif" letterSpacing="2">
            VP
          </text>
        </>
      ) : null}

      <polygon points="0,0 1600,0 1180,200 420,200" fill={shell(p.ceiling)} stroke={stroke} strokeWidth={sw} />
      <polygon points="0,0 420,200 420,640 0,1000" fill={shell(p.sideWall)} stroke={stroke} strokeWidth={sw} />
      <polygon points="1600,0 1180,200 1180,640 1600,1000" fill={shell(p.sideWall)} stroke={stroke} strokeWidth={sw} />
      <rect x={BACK.x1} y={BACK.y1} width={BACK.x2 - BACK.x1} height={BACK.y2 - BACK.y1} fill={sketch ? 'none' : g('wall')} stroke={stroke} strokeWidth={sw} />
      <polygon points="0,1000 420,640 1180,640 1600,1000" fill={sketch ? 'none' : g('floor')} stroke={stroke} strokeWidth={sw} />

      {/* Floor boards converge to the VP */}
      <g stroke={sketch ? ink : p.floorLight} strokeOpacity={sketch ? 0.18 : 0.35} strokeWidth="1.2">
        {[520, 620, 720, 880, 980, 1080].map((x) => {
          const bx = VP.x + (x - VP.x) * (1000 - VP.y) / (640 - VP.y);
          return <line key={x} x1={x} y1="640" x2={bx} y2="1000" />;
        })}
      </g>

      {/* Skirting */}
      <line x1={BACK.x1} y1="628" x2={BACK.x2} y2="628" stroke={sketch ? ink : p.sideWall} strokeOpacity={sketch ? 0.5 : 1} strokeWidth={sketch ? 1 : 3} />

      {/* ---------- Doorway on the left wall ---------- */}
      <path
        d="M170 854 L170 395 Q240 300 320 382 L320 726 Z"
        fill={fill(p.doorway)}
        stroke={stroke}
        strokeWidth={sw}
      />

      {/* ---------- Window ---------- */}
      <rect x="740" y="250" width="300" height="320" fill={sketch ? 'none' : '#F8F6F0'} stroke={sketch ? ink : p.wood} strokeWidth={sketch ? sw : 8} />
      <g stroke={sketch ? ink : p.wood} strokeWidth={sketch ? 1.2 : 5}>
        <line x1="890" y1="250" x2="890" y2="570" />
        <line x1="740" y1="410" x2="1040" y2="410" />
      </g>
      {!sketch && (
        <>
          <polygon points="740,570 1040,570 1240,940 860,940" fill={g('beam')} opacity="0.7" />
          <polygon points="740,250 1040,250 1040,570 740,570" fill="#FFFFFF" opacity="0.35" />
        </>
      )}

      {/* ---------- Wall art ---------- */}
      <rect x="500" y="300" width="170" height="210" fill={fill(p.art[0])} stroke={sketch ? ink : '#F8F6F0'} strokeWidth={sketch ? sw : 10} />
      {!sketch && <circle cx="585" cy="380" r="46" fill={p.art[1]} />}
      {!sketch && <rect x="530" y="430" width="110" height="50" fill={p.art[1]} opacity="0.45" />}

      {/* ---------- Rug ---------- */}
      <polygon points="330,720 1110,720 1260,905 180,905" fill={fill(p.rug)} stroke={stroke} strokeWidth={sw} />
      {sketch && <polygon points="360,735 1085,735 1215,890 225,890" fill="none" stroke={ink} strokeOpacity="0.3" strokeDasharray="4 6" />}

      {/* ---------- Sofa ---------- */}
      {!sketch && <ellipse cx="690" cy="700" rx="290" ry="26" fill={g('shadow')} />}
      <rect x="470" y="500" width="440" height="110" rx="22" fill={fill(p.sofaShade)} stroke={stroke} strokeWidth={sw} />
      <rect x="450" y="590" width="480" height="92" rx="14" fill={fill(p.sofa)} stroke={stroke} strokeWidth={sw} />
      <rect x="430" y="555" width="62" height="135" rx="20" fill={fill(p.sofa)} stroke={stroke} strokeWidth={sw} />
      <rect x="888" y="555" width="62" height="135" rx="20" fill={fill(p.sofa)} stroke={stroke} strokeWidth={sw} />
      <rect x="520" y="540" width="120" height="78" rx="18" fill={fill(p.cushion)} stroke={stroke} strokeWidth={sw} transform="rotate(-6 580 579)" />
      <rect x="740" y="545" width="110" height="72" rx="18" fill={fill(p.sofaShade)} stroke={stroke} strokeWidth={sw} transform="rotate(5 795 581)" />
      <g stroke={sketch ? ink : p.wood} strokeWidth="6" strokeLinecap="round">
        <line x1="470" y1="684" x2="466" y2="700" />
        <line x1="910" y1="684" x2="914" y2="700" />
      </g>

      {/* ---------- Coffee table ---------- */}
      {!sketch && <ellipse cx="720" cy="862" rx="200" ry="24" fill={g('shadow')} />}
      <path d="M680 790 L760 790 L752 855 L688 855 Z" fill={fill(p.wood)} stroke={stroke} strokeWidth={sw} opacity={sketch ? 1 : 0.85} />
      <ellipse cx="720" cy="786" rx="175" ry="34" fill={fill(p.wood)} stroke={stroke} strokeWidth={sw} />
      <ellipse cx="720" cy="780" rx="175" ry="30" fill={fill(p.wallLight)} stroke={stroke} strokeWidth={sketch ? 0.8 : 0} opacity={sketch ? 0.6 : 0.25} />
      <rect x="650" y="752" width="70" height="14" rx="3" fill={fill(p.art[1])} stroke={stroke} strokeWidth={sketch ? 1 : 0} />
      <path d="M770 770 q 10 -40 20 0 Z" fill={fill(p.pot)} stroke={stroke} strokeWidth={sketch ? 1 : 0} />

      {/* ---------- Floor lamp ---------- */}
      {!sketch && <circle cx="1105" cy="345" r="120" fill={g('glow')} />}
      <ellipse cx="1130" cy="712" rx="36" ry="9" fill={fill(p.metal)} stroke={stroke} strokeWidth={sw} />
      <path d="M1130 712 L1130 380 Q1130 330 1100 330" fill="none" stroke={sketch ? ink : p.metal} strokeWidth={sketch ? sw : 5} />
      <path d="M1050 318 L1130 318 L1150 372 L1030 372 Z" fill={fill(p.cushion)} stroke={stroke} strokeWidth={sw} />

      {/* ---------- Plant ---------- */}
      {!sketch && <ellipse cx="1290" cy="872" rx="80" ry="14" fill={g('shadow')} />}
      <g fill={fill(p.plant)} stroke={stroke} strokeWidth={sketch ? 1.2 : 0}>
        <ellipse cx="1250" cy="690" rx="22" ry="70" transform="rotate(-28 1250 690)" />
        <ellipse cx="1300" cy="660" rx="24" ry="88" transform="rotate(6 1300 660)" />
        <ellipse cx="1340" cy="700" rx="20" ry="66" transform="rotate(34 1340 700)" />
        <ellipse cx="1275" cy="730" rx="18" ry="50" transform="rotate(-55 1275 730)" />
        <ellipse cx="1330" cy="745" rx="16" ry="44" transform="rotate(60 1330 745)" />
      </g>
      <path d="M1240 765 L1340 765 L1322 870 L1258 870 Z" fill={fill(p.pot)} stroke={stroke} strokeWidth={sw} />

      {/* ---------- Pendant ---------- */}
      <line x1="720" y1="40" x2="720" y2="250" stroke={sketch ? ink : p.metal} strokeWidth="2" />
      <path d="M655 300 Q720 214 785 300 Z" fill={fill(p.metal)} stroke={stroke} strokeWidth={sw} />
      {!sketch && <ellipse cx="720" cy="302" rx="40" ry="8" fill="#FFE9C7" opacity="0.9" />}

      {/* ---------- Sketch annotations ---------- */}
      {sketch && (
        <g fontFamily="Inter, sans-serif" fontSize="17" fill={ink} letterSpacing="1.5">
          <g stroke={ink} strokeWidth="1">
            <line x1="420" y1="672" x2="1180" y2="672" strokeOpacity="0" />
            <line x1="420" y1="160" x2="1180" y2="160" />
            <line x1="420" y1="150" x2="420" y2="170" />
            <line x1="1180" y1="150" x2="1180" y2="170" />
            <line x1="1215" y1="200" x2="1215" y2="640" />
            <line x1="1205" y1="200" x2="1225" y2="200" />
            <line x1="1205" y1="640" x2="1225" y2="640" />
          </g>
          <text x="800" y="148" textAnchor="middle">4.80 M</text>
          <text x="1235" y="426">2.75 M</text>
          <text x="740" y="236" fontSize="14" opacity="0.7">W1 · 1.90 × 2.00</text>
          <text x="186" y="900" fontSize="14" opacity="0.7">D1</text>
        </g>
      )}
    </svg>
  );
}
