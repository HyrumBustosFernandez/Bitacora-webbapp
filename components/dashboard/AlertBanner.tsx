'use client';

import Link from 'next/link';
import { getTrackInfo, getDaysLeft, getCourseProgress, type AppState } from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

export default function AlertBanner({ state }: Props) {
  const track    = getTrackInfo(null, state);
  const daysLeft = getDaysLeft();

  if (track.status !== 'behind') return null;

  const itemsBehind   = Math.abs(track.diff);
  const catchUpPerDay = daysLeft > 0 ? Math.ceil(itemsBehind / daysLeft) : itemsBehind;
  const catchUpDate   = new Date('2026-06-10');

  const behindCourses = COURSES
    .map(c => {
      const ct   = getTrackInfo(c, state);
      const diff = ct.diff;
      return { course: c, diff };
    })
    .filter(x => x.diff < -2)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2);

  return (
    <div style={{
      borderLeft: '3px solid rgba(239,68,68,0.7)',
      borderRadius: '0 8px 8px 0',
      background: 'rgba(239,68,68,0.04)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(252,165,165,0.85)' }}>
          You&apos;re {itemsBehind} item{itemsBehind !== 1 ? 's' : ''} behind schedule
        </span>
        <span style={{ fontSize: 11, color: 'rgba(245,158,11,0.75)' }}>
          Complete {catchUpPerDay} item{catchUpPerDay !== 1 ? 's' : ''}/day to catch up by{' '}
          {catchUpDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>

        {behindCourses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 4 }}>
            {behindCourses.map(({ course, diff }) => (
              <div key={course.id} className="flex items-center gap-2">
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(239,68,68,0.7)', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'rgba(252,165,165,0.7)' }}>
                  {course.title} — {Math.abs(diff)} items
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/analytics"
        style={{
          fontSize: 11, fontWeight: 500, color: '#A8A29A',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 6, padding: '4px 10px',
          textDecoration: 'none', flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        See all →
      </Link>
    </div>
  );
}
