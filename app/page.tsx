'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, type AppState } from '@/lib/storage';
import GreetingRow from '@/components/dashboard/GreetingRow';
import AlertBanner from '@/components/dashboard/AlertBanner';
import StatsRow from '@/components/dashboard/StatsRow';
import FocusTodayCard from '@/components/dashboard/FocusTodayCard';
import OverallProgressCard from '@/components/dashboard/OverallProgressCard';
import CalendarCard from '@/components/dashboard/CalendarCard';
import ExternalToolsStrip from '@/components/dashboard/ExternalToolsStrip';

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 36 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            background: '#0E0E0E',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            height: 80,
            opacity: 0.35,
          }} />
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.9fr) minmax(0, 1fr)', gap: 10 }}>
        {[0, 1].map(i => (
          <div key={i} style={{
            background: '#0E0E0E',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            height: 400,
            opacity: 0.35,
          }} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>({});
  const [mounted,  setMounted]  = useState(false);

  const refresh = useCallback(() => setAppState(loadState()), []);

  useEffect(() => {
    setMounted(true);
    setAppState(loadState());
  }, []);

  if (!mounted) return <Skeleton />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <GreetingRow state={appState} />
      <AlertBanner state={appState} />
      <StatsRow state={appState} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.9fr) minmax(0, 1fr)',
        gap: 10,
        alignItems: 'start',
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FocusTodayCard state={appState} onRefresh={refresh} />
          <OverallProgressCard state={appState} />
        </div>

        {/* Right column */}
        <CalendarCard state={appState} />
      </div>
      <ExternalToolsStrip />
    </div>
  );
}
