'use client';

import { getGlobalItems, getDaysLeft, getTrackInfo, type AppState } from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

export default function StatsRow({ state }: Props) {
  const { total, done } = getGlobalItems(state);
  const daysLeft        = getDaysLeft();
  const todayTarget     = total > 0 && daysLeft > 0
    ? Math.ceil((total - done) / daysLeft)
    : 0;

  const donePct    = total > 0 ? Math.round((done / total) * 100) : 0;
  const daysPct    = Math.max(0, Math.min(100, Math.round(((90 - daysLeft) / 90) * 100)));
  const todayPct   = Math.min(100, todayTarget * 10); // visual approximation

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
      <StatCard
        label="Courses"
        value={String(COURSES.length)}
        sub="active this term"
        barPct={100}
      />
      <StatCard
        label="Items done"
        value={String(done)}
        sub={`of ${total} total`}
        barPct={donePct}
      />
      <StatCard
        label="Days left"
        value={String(daysLeft)}
        sub="until Jun 10"
        valueColor="var(--color-amber)"
        barColor="var(--color-amber)"
        barPct={100 - daysPct}
      />
      <StatCard
        label="Today"
        value={String(todayTarget)}
        sub="items to complete"
        barPct={todayPct}
      />
    </div>
  );
}

function StatCard({
  label, value, sub, valueColor, barColor, barPct,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
  barColor?: string;
  barPct?: number;
}) {
  return (
    <div
      className="card"
      style={{
        padding: '16px 18px 0',
        overflow: 'hidden',
        cursor: 'default',
        borderRadius: 14,
      }}
    >
      <div style={{
        fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.07em',
        color: 'var(--text-3)', marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 30, fontWeight: 700,
        color: valueColor ?? 'var(--text-1)',
        lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.025em',
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4, marginBottom: 14 }}>
          {sub}
        </div>
      )}
      {/* Bottom progress strip */}
      <div style={{
        height: 3,
        background: 'var(--bg-elevated)',
        margin: '0 -18px',
      }}>
        <div style={{
          height: '100%',
          width: `${barPct ?? 0}%`,
          background: barColor ?? 'var(--accent)',
          opacity: 0.45,
          borderRadius: '0 2px 2px 0',
          transition: 'width 600ms ease',
        }} />
      </div>
    </div>
  );
}
