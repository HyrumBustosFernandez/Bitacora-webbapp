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

export default function OverviewPage() {
  const [appState, setAppState] = useState<AppState>({});
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { setMounted(true); setAppState(loadState()); }, []);

  if (!mounted) return <Skeleton />;

  const track    = getTrackInfo(null, appState);
  const { total, done } = getGlobalItems(appState);
  const daysLeft = getDaysLeft();
  const isBehind = track.status === 'behind';
  const isAhead  = track.status === 'ahead';
  const itemsBehind = Math.abs(track.diff);
  const catchUpPerDay = isBehind && daysLeft > 0 ? Math.ceil(itemsBehind / daysLeft) : 0;

  const sorted = [...COURSES]
    .map(c => {
      const pct    = getCourseProgress(c, appState);
      const ct     = getTrackInfo(c, appState);
      const behind = ct.status === 'behind';
      const dl     = Math.ceil((new Date(c.deadlineDate).getTime() - Date.now()) / 86_400_000);
      const totalC = c.weeks.reduce((a, w) => a + w.items.length, 0);
      const doneC  = Math.round(pct / 100 * totalC);
      return { c, pct, behind, dl, totalC, doneC, diff: ct.diff };
    })
    .sort((a, b) => {
      if (a.behind !== b.behind) return a.behind ? -1 : 1;
      return a.dl - b.dl;
    });

  const behindCourses = sorted.filter(x => x.behind);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Page title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Overview</span>
        <span style={{ fontSize: 11, color: 'var(--text-2)' }}>Academic progress & catch-up status</span>
      </div>

      {/* Catch-up recommendation banner */}
      {isBehind && (
        <div style={{
          background: 'var(--color-amber-subtle)',
          border: '1px solid var(--color-amber-border)',
          borderRadius: 12, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
              You&apos;re {itemsBehind} item{itemsBehind !== 1 ? 's' : ''} behind schedule
            </span>
          </div>
          <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>
            Completing <strong style={{ color: 'var(--color-amber)' }}>{catchUpPerDay} item{catchUpPerDay !== 1 ? 's' : ''} per day</strong> will put you back on track within {daysLeft} day{daysLeft !== 1 ? 's' : ''}.
          </span>
          {behindCourses.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Courses needing attention
              </span>
              {behindCourses.map(({ c, diff }) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.accent, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-2)', flex: 1 }}>{c.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-amber)', fontWeight: 500 }}>
                    {Math.abs(diff)} items behind
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isAhead && (
        <div style={{
          background: 'var(--color-green-subtle)',
          border: '1px solid var(--color-green-border)',
          borderRadius: 12, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 14 }}>✅</span>
          <span style={{ fontSize: 12, color: 'var(--text-1)' }}>
            You&apos;re <strong style={{ color: 'var(--color-green)' }}>{track.diff} items ahead</strong> of schedule — great work!
          </span>
        </div>
      )}

      {/* Overall card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: '16px 18px',
        display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: 'var(--shadow-card)',
      }}>
        <div className="flex items-end justify-between">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)' }}>
              Overall Completion
            </span>
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
              color: daysLeft < 7 ? 'var(--color-red)' : daysLeft < 30 ? 'var(--color-amber)' : 'var(--text-2)',
            }}>
              {daysLeft} days left
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Deadline Jun 10</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>Expected: {track.expectedPct}%</span>
          </div>
        </div>

        {/* Dual progress bar */}
        <div>
          <div style={{
            position: 'relative', height: 8, borderRadius: 4,
            background: 'var(--bg-elevated)', overflow: 'hidden',
          }}>
            {/* Expected track (ghost) */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${Math.min(track.expectedPct, 100)}%`,
              background: 'var(--border-strong)', borderRadius: 4,
            }} />
            {/* Actual progress */}
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${Math.min(track.actualPct, 100)}%`,
              background: isBehind ? 'var(--color-amber)' : 'var(--accent)',
              borderRadius: 4,
              transition: 'width 600ms ease',
            }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
              <span style={{ opacity: 0.5 }}>●</span> Expected {track.expectedPct}%
            </span>
            <span style={{ fontSize: 10, color: isBehind ? 'var(--color-amber)' : 'var(--accent)', fontWeight: 500 }}>
              ● Actual {track.actualPct}%
            </span>
          </div>
        </div>
      </div>

      {/* Section label */}
      <span className="label-section" style={{ marginTop: 4 }}>Per course</span>

      {/* Per-course list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(({ c, pct, behind, dl, totalC, doneC, diff }) => {
          const isDone = pct === 100;
          return (
            <div key={c.id} style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
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
                <StatusBadge status={isDone ? 'done' : behind ? 'behind' : 'on-track'} />
              </div>

              {/* Progress bar */}
              <div style={{
                position: 'relative', height: 4, borderRadius: 2,
                background: 'var(--bg-elevated)', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, height: '100%',
                  width: `${pct}%`,
                  background: isDone ? 'var(--color-green)' : behind ? 'var(--color-amber)' : c.accent,
                  borderRadius: 2,
                  transition: 'width 600ms ease',
                }} />
              </div>

              {/* Row 2: meta */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                  {doneC} / {totalC} items · {pct}%
                  {behind && (
                    <span style={{ color: 'var(--color-amber)', fontWeight: 500, marginLeft: 6 }}>
                      ({Math.abs(diff)} behind)
                    </span>
                  )}
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
          );
        })}
      </div>

    </div>
  );
}

function StatusBadge({ status }: { status: 'done' | 'behind' | 'on-track' }) {
  const map = {
    done:       { bg: 'var(--color-green-subtle)',  border: 'var(--color-green-border)',  color: 'var(--color-green)',  label: 'complete' },
    behind:     { bg: 'var(--color-amber-subtle)',  border: 'var(--color-amber-border)',  color: 'var(--color-amber)', label: 'behind'   },
    'on-track': { bg: 'var(--accent-subtle)',       border: 'var(--accent-border)',       color: 'var(--accent)',      label: 'on track' },
  };
  const s = map[status];
  return (
    <span style={{
      fontSize: 9, fontWeight: 600,
      padding: '2px 7px', borderRadius: 4, flexShrink: 0,
      background: s.bg, border: `1px solid ${s.border}`, color: s.color,
    }}>
      {s.label}
    </span>
  );
}
