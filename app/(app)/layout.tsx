'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LeftSidebar from '@/components/LeftSidebar';
import TopNav from '@/components/TopNav';
import BottomBar from '@/components/BottomBar';
import MobileNav from '@/components/MobileNav';
import StreakInit from '@/components/StreakInit';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('paceup_authed')) {
      router.replace('/');
    }
  }, [router]);

  return (
    <>
      <StreakInit />
      <KeyboardShortcuts />

      <div className="desktop-sidebar" style={{ flexShrink: 0 }}>
        <LeftSidebar />
      </div>

      <div className="glass-surface" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, overflowY: 'auto', padding: 24, minHeight: 0 }}>
          {children}
        </main>
        <div className="desktop-footer"><BottomBar /></div>
      </div>

      <MobileNav />
    </>
  );
}
