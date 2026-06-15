'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IconBolt, IconBrandGoogle, IconBrandGithub, IconEye, IconEyeOff } from '@tabler/icons-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('paceup_authed')) router.replace('/home');
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('paceup_authed', '1');
      router.push('/home');
    }, 600);
  }

  return (
    <div style={{
      flex: 1, minHeight: '100vh', background: 'var(--bg-page)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '20px 16px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px', boxShadow: '0 4px 20px var(--accent-glow)',
        }}>
          <IconBolt size={22} color="#fff" />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', margin: 0 }}>PaceUp</h1>
        <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '4px 0 0', fontWeight: 400 }}>
          Your certification study tracker
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 380, background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)', borderRadius: 18,
        padding: '28px 28px 24px', boxShadow: 'var(--shadow-elevated)',
      }}>
        {/* Mode toggle */}
        <div style={{
          display: 'flex', gap: 2, background: 'var(--bg-page)',
          border: '1px solid var(--border-subtle)', borderRadius: 10,
          padding: 3, marginBottom: 24,
        }}>
          {(['signin', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '6px 0', border: 'none', cursor: 'pointer',
              borderRadius: 7, fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
              background: mode === m ? 'var(--bg-elevated)' : 'transparent',
              color: mode === m ? 'var(--text-1)' : 'var(--text-3)',
              transition: 'all 150ms ease',
              boxShadow: mode === m ? 'var(--shadow-card)' : 'none',
            }}>
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {/* OAuth stubs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {[{ Icon: IconBrandGoogle, label: 'Continue with Google' }, { Icon: IconBrandGithub, label: 'Continue with GitHub' }].map(({ Icon, label }) => (
            <button key={label} disabled style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '9px 16px', borderRadius: 10, cursor: 'not-allowed',
              border: '1px solid var(--border-default)', background: 'var(--bg-elevated)',
              color: 'var(--text-2)', fontSize: 12, fontWeight: 600, opacity: 0.55, fontFamily: 'inherit',
            }}>
              <Icon size={15} />
              {label}
              <span style={{
                fontSize: 9, fontWeight: 700, background: 'var(--bg-input)',
                border: '1px solid var(--border-default)', borderRadius: 4,
                padding: '1px 5px', color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>Soon</span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email"
              style={{
                width: '100%', padding: '8px 12px', background: 'var(--bg-input)',
                border: '1px solid var(--border-default)', borderRadius: 9,
                color: 'var(--text-1)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
              }}
              onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-2)', marginBottom: 5 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                style={{
                  width: '100%', padding: '8px 36px 8px 12px', background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)', borderRadius: 9,
                  color: 'var(--text-1)', fontSize: 13, fontFamily: 'inherit', outline: 'none',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; }}
              />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-3)', display: 'flex', padding: 0,
              }}>
                {showPw ? <IconEyeOff size={14} /> : <IconEye size={14} />}
              </button>
            </div>
          </div>

          {error && <p style={{ fontSize: 11, color: 'var(--color-red)', margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{
            marginTop: 4, padding: '10px 16px', border: 'none', borderRadius: 10,
            background: 'var(--accent)', color: '#fff', fontSize: 13, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            opacity: loading ? 0.7 : 1, transition: 'opacity 150ms ease',
          }}>
            {loading ? 'Signing in…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>

      <p style={{ marginTop: 24, fontSize: 11, color: 'var(--text-4)', textAlign: 'center' }}>
        Demo mode — any credentials work
      </p>
    </div>
  );
}
