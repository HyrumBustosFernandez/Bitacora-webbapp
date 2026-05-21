'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, type AppState } from '@/lib/storage';
import GreetingRow from '@/components/dashboard/GreetingRow';
import AlertBanner from '@/components/dashboard/AlertBanner';
import FocusTodayCard from '@/components/dashboard/FocusTodayCard';
import StatsProgressCard from '@/components/dashboard/StatsProgressCard';
import CalendarCard from '@/components/dashboard/CalendarCard';

const GRID: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2.1fr) minmax(0, 1.7fr) minmax(0, 1.2fr)',
  gap: 10,
  alignItems: 'start',
};

function Skeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ height: 36 }} />
      <div style={GRID}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            background: '#0E0E0E',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            height: 320,
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
      <div style={GRID}>
        <FocusTodayCard state={appState} onRefresh={refresh} />
        <StatsProgressCard state={appState} />
        <CalendarCard state={appState} />
      </div>
    </div>
  );
}
