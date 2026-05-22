'use client';

import { useState, useEffect, useRef } from 'react';

interface Props { moduleId: string }

type Phase = 'focus' | 'break';

const FOCUS_SECS = 25 * 60;
const BREAK_SECS =  5 * 60;

function fmt(secs: number) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function saveSession(moduleId: string, durationMinutes: number) {
  try {
    const sessions = JSON.parse(localStorage.getItem('study_sessions') || '[]');
    sessions.push({ date: new Date().toISOString(), moduleId, durationMinutes });
    localStorage.setItem('study_sessions', JSON.stringify(sessions));
  } catch {}
}

export default function PomodoroTimer({ moduleId }: Props) {
  const [phase,     setPhase]     = useState<Phase>('focus');
  const [timeLeft,  setTimeLeft]  = useState(FOCUS_SECS);
  const [running,   setRunning]   = useState(false);
  const [minimized, setMinimized] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          if (phase === 'focus') {
            saveSession(moduleId, 25);
            setPhase('break');
            setTimeLeft(BREAK_SECS);
          } else {
            setPhase('focus');
            setTimeLeft(FOCUS_SECS);
          }
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, moduleId]);

  function reset() {
    setRunning(false);
    setPhase('focus');
    setTimeLeft(FOCUS_SECS);
  }

  const phasePct = phase === 'focus'
    ? ((FOCUS_SECS - timeLeft) / FOCUS_SECS) * 100
    : ((BREAK_SECS - timeLeft) / BREAK_SECS) * 100;

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, zIndex: 50,
      background: '#141414',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 14,
      padding: minimized ? '8px 14px' : 16,
      minWidth: minimized ? 0 : 180,
      display: 'flex', flexDirection: 'column', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-8">
        <span style={{
          fontSize: 9, fontWeight: 600, color: phase === 'focus' ? '#4875F0' : '#22C55E',
          textTransform: 'uppercase', letterSpacing: '0.6px',
        }}>
          {phase === 'focus' ? '⏱ Focus' : '☕ Break'}
        </span>
        <button
          type="button" onClick={() => setMinimized(m => !m)}
          style={{ background: 'transparent', border: 0, color: '#484848', cursor: 'pointer', fontSize: 11, padding: 0 }}
        >
          {minimized ? '▲' : '▼'}
        </button>
      </div>

      {!minimized && (
        <>
          {/* Countdown */}
          <div style={{
            fontSize: 32, fontWeight: 600, color: '#EDE8DC',
            fontVariantNumeric: 'tabular-nums', textAlign: 'center', letterSpacing: 2,
          }}>
            {fmt(timeLeft)}
          </div>

          {/* Progress bar */}
          <div style={{
            height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.07)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${phasePct}%`,
              background: phase === 'focus' ? '#4875F0' : '#22C55E',
              borderRadius: 2, transition: 'width 1s linear',
            }} />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Btn
              onClick={() => setRunning(r => !r)}
              accent={phase === 'focus' ? '#4875F0' : '#22C55E'}
            >
              {running ? 'Pause' : 'Start'}
            </Btn>
            <Btn onClick={reset}>Reset</Btn>
          </div>
        </>
      )}
    </div>
  );
}

function Btn({ children, onClick, accent }: {
  children: React.ReactNode; onClick: () => void; accent?: string;
}) {
  return (
    <button
      type="button" onClick={onClick}
      style={{
        flex: 1, padding: '6px 0',
        background: accent ? `rgba(${accent === '#4875F0' ? '72,117,240' : '34,197,94'},0.12)` : 'rgba(255,255,255,0.05)',
        border: `1px solid ${accent ? (accent === '#4875F0' ? 'rgba(72,117,240,0.25)' : 'rgba(34,197,94,0.25)') : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 7, fontSize: 11, fontWeight: 500,
        color: accent ?? '#484848', cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
