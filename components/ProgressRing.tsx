'use client';

import { useEffect, useRef } from 'react';

interface ProgressRingProps {
  pct: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  pct,
  size = 72,
  strokeWidth = 5,
  color = 'var(--accent)',
  bgColor = 'var(--bg-elevated)',
  label,
  sublabel,
}: ProgressRingProps) {
  const circleRef = useRef<SVGCircleElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, pct));
  const offset = circumference - (clampedPct / 100) * circumference;

  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;

    // Start from no progress, then animate to target
    circle.style.strokeDashoffset = String(circumference);
    circle.style.transition = 'none';

    // Force a reflow so the initial state is applied before the transition starts
    void circle.getBoundingClientRect();

    circle.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    circle.style.strokeDashoffset = String(offset);
  }, [circumference, offset]);

  const centerLabel = label ?? `${clampedPct}%`;
  const fontSize = size * 0.22;
  const sublabelFontSize = size * 0.14;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Progress: ${clampedPct}%`}
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* Background track */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
      />

      {/* Progress arc */}
      <circle
        ref={circleRef}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ willChange: 'stroke-dashoffset' }}
      />

      {/* Center label */}
      <text
        x={cx}
        y={sublabel ? cy - sublabelFontSize * 0.6 : cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="700"
        fill="currentColor"
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {centerLabel}
      </text>

      {/* Sublabel */}
      {sublabel && (
        <text
          x={cx}
          y={cy + fontSize * 0.6 + sublabelFontSize * 0.4}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={sublabelFontSize}
          fontWeight="400"
          fill="currentColor"
          opacity={0.6}
        >
          {sublabel}
        </text>
      )}
    </svg>
  );
}
