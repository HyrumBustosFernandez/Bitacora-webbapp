'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import {
  loadState, getCourseProgress, getGlobalItems,
  getDaysLeft, getTrackInfo, type AppState,
} from '@/lib/storage';
import FocusTodayCard from '@/components/dashboard/FocusTodayCard';
import ContextualTip from '@/components/ContextualTip';

function Ring({ pct, accent }: { pct: number; accent: string }) {
  const size = 44, sw = 4, r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--bg-elevated)" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={pct === 100 ? 'var(--color-green)' : accent}
        strokeWidth={sw} strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 600ms ease' }}
      />
    </svg>
  );
}

function DifficultyBadge({ tag, hours }: { tag: 'cisco' | 'ms'; hours: number }) {
  const level  = hours <= 6 ? 'Easy' : hours <= 10 ? 'Medium' : 'Hard';
  const color  = hours <= 6 ? 'var(--color-green)'  : hours <= 10 ? 'var(--color-amber)'  : 'var(--color-red)';
  const bg     = hours <= 6 ? 'var(--color-green-subtle)' : hours <= 10 ? 'var(--color-amber-subtle)' : 'var(--color-red-subtle)';
  const border = hours <= 6 ? 'var(--color-green-border)' : hours <= 10 ? 'var(--color-amber-border)' : 'var(--color-red-border)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 4, background: bg, border: `1px solid ${border}`, color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{level}</span>
      <span style={{ fontSize: 9, color: 'var(--text-4)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '1px 5px', fontWeight: 500 }}>{tag === 'cisco' ? 'Cisco' : 'MS Learn'}</span>
    </div>
  );
}

function MiniStatCard({ label, value, sub, valueColor }: { label: string; value: string; sub: string; valueColor?: string }) {
  return (
    <div className="card" style={{ padding: '14px 16px 0', overflow: 'hidden', borderRadius: 12, cursor: 'default' }}>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: valueColor ?? 'var(--text-1)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, marginBottom: 12 }}>{sub}</div>
      <div style={{ height: 3, background: 'var(--bg-elevated)', margin: '0 -16px' }}>
        <div style={{ height: '100%', width: '100%', background: valueColor ?? 'var(--accent)', opacity: 0.3 }} />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="page-container">
      <div style={{ height: 44 }} />
      <div className="rg-4">{[0,1,2,3].map(i => <div key={i} className="skeleton" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, height: 80 }} />)}</div>
      <div className="rg-3">{[0,1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, height: 160 }} />)}</div>
    </div>
  );
}

export default function CoursesPage() {
  const [appState,      setAppState]      = useState<AppState>({});
  const [mounted,       setMounted]       = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const refresh = useCallback(() => setAppState(loadState()), []);
  useEffect(() => { setMounted(true); setAppState(loadState()); }, []);

  if (!mounted) return <Skeleton />;

  const { total, done } = getGlobalItems(appState);
  const daysLeft        = getDaysLeft();
  const track           = getTrackInfo(null, appState);
  const today           = new Date().toISOString().split('T')[0];
  const tasksDueToday   = COURSES.reduce((n, c) => { c.weeks.forEach(w => w.items.forEach(it => { if (it.day === today) n++; })); return n; }, 0);
  const completedCount  = COURSES.filter(c => getCourseProgress(c, appState) === 100).length;
  const visibleCourses  = COURSES.filter(c => !hideCompleted || getCourseProgress(c, appState) < 100);

  return (
    <div className="page-container">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Courses</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 3 }}>{COURSES.length} active courses</div>
        </div>
        {completedCount > 0 && (
          <button type="button" onClick={() => setHideCompleted(v => !v)} className="btn btn-secondary" style={{ fontSize: 11 }}>
            {hideCompleted ? `Show ${completedCount} completed` : `Hide ${completedCount} completed`}
          </button>
        )}
      </div>

      <ContextualTip
        id="courses-tip"
        text="Browse all your certification courses here. Click a course to see its full curriculum, or use Focus Today below to work on your highest-priority module."
      />

      <FocusTodayCard state={appState} onRefresh={refresh} />

      <div className="rg-4">
        <MiniStatCard label="Total Courses"  value={String(COURSES.length)} sub="active this term" />
        <MiniStatCard label="Items Done"      value={String(done)}          sub={`of ${total} · ${track.actualPct}%`} />
        <MiniStatCard label="Days Remaining"  value={String(daysLeft)}      sub="until Jun 10"
          valueColor={daysLeft < 14 ? 'var(--color-red)' : daysLeft < 30 ? 'var(--color-amber)' : undefined} />
        <MiniStatCard label="Due Today"       value={String(tasksDueToday)} sub="items scheduled"
          valueColor={tasksDueToday > 0 ? 'var(--color-amber)' : undefined} />
      </div>

      {visibleCourses.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '40px 20px', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14 }}>
          <span style={{ fontSize: 32 }}>🎓</span>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>All courses completed!</span>
          <button type="button" className="btn btn-secondary" onClick={() => setHideCompleted(false)} style={{ fontSize: 11 }}>Show completed</button>
        </div>
      ) : (
        <div className="rg-3">
          {visibleCourses.map(c => {
            const pct      = getCourseProgress(c, appState);
            const cTrack   = getTrackInfo(c, appState);
            const dueDate  = new Date(c.deadlineDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const totalC   = c.weeks.reduce((a, w) => a + w.items.length, 0);
            const isBehind = cTrack.status === 'behind';
            const isDone   = pct === 100;

            return (
              <Link key={c.id} href={`/courses/${c.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, height: '100%', borderRadius: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Ring pct={pct} accent={c.accent} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4, marginBottom: 5 }}>{c.title}</div>
                      <DifficultyBadge tag={c.tag} hours={c.hoursNumeric} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: isDone ? 'var(--color-green)' : isBehind ? 'var(--color-amber)' : 'var(--text-2)', flexShrink: 0 }}>
                      {pct}%
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: 'var(--text-2)' }}>Due {dueDate} · {totalC} items</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 4,
                      background: isDone ? 'var(--color-green-subtle)' : isBehind ? 'var(--color-amber-subtle)' : 'var(--accent-subtle)',
                      border: `1px solid ${isDone ? 'var(--color-green-border)' : isBehind ? 'var(--color-amber-border)' : 'var(--accent-border)'}`,
                      color: isDone ? 'var(--color-green)' : isBehind ? 'var(--color-amber)' : 'var(--accent)',
                    }}>
                      {isDone ? 'complete' : isBehind ? 'behind' : 'on track'}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 500 }}>Open →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
