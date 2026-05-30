'use client';

import { useState, useRef, useEffect } from 'react';
import { IconX } from '@tabler/icons-react';
import {
  CalendarEvent, EventType, EventGroup,
  EVENT_TYPE_LABELS, COLOR_PRESETS, saveEvent, generateId,
  Task, TaskPriority, TaskStatus, PRIORITY_LABELS, STATUS_LABELS, saveTask,
} from '@/lib/events';

interface Props {
  initialDate?: string;
  initialMode?: 'event' | 'task';
  onClose: () => void;
  onSaved: () => void;
}

type CreationMode = 'event' | 'task';

const EVENT_TYPES: EventType[] = ['study', 'exam', 'deadline', 'homework', 'meeting', 'personal', 'other'];
const GROUPS: EventGroup[] = ['school', 'personal', 'work'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['todo', 'inprogress', 'done'];

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
  transition: 'border-color 130ms ease, box-shadow 130ms ease',
};

const FIELD_LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
};

function onFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--border-focus)';
  e.target.style.boxShadow = '0 0 0 3px rgba(91,91,214,0.12)';
}
function onBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--border-default)';
  e.target.style.boxShadow = '';
}

export default function CreateEventModal({ initialDate, initialMode = 'event', onClose, onSaved }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [mode, setMode] = useState<CreationMode>(initialMode);

  /* Event fields */
  const [title,       setTitle]       = useState('');
  const [date,        setDate]        = useState(initialDate ?? today);
  const [time,        setTime]        = useState('');
  const [endTime,     setEndTime]     = useState('');
  const [type,        setType]        = useState<EventType>('study');
  const [group,       setGroup]       = useState<EventGroup>('school');
  const [location,    setLocation]    = useState('');
  const [description, setDescription] = useState('');
  const [color,       setColor]       = useState(COLOR_PRESETS[0]);

  /* Task fields */
  const [taskName,    setTaskName]    = useState('');
  const [taskDate,    setTaskDate]    = useState(initialDate ?? today);
  const [priority,    setPriority]    = useState<TaskPriority>('medium');
  const [status,      setStatus]      = useState<TaskStatus>('todo');
  const [taskDesc,    setTaskDesc]    = useState('');
  const [taskList,    setTaskList]    = useState('');

  const [error, setError] = useState('');

  /* Arc indicator refs */
  const tabGroupRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const group = tabGroupRef.current;
    const indicator = indicatorRef.current;
    if (!group || !indicator) return;
    const active = group.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    indicator.style.left  = `${active.offsetLeft}px`;
    indicator.style.width = `${active.offsetWidth}px`;
  }, [mode]);

  function handleSubmitEvent(e: React.FormEvent) {
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

  function handleSubmitTask(e: React.FormEvent) {
    e.preventDefault();
    if (!taskName.trim()) { setError('Task name is required'); return; }
    if (!taskDate)         { setError('Due date is required'); return; }
    const task: Task = {
      id: generateId(),
      name: taskName.trim(),
      dueDate: taskDate,
      priority,
      status,
      createdAt: new Date().toISOString(),
      ...(taskDesc.trim() && { description: taskDesc.trim() }),
      ...(taskList.trim() && { list: taskList.trim() }),
    };
    saveTask(task);
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
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 16,
          width: '100%', maxWidth: 480,
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 0' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
            {initialDate
              ? `New for ${new Date(initialDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
              : 'Create'}
          </span>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" style={{ color: 'var(--text-3)' }}>
            <IconX size={15} />
          </button>
        </div>

        {/* Arc tab toggle — Event | Task */}
        <div
          ref={tabGroupRef}
          style={{
            display: 'flex', padding: '10px 20px 0',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          {(['event', 'task'] as CreationMode[]).map(m => (
            <button
              key={m}
              type="button"
              data-active={mode === m ? 'true' : 'false'}
              onClick={() => { setMode(m); setError(''); }}
              style={{
                background: 'transparent', border: 'none',
                padding: '6px 16px 10px',
                fontSize: 12, fontWeight: mode === m ? 600 : 400,
                color: mode === m ? 'var(--text-1)' : 'var(--text-3)',
                cursor: 'pointer',
                transition: 'color 200ms ease',
              }}
            >
              {m === 'event' ? 'Event' : 'Task'}
            </button>
          ))}
          {/* Sliding arc indicator */}
          <div
            ref={indicatorRef}
            style={{
              position: 'absolute', bottom: 0, height: 3,
              background: 'linear-gradient(90deg, transparent, var(--accent) 20%, #7474E0 50%, var(--accent) 80%, transparent)',
              borderRadius: '3px 3px 0 0',
              clipPath: 'ellipse(50% 100% at 50% 100%)',
              boxShadow: '0 0 8px rgba(91,91,214,0.5)',
              transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Form body */}
        <div style={{ padding: '16px 20px 20px' }}>
          {mode === 'event' ? (
            <form onSubmit={handleSubmitEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Event name *</span>
                <input autoFocus type="text" placeholder="e.g. Study session, CCST Exam…"
                  value={title} onChange={e => setTitle(e.target.value)}
                  style={INPUT} onFocus={onFocus} onBlur={onBlur} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Type *</span>
                  <select value={type}
                    onChange={e => {
                      setType(e.target.value as EventType);
                      setColor(COLOR_PRESETS[EVENT_TYPES.indexOf(e.target.value as EventType)] ?? COLOR_PRESETS[0]);
                    }}
                    style={{ ...INPUT }} onFocus={onFocus} onBlur={onBlur}>
                    {EVENT_TYPES.map(t => <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Color</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 7 }}>
                    {COLOR_PRESETS.map(c => (
                      <button key={c} type="button" onClick={() => setColor(c)} style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: c, border: 0, cursor: 'pointer', flexShrink: 0,
                        outline: color === c ? '2px solid var(--text-1)' : '2px solid transparent',
                        outlineOffset: 2,
                        transform: color === c ? 'scale(1.15)' : 'scale(1)',
                        transition: 'outline 120ms ease, transform 120ms ease',
                      }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Date *</span>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)}
                    style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Start time</span>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)}
                    style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>End time</span>
                  <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                    style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Group</span>
                  <select value={group} onChange={e => setGroup(e.target.value as EventGroup)}
                    style={{ ...INPUT }} onFocus={onFocus} onBlur={onBlur}>
                    {GROUPS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Location</span>
                <input type="text" placeholder="Room, URL, or address…"
                  value={location} onChange={e => setLocation(e.target.value)}
                  style={INPUT} onFocus={onFocus} onBlur={onBlur} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Description</span>
                <textarea placeholder="Optional notes…" value={description}
                  onChange={e => setDescription(e.target.value)} rows={2}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>

              {error && <span style={{ fontSize: 11, color: 'var(--color-red)', fontWeight: 500 }}>{error}</span>}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>+ Create Event</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitTask} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Task name *</span>
                <input autoFocus type="text" placeholder="e.g. Review subnetting, Read chapter 4…"
                  value={taskName} onChange={e => setTaskName(e.target.value)}
                  style={INPUT} onFocus={onFocus} onBlur={onBlur} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Due date *</span>
                  <input type="date" value={taskDate} onChange={e => setTaskDate(e.target.value)}
                    style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Priority</span>
                  <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}
                    style={{ ...INPUT }} onFocus={onFocus} onBlur={onBlur}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Status</span>
                  <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
                    style={{ ...INPUT }} onFocus={onFocus} onBlur={onBlur}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>List</span>
                  <input type="text" placeholder="e.g. CCST Prep, Personal…"
                    value={taskList} onChange={e => setTaskList(e.target.value)}
                    style={INPUT} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Description</span>
                <textarea placeholder="Optional notes…" value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)} rows={2}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={onFocus} onBlur={onBlur} />
              </div>

              {error && <span style={{ fontSize: 11, color: 'var(--color-red)', fontWeight: 500 }}>{error}</span>}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>+ Create Task</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
