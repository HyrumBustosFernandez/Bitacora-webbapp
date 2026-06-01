'use client';

import { useMemo } from 'react';
import { COURSES, type CourseItem, type Course } from '@/lib/courses';
import { getItemState, type AppState } from '@/lib/storage';
import { loadEvents, type CalendarEvent } from '@/lib/events';

// ── Types ────────────────────────────────────────────────────────────────────

interface StudyEntry {
  kind: 'study';
  id: string;
  name: string;
  exam: boolean;
  isDone: boolean;
  course: Course;
  weekIndex: number;
  itemIndex: number;
}

interface EventEntry {
  kind: 'event';
  id: string;
  title: string;
  time: string;      // HH:MM or ''
  type: CalendarEvent['type'];
  color: string;
}

type AgendaEntry = StudyEntry | EventEntry;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns the short weekday abbreviation for a Date (Mon / Tue / …) */
function getWeekdayAbbr(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
  // Returns e.g. "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
}

/** Returns YYYY-MM-DD for a Date in local time */
function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Formats a Date as "Mon, Jun 1" */
function formatHeaderDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Formats HH:MM → "9:00 AM" */
function formatTime(time: string): string {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m} ${period}`;
}

/**
 * Returns true if the course item's day string contains the given weekday
 * abbreviation. Handles values like "Mon", "Mon–Tue", "Mon–Fri", "Tue–Wed",
 * "Sat", "Fri–Sat", and multi-word variants with / or comma separators.
 *
 * Strategy: build the ordered list of weekday abbreviations that the range
 * covers and check for membership.
 */
const WEEKDAYS: readonly string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dayStringContains(dayStr: string | undefined, abbr: string): boolean {
  if (!dayStr) return false;

  // Normalise common unicode dashes to ASCII hyphen
  const normalised = dayStr.replace(/[–—]/g, '-').trim();

  // Try to match a "Start-End" range pattern (e.g. "Mon-Fri", "Tue-Wed")
  const rangeMatch = normalised.match(/^([A-Z][a-z]{2})-([A-Z][a-z]{2})$/);
  if (rangeMatch) {
    const startIdx = WEEKDAYS.indexOf(rangeMatch[1]);
    const endIdx   = WEEKDAYS.indexOf(rangeMatch[2]);
    if (startIdx !== -1 && endIdx !== -1) {
      if (startIdx <= endIdx) {
        return WEEKDAYS.indexOf(abbr) >= startIdx && WEEKDAYS.indexOf(abbr) <= endIdx;
      }
      // Wrap-around (e.g. "Fri-Mon")
      const idx = WEEKDAYS.indexOf(abbr);
      return idx >= startIdx || idx <= endIdx;
    }
  }

  // Fall back: split on separators and check for exact token match
  const tokens = normalised.split(/[\s,/]+/);
  return tokens.some(t => t.trim() === abbr);
}

// ── Event type color helper ───────────────────────────────────────────────────

/** Map EventType to a CSS variable or fallback hex that fits the design system */
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

function eventTypeColor(type: CalendarEvent['type'], fallback: string): string {
  return EVENT_TYPE_VAR[type] ?? fallback;
}

// ── Props ────────────────────────────────────────────────────────────────────

interface Props {
  state: AppState;
}

// ── Component ─────────────────────────────────────────────────────────────────

const MAX_VISIBLE = 5;

export default function TodayAgenda({ state }: Props) {
  const today = useMemo(() => new Date(), []);
  const todayKey   = useMemo(() => toDateKey(today), [today]);
  const todayAbbr  = useMemo(() => getWeekdayAbbr(today), [today]);
  const headerDate = useMemo(() => formatHeaderDate(today), [today]);

  // ── Collect calendar events for today ──────────────────────────────────────
  const eventEntries = useMemo<EventEntry[]>(() => {
    const raw = loadEvents().filter(e => e.date === todayKey);
    // Sort by time; timed events before untimed, then alphabetically by time
    raw.sort((a, b) => {
      const at = a.time ?? '';
      const bt = b.time ?? '';
      if (at && bt) return at.localeCompare(bt);
      if (at) return -1;
      if (bt) return 1;
      return 0;
    });
    return raw.map<EventEntry>(e => ({
      kind:  'event',
      id:    e.id,
      title: e.title,
      time:  e.time ?? '',
      type:  e.type,
      color: e.color,
    }));
  }, [todayKey]);

  // ── Collect study items for today ─────────────────────────────────────────
  const studyEntries = useMemo<StudyEntry[]>(() => {
    const entries: StudyEntry[] = [];
    for (const course of COURSES) {
      course.weeks.forEach((week, wi) => {
        week.items.forEach((item: CourseItem, ii) => {
          if (!dayStringContains(item.day, todayAbbr)) return;
          const isDone = getItemState(course, wi, ii, state) === 'done';
          entries.push({
            kind:      'study',
            id:        item.id,
            name:      item.name,
            exam:      item.exam ?? false,
            isDone,
            course,
            weekIndex: wi,
            itemIndex: ii,
          });
        });
      });
    }
    return entries;
  }, [todayAbbr, state]);

  // ── Merge and cap ─────────────────────────────────────────────────────────
  // Events first (sorted by time), then study items
  const allEntries: AgendaEntry[] = [...eventEntries, ...studyEntries];
  const visible  = allEntries.slice(0, MAX_VISIBLE);
  const overflow = Math.max(0, allEntries.length - MAX_VISIBLE);
  const isEmpty  = allEntries.length === 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        background:   'var(--bg-surface)',
        border:       '1px solid var(--border-subtle)',
        borderRadius: 12,
        padding:      '14px 16px',
        display:      'flex',
        flexDirection: 'column',
        gap:           10,
        boxShadow:    'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="label-section">Today</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)' }}>
          {headerDate}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border-subtle)', flexShrink: 0 }} />

      {/* Empty state */}
      {isEmpty && (
        <div
          style={{
            display:       'flex',
            flexDirection: 'column',
            alignItems:    'center',
            gap:            6,
            padding:       '12px 0',
          }}
        >
          <span style={{ fontSize: 22 }}>🌟</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500, textAlign: 'center' }}>
            Nothing scheduled for today
          </span>
        </div>
      )}

      {/* Items */}
      {!isEmpty && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {visible.map(entry =>
            entry.kind === 'event'
              ? <EventRow key={`ev-${entry.id}`} entry={entry} />
              : <StudyRow key={`st-${entry.id}`} entry={entry} />
          )}

          {overflow > 0 && (
            <div
              style={{
                fontSize:    11,
                fontWeight:  500,
                color:       'var(--text-3)',
                paddingTop:  4,
                textAlign:   'center',
              }}
            >
              +{overflow} more
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EventRow({ entry }: { entry: EventEntry }) {
  const dotColor = eventTypeColor(entry.type, entry.color);
  return (
    <div
      style={{
        display:     'flex',
        alignItems:  'center',
        gap:          8,
        padding:     '4px 6px',
        borderRadius: 8,
        minHeight:   28,
      }}
    >
      {/* Color dot */}
      <span
        style={{
          width:        7,
          height:       7,
          borderRadius: '50%',
          flexShrink:   0,
          background:   dotColor,
          boxShadow:    `0 0 0 2px ${dotColor}22`,
        }}
      />

      {/* Time pill */}
      {entry.time ? (
        <span
          style={{
            fontSize:     10,
            fontWeight:   600,
            color:        'var(--text-3)',
            background:   'var(--bg-elevated)',
            border:       '1px solid var(--border-subtle)',
            borderRadius: 6,
            padding:      '2px 6px',
            flexShrink:   0,
            letterSpacing: '-0.01em',
          }}
        >
          {formatTime(entry.time)}
        </span>
      ) : (
        <span
          style={{
            fontSize:  10,
            color:     'var(--text-4)',
            flexShrink: 0,
            minWidth:  44,
          }}
        >
          All day
        </span>
      )}

      {/* Title */}
      <span
        style={{
          fontSize:     12,
          fontWeight:   500,
          color:        'var(--text-2)',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          whiteSpace:   'nowrap',
          flex:          1,
        }}
      >
        {entry.title}
      </span>
    </div>
  );
}

function StudyRow({ entry }: { entry: StudyEntry }) {
  return (
    <div
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:         8,
        padding:    '4px 6px',
        borderRadius: 8,
        minHeight:  28,
        opacity:    entry.isDone ? 0.45 : 1,
        transition: 'opacity 130ms ease',
      }}
    >
      {/* Check circle */}
      <CheckCircle checked={entry.isDone} />

      {/* Name */}
      <span
        style={{
          fontSize:       12,
          fontWeight:     500,
          color:          entry.isDone ? 'var(--text-3)' : 'var(--text-2)',
          textDecoration: entry.isDone ? 'line-through' : 'none',
          overflow:       'hidden',
          textOverflow:   'ellipsis',
          whiteSpace:     'nowrap',
          flex:            1,
        }}
      >
        {entry.name}
      </span>

      {/* Exam badge */}
      {entry.exam && !entry.isDone && (
        <span
          style={{
            fontSize:      9,
            fontWeight:    700,
            padding:       '2px 6px',
            borderRadius:  4,
            background:    'var(--color-red-subtle)',
            border:        '1px solid var(--color-red-border)',
            color:         'var(--color-red)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            flexShrink:    0,
          }}
        >
          Exam
        </span>
      )}
    </div>
  );
}

function CheckCircle({ checked }: { checked: boolean }) {
  return (
    <span
      style={{
        width:          16,
        height:         16,
        borderRadius:   '50%',
        flexShrink:     0,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     checked ? 'var(--color-green-subtle)' : 'transparent',
        border:         checked
          ? '1.5px solid var(--color-green-border)'
          : '1.5px solid var(--border-default)',
        transition:     'all 130ms ease',
      }}
    >
      {checked && (
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M1.5 4L3.2 5.8L6.5 2"
            stroke="var(--color-green)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
