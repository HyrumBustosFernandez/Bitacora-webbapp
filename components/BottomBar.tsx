'use client';

export default function BottomBar() {
  const links = [
    { label: 'GitHub',    href: 'https://github.com/HyrumBustosFernandez' },
    { label: 'LinkedIn',  href: 'https://linkedin.com' },
    { label: 'Portfolio', href: '#' },
    { label: 'Docs',      href: '#' },
  ];

  return (
    <footer style={{
      height: 34,
      background: 'var(--bg-page)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 20, padding: '0 20px', flexShrink: 0,
    }}>
      <span style={{ fontSize: 10, color: 'var(--text-4)' }}>© 2026 PaceUp</span>
      {links.map(({ label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 10, color: 'var(--text-4)', textDecoration: 'none' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-2)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-4)')}
        >
          {label} ↗
        </a>
      ))}
    </footer>
  );
}
