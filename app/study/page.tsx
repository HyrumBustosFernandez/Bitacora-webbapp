'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { loadAllNotes, type NoteRecord } from '@/lib/notes';
import PomodoroTimer from '@/components/study/PomodoroTimer';

function parseModuleId(moduleId: string) {
  const dashW = moduleId.lastIndexOf('-w');
  if (dashW === -1) return null;
  const courseId  = moduleId.slice(0, dashW);
  const weekIndex = parseInt(moduleId.slice(dashW + 2));
  const course    = COURSES.find(c => c.id === courseId);
  if (!course || isNaN(weekIndex)) return null;
  return { course, weekIndex, week: course.weeks[weekIndex] };
}

const CARD: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12, padding: '14px 16px',
  display: 'flex', flexDirection: 'column', gap: 8,
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 600, color: 'var(--text-3)',
  textTransform: 'uppercase', letterSpacing: '0.6px',
};

export default function StudyPage() {
  const [lastModuleId, setLastModuleId] = useState<string | null>(null);
  const [recentNotes,  setRecentNotes]  = useState<NoteRecord[]>([]);
  const [mounted,      setMounted]      = useState(false);
  const [streak,       setStreak]       = useState(0);
  const [streakHistory, setStreakHistory] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    setLastModuleId(localStorage.getItem('last_module'));
    setRecentNotes(loadAllNotes().slice(0, 3));
    setStreak(parseInt(localStorage.getItem('paceup_streak_count') || '0'));

    // Build 7-day history array of date strings for active days
    try {
      const sessions = JSON.parse(localStorage.getItem('paceup_study_sessions') || '[]');
      const days = new Set<string>(sessions.map((s: { date: string }) => s.date?.slice(0, 10)).filter(Boolean));
      setStreakHistory(Array.from(days) as string[]);
    } catch { /* ignore */ }
  }, []);

  const active = lastModuleId ? parseModuleId(lastModuleId) : null;

  // Build 7-day grid
  const sevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const str = d.toISOString().slice(0, 10);
    return { str, label: d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1), active: streakHistory.includes(str) };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Study</span>

      {/* Streak card */}
      {mounted && (
        <div style={CARD}>
          <span style={SECTION_LABEL}>Streak</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: streak >= 2 ? '#F59E0B' : 'var(--text-1)', lineHeight: 1 }}>
                {streak}
              </span>
              <span style={{ fontSize: 10, color: 'var(--text-3)' }}>day streak</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {sevenDays.map(({ str, label, active: isActive }) => (
                <div key={str} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: isActive ? 'var(--accent)' : 'var(--bg-elevated)',
                    border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border-default)'}`,
                  }} />
                  <span style={{ fontSize: 9, color: 'var(--text-4)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Timer */}
      <PomodoroTimer />

      {/* Active module card */}
      <div style={CARD}>
        <span style={SECTION_LABEL}>Active module</span>

        {active ? (
          <>
            <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{active.course.title}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{active.week.name}</span>
            <Link
              href={`/study/${lastModuleId}`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '9px 20px', alignSelf: 'flex-start',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 9, color: 'var(--text-1)',
                fontSize: 12, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Resume →
            </Link>
          </>
        ) : (
          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
            {mounted ? 'No module opened yet. Open a module from the Courses page.' : ''}
          </span>
        )}
      </div>

      {/* Recent notes */}
      <div style={CARD}>
        <span style={SECTION_LABEL}>Recent notes</span>

        {!mounted || recentNotes.length === 0 ? (
          <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
            No notes yet. Open a module to start taking notes.
          </span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {recentNotes.map(note => {
              const preview   = note.content.split('\n').find(l => l.trim()) ?? '';
              const daysAgo   = Math.floor((Date.now() - new Date(note.updatedAt).getTime()) / 86_400_000);
              const timeLabel = daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
              return (
                <Link key={note.moduleId} href={`/study/${note.moduleId}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '8px 10px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    display: 'flex', flexDirection: 'column', gap: 3,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>{note.moduleName}</span>
                    <span style={{
                      fontSize: 10, color: 'var(--text-3)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{preview}</span>
                    <span style={{ fontSize: 9, color: 'var(--text-4)' }}>edited {timeLabel}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
