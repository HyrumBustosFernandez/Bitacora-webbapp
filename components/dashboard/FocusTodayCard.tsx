'use client';

import { useState } from 'react';
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
  padding: '12px 14px',
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

  const nextCourseName = nextCourse
    ? nextCourse.title
    : null;

  function handleToggle(ii: number) {
    toggleItemDone(course, weekIndex, ii);
    onRefresh();
  }

  return (
    <div style={CARD}>
      {/* Label row */}
      <div className="flex items-center gap-1" style={{
        fontSize: 9, fontWeight: 600, color: '#4875F0',
        textTransform: 'uppercase', letterSpacing: '0.7px',
      }}>
        <IconBolt size={11} />
        Focus Today
      </div>

      {/* Course breadcrumb */}
      <div style={{ fontSize: 10, color: '#424242', fontWeight: 500 }}>
        {course.num} · {course.title}
      </div>

      {/* Module title */}
      <div style={{ fontSize: 14, fontWeight: 600, color: '#EDE8DC', lineHeight: 1.35 }}>
        {week.name}
      </div>

      {/* Meta badges */}
      <div className="flex items-center flex-wrap gap-1">
        <Badge>{course.hours}</Badge>
        {week.dates && <Badge>{week.dates}</Badge>}
        {isBehind
          ? <Badge urgent>{weekDone}/{weekTotal} items</Badge>
          : <Badge>{weekDone}/{weekTotal} items</Badge>}
      </div>

      <div style={DIVIDER} />

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {week.items.map((item, ii) => {
          const itemState = getItemState(course, weekIndex, ii, state);
          const isDone    = itemState === 'done';
          return (
            <button
              key={ii}
              type="button"
              onClick={() => handleToggle(ii)}
              className="flex items-start gap-2 text-left w-full bg-transparent border-0 p-0 cursor-pointer"
            >
              {/* Checkbox */}
              <span style={{
                width: 14, height: 14, borderRadius: 4, flexShrink: 0, marginTop: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'rgba(72,117,240,0.15)' : 'transparent',
                border: isDone
                  ? '1.5px solid rgba(72,117,240,0.45)'
                  : '1.5px solid rgba(255,255,255,0.12)',
              }}>
                {isDone && <IconCheck size={9} color="#4875F0" strokeWidth={3} />}
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
                <span style={{
                  fontSize: 11, fontWeight: 500,
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
                <span style={{ fontSize: 9, color: '#333', flexShrink: 0 }}>{item.day}</span>
              )}
            </button>
          );
        })}
      </div>

      {week.tip && (
        <>
          <div style={DIVIDER} />
          <div style={{ fontSize: 10, color: '#333', fontStyle: 'italic' }}>{week.tip}</div>
        </>
      )}

      <div style={DIVIDER} />

      {/* Next up */}
      {nextCourseName && typeof nextWeekIndex === 'number' && (
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 10, color: '#333' }}>Next up</span>
          <span style={{
            fontSize: 10, color: '#484848',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 200,
          }}>
            {nextCourse!.weeks[nextWeekIndex].name}
          </span>
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/study/${course.id}-w${weekIndex}`}
        style={{
          display: 'block', textAlign: 'center',
          background: '#4875F0', color: '#EDE8DC',
          fontWeight: 600, fontSize: 12,
          borderRadius: 9, padding: '8px 0',
          textDecoration: 'none',
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
      fontSize: 9, fontWeight: 500,
      padding: '2px 6px', borderRadius: 5,
      border: urgent
        ? '1px solid rgba(239,68,68,0.25)'
        : '1px solid rgba(255,255,255,0.08)',
      color: urgent ? 'rgba(252,165,165,0.7)' : '#5A5A5A',
    }}>
      {children}
    </span>
  );
}
