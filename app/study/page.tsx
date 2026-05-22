'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { COURSES } from '@/lib/courses';
import { loadAllNotes, type NoteRecord } from '@/lib/notes';

function parseModuleId(moduleId: string) {
  const dashW = moduleId.lastIndexOf('-w');
  if (dashW === -1) return null;
  const courseId  = moduleId.slice(0, dashW);
  const weekIndex = parseInt(moduleId.slice(dashW + 2));
  const course    = COURSES.find(c => c.id === courseId);
  if (!course || isNaN(weekIndex)) return null;
  return { course, weekIndex, week: course.weeks[weekIndex] };
}

export default function StudyPage() {
  const [lastModuleId, setLastModuleId] = useState<string | null>(null);
  const [recentNotes,  setRecentNotes]  = useState<NoteRecord[]>([]);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastModuleId(localStorage.getItem('last_module'));
    setRecentNotes(loadAllNotes().slice(0, 3));
  }, []);

  const active = lastModuleId ? parseModuleId(lastModuleId) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <span style={{ fontSize: 18, fontWeight: 600, color: '#EDE8DC' }}>Study</span>

      {/* Active module card */}
      <div style={{
        background: '#0E0E0E',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: '#484848', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Active module
        </span>

        {active ? (
          <>
            <span style={{ fontSize: 10, color: '#484848' }}>{active.course.title}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#EDE8DC' }}>{active.week.name}</span>
            <Link
              href={`/study/${lastModuleId}`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '9px 20px', alignSelf: 'flex-start',
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 9, color: '#EDE8DC',
                fontSize: 12, fontWeight: 600, textDecoration: 'none',
              }}
            >
              Resume →
            </Link>
          </>
        ) : (
          <span style={{ fontSize: 11, color: '#2E2E2E' }}>
            {mounted ? 'No module opened yet. Open a module from the Courses page.' : ''}
          </span>
        )}
      </div>

      {/* Recent notes */}
      <div style={{
        background: '#0E0E0E',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <span style={{ fontSize: 9, fontWeight: 600, color: '#484848', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Recent notes
        </span>

        {!mounted || recentNotes.length === 0 ? (
          <span style={{ fontSize: 11, color: '#2E2E2E' }}>
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
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8,
                    display: 'flex', flexDirection: 'column', gap: 3,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: '#A8A29A' }}>{note.moduleName}</span>
                    <span style={{
                      fontSize: 10, color: '#484848',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{preview}</span>
                    <span style={{ fontSize: 9, color: '#2E2E2E' }}>edited {timeLabel}</span>
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
