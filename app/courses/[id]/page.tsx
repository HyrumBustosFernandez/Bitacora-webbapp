'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IconCheck, IconX, IconPlus, IconPencil, IconTrash } from '@tabler/icons-react';
import { COURSES } from '@/lib/courses';
import {
  loadState, getTrackInfo, getItemState, toggleItemDone,
  getWeekProgress, type AppState,
} from '@/lib/storage';
import {
  loadCourseUserData, saveCourseUserData,
  type CourseUserData, type CourseStatus, type CoursePriority,
} from '@/lib/courseUserData';

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

const STATUS_LABELS: Record<CourseStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  'completed':   'Completed',
  'paused':      'Paused',
};

const PRIORITY_LABELS: Record<CoursePriority, string> = {
  low:      'Low',
  medium:   'Medium',
  high:     'High',
  critical: 'Critical',
};

const PRIORITY_COLORS: Record<CoursePriority, string> = {
  low:      '#6b7280',
  medium:   '#f59e0b',
  high:     '#f97316',
  critical: '#ef4444',
};

function nanoid() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Edit Drawer ──────────────────────────────────────────────────────────────

interface DrawerProps {
  courseId: string;
  courseTitle: string;
  originalDeadline: string;
  onClose: () => void;
  onSaved: (data: CourseUserData) => void;
  initial: CourseUserData;
}

function EditDrawer({ courseId, courseTitle, originalDeadline, onClose, onSaved, initial }: DrawerProps) {
  const [form, setForm] = useState<CourseUserData>({ ...initial });
  const [newGoalText, setNewGoalText] = useState('');

  function patch<K extends keyof CourseUserData>(key: K, val: CourseUserData[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function addGoal() {
    const text = newGoalText.trim();
    if (!text) return;
    patch('studyGoals', [
      ...form.studyGoals,
      { id: nanoid(), text, done: false, createdAt: new Date().toISOString() },
    ]);
    setNewGoalText('');
  }

  function toggleGoal(id: string) {
    patch('studyGoals', form.studyGoals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  }

  function removeGoal(id: string) {
    patch('studyGoals', form.studyGoals.filter(g => g.id !== id));
  }

  function handleSave() {
    const data: CourseUserData = { ...form, updatedAt: new Date().toISOString() };
    saveCourseUserData(data);
    onSaved(data);
    onClose();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-default)',
    borderRadius: 7, padding: '7px 10px',
    color: 'var(--text-1)', fontSize: 12,
    outline: 'none', fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 600,
    color: 'var(--text-3)', textTransform: 'uppercase',
    letterSpacing: '0.5px', marginBottom: 5, display: 'block',
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          zIndex: 40,
        }}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 360, zIndex: 50,
          background: 'var(--bg-page)',
          borderLeft: '1px solid var(--border-default)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Edit course</span>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{courseTitle}</span>
          </div>
          <button
            type="button" onClick={onClose}
            style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: 'var(--text-3)', padding: 4, borderRadius: 6,
              display: 'flex', alignItems: 'center',
            }}
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Drawer body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 18px', flex: 1 }}>

          {/* Status */}
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={e => patch('status', e.target.value as CourseStatus)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            >
              {(Object.keys(STATUS_LABELS) as CourseStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label style={labelStyle}>Priority</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {(Object.keys(PRIORITY_LABELS) as CoursePriority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => patch('priority', p)}
                  style={{
                    flex: 1, padding: '6px 0',
                    background: form.priority === p ? `${PRIORITY_COLORS[p]}18` : 'var(--bg-elevated)',
                    border: `1px solid ${form.priority === p ? PRIORITY_COLORS[p] + '88' : 'var(--border-default)'}`,
                    borderRadius: 7, fontSize: 10, fontWeight: form.priority === p ? 600 : 400,
                    color: form.priority === p ? PRIORITY_COLORS[p] : 'var(--text-3)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 150ms ease',
                  }}
                >
                  {PRIORITY_LABELS[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Deadline override */}
          <div>
            <label style={labelStyle}>Deadline override</label>
            <input
              type="date"
              value={form.deadlineDateOverride ?? ''}
              onChange={e => patch('deadlineDateOverride', e.target.value || undefined)}
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            />
            <span style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 4, display: 'block' }}>
              Original deadline: {originalDeadline}
            </span>
          </div>

          {/* Difficulty */}
          <div>
            <label style={labelStyle}>Difficulty (1–5)</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => patch('difficulty', d as 1 | 2 | 3 | 4 | 5)}
                  style={{
                    flex: 1, padding: '6px 0',
                    background: form.difficulty === d ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                    border: `1px solid ${form.difficulty === d ? 'var(--accent-border)' : 'var(--border-default)'}`,
                    borderRadius: 7, fontSize: 12, fontWeight: form.difficulty === d ? 600 : 400,
                    color: form.difficulty === d ? 'var(--accent)' : 'var(--text-3)',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 150ms ease',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Personal notes</label>
            <textarea
              value={form.description ?? ''}
              onChange={e => patch('description', e.target.value || undefined)}
              placeholder="Add your own notes about this course..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            />
          </div>

          {/* Study Goals */}
          <div>
            <label style={labelStyle}>Study goals</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 8 }}>
              {form.studyGoals.map(goal => (
                <div
                  key={goal.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 8px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 7,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: goal.done ? 'var(--accent-subtle)' : 'transparent',
                      border: goal.done
                        ? '1.5px solid var(--accent-border)'
                        : '1.5px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer', padding: 0,
                    }}
                  >
                    {goal.done && <IconCheck size={9} color="var(--accent)" strokeWidth={3} />}
                  </button>
                  <span style={{
                    flex: 1, fontSize: 12,
                    color: goal.done ? 'var(--text-4)' : 'var(--text-2)',
                    textDecoration: goal.done ? 'line-through' : 'none',
                  }}>
                    {goal.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeGoal(goal.id)}
                    style={{
                      background: 'transparent', border: 0, cursor: 'pointer',
                      color: 'var(--text-4)', padding: 2, flexShrink: 0,
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <IconTrash size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add goal input */}
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                type="text"
                placeholder="Add a goal..."
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGoal(); } }}
                style={{ ...inputStyle, flex: 1 }}
                onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
                onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
              />
              <button
                type="button"
                onClick={addGoal}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 7, padding: '0 10px',
                  color: 'var(--text-2)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <IconPlus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex', gap: 8, flexShrink: 0,
        }}>
          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const course  = COURSES.find(c => c.id === id);

  const [appState,    setAppState]    = useState<AppState>({});
  const [mounted,     setMounted]     = useState(false);
  const [tab,         setTab]         = useState<Tab>('modules');
  const [notes,       setNotes]       = useState<Record<string, NoteRecord | null>>({});
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [userData,    setUserData]    = useState<CourseUserData | null>(null);

  const refresh = useCallback(() => setAppState(loadState()), []);

  useEffect(() => {
    setMounted(true);
    setAppState(loadState());
  }, []);

  useEffect(() => {
    if (!mounted || !course) return;
    setUserData(loadCourseUserData(course.id));
    const map: Record<string, NoteRecord | null> = {};
    course.weeks.forEach((_, wi) => {
      const moduleId = `${course.id}-w${wi}`;
      try {
        const raw = localStorage.getItem(`note_${moduleId}`);
        map[moduleId] = raw ? JSON.parse(raw) : null;
      } catch { map[moduleId] = null; }
    });
    setNotes(map);
  }, [mounted, course]);

  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 80 }} />
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
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

  const defaultUserData: CourseUserData = {
    courseId:    course.id,
    status:      'not-started',
    priority:    'medium',
    studyGoals:  [],
    updatedAt:   new Date().toISOString(),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Back link */}
      <Link href="/courses" style={{ fontSize: 11, color: '#484848', textDecoration: 'none' }}>
        ← Courses
      </Link>

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>{course.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#484848' }}>
              {course.num} · {platform} · {course.hours}
            </span>
            {userData?.priority && userData.priority !== 'medium' && (
              <span style={{
                fontSize: 9, fontWeight: 600,
                color: PRIORITY_COLORS[userData.priority],
                background: `${PRIORITY_COLORS[userData.priority]}18`,
                border: `1px solid ${PRIORITY_COLORS[userData.priority]}44`,
                borderRadius: 4, padding: '2px 6px',
                textTransform: 'uppercase', letterSpacing: '0.4px',
              }}>
                {PRIORITY_LABELS[userData.priority]}
              </span>
            )}
            {userData?.status && userData.status !== 'not-started' && (
              <span style={{
                fontSize: 9, fontWeight: 500, color: 'var(--text-3)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 4, padding: '2px 6px',
              }}>
                {STATUS_LABELS[userData.status]}
              </span>
            )}
          </div>
          {userData?.description && (
            <span style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic', marginTop: 2 }}>
              {userData.description}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="btn btn-secondary"
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <IconPencil size={13} />
          Edit
        </button>
      </div>

      {/* Study goals summary */}
      {userData && userData.studyGoals.length > 0 && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10, padding: '10px 14px',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Study goals
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {userData.studyGoals.map(goal => (
              <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: 3, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: goal.done ? 'var(--accent-subtle)' : 'transparent',
                  border: goal.done ? '1.5px solid var(--accent-border)' : '1.5px solid rgba(255,255,255,0.15)',
                }}>
                  {goal.done && <IconCheck size={8} color="var(--accent)" strokeWidth={3} />}
                </div>
                <span style={{
                  fontSize: 11, color: goal.done ? 'var(--text-4)' : 'var(--text-2)',
                  textDecoration: goal.done ? 'line-through' : 'none',
                }}>
                  {goal.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
        borderBottom: '1px solid var(--border-default)',
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
                borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                padding: '8px 14px',
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                color: tab === t ? 'var(--text-1)' : '#484848',
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
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                <div className="flex items-center gap-2">
                  <span style={{
                    fontSize: 9, fontWeight: 600, color: '#7AA3F8',
                    background: 'var(--accent-subtle)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: 4, padding: '2px 7px',
                    letterSpacing: '0.4px', textTransform: 'uppercase',
                  }}>
                    {week.label}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-1)', fontWeight: 500 }}>
                    {week.name}
                  </span>
                  {week.dates && (
                    <span style={{ fontSize: 10, color: '#484848', marginLeft: 'auto' }}>
                      {week.dates}
                    </span>
                  )}
                </div>

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
                            background: isDone ? 'var(--accent-subtle)' : 'transparent',
                            border: isDone
                              ? '1.5px solid var(--accent-border)'
                              : '1.5px solid rgba(255,255,255,0.12)',
                            cursor: 'pointer', padding: 0,
                          }}
                        >
                          {isDone && <IconCheck size={9} color="var(--accent)" strokeWidth={3} />}
                        </button>

                        <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 400,
                            color: isDone ? '#333' : 'var(--text-2)',
                            textDecoration: isDone ? 'line-through' : 'none',
                          }}>
                            {item.exam ? '📝 ' : ''}{item.name}
                          </span>
                          {isItemNote && (
                            <span style={{
                              width: 4, height: 4, borderRadius: '50%',
                              background: 'var(--accent)', flexShrink: 0,
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
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
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
              const timeStr   = daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;

              return (
                <Link key={moduleId} href={`/study/${moduleId}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 12, padding: '10px 14px',
                    display: 'flex', flexDirection: 'column', gap: 4,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>{moduleName}</span>
                    <span style={{ fontSize: 11, color: '#484848', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {preview}
                    </span>
                    <span style={{ fontSize: 10, color: '#2E2E2E' }}>edited {timeStr}</span>
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
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12, padding: '24px 14px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#2E2E2E' }}>
            AI study tools coming in a future step.
          </span>
        </div>
      )}

      {/* ── Edit Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <EditDrawer
            courseId={course.id}
            courseTitle={course.title}
            originalDeadline={course.deadlineDate}
            onClose={() => setDrawerOpen(false)}
            onSaved={data => setUserData(data)}
            initial={userData ?? defaultUserData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
