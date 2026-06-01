'use client';

import { useState, useEffect, useRef } from 'react';

interface Props { moduleId?: string }
type Phase = 'focus' | 'break' | 'longBreak';

const PHASE_COLORS: Record<Phase, string> = {
  focus:     'var(--accent)',
  break:     'var(--color-green)',
  longBreak: 'var(--color-amber)',
};
const PHASE_HEX: Record<Phase, string> = {
  focus:     '#4F6BFB',
  break:     '#3DD68C',
  longBreak: '#F5A623',
};
const PHASE_LABELS: Record<Phase, string> = {
  focus:     'FOCUS',
  break:     'BREAK',
  longBreak: 'LONG BREAK',
};

function fmt(secs: number) {
  return `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
}

function saveSession(moduleId: string, mins: number) {
  try {
    const sessions = JSON.parse(localStorage.getItem('paceup_study_sessions') || '[]');
    sessions.push({ date: new Date().toISOString(), moduleId, durationMinutes: mins });
    localStorage.setItem('paceup_study_sessions', JSON.stringify(sessions));
  } catch { /* ignore */ }
}

interface Settings { focus: number; shortBreak: number; longBreak: number }
const DEFAULT_SETTINGS: Settings = { focus: 25, shortBreak: 5, longBreak: 15 };

export default function PomodoroTimer({ moduleId = 'general' }: Props) {
  const [settings,     setSettings]     = useState<Settings>(DEFAULT_SETTINGS);
  const [editSettings, setEditSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [phase,        setPhase]        = useState<Phase>('focus');
  const [timeLeft,     setTimeLeft]     = useState(DEFAULT_SETTINGS.focus * 60);
  const [running,      setRunning]      = useState(false);
  const [session,      setSession]      = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('paceup_pomodoro_settings');
      if (stored) {
        const s = JSON.parse(stored) as Settings;
        setSettings(s); setEditSettings(s); setTimeLeft(s.focus * 60);
      }
    } catch { /* ignore */ }
  }, []);

  const totalForPhase = phase === 'focus'
    ? settings.focus * 60
    : phase === 'break'
    ? settings.shortBreak * 60
    : settings.longBreak * 60;

  const pct = totalForPhase > 0 ? (totalForPhase - timeLeft) / totalForPhase : 0;
  const R = 80, STROKE = 7;
  const circumference = 2 * Math.PI * R;
  const dashOffset = circumference * (1 - pct);

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setRunning(false);
          if (phase === 'focus') {
            saveSession(moduleId, settings.focus);
            const nextSession = session >= 4 ? 1 : session + 1;
            const nextPhase: Phase = session >= 4 ? 'longBreak' : 'break';
            setSession(nextSession);
            setPhase(nextPhase);
            setTimeLeft((nextPhase === 'longBreak' ? settings.longBreak : settings.shortBreak) * 60);
          } else {
            setPhase('focus');
            setTimeLeft(settings.focus * 60);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, session, moduleId, settings]);

  function reset() {
    setRunning(false); setPhase('focus'); setSession(1);
    setTimeLeft(settings.focus * 60);
  }
  function skipBreak() {
    setRunning(false); setPhase('focus');
    setTimeLeft(settings.focus * 60);
  }
  function saveSettings() {
    setSettings(editSettings);
    localStorage.setItem('paceup_pomodoro_settings', JSON.stringify(editSettings));
    setShowSettings(false); setRunning(false); setPhase('focus'); setSession(1);
    setTimeLeft(editSettings.focus * 60);
  }

  const hex = PHASE_HEX[phase];

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-default)',
      borderRadius: 14, padding: '20px 24px',
      display: 'flex', flexDirection: 'column', gap: 16,
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-1)' }}>Pomodoro Timer</span>
          <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
            25-min focused sprints reduce fatigue and improve retention
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowSettings(s => !s)}
          className="btn btn-secondary"
          style={{ padding: '4px 10px', fontSize: 10, fontWeight: 500 }}
        >
          {showSettings ? 'Hide' : 'Settings'}
        </button>
      </div>

      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {(['focus', 'break', 'longBreak'] as Phase[]).map(p => (
          <button
            key={p}
            type="button"
            onClick={() => {
              setRunning(false); setPhase(p);
              setTimeLeft((p === 'focus' ? settings.focus : p === 'break' ? settings.shortBreak : settings.longBreak) * 60);
            }}
            style={{
              flex: 1, padding: '5px 0',
              background: phase === p ? `${PHASE_HEX[p]}18` : 'transparent',
              border: `1px solid ${phase === p ? PHASE_HEX[p] + '55' : 'var(--border-subtle)'}`,
              borderRadius: 7, fontSize: 10, fontWeight: phase === p ? 600 : 500,
              color: phase === p ? PHASE_HEX[p] : 'var(--text-3)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 150ms ease',
            }}
          >
            {p === 'focus' ? `Focus ${settings.focus}m` : p === 'break' ? `Break ${settings.shortBreak}m` : `Long ${settings.longBreak}m`}
          </button>
        ))}
      </div>

      {/* SVG ring */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 180, height: 180 }}>
          <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="90" cy="90" r={R} fill="none" stroke="var(--bg-elevated)" strokeWidth={STROKE} />
            <circle
              cx="90" cy="90" r={R} fill="none"
              stroke={hex} strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          }}>
            <span style={{
              fontSize: 32, fontWeight: 600, color: 'var(--text-1)',
              fontVariantNumeric: 'tabular-nums', letterSpacing: 1,
              fontFamily: 'ui-monospace, monospace',
            }}>
              {fmt(timeLeft)}
            </span>
            <span style={{ fontSize: 9, fontWeight: 700, color: hex, letterSpacing: '1px' }}>
              {PHASE_LABELS[phase]}
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-4)' }}>
              Session {session} of 4
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={() => setRunning(r => !r)}
          className="btn btn-primary"
          style={{ flex: 2, background: hex, justifyContent: 'center' }}
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="btn btn-secondary"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          Reset
        </button>
        {phase !== 'focus' && (
          <button
            type="button"
            onClick={skipBreak}
            className="btn btn-secondary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Skip ⏭
          </button>
        )}
      </div>

      {/* Session dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: i <= session ? hex : 'var(--border-default)',
            opacity: i < session ? 0.5 : i === session ? 1 : 0.3,
            transition: 'all 0.3s ease',
          }} />
        ))}
        <span style={{ fontSize: 9, color: 'var(--text-4)', marginLeft: 4 }}>
          {session < 4 ? `${4 - session} until long break` : 'Long break next'}
        </span>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div style={{
          borderTop: '1px solid var(--border-subtle)', paddingTop: 14,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <span className="label-section">Customize durations</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {([
              ['Focus', 'focus'],
              ['Break', 'shortBreak'],
              ['Long Break', 'longBreak'],
            ] as [string, keyof Settings][]).map(([label, key]) => (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: 10, color: 'var(--text-3)', fontWeight: 500 }}>{label}</label>
                <input
                  type="number" min={1} max={60}
                  value={editSettings[key]}
                  onChange={e => setEditSettings(s => ({ ...s, [key]: parseInt(e.target.value) || 1 }))}
                  style={{
                    width: '100%', background: 'var(--bg-input)',
                    border: '1px solid var(--border-default)', borderRadius: 7,
                    padding: '5px 8px', color: 'var(--text-1)', fontSize: 12,
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border-default)')}
                />
              </div>
            ))}
          </div>
          <button
            type="button" onClick={saveSettings}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            Save settings
          </button>
        </div>
      )}
    </div>
  );
}
