'use client';

import Link from 'next/link';
import { IconBolt, IconCheck } from '@tabler/icons-react';
import {
  getFocusInfo, getItemState, toggleItemDone, getTrackInfo,
  type AppState,
} from '@/lib/storage';

interface Props {
  state: AppState;
  onRefresh: () => void;
}

const CARD: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const DIVIDER: React.CSSProperties = {
  height: 1,
  background: 'var(--border-subtle)',
  flexShrink: 0,
};

export default function FocusTodayCard({ state, onRefresh }: Props) {
  const focus = getFocusInfo(state);

  if (!focus) {
    return (
      <div style={CARD}>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>All modules complete 🎉</span>
      </div>
    );
  }

  const { course, weekIndex, nextCourse, nextWeekIndex } = focus;
  const week  = course.weeks[weekIndex];
  const track = getTrackInfo(course, state);

  const weekDone  = week.items.filter((_, ii) => getItemState(course, weekIndex, ii, state) === 'done').length;
  const weekTotal = week.items.length;
  const isBehind  = track.status === 'behind';

  function handleToggle(ii: number) {
    toggleItemDone(course, weekIndex, ii);
    onRefresh();
  }

  return (
    <div style={CARD}>
      {/* Label */}
      <div className="flex items-center gap-1" style={{
        fontSize: 9, fontWeight: 600, color: 'var(--accent)',
        textTransform: 'uppercase', letterSpacing: '0.7px',
      }}>
        <IconBolt size={11} />
        Focus Today
      </div>

      {/* Breadcrumb */}
      <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>
        {course.title}
      </div>

      {/* Module title */}
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3 }}>
        {week.name}
      </div>

      {/* Meta badges */}
      <div className="flex items-center flex-wrap gap-1">
        <Badge>{course.hours}</Badge>
        {isBehind ? <Badge urgent>Due today</Badge> : week.dates ? <Badge>{week.dates}</Badge> : null}
        <Badge urgent={isBehind}>{weekDone} / {weekTotal} items</Badge>
      </div>

      <div style={DIVIDER} />

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {week.items.map((item, ii) => {
          const isDone = getItemState(course, weekIndex, ii, state) === 'done';
          return (
            <button
              key={ii}
              type="button"
              onClick={() => handleToggle(ii)}
              className="flex items-start gap-2 text-left w-full bg-transparent border-0 p-0 cursor-pointer"
            >
              <span style={{
                width: 15, height: 15, borderRadius: 4, flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'var(--accent-subtle)' : 'transparent',
                border: isDone
                  ? '1.5px solid var(--accent-subtle)'
                  : '1.5px solid var(--border-default)',
              }}>
                {isDone && <IconCheck size={9} color="var(--accent)" strokeWidth={3} />}
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: isDone ? 'var(--text-4)' : 'var(--text-2)',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>
                  {item.exam ? '📝 ' : ''}{item.name}
                </span>
                {item.sub && !isDone && (
                  <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{item.sub}</span>
                )}
              </span>
              {item.day && (
                <span style={{ fontSize: 9, color: 'var(--text-4)', flexShrink: 0, marginTop: 2 }}>
                  {item.day}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tip */}
      {week.tip && (
        <>
          <div style={DIVIDER} />
          <div style={{ fontSize: 10, color: 'var(--text-4)', fontStyle: 'italic' }}>{week.tip}</div>
        </>
      )}

      <div style={DIVIDER} />

      {/* Next up */}
      {nextCourse && typeof nextWeekIndex === 'number' && (
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 10, color: 'var(--text-4)', flexShrink: 0 }}>Next up</span>
          <span style={{
            fontSize: 10, color: 'var(--text-3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {nextCourse.weeks[nextWeekIndex].name}
          </span>
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/study/${course.id}-w${weekIndex}`}
        className="flex items-center justify-center gap-2 no-underline"
        style={{
          width: '100%',
          padding: '11px 0',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          borderRadius: 9,
          color: 'var(--text-1)',
          fontSize: 13,
          fontWeight: 600,
          marginTop: 2,
        }}
      >
        Start studying this module
      </Link>
    </div>
  );
}

function Badge({ children, urgent }: { children: React.ReactNode; urgent?: boolean }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 500,
      padding: '2px 7px', borderRadius: 5,
      border: urgent
        ? '1px solid rgba(239,68,68,0.25)'
        : '1px solid var(--border-default)',
      color: urgent ? 'rgba(252,165,165,0.75)' : 'var(--text-3)',
    }}>
      {children}
    </span>
  );
}
