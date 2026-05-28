'use client';

import Link from 'next/link';
import {
  getGlobalItems, getDayRatio, getDaysLeft, getTrackInfo,
  getCourseProgress, type AppState, type TrackStatus,
} from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

const CARD: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '12px 14px',
};

const STAT_CARD: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 10,
  padding: '9px 11px',
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function StatsProgressCard({ state }: Props) {
  const { total, done }  = getGlobalItems(state);
  const daysLeft         = getDaysLeft();
  const ratio            = getDayRatio();
  const track            = getTrackInfo(null, state);
  const expectedPct      = track.expectedPct;
  const actualPct        = track.actualPct;
  const todayTarget      = total > 0 && daysLeft > 0
    ? Math.ceil((total - done) / daysLeft)
    : 0;

  const sortedCourses = [...COURSES]
    .map(c => {
      const pct    = getCourseProgress(c, state);
      const ct     = getTrackInfo(c, state);
      const behind = ct.status === 'behind';
      return { c, pct, behind, daysLeft: Math.ceil((new Date(c.deadlineDate).getTime() - Date.now()) / 86_400_000) };
    })
    .sort((a, b) => {
      if (a.behind !== b.behind) return a.behind ? -1 : 1;
      return a.daysLeft - b.daysLeft;
    })
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Stats 2×2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <StatCard label="Courses" value={String(COURSES.length)} />
        <StatCard label="Items done" value={`${done}`} sub={`of ${total}`} />
        <StatCard
          label="Days left"
          value={String(daysLeft)}
          valueColor={daysLeft < 30 ? '#F59E0B' : undefined}
        />
        <StatCard
          label="Today's target"
          value={String(todayTarget)}
          sub="items/day"
          valueColor="var(--accent)"
        />
      </div>

      {/* Overall progress card */}
      <div style={CARD}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: '#484848', fontWeight: 500 }}>
            Overall progress
          </span>
          <Link href="/analytics" style={{
            fontSize: 10, color: 'var(--accent)', textDecoration: 'none',
          }}>
            View all →
          </Link>
        </div>

        {/* Expected vs Actual bar */}
        <div style={{ position: 'relative', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(expectedPct, 100)}%`,
            background: 'rgba(255,255,255,0.10)',
            borderRadius: 3,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(actualPct, 100)}%`,
            background: 'var(--accent)',
            borderRadius: 3,
          }} />
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: 5, marginBottom: 10 }}>
          <span style={{ fontSize: 9, color: '#333' }}>Expected {expectedPct}%</span>
          <span style={{ fontSize: 9, color: 'var(--accent)' }}>Actual {actualPct}%</span>
        </div>

        {/* Per-course rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sortedCourses.map(({ c, pct, behind }) => (
            <div key={c.id} className="flex items-center gap-2">
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: c.accent, flexShrink: 0,
              }} />
              <span style={{
                fontSize: 10, color: '#484848',
                flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {c.title}
              </span>
              {/* Mini bar */}
              <div style={{
                width: 50, height: 3, borderRadius: 2,
                background: 'rgba(255,255,255,0.05)', flexShrink: 0,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${pct}%`,
                  background: behind ? '#EF4444' : c.accent,
                  borderRadius: 2,
                }} />
              </div>
              <span style={{ fontSize: 9, color: '#484848', flexShrink: 0, width: 28, textAlign: 'right' }}>
                {pct}%
              </span>
              <TrackBadge status={behind ? 'behind' : 'on-track'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, valueColor,
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
}) {
  return (
    <div style={STAT_CARD}>
      <div style={{ fontSize: 9, color: '#3E3E3E', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: valueColor ?? 'var(--text-1)', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 9, color: '#2E2E2E' }}>{sub}</div>}
    </div>
  );
}

function TrackBadge({ status }: { status: TrackStatus }) {
  const behind = status === 'behind';
  return (
    <span style={{
      fontSize: 9, fontWeight: 500,
      padding: '1px 5px', borderRadius: 5, flexShrink: 0,
      background: behind ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
      border: `1px solid ${behind ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
      color: behind ? 'rgba(252,165,165,0.7)' : 'rgba(110,231,183,0.7)',
    }}>
      {behind ? 'Behind' : 'On track'}
    </span>
  );
}
