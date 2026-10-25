import { useEffect, useState } from 'react';

const R = 95;
const LEN = Math.PI * R;

/** Smoothly eases a number from 0 to target once on mount or when probability changes. */
function useCountUp(target: number, ms = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min((now - t0) / ms, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(target * eased);
      if (elapsed < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);

  return value;
}

interface GaugeProps {
  probability: number;
  pass: boolean;
}

export default function Gauge({ probability, pass }: GaugeProps) {
  const [filled, setFilled] = useState(false);
  const clampedProb = Math.max(0, Math.min(1, probability));
  const displayPercentage = useCountUp(clampedProb * 100);

  useEffect(() => {
    let active = true;
    const raf = requestAnimationFrame(() => {
      if (active) {
        setFilled(true);
      }
    });
    return () => {
      active = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  // SVG parameters: center at (120, 125), radius 95
  // Left point: (25, 125), Right point: (215, 125), Top apex: (120, 30)
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <svg
        viewBox="0 0 240 145"
        className="w-full overflow-visible"
        role="img"
        aria-label={`Pass probability ${(clampedProb * 100).toFixed(1)} percent`}
      >
        {/* Track arc */}
        <path
          d="M 25 125 A 95 95 0 0 1 215 125"
          fill="none"
          stroke="#e6dfd0"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Progress arc */}
        <path
          d="M 25 125 A 95 95 0 0 1 215 125"
          fill="none"
          stroke={pass ? '#6b6b3a' : '#9a5b48'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={LEN}
          strokeDashoffset={filled ? LEN * (1 - clampedProb) : LEN}
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        {/* Pass mark needle/indicator at 50% threshold (apex at x=120) */}
        <line
          x1="120"
          y1="16"
          x2="120"
          y2="34"
          stroke="#2b2a27"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <text
          x="120"
          y="11"
          textAnchor="middle"
          fontSize="9"
          fontWeight="600"
          fill="#8c887d"
          fontFamily='"Hanken Grotesk", system-ui, sans-serif'
        >
          50% Pass Mark
        </text>
      </svg>

      {/* Center value readout */}
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center pointer-events-none select-none">
        <div className="flex items-baseline">
          <span className="font-serif text-5xl sm:text-6xl font-normal tracking-tight text-charcoal">
            {displayPercentage.toFixed(1)}
          </span>
          <span className="ml-1 font-serif text-2xl text-charcoal-mute">%</span>
        </div>
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-charcoal-mute">
          Calculated Likelihood
        </span>
      </div>
    </div>
  );
}
