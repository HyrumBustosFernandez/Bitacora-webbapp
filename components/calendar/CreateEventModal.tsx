'use client';

import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import {
  CalendarEvent, EventType, EventGroup,
  EVENT_TYPE_LABELS, COLOR_PRESETS, saveEvent, generateId,
} from '@/lib/events';

interface Props {
  initialDate?: string;
  onClose: () => void;
  onSaved: () => void;
}

const EVENT_TYPES: EventType[] = ['study', 'exam', 'deadline', 'homework', 'meeting', 'personal', 'other'];
const GROUPS: EventGroup[] = ['school', 'personal', 'work'];

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
  padding: '8px 10px',
  color: 'var(--text-1)',
  fontSize: 12,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 130ms ease',
};

const FIELD_LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
};

export default function CreateEventModal({ initialDate, onClose, onSaved }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [title,       setTitle]       = useState('');
  const [date,        setDate]        = useState(initialDate ?? today);
  const [time,        setTime]        = useState('');
  const [endTime,     setEndTime]     = useState('');
  const [type,        setType]        = useState<EventType>('study');
  const [group,       setGroup]       = useState<EventGroup>('school');
  const [description, setDescription] = useState('');
  const [color,       setColor]       = useState(COLOR_PRESETS[0]);
  const [error,       setError]       = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Event name is required'); return; }
    if (!date)          { setError('Date is required'); return; }
    const event: CalendarEvent = {
      id: generateId(), title: title.trim(), date, type, group, color,
      ...(time        && { time }),
      ...(endTime     && { endTime }),
      ...(description.trim() && { description: description.trim() }),
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
        background: 'var(--overlay)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 16, padding: 24,
          width: '100%', maxWidth: 480,
          display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: 'var(--shadow-modal)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>Create Event</span>
          <button
            type="button" onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ color: 'var(--text-3)' }}
          >
            <IconX size={15} />
          </button>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={FIELD_LABEL}>Event name *</span>
          <input
            autoFocus type="text"
            placeholder="e.g. Study session, CCST Exam…"
            value={title} onChange={e => setTitle(e.target.value)}
            style={INPUT}
            onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
          />
        </div>

        {/* Type + Color */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={FIELD_LABEL}>Type *</span>
            <select
              value={type}
              onChange={e => {
                setType(e.target.value as EventType);
                setColor(COLOR_PRESETS[EVENT_TYPES.indexOf(e.target.value as EventType)] ?? COLOR_PRESETS[0]);
              }}
              style={{ ...INPUT }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            >
              {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={FIELD_LABEL}>Color</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 7 }}>
              {COLOR_PRESETS.map(c => (
                <button
                  key={c} type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: c, border: 0, cursor: 'pointer', flexShrink: 0,
                    outline: color === c ? `2px solid var(--text-1)` : '2px solid transparent',
                    outlineOffset: 2,
                    transition: 'outline 120ms ease, transform 120ms ease',
                    transform: color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Date + Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={FIELD_LABEL}>Date *</span>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={INPUT}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={FIELD_LABEL}>Time</span>
            <input type="time" value={time} onChange={e => setTime(e.target.value)} style={INPUT}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            />
          </div>
        </div>

        {/* End time + Group */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={FIELD_LABEL}>End time</span>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={INPUT}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={FIELD_LABEL}>Group</span>
            <select value={group} onChange={e => setGroup(e.target.value as EventGroup)} style={{ ...INPUT }}
              onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
              onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
            >
              {GROUPS.map(g => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={FIELD_LABEL}>Description</span>
          <textarea
            placeholder="Optional notes…"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
          />
        </div>

        {error && (
          <span style={{ fontSize: 11, color: 'var(--color-red)', fontWeight: 500 }}>{error}</span>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
            + Create Event
          </button>
        </div>
      </form>
    </div>
  );
}
