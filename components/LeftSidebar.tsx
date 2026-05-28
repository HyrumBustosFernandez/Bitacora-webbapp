'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutGrid, IconBook2, IconBolt, IconCalendar,
  IconChartBar, IconUsers, IconSettings2,
} from '@tabler/icons-react';

/* ── Panda yin-yang logo ── */
function PandaLogo({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <circle cx="50" cy="50" r="50" fill="currentColor" />
      <g transform="rotate(135 50 50)">
        {/* White yin-yang fish — forms panda face */}
        <path
          d="M 50 0 A 50 50 0 1 1 50 100 A 25 25 0 1 1 50 50 A 25 25 0 0 0 50 0 Z"
          fill="white"
        />
        {/* Eye in white area */}
        <circle cx="50" cy="25" r="9" fill="currentColor" />
        {/* Eye in black area */}
        <circle cx="50" cy="75" r="9" fill="white" />
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
                boxShadow: isActive ? 'inset 2px 0 0 var(--accent)' : 'none',
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
                boxShadow: isActive ? 'inset 2px 0 0 var(--accent)' : 'none',
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
