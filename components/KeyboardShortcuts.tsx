'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SHORTCUTS = [
  { key: 'H', description: 'Go to Home' },
  { key: 'C', description: 'Go to Courses' },
  { key: 'S', description: 'Go to Study' },
  { key: 'A', description: 'Go to Calendar' },
  { key: 'O', description: 'Go to Analytics' },
  { key: 'I', description: 'Go to AI Assistant' },
  { key: 'P', description: 'Go to Preferences' },
  { key: '/', description: 'Focus search bar' },
  { key: '?', description: 'Show / hide this panel' },
  { key: 'Esc', description: 'Close this panel' },
];

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Escape always closes the panel
      if (e.key === 'Escape') {
        setShowHelp(false);
        return;
      }

      if (inInput) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 'h': case 'H': router.push('/home');      break;
        case 'c': case 'C': router.push('/courses');   break;
        case 's': case 'S': router.push('/study');     break;
        case 'a': case 'A': router.push('/calendar');  break;
        case 'o': case 'O': router.push('/analytics'); break;
        case 'i': case 'I': router.push('/ai');        break;
        case 'p': case 'P': router.push('/settings');  break;
        case '/':
          e.preventDefault();
          (document.querySelector('input[type="text"]') as HTMLInputElement | null)?.focus();
          break;
        case '?':
          setShowHelp(v => !v);
          break;
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  if (!showHelp) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={() => setShowHelp(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--overlay)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        className="modal-panel card"
        onClick={e => e.stopPropagation()}
        style={{
          width: 340, padding: '20px 22px',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)' }}>Keyboard shortcuts</span>
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 18, lineHeight: 1, padding: 2 }}
          >×</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {SHORTCUTS.map(({ key, description }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{description}</span>
              <kbd style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                minWidth: 28, height: 22, padding: '0 6px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                borderBottom: '2px solid var(--border-strong)',
                borderRadius: 5, fontSize: 11, fontWeight: 600,
                color: 'var(--text-1)', fontFamily: 'monospace',
              }}>
                {key}
              </kbd>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 14, marginBottom: 0 }}>
          Press <kbd style={{ fontSize: 10, fontFamily: 'monospace', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 3, padding: '1px 4px' }}>?</kbd> or <kbd style={{ fontSize: 10, fontFamily: 'monospace', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 3, padding: '1px 4px' }}>Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}
