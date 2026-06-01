'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutGrid,
  IconBook2,
  IconBolt,
  IconCalendar,
  IconChartBar,
} from '@tabler/icons-react';

const NAV_ITEMS = [
  { href: '/', label: 'Home', Icon: IconLayoutGrid },
  { href: '/courses', label: 'Courses', Icon: IconBook2 },
  { href: '/study', label: 'Study', Icon: IconBolt },
  { href: '/calendar', label: 'Calendar', Icon: IconCalendar },
  { href: '/analytics', label: 'Overview', Icon: IconChartBar },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" aria-label="Primary navigation">
      <ul
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          height: 56,
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <li
              key={href}
              style={{
                flex: 1,
                display: 'flex',
              }}
            >
              <Link
                href={href}
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  width: '100%',
                  minHeight: 44,
                  textDecoration: 'none',
                  color: isActive
                    ? 'var(--accent)'
                    : 'var(--text-3)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                <Icon
                  size={22}
                  stroke={isActive ? 2.5 : 1.75}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <style>{`
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: calc(56px + env(safe-area-inset-bottom, 0px));
          background: var(--bg-surface);
          border-top: 1px solid var(--border-subtle);
          z-index: 100;
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-nav {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}
