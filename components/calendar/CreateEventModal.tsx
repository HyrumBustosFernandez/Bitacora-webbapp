'use client';

import { useState, useRef, useEffect } from 'react';
import { IconX, IconCalendar, IconClock } from '@tabler/icons-react';
import {
  CalendarEvent, EventGroup,
  COLOR_PRESETS, saveEvent, generateId,
  Task, TaskPriority, TaskStatus, PRIORITY_LABELS, STATUS_LABELS, saveTask,
} from '@/lib/events';

interface Props {
  initialDate?: string;
  initialMode?: 'event' | 'task';
  editEvent?: CalendarEvent;
  onClose: () => void;
  onSaved: () => void;
}

type CreationMode = 'event' | 'task';

const GROUPS: EventGroup[] = ['school', 'personal', 'work'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const STATUSES: TaskStatus[] = ['todo', 'inprogress', 'done'];

const INPUT: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
  padding: '9px 12px',
  color: 'var(--text-1)',
  fontSize: 13,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 130ms ease, box-shadow 130ms ease',
  boxSizing: 'border-box',
};

const SELECT: React.CSSProperties = {
  ...INPUT,
  paddingRight: '36px',
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'calc(100% - 10px) center',
};

const FIELD_LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 600,
  color: 'var(--text-3)',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
};

/* Styled date/time input with icon prefix */
function DateInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={FIELD_LABEL}>{label}</span>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        background: 'var(--bg-input)',
        border: `1px solid ${focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        borderRadius: 8,
        boxShadow: focused ? '0 0 0 3px rgba(91,91,214,0.12)' : 'none',
        transition: 'border-color 130ms ease, box-shadow 130ms ease',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '0 10px', display: 'flex', alignItems: 'center',
          borderRight: '1px solid var(--border-subtle)',
          height: 38, flexShrink: 0, color: 'var(--text-4)',
        }}>
          <IconCalendar size={13} />
        </div>
        <input
          type="date" value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            padding: '9px 12px', color: 'var(--text-1)', fontSize: 13,
            fontFamily: 'inherit', colorScheme: 'dark',
          }}
        />
      </div>
    </div>
  );
}

function TimeInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={FIELD_LABEL}>{label}</span>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'var(--bg-input)',
        border: `1px solid ${focused ? 'var(--border-focus)' : 'var(--border-default)'}`,
        borderRadius: 8,
        boxShadow: focused ? '0 0 0 3px rgba(91,91,214,0.12)' : 'none',
        transition: 'border-color 130ms ease, box-shadow 130ms ease',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '0 10px', display: 'flex', alignItems: 'center',
          borderRight: '1px solid var(--border-subtle)',
          height: 38, flexShrink: 0, color: 'var(--text-4)',
        }}>
          <IconClock size={13} />
        </div>
        <input
          type="time" value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            padding: '9px 12px', color: 'var(--text-1)', fontSize: 13,
            fontFamily: 'inherit', colorScheme: 'dark',
          }}
        />
      </div>
    </div>
  );
}

function onFocusEl(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--border-focus)';
  e.target.style.boxShadow   = '0 0 0 3px rgba(91,91,214,0.12)';
}
function onBlurEl(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = 'var(--border-default)';
  e.target.style.boxShadow   = '';
}

export default function CreateEventModal({
  initialDate, initialMode = 'event', editEvent, onClose, onSaved,
}: Props) {
  const today  = new Date().toISOString().split('T')[0];
  const isEdit = !!editEvent;
  const [mode, setMode] = useState<CreationMode>(editEvent ? 'event' : initialMode);

  /* Event fields */
  const [title,       setTitle]       = useState(editEvent?.title       ?? '');
  const [date,        setDate]        = useState(editEvent?.date        ?? (initialDate ?? today));
  const [time,        setTime]        = useState(editEvent?.time        ?? '');
  const [endTime,     setEndTime]     = useState(editEvent?.endTime     ?? '');
  const [group,       setGroup]       = useState<EventGroup>(editEvent?.group ?? 'school');
  const [location,    setLocation]    = useState('');
  const [description, setDescription] = useState(editEvent?.description ?? '');
  const [color,       setColor]       = useState(editEvent?.color       ?? COLOR_PRESETS[0]);
  const [customGroup, setCustomGroup] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);

  /* Task fields */
  const [taskName, setTaskName] = useState('');
  const [taskDate, setTaskDate] = useState(initialDate ?? today);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status,   setStatus]   = useState<TaskStatus>('todo');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskList, setTaskList] = useState('');

  const [error, setError] = useState('');

  /* Arc indicator refs */
  const tabGroupRef  = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  /* ESC to close */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  /* Position arc indicator */
  useEffect(() => {
    const group    = tabGroupRef.current;
    const indicator = indicatorRef.current;
    if (!group || !indicator) return;
    const active = group.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    indicator.style.left    = `${active.offsetLeft}px`;
    indicator.style.width   = `${active.offsetWidth}px`;
    indicator.style.opacity = '1';
  }, [mode]);

  function handleSubmitEvent(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError('Event name is required'); return; }
    if (!date)          { setError('Date is required'); return; }
    const finalGroup = showNewGroup && customGroup.trim() ? customGroup.trim() : group;
    const event: CalendarEvent = {
      id: editEvent?.id ?? generateId(),
      title: title.trim(), date, group: finalGroup, color,
      type: editEvent?.type ?? 'study',
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
      name: taskName.trim(), dueDate: taskDate, priority, status,
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
      className="modal-backdrop"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.60)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="modal-panel"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-strong)',
          borderRadius: 18,
          width: '100%', maxWidth: 480,
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 0' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>
            {isEdit
              ? 'Edit Event'
              : initialDate
                ? `New for ${new Date(initialDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                : 'Create'}
          </span>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-icon" style={{ color: 'var(--text-3)' }}>
            <IconX size={15} />
          </button>
        </div>

        {/* Arc tab toggle — Event | Task (hidden when editing) */}
        {!isEdit && (
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
                key={m} type="button"
                data-active={mode === m ? 'true' : 'false'}
                onClick={() => { setMode(m); setError(''); }}
                style={{
                  background: 'transparent', border: 'none',
                  padding: '6px 16px 10px',
                  fontSize: 12, fontWeight: mode === m ? 600 : 400,
                  color: mode === m ? 'var(--text-1)' : 'var(--text-3)',
                  cursor: 'pointer', transition: 'color 200ms ease',
                }}
              >
                {m === 'event' ? 'Event' : 'Task'}
              </button>
            ))}
            <div
              ref={indicatorRef}
              style={{
                position: 'absolute', bottom: 0, height: 3,
                width: 0, left: 0, opacity: 0,
                background: 'linear-gradient(90deg, transparent, var(--accent) 20%, #7474E0 50%, var(--accent) 80%, transparent)',
                borderRadius: '3px 3px 0 0',
                clipPath: 'ellipse(50% 100% at 50% 100%)',
                boxShadow: '0 0 8px rgba(91,91,214,0.5)',
                transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1), opacity 150ms ease',
                pointerEvents: 'none',
              }}
            />
          </div>
        )}

        {/* Form body */}
        <div style={{ padding: '16px 20px 20px', overflowY: 'auto', maxHeight: '70vh' }}>
          {(mode === 'event' || isEdit) ? (
            <form onSubmit={handleSubmitEvent} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Event name *</span>
                <input autoFocus type="text" placeholder="e.g. Study session, CCST Exam…"
                  value={title} onChange={e => setTitle(e.target.value)}
                  style={INPUT} onFocus={onFocusEl} onBlur={onBlurEl} />
              </div>

              {/* Color */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={FIELD_LABEL}>Color</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  {COLOR_PRESETS.map(c => (
                    <button key={c} type="button" onClick={() => setColor(c)} title={c} style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: c, border: 0, cursor: 'pointer', flexShrink: 0,
                      outline: color === c ? `3px solid ${c}` : '3px solid transparent',
                      outlineOffset: 2,
                      transform: color === c ? 'scale(1.2)' : 'scale(1)',
                      transition: 'outline 120ms ease, transform 120ms ease, box-shadow 120ms ease',
                      boxShadow: color === c ? `0 0 8px ${c}60` : 'none',
                    }} />
                  ))}
                </div>
              </div>

              {/* Date row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <DateInput label="Date *" value={date} onChange={setDate} />
                <TimeInput label="Start time" value={time} onChange={setTime} />
              </div>

              {/* End time + Group */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <TimeInput label="End time" value={endTime} onChange={setEndTime} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Group</span>
                  {showNewGroup ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        autoFocus type="text" placeholder="Group name…"
                        value={customGroup} onChange={e => setCustomGroup(e.target.value)}
                        style={{ ...INPUT, flex: 1 }} onFocus={onFocusEl} onBlur={onBlurEl}
                      />
                      <button type="button" onClick={() => setShowNewGroup(false)}
                        style={{
                          padding: '0 10px', background: 'var(--bg-input)',
                          border: '1px solid var(--border-default)', borderRadius: 8,
                          color: 'var(--text-3)', cursor: 'pointer', fontSize: 12,
                        }}>✕</button>
                    </div>
                  ) : (
                    <select
                      value={group}
                      onChange={e => {
                        if (e.target.value === '__new__') { setShowNewGroup(true); }
                        else setGroup(e.target.value as EventGroup);
                      }}
                      style={SELECT} onFocus={onFocusEl} onBlur={onBlurEl}
                    >
                      {GROUPS.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                      <option disabled>──────────</option>
                      <option value="__new__">+ Create new group</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Location</span>
                <input type="text" placeholder="Room, URL, or address…"
                  value={location} onChange={e => setLocation(e.target.value)}
                  style={INPUT} onFocus={onFocusEl} onBlur={onBlurEl} />
              </div>

              {/* Notes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Notes</span>
                <textarea placeholder="Optional notes…" value={description}
                  onChange={e => setDescription(e.target.value)} rows={2}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={onFocusEl} onBlur={onBlurEl} />
              </div>

              {error && <span style={{ fontSize: 11, color: 'var(--color-red)', fontWeight: 500 }}>{error}</span>}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                  {isEdit ? 'Save Changes' : '+ Create Event'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmitTask} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Task name *</span>
                <input autoFocus type="text" placeholder="e.g. Review subnetting, Read chapter 4…"
                  value={taskName} onChange={e => setTaskName(e.target.value)}
                  style={INPUT} onFocus={onFocusEl} onBlur={onBlurEl} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <DateInput label="Due date *" value={taskDate} onChange={setTaskDate} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Priority</span>
                  <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}
                    style={SELECT} onFocus={onFocusEl} onBlur={onBlurEl}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>Status</span>
                  <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
                    style={SELECT} onFocus={onFocusEl} onBlur={onBlurEl}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={FIELD_LABEL}>List</span>
                  <input type="text" placeholder="e.g. CCST Prep…"
                    value={taskList} onChange={e => setTaskList(e.target.value)}
                    style={INPUT} onFocus={onFocusEl} onBlur={onBlurEl} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={FIELD_LABEL}>Notes</span>
                <textarea placeholder="Optional notes…" value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)} rows={2}
                  style={{ ...INPUT, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={onFocusEl} onBlur={onBlurEl} />
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
