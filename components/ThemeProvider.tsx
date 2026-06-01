'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { type Lang, getStoredLang, setStoredLang } from '@/lib/i18n';

type Theme = 'dark' | 'light';

const BG_KEY = 'paceup_bg';

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  bg: string;
  setBg: (bg: string) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}>({
  theme: 'dark',
  toggle: () => {},
  bg: 'none',
  setBg: () => {},
  lang: 'en',
  setLang: () => {},
});

export function useTheme() { return useContext(ThemeContext); }

function applyBg(value: string) {
  if (value && value !== 'none') {
    document.documentElement.style.setProperty('--wallpaper-url', `url('/backgrounds/${encodeURIComponent(value)}')`);
    document.documentElement.setAttribute('data-wallpaper', 'active');
  } else {
    document.documentElement.style.removeProperty('--wallpaper-url');
    document.documentElement.removeAttribute('data-wallpaper');
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [bg,    setBgState] = useState<string>('none');
  const [lang,  setLangState] = useState<Lang>('en');

  useEffect(() => {
    const storedTheme = localStorage.getItem('paceup_theme') as Theme | null;
    const initial = storedTheme ?? 'dark';
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);

    const storedBg = localStorage.getItem(BG_KEY) ?? 'none';
    setBgState(storedBg);
    applyBg(storedBg);

    setLangState(getStoredLang());
  }, []);

  function toggle() {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('paceup_theme', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }

  function setBg(value: string) {
    setBgState(value);
    localStorage.setItem(BG_KEY, value);
    applyBg(value);
  }

  function setLang(l: Lang) {
    setLangState(l);
    setStoredLang(l);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, bg, setBg, lang, setLang }}>
      {children}
    </ThemeContext.Provider>
  );
}
