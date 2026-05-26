'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  IconChevronLeft, IconChevronRight, IconPlus,
} from '@tabler/icons-react';
import { CalendarEvent, loadEvents, deleteEvent, EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '@/lib/events';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import CreateEventModal from '@/components/calendar/CreateEventModal';

type ViewMode = 'month' | 'week' | 'day';
type TabMode  = 'events' | 'types' | 'reminders' | 'groups';

function twoDigit(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(d: Date)   { return `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`; }

function getWeekStart(d: Date): Date {
  const day = new Date(d);
  const dow = day.getDay(); // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow; // shift to Monday
  day.setDate(day.getDate() + diff);
  day.setHours(0, 0, 0, 0);
  return day;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarPage() {
  const [view,         setView]         = useState<ViewMode>('month');
  const [tab,          setTab]          = useState<TabMode>('events');
  const [current,      setCurrent]      = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events,       setEvents]       = useState<CalendarEvent[]>([]);
  const [showModal,    setShowModal]    = useState(false);
  const [modalDate,    setModalDate]    = useState<string | undefined>();
  const [modalTime,    setModalTime]    = useState<string | undefined>();
  const [detailEvent,  setDetailEvent]  = useState<CalendarEvent | null>(null);

  const refresh = useCallback(() => setEvents(loadEvents()), []);
  useEffect(() => { refresh(); }, [refresh]);

  const year  = current.getFullYear();
  const month = current.getMonth();

  function navPrev() {
    if (view === 'month') {
      setCurrent(new Date(year, month - 1, 1));
    } else if (view === 'week') {
      const ws = getWeekStart(current);
      ws.setDate(ws.getDate() - 7);
      setCurrent(new Date(ws));
    } else {
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      setCurrent(d);
    }
  }

  function navNext() {
    if (view === 'month') {
      setCurrent(new Date(year, month + 1, 1));
    } else if (view === 'week') {
      const ws = getWeekStart(current);
      ws.setDate(ws.getDate() + 7);
      setCurrent(new Date(ws));
    } else {
      const d = new Date(current);
      d.setDate(d.getDate() + 1);
      setCurrent(d);
    }
  }

  function navToday() {
    setCurrent(new Date());
  }

  function headerLabel() {
    if (view === 'month') return `${MONTHS[month]} ${year}`;
    if (view === 'week') {
      const ws = getWeekStart(current);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      if (ws.getMonth() === we.getMonth())
        return `${MONTHS[ws.getMonth()]} ${ws.getFullYear()}`;
      return `${MONTHS[ws.getMonth()].slice(0,3)} – ${MONTHS[we.getMonth()].slice(0,3)} ${we.getFullYear()}`;
    }
    return current.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  function handleDayClick(dateStr: string) {
    setSelectedDate(dateStr);
    const d = new Date(dateStr + 'T00:00:00');
    setCurrent(d);
    setView('day');
  }

  function handleSlotClick(dateStr: string, time: string) {
    setModalDate(dateStr);
    setModalTime(time);
    setShowModal(true);
  }

  function handleAddEvent() {
    setModalDate(view === 'day' ? toDateStr(current) : undefined);
    setModalTime(undefined);
    setShowModal(true);
  }

  const btnBase: React.CSSProperties = {
    background: 'transparent', border: '1px solid var(--border-default)',
    borderRadius: 7, padding: '4px 10px', fontSize: 11, fontWeight: 500,
    color: 'var(--text-2)', cursor: 'pointer', transition: 'all 120ms ease',
    whiteSpace: 'nowrap',
  };
  const btnActive: React.CSSProperties = {
    ...btnBase,
    background: 'var(--bg-elevated)', color: 'var(--text-1)',
    border: '1px solid var(--border-strong)',
  };
  const tabBtn = (t: TabMode): React.CSSProperties => ({
    background: 'transparent', border: 0, padding: '4px 10px',
    fontSize: 11, fontWeight: tab === t ? 600 : 400,
    color: tab === t ? 'var(--text-1)' : 'var(--text-3)',
    cursor: 'pointer', borderRadius: 6,
    borderBottom: tab === t ? '2px solid #4875F0' : '2px solid transparent',
    transition: 'all 120ms ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: 'var(--bg-page)', overflow: 'hidden',
    }}>
      {/* ── Compact single-row topbar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 14px', borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0, flexWrap: 'wrap',
        background: 'var(--bg-page)', zIndex: 5,
      }}>
        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button type="button" onClick={navPrev} style={{ ...btnBase, padding: '4px 7px' }}>
            <IconChevronLeft size={13} />
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', minWidth: 130, textAlign: 'center' }}>
            {headerLabel()}
          </span>
          <button type="button" onClick={navNext} style={{ ...btnBase, padding: '4px 7px' }}>
            <IconChevronRight size={13} />
          </button>
          <button type="button" onClick={navToday} style={{ ...btnBase, marginLeft: 2 }}>Today</button>
        </div>

        {/* Tab bar (center) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
          {(['events','types','reminders','groups'] as TabMode[]).map(t => (
            <button key={t} type="button" style={tabBtn(t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* View toggle + add */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 8, padding: 2, gap: 2 }}>
            {(['day','week','month'] as ViewMode[]).map(v => (
              <button key={v} type="button"
                style={view === v ? btnActive : btnBase}
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <button
            type="button" onClick={handleAddEvent}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: '#4875F0', border: 0, borderRadius: 8,
              padding: '5px 12px', fontSize: 11, fontWeight: 600,
              color: '#fff', cursor: 'pointer',
            }}
          >
            <IconPlus size={13} />
            Add event
          </button>
        </div>
      </div>

      {/* ── Tab content strip ── */}
      {tab !== 'events' && (
        <div style={{
          padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0, background: 'var(--bg-page)',
        }}>
          {tab === 'types' && <TypesPanel events={events} />}
          {tab === 'reminders' && <RemindersPanel />}
          {tab === 'groups' && <GroupsPanel events={events} />}
        </div>
      )}

      {/* ── Calendar view (fills remaining space) ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {view === 'month' && (
          <MonthView
            year={year} month={month} events={events}
            onDayClick={handleDayClick}
            onEventClick={ev => setDetailEvent(ev)}
          />
        )}
        {view === 'week' && (
          <WeekView
            year={year} month={month}
            weekStart={getWeekStart(current)}
            events={events}
            onSlotClick={handleSlotClick}
            onEventClick={ev => setDetailEvent(ev)}
          />
        )}
        {view === 'day' && (
          <DayView
            date={current} events={events}
            onSlotClick={handleSlotClick}
            onEventClick={ev => setDetailEvent(ev)}
          />
        )}
      </div>

      {/* ── Modals ── */}
      {showModal && (
        <CreateEventModal
          initialDate={modalDate}
          onClose={() => { setShowModal(false); setModalDate(undefined); setModalTime(undefined); }}
          onSaved={refresh}
        />
      )}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onDeleted={() => { deleteEvent(detailEvent.id); refresh(); setDetailEvent(null); }}
        />
      )}
    </div>
  );
}

/* ── Event detail modal ── */
function EventDetailModal({ event, onClose, onDeleted }: {
  event: CalendarEvent;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const c = event.color || EVENT_TYPE_COLORS[event.type] || '#6B7280';
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'var(--overlay)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)',
        borderRadius: 16, padding: 24, width: '100%', maxWidth: 400,
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: c, flexShrink: 0 }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>{event.title}</span>
          </div>
          <button type="button" onClick={onClose}
            style={{ background: 'transparent', border: 0, color: 'var(--text-3)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Row label="Date" value={event.date} />
          {event.time && <Row label="Time" value={event.time + (event.endTime ? ` – ${event.endTime}` : '')} />}
          <Row label="Type" value={EVENT_TYPE_LABELS[event.type] ?? event.type} color={c} />
          {event.group && <Row label="Group" value={event.group.charAt(0).toUpperCase() + event.group.slice(1)} />}
          {event.description && (
            <div style={{ marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Notes</span>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{event.description}</p>
            </div>
          )}
        </div>

        <button
          type="button" onClick={onDeleted}
          style={{
            marginTop: 4, padding: '8px 0', background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)', borderRadius: 9,
            fontSize: 12, fontWeight: 500, color: '#EF4444', cursor: 'pointer',
          }}
        >
          Delete event
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 46 }}>{label}</span>
      <span style={{ fontSize: 12, color: color ?? 'var(--text-2)' }}>{value}</span>
    </div>
  );
}

/* ── Types panel ── */
function TypesPanel({ events }: { events: CalendarEvent[] }) {
  const counts: Record<string, number> = {};
  events.forEach(e => { counts[e.type] = (counts[e.type] ?? 0) + 1; });
  const types = Object.keys(EVENT_TYPE_LABELS) as (keyof typeof EVENT_TYPE_COLORS)[];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {types.map(t => {
        const c = EVENT_TYPE_COLORS[t];
        const n = counts[t] ?? 0;
        return (
          <div key={t} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 20,
            background: `${c}15`, border: `1px solid ${c}30`,
          }}>
            <span style={{ fontSize: 10, color: c, fontWeight: 600 }}>{EVENT_TYPE_LABELS[t]}</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{n}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Reminders panel ── */
function RemindersPanel() {
  const [text, setText]   = useState('');
  const [items, setItems] = useState<{ id: string; text: string; done: boolean }[]>([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('paceup_quick_reminders') || '[]')); } catch { /* ignore */ }
  }, []);

  function save(arr: typeof items) {
    setItems(arr);
    localStorage.setItem('paceup_quick_reminders', JSON.stringify(arr));
  }

  function add() {
    if (!text.trim()) return;
    save([...items, { id: `${Date.now()}`, text: text.trim(), done: false }]);
    setText('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a reminder…"
          style={{
            flex: 1, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
            borderRadius: 7, padding: '5px 10px', fontSize: 11, color: 'var(--text-1)', outline: 'none',
          }}
        />
        <button type="button" onClick={add}
          style={{ background: '#4875F0', border: 0, borderRadius: 7, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
          Add
        </button>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {items.map(item => (
          <div key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '3px 8px 3px 5px', borderRadius: 20,
            background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
            opacity: item.done ? 0.5 : 1,
          }}>
            <input type="checkbox" checked={item.done}
              onChange={() => save(items.map(i => i.id === item.id ? { ...i, done: !i.done } : i))}
              style={{ cursor: 'pointer', accentColor: '#4875F0' }}
            />
            <span style={{ fontSize: 11, color: 'var(--text-2)', textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</span>
            <button type="button"
              onClick={() => save(items.filter(i => i.id !== item.id))}
              style={{ background: 'transparent', border: 0, color: 'var(--text-4)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: 0 }}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Groups panel ── */
function GroupsPanel({ events }: { events: CalendarEvent[] }) {
  const counts: Record<string, number> = {};
  events.forEach(e => { if (e.group) counts[e.group] = (counts[e.group] ?? 0) + 1; });
  const groups = Object.keys(counts).sort();
  if (groups.length === 0) {
    return <span style={{ fontSize: 11, color: 'var(--text-3)' }}>No events with groups yet.</span>;
  }
  const groupColors: Record<string, string> = { school: '#4875F0', personal: '#22C55E', work: '#F59E0B' };
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {groups.map(g => {
        const c = groupColors[g] ?? '#6B7280';
        return (
          <div key={g} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 20,
            background: `${c}15`, border: `1px solid ${c}30`,
          }}>
            <span style={{ fontSize: 10, color: c, fontWeight: 600 }}>{g.charAt(0).toUpperCase() + g.slice(1)}</span>
            <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{counts[g]}</span>
          </div>
        );
      })}
    </div>
  );
}
