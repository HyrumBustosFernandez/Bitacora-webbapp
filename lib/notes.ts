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

// ── Folders & standalone notes ────────────────────────────────────────────────

export interface NoteFolder {
  id: string;
  name: string;
  createdAt: string;
}

export interface StandaloneNote {
  id: string;
  folderId: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const FOLDERS_KEY = 'paceup_note_folders';
const SNOTES_KEY  = 'paceup_notes';

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function loadFolders(): NoteFolder[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(FOLDERS_KEY) ?? '[]'); } catch { return []; }
}

export function saveFolders(folders: NoteFolder[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
}

export function createFolder(name: string): NoteFolder {
  const f: NoteFolder = { id: uid(), name, createdAt: new Date().toISOString() };
  saveFolders([...loadFolders(), f]);
  return f;
}

export function renameFolder(id: string, name: string): void {
  saveFolders(loadFolders().map(f => f.id === id ? { ...f, name } : f));
}

export function deleteFolder(id: string): void {
  saveFolders(loadFolders().filter(f => f.id !== id));
  const notes = loadStandaloneNotes().map(n => n.folderId === id ? { ...n, folderId: null } : n);
  localStorage.setItem(SNOTES_KEY, JSON.stringify(notes));
}

export function loadStandaloneNotes(): StandaloneNote[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(SNOTES_KEY) ?? '[]'); } catch { return []; }
}

export function saveStandaloneNote(note: StandaloneNote): void {
  if (typeof window === 'undefined') return;
  const notes = loadStandaloneNotes();
  const idx = notes.findIndex(n => n.id === note.id);
  if (idx >= 0) notes[idx] = note; else notes.push(note);
  localStorage.setItem(SNOTES_KEY, JSON.stringify(notes));
}

export function deleteStandaloneNote(id: string): void {
  localStorage.setItem(SNOTES_KEY, JSON.stringify(loadStandaloneNotes().filter(n => n.id !== id)));
}

export function createStandaloneNote(folderId: string | null): StandaloneNote {
  const note: StandaloneNote = {
    id: uid(), folderId, title: '', content: '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };
  saveStandaloneNote(note);
  return note;
}

// ── Markdown renderer ─────────────────────────────────────────────────────────

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
