'use client';

import { useState, useEffect, useCallback } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { getUpcomingDeadlines, type AppState } from '@/lib/storage';
import { loadEvents, toDateKey, EVENT_COLORS, type CalendarEvent } from '@/lib/events';
import CreateEventModal from '@/components/calendar/CreateEventModal';

interface Props { state: AppState }

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DOW = ['S','M','T','W','T','F','S'];

export default function CalendarCard({ state }: Props) {
  const today = new Date();
  const [calYear,   setCalYear]   = useState(today.getFullYear());
  const [calMonth,  setCalMonth]  = useState(today.getMonth());
  const [events,    setEvents]    = useState<CalendarEvent[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState('');

  const refreshEvents = useCallback(() => setEvents(loadEvents()), []);
  useEffect(() => { refreshEvents(); }, [refreshEvents]);

  function prev() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function next() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  const deadlines    = getUpcomingDeadlines(state);
  const deadlineDays = new Set(
    deadlines
      .filter(d => d.deadline.getFullYear() === calYear && d.deadline.getMonth() === calMonth)
      .map(d => d.deadline.getDate())
  );

  const eventsByDay = new Map<number, CalendarEvent[]>();
  events.forEach(e => {
    const [y, m, d] = e.date.split('-').map(Number);
    if (y === calYear && m - 1 === calMonth) {
      const arr = eventsByDay.get(d) ?? [];
      arr.push(e);
      eventsByDay.set(d, arr);
    }
  });

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev  = new Date(calYear, calMonth, 0).getDate();
  const isThisMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

  type Cell = { day: number; kind: 'prev' | 'cur' | 'next'; isToday?: boolean; isDeadline?: boolean };
  const cells: Cell[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, kind: 'prev' });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, kind: 'cur', isToday: isThisMonth && d === today.getDate(), isDeadline: deadlineDays.has(d) });
  const tail = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= tail; d++)
    cells.push({ day: d, kind: 'next' });

  const todayStr = toDateKey(today);

  const card: React.CSSProperties = {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 14,
    padding: '16px 18px',
    boxShadow: 'var(--shadow-card)',
    transition: 'border-color 200ms, box-shadow 200ms, transform 200ms',
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Calendar */}
        <div
          className="card"
          style={{ padding: '16px 18px' }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-elevated)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1.5px)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          {/* Month header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>
              {MONTHS[calMonth]} {calYear}
            </span>
            <div style={{ display: 'flex', gap: 2 }}>
              <NavBtn onClick={prev}><IconChevronLeft size={11} /></NavBtn>
              <NavBtn onClick={next}><IconChevronRight size={11} /></NavBtn>
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 0' }}>
            {DOW.map((d, i) => (
              <div key={i} style={{
                textAlign: 'center', fontSize: 9, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                color: 'var(--text-3)', padding: '3px 0 6px',
              }}>{d}</div>
            ))}
            {cells.map((cell, i) => {
              const dayEvents = cell.kind === 'cur' ? (eventsByDay.get(cell.day) ?? []) : [];
              const dateStr = cell.kind === 'cur'
                ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
                : '';
              return (
                <div
                  key={i}
                  onClick={() => { if (cell.kind === 'cur') { setModalDate(dateStr); setModalOpen(true); } }}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    height: 28, cursor: cell.kind === 'cur' ? 'pointer' : 'default',
                    gap: 2, borderRadius: 6,
                    transition: 'background 130ms',
                  }}
                  onMouseEnter={e => {
                    if (cell.kind === 'cur' && !cell.isToday)
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={e => {
                    if (!cell.isToday)
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span style={{
                    width: cell.isToday ? 22 : 'auto',
                    height: cell.isToday ? 22 : 'auto',
                    lineHeight: cell.isToday ? '22px' : undefined,
                    borderRadius: cell.isToday ? '50%' : 3,
                    textAlign: 'center', display: 'inline-block',
                    fontSize: 11,
                    background: cell.isToday ? 'var(--accent)' : 'transparent',
                    color: cell.isToday ? '#fff'
                      : cell.kind !== 'cur' ? 'var(--text-4)'
                      : cell.isDeadline ? 'var(--color-red)'
                      : 'var(--text-2)',
                    fontWeight: cell.isToday ? 700 : cell.isDeadline ? 600 : 400,
                    padding: cell.isToday ? 0 : '0 2px',
                  }}>
                    {cell.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {dayEvents.slice(0, 3).map((ev, ei) => (
                        <span key={ei} style={{
                          width: 3, height: 3, borderRadius: '50%',
                          background: EVENT_COLORS[ev.type], flexShrink: 0,
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <LegendDot color="var(--accent)"    label="today" />
            <LegendDot color="var(--color-red)" label="deadline" />
            <LegendDot color="var(--color-green)" label="event" />
          </div>
        </div>

        {/* Upcoming */}
        <div className="card" style={{ padding: '16px 18px' }}>
          <div style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: 10,
          }}>
            Upcoming
          </div>
          {deadlines.length === 0 ? (
            <div style={{ fontSize: 11, color: 'var(--text-3)', fontStyle: 'italic' }}>
              No upcoming deadlines 🎉
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {deadlines.map(({ course, daysLeft }) => {
                const overdue  = daysLeft <= 0;
                const soon     = daysLeft >= 1 && daysLeft <= 5;
                const dotColor = overdue ? 'var(--color-red)' : soon ? 'var(--color-amber)' : 'var(--text-3)';
                const label    = overdue ? 'Due today' : `${daysLeft}d left`;
                const labelColor = overdue ? 'var(--color-red)' : soon ? 'var(--color-amber)' : 'var(--text-3)';

                return (
                  <div key={course.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '6px 10px', borderRadius: 8,
                    border: '1px solid var(--border-subtle)',
                    transition: 'border-color 130ms, background 130ms',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-hover)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>{course.title}</div>
                    </div>
                    <span style={{ fontSize: 10, color: labelColor, fontWeight: 500, flexShrink: 0 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {modalOpen && (
        <CreateEventModal
          initialDate={modalDate}
          onClose={() => setModalOpen(false)}
          onSaved={refreshEvents}
        />
      )}
    </>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: 24, height: 24, borderRadius: 6, border: 'none',
      background: 'var(--bg-elevated)', color: 'var(--text-3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', padding: 0,
      transition: 'background 130ms, color 130ms',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--border-default)';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
        (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
      }}
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 9, color: 'var(--text-3)', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

