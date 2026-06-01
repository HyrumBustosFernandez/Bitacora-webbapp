'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconSearch, IconSun, IconMoon,
  IconUser, IconSettings2, IconPalette,
  IconLanguage, IconLogout, IconChevronRight, IconHome,
} from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';

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
  icon: Icon,
  label,
  onClick,
  danger,
  disabled,
  rightEl,
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  rightEl?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      style={{
        ...MENU_ITEM,
        color: disabled
          ? 'var(--text-4)'
          : danger
          ? 'var(--color-red)'
          : hovered
          ? 'var(--text-1)'
          : 'var(--text-2)',
        background: hovered
          ? danger
            ? 'var(--color-red-subtle)'
            : 'var(--bg-elevated)'
          : 'transparent',
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

export default function TopNav() {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
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
      style={{
        height: 44,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 10,
        flexShrink: 0,
        zIndex: 50,
        position: 'relative',
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
            if (label) {
              label.style.borderColor = 'var(--border-focus)';
              label.style.boxShadow = '0 0 0 3px var(--accent-subtle)';
            }
          }}
          onBlur={e => {
            const label = e.currentTarget.closest('label') as HTMLElement | null;
            if (label) {
              label.style.borderColor = 'var(--border-default)';
              label.style.boxShadow = 'none';
            }
          }}
        />
      </label>

      <div style={{ flex: 1 }} />

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle theme"
          className="btn btn-ghost btn-icon"
          style={{ color: 'var(--text-3)' }}
        >
          {theme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
        </button>

        {/* Avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            ref={avatarRef}
            role="button"
            tabIndex={0}
            aria-label="Open profile menu"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen(v => !v)}
            onKeyDown={e => e.key === 'Enter' && setProfileOpen(v => !v)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: profileOpen ? 'var(--accent)' : 'var(--accent-subtle)',
              border: `1.5px solid ${profileOpen ? 'var(--accent)' : 'var(--accent-border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 130ms ease, border-color 130ms ease',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: profileOpen ? '#fff' : 'var(--accent)', lineHeight: 1 }}>H</span>
          </div>

          {/* Dropdown */}
          {profileOpen && (
            <div
              ref={menuRef}
              style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                width: 200,
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: 12,
                boxShadow: 'var(--shadow-modal)',
                padding: '6px',
                zIndex: 200,
              }}
            >
              {/* User info header */}
              <div style={{
                padding: '8px 12px 10px',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: 4,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-1)' }}>Hyrum Bustos</div>
                <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 1 }}>hyrum@bytebridgesystems.com</div>
              </div>

              <MenuItem
                icon={IconUser}
                label="Profile"
                onClick={() => { setProfileOpen(false); router.push('/settings'); }}
              />
              <MenuItem
                icon={IconSettings2}
                label="Settings"
                onClick={() => { setProfileOpen(false); router.push('/settings'); }}
              />
              <MenuItem
                icon={IconPalette}
                label="Appearance"
                onClick={() => { setProfileOpen(false); router.push('/settings'); }}
              />
              <MenuItem
                icon={IconLanguage}
                label="Language"
                rightEl={
                  <span style={{ fontSize: 10, color: 'var(--text-4)', fontWeight: 600 }}>EN</span>
                }
                onClick={() => { setProfileOpen(false); router.push('/settings'); }}
              />

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

              <MenuItem
                icon={IconHome}
                label="Landing page"
                onClick={() => { setProfileOpen(false); router.push('/'); }}
              />

              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '4px 0' }} />

              <MenuItem
                icon={IconLogout}
                label="Log out"
                danger
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
