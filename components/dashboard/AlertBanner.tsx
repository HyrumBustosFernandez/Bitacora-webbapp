'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getTrackInfo, getDaysLeft, type AppState } from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

export default function AlertBanner({ state }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const track    = getTrackInfo(null, state);
  const daysLeft = getDaysLeft();

  if (track.status !== 'behind' || dismissed) return null;

  const itemsBehind   = Math.abs(track.diff);
  const catchUpPerDay = daysLeft > 0 ? Math.ceil(itemsBehind / daysLeft) : itemsBehind;

  const behindCourses = COURSES
    .map(c => ({ course: c, diff: getTrackInfo(c, state).diff }))
    .filter(x => x.diff < -2)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2);

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      background: 'var(--color-amber-subtle)',
      border: '1px solid var(--color-amber-border)',
      borderRadius: 10,
      padding: '11px 14px',
    }}>
      <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>⚠️</span>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>
          You&apos;re {itemsBehind} item{itemsBehind !== 1 ? 's' : ''} behind schedule
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 400 }}>
          Complete {catchUpPerDay} item{catchUpPerDay !== 1 ? 's' : ''}/day to catch up by Jun 10.
        </span>
        {behindCourses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 3 }}>
            {behindCourses.map(({ course, diff }) => (
              <div key={course.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: 'var(--color-amber)', flexShrink: 0, display: 'inline-block',
                }} />
                <span style={{ fontSize: 11, color: 'var(--text-2)' }}>
                  {course.title} — {Math.abs(diff)} items
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Link
          href="/analytics"
          style={{
            fontSize: 11, fontWeight: 600,
            color: 'var(--color-amber)',
            textDecoration: 'none', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Review now →
        </Link>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-3)', fontSize: 18, lineHeight: 1,
            padding: '0 2px', transition: 'color 130ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          ×
        </button>
      </div>
    </div>
  );
}
