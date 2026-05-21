'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconSearch,
  IconMoon,
  IconLock,
} from '@tabler/icons-react';

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Courses',   href: '/courses' },
  { label: 'Study',     href: '/study' },
  { label: 'Analytics', href: '/analytics' },
];

export default function TopNav() {
  const pathname = usePathname();

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-[#080808] flex items-center px-4 gap-1 shrink-0"
      style={{ height: 44, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[7px] mr-3 shrink-0 no-underline">
        <span
          className="flex items-center justify-center shrink-0"
          style={{
            width: 22,
            height: 22,
            borderRadius: 7,
            background: '#4875F0',
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1 }}>B</span>
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#EDE8DC' }}>Bitácora</span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="no-underline transition-colors duration-150"
            style={{
              fontSize: 12,
              fontWeight: 500,
              padding: '5px 11px',
              borderRadius: 7,
              color: active(href) ? '#EDE8DC' : '#3E3E3E',
              background: active(href) ? 'rgba(255,255,255,0.05)' : 'transparent',
            }}
          >
            {label}
          </Link>
        ))}

        {/* Groups — locked, future feature */}
        <span
          className="flex items-center gap-1"
          style={{
            fontSize: 12,
            fontWeight: 500,
            padding: '5px 11px',
            borderRadius: 7,
            color: '#2A2A2A',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <IconLock size={11} />
          Groups
        </span>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <label
          className="flex items-center gap-[6px]"
          style={{
            width: 160,
            height: 28,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8,
            padding: '0 9px',
            cursor: 'text',
          }}
        >
          <IconSearch size={12} color="#484848" />
          <input
            type="text"
            placeholder="Search…"
            className="bg-transparent border-0 outline-none w-full font-[inherit]"
            style={{
              color: '#EDE8DC',
              fontSize: 12,
              fontWeight: 400,
            }}
          />
        </label>

        {/* Dark mode toggle */}
        <button
          type="button"
          className="flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer"
          style={{ color: '#333' }}
          aria-label="Toggle dark mode"
        >
          <IconMoon size={16} />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#4875F0',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', lineHeight: 1 }}>H</span>
        </div>
      </div>
    </nav>
  );
}
