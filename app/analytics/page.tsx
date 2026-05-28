'use client';

import { useState, useEffect } from 'react';
import { COURSES } from '@/lib/courses';
import {
  loadState, getTrackInfo, getCourseProgress, getGlobalItems,
  getDaysLeft, type AppState,
} from '@/lib/storage';

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 36 }} />
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12, height: 100, opacity: 0.4,
        }} />
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [appState, setAppState] = useState<AppState>({});
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); setAppState(loadState()); }, []);

  if (!mounted) return <Skeleton />;

  const track    = getTrackInfo(null, appState);
  const { total, done } = getGlobalItems(appState);
  const daysLeft = getDaysLeft();
  const isBehind = track.status === 'behind';

  const sorted = [...COURSES]
    .map(c => {
      const pct    = getCourseProgress(c, appState);
      const ct     = getTrackInfo(c, appState);
      const behind = ct.status === 'behind';
      const dl     = Math.ceil((new Date(c.deadlineDate).getTime() - Date.now()) / 86_400_000);
      const totalC = c.weeks.reduce((a, w) => a + w.items.length, 0);
      const doneC  = Math.round(pct / 100 * totalC);
      return { c, pct, behind, dl, totalC, doneC };
    })
    .sort((a, b) => {
      if (a.behind !== b.behind) return a.behind ? -1 : 1;
      return a.dl - b.dl;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Page title */}
      <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Analytics</span>

      {/* Overall card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 12, padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: 'var(--shadow-card)',
      }}>
        <div className="flex items-end justify-between">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-1)', lineHeight: 1 }}>
              {track.actualPct}%
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              {done} / {total} items complete
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: daysLeft < 30 ? 'var(--color-amber)' : 'var(--text-2)',
            }}>
              {daysLeft} days left
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Deadline Jun 10</span>
            {isBehind && (
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: 'var(--color-red)',
              }}>
                {Math.abs(track.diff)} items behind
              </span>
            )}
          </div>
        </div>

        {/* Dual progress bar */}
        <div style={{
          position: 'relative', height: 6, borderRadius: 3,
          background: 'var(--bg-elevated)', overflow: 'hidden',
        }}>
          {/* Expected track (ghost) */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(track.expectedPct, 100)}%`,
            background: 'var(--border-strong)', borderRadius: 3,
          }} />
          {/* Actual progress */}
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(track.actualPct, 100)}%`,
            background: 'var(--accent)', borderRadius: 3,
          }} />
        </div>

        <div className="flex items-center gap-4">
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
            <span style={{ opacity: 0.6 }}>●</span> Expected {track.expectedPct}%
          </span>
          <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>
            ● Actual {track.actualPct}%
          </span>
        </div>
      </div>

      {/* Section label */}
      <span className="label-section" style={{ marginTop: 4 }}>Per course</span>

      {/* Per-course list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(({ c, pct, behind, dl, totalC, doneC }) => (
          <div key={c.id} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 12, padding: '12px 16px',
            display: 'flex', flexDirection: 'column', gap: 9,
            boxShadow: 'var(--shadow-card)',
          }}>
            {/* Row 1: dot + name + badge */}
            <div className="flex items-center gap-2">
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: c.accent, flexShrink: 0,
              }} />
              <span style={{
                fontSize: 12, fontWeight: 600, color: 'var(--text-1)', flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {c.title}
              </span>
              <StatusBadge behind={behind} />
            </div>

            {/* Progress bar */}
            <div style={{
              position: 'relative', height: 4, borderRadius: 2,
              background: 'var(--bg-elevated)', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${pct}%`,
                background: behind ? 'var(--color-red)' : c.accent,
                borderRadius: 2,
                opacity: behind ? 0.7 : 1,
              }} />
            </div>

            {/* Row 2: meta */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                {doneC} / {totalC} items · {pct}%
              </span>
              <span style={{
                fontSize: 10, fontWeight: 500,
                color: dl < 0
                  ? 'var(--color-red)'
                  : dl < 7
                  ? 'var(--color-amber)'
                  : 'var(--text-3)',
              }}>
                {dl < 0 ? 'Overdue' : dl === 0 ? 'Due today' : `${dl} days left`}
              </span>
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
    }}>
      {behind ? 'behind' : 'on track'}
    </span>
  );
}
