'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  IconBolt, IconBook2, IconCalendar, IconChartBar,
  IconClock, IconStack2, IconTarget, IconShieldCheck,
  IconBrandGithub, IconArrowRight, IconChevronDown, IconLanguage,
  IconChevronLeft, IconChevronRight,
} from '@tabler/icons-react';
import { type Lang, LANG_LABELS, LANG_FLAGS, LANDING, getStoredLang, setStoredLang } from '@/lib/i18n';

const FEATURE_ICONS = [IconTarget, IconChartBar, IconCalendar, IconClock, IconStack2, IconShieldCheck];

/* ── Desktop slide mock-up components ── */

function SlideHome() {
  return (
    <div style={{ background: '#0E0E0E', padding: '20px 20px 16px', fontFamily: 'inherit' }}>
      {/* header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Good morning, Hyrum 👋</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F0EEF8' }}>Today's Overview</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <div style={{ fontSize: 10, color: '#22C55E', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>🔥 14-day streak</div>
        </div>
      </div>
      {/* stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { label: 'Courses', value: '9', sub: 'active', color: '#5B5BD6' },
          { label: 'Done Today', value: '4', sub: 'of 8 tasks', color: '#22C55E' },
          { label: 'Days Left', value: '10', sub: 'to exam', color: '#F59E0B' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{sub}</div>
            <div style={{ height: 2, borderRadius: 2, background: `${color}25`, marginTop: 8 }}>
              <div style={{ height: '100%', width: '60%', background: color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
      {/* today tasks */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Today's Tasks</div>
        {[
          { text: 'Review OSI Model layers', done: true,  tag: 'CCST' },
          { text: 'Practice subnetting /24–/28', done: true,  tag: 'CCST' },
          { text: 'Read Azure Identity chapter', done: false, tag: 'AZ-900' },
          { text: 'Watch DNS lab recording', done: false, tag: 'CCST' },
        ].map(({ text, done, tag }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, flexShrink: 0, border: done ? 'none' : '1.5px solid rgba(255,255,255,0.2)', background: done ? '#5B5BD6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {done && <span style={{ fontSize: 8, color: '#fff' }}>✓</span>}
            </div>
            <span style={{ fontSize: 10, color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)', textDecoration: done ? 'line-through' : 'none', flex: 1 }}>{text}</span>
            <span style={{ fontSize: 8, color: '#5B5BD6', background: 'rgba(91,91,214,0.12)', border: '1px solid rgba(91,91,214,0.2)', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCalendar() {
  const days = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  const today = 3;
  const events = [
    { time: '9:00 AM',  title: 'CCST Lab Practice',    color: '#5B5BD6', dur: '1h' },
    { time: '11:30 AM', title: 'Subnetting Quiz',       color: '#F59E0B', dur: '45m' },
    { time: '2:00 PM',  title: 'AZ-900 Study Session',  color: '#22C55E', dur: '2h' },
    { time: '4:30 PM',  title: 'Mock Exam Simulation',  color: '#EF4444', dur: '1.5h' },
  ];
  return (
    <div style={{ background: '#0E0E0E', padding: '20px 20px 16px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#F0EEF8' }}>June 2026</div>
        <div style={{ fontSize: 10, color: '#5B5BD6', background: 'rgba(91,91,214,0.12)', border: '1px solid rgba(91,91,214,0.2)', borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}>4 events today</div>
      </div>
      {/* mini week strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 14 }}>
        {days.map((d, i) => (
          <div key={d} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{d}</div>
            <div style={{
              width: 26, height: 26, borderRadius: '50%', margin: '0 auto',
              background: i === today ? '#5B5BD6' : 'transparent',
              border: i === today ? 'none' : '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: i === today ? 700 : 400,
              color: i === today ? '#fff' : 'rgba(255,255,255,0.55)',
            }}>{i + 1}</div>
          </div>
        ))}
      </div>
      {/* events list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {events.map(({ time, title, color, dur }) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ width: 3, height: 32, borderRadius: 2, background: color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{title}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{time} · {dur}</div>
            </div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCourses() {
  const courses = [
    { name: 'CCST Networking',        pct: 68, color: '#5B5BD6', tag: 'Cisco', items: 34 },
    { name: 'AZ-900 Fundamentals',    pct: 42, color: '#22C55E', tag: 'Azure', items: 28 },
    { name: 'Network+ Prep',          pct: 15, color: '#F59E0B', tag: 'CompTIA', items: 55 },
    { name: 'SC-900 Security',        pct: 5,  color: '#EF4444', tag: 'Azure', items: 20 },
  ];
  return (
    <div style={{ background: '#0E0E0E', padding: '20px 20px 16px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#F0EEF8' }}>My Courses</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>4 active</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {courses.map(({ name, pct, color, tag, items }) => (
          <div key={name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{name}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ fontSize: 8, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>{tag}</span>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{items} items</span>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color }}>{pct}%</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 600ms ease' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideOverview() {
  return (
    <div style={{ background: '#0E0E0E', padding: '20px 20px 16px', fontFamily: 'inherit' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#F0EEF8', marginBottom: 14 }}>Study Analytics</div>
      {/* weekly bar chart */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 14px', marginBottom: 10 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Items completed · this week</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 50 }}>
          {[3,7,5,9,4,8,6].map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', background: i === 3 ? '#5B5BD6' : 'rgba(91,91,214,0.35)', borderRadius: '3px 3px 0 0', height: `${(v / 9) * 50}px`, transition: 'height 600ms ease' }} />
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)' }}>{['M','T','W','T','F','S','S'][i]}</div>
            </div>
          ))}
        </div>
      </div>
      {/* progress rings row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
        {[
          { label: 'CCST', pct: 68, color: '#5B5BD6' },
          { label: 'AZ-900', pct: 42, color: '#22C55E' },
          { label: 'Net+', pct: 15, color: '#F59E0B' },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ display: 'block', margin: '0 auto 6px' }}>
              <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
              <circle cx="24" cy="24" r="19" fill="none" stroke={color} strokeWidth="5"
                strokeDasharray={`${(pct / 100) * 119.4} 119.4`}
                strokeLinecap="round" transform="rotate(-90 24 24)" />
              <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill={color}>{pct}%</text>
            </svg>
            <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideAI() {
  const msgs = [
    { role: 'user', text: 'Explain the difference between TCP and UDP simply.' },
    { role: 'ai',   text: 'TCP is like a phone call — it confirms every packet arrived in order. UDP is like sending postcards — faster, but no guarantee they all arrive. Use TCP for reliability (web, email), UDP for speed (video, gaming).' },
    { role: 'user', text: 'Give me 3 practice questions on subnetting.' },
  ];
  return (
    <div style={{ background: '#0E0E0E', padding: '20px 20px 16px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(91,91,214,0.15)', border: '1px solid rgba(91,91,214,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✦</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#F0EEF8' }}>AI Study Assistant</div>
          <div style={{ fontSize: 9, color: '#5B5BD6' }}>CCST · AZ-900 context loaded</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
        {msgs.map(({ role, text }, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '8px 10px', borderRadius: role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
              background: role === 'user' ? 'rgba(91,91,214,0.25)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${role === 'user' ? 'rgba(91,91,214,0.35)' : 'rgba(255,255,255,0.08)'}`,
              fontSize: 10, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5,
            }}>{text}</div>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ padding: '8px 12px', borderRadius: '10px 10px 10px 2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
            </div>
          </div>
        </div>
      </div>
      {/* input bar */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(91,91,214,0.25)', borderRadius: 8, padding: '6px 10px' }}>
        <span style={{ flex: 1, fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Ask anything about your courses…</span>
        <div style={{ width: 20, height: 20, borderRadius: 5, background: '#5B5BD6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff' }}>↑</div>
      </div>
    </div>
  );
}

/* ── Mobile slide mock-up components (compact, ~300px wide) ── */

function SlideHomeMobile() {
  return (
    <div style={{ background: '#0E0E0E', padding: '14px 14px 12px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 1 }}>Good morning, Hyrum 👋</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#F0EEF8' }}>Today's Overview</div>
        </div>
        <div style={{ fontSize: 9, color: '#22C55E', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>🔥 14d streak</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
        {[
          { label: 'Courses', value: '9', sub: 'active', color: '#5B5BD6' },
          { label: 'Done', value: '4', sub: 'of 8', color: '#22C55E' },
          { label: 'Days', value: '10', sub: 'to exam', color: '#F59E0B' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px 10px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Today's Tasks</div>
        {[
          { text: 'Review OSI Model layers', done: true,  tag: 'CCST' },
          { text: 'Practice subnetting /24–/28', done: true,  tag: 'CCST' },
          { text: 'Read Azure Identity chapter', done: false, tag: 'AZ-900' },
        ].map(({ text, done, tag }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
            <div style={{ width: 13, height: 13, borderRadius: 3, flexShrink: 0, border: done ? 'none' : '1.5px solid rgba(255,255,255,0.2)', background: done ? '#5B5BD6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {done && <span style={{ fontSize: 7, color: '#fff' }}>✓</span>}
            </div>
            <span style={{ fontSize: 9, color: done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)', textDecoration: done ? 'line-through' : 'none', flex: 1 }}>{text}</span>
            <span style={{ fontSize: 7, color: '#5B5BD6', background: 'rgba(91,91,214,0.12)', border: '1px solid rgba(91,91,214,0.2)', borderRadius: 3, padding: '1px 4px', fontWeight: 600 }}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCalendarMobile() {
  const days = ['Mo','Tu','We','Th','Fr','Sa','Su'];
  const today = 3;
  const events = [
    { time: '9:00 AM',  title: 'CCST Lab Practice',   color: '#5B5BD6', dur: '1h' },
    { time: '11:30 AM', title: 'Subnetting Quiz',      color: '#F59E0B', dur: '45m' },
    { time: '2:00 PM',  title: 'AZ-900 Study Session', color: '#22C55E', dur: '2h' },
  ];
  return (
    <div style={{ background: '#0E0E0E', padding: '14px 14px 12px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F0EEF8' }}>June 2026</div>
        <div style={{ fontSize: 9, color: '#5B5BD6', background: 'rgba(91,91,214,0.12)', border: '1px solid rgba(91,91,214,0.2)', borderRadius: 5, padding: '2px 8px', fontWeight: 600 }}>4 events today</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 10 }}>
        {days.map((d, i) => (
          <div key={d} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>{d}</div>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', margin: '0 auto',
              background: i === today ? '#5B5BD6' : 'transparent',
              border: i === today ? 'none' : '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: i === today ? 700 : 400,
              color: i === today ? '#fff' : 'rgba(255,255,255,0.55)',
            }}>{i + 1}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {events.map(({ time, title, color, dur }) => (
          <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 7, padding: '7px 8px' }}>
            <div style={{ width: 3, height: 28, borderRadius: 2, background: color, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{title}</div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{time} · {dur}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideCoursesMobile() {
  const courses = [
    { name: 'CCST Networking',     pct: 68, color: '#5B5BD6', tag: 'Cisco' },
    { name: 'AZ-900 Fundamentals', pct: 42, color: '#22C55E', tag: 'Azure' },
    { name: 'Network+ Prep',       pct: 15, color: '#F59E0B', tag: 'CompTIA' },
  ];
  return (
    <div style={{ background: '#0E0E0E', padding: '14px 14px 12px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F0EEF8' }}>My Courses</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>4 active</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {courses.map(({ name, pct, color, tag }) => (
          <div key={name} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 2 }}>{name}</div>
                <span style={{ fontSize: 7, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 3, padding: '1px 5px', fontWeight: 600 }}>{tag}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color }}>{pct}%</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideOverviewMobile() {
  return (
    <div style={{ background: '#0E0E0E', padding: '14px 14px 12px', fontFamily: 'inherit' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#F0EEF8', marginBottom: 10 }}>Study Analytics</div>
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Items completed · this week</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 44 }}>
          {[3,7,5,9,4,8,6].map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ width: '100%', background: i === 3 ? '#5B5BD6' : 'rgba(91,91,214,0.35)', borderRadius: '3px 3px 0 0', height: `${(v / 9) * 44}px` }} />
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>{['M','T','W','T','F','S','S'][i]}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
        {[
          { label: 'CCST', pct: 68, color: '#5B5BD6' },
          { label: 'AZ-900', pct: 42, color: '#22C55E' },
          { label: 'Net+', pct: 15, color: '#F59E0B' },
        ].map(({ label, pct, color }) => (
          <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '8px', textAlign: 'center' }}>
            <svg width="42" height="42" viewBox="0 0 48 48" style={{ display: 'block', margin: '0 auto 4px' }}>
              <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
              <circle cx="24" cy="24" r="19" fill="none" stroke={color} strokeWidth="5"
                strokeDasharray={`${(pct / 100) * 119.4} 119.4`}
                strokeLinecap="round" transform="rotate(-90 24 24)" />
              <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="800" fill={color}>{pct}%</text>
            </svg>
            <div style={{ fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideAIMobile() {
  const msgs = [
    { role: 'user', text: 'Explain TCP vs UDP simply.' },
    { role: 'ai',   text: 'TCP is like a phone call — confirms every packet arrived. UDP is like postcards — faster, no delivery guarantee.' },
    { role: 'user', text: 'Give me subnetting practice questions.' },
  ];
  return (
    <div style={{ background: '#0E0E0E', padding: '14px 14px 12px', fontFamily: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(91,91,214,0.15)', border: '1px solid rgba(91,91,214,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✦</div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#F0EEF8' }}>AI Study Assistant</div>
          <div style={{ fontSize: 8, color: '#5B5BD6' }}>CCST · AZ-900 context loaded</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
        {msgs.map(({ role, text }, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '82%', padding: '6px 9px',
              borderRadius: role === 'user' ? '9px 9px 2px 9px' : '9px 9px 9px 2px',
              background: role === 'user' ? 'rgba(91,91,214,0.25)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${role === 'user' ? 'rgba(91,91,214,0.35)' : 'rgba(255,255,255,0.08)'}`,
              fontSize: 9, color: 'rgba(255,255,255,0.82)', lineHeight: 1.5,
            }}>{text}</div>
          </div>
        ))}
        <div style={{ display: 'flex' }}>
          <div style={{ padding: '6px 10px', borderRadius: '9px 9px 9px 2px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />)}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(91,91,214,0.25)', borderRadius: 7, padding: '5px 9px' }}>
        <span style={{ flex: 1, fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>Ask anything about your courses…</span>
        <div style={{ width: 18, height: 18, borderRadius: 4, background: '#5B5BD6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff' }}>↑</div>
      </div>
    </div>
  );
}

const SLIDES = [
  { label: 'Home',         desc: 'Daily overview, tasks & streak',    route: 'home',      desktop: <SlideHome />,     mobile: <SlideHomeMobile /> },
  { label: 'Calendar',     desc: 'Events, deadlines and study blocks', route: 'calendar',  desktop: <SlideCalendar />, mobile: <SlideCalendarMobile /> },
  { label: 'Courses',      desc: 'All your certification courses',     route: 'courses',   desktop: <SlideCourses />,  mobile: <SlideCoursesMobile /> },
  { label: 'Analytics',    desc: 'Progress charts & catch-up view',    route: 'overview',  desktop: <SlideOverview />, mobile: <SlideOverviewMobile /> },
  { label: 'AI Assistant', desc: 'Chat with your AI study partner',    route: 'ai',        desktop: <SlideAI />,       mobile: <SlideAIMobile /> },
];

/* ── Desktop carousel — browser chrome frame ── */
function AppCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActive(i => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive(i => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  function pause() { if (timerRef.current) clearInterval(timerRef.current); }
  function resume() { timerRef.current = setInterval(next, 4000); }

  return (
    <div onMouseEnter={pause} onMouseLeave={resume} style={{ position: 'relative' }}>
      {/* Browser chrome */}
      <div style={{
        borderRadius: 20, border: '1px solid rgba(255,255,255,0.10)',
        overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.75)',
        background: '#0E0E0E',
      }}>
        {/* Title bar */}
        <div style={{
          height: 38, background: '#1a1a1a',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6,
        }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <div style={{
            flex: 1, marginLeft: 10, height: 22, borderRadius: 5,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(91,91,214,0.6)' }} />
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>
              paceup.app/{SLIDES[active].route}
            </span>
          </div>
        </div>

        {/* Slides */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 300 }}>
          {SLIDES.map((slide, i) => (
            <div
              key={slide.label}
              style={{
                position: i === 0 ? 'relative' : 'absolute',
                inset: 0,
                opacity: i === active ? 1 : 0,
                transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}
            >
              {slide.desktop}
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next arrows */}
      {[{ dir: 'prev', fn: prev, icon: IconChevronLeft }, { dir: 'next', fn: next, icon: IconChevronRight }].map(({ dir, fn, icon: Icon }) => (
        <button
          key={dir} type="button" onClick={fn}
          style={{
            position: 'absolute', top: '50%',
            [dir === 'prev' ? 'left' : 'right']: -20,
            transform: 'translateY(-50%)',
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(18,18,25,0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
            transition: 'all 150ms ease', zIndex: 10,
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,91,214,0.70)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,91,214,0.5)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(18,18,25,0.85)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
        >
          <Icon size={18} />
        </button>
      ))}

      {/* Slide label + dots */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{SLIDES[active].label}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{SLIDES[active].desc}</div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {SLIDES.map((_, i) => (
          <button
            key={i} type="button" onClick={() => setActive(i)}
            style={{
              width: i === active ? 20 : 6, height: 6,
              borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0,
              background: i === active ? '#5B5BD6' : 'rgba(255,255,255,0.2)',
              transition: 'width 250ms ease, background 250ms ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Mobile carousel — phone frame ── */
function MobileAppCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActive(i => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setActive(i => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    timerRef.current = setInterval(next, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next]);

  function pause() { if (timerRef.current) clearInterval(timerRef.current); }
  function resume() { timerRef.current = setInterval(next, 4000); }

  const arrowBtn: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: 36, height: 36, borderRadius: '50%',
    background: 'rgba(18,18,25,0.85)', border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.8)',
    transition: 'all 150ms ease', zIndex: 10,
  };

  return (
    <div onMouseEnter={pause} onMouseLeave={resume}
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
        <button type="button" onClick={prev}
          style={{ ...arrowBtn, left: -22 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,91,214,0.70)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,91,214,0.5)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(18,18,25,0.85)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
        ><IconChevronLeft size={16} /></button>

        {/* Phone shell */}
        <div style={{
          borderRadius: 40, border: '9px solid rgba(255,255,255,0.13)',
          overflow: 'hidden',
          boxShadow: '0 40px 120px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.05)',
          background: '#0E0E0E',
        }}>
          {/* Status bar */}
          <div style={{ background: '#0E0E0E', padding: '10px 18px 5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '-0.01em' }}>9:41</span>
            {/* Dynamic island */}
            <div style={{ width: 80, height: 24, background: '#000', borderRadius: 20 }} />
            {/* Icons */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <svg width="15" height="11" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="6" width="3" height="6" rx="1" fill="rgba(255,255,255,0.75)"/>
                <rect x="4.5" y="4" width="3" height="8" rx="1" fill="rgba(255,255,255,0.75)"/>
                <rect x="9" y="2" width="3" height="10" rx="1" fill="rgba(255,255,255,0.75)"/>
                <rect x="13.5" y="0" width="3" height="12" rx="1" fill="rgba(255,255,255,0.75)"/>
              </svg>
              <svg width="14" height="11" viewBox="0 0 16 12" fill="none">
                <circle cx="8" cy="10.5" r="1.5" fill="rgba(255,255,255,0.75)"/>
                <path d="M4.5 7.5C5.7 6.1 10.3 6.1 11.5 7.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 5C4.2 2.3 11.8 2.3 14 5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <div style={{ width: 20, height: 10, border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: 3, padding: '1.5px', display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '78%', height: '100%', background: 'rgba(255,255,255,0.75)', borderRadius: 1.5 }} />
                </div>
                <div style={{ width: 2, height: 4, background: 'rgba(255,255,255,0.5)', borderRadius: '0 1px 1px 0' }} />
              </div>
            </div>
          </div>

          {/* Slides */}
          <div style={{ position: 'relative', overflow: 'hidden', minHeight: 310 }}>
            {SLIDES.map((slide, i) => (
              <div key={slide.label} style={{
                position: i === 0 ? 'relative' : 'absolute', inset: 0,
                opacity: i === active ? 1 : 0,
                transition: 'opacity 500ms cubic-bezier(0.4,0,0.2,1)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}>
                {slide.mobile}
              </div>
            ))}
          </div>

          {/* Bottom nav mockup */}
          <div style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '7px 0 3px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {[
              { label: 'Home', route: 'home' },
              { label: 'Courses', route: 'courses' },
              { label: 'Study', route: 'study' },
              { label: 'Calendar', route: 'calendar' },
              { label: 'Overview', route: 'overview' },
            ].map(({ label, route }) => {
              const isActive = SLIDES[active].route === route;
              return (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, background: isActive ? 'rgba(91,91,214,0.25)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: isActive ? '#5B5BD6' : 'rgba(255,255,255,0.2)' }} />
                  </div>
                  <span style={{ fontSize: 6, color: isActive ? '#5B5BD6' : 'rgba(255,255,255,0.3)', fontWeight: isActive ? 700 : 400 }}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Home indicator */}
          <div style={{ background: '#111', padding: '5px 0 8px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 90, height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
          </div>
        </div>

        <button type="button" onClick={next}
          style={{ ...arrowBtn, right: -22 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(91,91,214,0.70)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(91,91,214,0.5)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(18,18,25,0.85)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
        ><IconChevronRight size={16} /></button>
      </div>

      {/* Label + dots */}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{SLIDES[active].label}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{SLIDES[active].desc}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
        {SLIDES.map((_, i) => (
          <button key={i} type="button" onClick={() => setActive(i)}
            style={{
              width: i === active ? 20 : 6, height: 6,
              borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0,
              background: i === active ? '#5B5BD6' : 'rgba(255,255,255,0.2)',
              transition: 'width 250ms ease, background 250ms ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('paceup_authed')) {
      router.replace('/home');
    }
    setLang(getStoredLang());
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
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

        {/* App carousel — desktop: browser frame, mobile: phone frame */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '0 40px 80px' : '0 48px 100px' }}>
          {isMobile ? <MobileAppCarousel /> : <AppCarousel />}
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
