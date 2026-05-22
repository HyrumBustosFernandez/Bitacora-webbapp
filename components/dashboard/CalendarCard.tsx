'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  IconChevronLeft, IconChevronRight,
  IconNote, IconCalendarPlus, IconClock, IconBook,
} from '@tabler/icons-react';
import { getUpcomingDeadlines, type AppState } from '@/lib/storage';
import { loadEvents, toDateKey, EVENT_COLORS, type CalendarEvent } from '@/lib/events';
import AddEventModal from './AddEventModal';

interface Props { state: AppState }

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DOW = ['S','M','T','W','T','F','S'];

const CARD: React.CSSProperties = {
  background: '#0E0E0E',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '12px 14px',
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 600, color: '#484848',
  textTransform: 'uppercase', letterSpacing: '0.6px',
  marginBottom: 10,
};

export default function CalendarCard({ state }: Props) {
  const today = new Date();
  const [calYear,    setCalYear]    = useState(today.getFullYear());
  const [calMonth,   setCalMonth]   = useState(today.getMonth());
  const [events,     setEvents]     = useState<CalendarEvent[]>([]);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [modalDate,  setModalDate]  = useState('');

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

  function openModal(dateStr: string) {
    setModalDate(dateStr);
    setModalOpen(true);
  }

  const deadlines    = getUpcomingDeadlines(state);
  const deadlineDays = new Set(
    deadlines
      .filter(d => d.deadline.getFullYear() === calYear && d.deadline.getMonth() === calMonth)
      .map(d => d.deadline.getDate())
  );

  // Map of day → events for the visible month
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
    cells.push({
      day: d, kind: 'cur',
      isToday:    isThisMonth && d === today.getDate(),
      isDeadline: deadlineDays.has(d),
    });
  const tail = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= tail; d++)
    cells.push({ day: d, kind: 'next' });

  const todayStr = toDateKey(today);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

        {/* ── Calendar ── */}
        <div style={CARD}>
          <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#A8A29A' }}>
              {MONTHS[calMonth]} {calYear}
            </span>
            <div className="flex items-center gap-1">
              <NavBtn onClick={prev}><IconChevronLeft size={10} /></NavBtn>
              <NavBtn onClick={next}><IconChevronRight size={10} /></NavBtn>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px 0' }}>
            {DOW.map((d, i) => (
              <div key={i} style={{
                fontSize: 9, color: '#3A3A3A', textAlign: 'center',
                fontWeight: 600, paddingBottom: 4, letterSpacing: '0.3px',
              }}>{d}</div>
            ))}
            {cells.map((cell, i) => {
              const dayEvents = cell.kind === 'cur' ? (eventsByDay.get(cell.day) ?? []) : [];
              const dateStr   = cell.kind === 'cur'
                ? `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
                : '';
              return (
                <div
                  key={i}
                  onClick={() => cell.kind === 'cur' && openModal(dateStr)}
                  style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    height: 26, cursor: cell.kind === 'cur' ? 'pointer' : 'default',
                    gap: 2,
                  }}
                >
                  <span style={{
                    width: cell.isToday ? 20 : 'auto',
                    height: cell.isToday ? 20 : 'auto',
                    lineHeight: cell.isToday ? '20px' : undefined,
                    borderRadius: cell.isToday ? '50%' : 3,
                    textAlign: 'center',
                    display: 'inline-block',
                    fontSize: 10,
                    background: cell.isToday ? '#4875F0' : 'transparent',
                    color: cell.isToday
                      ? '#EDE8DC'
                      : cell.kind !== 'cur'
                      ? '#1E1E1E'
                      : cell.isDeadline
                      ? '#F87171'
                      : '#484848',
                    fontWeight: cell.isToday ? 600 : 400,
                    padding: cell.isToday ? 0 : '0 2px',
                  }}>
                    {cell.day}
                  </span>
                  {/* Event dots */}
                  {dayEvents.length > 0 && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {dayEvents.slice(0, 3).map((ev, ei) => (
                        <span key={ei} style={{
                          width: 3, height: 3, borderRadius: '50%',
                          background: EVENT_COLORS[ev.type],
                          flexShrink: 0,
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
            <LegendDot color="#4875F0" label="today" />
            <LegendDot color="#F87171" label="deadline" />
            <LegendDot color="#22C55E" label="event" />
          </div>
        </div>

        {/* ── Upcoming ── */}
        <div style={CARD}>
          <div style={SECTION_LABEL}>Upcoming</div>
          {deadlines.length === 0 ? (
            <div style={{ fontSize: 10, color: '#2E2E2E' }}>No upcoming deadlines</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {deadlines.map(({ course, daysLeft }) => {
                const overdue    = daysLeft <= 0;
                const soon       = daysLeft >= 1 && daysLeft <= 5;
                const dotColor   = overdue ? '#EF4444' : soon ? '#F59E0B' : '#3A3A3A';
                const labelColor = overdue
                  ? 'rgba(239,68,68,0.75)'
                  : soon
                  ? 'rgba(245,158,11,0.75)'
                  : '#484848';
                const labelText = overdue ? 'Due today' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;

                return (
                  <div key={course.id} className="flex items-center gap-2">
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: dotColor, flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 11, color: '#484848', flex: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {course.title}
                    </span>
                    <span style={{ fontSize: 10, color: labelColor, flexShrink: 0, fontWeight: 500 }}>
                      {labelText}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div style={CARD}>
          <div style={SECTION_LABEL}>Quick actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <QuickAction icon={<IconNote size={13} />}         label="Add note"  href="/study" />
            <QuickAction
              icon={<IconCalendarPlus size={13} />}
              label="Add event"
              onClick={() => openModal(todayStr)}
            />
            <QuickAction icon={<IconClock size={13} />}        label="Timer"     href="/study" />
            <QuickAction icon={<IconBook size={13} />}         label="Courses"   href="/courses" />
          </div>
        </div>

      </div>

      {modalOpen && (
        <AddEventModal
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
    <button
      type="button" onClick={onClick}
      className="flex items-center justify-center border-0 cursor-pointer"
      style={{
        width: 20, height: 20,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 5, color: '#484848', padding: 0,
      }}
    >
      {children}
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 9, color: '#333' }}>{label}</span>
    </div>
  );
}

function QuickAction({
  icon, label, href, onClick,
}: {
  icon: React.ReactNode; label: string; href?: string; onClick?: () => void;
}) {
  const style: React.CSSProperties = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 5, padding: '9px 8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 8, textDecoration: 'none', color: '#3A3A3A',
    cursor: 'pointer', width: '100%',
  };

  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={style}>
        {icon}
        <span style={{ fontSize: 9, color: '#484848', fontWeight: 500 }}>{label}</span>
      </button>
    );
  }

  // eslint-disable-next-line @next/next/no-html-link-for-pages
  return (
    <a href={href} style={style}>
      {icon}
      <span style={{ fontSize: 9, color: '#484848', fontWeight: 500 }}>{label}</span>
    </a>
  );
}
