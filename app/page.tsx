'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBolt, IconBook2, IconCalendar, IconChartBar,
  IconClock, IconStack2, IconTarget, IconShieldCheck,
  IconBrandGithub, IconArrowRight, IconChevronDown, IconLanguage,
} from '@tabler/icons-react';
import { type Lang, LANG_LABELS, LANG_FLAGS, LANDING, getStoredLang, setStoredLang } from '@/lib/i18n';

const FEATURE_ICONS = [IconTarget, IconChartBar, IconCalendar, IconClock, IconStack2, IconShieldCheck];

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

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const langs: Lang[] = ['en', 'es', 'pt'];
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
          border: '1px solid rgba(255,255,255,0.12)', background: 'transparent',
          color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
      >
        <IconLanguage size={13} />
        <span>{LANG_FLAGS[lang]}</span>
        <span>{LANG_LABELS[lang]}</span>
        <IconChevronDown size={11} style={{ transition: 'transform 180ms', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 200,
          background: 'rgba(18,18,25,0.96)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
          padding: 4, minWidth: 160,
          boxShadow: '0 8px 32px rgba(0,0,0,0.50)',
        }}>
          {langs.map(l => (
            <button
              key={l}
              onClick={() => { onChange(l); setOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '7px 12px', borderRadius: 7,
                background: lang === l ? 'rgba(91,91,214,0.18)' : 'transparent',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                color: lang === l ? '#818CF8' : 'rgba(255,255,255,0.75)',
                fontSize: 12, fontWeight: lang === l ? 600 : 400,
                transition: 'background 120ms ease, color 120ms ease',
              }}
              onMouseEnter={e => { if (lang !== l) { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#fff'; } }}
              onMouseLeave={e => { if (lang !== l) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; } }}
            >
              <span style={{ fontSize: 16 }}>{LANG_FLAGS[l]}</span>
              {LANG_LABELS[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RootPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    if (localStorage.getItem('paceup_authed')) {
      router.replace('/home');
    }
    setLang(getStoredLang());
  }, [router]);

  function handleLangChange(l: Lang) {
    setLang(l);
    setStoredLang(l);
  }

  const t = LANDING[lang];

  return (
    <div style={{
      flex: 1, minHeight: '100vh', overflowY: 'auto',
      background: '#0A0A0F', color: '#F0EEF8',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    }}>
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
            <LangSelector lang={lang} onChange={handleLangChange} />
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
            <a href="/login" style={{
              padding: '6px 14px', borderRadius: 8, textDecoration: 'none',
              background: '#5B5BD6', color: '#fff', fontSize: 12, fontWeight: 700, transition: 'background 150ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4A4AC4'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#5B5BD6'; }}
            >
              {t.openApp}
            </a>
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
              {t.badge}
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', margin: '0 0 20px', color: '#F0EEF8',
          }}>
            {t.heroTitle1}<br />
            <span style={{ background: 'linear-gradient(135deg, #5B5BD6 0%, #818CF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t.heroTitle2}
            </span>
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 2.5vw, 18px)', color: 'rgba(240,238,248,0.6)',
            maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.65,
          }}>
            {t.heroSub}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
              background: '#5B5BD6', color: '#fff', fontSize: 14, fontWeight: 700,
              boxShadow: '0 4px 24px rgba(91,91,214,0.40)', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4A4AC4'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#5B5BD6'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {t.startFree} <IconArrowRight size={15} />
            </a>
            <a href="https://github.com/HyrumBustosFernandez" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)',
              fontSize: 14, fontWeight: 600, transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
            >
              <IconBrandGithub size={15} /> {t.viewSource}
            </a>
          </div>
        </section>

        {/* App preview */}
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
            <div style={{ padding: '32px 32px 24px', background: 'linear-gradient(135deg, #171717 0%, #1a1a2e 50%, #171717 100%)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
                {[
                  { label: 'Courses',    value: '9',  sub: 'active this term',  color: '#5B5BD6' },
                  { label: 'Items Done', value: '11', sub: 'of 117 total',       color: '#22C55E' },
                  { label: 'Days Left',  value: '10', sub: 'until exam',         color: '#F59E0B' },
                ].map(({ label, value, sub, color }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12, padding: '14px 16px',
                  }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>
                    <div style={{ height: 2, borderRadius: 2, background: `${color}30`, marginTop: 10, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '60%', background: color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { icon: '＋', label: 'Create Task',   color: '#5B5BD6' },
                  { icon: '📅', label: 'Add Event',     color: '#22C55E' },
                  { icon: '📚', label: 'Open Courses',  color: '#F59E0B' },
                  { icon: '🗓️', label: 'Open Calendar', color: '#EF4444' },
                ].map(({ icon, label, color }) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 10, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 7,
                      background: `${color}20`, border: `1px solid ${color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                    }}>{icon}</div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <a href="/login" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 18px', borderRadius: 9, textDecoration: 'none',
                  background: 'rgba(91,91,214,0.20)', border: '1px solid rgba(91,91,214,0.35)',
                  color: '#818CF8', fontSize: 12, fontWeight: 600, transition: 'all 150ms ease',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,91,214,0.30)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,91,214,0.20)'; }}
                >
                  {t.openApp} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 100px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
              {t.featuresTitle}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: 0, maxWidth: 440, marginInline: 'auto' }}>
              {t.featuresSub}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {t.features.map(({ title, desc }, idx) => {
              const Icon = FEATURE_ICONS[idx];
              return (
                <div key={title} style={{
                  padding: '24px 24px 22px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
                  transition: 'border-color 200ms ease, transform 200ms ease',
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
              );
            })}
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
                {t.whyTitle}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {t.why.map((item, i) => (
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
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>
            {t.faqTitle}
          </h2>
          {t.faq.map(item => <FaqItem key={item.q} {...item} />)}
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
            <a href="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px',
              borderRadius: 12, textDecoration: 'none', background: '#5B5BD6', color: '#fff',
              fontSize: 14, fontWeight: 700, boxShadow: '0 4px 28px rgba(91,91,214,0.45)', transition: 'all 150ms ease',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#4A4AC4'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#5B5BD6'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {t.startFree} <IconArrowRight size={15} />
            </a>
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
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{t.footerCopy} Hyrum Bustos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {[
                { label: 'GitHub',   href: 'https://github.com/HyrumBustosFernandez' },
                { label: 'LinkedIn', href: 'https://linkedin.com' },
                { label: 'Contact',  href: 'mailto:hyrum@bytebridgesystems.com' },
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
