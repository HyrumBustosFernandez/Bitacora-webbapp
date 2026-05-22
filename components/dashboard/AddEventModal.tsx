'use client';

import { useState } from 'react';
import { COURSES } from '@/lib/courses';
import { saveEvent, type EventType, type CalendarEvent } from '@/lib/events';

interface Props {
  initialDate: string; // YYYY-MM-DD
  onClose: () => void;
  onSaved: () => void;
}

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'study',    label: 'Study' },
  { value: 'exam',     label: 'Exam' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'task',     label: 'Task' },
  { value: 'other',    label: 'Other' },
];

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, padding: '8px 10px',
  color: '#EDE8DC', fontSize: 12,
  outline: 'none',
};

const LABEL: React.CSSProperties = {
  fontSize: 10, fontWeight: 500, color: '#484848', marginBottom: 5, display: 'block',
};

export default function AddEventModal({ initialDate, onClose, onSaved }: Props) {
  const [title,    setTitle]    = useState('');
  const [date,     setDate]     = useState(initialDate);
  const [type,     setType]     = useState<EventType>('study');
  const [courseId, setCourseId] = useState('');
  const [error,    setError]    = useState('');

  function handleSubmit() {
    if (!title.trim()) { setError('Title is required.'); return; }
    const event: CalendarEvent = {
      id:       `evt_${Date.now()}`,
      title:    title.trim(),
      date,
      type,
      courseId: courseId || undefined,
    };
    saveEvent(event);
    onSaved();
    onClose();
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 14,
          padding: 20,
          width: 320,
          display: 'flex', flexDirection: 'column', gap: 14,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: '#EDE8DC' }}>Add event</span>

        {/* Title */}
        <div>
          <label style={LABEL}>Title</label>
          <input
            autoFocus
            type="text"
            placeholder="Event title"
            value={title}
            onChange={e => { setTitle(e.target.value); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') onClose(); }}
            style={INPUT}
          />
          {error && <span style={{ fontSize: 10, color: 'rgba(252,165,165,0.85)', marginTop: 4, display: 'block' }}>{error}</span>}
        </div>

        {/* Date */}
        <div>
          <label style={LABEL}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ ...INPUT, colorScheme: 'dark' }}
          />
        </div>

        {/* Type */}
        <div>
          <label style={LABEL}>Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as EventType)}
            style={{ ...INPUT, cursor: 'pointer' }}
          >
            {EVENT_TYPES.map(t => (
              <option key={t.value} value={t.value} style={{ background: '#141414' }}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Course (optional) */}
        <div>
          <label style={LABEL}>Course (optional)</label>
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            style={{ ...INPUT, cursor: 'pointer' }}
          >
            <option value="" style={{ background: '#141414' }}>None</option>
            {COURSES.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#141414' }}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              flex: 1, padding: '9px 0',
              background: '#4875F0', border: 0,
              borderRadius: 9, color: '#EDE8DC',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Add event
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1, padding: '9px 0',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 9, color: '#484848',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
