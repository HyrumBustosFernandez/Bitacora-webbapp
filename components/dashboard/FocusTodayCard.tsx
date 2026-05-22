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
  background: '#0E0E0E',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const DIVIDER: React.CSSProperties = {
  height: 1,
  background: 'rgba(255,255,255,0.05)',
  flexShrink: 0,
};

export default function FocusTodayCard({ state, onRefresh }: Props) {
  const focus = getFocusInfo(state);

  if (!focus) {
    return (
      <div style={CARD}>
        <span style={{ fontSize: 11, color: '#484848' }}>All modules complete 🎉</span>
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
        fontSize: 9, fontWeight: 600, color: '#4875F0',
        textTransform: 'uppercase', letterSpacing: '0.7px',
      }}>
        <IconBolt size={11} />
        Focus Today
      </div>

      {/* Breadcrumb */}
      <div style={{ fontSize: 10, color: '#484848', fontWeight: 500 }}>
        {course.title}
      </div>

      {/* Module title */}
      <div style={{ fontSize: 15, fontWeight: 600, color: '#EDE8DC', lineHeight: 1.3 }}>
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
                background: isDone ? 'rgba(72,117,240,0.15)' : 'transparent',
                border: isDone
                  ? '1.5px solid rgba(72,117,240,0.45)'
                  : '1.5px solid rgba(255,255,255,0.12)',
              }}>
                {isDone && <IconCheck size={9} color="#4875F0" strokeWidth={3} />}
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{
                  fontSize: 12, fontWeight: 500,
                  color: isDone ? '#333' : '#A8A29A',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>
                  {item.exam ? '📝 ' : ''}{item.name}
                </span>
                {item.sub && !isDone && (
                  <span style={{ fontSize: 10, color: '#3A3A3A' }}>{item.sub}</span>
                )}
              </span>
              {item.day && (
                <span style={{ fontSize: 9, color: '#333', flexShrink: 0, marginTop: 2 }}>
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
          <div style={{ fontSize: 10, color: '#333', fontStyle: 'italic' }}>{week.tip}</div>
        </>
      )}

      <div style={DIVIDER} />

      {/* Next up */}
      {nextCourse && typeof nextWeekIndex === 'number' && (
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 10, color: '#333', flexShrink: 0 }}>Next up</span>
          <span style={{
            fontSize: 10, color: '#484848',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {nextCourse.weeks[nextWeekIndex].name}
          </span>
        </div>
      )}

      {/* CTA — dark bordered style matching mockup */}
      <Link
        href={`/study/${course.id}-w${weekIndex}`}
        className="flex items-center justify-center gap-2 no-underline"
        style={{
          width: '100%',
          padding: '11px 0',
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 9,
          color: '#EDE8DC',
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
        : '1px solid rgba(255,255,255,0.08)',
      color: urgent ? 'rgba(252,165,165,0.75)' : '#5A5A5A',
    }}>
      {children}
    </span>
  );
}
