'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTheme } from '@/components/ThemeProvider';

const DEFAULT_DUOC_URL = 'https://campusvirtual.duoc.cl/';

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-default)',
  borderRadius: 8, padding: '8px 10px',
  color: 'var(--text-1)', fontSize: 12,
  outline: 'none', fontFamily: 'inherit',
};

const SECTION: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 12, padding: '14px 16px',
  display: 'flex', flexDirection: 'column', gap: 12,
};

const SECTION_LABEL: React.CSSProperties = {
  fontSize: 9, fontWeight: 600, color: 'var(--text-3)',
  textTransform: 'uppercase', letterSpacing: '0.6px',
};

const FIELD_LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
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
      <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-1)' }}>Settings</span>

      {/* Appearance section */}
      <div style={SECTION}>
        <span style={SECTION_LABEL}>Appearance</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={FIELD_LABEL}>Theme</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <ThemeButton
              active={theme === 'dark'}
              onClick={() => theme !== 'dark' && toggle()}
              icon={<IconMoon size={14} />}
              label="Dark"
            />
            <ThemeButton
              active={theme === 'light'}
              onClick={() => theme !== 'light' && toggle()}
              icon={<IconSun size={14} />}
              label="Light"
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={FIELD_LABEL}>Accent color</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { color: '#4875F0', label: 'Blue' },
              { color: '#8B5CF6', label: 'Purple' },
              { color: '#06B6D4', label: 'Cyan' },
              { color: '#22C55E', label: 'Green' },
              { color: '#F59E0B', label: 'Amber' },
            ].map(({ color, label }) => (
              <button
                key={color}
                type="button"
                title={label}
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: color, border: 0, cursor: 'pointer',
                  outline: color === '#4875F0' ? `2px solid var(--text-2)` : '2px solid transparent',
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>More accent colors coming soon.</span>
        </div>
      </div>

      {/* External Tools section */}
      <div style={SECTION}>
        <span style={SECTION_LABEL}>External tools</span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={FIELD_LABEL}>DuocUC Campus URL</label>
          <input
            type="url"
            value={duocUrl}
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
          type="button"
          onClick={handleSave}
          style={{
            alignSelf: 'flex-start',
            background: saved ? 'rgba(34,197,94,0.12)' : '#4875F0',
            border: saved ? '1px solid rgba(34,197,94,0.25)' : 0,
            borderRadius: 9, padding: '8px 18px',
            color: saved ? 'rgba(110,231,183,0.9)' : '#fff',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Data section */}
      <div style={SECTION}>
        <span style={SECTION_LABEL}>Data</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          All data is stored locally in your browser. No account or sync required.
        </span>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear all PaceUp data? This cannot be undone.')) {
              const keys = Object.keys(localStorage).filter(k => k.startsWith('paceup_'));
              keys.forEach(k => localStorage.removeItem(k));
              window.location.reload();
            }
          }}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent', border: '1px solid rgba(239,68,68,0.30)',
            borderRadius: 9, padding: '7px 16px',
            color: 'rgba(252,165,165,0.85)',
            fontSize: 11, fontWeight: 500, cursor: 'pointer',
          }}
        >
          Clear all data
        </button>
      </div>
    </div>
  );
}

function ThemeButton({
  active, onClick, icon, label,
}: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 16px',
        background: active ? '#4875F0' : 'var(--bg-elevated)',
        border: active ? '0' : '1px solid var(--border-default)',
        borderRadius: 9,
        color: active ? '#fff' : 'var(--text-2)',
        fontSize: 12, fontWeight: active ? 600 : 400,
        cursor: 'pointer', transition: 'all 150ms ease',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
