'use client';

import { useEffect } from 'react';

function updateStreak() {
  const today     = new Date().toISOString().split('T')[0];
  const lastVisit = localStorage.getItem('last_visit_date');
  const streak    = parseInt(localStorage.getItem('streak_count') || '0');

  if (!lastVisit) {
    localStorage.setItem('last_visit_date', today);
    localStorage.setItem('streak_count', '1');
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (lastVisit === yesterdayStr) {
    localStorage.setItem('streak_count', String(streak + 1));
  } else if (lastVisit !== today) {
    localStorage.setItem('streak_count', '1');
  }

  localStorage.setItem('last_visit_date', today);
}

export default function StreakInit() {
  useEffect(() => { updateStreak(); }, []);
  return null;
}
