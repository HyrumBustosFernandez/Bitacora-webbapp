'use client';

import { CalendarEvent, EVENT_TYPE_COLORS } from '@/lib/events';

interface Props {
  date: Date;
  events: CalendarEvent[];
  onSlotClick: (date: string, time: string) => void;
  onEventClick: (event: CalendarEvent) => void;
}

function twoDigit(n: number) { return String(n).padStart(2, '0'); }
function toDateStr(d: Date) { return `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate())}`; }

const HOURS    = Array.from({ length: 16 }, (_, i) => i + 7);
const HOUR_PX  = 68; // spacious — day view has room to breathe
const GUTTER_W = 72; // wide time label gutter

export default function DayView({ date, events, onSlotClick, onEventClick }: Props) {
  const today   = new Date();
  const ds      = toDateStr(date);
  const isToday = ds === toDateStr(today);
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const nowTop     = ((nowMinutes - 7 * 60) / 60) * HOUR_PX;
  const totalH     = HOURS.length * HOUR_PX;

  const dayEvents    = events.filter(e => e.date === ds && e.time);
  const allDayEvents = events.filter(e => e.date === ds && !e.time);

  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  function eventTop(time: string) {
    const [h, m] = time.split(':').map(Number);
    return ((h * 60 + m - 7 * 60) / 60) * HOUR_PX;
  }
  function eventHeight(time: string, endTime?: string) {
    if (!endTime) return HOUR_PX;
    const [sh, sm] = time.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    return Math.max(28, ((eh * 60 + em - sh * 60 - sm) / 60) * HOUR_PX);
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Day header */}
      <div style={{
        padding: '14px 24px 12px',
        borderBottom: '1px solid var(--separator-subtle)',
        flexShrink: 0, position: 'sticky', top: 0,
        background: 'var(--bg-surface)', zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontSize: 15, fontWeight: 600, color: 'var(--text-1)',
            letterSpacing: '-0.01em',
          }}>
            {dateLabel}
          </span>
          {isToday && (
            <span style={{
              fontSize: 10, fontWeight: 600, color: 'var(--accent)',
              background: 'var(--accent-subtle)',
              border: '1px solid var(--accent-border)',
              padding: '2px 9px', borderRadius: 20,
            }}>
              Today
            </span>
          )}
        </div>

        {allDayEvents.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {allDayEvents.map(ev => {
              const c = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
              return (
                <button key={ev.id} type="button" onClick={() => onEventClick(ev)}
                  style={{
                    background: `${c}18`, border: `1px solid ${c}35`,
                    borderRadius: 7, padding: '4px 12px',
                    fontSize: 11, fontWeight: 500, color: c, cursor: 'pointer',
                    transition: 'background 130ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = `${c}28`)}
                  onMouseLeave={e => (e.currentTarget.style.background = `${c}18`)}
                >
                  {ev.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Time grid */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Time gutter */}
        <div style={{ width: GUTTER_W, flexShrink: 0 }}>
          {HOURS.map(h => (
            <div key={h} style={{
              height: HOUR_PX,
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'flex-end',
              paddingRight: 16, paddingTop: 6,
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 500 }}>
                {h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`}
              </span>
            </div>
          ))}
        </div>

        {/* Event column */}
        <div style={{
          flex: 1, position: 'relative',
          borderLeft: '1px solid var(--separator-subtle)',
          paddingRight: 24, // right breathing room
        }}>
          {/* Hour lines */}
          {HOURS.map((h, hi) => (
            <div key={h} style={{
              position: 'absolute', left: 0, right: 24,
              top: hi * HOUR_PX, height: 1,
              background: 'var(--separator-subtle)',
            }} />
          ))}

          {/* Current time indicator */}
          {isToday && nowTop >= 0 && nowTop <= totalH && (
            <div style={{
              position: 'absolute', left: 0, right: 24, top: nowTop,
              height: 2, background: 'var(--color-red)', opacity: 0.65,
              zIndex: 3, display: 'flex', alignItems: 'center',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--color-red)', flexShrink: 0, marginLeft: -4,
              }} />
            </div>
          )}

          {/* Clickable slots */}
          {HOURS.map(h => (
            <div key={h}
              onClick={() => onSlotClick(ds, `${twoDigit(h)}:00`)}
              style={{
                position: 'absolute', left: 0, right: 24,
                top: (h - 7) * HOUR_PX, height: HOUR_PX,
                cursor: 'pointer', transition: 'background 130ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            />
          ))}

          {/* Events */}
          {dayEvents.map(ev => {
            const c      = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
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
                  left: 16, right: 40, zIndex: 2,
                  background: `${c}14`,
                  borderLeft: `3px solid ${c}`,
                  border: `1px solid ${c}28`,
                  borderRadius: 9,
                  padding: '8px 14px',
                  textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
                  transition: 'background 130ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${c}22`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${c}14`)}
              >
                <div style={{
                  fontSize: 13, fontWeight: 600, color: c,
                  lineHeight: 1.3,
                }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>
                  {ev.time}{ev.endTime && ` – ${ev.endTime}`}
                  {ev.type  && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {ev.type}</span>}
                  {ev.group && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {ev.group}</span>}
                </div>
                {ev.description && height > 70 && (
                  <div style={{
                    fontSize: 11, color: 'var(--text-3)', marginTop: 5,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.5,
                  }}>
                    {ev.description}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
