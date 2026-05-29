'use client';

import { useState, useEffect } from 'react';
import { IconExternalLink } from '@tabler/icons-react';

const STATIC_TOOLS = [
  { label: 'Cisco NetAcad',   url: 'https://www.netacad.com' },
  { label: 'Microsoft Learn', url: 'https://learn.microsoft.com' },
  { label: 'Google Calendar', url: 'https://calendar.google.com' },
  { label: 'Google Drive',    url: 'https://drive.google.com' },
  { label: 'Anki',            url: 'https://apps.ankiweb.net' },
];

export default function ExternalToolsStrip() {
  const [duocUrl, setDuocUrl] = useState('https://campusvirtual.duoc.cl/');

  useEffect(() => {
    const saved = localStorage.getItem('paceup_duoc_url');
    if (saved) setDuocUrl(saved);
  }, []);

  const tools = [
    ...STATIC_TOOLS,
    { label: 'DuocUC Campus', url: duocUrl },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{
        fontSize: 9, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.07em',
        color: 'var(--text-3)',
      }}>
        Open in
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {tools.map(({ label, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: 11, fontWeight: 500, color: 'var(--text-2)',
              padding: '5px 13px', borderRadius: 20,
              border: '1px solid var(--border-default)',
              background: 'var(--bg-surface)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-card)',
              transition: 'border-color 130ms, color 130ms, background 130ms, box-shadow 130ms',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)';
              (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
              (e.currentTarget as HTMLElement).style.background = 'var(--accent-subtle)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
            }}
          >
            {label}
            <IconExternalLink size={10} strokeWidth={2} style={{ opacity: 0.5 }} />
          </a>
        ))}
      </div>
    </div>
  );
}
