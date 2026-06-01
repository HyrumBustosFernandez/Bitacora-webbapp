'use client';

import Link from 'next/link';
import { IconPlus, IconCalendarPlus, IconBook2, IconCalendar } from '@tabler/icons-react';

const ACTIONS = [
  {
    icon: IconPlus,
    label: 'Create Task',
    sub: 'Add a new item',
    href: '/calendar',
    accent: 'var(--accent)',
    accentBg: 'var(--accent-subtle)',
    accentBorder: 'var(--accent-border)',
  },
  {
    icon: IconCalendarPlus,
    label: 'Add Event',
    sub: 'Schedule something',
    href: '/calendar',
    accent: 'var(--color-green)',
    accentBg: 'var(--color-green-subtle)',
    accentBorder: 'var(--color-green-border)',
  },
  {
    icon: IconBook2,
    label: 'Open Courses',
    sub: 'View all courses',
    href: '/courses',
    accent: 'var(--color-amber)',
    accentBg: 'var(--color-amber-subtle)',
    accentBorder: 'var(--color-amber-border)',
  },
  {
    icon: IconCalendar,
    label: 'Open Calendar',
    sub: 'See your schedule',
    href: '/calendar',
    accent: 'var(--color-red)',
    accentBg: 'var(--color-red-subtle)',
    accentBorder: 'var(--color-red-border)',
  },
];

export default function QuickActions() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span className="label-section">Quick Actions</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {ACTIONS.map(({ icon: Icon, label, sub, href, accent, accentBg, accentBorder }) => (
          <Link
            key={label}
            href={href}
            style={{ textDecoration: 'none' }}
          >
            <div
              className="card"
              style={{
                padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 10,
                borderRadius: 12, cursor: 'pointer',
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: accentBg,
                border: `1px solid ${accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={accent} strokeWidth={2} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)', lineHeight: 1.3 }}>{label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
