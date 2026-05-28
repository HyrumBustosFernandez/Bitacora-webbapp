'use client';

import Link from 'next/link';
import {
  getTrackInfo, getCourseProgress, type AppState,
} from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

const CARD: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '12px 14px',
};

export default function OverallProgressCard({ state }: Props) {
  const track       = getTrackInfo(null, state);
  const expectedPct = track.expectedPct;
  const actualPct   = track.actualPct;

  const sorted = [...COURSES]
    .map(c => {
      const pct    = getCourseProgress(c, state);
      const ct     = getTrackInfo(c, state);
      const behind = ct.status === 'behind';
      const dl     = Math.ceil((new Date(c.deadlineDate).getTime() - Date.now()) / 86_400_000);
      return { c, pct, behind, dl };
    })
    .sort((a, b) => {
      if (a.behind !== b.behind) return a.behind ? -1 : 1;
      return a.dl - b.dl;
    })
    .slice(0, 4);

  return (
    <div style={CARD}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
        <span style={{
          fontSize: 9, fontWeight: 600, color: 'var(--text-3)',
          textTransform: 'uppercase', letterSpacing: '0.6px',
        }}>
          Overall progress
        </span>
        <Link href="/analytics" style={{ fontSize: 10, color: 'var(--accent)', textDecoration: 'none' }}>
          View details →
        </Link>
      </div>

      {/* Dual bar */}
      <div style={{
        position: 'relative', height: 5, borderRadius: 3,
        background: 'var(--border-subtle)', overflow: 'hidden', marginBottom: 6,
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: `${Math.min(expectedPct, 100)}%`,
          background: 'var(--border-default)', borderRadius: 3,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '100%',
          width: `${Math.min(actualPct, 100)}%`,
          background: 'var(--accent)', borderRadius: 3,
        }} />
      </div>
      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 9, color: 'var(--text-3)' }}>● Expected {expectedPct}%</span>
        <span style={{ fontSize: 9, color: 'var(--accent)' }}>● Actual {actualPct}%</span>
      </div>

      {/* Per-course rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(({ c, pct, behind }) => (
          <div key={c.id} className="flex items-center gap-2">
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: c.accent, flexShrink: 0,
            }} />
            <span style={{
              fontSize: 11, color: 'var(--text-3)', flex: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {c.title}
            </span>
            {/* Bar */}
            <div style={{
              width: 80, height: 3, borderRadius: 2,
              background: 'var(--border-subtle)', flexShrink: 0,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${pct}%`,
                background: behind ? 'rgba(239,68,68,0.6)' : c.accent,
                borderRadius: 2,
              }} />
            </div>
            <span style={{ fontSize: 10, color: 'var(--text-3)', flexShrink: 0, width: 30, textAlign: 'right' }}>
              {pct}%
            </span>
            <StatusBadge behind={behind} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ behind }: { behind: boolean }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 500,
      padding: '2px 6px', borderRadius: 4, flexShrink: 0,
      background: behind ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
      border: `1px solid ${behind ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
      color: behind ? 'rgba(252,165,165,0.8)' : 'rgba(110,231,183,0.8)',
    }}>
      {behind ? 'behind' : 'track'}
    </span>
  );
}
