'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { loadState, getCourseProgress, type AppState } from '@/lib/storage';

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ height: 44 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, height: 140, opacity: 0.35,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [appState, setAppState] = useState<AppState>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAppState(loadState());
  }, []);

  if (!mounted) return <Skeleton />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#EDE8DC' }}>Courses</span>
          <span style={{ fontSize: 11, color: '#484848' }}>{COURSES.length} courses</span>
        </div>
        <button
          type="button"
          style={{
            background: '#4875F0', color: '#EDE8DC', fontWeight: 600,
            fontSize: 12, borderRadius: 9, border: 0, cursor: 'pointer',
            padding: '8px 14px',
          }}
        >
          + New course
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {COURSES.map(c => {
          const pct      = getCourseProgress(c, appState);
          const platform = c.tag === 'cisco' ? 'Cisco NetAcad' : 'Microsoft Learn';
          const dueDate  = new Date(c.deadlineDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const total    = c.weeks.reduce((acc, w) => acc + w.items.length, 0);

          return (
            <Link key={c.id} href={`/courses/${c.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#0E0E0E',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 8,
                height: '100%',
              }}>
                {/* Title */}
                <div className="flex items-center gap-2">
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: c.accent, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 13, fontWeight: 600, color: '#EDE8DC',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {c.title}
                  </span>
                </div>

                {/* Platform + due */}
                <span style={{ fontSize: 10, color: '#484848' }}>
                  {platform} · Due {dueDate}
                </span>

                {/* Items count */}
                <span style={{ fontSize: 10, color: '#484848' }}>{total} items</span>

                {/* Progress bar */}
                <div style={{
                  position: 'relative', height: 5, borderRadius: 3,
                  background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${pct}%`, background: c.accent, borderRadius: 3,
                  }} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 10, color: '#484848' }}>{pct}%</span>
                  <span style={{ fontSize: 10, color: '#4875F0' }}>Open plan →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
