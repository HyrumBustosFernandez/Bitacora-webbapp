'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadState, type AppState } from '@/lib/storage';
import GreetingRow from '@/components/dashboard/GreetingRow';
import StatsRow from '@/components/dashboard/StatsRow';
import ExternalToolsStrip from '@/components/dashboard/ExternalToolsStrip';
import TodayCards from '@/components/dashboard/TodayCards';
import TomorrowCards from '@/components/dashboard/TomorrowCards';
import QuickActions from '@/components/dashboard/QuickActions';
import ContextualTip from '@/components/ContextualTip';

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

      <ContextualTip
        id="home-tip"
        text="This is your home dashboard. Check today's tasks, monitor progress, and navigate quickly with the actions below."
      />

      <StatsRow state={appState} />

      <TodayCards state={appState} onRefresh={refresh} />

      <TomorrowCards state={appState} />

      <QuickActions />

      <ExternalToolsStrip />
    </div>
  );
}
