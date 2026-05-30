'use client';

import Link from 'next/link';
import PomodoroTimer from '@/components/study/PomodoroTimer';

export default function StudyTimerPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/study" style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'none' }}>
          ← Study
        </Link>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Pomodoro Timer</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          25-minute focused sprints with scheduled breaks
        </span>
      </div>

      <div style={{ maxWidth: 400 }}>
        <PomodoroTimer />
      </div>
    </div>
  );
}
