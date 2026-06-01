'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { IconChevronLeft, IconChevronRight, IconPlus, IconLayoutList } from '@tabler/icons-react';
import { CalendarEvent, loadEvents, deleteEvent, EVENT_TYPE_COLORS, EVENT_TYPE_LABELS, loadTasks, Task } from '@/lib/events';
import MonthView from '@/components/calendar/MonthView';
import WeekView from '@/components/calendar/WeekView';
import DayView from '@/components/calendar/DayView';
import CreateEventModal from '@/components/calendar/CreateEventModal';
import TasksSidebar from '@/components/calendar/TasksSidebar';
import ContextualTip from '@/components/ContextualTip';

type ViewMode = 'month' | 'week' | 'day';
type TabMode  = 'events' | 'tasks';

function twoDigit(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(d: Date)   { return `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`; }

function getWeekStart(d: Date): Date {
  const day = new Date(d);
  const dow = day.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  day.setDate(day.getDate() + diff);
  day.setHours(0, 0, 0, 0);
  return day;
}

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

export default function CalendarPage() {
  const [view,          setView]         = useState<ViewMode>('month');
  const [tab,           setTab]          = useState<TabMode>('events');
  const [current,       setCurrent]      = useState(new Date());
  const [events,        setEvents]       = useState<CalendarEvent[]>([]);
  const [tasks,         setTasks]        = useState<Task[]>([]);
  const [showModal,     setShowModal]    = useState(false);
  const [modalDate,     setModalDate]    = useState<string | undefined>();
  const [modalMode,     setModalMode]    = useState<'event' | 'task'>('event');
  const [detailEvent,   setDetailEvent]  = useState<CalendarEvent | null>(null);
  const [tasksVisible,  setTasksVisible] = useState(true);
  const [refreshKey,    setRefreshKey]   = useState(0);

  /* Indicator refs for arc tabs */
  const arcGroupRef  = useRef<HTMLDivElement>(null);
  const arcIndRef    = useRef<HTMLDivElement>(null);
  const viewGroupRef = useRef<HTMLDivElement>(null);
  const viewIndRef   = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => {
    setEvents(loadEvents());
    setTasks(loadTasks());
    setRefreshKey(k => k + 1);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  /* Position arc indicator */
  function positionIndicator(
    groupRef: React.RefObject<HTMLDivElement | null>,
    indRef:   React.RefObject<HTMLDivElement | null>,
  ) {
    const group = groupRef.current;
    const ind   = indRef.current;
    if (!group || !ind) return;
    const active = group.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    ind.style.left  = `${active.offsetLeft}px`;
    ind.style.width = `${active.offsetWidth}px`;
  }

  useEffect(() => { positionIndicator(arcGroupRef,  arcIndRef);  }, [tab]);
  useEffect(() => { positionIndicator(viewGroupRef, viewIndRef); }, [view]);

  /* Reposition on mount after layout */
  useEffect(() => {
    setTimeout(() => {
      positionIndicator(arcGroupRef,  arcIndRef);
      positionIndicator(viewGroupRef, viewIndRef);
    }, 50);
  }, []);

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

  function navToday() { setCurrent(new Date()); }

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

  /* Clicking a date cell opens the creation modal */
  function handleDayClick(dateStr: string) {
    setModalDate(dateStr);
    setModalMode(tab === 'tasks' ? 'task' : 'event');
    setShowModal(true);
  }

  function handleSlotClick(dateStr: string, time: string) {
    setModalDate(dateStr);
    setModalMode('event');
    setShowModal(true);
  }

  function handleAddNew() {
    setModalDate(view === 'day' ? toDateStr(current) : undefined);
    setModalMode(tab === 'tasks' ? 'task' : 'event');
    setShowModal(true);
  }

  /* Circular nav button style */
  const circleNavBtn: React.CSSProperties = {
    width: 32, height: 32,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
    border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    color: 'var(--text-2)',
    flexShrink: 0,
    transition: 'background 150ms cubic-bezier(0.4,0,0.2,1), color 150ms ease, transform 120ms ease',
  };

  /* Arc tab button style */
  function arcTabStyle(active: boolean): React.CSSProperties {
    return {
      background: 'transparent', border: 'none',
      padding: '6px 14px 10px',
      fontSize: 12, fontWeight: active ? 600 : 400,
      color: active ? 'var(--text-1)' : 'var(--text-3)',
      cursor: 'pointer',
      transition: 'color 200ms cubic-bezier(0.4,0,0.2,1)',
      whiteSpace: 'nowrap',
    };
  }

  /* View pill button style */
  const pillTrackStyle: React.CSSProperties = {
    display: 'flex',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 10, padding: 3,
    gap: 0, flexShrink: 0,
    position: 'relative',
  };
  function pillBtnStyle(active: boolean): React.CSSProperties {
    return {
      background: 'transparent', border: 'none',
      padding: '5px 13px', borderRadius: 7,
      fontSize: 12, fontWeight: active ? 600 : 400,
      color: active ? 'var(--text-1)' : 'var(--text-3)',
      cursor: 'pointer',
      transition: 'color 200ms cubic-bezier(0.4,0,0.2,1)',
      whiteSpace: 'nowrap',
      position: 'relative', zIndex: 1,
    };
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <ContextualTip
        id="calendar-tip"
        text="Use the Calendar to create events, schedule study sessions, and track deadlines. Switch between Month, Week, and Day views with the controls above."
      />

      {/* ── Page title row ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16, flexShrink: 0,
      }}>
        <h1 style={{
          fontSize: 18, fontWeight: 700,
          color: 'var(--text-1)',
          letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0,
        }}>
          Calendar
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Tasks toggle button */}
          <button
            type="button"
            onClick={() => setTasksVisible(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 13px',
              background: tasksVisible ? 'var(--accent-subtle)' : 'transparent',
              border: `1px solid ${tasksVisible ? 'var(--accent-border)' : 'var(--border-default)'}`,
              borderRadius: 8, fontSize: 12, fontWeight: 500,
              color: tasksVisible ? 'var(--accent)' : 'var(--text-2)',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <IconLayoutList size={13} />
            My Tasks
          </button>

          <button
            type="button" onClick={handleAddNew}
            className="btn btn-primary"
            style={{ gap: 6, padding: '7px 16px', fontSize: 12 }}
          >
            <IconPlus size={14} />
            {tab === 'tasks' ? 'Add task' : 'Add event'}
          </button>
        </div>
      </div>

      {/* ── Calendar + Tasks layout ── */}
      <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0, overflow: 'hidden' }}>

        {/* ── Calendar card ── */}
        <div style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 16,
          boxShadow: 'var(--shadow-elevated)',
          overflow: 'hidden', minHeight: 0,
          transition: 'border-color 240ms cubic-bezier(0.4,0,0.2,1), box-shadow 240ms cubic-bezier(0.4,0,0.2,1)',
        }}>

          {/* ── Controls row ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0, flexWrap: 'wrap',
            background: 'var(--bg-surface)', zIndex: 5,
          }}>

            {/* Circular nav + label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <button
                type="button" onClick={navPrev}
                style={circleNavBtn}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                  (e.currentTarget as HTMLElement).style.transform = '';
                }}
              >
                <IconChevronLeft size={14} />
              </button>

              <span style={{
                fontSize: 14, fontWeight: 600,
                color: 'var(--text-1)',
                minWidth: 148, textAlign: 'center',
                letterSpacing: '-0.01em',
              }}>
                {headerLabel()}
              </span>

              <button
                type="button" onClick={navNext}
                style={circleNavBtn}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                  (e.currentTarget as HTMLElement).style.transform = '';
                }}
              >
                <IconChevronRight size={14} />
              </button>

              <button
                type="button" onClick={navToday}
                style={{
                  height: 32, borderRadius: 8, padding: '0 12px',
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none', fontSize: 11, fontWeight: 600,
                  color: 'var(--text-2)', cursor: 'pointer',
                  marginLeft: 2,
                  transition: 'background 150ms ease, color 150ms ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                }}
              >
                Today
              </button>
            </div>

            {/* Arc tab — Events | Tasks */}
            <div
              ref={arcGroupRef}
              style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', position: 'relative' }}
            >
              {(['events', 'tasks'] as TabMode[]).map(t => (
                <button
                  key={t} type="button"
                  data-active={tab === t ? 'true' : 'false'}
                  onClick={() => setTab(t)}
                  style={arcTabStyle(tab === t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
              {/* Sliding arc underline */}
              <div
                ref={arcIndRef}
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

            {/* View toggle pill — Day | Week | Month */}
            <div ref={viewGroupRef} style={pillTrackStyle}>
              {/* Sliding pill indicator */}
              <div
                ref={viewIndRef}
                style={{
                  position: 'absolute',
                  top: 3, bottom: 3,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 7,
                  boxShadow: '0 0 0 1px rgba(91,91,214,0.10) inset',
                  transition: 'left 250ms cubic-bezier(0.4,0,0.2,1), width 250ms cubic-bezier(0.4,0,0.2,1)',
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              />
              {(['day', 'week', 'month'] as ViewMode[]).map(v => (
                <button
                  key={v} type="button"
                  data-active={view === v ? 'true' : 'false'}
                  onClick={() => setView(v)}
                  style={pillBtnStyle(view === v)}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* ── Calendar view ── */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {view === 'month' && (
              <MonthView
                year={year} month={month}
                events={events} tasks={tasks}
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
        </div>

        {/* ── Tasks sidebar ── */}
        <TasksSidebar
          collapsed={!tasksVisible}
          onToggle={() => setTasksVisible(v => !v)}
          onOpenCreate={(mode) => {
            setModalMode(mode);
            setModalDate(undefined);
            setShowModal(true);
          }}
          refreshKey={refreshKey}
        />

      </div>

      {/* ── Creation modal ── */}
      {showModal && (
        <CreateEventModal
          initialDate={modalDate}
          initialMode={modalMode}
          onClose={() => setShowModal(false)}
          onSaved={refresh}
        />
      )}

      {/* ── Event detail modal ── */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onDeleted={() => {
            deleteEvent(detailEvent.id);
            setDetailEvent(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────
   Event detail modal (inline)
───────────────────────────────────── */
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
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 16, padding: 24,
        width: '100%', maxWidth: 400,
        boxShadow: 'var(--shadow-modal)',
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
          <DetailRow label="Date"  value={event.date} />
          {event.time && <DetailRow label="Time" value={event.time + (event.endTime ? ` – ${event.endTime}` : '')} />}
          <DetailRow label="Type"  value={EVENT_TYPE_LABELS[event.type] ?? event.type} color={c} />
          {event.group && <DetailRow label="Group" value={event.group.charAt(0).toUpperCase() + event.group.slice(1)} />}
          {event.description && (
            <div style={{ marginTop: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Notes</span>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{event.description}</p>
            </div>
          )}
        </div>
        <button type="button" onClick={onDeleted}
          style={{
            marginTop: 4, padding: '9px 0',
            background: 'var(--color-red-subtle)',
            border: '1px solid var(--color-red-border)',
            borderRadius: 9, fontSize: 12, fontWeight: 500,
            color: 'var(--color-red)', cursor: 'pointer',
          }}>
          Delete event
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.4px', minWidth: 46 }}>{label}</span>
      <span style={{ fontSize: 12, color: color ?? 'var(--text-2)' }}>{value}</span>
    </div>
  );
}
