'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconBolt, IconCheck, IconArrowRight } from '@tabler/icons-react';
import {
  getFocusInfo, getItemState, toggleItemDone, getTrackInfo, loadState, getCourseProgress,
  type AppState,
} from '@/lib/storage';
import { useToast } from '@/components/Toast';
import Confetti from '@/components/Confetti';

interface Props {
  state: AppState;
  onRefresh: () => void;
}

const DIVIDER: React.CSSProperties = {
  height: 1,
  background: 'var(--border-subtle)',
  flexShrink: 0,
};

export default function FocusTodayCard({ state, onRefresh }: Props) {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const focus = getFocusInfo(state);

  if (!focus) {
    return (
      <div className="card" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', padding: '16px 0' }}>
          <span style={{ fontSize: 28 }}>🎉</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>All modules complete!</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Great work — you&apos;re all caught up.</span>
        </div>
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
    const wasDone = getItemState(course, weekIndex, ii, state) === 'done';
    const wasComplete = getCourseProgress(course, state) === 100;

    toggleItemDone(course, weekIndex, ii);
    onRefresh();

    const newState = loadState();
    const isNowComplete = getCourseProgress(course, newState) === 100;

    if (!wasComplete && isNowComplete) {
      setShowConfetti(true);
      toast(`🎓 ${course.title} complete!`, { type: 'success', duration: 5000 });
    } else {
      toast(wasDone ? 'Item unmarked' : 'Item marked complete', {
        type: 'success',
        duration: 3500,
        action: {
          label: 'Undo',
          onClick: () => { toggleItemDone(course, weekIndex, ii); onRefresh(); },
        },
      });
    }
  }

  return (
    <>
    {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
    <div className="card" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.08em',
        color: 'var(--accent)',
      }}>
        <IconBolt size={10} />
        Focus Today
      </div>

      {/* Breadcrumb + title */}
      <div>
        <div style={{
          fontSize: 10, color: 'var(--text-3)', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4,
        }}>
          {course.title}
        </div>
        <div style={{
          fontSize: 17, fontWeight: 600, color: 'var(--text-1)',
          lineHeight: 1.3, letterSpacing: '-0.01em',
        }}>
          {week.name}
        </div>
      </div>

      {/* Meta pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Pill>{course.hours}</Pill>
        {isBehind
          ? <Pill variant="amber">Due today</Pill>
          : week.dates
          ? <Pill>{week.dates}</Pill>
          : null
        }
        <Pill variant="accent">{weekDone} / {weekTotal} items</Pill>
      </div>

      <div style={DIVIDER} />

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {week.items.map((item, ii) => {
          const isDone = getItemState(course, weekIndex, ii, state) === 'done';
          return (
            <button
              key={ii}
              type="button"
              onClick={() => handleToggle(ii)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 8px', borderRadius: 8,
                background: 'transparent', border: 'none',
                cursor: 'pointer', width: '100%', textAlign: 'left',
                transition: 'background 130ms ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Checkbox */}
              <span style={{
                width: 16, height: 16, borderRadius: 5, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'var(--accent-subtle)' : 'transparent',
                border: isDone ? '1.5px solid var(--accent-border)' : '1.5px solid var(--border-default)',
                transition: 'all 130ms ease',
              }}>
                {isDone && <IconCheck size={9} color="var(--accent)" strokeWidth={3} />}
              </span>

              <span style={{
                flex: 1, fontSize: 12, fontWeight: 500, lineHeight: 1.5,
                color: isDone ? 'var(--text-4)' : 'var(--text-2)',
                textDecoration: isDone ? 'line-through' : 'none',
                textAlign: 'left',
              }}>
                {item.name}
              </span>

              {item.exam && !isDone && (
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                  background: 'var(--color-red-subtle)',
                  border: '1px solid var(--color-red-border)',
                  color: 'var(--color-red)',
                  textTransform: 'uppercase', letterSpacing: '0.03em', flexShrink: 0,
                }}>
                  Exam
                </span>
              )}

              {item.day && (
                <span style={{ fontSize: 9, color: 'var(--text-4)', flexShrink: 0 }}>
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
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', padding: '0 8px' }}>
            💡 {week.tip}
          </div>
        </>
      )}

      <div style={DIVIDER} />

      {/* Next up */}
      {nextCourse && typeof nextWeekIndex === 'number' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 8px' }}>
          <span style={{ fontSize: 10, color: 'var(--text-3)', flexShrink: 0, fontWeight: 500 }}>Next up</span>
          <span style={{ fontSize: 10, color: 'var(--text-4)', flexShrink: 0 }}>→</span>
          <span style={{
            fontSize: 10, color: 'var(--text-2)', fontWeight: 500,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {nextCourse.weeks[nextWeekIndex].name}
          </span>
        </div>
      )}

      {/* CTA */}
      <Link
        href={`/study/${course.id}-w${weekIndex}`}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '11px 0',
          background: 'var(--accent)', color: '#ffffff',
          borderRadius: 10, textDecoration: 'none',
          fontSize: 13, fontWeight: 600,
          letterSpacing: '-0.01em',
          transition: 'background 150ms ease, box-shadow 150ms ease, transform 150ms ease',
          boxShadow: '0 2px 8px var(--accent-glow)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--accent-hover)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px var(--accent-glow)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'var(--accent)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px var(--accent-glow)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        Start studying this module
        <IconArrowRight size={14} strokeWidth={2.5} />
      </Link>
    </div>
    </>
  );
}

function Pill({ children, variant }: { children: React.ReactNode; variant?: 'amber' | 'accent' }) {
  const styles: Record<string, React.CSSProperties> = {
    default: {
      border: '1px solid var(--border-default)',
      color: 'var(--text-2)',
      background: 'transparent',
    },
    amber: {
      border: '1px solid var(--color-amber-border)',
      color: 'var(--color-amber)',
      background: 'var(--color-amber-subtle)',
    },
    accent: {
      border: '1px solid var(--accent-border)',
      color: 'var(--accent)',
      background: 'var(--accent-subtle)',
    },
  };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 500,
      padding: '3px 10px', borderRadius: 20,
      ...styles[variant ?? 'default'],
    }}>
      {children}
    </span>
  );
}
