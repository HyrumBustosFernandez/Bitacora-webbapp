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

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7);
const HOUR_PX = 64;

export default function DayView({ date, events, onSlotClick, onEventClick }: Props) {
  const today = new Date();
  const ds = toDateStr(date);
  const isToday = ds === toDateStr(today);
  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  const nowTop = ((nowMinutes - 7 * 60) / 60) * HOUR_PX;
  const totalH = HOURS.length * HOUR_PX;

  const dayEvents = events.filter(e => e.date === ds && e.time);
  const allDayEvents = events.filter(e => e.date === ds && !e.time);

  const dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

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

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px', borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0, position: 'sticky', top: 0,
        background: 'var(--bg-page)', zIndex: 2,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
          {dateLabel}
          {isToday && <span style={{ marginLeft: 10, fontSize: 10, color: 'var(--accent)', fontWeight: 500, background: 'var(--accent-subtle)', padding: '2px 8px', borderRadius: 20 }}>Today</span>}
        </span>
        {allDayEvents.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {allDayEvents.map(ev => {
              const c = ev.color || EVENT_TYPE_COLORS[ev.type] || '#6B7280';
              return (
                <button key={ev.id} type="button" onClick={() => onEventClick(ev)}
                  style={{
                    background: `${c}20`, border: `1px solid ${c}40`,
                    borderRadius: 6, padding: '3px 10px',
                    fontSize: 11, fontWeight: 500, color: c, cursor: 'pointer',
                  }}>
                  {ev.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Time grid */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Time labels */}
        <div style={{ width: 64, flexShrink: 0 }}>
          {HOURS.map(h => (
            <div key={h} style={{
              height: HOUR_PX, display: 'flex',
              alignItems: 'flex-start', justifyContent: 'flex-end',
              paddingRight: 12, paddingTop: 4,
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                {h === 12 ? '12pm' : h > 12 ? `${h - 12}pm` : `${h}am`}
              </span>
            </div>
          ))}
        </div>

        {/* Event column */}
        <div style={{ flex: 1, position: 'relative', borderLeft: '1px solid var(--border-subtle)' }}>
          {HOURS.map((h, hi) => (
            <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: hi * HOUR_PX, height: 1, background: 'var(--border-subtle)' }} />
          ))}

          {/* Current time */}
          {isToday && nowTop >= 0 && nowTop <= totalH && (
            <div style={{
              position: 'absolute', left: 0, right: 0, top: nowTop,
              height: 2, background: 'rgba(239,68,68,0.7)', zIndex: 3, display: 'flex', alignItems: 'center',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(239,68,68,0.8)', flexShrink: 0, marginLeft: -4 }} />
            </div>
          )}

          {/* Click slots */}
          {HOURS.map(h => (
            <div key={h}
              onClick={() => onSlotClick(ds, `${twoDigit(h)}:00`)}
              style={{ position: 'absolute', left: 0, right: 0, top: (h - 7) * HOUR_PX, height: HOUR_PX, cursor: 'pointer' }}
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
                  left: 12, right: 12, zIndex: 2,
                  background: `${c}18`, borderLeft: `3px solid ${c}`,
                  borderRadius: 8, padding: '6px 12px',
                  textAlign: 'left', cursor: 'pointer', overflow: 'hidden',
                  border: `1px solid ${c}30`,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: c }}>{ev.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>
                  {ev.time}{ev.endTime && ` – ${ev.endTime}`}
                  {ev.type && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {ev.type}</span>}
                  {ev.group && <span style={{ marginLeft: 8, opacity: 0.7 }}>· {ev.group}</span>}
                </div>
                {ev.description && height > 60 && (
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
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
