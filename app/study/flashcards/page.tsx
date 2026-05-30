'use client';

import Link from 'next/link';

export default function StudyFlashcardsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/study" style={{ fontSize: 11, color: 'var(--text-3)', textDecoration: 'none' }}>
          ← Study
        </Link>
        <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Flashcards</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Spaced-repetition flashcard practice
        </span>
      </div>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 12, padding: '48px 24px',
        textAlign: 'center',
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
      }}>
        <span style={{ fontSize: 28 }}>🗃️</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>Coming soon</span>
        <span style={{ fontSize: 12, color: 'var(--text-3)', maxWidth: 280 }}>
          Flashcards with spaced repetition will be available in a future update.
        </span>
      </div>
    </div>
  );
}
