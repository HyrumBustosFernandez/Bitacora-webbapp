'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  IconBolt, IconBook2, IconCalendar, IconChartBar,
  IconClock, IconStack2, IconTarget, IconShieldCheck,
  IconBrandGithub, IconArrowRight, IconChevronDown,
} from '@tabler/icons-react';

const FEATURES = [
  { Icon: IconTarget,      title: 'Focused Study Plans',    desc: 'Course-aware task management designed for certification prep — not generic productivity apps.' },
  { Icon: IconChartBar,    title: 'Progress Tracking',      desc: 'Know exactly how far you are, how far behind, and what to study today to catch up.' },
  { Icon: IconCalendar,    title: 'Calendar & Tasks',       desc: 'Visual calendar with tasks, events, and daily agenda. Never miss a deadline.' },
  { Icon: IconClock,       title: 'Pomodoro Study Timer',   desc: 'Built-in focus timer with session history to build consistent study habits.' },
  { Icon: IconStack2,      title: 'Quick Study Mode',       desc: 'Only have 15 minutes? PaceUp tells you exactly what to study for maximum impact.' },
  { Icon: IconShieldCheck, title: 'Exam Countdown',         desc: 'Track days remaining to each exam with urgency-aware priority sorting.' },
];

const WHY = [
  'Built for certification prep — not generic task management',
  'Local-first: your data stays on your device, no account needed',
  'Designed for the student who needs to pass, not just plan',
  'Track exactly how far behind you are and what to study next',
];

const FAQ = [
  { q: 'Is PaceUp free?', a: 'Yes, completely free. No account required — all data is stored locally on your device.' },
  { q: 'Which certifications does PaceUp support?', a: 'It comes pre-loaded with Cisco CCST and Microsoft certification tracks, with custom course support coming soon.' },
  { q: 'Does my data sync across devices?', a: 'Currently local-only. Cloud sync is on the roadmap — your data stays on device until then.' },
  { q: 'Can I use it on mobile?', a: 'Yes — PaceUp is fully responsive with a dedicated mobile navigation bar.' },
  { q: 'Do I need to create an account?', a: 'Not yet. The app works immediately in demo mode. Accounts will be optional when cloud sync launches.' },
  { q: 'Is the source code available?', a: 'Yes — PaceUp is open source on GitHub. Pull requests and feedback are welcome.' },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 0' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: 600,
        fontFamily: 'inherit', textAlign: 'left', gap: 12,
      }}>
        {q}
        <IconChevronDown size={15} style={{
          flexShrink: 0, color: 'rgba(255,255,255,0.4)', transition: 'transform 200ms ease',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />
      </button>
      {open && (
        <p style={{ margin: '10px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{a}</p>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{
      flex: 1, minHeight: '100vh', overflowY: 'auto',
      background: '#0A0A0F', color: '#F0EEF8',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
      {/* Gradient */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(91,91,214,0.18) 0%, transparent 60%)',
      }} />

      {/* Nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(10,10,15,0.82)', backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)', padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#5B5BD6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconBolt size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>PaceUp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="https://github.com/HyrumBustosFernandez" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)',
              fontSize: 12, fontWeight: 500, textDecoration: 'none', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
            >
              <IconBrandGithub size={13} /> GitHub
            </a>
            <Link href="/login" style={{
              padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              background: '#5B5BD6', color: '#fff', fontSize: 12, fontWeight: 700, transition: 'background 150ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4A4AC4'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#5B5BD6'; }}
            >
              Open App
            </Link>
          </div>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20,
            border: '1px solid rgba(91,91,214,0.35)', background: 'rgba(91,91,214,0.10)', marginBottom: 28,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#5B5BD6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Certification Prep Tool
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', margin: '0 0 20px', color: '#F0EEF8',
          }}>
            Study smarter.<br />
            <span style={{ background: 'linear-gradient(135deg, #5B5BD6 0%, #818CF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Pass faster.
            </span>
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 18px)', color: 'rgba(240,238,248,0.6)',
            maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.65,
          }}>
            The student productivity tracker built for certification prep.
            Know exactly what to study, track your progress, and never fall behind again.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
              background: '#5B5BD6', color: '#fff', fontSize: 14, fontWeight: 700,
              boxShadow: '0 4px 24px rgba(91,91,214,0.40)', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4A4AC4'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#5B5BD6'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Start for free <IconArrowRight size={15} />
            </Link>
            <a href="https://github.com/HyrumBustosFernandez" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)',
              fontSize: 14, fontWeight: 600, transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            >
              <IconBrandGithub size={15} /> View source
            </a>
          </div>
        </section>

        {/* App mockup */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
          <div style={{
            borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.70)', background: '#171717',
          }}>
            <div style={{
              height: 40, background: '#1a1a1a', borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', padding: '0 16px', gap: 6,
            }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <div style={{
                flex: 1, marginLeft: 12, height: 22, borderRadius: 5,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>paceup.app</span>
              </div>
            </div>
            <div style={{
              height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 16,
              background: 'linear-gradient(135deg, #171717 0%, #1a1a2e 50%, #171717 100%)',
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16, background: '#5B5BD6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(91,91,214,0.40)',
              }}>
                <IconBolt size={30} color="#fff" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>PaceUp Dashboard</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>App preview</p>
              </div>
              <Link href="/login" style={{
                padding: '8px 18px', borderRadius: 9, textDecoration: 'none',
                background: 'rgba(91,91,214,0.20)', border: '1px solid rgba(91,91,214,0.35)',
                color: '#818CF8', fontSize: 12, fontWeight: 600,
              }}>Open live app →</Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
              Everything you need to pass
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: 0, maxWidth: 440, marginInline: 'auto' }}>
              Built around how certification studying actually works.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} style={{
                padding: '24px 24px 22px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, transition: 'border-color 200ms ease, transform 200ms ease',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,91,214,0.30)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9, background: 'rgba(91,91,214,0.15)',
                  border: '1px solid rgba(91,91,214,0.25)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 14, color: '#818CF8',
                }}>
                  <Icon size={18} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color: 'rgba(255,255,255,0.9)' }}>{title}</h3>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why PaceUp */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
          <div style={{
            background: 'rgba(91,91,214,0.08)', border: '1px solid rgba(91,91,214,0.20)',
            borderRadius: 20, padding: '48px 40px',
          }}>
            <div style={{ maxWidth: 600 }}>
              <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 32px' }}>
                Why PaceUp?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {WHY.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: '50%', background: 'rgba(91,91,214,0.20)',
                      border: '1px solid rgba(91,91,214,0.35)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', flexShrink: 0, marginTop: 1,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#818CF8' }}>✓</span>
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.5 }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px 100px' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>FAQ</h2>
          {FAQ.map(item => <FaqItem key={item.q} {...item} />)}
        </section>

        {/* CTA */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(91,91,214,0.15) 0%, rgba(129,140,248,0.08) 100%)',
            border: '1px solid rgba(91,91,214,0.22)', borderRadius: 24, padding: '64px 40px',
          }}>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 14px' }}>
              Ready to pace up?
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '0 0 32px', lineHeight: 1.6 }}>
              Free, local-first, and built for students serious about passing.
            </p>
            <Link href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px',
              borderRadius: 12, textDecoration: 'none', background: '#5B5BD6', color: '#fff',
              fontSize: 14, fontWeight: 700, boxShadow: '0 4px 28px rgba(91,91,214,0.45)', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4A4AC4'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#5B5BD6'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              Open PaceUp free <IconArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '28px 24px' }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: '#5B5BD6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconBolt size={11} color="#fff" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>PaceUp</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>© 2026 Hyrum Bustos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {[
                { label: 'GitHub', href: 'https://github.com/HyrumBustosFernandez' },
                { label: 'LinkedIn', href: 'https://linkedin.com' },
                { label: 'Contact', href: 'mailto:hyrum@bytebridgesystems.com' },
              ].map(({ label, href }) => (
                <a key={label} href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 150ms ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
