export interface NoteRecord {
  content: string;
  updatedAt: string;  // ISO date string
  moduleId: string;
  courseName: string;
  moduleName: string;
}

export function loadNote(moduleId: string): NoteRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`note_${moduleId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveNote(record: NoteRecord): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(`note_${record.moduleId}`, JSON.stringify(record)); } catch {}
}

export function loadAllNotes(): NoteRecord[] {
  if (typeof window === 'undefined') return [];
  const notes: NoteRecord[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('note_')) continue;
    try {
      const n = JSON.parse(localStorage.getItem(key)!);
      if (n?.moduleId) notes.push(n);
    } catch {}
  }
  return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function renderMarkdown(text: string): string {
  return text
    .split('\n')
    .map(line => {
      if (/^## (.+)/.test(line)) return `<h2 style="font-size:14px;font-weight:600;color:#EDE8DC;margin:6px 0 3px">${line.slice(3)}</h2>`;
      if (/^# (.+)/.test(line))  return `<h1 style="font-size:16px;font-weight:700;color:#EDE8DC;margin:8px 0 4px">${line.slice(2)}</h1>`;
      if (/^- (.+)/.test(line))  return `<li style="color:#A8A29A;font-size:12px;margin-left:14px">${line.slice(2).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</li>`;
      const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      return html ? `<p style="color:#A8A29A;font-size:12px;margin:2px 0">${html}</p>` : '<br>';
    })
    .join('');
}
