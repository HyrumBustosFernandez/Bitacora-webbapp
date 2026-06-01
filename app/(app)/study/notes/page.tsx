'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { IconSearch, IconSortAscending } from '@tabler/icons-react';
import { loadAllNotes, type NoteRecord } from '@/lib/notes';

type SortKey = 'date' | 'course' | 'module';

function timeLabel(iso: string): string {
  const daysAgo = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (daysAgo === 0) return 'today';
  if (daysAgo === 1) return '1 day ago';
  return `${daysAgo} days ago`;
}

export default function StudyNotesPage() {
  const [notes,   setNotes]   = useState<NoteRecord[]>([]);
  const [query,   setQuery]   = useState('');
  const [sort,    setSort]    = useState<SortKey>('date');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNotes(loadAllNotes());
  }, []);

  const filtered = useMemo(() => {
    let list = notes;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(n =>
        n.content.toLowerCase().includes(q) ||
        n.moduleName.toLowerCase().includes(q) ||
        n.courseName.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      if (sort === 'date')   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sort === 'course') return a.courseName.localeCompare(b.courseName);
      return a.moduleName.localeCompare(b.moduleName);
    });
  }, [notes, query, sort]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/study" style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'none' }}>
          ← Study
        </Link>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Notes</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          All notes across all modules
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Search */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '0 10px', height: 34,
        }}>
          <IconSearch size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 0, outline: 'none',
              color: 'var(--text-1)', fontSize: 12, fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Sort */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '0 10px', height: 34,
        }}>
          <IconSortAscending size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortKey)}
            style={{
              background: 'transparent', border: 0, outline: 'none',
              color: 'var(--text-1)', fontSize: 12, fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            <option value="date">Date</option>
            <option value="course">Course</option>
            <option value="module">Module</option>
          </select>
        </div>
      </div>

      {/* Notes list */}
      {!mounted ? null : filtered.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 12, padding: '32px 16px',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
            {query ? 'No notes match your search.' : 'No notes yet. Open a module to start taking notes.'}
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(note => {
            const preview = note.content.split('\n').find(l => l.trim()) ?? '';
            return (
              <Link
                key={note.moduleId}
                href={`/study/${note.moduleId}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10, padding: '10px 14px',
                  display: 'flex', flexDirection: 'column', gap: 3,
                  transition: 'border-color 150ms ease, background 150ms ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-focus)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>
                      {note.moduleName}
                    </span>
                    <span style={{ fontSize: 9, color: 'var(--text-4)', flexShrink: 0 }}>
                      edited {timeLabel(note.updatedAt)}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
                    {note.courseName}
                  </span>
                  <span style={{
                    fontSize: 11, color: 'var(--text-3)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {preview}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
