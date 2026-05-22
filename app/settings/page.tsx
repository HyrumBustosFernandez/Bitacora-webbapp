'use client';

import { useState, useEffect } from 'react';

const DEFAULT_DUOC_URL = 'https://campusvirtual.duoc.cl/';

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: 8, padding: '8px 10px',
  color: '#EDE8DC', fontSize: 12,
  outline: 'none',
};

export default function SettingsPage() {
  const [duocUrl, setDuocUrl] = useState(DEFAULT_DUOC_URL);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('setting_duoc_url');
    if (stored) setDuocUrl(stored);
  }, []);

  function handleSave() {
    localStorage.setItem('setting_duoc_url', duocUrl || DEFAULT_DUOC_URL);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ fontSize: 18, fontWeight: 600, color: '#EDE8DC' }}>Settings</span>

      {/* External Tools section */}
      <div style={{
        background: '#0E0E0E',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 600, color: '#484848',
          textTransform: 'uppercase', letterSpacing: '0.6px',
        }}>
          External tools
        </span>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: '#A8A29A' }}>
            DuocUC Campus URL
          </label>
          <input
            type="url"
            value={duocUrl}
            onChange={e => setDuocUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={INPUT}
          />
          <span style={{ fontSize: 10, color: '#2E2E2E' }}>
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
            color: saved ? 'rgba(110,231,183,0.9)' : '#EDE8DC',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}
