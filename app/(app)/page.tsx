'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, type AppState } from '@/lib/storage';
import GreetingRow from '@/components/dashboard/GreetingRow';
import AlertBanner from '@/components/dashboard/AlertBanner';
import StatsRow from '@/components/dashboard/StatsRow';
import QuickActions from '@/components/dashboard/QuickActions';
import FocusTodayCard from '@/components/dashboard/FocusTodayCard';
import OverallProgressCard from '@/components/dashboard/OverallProgressCard';
import CalendarCard from '@/components/dashboard/CalendarCard';
import ExternalToolsStrip from '@/components/dashboard/ExternalToolsStrip';
import TodayAgenda from '@/components/dashboard/TodayAgenda';
import ExamCountdown from '@/components/dashboard/ExamCountdown';

function Skeleton() {
  return (
    <div className="page-container">
      <div style={{ height: 36 }} />
      <div className="rg-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12, height: 80,
          }} />
        ))}
      </div>
      <div className="rg-home">
        {[0, 1].map(i => (
          <div key={i} className="skeleton" style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12, height: 400,
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
    <div className="page-container">
      <div style={{ marginBottom: 4 }}>
        <GreetingRow state={appState} />
      </div>

      <AlertBanner state={appState} />
      <ExamCountdown state={appState} />

      <StatsRow state={appState} />
      <QuickActions />

      <div className="rg-home">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <TodayAgenda state={appState} />
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
