'use client';

import Link from 'next/link';
import { IconSearch, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';

function PandaLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <circle cx="50" cy="50" r="50" fill="currentColor" />
      <g transform="rotate(135 50 50)">
        <path
          d="M 50 0 A 50 50 0 1 1 50 100 A 25 25 0 1 1 50 50 A 25 25 0 0 0 50 0 Z"
          fill="white"
        />
        <circle cx="50" cy="25" r="9" fill="currentColor" />
        <circle cx="50" cy="75" r="9" fill="white" />
      </g>
    </svg>
  );
}

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50, width: '100%',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 44,
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        gap: 10,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          textDecoration: 'none', flexShrink: 0,
          color: 'var(--text-1)',
        }}
      >
        <PandaLogo size={22} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
          PaceUp
        </span>
      </Link>

      {/* Search */}
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          width: 240, height: 28,
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '0 10px', cursor: 'text',
          transition: 'border-color 130ms ease',
        }}
        onFocus={() => {}}
      >
        <IconSearch size={12} color="var(--text-3)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search courses, modules…"
          style={{
            background: 'transparent', border: 0, outline: 'none', width: '100%',
            color: 'var(--text-1)', fontSize: 11, fontWeight: 400,
            fontFamily: 'inherit',
          }}
          onFocus={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) label.style.borderColor = 'var(--border-focus)';
          }}
          onBlur={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) label.style.borderColor = 'var(--border-default)';
          }}
        />
      </label>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Language badge */}
        <span style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text-3)',
          border: '1px solid var(--border-default)',
          borderRadius: 5, padding: '2px 7px', letterSpacing: '0.4px',
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
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--accent-subtle)',
          border: '1px solid var(--accent-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>H</span>
        </div>
      </div>
    </nav>
  );
}
