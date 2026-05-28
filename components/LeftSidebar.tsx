'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutGrid, IconBook2, IconBolt, IconCalendar,
  IconChartBar, IconUsers, IconSettings2,
} from '@tabler/icons-react';

/* ── PaceUp panda logo (from panda-icon-2 SVG) ── */
function PandaLogo({ size = 26 }: { size?: number }) {
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

const NAV_MAIN = [
  { href: '/',          Icon: IconLayoutGrid, label: 'Home'      },
  { href: '/courses',   Icon: IconBook2,      label: 'Courses'   },
  { href: '/study',     Icon: IconBolt,       label: 'Study'     },
  { href: '/calendar',  Icon: IconCalendar,   label: 'Calendar'  },
  { href: '/analytics', Icon: IconChartBar,   label: 'Analytics' },
];

const LABEL_MOTION = {
  initial:  { opacity: 0, x: -4 },
  animate:  { opacity: 1, x: 0 },
  exit:     { opacity: 0, x: -4 },
  transition: { duration: 0.12, delay: 0.06 },
};

export default function LeftSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(true), 100);
  }

  function handleMouseLeave() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), 200);
  }

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: open ? 200 : 52 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', flexShrink: 0,
        paddingTop: 8, paddingBottom: 8,
      }}
    >
      {/* Logo zone */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 44, padding: '0 13px',
        marginBottom: 8, flexShrink: 0,
        color: 'var(--text-1)',
      }}>
        <PandaLogo size={26} />
        <AnimatePresence>
          {open && (
            <motion.span {...LABEL_MOTION}
              style={{
                fontSize: 13, fontWeight: 700,
                color: 'var(--text-1)',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}
            >
              PaceUp
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Main nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px' }}>
        {NAV_MAIN.map(({ href, Icon, label }) => {
          const isActive = active(href);
          return (
            <Link
              key={href}
              href={href}
              title={!open ? label : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 10, height: 36,
                padding: '0 8px',
                borderRadius: 8, textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
                transition: 'color 130ms ease, background-color 130ms ease, box-shadow 130ms ease',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <Icon size={17} strokeWidth={isActive ? 2 : 1.75} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {open && (
                  <motion.span {...LABEL_MOTION}
                    style={{
                      fontSize: 12,
                      fontWeight: isActive ? 600 : 500,
                      overflow: 'hidden',
                    }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 6px' }}>
        {/* Groups — locked */}
        <div
          title="Groups — coming soon"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 36, padding: '0 8px',
            borderRadius: 8, color: 'var(--text-4)',
            pointerEvents: 'none', opacity: 0.35,
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}
        >
          <IconUsers size={17} strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {open && (
              <motion.span {...LABEL_MOTION}
                style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden' }}
              >
                Groups
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        {(() => {
          const isActive = active('/settings');
          return (
            <Link
              href="/settings"
              title={!open ? 'Settings' : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                height: 36, padding: '0 8px',
                borderRadius: 8, textDecoration: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-3)',
                background: isActive ? 'var(--accent-subtle)' : 'transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
                transition: 'color 130ms ease, background-color 130ms ease, box-shadow 130ms ease',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <IconSettings2 size={17} strokeWidth={isActive ? 2 : 1.75} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {open && (
                  <motion.span {...LABEL_MOTION}
                    style={{ fontSize: 12, fontWeight: isActive ? 600 : 500, overflow: 'hidden' }}
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })()}
      </div>
    </motion.aside>
  );
}
