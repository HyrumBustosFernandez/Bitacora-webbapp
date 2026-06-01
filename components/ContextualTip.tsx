'use client';

import { useState, useEffect } from 'react';
import { IconX, IconInfoCircle } from '@tabler/icons-react';

interface Props {
  id: string;
  text: string;
}

const STORAGE_KEY = 'paceup_dismissed_tips';

function getDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function dismiss(id: string) {
  const set = getDismissed();
  set.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

export default function ContextualTip({ id, text }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!getDismissed().has(id));
  }, [id]);

  if (!visible) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--accent-border)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <IconInfoCircle
        size={14}
        color="var(--accent)"
        style={{ flexShrink: 0, marginTop: 1 }}
      />
      <span style={{ fontSize: 12, color: 'var(--text-1)', lineHeight: 1.55, flex: 1 }}>
        {text}
      </span>
      <button
        type="button"
        onClick={() => {
          dismiss(id);
          setVisible(false);
        }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          borderRadius: 5,
          color: 'var(--text-3)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        aria-label="Dismiss tip"
      >
        <IconX size={13} />
      </button>
    </div>
  );
}
