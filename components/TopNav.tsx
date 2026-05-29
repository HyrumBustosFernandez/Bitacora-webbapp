'use client';

import { IconSearch, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <nav
      style={{
        height: 44,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 10,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Search */}
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          width: 260, height: 28,
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '0 10px', cursor: 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
        onFocus={() => {}}
      >
        <IconSearch size={12} color="var(--text-3)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search courses, modules…"
          style={{
            background: 'transparent', border: 0, outline: 'none',
            width: '100%', color: 'var(--text-1)',
            fontSize: 11, fontWeight: 400, fontFamily: 'inherit',
          }}
          onFocus={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) {
              label.style.borderColor = 'var(--border-focus)';
              label.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
            }
          }}
          onBlur={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) {
              label.style.borderColor = 'var(--border-default)';
              label.style.boxShadow = 'none';
            }
          }}
        />
      </label>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Language badge */}
        <span style={{
          fontSize: 9, fontWeight: 700, color: 'var(--text-3)',
          border: '1px solid var(--border-default)',
          borderRadius: 5, padding: '2px 7px', letterSpacing: '0.5px',
        }}>
          EN
        </span>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="btn btn-ghost btn-icon"
          style={{ color: 'var(--text-3)' }}
        >
          {theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
        </button>

        {/* Avatar */}
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--accent-subtle)',
          border: '1.5px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>H</span>
        </div>
      </div>
    </nav>
  );
}
