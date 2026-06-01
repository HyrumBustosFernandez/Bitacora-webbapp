'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { COURSES, type CourseItem, type Course } from '@/lib/courses';
import { getItemState, toggleItemDone, loadState, getCourseProgress, type AppState } from '@/lib/storage';
import { loadEvents, type CalendarEvent } from '@/lib/events';
import { useToast } from '@/components/Toast';
import Confetti from '@/components/Confetti';
import { useState } from 'react';

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatHeaderDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(time: string) {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getWeekdayAbbr(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function dayStringContains(dayStr: string | undefined, abbr: string): boolean {
  if (!dayStr) return false;
  const normalised = dayStr.replace(/[–—]/g, '-').trim();
  const rangeMatch = normalised.match(/^([A-Z][a-z]{2})-([A-Z][a-z]{2})$/);
  if (rangeMatch) {
    const startIdx = WEEKDAYS.indexOf(rangeMatch[1]);
    const endIdx   = WEEKDAYS.indexOf(rangeMatch[2]);
    if (startIdx !== -1 && endIdx !== -1) {
      if (startIdx <= endIdx) return WEEKDAYS.indexOf(abbr) >= startIdx && WEEKDAYS.indexOf(abbr) <= endIdx;
      const idx = WEEKDAYS.indexOf(abbr);
      return idx >= startIdx || idx <= endIdx;
    }
  }
  const tokens = normalised.split(/[\s,/]+/);
  return tokens.some(t => t.trim() === abbr);
}

const EVENT_TYPE_VAR: Record<string, string> = {
  exam:     'var(--color-red)',
  deadline: 'var(--color-amber)',
  study:    'var(--accent)',
  homework: '#A855F7',
  meeting:  '#06B6D4',
  personal: 'var(--color-green)',
  task:     'var(--color-green)',
  other:    'var(--text-3)',
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface StudyCard {
  kind: 'study';
  id: string;
  name: string;
  exam: boolean;
  isDone: boolean;
  course: Course;
  weekIndex: number;
  itemIndex: number;
  dayLabel: string;
}

interface EventCard {
  kind: 'event';
  id: string;
  title: string;
  time: string;
  type: CalendarEvent['type'];
  color: string;
}

type DayCard = StudyCard | EventCard;

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  state: AppState;
  onRefresh: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TodayCards({ state, onRefresh }: Props) {
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);

  const today      = useMemo(() => new Date(), []);
  const todayKey   = useMemo(() => toDateKey(today), [today]);
  const todayAbbr  = useMemo(() => getWeekdayAbbr(today), [today]);
  const headerDate = useMemo(() => formatHeaderDate(today), [today]);

  const cards = useMemo<DayCard[]>(() => {
    const events = loadEvents()
      .filter(e => e.date === todayKey)
      .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))
      .map<EventCard>(e => ({ kind: 'event', id: e.id, title: e.title, time: e.time ?? '', type: e.type, color: e.color }));

    const study: StudyCard[] = [];
    for (const course of COURSES) {
      course.weeks.forEach((week, wi) => {
        week.items.forEach((item: CourseItem, ii) => {
          if (!dayStringContains(item.day, todayAbbr)) return;
          study.push({
            kind: 'study', id: item.id, name: item.name, exam: item.exam ?? false,
            isDone: getItemState(course, wi, ii, state) === 'done',
            course, weekIndex: wi, itemIndex: ii, dayLabel: item.day ?? '',
          });
        });
      });
    }

    return [...events, ...study];
  }, [todayKey, todayAbbr, state]);

  function handleToggle(card: StudyCard) {
    const wasDone = card.isDone;
    const wasComplete = getCourseProgress(card.course, state) === 100;
    toggleItemDone(card.course, card.weekIndex, card.itemIndex);
    onRefresh();
    const newState = loadState();
    const isNowComplete = getCourseProgress(card.course, newState) === 100;
    if (!wasComplete && isNowComplete) {
      setShowConfetti(true);
      toast(`🎓 ${card.course.title} complete!`, { type: 'success', duration: 5000 });
    } else {
      toast(wasDone ? 'Item unmarked' : 'Item marked complete', {
        type: 'success', duration: 3500,
        action: { label: 'Undo', onClick: () => { toggleItemDone(card.course, card.weekIndex, card.itemIndex); onRefresh(); } },
      });
    }
  }

  const COLLAPSE_THRESHOLD = 4;
  const [expanded, setExpanded] = useState(false);
  const visibleCards = cards.length > COLLAPSE_THRESHOLD && !expanded
    ? cards.slice(0, COLLAPSE_THRESHOLD)
    : cards;
  const hiddenCount = cards.length - COLLAPSE_THRESHOLD;

  return (
    <>
      {showConfetti && <Confetti onDone={() => setShowConfetti(false)} />}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="label-section">Today</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>{headerDate}</span>
        </div>

        {cards.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '16px', borderRadius: 10, background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: 18 }}>🌟</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>Nothing scheduled for today</span>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {visibleCards.map(card =>
                card.kind === 'event'
                  ? <EventTaskCard key={`ev-${card.id}`} card={card} />
                  : <StudyTaskCard key={`st-${card.id}`} card={card} onToggle={() => handleToggle(card)} />
              )}
            </div>
            {cards.length > COLLAPSE_THRESHOLD && (
              <button
                type="button"
                onClick={() => setExpanded(e => !e)}
                style={{
                  alignSelf: 'flex-start', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '4px 0', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: 600, color: 'var(--accent)',
                  display: 'flex', alignItems: 'center', gap: 4,
                  transition: 'opacity 130ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {expanded ? '↑ Show less' : `↓ Show ${hiddenCount} more`}
              </button>
            )}
          </>
        )}
      </section>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StudyTaskCard({ card, onToggle }: { card: StudyCard; onToggle: () => void }) {
  const accent = card.course.accent;
  return (
    <button
      type="button"
      onClick={onToggle}
      data-done={card.isDone ? 'true' : 'false'}
      className="day-card"
      style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        padding: '12px 14px', borderRadius: 12, textAlign: 'left',
        background: card.isDone ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${card.isDone ? 'var(--border-subtle)' : 'var(--border-default)'}`,
        boxShadow: card.isDone ? 'none' : 'var(--shadow-card)',
        cursor: 'pointer', width: '100%', fontFamily: 'inherit',
        opacity: card.isDone ? 0.6 : 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Checkbox */}
        <span style={{
          width: 16, height: 16, borderRadius: 5, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: card.isDone ? 'var(--color-green-subtle)' : 'transparent',
          border: card.isDone ? '1.5px solid var(--color-green-border)' : '1.5px solid var(--border-default)',
          transition: 'all 130ms ease',
        }}>
          {card.isDone && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4L3.2 5.8L6.5 2" stroke="var(--color-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        {card.exam && !card.isDone && (
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
            background: 'var(--color-red-subtle)', border: '1px solid var(--color-red-border)',
            color: 'var(--color-red)', textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>Exam</span>
        )}
      </div>
      <span style={{
        fontSize: 12, fontWeight: 600, color: card.isDone ? 'var(--text-3)' : 'var(--text-1)',
        lineHeight: 1.4, textDecoration: card.isDone ? 'line-through' : 'none',
      }}>
        {card.name}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 500,
        color: accent ?? 'var(--accent)',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {card.course.title}
      </span>
    </button>
  );
}

function EventTaskCard({ card }: { card: EventCard }) {
  const dotColor = EVENT_TYPE_VAR[card.type] ?? card.color;
  return (
    <div
      className="day-card"
      style={{
        display: 'flex', flexDirection: 'column', gap: 8,
        padding: '12px 14px', borderRadius: 12,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
        {card.time ? (
          <span style={{
            fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
            background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
            borderRadius: 5, padding: '1px 6px',
          }}>{formatTime(card.time)}</span>
        ) : (
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>All day</span>
        )}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.4 }}>
        {card.title}
      </span>
      <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500, textTransform: 'capitalize' }}>
        {card.type}
      </span>
    </div>
  );
}
