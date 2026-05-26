'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutGrid, IconBook2, IconBolt, IconCalendar,
  IconChartBar, IconUsers, IconSettings2, IconChevronRight,
} from '@tabler/icons-react';

const NAV_MAIN = [
  { href: '/',          Icon: IconLayoutGrid, label: 'Home'      },
  { href: '/courses',   Icon: IconBook2,      label: 'Courses'   },
  { href: '/study',     Icon: IconBolt,       label: 'Study'     },
  { href: '/calendar',  Icon: IconCalendar,   label: 'Calendar'  },
  { href: '/analytics', Icon: IconChartBar,   label: 'Analytics' },
];

export default function LeftSidebar() {
  const pathname  = usePathname();
  const [open, setOpen] = useState(false);

  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.aside
      animate={{ width: open ? 200 : 52 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      style={{
        background: 'var(--bg-page)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', flexShrink: 0,
        paddingTop: 8, paddingBottom: 8,
      }}
    >
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: open ? 'flex-end' : 'center',
          width: '100%', height: 36,
          background: 'transparent', border: 0, cursor: 'pointer',
          padding: open ? '0 10px' : '0',
          color: 'var(--text-4)',
          marginBottom: 4,
        }}
      >
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <IconChevronRight size={14} />
        </motion.div>
      </button>

      {/* Main nav */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
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
                padding: '0 10px',
                borderRadius: 8, textDecoration: 'none',
                color: isActive ? '#4875F0' : 'var(--text-3)',
                background: isActive ? 'rgba(72,117,240,0.10)' : 'transparent',
                borderLeft: isActive ? '2px solid #4875F0' : '2px solid transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
                transition: 'color 120ms ease, background 150ms ease',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(128,128,128,0.06)';
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <Icon size={17} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15, delay: 0.05 }}
                    style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden' }}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {/* Groups — locked */}
        <div
          title="Groups — coming soon"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 36, padding: '0 10px',
            borderRadius: 8, color: 'var(--text-4)',
            pointerEvents: 'none', opacity: 0.4,
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}
        >
          <IconUsers size={17} strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden' }}
              >
                Groups
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <Link
          href="/settings"
          title={!open ? 'Settings' : undefined}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            height: 36, padding: '0 10px',
            borderRadius: 8, textDecoration: 'none',
            color: active('/settings') ? '#4875F0' : 'var(--text-3)',
            background: active('/settings') ? 'rgba(72,117,240,0.10)' : 'transparent',
            borderLeft: active('/settings') ? '2px solid #4875F0' : '2px solid transparent',
            whiteSpace: 'nowrap', overflow: 'hidden',
            transition: 'color 120ms ease, background 150ms ease',
          }}
          onMouseEnter={e => {
            if (!active('/settings')) (e.currentTarget as HTMLElement).style.background = 'rgba(128,128,128,0.06)';
          }}
          onMouseLeave={e => {
            if (!active('/settings')) (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <IconSettings2 size={17} strokeWidth={1.75} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {open && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15, delay: 0.05 }}
                style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden' }}
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
