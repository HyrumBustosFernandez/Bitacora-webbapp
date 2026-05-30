'use client';

import { useState, useEffect } from 'react';
import { IconFlame, IconCalendar } from '@tabler/icons-react';
import { getDaysLeft, getGlobalItems, type AppState } from '@/lib/storage';

interface Props { state: AppState }

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function GreetingRow({ state }: Props) {
  const name = (state.userName as string) || 'Hyrum';
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const val = parseInt(localStorage.getItem('paceup_streak_count') || '0');
    setStreak(val);
  }, []);

  const daysLeft = getDaysLeft();
  const { total, done } = getGlobalItems(state);
  const remaining = total - done;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontSize: 22, fontWeight: 700,
            color: 'var(--text-1)',
            letterSpacing: '-0.025em', lineHeight: 1.2,
          }}>
            {getGreeting()}, {name} 👋
          </div>
        </div>

        {/* Streak badge */}
        {streak >= 2 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(245,158,11,0.09)',
            border: '1px solid rgba(245,158,11,0.25)',
            borderRadius: 20, padding: '5px 12px',
            fontSize: 11, fontWeight: 600,
            color: 'var(--color-amber)',
          }}>
            <IconFlame size={13} />
            {streak}-day streak
          </div>
        )}
      </div>

      {/* Info pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'var(--accent-subtle)',
        border: '1px solid var(--accent-border)',
        borderRadius: 20, padding: '4px 12px',
        fontSize: 11, fontWeight: 500,
        color: 'var(--accent)',
        width: 'fit-content',
      }}>
        <IconCalendar size={11} strokeWidth={2} />
        {remaining > 0
          ? `${remaining} items remaining`
          : 'All caught up!'
        }
        &nbsp;·&nbsp;
        {daysLeft > 0 ? `${daysLeft} days until Jun 10` : 'Deadline reached'}
      </div>
    </div>
  );
}
