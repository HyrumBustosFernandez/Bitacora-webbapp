'use client';

import { useState, useEffect } from 'react';
import { IconFlame } from '@tabler/icons-react';
import type { AppState } from '@/lib/storage';

interface Props { state: AppState }

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function GreetingRow({ state }: Props) {
  const name = (state.userName as string) || 'Hyrum';
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const val = parseInt(localStorage.getItem('paceup_streak_count') || '0');
    setStreak(val);
  }, []);

  const showStreak = streak >= 2;

  return (
    <div className="flex items-center justify-between">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>
          {getGreeting()}, {name}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 400 }}>
          {formatDate()}
        </span>
      </div>

      {showStreak && (
        <div
          className="flex items-center gap-1"
          style={{
            border: '1px solid rgba(251,191,36,0.2)',
            color: 'rgba(251,191,36,0.75)',
            borderRadius: 20,
            padding: '4px 10px',
            fontSize: 11,
            fontWeight: 500,
          }}
        >
          <IconFlame size={13} />
          {streak}-day streak
        </div>
      )}
    </div>
  );
}
