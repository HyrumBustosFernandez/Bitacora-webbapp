'use client';

import { COURSES, type CourseItem, type Course } from '@/lib/courses';
import { getCourseProgress, type AppState } from '@/lib/storage';

interface ExamEntry {
  course: Course;
  item: CourseItem;
  daysUntil: number;
}

function getDaysUntilDeadline(deadlineDate: string): number {
  const now = new Date();
  const deadline = new Date(`${deadlineDate}T23:59:59`);
  return Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / 86_400_000));
}

interface BadgeStyle {
  background: string;
  color: string;
  label: string;
}

function getBadgeStyle(days: number): BadgeStyle {
  if (days === 0) {
    return { background: 'rgba(239,68,68,0.15)', color: '#ef4444', label: 'Today!' };
  }
  if (days === 1) {
    return { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Tomorrow' };
  }
  if (days <= 7) {
    return { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: `${days} days` };
  }
  return { background: 'rgba(34,197,94,0.12)', color: '#22c55e', label: `${days} days` };
}

interface Props {
  state: AppState;
}

export default function ExamCountdown({ state }: Props) {
  const entries: ExamEntry[] = [];

  for (const course of COURSES) {
    const pct = getCourseProgress(course, state);
    if (pct >= 100) continue;

    const daysUntil = getDaysUntilDeadline(course.deadlineDate);

    for (const week of course.weeks) {
      for (const item of week.items) {
        if (item.exam === true) {
          entries.push({ course, item, daysUntil });
        }
      }
    }
  }

  if (entries.length === 0) return null;

  entries.sort((a, b) => a.daysUntil - b.daysUntil);
  const upcoming = entries.slice(0, 2);

  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 10,
        flexWrap: 'wrap',
      }}
    >
      {upcoming.map(({ course, item, daysUntil }) => {
        const badge = getBadgeStyle(daysUntil);
        return (
          <div
            key={`${course.id}-${item.id}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid var(--border-subtle)',
              background: 'var(--surface-raised, var(--surface))',
              minWidth: 0,
              maxWidth: 280,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: course.accent,
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                minWidth: 0,
                gap: 1,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                }}
              >
                {course.title}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.3,
                }}
              >
                {item.name}
              </span>
            </div>
            <span
              style={{
                flexShrink: 0,
                marginLeft: 4,
                padding: '2px 8px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                background: badge.background,
                color: badge.color,
                whiteSpace: 'nowrap',
                lineHeight: 1.6,
              }}
            >
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
