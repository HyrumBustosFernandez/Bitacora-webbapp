'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  IconChevronLeft, IconChevronRight,
  IconNote, IconCalendarPlus, IconClock, IconBook,
} from '@tabler/icons-react';
import { getUpcomingDeadlines, type AppState } from '@/lib/storage';

interface Props { state: AppState }

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];

const CARD: React.CSSProperties = {
  background: '#0E0E0E',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 12,
  padding: '12px 14px',
};

export default function CalendarCard({ state }: Props) {
  const today = new Date();
  const [calYear,  setCalYear]  = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

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

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const daysInPrev  = new Date(calYear, calMonth, 0).getDate();
  const isThisMonth = today.getFullYear() === calYear && today.getMonth() === calMonth;

  const cells: { day: number; type: 'prev' | 'current' | 'next'; isToday?: boolean; isDeadline?: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, type: 'prev' });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({
      day: d, type: 'current',
      isToday: isThisMonth && d === today.getDate(),
      isDeadline: deadlineDays.has(d),
    });
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, type: 'next' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Calendar */}
      <div style={CARD}>
        {/* Header */}
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#A8A29A' }}>
            {MONTHS[calMonth]} {calYear}
          </span>
          <div className="flex items-center gap-1">
            <NavBtn onClick={prev}><IconChevronLeft size={10} /></NavBtn>
            <NavBtn onClick={next}><IconChevronRight size={10} /></NavBtn>
          </div>
        </div>

        {/* Day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {DOW.map(d => (
            <div key={d} style={{
              fontSize: 9, color: '#333', textAlign: 'center',
              fontWeight: 500, padding: '2px 0',
            }}>{d}</div>
          ))}
          {cells.map((cell, i) => (
            <div
              key={i}
              style={{
                fontSize: 10, textAlign: 'center',
                height: 18, lineHeight: '18px',
                borderRadius: cell.isToday ? '50%' : 3,
                width: cell.isToday ? 18 : undefined,
                margin: cell.isToday ? '0 auto' : undefined,
                background: cell.isToday ? '#4875F0' : 'transparent',
                color: cell.isToday
                  ? '#EDE8DC'
                  : cell.type !== 'current'
                  ? '#1E1E1E'
                  : cell.isDeadline
                  ? '#F87171'
                  : '#333',
                fontWeight: cell.isToday ? 600 : 400,
                cursor: cell.type === 'current' ? 'pointer' : 'default',
              }}
            >
              {cell.day}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
          <LegendDot color="#4875F0" label="Today" />
          <LegendDot color="#F87171" label="Deadline" />
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div style={CARD}>
        <div style={{ fontSize: 10, color: '#3E3E3E', fontWeight: 500, marginBottom: 8 }}>
          Upcoming
        </div>
        {deadlines.length === 0 ? (
          <div style={{ fontSize: 10, color: '#2E2E2E' }}>No upcoming deadlines</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {deadlines.map(({ course, daysLeft }) => {
              const urgent = daysLeft <= 0;
              const soon   = daysLeft >= 1 && daysLeft <= 5;
              const dotColor = urgent ? '#EF4444' : soon ? '#F59E0B' : '#252525';
              const labelColor = urgent
                ? 'rgba(239,68,68,0.6)'
                : soon
                ? 'rgba(245,158,11,0.6)'
                : '#2E2E2E';
              const labelText = urgent
                ? 'Due today'
                : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
              return (
                <div key={course.id} className="flex items-center gap-2">
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: dotColor, flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 10, color: '#484848',
                    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {course.title}
                  </span>
                  <span style={{ fontSize: 9, color: labelColor, flexShrink: 0 }}>
                    {labelText}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div style={CARD}>
        <div style={{ fontSize: 10, color: '#3E3E3E', fontWeight: 500, marginBottom: 8 }}>
          Quick actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <QuickAction icon={<IconNote size={12} />} label="Add note" href="/study" />
          <QuickAction icon={<IconCalendarPlus size={12} />} label="Add event" href="/" />
          <QuickAction icon={<IconClock size={12} />} label="Timer" href="/study" />
          <QuickAction icon={<IconBook size={12} />} label="Courses" href="/courses" />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center border-0 cursor-pointer"
      style={{
        width: 17, height: 17,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 4,
        color: '#484848',
        padding: 0,
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

function QuickAction({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 4, padding: '8px 9px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        textDecoration: 'none',
        color: '#3A3A3A',
      }}
    >
      {icon}
      <span style={{ fontSize: 9, color: '#484848', fontWeight: 500 }}>{label}</span>
    </Link>
  );
}
