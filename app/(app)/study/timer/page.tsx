'use client';

import Link from 'next/link';
import PomodoroTimer from '@/components/study/PomodoroTimer';
import ContextualTip from '@/components/ContextualTip';

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

      <ContextualTip
        id="study-timer-tip"
        text="Research shows that timed study sessions with planned breaks (the Pomodoro Technique) significantly improve focus and retention. A 2016 study in Cognition found that brief mental breaks help maintain sustained attention. Start with 25-minute sprints and take a 5-minute break — your brain consolidates memory during rest."
      />

      <div style={{ maxWidth: 400 }}>
        <PomodoroTimer />
      </div>
    </div>
  );
}
