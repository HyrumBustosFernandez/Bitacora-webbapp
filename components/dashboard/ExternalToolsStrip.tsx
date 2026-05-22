'use client';

import { useState, useEffect } from 'react';
import {
  IconCalendar, IconMail, IconCloud, IconSchool,
} from '@tabler/icons-react';

const STATIC_TOOLS = [
  { label: 'Google Calendar', icon: IconCalendar, url: 'https://calendar.google.com' },
  { label: 'Gmail',           icon: IconMail,     url: 'https://mail.google.com' },
  { label: 'Google Drive',    icon: IconCloud,    url: 'https://drive.google.com' },
];

export default function ExternalToolsStrip() {
  const [duocUrl, setDuocUrl] = useState('https://campusvirtual.duoc.cl/');

  useEffect(() => {
    const saved = localStorage.getItem('setting_duoc_url');
    if (saved) setDuocUrl(saved);
  }, []);

  const tools = [
    ...STATIC_TOOLS,
    { label: 'DuocUC Campus', icon: IconSchool, url: duocUrl },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{
        fontSize: 9, fontWeight: 600, color: '#2E2E2E',
        textTransform: 'uppercase', letterSpacing: '0.5px',
      }}>
        External tools
      </span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {tools.map(({ label, icon: Icon, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6,
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, textDecoration: 'none',
            }}
          >
            <Icon size={16} color="#3A3A3A" strokeWidth={1.5} />
            <span style={{ fontSize: 10, color: '#484848', fontWeight: 500, textAlign: 'center' }}>
              {label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
