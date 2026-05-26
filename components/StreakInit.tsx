'use client';

import { useEffect } from 'react';

function migrateKeys() {
  const migrations: [string, string][] = [
    ['last_visit_date',  'paceup_streak_last'],
    ['streak_count',     'paceup_streak_count'],
    ['calendar_events',  'paceup_calendar_events'],
    ['study_sessions',   'paceup_study_sessions'],
    ['setting_duoc_url', 'paceup_duoc_url'],
  ];
  for (const [oldKey, newKey] of migrations) {
    const val = localStorage.getItem(oldKey);
    if (val !== null && localStorage.getItem(newKey) === null) {
      localStorage.setItem(newKey, val);
      localStorage.removeItem(oldKey);
    }
  }
}

function updateStreak() {
  const today     = new Date().toISOString().split('T')[0];
  const lastVisit = localStorage.getItem('paceup_streak_last');
  const streak    = parseInt(localStorage.getItem('paceup_streak_count') || '0');

  if (!lastVisit) {
    localStorage.setItem('paceup_streak_last', today);
    localStorage.setItem('paceup_streak_count', '1');
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastVisit === yesterdayStr) {
    localStorage.setItem('paceup_streak_count', String(streak + 1));
  } else if (lastVisit !== today) {
    localStorage.setItem('paceup_streak_count', '1');
  }

  localStorage.setItem('paceup_streak_last', today);
}

export default function StreakInit() {
  useEffect(() => {
    migrateKeys();
    updateStreak();
  }, []);
  return null;
}
