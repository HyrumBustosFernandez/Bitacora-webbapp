'use client';

import { CalendarEvent, EVENT_TYPE_COLORS } from '@/lib/events';

interface Props {
  year: number;
  month: number;
  weekStart: Date;
  events: CalendarEvent[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function twoDigit(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`; }

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7am–10pm
const DOW_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_PX = 60;

export default function WeekView({ weekStart, events, onSlotClick, onEventClick }: Props) {
  const today = new Date();
  const todayStr = toDateStr(today);
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const nowTop = ((nowMinutes - 7 * 60) / 60) * HOUR_PX;

  const days: Date[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const eventsByDate = new Map<string, CalendarEvent[]>();
  events.forEach(e => {
    const arr = eventsByDate.get(e.date) ?? [];
    arr.push(e);
    eventsByDate.set(e.date, arr);
  });

  function eventTop(time: string) {
    const [h, m] = time.split(':').map(Number);
    return ((h * 60 + m - 7 * 60) / 60) * HOUR_PX;
  }
  function eventHeight(time: string, endTime?: string) {
    if (!endTime) return HOUR_PX;
    const [sh, sm] = time.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return Math.max(20, ((eh * 60 + em - sh * 60 - sm) / 60) * HOUR_PX);
  }

  const totalH = HOURS.length * HOUR_PX;

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Day headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '52px repeat(7, 1fr)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0, position: 'sticky', top: 0,
        background: 'var(--bg-page)', zIndex: 2,
      }}>
        <div />
        {days.map((d, i) => {
          const ds = toDateStr(d);
          const isToday = ds === todayStr;
          return (
            <div key={i} style={{
              padding: '8px 0', textAlign: 'center',
              borderLeft: '1px solid var(--border-subtle)',
              background: isToday ? 'rgba(72,117,240,0.04)' : 'transparent',
            }}>
              <div style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{DOW_SHORT[i]}</div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: isToday ? '#fff' : 'var(--text-2)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: isToday ? 28 : 'auto',
                height: isToday ? 28 : 'auto',
                borderRadius: isToday ? '50%' : 0,
                background: isToday ? '#4875F0' : 'transparent',
              }}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Time labels */}
        <div style={{ width: 52, flexShrink: 0, position: 'relative' }}>
          {HOURS.map(h => (
            <div key={h} style={{
              height: HOUR_PX, display: 'flex', alignItems: 'flex-start',
              justifyContent: 'flex-end', paddingRight: 8, paddingTop: 4,
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
                {h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`}
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', position: 'relative' }}>
          {/* Hour lines */}
          {HOURS.map((h, hi) => (
            <div key={h} style={{
              position: 'absolute', left: 0, right: 0,
              top: hi * HOUR_PX, height: 1,
              background: 'var(--border-subtle)',
              zIndex: 0,
            }} />
          ))}

          {/* Current time line */}
          {nowTop >= 0 && nowTop <= totalH && (
            <div style={{
              position: 'absolute', left: 0, right: 0,
              top: nowTop, height: 2,
              background: 'rgba(239,68,68,0.7)',
              zIndex: 3, pointerEvents: 'none',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(239,68,68,0.8)', flexShrink: 0, marginLeft: -4 }} />
            </div>
          )}

          {days.map((day, di) => {
            const ds = toDateStr(day);
            const isToday = ds === todayStr;
            const dayEvents = (eventsByDate.get(ds) ?? []).filter(e => e.time);
            return (
              <div key={di} style={{
                borderLeft: '1px solid var(--border-subtle)',
                position: 'relative', height: totalH,
                background: isToday ? 'rgba(72,117,240,0.02)' : 'transparent',
              }}>
                {/* Clickable slots */}
                {HOURS.map(h => (
                  <div
                    key={h}
                    onClick={() => onSlotClick(ds, `${twoDigit(h)}:00`)}
                    style={{
                      position: 'absolute', left: 0, right: 0,
                      top: (h - 7) * HOUR_PX, height: HOUR_PX,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(128,128,128,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  />
                ))}

                {/* Events */}
                {dayEvents.map(ev => {
                  const c = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
                  const top = eventTop(ev.time!);
                  const height = eventHeight(ev.time!, ev.endTime);
                  if (top < 0 || top > totalH) return null;
                  return (
                    <button
                      key={ev.id} type="button"
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      style={{
                        position: 'absolute',
                        top, height: Math.min(height, totalH - top),
                        left: 3, right: 3, zIndex: 2,
                        background: `${c}20`,
                        borderLeft: `3px solid ${c}`,
                        borderRadius: 6, padding: '3px 6px',
                        textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
                        border: `1px solid ${c}30`,
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: c, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ev.title}
                      </div>
                      {height > 30 && (
                        <div style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 2 }}>
                          {ev.time}{ev.endTime && ` – ${ev.endTime}`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
