'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconLayoutGrid,
  IconBook2,
  IconBolt,
  IconChartBar,
  IconSettings2,
} from '@tabler/icons-react';

const NAV = [
  { href: '/',          Icon: IconLayoutGrid },
  { href: '/courses',   Icon: IconBook2 },
  { href: '/study',     Icon: IconBolt },
  { href: '/analytics', Icon: IconChartBar },
  { href: '/settings',  Icon: IconSettings2 },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const active = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <aside
      className="flex flex-col items-center shrink-0"
      style={{
        width: 60,
        background: '#080808',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        paddingTop: 12,
        gap: 4,
      }}
    >
      {NAV.map(({ href, Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center justify-center no-underline"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            color:      active(href) ? '#4875F0' : '#333',
            background: active(href) ? 'rgba(72,117,240,0.10)' : 'transparent',
            transition: 'color 0.15s, background 0.15s',
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </Link>
      ))}
    </aside>
  );
}
