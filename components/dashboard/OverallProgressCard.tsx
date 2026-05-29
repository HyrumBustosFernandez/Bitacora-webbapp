'use client';

import Link from 'next/link';
import { IconChartBar } from '@tabler/icons-react';
import { getTrackInfo, getCourseProgress, type AppState } from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

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
    <div className="card" style={{ padding: '20px 22px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'var(--accent-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <IconChartBar size={14} color="var(--accent)" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            Overall Progress
          </span>
        </div>
        <Link href="/analytics" style={{
          fontSize: 11, fontWeight: 500, color: 'var(--accent)',
          textDecoration: 'none', opacity: 0.8,
          transition: 'opacity 130ms',
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.8')}
        >
          View all →
        </Link>
      </div>

      {/* Global dual bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>Overall completion</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--border-default)', verticalAlign: 'middle', marginRight: 4 }} />
              Expected {expectedPct}%
            </span>
            <span style={{ fontSize: 10, color: 'var(--accent)' }}>
              <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', verticalAlign: 'middle', marginRight: 4 }} />
              Actual {actualPct}%
            </span>
          </div>
        </div>
        <div style={{
          position: 'relative', height: 5, borderRadius: 4,
          background: 'var(--bg-elevated)', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(expectedPct, 100)}%`,
            background: 'var(--border-default)', borderRadius: 4,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(actualPct, 100)}%`,
            background: 'var(--accent)', borderRadius: 4,
          }} />
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)', marginBottom: 16 }} />

      {/* Per-course rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sorted.map(({ c, pct, behind }) => (
          <div key={c.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: c.accent, flexShrink: 0, display: 'inline-block',
                }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>
                  {c.title}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)', fontVariantNumeric: 'tabular-nums' }}>
                  {pct}%
                </span>
                <StatusBadge behind={behind} />
              </div>
            </div>
            <div style={{
              height: 5, borderRadius: 10, background: 'var(--bg-elevated)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: behind ? 'var(--color-red)' : 'var(--accent)',
                borderRadius: 10,
                opacity: behind ? 0.6 : 1,
                transition: 'width 600ms cubic-bezier(.25,.46,.45,.94)',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ behind }: { behind: boolean }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 600,
      padding: '2px 7px', borderRadius: 4, flexShrink: 0,
      background: behind ? 'var(--color-red-subtle)' : 'var(--color-green-subtle)',
      border: `1px solid ${behind ? 'var(--color-red-border)' : 'var(--color-green-border)'}`,
      color: behind ? 'var(--color-red)' : 'var(--color-green)',
      textTransform: 'uppercase', letterSpacing: '0.03em',
    }}>
      {behind ? 'behind' : 'on track'}
    </span>
  );
}
