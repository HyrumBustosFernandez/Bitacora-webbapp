'use client';

import { CalendarEvent, EVENT_TYPE_COLORS } from '@/lib/events';

interface Props {
  year: number;
  month: number;
  events: CalendarEvent[];
  onDayClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function twoDigit(n: number) { return String(n).padStart(2, '0'); }

export default function MonthView({ year, month, events, onDayClick, onEventClick }: Props) {
  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

  const firstDayOfMonth = new Date(year, month, 1);
  // getDay() is 0=Sun, convert to Mon-first (0=Mon)
  let startDow = firstDayOfMonth.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const daysInPrev   = new Date(year, month, 0).getDate();

  type Cell = { day: number; curMonth: boolean; isToday: boolean; dateStr: string };
  const cells: Cell[] = [];

  for (let i = startDow - 1; i >= 0; i--) {
    const d = daysInPrev - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear  = month === 0 ? year - 1 : year;
    cells.push({ day: d, curMonth: false, isToday: false, dateStr: `${prevYear}-${twoDigit(prevMonth + 1)}-${twoDigit(d)}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d, curMonth: true,
      isToday: isThisMonth && d === today.getDate(),
      dateStr: `${year}-${twoDigit(month + 1)}-${twoDigit(d)}`,
    });
  }
  const tail = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= tail; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear  = month === 11 ? year + 1 : year;
    cells.push({ day: d, curMonth: false, isToday: false, dateStr: `${nextYear}-${twoDigit(nextMonth + 1)}-${twoDigit(d)}` });
  }

  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach(e => {
    const arr = eventsByDate.get(e.date) ?? [];
    arr.push(e);
    eventsByDate.set(e.date, arr);
  });

  const rows = Math.ceil(cells.length / 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Day-of-week header */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {DOW_LABELS.map(d => (
          <div key={d} style={{
            padding: '8px 0', textAlign: 'center',
            fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
            letterSpacing: '0.4px', textTransform: 'uppercase',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        flex: 1,
        overflow: 'hidden',
      }}>
        {cells.map((cell, i) => {
          const dayEvents = eventsByDate.get(cell.dateStr) ?? [];
          return (
            <div
              key={i}
              onClick={() => cell.curMonth && onDayClick(cell.dateStr)}
              style={{
                borderRight: (i + 1) % 7 !== 0 ? '1px solid var(--border-subtle)' : undefined,
                borderBottom: i < cells.length - 7 ? '1px solid var(--border-subtle)' : undefined,
                padding: '6px 7px',
                cursor: cell.curMonth ? 'pointer' : 'default',
                opacity: cell.curMonth ? 1 : 0.3,
                background: 'transparent',
                display: 'flex', flexDirection: 'column', gap: 3,
                transition: 'background 120ms ease',
                minHeight: 0,
              }}
              onMouseEnter={e => {
                if (cell.curMonth) (e.currentTarget as HTMLElement).style.background = 'rgba(128,128,128,0.04)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              {/* Date number */}
              <span style={{
                alignSelf: 'flex-end',
                width: cell.isToday ? 22 : 'auto',
                height: cell.isToday ? 22 : 'auto',
                lineHeight: cell.isToday ? '22px' : undefined,
                textAlign: 'center',
                borderRadius: cell.isToday ? '50%' : 3,
                background: cell.isToday ? 'var(--accent)' : 'transparent',
                color: cell.isToday ? '#fff' : 'var(--text-3)',
                fontSize: 11, fontWeight: cell.isToday ? 600 : 400,
                padding: cell.isToday ? 0 : '0 2px',
                flexShrink: 0,
              }}>
                {cell.day}
              </span>

              {/* Event pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
                {dayEvents.slice(0, 3).map(ev => {
                  const c = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
                  return (
                    <button
                      key={ev.id} type="button"
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      title={ev.title}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '1px 5px', borderRadius: 4,
                        background: `${c}20`,
                        borderLeft: `2px solid ${c}`,
                        border: `1px solid ${c}30`,
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        overflow: 'hidden',
                      }}
                    >
                      <span style={{
                        fontSize: 10, fontWeight: 500, color: c,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        lineHeight: 1.4,
                      }}>
                        {ev.time && <span style={{ opacity: 0.7, marginRight: 3 }}>{ev.time}</span>}
                        {ev.title}
                      </span>
                    </button>
                  );
                })}
                {dayEvents.length > 3 && (
                  <span style={{ fontSize: 9, color: 'var(--text-3)', paddingLeft: 2 }}>
                    +{dayEvents.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
