'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { COURSES } from '@/lib/courses';
import {
  loadState, getItemState, toggleItemDone, type AppState,
} from '@/lib/storage';
import { loadNote, saveNote, renderMarkdown } from '@/lib/notes';
import PomodoroTimer from '@/components/study/PomodoroTimer';

type Tab = 'notes' | 'tools';

export default function StudyModePage() {
  const { moduleId } = useParams<{ moduleId: string }>();

  const dashW     = moduleId?.lastIndexOf('-w') ?? -1;
  const courseId  = dashW >= 0 ? moduleId.slice(0, dashW) : '';
  const weekIndex = dashW >= 0 ? parseInt(moduleId.slice(dashW + 2)) : NaN;
  const course    = COURSES.find(c => c.id === courseId);
  const week      = course?.weeks[weekIndex];

  const [appState,  setAppState]  = useState<AppState>({});
  const [tab,       setTab]       = useState<Tab>('notes');
  const [content,   setContent]   = useState('');
  const [preview,   setPreview]   = useState(false);
  const [mounted,   setMounted]   = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(() => setAppState(loadState()), []);

  useEffect(() => {
    if (!course || !week || isNaN(weekIndex)) return;
    setMounted(true);
    setAppState(loadState());

    // Track last-accessed module
    localStorage.setItem('last_module', moduleId);

    // Load saved note
    const note = loadNote(moduleId);
    setContent(note?.content ?? '');
  }, [moduleId, course, week, weekIndex]);

  function handleContentChange(val: string) {
    setContent(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!course || !week) return;
      saveNote({
        content:    val,
        updatedAt:  new Date().toISOString(),
        moduleId,
        courseName: course.title,
        moduleName: week.name,
      });
    }, 500);
  }

  function handleMarkComplete() {
    if (!course || isNaN(weekIndex)) return;
    course.weeks[weekIndex].items.forEach((_, ii) => {
      if (getItemState(course, weekIndex, ii, loadState()) !== 'done') {
        toggleItemDone(course, weekIndex, ii);
      }
    });
    refresh();
  }

  if (!course || !week || isNaN(weekIndex)) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/study" style={{ fontSize: 11, color: '#484848', textDecoration: 'none' }}>← Back</Link>
        <span style={{ fontSize: 14, color: '#484848' }}>Module not found.</span>
      </div>
    );
  }

  const allDone = week.items.every((_, ii) => getItemState(course, weekIndex, ii, appState) === 'done');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 100 }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/study" style={{ fontSize: 11, color: '#484848', textDecoration: 'none' }}>← Back</Link>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#EDE8DC' }}>{week.name}</span>
          <span style={{ fontSize: 11, color: '#484848' }}>{course.title}</span>
        </div>

        <button
          type="button"
          onClick={handleMarkComplete}
          disabled={allDone}
          style={{
            flexShrink: 0,
            padding: '7px 14px',
            background: allDone ? 'rgba(34,197,94,0.08)' : 'transparent',
            border: `1px solid ${allDone ? 'rgba(34,197,94,0.3)' : 'rgba(34,197,94,0.3)'}`,
            borderRadius: 8,
            color: allDone ? 'rgba(110,231,183,0.6)' : 'rgba(110,231,183,0.8)',
            fontSize: 11, fontWeight: 500, cursor: allDone ? 'default' : 'pointer',
          }}
        >
          {allDone ? '✓ Complete' : 'Mark as complete'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {(['notes', 'tools'] as Tab[]).map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            style={{
              background: 'transparent', border: 0,
              borderBottom: tab === t ? '2px solid #4875F0' : '2px solid transparent',
              padding: '8px 14px', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', color: tab === t ? '#EDE8DC' : '#484848',
              marginBottom: -1, textTransform: 'capitalize',
            }}
          >
            {t === 'tools' ? 'AI Tools' : 'Notes'}
          </button>
        ))}
      </div>

      {/* Notes tab */}
      {tab === 'notes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 10, color: '#484848' }}>
              {content ? 'Auto-saved' : 'Start typing to create a note'}
            </span>
            <button
              type="button"
              onClick={() => setPreview(p => !p)}
              style={{
                background: preview ? 'rgba(72,117,240,0.1)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${preview ? 'rgba(72,117,240,0.25)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 6, padding: '4px 10px',
                color: preview ? '#4875F0' : '#484848',
                fontSize: 10, fontWeight: 500, cursor: 'pointer',
              }}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>

          {preview ? (
            <div
              style={{
                background: '#0E0E0E',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: 14,
                minHeight: 200, lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || '<span style="color:#2E2E2E;font-size:12px">Nothing to preview</span>' }}
            />
          ) : (
            <textarea
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              placeholder="Write your notes for this module..."
              style={{
                background: '#0E0E0E',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#EDE8DC', fontFamily: 'inherit',
                fontSize: 12, borderRadius: 10,
                padding: 14, minHeight: 200,
                resize: 'vertical', outline: 'none',
                lineHeight: 1.6, width: '100%', boxSizing: 'border-box',
              }}
            />
          )}
        </div>
      )}

      {/* AI Tools tab */}
      {tab === 'tools' && (
        <div style={{
          background: '#0E0E0E',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: '24px 16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#2E2E2E' }}>
            AI study tools coming in a future step.
          </span>
        </div>
      )}

      {/* Floating Pomodoro timer */}
      {mounted && <PomodoroTimer moduleId={moduleId} />}
    </div>
  );
}
