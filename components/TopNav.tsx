'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconSearch, IconSun, IconMoon,
  IconUser, IconSettings2,
  IconLanguage, IconLogout, IconChevronDown, IconHome,
} from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';
import { type Lang, LANG_LABELS, LANG_FLAGS, APP } from '@/lib/i18n';

const MENU_ITEM: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 9,
  width: '100%', padding: '7px 12px',
  background: 'transparent', border: 'none',
  borderRadius: 7, cursor: 'pointer',
  fontSize: 12, fontWeight: 500,
  color: 'var(--text-2)',
  textDecoration: 'none',
  transition: 'background 120ms ease, color 120ms ease',
  textAlign: 'left',
  fontFamily: 'inherit',
};

function MenuItem({
  icon: Icon, label, onClick, danger, disabled, rightEl,
}: {
  icon: React.ElementType; label: string; onClick?: () => void;
  danger?: boolean; disabled?: boolean; rightEl?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      style={{
        ...MENU_ITEM,
        color: disabled ? 'var(--text-4)' : danger ? 'var(--color-red)' : hovered ? 'var(--text-1)' : 'var(--text-2)',
        background: hovered ? (danger ? 'var(--color-red-subtle)' : 'var(--bg-elevated)') : 'transparent',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {rightEl}
    </button>
  );
}

function LangPicker({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const langs: Lang[] = ['en', 'es', 'pt'];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          ...MENU_ITEM, width: '100%',
          color: open ? 'var(--text-1)' : 'var(--text-2)',
          background: open ? 'var(--bg-elevated)' : 'transparent',
        }}
      >
        <IconLanguage size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>Language</span>
        <span style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 600, marginRight: 2 }}>{LANG_FLAGS[lang]}</span>
        <IconChevronDown size={11} style={{ color: 'var(--text-4)', transition: 'transform 180ms', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 'calc(100% + 4px)', zIndex: 300,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: 10, padding: 4,
          boxShadow: 'var(--shadow-modal)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}>
          {langs.map(l => (
            <button
              key={l}
              type="button"
              onClick={() => { setLang(l); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '7px 10px', borderRadius: 7,
                background: lang === l ? 'var(--accent-subtle)' : 'transparent',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                color: lang === l ? 'var(--accent)' : 'var(--text-2)',
                fontSize: 12, fontWeight: lang === l ? 600 : 400,
                transition: 'background 120ms, color 120ms',
              }}
            >
              <span style={{ fontSize: 15 }}>{LANG_FLAGS[l]}</span>
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopNav() {
  const { theme, toggle, lang, setLang } = useTheme();
  const t = APP[lang];
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef  = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current  && !menuRef.current.contains(e.target as Node) &&
        avatarRef.current && !avatarRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav
      className="glass-surface"
      style={{
        height: 44,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 10, flexShrink: 0,
        zIndex: 50, position: 'relative',
      }}
    >
      {/* Search */}
      <label
        className="topnav-search"
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          width: 260, height: 28,
          background: 'var(--bg-input)',
          border: '1px solid var(--border-default)',
          borderRadius: 8, padding: '0 10px', cursor: 'text',
          transition: 'border-color 150ms ease, box-shadow 150ms ease',
        }}
      >
        <IconSearch size={12} color="var(--text-3)" style={{ flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search courses, modules…"
          style={{
            background: 'transparent', border: 0, outline: 'none',
            width: '100%', color: 'var(--text-1)',
            fontSize: 11, fontWeight: 400, fontFamily: 'inherit',
          }}
          onFocus={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) { label.style.borderColor = 'var(--border-focus)'; label.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }
          }}
          onBlur={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) { label.style.borderColor = 'var(--border-default)'; label.style.boxShadow = 'none'; }
          }}
        />
      </label>

      <div style={{ flex: 1 }} />

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          type="button" onClick={toggle} aria-label="Toggle theme"
          className="btn btn-ghost btn-icon" style={{ color: 'var(--text-3)' }}
        >
          {theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
        </button>

        {/* Avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            ref={avatarRef} role="button" tabIndex={0} aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(v => !v)}
            onKeyDown={e => e.key === 'Enter' && setProfileOpen(v => !v)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: profileOpen ? 'var(--accent)' : 'var(--accent-subtle)',
              border: `1.5px solid ${profileOpen ? 'var(--accent)' : 'var(--accent-border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 130ms ease, border-color 130ms ease',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: profileOpen ? '#fff' : 'var(--accent)', lineHeight: 1 }}>H</span>
          </div>

          {profileOpen && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 210,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 12, boxShadow: 'var(--shadow-modal)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                padding: '6px', zIndex: 200,
              }}
            >
              {/* User info */}
              <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Hyrum Bustos</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>hyrum@bytebridgesystems.com</div>
              </div>

              <MenuItem icon={IconUser}     label="Profile"    onClick={() => { setProfileOpen(false); router.push('/settings'); }} />
              <MenuItem icon={IconSettings2} label={t.nav.settings} onClick={() => { setProfileOpen(false); router.push('/settings'); }} />

              {/* Inline language picker */}
              <LangPicker lang={lang} setLang={(l) => { setLang(l); }} />

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

              <MenuItem
                icon={IconHome} label="Landing page"
                onClick={() => { setProfileOpen(false); router.push('/landing'); }}
              />

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

              <MenuItem
                icon={IconLogout} label="Log out" danger
                onClick={() => {
                  setProfileOpen(false);
                  localStorage.removeItem('paceup_authed');
                  router.push('/login');
                }}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
