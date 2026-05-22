'use client';

import { getGlobalItems, getDaysLeft, getTrackInfo, type AppState } from '@/lib/storage';
import { COURSES } from '@/lib/courses';

interface Props { state: AppState }

export default function StatsRow({ state }: Props) {
  const { total, done } = getGlobalItems(state);
  const daysLeft        = getDaysLeft();
  const track           = getTrackInfo(null, state);
  const todayTarget     = total > 0 && daysLeft > 0
    ? Math.ceil((total - done) / daysLeft)
    : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
      <Card label="Courses"    value={String(COURSES.length)} />
      <Card label="Items done" value={String(done)}    sub={`of ${total}`} />
      <Card
        label="Days left"
        value={String(daysLeft)}
        sub="until Jun 10"
        valueColor={daysLeft < 30 ? '#F59E0B' : undefined}
      />
      <Card
        label="Today"
        value={String(todayTarget)}
        sub="items to do"
      />
    </div>
  );
}

function Card({
  label, value, sub, valueColor,
}: {
  label: string; value: string; sub?: string; valueColor?: string;
}) {
  return (
    <div style={{
      background: '#0E0E0E',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}>
      <span style={{
        fontSize: 9, fontWeight: 600, color: '#484848',
        textTransform: 'uppercase', letterSpacing: '0.6px',
      }}>
        {label}
      </span>
      <span style={{ fontSize: 28, fontWeight: 600, color: valueColor ?? '#EDE8DC', lineHeight: 1 }}>
        {value}
      </span>
      {sub && (
        <span style={{ fontSize: 10, color: '#2E2E2E', fontWeight: 400 }}>{sub}</span>
      )}
    </div>
  );
}
