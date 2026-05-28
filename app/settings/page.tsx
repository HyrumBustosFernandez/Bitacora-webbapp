'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '@/components/ThemeProvider';

const DEFAULT_DUOC_URL = 'https://campusvirtual.duoc.cl/';

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: 8, padding: '8px 10px',
  color: 'var(--text-1)', fontSize: 12,
  outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 130ms ease',
};

const SECTION: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12, padding: '16px 18px',
  display: 'flex', flexDirection: 'column', gap: 14,
  boxShadow: 'var(--shadow-card)',
};

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const [duocUrl, setDuocUrl] = useState(DEFAULT_DUOC_URL);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('paceup_duoc_url');
    if (stored) setDuocUrl(stored);
  }, []);

  function handleSave() {
    localStorage.setItem('paceup_duoc_url', duocUrl || DEFAULT_DUOC_URL);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>Settings</span>

      {/* ── Appearance ── */}
      <div style={SECTION}>
        <span className="label-section">Appearance</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>Theme</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => theme !== 'dark' && toggle()}
              className={theme === 'dark' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ gap: 7 }}
            >
              <IconMoon size={13} />
              Dark
            </button>
            <button
              type="button"
              onClick={() => theme !== 'light' && toggle()}
              className={theme === 'light' ? 'btn btn-primary' : 'btn btn-secondary'}
              style={{ gap: 7 }}
            >
              <IconSun size={13} />
              Light
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>Accent color</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { color: '#4F6BFB', label: 'Indigo' },
              { color: '#8B5CF6', label: 'Purple' },
              { color: '#06B6D4', label: 'Cyan'   },
              { color: '#3DD68C', label: 'Green'  },
              { color: '#F5A623', label: 'Amber'  },
            ].map(({ color, label }) => (
              <button
                key={color} type="button" title={label}
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: color, border: 0, cursor: 'pointer',
                  outline: color === '#4F6BFB' ? '2px solid var(--text-2)' : '2px solid transparent',
                  outlineOffset: 2,
                  transition: 'outline 130ms ease, transform 130ms ease',
                  transform: color === '#4F6BFB' ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>More accent colors coming soon.</span>
        </div>
      </div>

      {/* ── External Tools ── */}
      <div style={SECTION}>
        <span className="label-section">External tools</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>
            DuocUC Campus URL
          </label>
          <input
            type="url" value={duocUrl}
            onChange={e => setDuocUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={INPUT}
            onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
          />
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
            Used in the External Tools strip on the dashboard.
          </span>
        </div>

        <button
          type="button" onClick={handleSave}
          className={saved ? 'btn btn-secondary' : 'btn btn-primary'}
          style={{
            alignSelf: 'flex-start',
            ...(saved && { color: 'var(--color-green)', borderColor: 'var(--color-green-border)' }),
          }}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* ── Data ── */}
      <div style={SECTION}>
        <span className="label-section">Data</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          All data is stored locally in your browser. No account or sync required.
        </span>
        <button
          type="button"
          className="btn btn-destructive"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => {
            if (confirm('Clear all PaceUp data? This cannot be undone.')) {
              Object.keys(localStorage)
                .filter(k => k.startsWith('paceup_'))
                .forEach(k => localStorage.removeItem(k));
              window.location.reload();
            }
          }}
        >
          Clear all data
        </button>
      </div>
    </div>
  );
}
