'use client';

import Link from 'next/link';
import { IconSearch, IconDeviceLaptop } from '@tabler/icons-react';

export default function TopNav() {
  return (
    <nav
      className="sticky top-0 z-50 w-full bg-[#080808] flex items-center px-4 shrink-0"
      style={{ height: 44, borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 10 }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-[7px] shrink-0 no-underline">
        <span
          className="flex items-center justify-center shrink-0"
          style={{ width: 22, height: 22, borderRadius: 7, background: '#4875F0' }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1 }}>B</span>
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#EDE8DC' }}>Bitácora</span>
      </Link>

      {/* Search — wider */}
      <label
        className="flex items-center gap-[6px]"
        style={{
          width: 240,
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
          placeholder="Search courses, modules…"
          className="bg-transparent border-0 outline-none w-full font-[inherit]"
          style={{ color: '#EDE8DC', fontSize: 11, fontWeight: 400 }}
        />
      </label>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Language */}
        <span style={{
          fontSize: 11, fontWeight: 500, color: '#A8A29A',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 5, padding: '2px 7px',
          letterSpacing: '0.3px',
        }}>
          EN
        </span>

        {/* Dark mode toggle */}
        <button
          type="button"
          className="flex items-center justify-center bg-transparent border-0 cursor-pointer p-1"
          style={{ color: '#333' }}
          aria-label="Toggle theme"
        >
          <IconDeviceLaptop size={16} />
        </button>

        {/* Avatar */}
        <div
          className="flex items-center justify-center shrink-0"
          style={{
            width: 26, height: 26, borderRadius: '50%',
            background: '#2A2A2A',
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: '#A8A29A', lineHeight: 1 }}>H</span>
        </div>
      </div>
    </nav>
  );
}
