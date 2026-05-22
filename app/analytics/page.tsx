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
          background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, height: 100, opacity: 0.35,
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
      <span style={{ fontSize: 18, fontWeight: 600, color: '#EDE8DC' }}>Analytics</span>

      {/* Overall card */}
      <div style={{
        background: '#0E0E0E',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div className="flex items-end justify-between">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontSize: 32, fontWeight: 700, color: '#EDE8DC', lineHeight: 1 }}>
              {track.actualPct}%
            </span>
            <span style={{ fontSize: 11, color: '#484848' }}>
              {done} / {total} items complete
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 11, color: daysLeft < 30 ? '#F59E0B' : '#484848' }}>
              {daysLeft} days left
            </span>
            <span style={{ fontSize: 10, color: '#2E2E2E' }}>Deadline Jun 10</span>
            {isBehind && (
              <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(252,165,165,0.85)' }}>
                {Math.abs(track.diff)} items behind
              </span>
            )}
          </div>
        </div>

        {/* Dual bar */}
        <div style={{
          position: 'relative', height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(track.expectedPct, 100)}%`,
            background: 'rgba(255,255,255,0.10)', borderRadius: 3,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${Math.min(track.actualPct, 100)}%`,
            background: '#4875F0', borderRadius: 3,
          }} />
        </div>

        <div className="flex items-center gap-4">
          <span style={{ fontSize: 10, color: '#484848' }}>● Expected {track.expectedPct}%</span>
          <span style={{ fontSize: 10, color: '#4875F0' }}>● Actual {track.actualPct}%</span>
        </div>
      </div>

      {/* Section label */}
      <span style={{
        fontSize: 9, fontWeight: 600, color: '#484848',
        textTransform: 'uppercase', letterSpacing: '0.6px',
        marginTop: 4,
      }}>
        Per course
      </span>

      {/* Per-course grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(({ c, pct, behind, dl, totalC, doneC }) => (
          <div key={c.id} style={{
            background: '#0E0E0E',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '10px 14px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            {/* Row 1: dot + name + badge */}
            <div className="flex items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.accent, flexShrink: 0 }} />
              <span style={{
                fontSize: 12, fontWeight: 600, color: '#EDE8DC', flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {c.title}
              </span>
              <StatusBadge behind={behind} />
            </div>

            {/* Progress bar */}
            <div style={{
              position: 'relative', height: 4, borderRadius: 2,
              background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${pct}%`,
                background: behind ? 'rgba(239,68,68,0.6)' : c.accent,
                borderRadius: 2,
              }} />
            </div>

            {/* Row 2: meta */}
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 10, color: '#484848' }}>
                {doneC} / {totalC} items · {pct}%
              </span>
              <span style={{
                fontSize: 10,
                color: dl < 0 ? 'rgba(252,165,165,0.85)' : dl < 7 ? '#F59E0B' : '#484848',
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
      fontSize: 9, fontWeight: 500,
      padding: '2px 7px', borderRadius: 4, flexShrink: 0,
      background: behind ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
      border: `1px solid ${behind ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)'}`,
      color: behind ? 'rgba(252,165,165,0.8)' : 'rgba(110,231,183,0.8)',
    }}>
      {behind ? 'behind' : 'on track'}
    </span>
  );
}
