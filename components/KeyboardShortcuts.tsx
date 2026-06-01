'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Skip if focus is inside an input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;

      // Skip modifier combos (let browser handle Cmd+C, etc.)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 'h': case 'H':
          router.push('/');
          break;
        case 'c': case 'C':
          router.push('/courses');
          break;
        case 's': case 'S':
          router.push('/study');
          break;
        case 'a': case 'A':
          router.push('/calendar');
          break;
        case 'o': case 'O':
          router.push('/analytics');
          break;
        case '/':
          e.preventDefault();
          (document.querySelector('input[type="text"]') as HTMLInputElement | null)?.focus();
          break;
        case '?':
          // Future: open keyboard shortcut help modal
          break;
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return null;
}
