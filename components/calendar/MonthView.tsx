'use client';

import { CalendarEvent, EVENT_TYPE_COLORS } from '@/lib/events';

import { Task, PRIORITY_COLORS } from '@/lib/events';

interface Props {
  year: number;
  month: number;
  events: CalendarEvent[];
  tasks: Task[];
  onDayClick: (date: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const DOW_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function twoDigit(n: number) { return String(n).padStart(2, '0'); }

export default function MonthView({ year, month, events, tasks, onDayClick, onEventClick }: Props) {
  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

  const firstDayOfMonth = new Date(year, month, 1);
  let startDow = firstDayOfMonth.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

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

  const tasksByDate = new Map<string, Task[]>();
  tasks.forEach(t => {
    const arr = tasksByDate.get(t.dueDate) ?? [];
    arr.push(t);
    tasksByDate.set(t.dueDate, arr);
  });

  const rows = Math.ceil(cells.length / 7);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>

      {/* Day-of-week header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--separator-subtle)',
        flexShrink: 0,
      }}>
        {DOW_LABELS.map(d => (
          <div key={d} style={{
            padding: '12px 0 10px',
            textAlign: 'center',
            fontSize: 10, fontWeight: 700,
            color: 'var(--text-2)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
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
          const dayTasks  = tasksByDate.get(cell.dateStr) ?? [];
          const isWeekend = (i % 7 === 5 || i % 7 === 6);
          const totalItems = dayEvents.length + dayTasks.length;
          const maxVisible = 3;
          return (
            <div
              key={i}
              onClick={() => cell.curMonth && onDayClick(cell.dateStr)}
              style={{
                borderRight: (i + 1) % 7 !== 0 ? '1px solid var(--separator-subtle)' : undefined,
                borderBottom: i < cells.length - 7 ? '1px solid var(--separator-subtle)' : undefined,
                padding: '8px 8px 6px',
                cursor: cell.curMonth ? 'pointer' : 'default',
                opacity: cell.curMonth ? 1 : 0.28,
                background: isWeekend && cell.curMonth ? 'rgba(0,0,0,0.012)' : 'transparent',
                display: 'flex', flexDirection: 'column', gap: 3,
                overflow: 'hidden', minHeight: 0,
                transition: 'background 200ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={e => {
                if (!cell.curMonth) return;
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'var(--bg-elevated)';
                el.style.boxShadow = '0 0 0 1px rgba(91,91,214,0.15) inset';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = isWeekend && cell.curMonth ? 'rgba(0,0,0,0.012)' : 'transparent';
                el.style.boxShadow = '';
              }}
            >
              {/* Date number */}
              <span style={{
                alignSelf: 'flex-start',
                width: cell.isToday ? 24 : 'auto',
                height: cell.isToday ? 24 : 'auto',
                lineHeight: cell.isToday ? '24px' : undefined,
                textAlign: 'center',
                borderRadius: cell.isToday ? '50%' : 4,
                background: cell.isToday ? 'var(--accent)' : 'transparent',
                color: cell.isToday ? '#fff' : 'var(--text-1)',
                fontSize: 12, fontWeight: cell.isToday ? 700 : 500,
                padding: cell.isToday ? 0 : '0 3px',
                flexShrink: 0,
              }}>
                {cell.day}
              </span>

              {/* Event + task pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden' }}>
                {dayEvents.slice(0, maxVisible).map(ev => {
                  const c = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
                  return (
                    <button
                      key={ev.id} type="button"
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      title={ev.title}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '2px 7px', borderRadius: 5,
                        background: `${c}18`,
                        borderLeft: `2.5px solid ${c}`,
                        border: `1px solid ${c}28`,
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        overflow: 'hidden',
                        transition: 'background 130ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = `${c}30`)}
                      onMouseLeave={e => (e.currentTarget.style.background = `${c}18`)}
                    >
                      <span style={{
                        fontSize: 10, fontWeight: 500, color: c,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        lineHeight: 1.5,
                      }}>
                        {ev.time && <span style={{ opacity: 0.65, marginRight: 4 }}>{ev.time}</span>}
                        {ev.title}
                      </span>
                    </button>
                  );
                })}
                {dayTasks.slice(0, Math.max(0, maxVisible - dayEvents.length)).map(task => {
                  const pc = PRIORITY_COLORS[task.priority];
                  return (
                    <div
                      key={task.id}
                      title={task.name}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '2px 6px', borderRadius: 5,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border-subtle)',
                        width: '100%', overflow: 'hidden',
                      }}
                    >
                      <div style={{
                        width: 9, height: 9, borderRadius: '50%',
                        border: `1.5px solid ${pc}`, flexShrink: 0,
                        background: task.status === 'done' ? pc : 'transparent',
                      }} />
                      <span style={{
                        fontSize: 10, color: 'var(--text-2)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        flex: 1, lineHeight: 1.5,
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        opacity: task.status === 'done' ? 0.5 : 1,
                      }}>
                        {task.name}
                      </span>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: pc, flexShrink: 0 }} />
                    </div>
                  );
                })}
                {totalItems > maxVisible && (
                  <span style={{ fontSize: 10, color: 'var(--text-3)', paddingLeft: 3, fontWeight: 500 }}>
                    +{totalItems - maxVisible} more
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
