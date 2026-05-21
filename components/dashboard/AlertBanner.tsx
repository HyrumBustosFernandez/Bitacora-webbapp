'use client';

import { getTrackInfo, getDaysLeft, type AppState } from '@/lib/storage';
import { COURSES } from '@/lib/courses';
import { getCourseProgress, getTrackInfo as getCourseTrack } from '@/lib/storage';

interface Props { state: AppState }

export default function AlertBanner({ state }: Props) {
  const track    = getTrackInfo(null, state);
  const daysLeft = getDaysLeft();

  if (track.status !== 'behind') return null;

  const itemsBehind   = Math.abs(track.diff);
  const catchUpPerDay = daysLeft > 0 ? Math.ceil(itemsBehind / daysLeft) : itemsBehind;
  const catchUpDate   = new Date();
  catchUpDate.setDate(catchUpDate.getDate() + Math.ceil(itemsBehind / Math.max(catchUpPerDay, 1)));
  const catchUpStr    = catchUpDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const behindCourses = COURSES
    .map(c => {
      const ct = getCourseTrack(c, state);
      return { course: c, diff: ct.diff };
    })
    .filter(x => x.diff < -2)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3);

  return (
    <div style={{
      borderLeft: '2px solid rgba(239,68,68,0.7)',
      paddingLeft: 12,
      paddingTop: 8,
      paddingBottom: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <div style={{ fontWeight: 600, color: 'rgba(252,165,165,0.85)', fontSize: 12 }}>
        You&apos;re {itemsBehind} item{itemsBehind !== 1 ? 's' : ''} behind schedule
      </div>
      <div style={{ fontSize: 11, color: '#484848' }}>
        Complete {catchUpPerDay} item{catchUpPerDay !== 1 ? 's' : ''}/day — you&apos;ll catch up by {catchUpStr}
      </div>
      {behindCourses.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 }}>
          {behindCourses.map(({ course, diff }) => (
            <div key={course.id} className="flex items-center gap-2" style={{ fontSize: 10 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: course.accent, flexShrink: 0,
              }} />
              <span style={{ color: '#484848' }}>{course.title}</span>
              <span style={{ color: 'rgba(252,165,165,0.6)', marginLeft: 'auto' }}>
                {Math.abs(diff)} behind
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
