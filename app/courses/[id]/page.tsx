'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { IconCheck } from '@tabler/icons-react';
import { COURSES } from '@/lib/courses';
import {
  loadState, getTrackInfo, getItemState, toggleItemDone,
  getWeekProgress, type AppState,
} from '@/lib/storage';

type Tab = 'modules' | 'notes' | 'tools';

interface NoteRecord {
  content: string;
  updatedAt: string;
  moduleId: string;
  courseName: string;
  moduleName: string;
}

const DIVIDER: React.CSSProperties = {
  height: 1,
  background: 'rgba(255,255,255,0.05)',
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const course  = COURSES.find(c => c.id === id);

  const [appState, setAppState] = useState<AppState>({});
  const [mounted, setMounted]   = useState(false);
  const [tab, setTab]           = useState<Tab>('modules');
  const [notes, setNotes]       = useState<Record<string, NoteRecord | null>>({});

  const refresh = useCallback(() => setAppState(loadState()), []);

  useEffect(() => {
    setMounted(true);
    setAppState(loadState());
  }, []);

  useEffect(() => {
    if (!mounted || !course) return;
    const map: Record<string, NoteRecord | null> = {};
    course.weeks.forEach((_, wi) => {
      const moduleId = `${course.id}-w${wi}`;
      try {
        const raw = localStorage.getItem(`note_${moduleId}`);
        map[moduleId] = raw ? JSON.parse(raw) : null;
      } catch {
        map[moduleId] = null;
      }
    });
    setNotes(map);
  }, [mounted, course]);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 80 }} />
        <div style={{
          background: '#0E0E0E', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, height: 400, opacity: 0.35,
        }} />
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/courses" style={{ fontSize: 11, color: '#484848', textDecoration: 'none' }}>
          ← Courses
        </Link>
        <span style={{ fontSize: 14, color: '#484848' }}>Course not found.</span>
      </div>
    );
  }

  const track    = getTrackInfo(course, appState);
  const isBehind = track.status === 'behind';
  const platform = course.tag === 'cisco' ? 'Cisco NetAcad' : 'Microsoft Learn';

  function handleToggle(wi: number, ii: number) {
    toggleItemDone(course!, wi, ii);
    refresh();
  }

  const courseNotes = course.weeks
    .map((w, wi) => {
      const moduleId = `${course.id}-w${wi}`;
      const note = notes[moduleId];
      return note ? { moduleId, moduleName: w.name, note } : null;
    })
    .filter(Boolean) as { moduleId: string; moduleName: string; note: NoteRecord }[];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Back link */}
      <Link href="/courses" style={{ fontSize: 11, color: '#484848', textDecoration: 'none' }}>
        ← Courses
      </Link>

      {/* Page header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#EDE8DC' }}>{course.title}</span>
        <span style={{ fontSize: 11, color: '#484848' }}>
          {course.num} · {platform} · {course.hours}
        </span>
      </div>

      {/* Behind-schedule alert */}
      {isBehind && (
        <div style={{
          borderLeft: '3px solid rgba(239,68,68,0.7)',
          borderRadius: '0 8px 8px 0',
          background: 'rgba(239,68,68,0.04)',
          padding: '10px 14px',
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(252,165,165,0.85)' }}>
            {Math.abs(track.diff)} item{Math.abs(track.diff) !== 1 ? 's' : ''} behind schedule
          </span>
          <span style={{ fontSize: 11, color: 'rgba(245,158,11,0.75)' }}>
            {track.done} / {track.total} items complete · Expected {track.expectedPct}%
          </span>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        {(['modules', 'notes', 'tools'] as Tab[]).map(t => {
          const labels: Record<Tab, string> = {
            modules: 'Modules & Plan',
            notes:   'Notes',
            tools:   'Study Tools',
          };
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                background: 'transparent', border: 0,
                borderBottom: tab === t ? '2px solid #4875F0' : '2px solid transparent',
                padding: '8px 14px',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                color: tab === t ? '#EDE8DC' : '#484848',
                marginBottom: -1,
              }}
            >
              {labels[t]}
            </button>
          );
        })}
      </div>

      {/* ── Tab 1: Modules & Plan ── */}
      {tab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {course.weeks.map((week, wi) => {
            const weekPct  = getWeekProgress(course, wi, appState);
            const moduleId = `${course.id}-w${wi}`;
            const hasNote  = !!notes[moduleId];

            return (
              <div key={wi} style={{
                background: '#0E0E0E',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {/* Week header */}
                <div className="flex items-center gap-2">
                  <span style={{
                    fontSize: 9, fontWeight: 600, color: '#7AA3F8',
                    background: 'rgba(72,117,240,0.1)',
                    border: '1px solid rgba(72,117,240,0.2)',
                    borderRadius: 4, padding: '2px 7px',
                    letterSpacing: '0.4px', textTransform: 'uppercase',
                  }}>
                    {week.label}
                  </span>
                  <span style={{ fontSize: 11, color: '#EDE8DC', fontWeight: 500 }}>
                    {week.name}
                  </span>
                  {week.dates && (
                    <span style={{ fontSize: 10, color: '#484848', marginLeft: 'auto' }}>
                      {week.dates}
                    </span>
                  )}
                </div>

                {/* Week progress bar */}
                <div style={{
                  position: 'relative', height: 3, borderRadius: 2,
                  background: 'rgba(255,255,255,0.05)', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0, height: '100%',
                    width: `${weekPct}%`, background: course.accent, borderRadius: 2,
                  }} />
                </div>

                <div style={DIVIDER} />

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {week.items.map((item, ii) => {
                    const isDone = getItemState(course, wi, ii, appState) === 'done';
                    const isItemNote = ii === 0 && hasNote;
                    return (
                      <div
                        key={ii}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          borderLeft: item.exam ? '2px solid #F59E0B' : '2px solid transparent',
                          paddingLeft: item.exam ? 8 : 0,
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleToggle(wi, ii)}
                          style={{
                            width: 15, height: 15, borderRadius: 4, flexShrink: 0, marginTop: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: isDone ? 'rgba(72,117,240,0.15)' : 'transparent',
                            border: isDone
                              ? '1.5px solid rgba(72,117,240,0.45)'
                              : '1.5px solid rgba(255,255,255,0.12)',
                            cursor: 'pointer', padding: 0,
                          }}
                        >
                          {isDone && <IconCheck size={9} color="#4875F0" strokeWidth={3} />}
                        </button>

                        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 400,
                            color: isDone ? '#333' : '#A8A29A',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}>
                            {item.exam ? '📝 ' : ''}{item.name}
                          </span>
                          {isItemNote && (
                            <span style={{
                              width: 4, height: 4, borderRadius: '50%',
                              background: '#4875F0', flexShrink: 0,
                            }} />
                          )}
                        </span>

                        {item.day && (
                          <span style={{ fontSize: 9, color: '#333', flexShrink: 0, marginTop: 2 }}>
                            {item.day}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {week.tip && (
                  <>
                    <div style={DIVIDER} />
                    <span style={{ fontSize: 10, color: '#333', fontStyle: 'italic' }}>{week.tip}</span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Tab 2: Notes ── */}
      {tab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {courseNotes.length === 0 ? (
            <div style={{
              background: '#0E0E0E',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '24px 14px',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 11, color: '#2E2E2E' }}>
                No notes yet. Open a module to start taking notes.
              </span>
            </div>
          ) : (
            courseNotes.map(({ moduleId, moduleName, note }) => {
              const preview   = note.content.split('\n').find(l => l.trim()) ?? '';
              const updatedAt = new Date(note.updatedAt);
              const daysAgo   = Math.floor((Date.now() - updatedAt.getTime()) / 86_400_000);
              const timeLabel = daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

              return (
                <Link
                  key={moduleId}
                  href={`/study/${moduleId}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#0E0E0E',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12, padding: '10px 14px',
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#A8A29A' }}>
                      {moduleName}
                    </span>
                    <span style={{
                      fontSize: 11, color: '#484848',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {preview}
                    </span>
                    <span style={{ fontSize: 10, color: '#2E2E2E' }}>edited {timeLabel}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* ── Tab 3: Study Tools ── */}
      {tab === 'tools' && (
        <div style={{
          background: '#0E0E0E',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: '24px 14px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#2E2E2E' }}>
            AI study tools coming in a future step.
          </span>
        </div>
      )}

    </div>
  );
}
