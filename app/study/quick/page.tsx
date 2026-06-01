'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { COURSES, type Course, type CourseItem } from '@/lib/courses';
import {
  loadState,
  getItemState,
  toggleItemDone,
  getCourseProgress,
} from '@/lib/storage';

// ── Types ─────────────────────────────────────────────────────────────────────

interface SuggestedItem {
  course: Course;
  weekIndex: number;
  itemIndex: number;
  item: CourseItem;
  estimatedMin: number;
  courseColor: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const COURSE_COLORS: Record<string, string> = {
  cisco: '#5b9cf6',
  ms: '#7c6ff7',
};

function getCourseColor(course: Course): string {
  return COURSE_COLORS[course.tag] ?? course.accent ?? '#5B5BD6';
}

function getTotalItems(course: Course): number {
  return course.weeks.reduce((sum, w) => sum + w.items.length, 0);
}

function estimateMinutes(course: Course): number {
  const total = getTotalItems(course);
  if (total === 0) return 5;
  return Math.max(2, Math.round((course.hoursNumeric * 60) / total));
}

function buildSuggestions(max: number): SuggestedItem[] {
  const state = loadState();

  // Score each course by how far behind it is (highest pct behind = highest priority)
  const expectedPct = 50; // neutral baseline when we can't determine time of day precisely
  const scored = COURSES.map(c => ({
    course: c,
    pct: getCourseProgress(c, state),
    behindBy: expectedPct - getCourseProgress(c, state),
  })).sort((a, b) => b.behindBy - a.behindBy);

  const results: SuggestedItem[] = [];

  for (const { course } of scored) {
    if (results.length >= max) break;
    const estMin = estimateMinutes(course);
    const color = getCourseColor(course);

    for (let wi = 0; wi < course.weeks.length && results.length < max; wi++) {
      const week = course.weeks[wi];
      for (let ii = 0; ii < week.items.length && results.length < max; ii++) {
        const itemState = getItemState(course, wi, ii, state);
        if (itemState === 'done') continue;

        results.push({
          course,
          weekIndex: wi,
          itemIndex: ii,
          item: week.items[ii],
          estimatedMin: estMin,
          courseColor: color,
        });
      }
    }
  }

  return results;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const CARD: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12,
  padding: '18px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 600,
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.6px',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function QuickStudyPage() {
  const [mounted, setMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedItem[]>([]);
  // Local checked state: maps `${courseId}-${wi}-${ii}` → boolean
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const refreshSuggestions = useCallback(() => {
    const items = buildSuggestions(3);
    setSuggestions(items);
    // Initialize checked state from actual storage (all unchecked on fresh load)
    const initial: Record<string, boolean> = {};
    items.forEach(s => {
      initial[`${s.course.id}-${s.weekIndex}-${s.itemIndex}`] = false;
    });
    setChecked(initial);
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshSuggestions();
  }, [refreshSuggestions]);

  const getKey = (s: SuggestedItem) =>
    `${s.course.id}-${s.weekIndex}-${s.itemIndex}`;

  const handleToggle = (s: SuggestedItem) => {
    const key = getKey(s);
    const wasChecked = checked[key] ?? false;

    // Commit to storage
    toggleItemDone(s.course, s.weekIndex, s.itemIndex);

    // If we're un-toggling, we just toggled it to done then back — re-read state
    // toggleItemDone cycles: done → undone, undone → done
    // Since these items started as NOT done, first toggle makes them done.
    // If user toggles again we'd undo — just keep local state in sync.
    setChecked(prev => ({ ...prev, [key]: !wasChecked }));
  };

  const handleMarkAllDone = () => {
    const state = loadState();
    suggestions.forEach(s => {
      const key = getKey(s);
      if (!checked[key]) {
        const itemState = getItemState(s.course, s.weekIndex, s.itemIndex, state);
        // Only toggle if not already done
        if (itemState !== 'done') {
          toggleItemDone(s.course, s.weekIndex, s.itemIndex);
        }
        setChecked(prev => ({ ...prev, [key]: true }));
      }
    });
  };

  const allChecked =
    suggestions.length > 0 &&
    suggestions.every(s => checked[getKey(s)] === true);

  const totalMin = suggestions.reduce((sum, s) => sum + s.estimatedMin, 0);
  const totalMinHigh = Math.round(totalMin * 1.3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link
          href="/study"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: 'var(--text-3)',
            textDecoration: 'none',
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 13 }}>←</span>
          Back to Study
        </Link>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>
          Quick Study
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
          Focused session for when you have 15–30 minutes
        </span>
      </div>

      {/* Main card */}
      <div style={CARD}>
        <span style={{ ...SECTION_LABEL, marginBottom: 14 }}>Top items to tackle now</span>

        {!mounted ? (
          /* SSR placeholder */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                style={{
                  height: 52,
                  borderRadius: 8,
                  background: 'var(--bg-elevated)',
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        ) : allChecked ? (
          /* Celebration state */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '32px 16px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 40 }}>🎉</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>
              Great work!
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Check back tomorrow for more.
            </span>
          </div>
        ) : suggestions.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '32px 16px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 40 }}>✅</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
              All caught up!
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              No incomplete items found across your courses.
            </span>
          </div>
        ) : (
          <>
            {/* Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {suggestions.map((s, idx) => {
                const key = getKey(s);
                const isChecked = checked[key] ?? false;
                const isLast = idx === suggestions.length - 1;

                return (
                  <div key={key}>
                    <button
                      onClick={() => handleToggle(s)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                        padding: '10px 0',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      {/* Checkbox circle */}
                      <div
                        style={{
                          flexShrink: 0,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          border: `2px solid ${isChecked ? 'var(--accent)' : 'var(--border-default)'}`,
                          background: isChecked ? 'var(--accent)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: 1,
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                      >
                        {isChecked && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M1.5 5L4 7.5L8.5 2.5"
                              stroke="white"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Content */}
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: isChecked ? 'var(--text-3)' : 'var(--text-1)',
                            textDecoration: isChecked ? 'line-through' : 'none',
                            lineHeight: 1.3,
                            transition: 'color 0.15s',
                          }}
                        >
                          {s.item.name}
                        </span>

                        {/* Badges row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {/* Course badge */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '2px 7px',
                              borderRadius: 100,
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: s.courseColor,
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 500,
                                color: 'var(--text-3)',
                                whiteSpace: 'nowrap',
                                maxWidth: 140,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {s.course.title}
                            </span>
                          </div>

                          {/* Time badge */}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '2px 7px',
                              borderRadius: 100,
                              background: 'var(--accent-subtle)',
                              border: '1px solid var(--accent-border)',
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: 'var(--accent)',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              ~{s.estimatedMin} min
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Divider */}
                    {!isLast && (
                      <div
                        style={{
                          height: 1,
                          background: 'var(--border-subtle)',
                          marginLeft: 32,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              {/* Total estimate */}
              <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500 }}>
                Estimated total:{' '}
                <span style={{ color: 'var(--text-2)', fontWeight: 600 }}>
                  {totalMin}–{totalMinHigh} min
                </span>
              </span>

              {/* Mark all done button */}
              <button
                onClick={handleMarkAllDone}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px 16px',
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 9,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'background 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'var(--accent-hover)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'var(--accent)';
                }}
              >
                Mark all done
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tip card */}
      {mounted && !allChecked && suggestions.length > 0 && (
        <div
          style={{
            background: 'var(--accent-subtle)',
            border: '1px solid var(--accent-border)',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>
            Even one completed item keeps your momentum going. Check what you can in the time you have.
          </span>
        </div>
      )}
    </div>
  );
}
