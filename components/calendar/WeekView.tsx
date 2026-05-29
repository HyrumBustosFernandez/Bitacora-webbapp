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

const HOURS      = Array.from({ length: 16 }, (_, i) => i + 7); // 7am–10pm
const DOW_SHORT  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR_PX    = 64; // was 60 — more breathing room per hour row
const GUTTER_W   = 64; // was 52 — wider time label column

export default function WeekView({ weekStart, events, onSlotClick, onEventClick }: Props) {
  const today    = new Date();
  const todayStr = toDateStr(today);
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const nowTop     = ((nowMinutes - 7 * 60) / 60) * HOUR_PX;

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
    return Math.max(24, ((eh * 60 + em - sh * 60 - sm) / 60) * HOUR_PX);
  }

  const totalH = HOURS.length * HOUR_PX;

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Day headers — taller with more padding */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `${GUTTER_W}px repeat(7, 1fr)`,
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0, position: 'sticky', top: 0,
        background: 'var(--bg-surface)', zIndex: 2,
      }}>
        <div /> {/* gutter placeholder */}
        {days.map((d, i) => {
          const ds = toDateStr(d);
          const isToday = ds === todayStr;
          return (
            <div key={i} style={{
              padding: '12px 0 10px', textAlign: 'center',
              borderLeft: '1px solid var(--border-subtle)',
              background: isToday ? 'var(--accent-subtle)' : 'transparent',
            }}>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: 'var(--text-3)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 4,
              }}>
                {DOW_SHORT[i]}
              </div>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: isToday ? '#fff' : 'var(--text-2)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: isToday ? 30 : 'auto',
                height: isToday ? 30 : 'auto',
                borderRadius: isToday ? '50%' : 0,
                background: isToday ? 'var(--accent)' : 'transparent',
              }}>
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>

        {/* Time gutter */}
        <div style={{ width: GUTTER_W, flexShrink: 0, position: 'relative' }}>
          {HOURS.map(h => (
            <div key={h} style={{
              height: HOUR_PX,
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: 12, paddingTop: 6,
            }}>
              <span style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 500 }}>
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
              background: 'var(--border-subtle)', zIndex: 0,
            }} />
          ))}

          {/* Current time indicator */}
          {nowTop >= 0 && nowTop <= totalH && (
            <div style={{
              position: 'absolute', left: 0, right: 0,
              top: nowTop, height: 2,
              background: 'var(--color-red)',
              opacity: 0.65,
              zIndex: 3, pointerEvents: 'none',
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-red)',
                flexShrink: 0, marginLeft: -4,
              }} />
            </div>
          )}

          {days.map((day, di) => {
            const ds = toDateStr(day);
            const isToday   = ds === todayStr;
            const dayEvents = (eventsByDate.get(ds) ?? []).filter(e => e.time);
            return (
              <div key={di} style={{
                borderLeft: '1px solid var(--border-subtle)',
                position: 'relative', height: totalH,
                background: isToday ? 'rgba(91,91,214,0.03)' : 'transparent',
              }}>
                {/* Clickable hour slots */}
                {HOURS.map(h => (
                  <div
                    key={h}
                    onClick={() => onSlotClick(ds, `${twoDigit(h)}:00`)}
                    style={{
                      position: 'absolute', left: 0, right: 0,
                      top: (h - 7) * HOUR_PX, height: HOUR_PX,
                      cursor: 'pointer',
                      transition: 'background 130ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  />
                ))}

                {/* Events */}
                {dayEvents.map(ev => {
                  const c = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
                  const top    = eventTop(ev.time!);
                  const height = eventHeight(ev.time!, ev.endTime);
                  if (top < 0 || top > totalH) return null;
                  return (
                    <button
                      key={ev.id} type="button"
                      onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                      style={{
                        position: 'absolute',
                        top, height: Math.min(height, totalH - top),
                        left: 4, right: 4, zIndex: 2,
                        background: `${c}18`,
                        borderLeft: `3px solid ${c}`,
                        border: `1px solid ${c}28`,
                        borderRadius: 7,
                        padding: '4px 8px',
                        textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
                        transition: 'background 130ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = `${c}28`)}
                      onMouseLeave={e => (e.currentTarget.style.background = `${c}18`)}
                    >
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: c,
                        lineHeight: 1.3,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {ev.title}
                      </div>
                      {height > 32 && (
                        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>
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
