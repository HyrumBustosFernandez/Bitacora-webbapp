'use client';

import Link from 'next/link';

export default function StudyProgressPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/study" style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'none' }}>
          ← Study
        </Link>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Progress</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Study session history and trends
        </span>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 12, padding: '48px 24px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
      }}>
        <span style={{ fontSize: 28 }}>📈</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Coming soon</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 280 }}>
          Session history, weekly trends, and time-on-task analytics will be available in a future update.
        </span>
      </div>
    </div>
  );
}
