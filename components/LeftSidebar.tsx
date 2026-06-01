'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutGrid, IconBook2, IconBolt, IconCalendar,
  IconChartBar, IconUsers, IconSettings2,
  IconTag, IconBell,
  IconHome, IconClock, IconFileText, IconStack2, IconTrendingUp,
} from '@tabler/icons-react';

/* ── Sidebar brand colors ── */
const SB_BG          = '#1a1a1a';
const SB_ACTIVE_BG   = 'rgba(255,255,255,0.13)';
const SB_HOVER_BG    = 'rgba(255,255,255,0.08)';
const SB_TEXT        = 'rgba(255,255,255,0.55)';
const SB_TEXT_ACTIVE = '#ffffff';
const SB_BORDER_L    = 'rgba(255,255,255,0.80)';

/* ── Panda logo ── */
function PandaLogo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 305 285" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
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
  { href: '/analytics', Icon: IconChartBar,   label: 'Overview'  },
];

const LABEL_MOTION = {
  initial:    { opacity: 0, x: -6 },
  animate:    { opacity: 1, x: 0  },
  exit:       { opacity: 0, x: -6 },
  transition: { duration: 0.14, delay: 0.05 },
};

const CAL_SUBSECTIONS = [
  { label: 'Types',     Icon: IconTag   },
  { label: 'Reminders', Icon: IconBell  },
  { label: 'Groups',    Icon: IconUsers },
];

const STUDY_SUBSECTIONS = [
  { label: 'Overview',    Icon: IconHome,        route: '/study'            },
  { label: 'Quick Study', Icon: IconBolt,        route: '/study/quick'      },
  { label: 'Timer',       Icon: IconClock,       route: '/study/timer'      },
  { label: 'Notes',       Icon: IconFileText,    route: '/study/notes'      },
  { label: 'Flashcards',  Icon: IconStack2,      route: '/study/flashcards' },
  { label: 'Progress',    Icon: IconTrendingUp,  route: '/study/progress'   },
];

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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <motion.aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ width: open ? 200 : 52 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: SB_BG,
        boxShadow: '2px 0 20px rgba(20,30,70,0.22), 1px 0 0 rgba(255,255,255,0.04)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* ── Logo zone ── */}
      <Link
        href="/"
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          height: 52, padding: '0 13px',
          marginBottom: 10, flexShrink: 0,
          color: '#ffffff', textDecoration: 'none',
          borderRadius: 8,
          transition: 'opacity 130ms ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <PandaLogo size={26} />
        <AnimatePresence>
          {open && (
            <motion.span {...LABEL_MOTION} style={{
              fontSize: 14, fontWeight: 700,
              color: '#ffffff', opacity: 0.93,
              whiteSpace: 'nowrap', overflow: 'hidden',
              letterSpacing: '-0.015em',
            }}>
              PaceUp
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      {/* ── Main nav ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 6px' }}>
        {NAV_MAIN.map(({ href, Icon, label }) => {
          const active     = isActive(href);
          const isCalendar = href === '/calendar';
          const isStudy    = href === '/study';
          const showCalSubs   = isCalendar && active;
          const showStudySubs = isStudy    && active;

          return (
            <div key={href}>
              <Link
                href={href}
                title={!open ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, height: 36, padding: '0 9px',
                  borderRadius: 8, textDecoration: 'none',
                  color: active ? SB_TEXT_ACTIVE : SB_TEXT,
                  background: active ? SB_ACTIVE_BG : 'transparent',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                  fontWeight: active ? 600 : 500,
                  fontSize: 12,
                  position: 'relative',
                  transition: 'color 130ms ease, background-color 130ms ease',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = SB_HOVER_BG;
                  if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)';
                }}
                onMouseLeave={e => {
                  if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  if (!active) (e.currentTarget as HTMLElement).style.color = SB_TEXT;
                }}
              >
                {active && (
                  <span style={{
                    position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)',
                    width: 2.5, height: 18,
                    background: SB_BORDER_L,
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}
                <Icon size={17} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
                <AnimatePresence>
                  {open && (
                    <motion.span {...LABEL_MOTION} style={{ overflow: 'hidden', flex: 1 }}>
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>

              </Link>

              {/* Calendar subsections */}
              {showCalSubs && (
                <div style={{ paddingLeft: 10 }}>
                  {CAL_SUBSECTIONS.map(({ label: subLabel, Icon: SubIcon }) => (
                    <div
                      key={subLabel}
                      title={!open ? subLabel : undefined}
                      style={{
                        display: 'flex', alignItems: 'center',
                        gap: 8, height: 30, padding: '0 9px',
                        borderRadius: 7, cursor: 'pointer',
                        color: SB_TEXT,
                        fontSize: 11, fontWeight: 400,
                        whiteSpace: 'nowrap', overflow: 'hidden',
                        transition: 'background 130ms ease, color 130ms ease',
                        marginLeft: 8,
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = SB_HOVER_BG;
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = SB_TEXT;
                      }}
                    >
                      <SubIcon size={13} strokeWidth={1.6} style={{ flexShrink: 0, opacity: 0.7 }} />
                      <AnimatePresence>
                        {open && (
                          <motion.span {...LABEL_MOTION} style={{ overflow: 'hidden' }}>
                            {subLabel}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              )}

              {/* Study subsections */}
              {showStudySubs && (
                <div style={{ paddingLeft: 10 }}>
                  {STUDY_SUBSECTIONS.map(({ label: subLabel, Icon: SubIcon, route }) => {
                    const subActive = pathname === route;
                    return (
                      <Link
                        key={route}
                        href={route}
                        title={!open ? subLabel : undefined}
                        style={{
                          display: 'flex', alignItems: 'center',
                          gap: 8, height: 30, padding: '0 9px',
                          borderRadius: 7, textDecoration: 'none',
                          color: subActive ? SB_TEXT_ACTIVE : SB_TEXT,
                          background: subActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                          fontSize: 11, fontWeight: subActive ? 500 : 400,
                          whiteSpace: 'nowrap', overflow: 'hidden',
                          transition: 'background 130ms ease, color 130ms ease',
                          marginLeft: 8,
                        }}
                        onMouseEnter={e => {
                          if (!subActive) {
                            (e.currentTarget as HTMLElement).style.background = SB_HOVER_BG;
                            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!subActive) {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = SB_TEXT;
                          }
                        }}
                      >
                        <SubIcon size={13} strokeWidth={1.6} style={{ flexShrink: 0, opacity: subActive ? 1 : 0.7 }} />
                        <AnimatePresence>
                          {open && (
                            <motion.span {...LABEL_MOTION} style={{ overflow: 'hidden' }}>
                              {subLabel}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* ── Bottom items ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 6px' }}>
        {(() => {
          const active = isActive('/settings');
          return (
            <Link
              href="/settings"
              title={!open ? 'Settings' : undefined}
              style={{
                display: 'flex', alignItems: 'center',
                gap: 10, height: 36, padding: '0 9px',
                borderRadius: 8, textDecoration: 'none',
                color: active ? SB_TEXT_ACTIVE : SB_TEXT,
                background: active ? SB_ACTIVE_BG : 'transparent',
                whiteSpace: 'nowrap', overflow: 'hidden',
                fontWeight: active ? 600 : 500, fontSize: 12,
                position: 'relative',
                transition: 'color 130ms ease, background-color 130ms ease',
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = SB_HOVER_BG;
                if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.88)';
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                if (!active) (e.currentTarget as HTMLElement).style.color = SB_TEXT;
              }}
            >
              {active && (
                <span style={{
                  position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)',
                  width: 2.5, height: 18, background: SB_BORDER_L, borderRadius: '0 2px 2px 0',
                }} />
              )}
              <IconSettings2 size={17} strokeWidth={active ? 2 : 1.75} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {open && <motion.span {...LABEL_MOTION} style={{ overflow: 'hidden' }}>Settings</motion.span>}
              </AnimatePresence>
            </Link>
          );
        })()}
      </div>

      {/* ── Bottom padding ── */}
      <div style={{ height: 10 }} />
    </motion.aside>
  );
}
