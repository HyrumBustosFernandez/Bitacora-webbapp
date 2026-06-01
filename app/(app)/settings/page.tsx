'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon, IconPrinter, IconEye, IconPhoto, IconCheck } from '@tabler/icons-react';
import { useTheme } from '@/components/ThemeProvider';
import { type Lang, LANG_LABELS, LANG_FLAGS, APP } from '@/lib/i18n';

const DEFAULT_DUOC_URL = 'https://campusvirtual.duoc.cl/';

const BACKGROUNDS = [
  { file: 'none',                    label: 'None'       },
  { file: 'blob-red.heic',           label: 'Blob Red'   },
  { file: 'blue_distortion_1.heic',  label: 'Blue Distortion 1' },
  { file: 'blue_distortion_2.heic',  label: 'Blue Distortion 2' },
  { file: 'chromatic_light_2.heic',  label: 'Chromatic Light'   },
  { file: 'cube_mono.heic',          label: 'Cube Mono'  },
  { file: 'glaze_1.heic',            label: 'Glaze 1'    },
  { file: 'glaze_1_alt.heic',        label: 'Glaze 1 Alt'},
  { file: 'glaze_2.heic',            label: 'Glaze 2'    },
  { file: 'loupe.heic',              label: 'Loupe'      },
  { file: 'loupe-mono-light.heic',   label: 'Loupe Mono Light' },
  { file: 'mono_dark_distortion_2.heic', label: 'Mono Dark'  },
  { file: 'mono_light_distortion_1.heic',label: 'Mono Light' },
  { file: 'red_distortion_4.heic',   label: 'Red Distortion' },
];

const INPUT: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
  borderRadius: 8, padding: '8px 10px',
  color: 'var(--text-1)', fontSize: 12, outline: 'none', fontFamily: 'inherit',
  transition: 'border-color 130ms ease',
};

const SECTION: React.CSSProperties = {
  background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
  borderRadius: 12, padding: '16px 18px',
  display: 'flex', flexDirection: 'column', gap: 14,
  boxShadow: 'var(--shadow-card)',
  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
};

export default function SettingsPage() {
  const { theme, toggle, bg, setBg, lang, setLang } = useTheme();
  const t = APP[lang];
  const [duocUrl, setDuocUrl] = useState(DEFAULT_DUOC_URL);
  const [saved,   setSaved]   = useState(false);
  const [colorBlind, setColorBlind] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('paceup_duoc_url');
    if (stored) setDuocUrl(stored);
    const cb = localStorage.getItem('paceup_colorblind') === 'true';
    setColorBlind(cb);
    document.documentElement.setAttribute('data-colorblind', String(cb));
  }, []);

  function toggleColorBlind() {
    const next = !colorBlind;
    setColorBlind(next);
    localStorage.setItem('paceup_colorblind', String(next));
    document.documentElement.setAttribute('data-colorblind', String(next));
  }

  function handleSave() {
    localStorage.setItem('paceup_duoc_url', duocUrl || DEFAULT_DUOC_URL);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-1)' }}>{t.nav.settings}</span>

      {/* ── Appearance ── */}
      <div style={SECTION}>
        <span className="label-section">{t.settings.appearance}</span>

        {/* Theme */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>{t.settings.theme}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => theme !== 'dark' && toggle()}
              className={theme === 'dark' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ gap: 7 }}>
              <IconMoon size={13} /> Dark
            </button>
            <button type="button" onClick={() => theme !== 'light' && toggle()}
              className={theme === 'light' ? 'btn btn-primary' : 'btn btn-secondary'} style={{ gap: 7 }}>
              <IconSun size={13} /> Light
            </button>
          </div>
        </div>

        {/* Language */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>{t.settings.language}</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['en', 'es', 'pt'] as Lang[]).map(l => (
              <button
                key={l} type="button"
                onClick={() => setLang(l)}
                className={lang === l ? 'btn btn-primary' : 'btn btn-secondary'}
                style={{ gap: 6 }}
              >
                <span style={{ fontSize: 14 }}>{LANG_FLAGS[l]}</span>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Background */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconPhoto size={13} color="var(--text-2)" />
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>{t.settings.background}</span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8,
          }}>
            {BACKGROUNDS.map(({ file, label }) => {
              const active = bg === file || (file === 'none' && (!bg || bg === 'none'));
              return (
                <button
                  key={file} type="button"
                  onClick={() => setBg(file === 'none' ? 'none' : file)}
                  style={{
                    position: 'relative', borderRadius: 10, overflow: 'hidden',
                    height: 72, border: active ? '2px solid var(--accent)' : '2px solid var(--border-default)',
                    cursor: 'pointer', transition: 'border-color 150ms ease, box-shadow 150ms ease',
                    boxShadow: active ? '0 0 0 2px var(--accent-glow)' : 'none',
                    background: file === 'none' ? 'var(--bg-elevated)' : 'transparent',
                  }}
                >
                  {file !== 'none' && (
                    <img
                      src={`/backgrounds/${file}`}
                      alt={label}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  {file === 'none' && (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}>
                      <span style={{ fontSize: 18 }}>✕</span>
                      <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{t.settings.noBackground}</span>
                    </div>
                  )}
                  {/* Overlay label */}
                  {file !== 'none' && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                      padding: '4px 6px 5px',
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: '#fff', lineHeight: 1 }}>{label}</span>
                    </div>
                  )}
                  {active && (
                    <div style={{
                      position: 'absolute', top: 5, right: 5,
                      width: 18, height: 18, borderRadius: '50%',
                      background: 'var(--accent)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <IconCheck size={11} color="#fff" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
            Glassmorphism is applied automatically when a background is active.
          </span>
        </div>

        {/* Accessibility */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>{t.settings.accessibility}</span>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 14px', background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)', borderRadius: 9,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconEye size={14} color="var(--text-2)" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-1)' }}>Color-blind mode</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>Replaces red/green with blue/orange</div>
              </div>
            </div>
            <button
              type="button" onClick={toggleColorBlind} role="switch" aria-checked={colorBlind}
              aria-label="Color-blind mode"
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none', cursor: 'pointer',
                background: colorBlind ? 'var(--accent)' : 'var(--bg-input)',
                position: 'relative', transition: 'background 200ms ease', flexShrink: 0,
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: colorBlind ? 21 : 3, width: 16, height: 16,
                borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                transition: 'left 200ms ease',
              }} />
            </button>
          </div>
        </div>

        {/* Print */}
        <div>
          <button type="button" className="btn btn-secondary" onClick={() => window.print()} style={{ gap: 7 }}>
            <IconPrinter size={13} />
            Print study plan
          </button>
        </div>
      </div>

      {/* ── External Tools ── */}
      <div style={SECTION}>
        <span className="label-section">External tools</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-2)' }}>DuocUC Campus URL</label>
          <input
            type="url" value={duocUrl}
            onChange={e => setDuocUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={INPUT}
            onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
          />
          <span style={{ fontSize: 10, color: 'var(--text-4)' }}>Used in the External Tools strip on the dashboard.</span>
        </div>
        <button
          type="button" onClick={handleSave}
          className={saved ? 'btn btn-secondary' : 'btn btn-primary'}
          style={{ alignSelf: 'flex-start', ...(saved && { color: 'var(--color-green)', borderColor: 'var(--color-green-border)' }) }}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* ── Data ── */}
      <div style={SECTION}>
        <span className="label-section">Data</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>All data is stored locally in your browser. No account or sync required.</span>
        <button type="button" className="btn btn-destructive" style={{ alignSelf: 'flex-start' }}
          onClick={() => {
            if (confirm('Clear all PaceUp data? This cannot be undone.')) {
              Object.keys(localStorage).filter(k => k.startsWith('paceup_')).forEach(k => localStorage.removeItem(k));
              window.location.reload();
            }
          }}>
          Clear all data
        </button>
      </div>
    </div>
  );
}
