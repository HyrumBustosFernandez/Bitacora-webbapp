'use client';

import Link from 'next/link';
import { IconSearch, IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';

function PandaLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 305 285"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <g transform="translate(0,285) scale(0.1,-0.1)" fill="currentColor" stroke="none">
        <path d="M1365 2530 c-214 -30 -431 -121 -588 -246 -61 -47 -70 -66 -20 -41 15 8 62 25 103 37 483 144 953 -36 1065 -407 21 -68 19 -83 -8 -83 -52 0 -84 -74 -65 -149 14 -55 75 -119 194 -203 100 -70 168 -143 202 -216 35 -75 38 -193 6 -263 -29 -63 -79 -116 -135 -145 -57 -28 -74 -30 -65 -7 13 34 27 168 21 200 -7 41 -25 50 -66 33 -22 -9 -53 -47 -113 -139 -111 -169 -153 -213 -234 -253 -58 -29 -76 -33 -142 -32 -63 0 -86 5 -134 30 -65 32 -114 84 -148 153 -18 36 -23 64 -23 126 0 71 4 88 32 146 35 70 102 145 234 261 87 76 115 123 131 221 22 133 -38 302 -141 401 -100 94 -213 137 -366 137 -210 0 -384 -71 -531 -218 -315 -315 -270 -874 103 -1247 223 -224 500 -340 813 -340 311 0 577 110 795 329 133 132 218 270 275 445 31 95 60 264 60 350 0 145 -54 369 -121 501 -158 314 -454 540 -790 604 -104 19 -265 27 -344 15z m-36 -876 c53 -45 51 -132 -5 -169 -31 -20 -103 -19 -130 3 -55 44 -59 109 -10 158 44 44 99 47 145 8z" />
        <path d="M1933 1330 c-84 -38 -103 -115 -43 -174 24 -25 39 -30 88 -34 120 -9 204 83 152 166 -37 60 -119 78 -197 42z" />
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
