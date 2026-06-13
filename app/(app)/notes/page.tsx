'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadFolders, saveFolders, loadStandaloneNotes,
  saveStandaloneNote, deleteStandaloneNote, createFolder,
  renameFolder, deleteFolder, createStandaloneNote,
  type NoteFolder, type StandaloneNote,
} from '@/lib/notes';
import {
  IconPlus, IconFolder, IconFolderOpen, IconFileText,
  IconTrash, IconEdit, IconCheck, IconX, IconNotes,
  IconDotsVertical,
} from '@tabler/icons-react';

// ── helpers ───────────────────────────────────────────────────────────────────

function timeLabel(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── sub-components ────────────────────────────────────────────────────────────

function InlineRename({
  initial, onSave, onCancel,
}: { initial: string; onSave: (v: string) => void; onCancel: () => void }) {
  const [val, setVal] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <input
      ref={ref}
      value={val}
      onChange={e => setVal(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Enter' && val.trim()) onSave(val.trim());
        if (e.key === 'Escape') onCancel();
      }}
      onBlur={() => { if (val.trim()) onSave(val.trim()); else onCancel(); }}
      style={{
        flex: 1, background: 'transparent', border: 'none',
        outline: 'none', color: 'var(--text-1)', fontSize: 12,
        fontFamily: 'inherit', fontWeight: 500, minWidth: 0,
        borderBottom: '1px solid var(--accent)',
      }}
    />
  );
}

// ── main component ────────────────────────────────────────────────────────────

type FolderFilter = 'all' | 'unfiled' | string; // string = folder id

export default function NotesPage() {
  const [mounted, setMounted] = useState(false);
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [notes,   setNotes]   = useState<StandaloneNote[]>([]);

  // navigation state
  const [activeFolder, setActiveFolder] = useState<FolderFilter>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  // editor state (local, flushed to storage on change)
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');

  // ui state
  const [renamingFolder, setRenamingFolder] = useState<string | null>(null);
  const [newFolderName,  setNewFolderName]  = useState('');
  const [addingFolder,   setAddingFolder]   = useState(false);
  const [folderMenu,     setFolderMenu]     = useState<string | null>(null);
  const [noteMenu,       setNoteMenu]       = useState<string | null>(null);
  const [mobileView,     setMobileView]     = useState<'folders' | 'list' | 'editor'>('folders');

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newFolderRef = useRef<HTMLInputElement>(null);

  // ── init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
    setFolders(loadFolders());
    setNotes(loadStandaloneNotes());
  }, []);

  useEffect(() => {
    if (addingFolder) newFolderRef.current?.focus();
  }, [addingFolder]);

  // ── derived ───────────────────────────────────────────────────────────────
  const visibleNotes = notes
    .filter(n => {
      if (activeFolder === 'all')    return true;
      if (activeFolder === 'unfiled') return n.folderId === null;
      return n.folderId === activeFolder;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const activeNote = notes.find(n => n.id === activeNoteId) ?? null;

  // ── auto-save ─────────────────────────────────────────────────────────────
  const flushSave = useCallback((id: string, t: string, c: string) => {
    const note = loadStandaloneNotes().find(n => n.id === id);
    if (!note) return;
    const updated = { ...note, title: t, content: c, updatedAt: new Date().toISOString() };
    saveStandaloneNote(updated);
    setNotes(loadStandaloneNotes());
  }, []);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!activeNoteId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => flushSave(activeNoteId, val, content), 600);
  }

  function handleContentChange(val: string) {
    setContent(val);
    if (!activeNoteId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => flushSave(activeNoteId, title, val), 600);
  }

  // ── actions ───────────────────────────────────────────────────────────────
  function selectNote(id: string) {
    if (saveTimer.current) { clearTimeout(saveTimer.current); }
    if (activeNoteId) flushSave(activeNoteId, title, content);
    const n = notes.find(x => x.id === id);
    if (!n) return;
    setActiveNoteId(id);
    setTitle(n.title);
    setContent(n.content);
    setMobileView('editor');
  }

  function handleNewNote() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    if (activeNoteId) flushSave(activeNoteId, title, content);
    const folderId = activeFolder === 'all' || activeFolder === 'unfiled' ? null : activeFolder;
    const note = createStandaloneNote(folderId);
    setNotes(loadStandaloneNotes());
    setActiveNoteId(note.id);
    setTitle('');
    setContent('');
    setMobileView('editor');
  }

  function handleDeleteNote(id: string) {
    deleteStandaloneNote(id);
    setNotes(loadStandaloneNotes());
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setTitle('');
      setContent('');
      setMobileView('list');
    }
    setNoteMenu(null);
  }

  function handleNewFolder() {
    const name = newFolderName.trim();
    if (!name) { setAddingFolder(false); return; }
    const f = createFolder(name);
    setFolders(loadFolders());
    setNewFolderName('');
    setAddingFolder(false);
    setActiveFolder(f.id);
    setMobileView('list');
  }

  function handleRenameFolder(id: string, name: string) {
    renameFolder(id, name);
    setFolders(loadFolders());
    setRenamingFolder(null);
  }

  function handleDeleteFolder(id: string) {
    deleteFolder(id);
    setFolders(loadFolders());
    setNotes(loadStandaloneNotes());
    if (activeFolder === id) setActiveFolder('all');
    setFolderMenu(null);
  }

  function countInFolder(fid: FolderFilter) {
    if (fid === 'all')    return notes.length;
    if (fid === 'unfiled') return notes.filter(n => n.folderId === null).length;
    return notes.filter(n => n.folderId === fid).length;
  }

  // ── styles ────────────────────────────────────────────────────────────────
  const panelBorder = '1px solid var(--border-default)';

  if (!mounted) return null;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 126px)',
      borderRadius: 12,
      border: panelBorder,
      overflow: 'hidden',
      background: 'var(--bg-surface)',
    }}>

      {/* ── Panel 1: Folders ───────────────────────────────────────────── */}
      <div
        className={mobileView === 'folders' ? 'notes-panel-visible' : 'notes-panel-hidden'}
        style={{
          width: 190,
          borderRight: panelBorder,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          background: 'var(--bg-surface)',
        }}
      >
        {/* header */}
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', borderBottom: panelBorder, flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Folders
          </span>
          <button
            type="button"
            onClick={() => setAddingFolder(true)}
            title="New folder"
            style={{
              width: 22, height: 22, borderRadius: 6, border: 'none',
              background: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)',
              transition: 'background 120ms, color 120ms',
            }}
            onMouseEnter={e => { (e.currentTarget).style.background = 'var(--bg-elevated)'; (e.currentTarget).style.color = 'var(--text-1)'; }}
            onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--text-3)'; }}
          >
            <IconPlus size={13} strokeWidth={2} />
          </button>
        </div>

        {/* folder list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 6px' }}>
          {/* All Notes */}
          <FolderRow
            label="All Notes"
            count={countInFolder('all')}
            active={activeFolder === 'all'}
            icon={<IconNotes size={14} strokeWidth={1.75} />}
            onClick={() => { setActiveFolder('all'); setMobileView('list'); }}
          />
          {/* Unfiled */}
          <FolderRow
            label="Unfiled"
            count={countInFolder('unfiled')}
            active={activeFolder === 'unfiled'}
            icon={<IconFileText size={14} strokeWidth={1.75} />}
            onClick={() => { setActiveFolder('unfiled'); setMobileView('list'); }}
          />

          {folders.length > 0 && (
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '6px 4px' }} />
          )}

          {folders.map(folder => (
            <div key={folder.id} style={{ position: 'relative' }}>
              <div
                onClick={() => { setActiveFolder(folder.id); setMobileView('list'); setFolderMenu(null); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '0 8px', height: 32, borderRadius: 7, cursor: 'pointer',
                  background: activeFolder === folder.id ? 'var(--accent-subtle)' : 'transparent',
                  color: activeFolder === folder.id ? 'var(--accent)' : 'var(--text-2)',
                  transition: 'background 120ms, color 120ms',
                }}
                onMouseEnter={e => { if (activeFolder !== folder.id) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { if (activeFolder !== folder.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {activeFolder === folder.id
                  ? <IconFolderOpen size={14} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                  : <IconFolder size={14} strokeWidth={1.75} style={{ flexShrink: 0, opacity: 0.7 }} />
                }

                {renamingFolder === folder.id ? (
                  <InlineRename
                    initial={folder.name}
                    onSave={name => handleRenameFolder(folder.id, name)}
                    onCancel={() => setRenamingFolder(null)}
                  />
                ) : (
                  <span style={{
                    flex: 1, fontSize: 12, fontWeight: activeFolder === folder.id ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {folder.name}
                  </span>
                )}

                {renamingFolder !== folder.id && (
                  <span style={{ fontSize: 10, color: 'var(--text-4)', marginLeft: 'auto', flexShrink: 0 }}>
                    {countInFolder(folder.id)}
                  </span>
                )}

                {/* folder menu trigger */}
                {renamingFolder !== folder.id && (
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setFolderMenu(folderMenu === folder.id ? null : folder.id); }}
                    style={{
                      width: 18, height: 18, borderRadius: 4, border: 'none',
                      background: 'transparent', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      color: 'var(--text-4)', opacity: 0,
                      transition: 'opacity 120ms',
                    }}
                    className="folder-menu-btn"
                  >
                    <IconDotsVertical size={11} />
                  </button>
                )}
              </div>

              {/* folder context menu */}
              {folderMenu === folder.id && (
                <FolderMenu
                  onRename={() => { setRenamingFolder(folder.id); setFolderMenu(null); }}
                  onDelete={() => handleDeleteFolder(folder.id)}
                  onClose={() => setFolderMenu(null)}
                />
              )}
            </div>
          ))}

          {/* New folder input */}
          {addingFolder && (
            <div style={{ padding: '4px 4px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '0 8px', height: 32, borderRadius: 7,
                border: '1px solid var(--accent)', background: 'var(--accent-subtle)',
              }}>
                <IconFolder size={14} strokeWidth={1.75} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <input
                  ref={newFolderRef}
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleNewFolder();
                    if (e.key === 'Escape') { setAddingFolder(false); setNewFolderName(''); }
                  }}
                  onBlur={handleNewFolder}
                  placeholder="Folder name"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: 12, fontFamily: 'inherit', color: 'var(--text-1)',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Panel 2: Notes List ────────────────────────────────────────── */}
      <div
        className={mobileView === 'list' ? 'notes-panel-visible' : (mobileView === 'folders' ? 'notes-panel-hidden' : 'notes-panel-hidden')}
        style={{
          width: 240,
          borderRight: panelBorder,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          background: 'var(--bg-surface)',
        }}
      >
        {/* header */}
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', borderBottom: panelBorder, flexShrink: 0,
        }}>
          {/* mobile back */}
          <button
            type="button"
            className="mobile-only"
            onClick={() => setMobileView('folders')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 11, padding: 0, marginRight: 8 }}
          >
            ← Folders
          </button>
          <span style={{
            fontSize: 11, fontWeight: 600, color: 'var(--text-3)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>
            {activeFolder === 'all' ? 'All Notes' : activeFolder === 'unfiled' ? 'Unfiled' : (folders.find(f => f.id === activeFolder)?.name ?? 'Notes')}
          </span>
          <button
            type="button"
            onClick={handleNewNote}
            title="New note"
            style={{
              width: 22, height: 22, borderRadius: 6, border: 'none',
              background: 'transparent', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)',
              transition: 'background 120ms, color 120ms',
            }}
            onMouseEnter={e => { (e.currentTarget).style.background = 'var(--bg-elevated)'; (e.currentTarget).style.color = 'var(--text-1)'; }}
            onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--text-3)'; }}
          >
            <IconPlus size={13} strokeWidth={2} />
          </button>
        </div>

        {/* note list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {visibleNotes.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', height: '100%', gap: 10, padding: 24,
            }}>
              <IconFileText size={28} style={{ color: 'var(--text-4)', opacity: 0.5 }} strokeWidth={1} />
              <span style={{ fontSize: 11, color: 'var(--text-4)', textAlign: 'center' }}>
                No notes here yet.
                <br />Click + to create one.
              </span>
            </div>
          ) : visibleNotes.map(note => (
            <div key={note.id} style={{ position: 'relative' }}>
              <div
                onClick={() => selectNote(note.id)}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  background: activeNoteId === note.id ? 'var(--accent-subtle)' : 'transparent',
                  transition: 'background 120ms',
                  position: 'relative',
                }}
                onMouseEnter={e => { if (activeNoteId !== note.id) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { if (activeNoteId !== note.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 500,
                    color: activeNoteId === note.id ? 'var(--accent)' : 'var(--text-1)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
                  }}>
                    {note.title || 'Untitled'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 9, color: 'var(--text-4)' }}>
                      {timeLabel(note.updatedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setNoteMenu(noteMenu === note.id ? null : note.id); }}
                      style={{
                        width: 16, height: 16, borderRadius: 3, border: 'none',
                        background: 'transparent', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)',
                        padding: 0,
                      }}
                    >
                      <IconDotsVertical size={10} />
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p style={{
                    fontSize: 11, color: 'var(--text-4)', margin: '2px 0 0',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {note.content.replace(/[#*`\-]/g, '').split('\n').find(l => l.trim()) ?? ''}
                  </p>
                )}
                {activeFolder === 'all' && note.folderId && (
                  <span style={{
                    fontSize: 9, color: 'var(--accent)', marginTop: 3, display: 'block',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {folders.find(f => f.id === note.folderId)?.name}
                  </span>
                )}
              </div>

              {/* note context menu */}
              {noteMenu === note.id && (
                <NoteMenu
                  onDelete={() => handleDeleteNote(note.id)}
                  onClose={() => setNoteMenu(null)}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Panel 3: Editor ───────────────────────────────────────────── */}
      <div
        className={mobileView === 'editor' ? 'notes-panel-visible' : 'notes-panel-hidden'}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background: 'var(--bg-base)',
        }}
      >
        {activeNote ? (
          <>
            {/* editor header */}
            <div style={{
              height: 44, display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 20px', borderBottom: panelBorder, flexShrink: 0,
              background: 'var(--bg-surface)',
            }}>
              {/* mobile back */}
              <button
                type="button"
                className="mobile-only"
                onClick={() => setMobileView('list')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: 11, padding: 0, flexShrink: 0 }}
              >
                ← Notes
              </button>
              <span style={{ fontSize: 10, color: 'var(--text-4)', marginLeft: 'auto' }}>
                Saved automatically
              </span>
              <button
                type="button"
                onClick={() => handleDeleteNote(activeNote.id)}
                title="Delete note"
                style={{
                  width: 26, height: 26, borderRadius: 6, border: 'none',
                  background: 'transparent', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)',
                  transition: 'background 120ms, color 120ms',
                }}
                onMouseEnter={e => { (e.currentTarget).style.background = 'var(--color-red-subtle, rgba(239,68,68,0.1))'; (e.currentTarget).style.color = 'var(--color-red, #ef4444)'; }}
                onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--text-4)'; }}
              >
                <IconTrash size={13} strokeWidth={1.75} />
              </button>
            </div>

            {/* title */}
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Note title"
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontSize: 20, fontWeight: 700, color: 'var(--text-1)',
                fontFamily: 'inherit', padding: '24px 28px 8px',
                flexShrink: 0, width: '100%', boxSizing: 'border-box',
              }}
            />

            {/* content */}
            <textarea
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              placeholder="Start writing…"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: 13, lineHeight: 1.7, color: 'var(--text-2)',
                fontFamily: 'inherit', padding: '0 28px 28px',
                resize: 'none', boxSizing: 'border-box',
              }}
            />
          </>
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
            <IconNotes size={40} style={{ color: 'var(--text-4)', opacity: 0.3 }} strokeWidth={1} />
            <span style={{ fontSize: 13, color: 'var(--text-4)' }}>Select a note to edit</span>
            <button
              type="button"
              onClick={handleNewNote}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 8,
                background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
                cursor: 'pointer', color: 'var(--accent)', fontSize: 12, fontWeight: 500,
                fontFamily: 'inherit', transition: 'background 120ms',
              }}
              onMouseEnter={e => (e.currentTarget).style.background = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget).style.background = 'var(--accent-subtle)'}
            >
              <IconPlus size={13} strokeWidth={2} />
              New Note
            </button>
          </div>
        )}
      </div>

      {/* ── overlay to close menus ─────────────────────────────────────── */}
      {(folderMenu || noteMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          onClick={() => { setFolderMenu(null); setNoteMenu(null); }}
        />
      )}
    </div>
  );
}

// ── small presentational components ──────────────────────────────────────────

function FolderRow({ label, count, active, icon, onClick }: {
  label: string; count: number; active: boolean;
  icon: React.ReactNode; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '0 8px', height: 32, borderRadius: 7, cursor: 'pointer',
        background: active ? 'var(--accent-subtle)' : 'transparent',
        color: active ? 'var(--accent)' : 'var(--text-2)',
        transition: 'background 120ms, color 120ms',
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 12, fontWeight: active ? 600 : 400 }}>{label}</span>
      <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{count}</span>
    </div>
  );
}

function FolderMenu({ onRename, onDelete, onClose }: {
  onRename: () => void; onDelete: () => void; onClose: () => void;
}) {
  return (
    <div style={{
      position: 'absolute', top: '100%', left: 8, zIndex: 100,
      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
      borderRadius: 8, padding: 4, boxShadow: 'var(--shadow-modal)',
      minWidth: 140,
    }}>
      <CtxItem icon={<IconEdit size={12} />} label="Rename" onClick={() => { onRename(); onClose(); }} />
      <CtxItem icon={<IconTrash size={12} />} label="Delete folder" onClick={onDelete} danger />
    </div>
  );
}

function NoteMenu({ onDelete, onClose }: { onDelete: () => void; onClose: () => void }) {
  return (
    <div style={{
      position: 'absolute', top: '100%', right: 8, zIndex: 100,
      background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
      borderRadius: 8, padding: 4, boxShadow: 'var(--shadow-modal)',
      minWidth: 130,
    }}>
      <CtxItem icon={<IconTrash size={12} />} label="Delete note" onClick={() => { onDelete(); onClose(); }} danger />
    </div>
  );
}

function CtxItem({ icon, label, onClick, danger }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        width: '100%', padding: '6px 10px', borderRadius: 6,
        background: hov ? (danger ? 'var(--color-red-subtle, rgba(239,68,68,0.1))' : 'var(--bg-elevated)') : 'transparent',
        border: 'none', cursor: 'pointer', color: danger ? 'var(--color-red, #ef4444)' : 'var(--text-2)',
        fontSize: 11, fontFamily: 'inherit', textAlign: 'left',
        transition: 'background 100ms, color 100ms',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
