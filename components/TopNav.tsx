'use client';

import Link from 'next/link';
import { IconSearch, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';

function BalanceLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* tilted line */}
      <line x1="10" y1="62" x2="90" y2="30" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* circle sitting on the line, slightly left of center */}
      <circle cx="42" cy="58" r="18" fill="currentColor" />
    </svg>
  );
}

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50, width: '100%',
        background: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-default)',
        height: 44,
        display: 'flex', alignItems: 'center',
        padding: '0 16px',
        gap: 10,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 7, textDecoration: 'none', flexShrink: 0 }}>
        <span style={{ color: 'var(--text-1)', display: 'flex', alignItems: 'center' }}>
          <BalanceLogo size={22} />
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>PaceUp</span>
      </Link>

      {/* Search */}
      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          width: 240, height: 28,
          background: 'rgba(128,128,128,0.06)',
          border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '0 9px', cursor: 'text',
        }}
      >
        <IconSearch size={12} color="var(--text-3)" />
        <input
          type="text"
          placeholder="Search courses, modules…"
          style={{
            background: 'transparent', border: 0, outline: 'none', width: '100%',
            color: 'var(--text-1)', fontSize: 11, fontWeight: 400,
            fontFamily: 'inherit',
          }}
        />
      </label>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Language */}
        <span style={{
          fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
          border: '1px solid var(--border-default)',
          borderRadius: 5, padding: '2px 7px', letterSpacing: '0.3px',
        }}>
          EN
        </span>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 7,
            background: 'transparent',
            border: '1px solid var(--border-default)',
            color: 'var(--text-3)', cursor: 'pointer',
          }}
        >
          {theme === 'dark'
            ? <IconSun size={14} />
            : <IconMoon size={14} />
          }
        </button>

        {/* Avatar */}
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-2)', lineHeight: 1 }}>H</span>
        </div>
      </div>
    </nav>
  );
}
