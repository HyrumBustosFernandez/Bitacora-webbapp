'use client';

import { useState, useCallback, useEffect } from 'react';
import { IconChevronLeft, IconPlus, IconCheck, IconArrowsSort } from '@tabler/icons-react';
import {
  Task, TaskPriority, TaskStatus, PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS,
  loadTasks, saveTask, deleteTask,
} from '@/lib/events';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onOpenCreate: (mode: 'task') => void;
  refreshKey: number;
}

type SortMode = 'default' | 'priority-high' | 'priority-low' | 'closest' | 'furthest';

const SORT_LABELS: Record<SortMode, string> = {
  'default':       'Default',
  'priority-high': 'Priority: High first',
  'priority-low':  'Priority: Low first',
  'closest':       'Deadline: Closest',
  'furthest':      'Deadline: Furthest',
};

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 };

function sortTasks(tasks: Task[], mode: SortMode): Task[] {
  const copy = [...tasks];
  if (mode === 'priority-high') return copy.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  if (mode === 'priority-low')  return copy.sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
  if (mode === 'closest')  return copy.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (mode === 'furthest') return copy.sort((a, b) => b.dueDate.localeCompare(a.dueDate));
  return copy;
}

function groupByList(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {};
  tasks.forEach(t => {
    const key = t.list?.trim() || 'Tasks';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  });
  return groups;
}

function priorityBg(p: TaskPriority) {
  const map: Record<TaskPriority, string> = {
    low: 'rgba(34,197,94,0.12)', medium: 'rgba(245,158,11,0.12)', high: 'rgba(239,68,68,0.12)',
  };
  return map[p];
}

function dueDateLabel(dueDate: string): { label: string; color: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0)   return { label: 'Overdue',        color: 'var(--color-red)'   };
  if (diffDays === 0) return { label: 'Due today',      color: 'var(--color-amber)' };
  if (diffDays === 1) return { label: 'Tomorrow',       color: 'var(--color-amber)' };
  if (diffDays <= 5)  return { label: `${diffDays}d left`, color: 'var(--color-amber)' };
  return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'var(--text-4)' };
}

export default function TasksSidebar({ collapsed, onToggle, onOpenCreate, refreshKey }: Props) {
  const [tasks,       setTasks]       = useState<Task[]>([]);
  const [sortMode,    setSortMode]    = useState<SortMode>('default');
  const [showSort,    setShowSort]    = useState(false);
  const [editingId,   setEditingId]   = useState<string | null>(null);

  const refresh = useCallback(() => setTasks(loadTasks()), []);
  useEffect(() => { refresh(); }, [refresh, refreshKey]);

  function toggleDone(task: Task) {
    saveTask({ ...task, status: task.status === 'done' ? 'todo' : 'done' });
    refresh();
  }

  function handleDelete(id: string) {
    deleteTask(id);
    if (editingId === id) setEditingId(null);
    refresh();
  }

  function handleSaveEdit(task: Task) {
    saveTask(task);
    setEditingId(null);
    refresh();
  }

  const pending = tasks.filter(t => t.status !== 'done');
  const done    = tasks.filter(t => t.status === 'done');
  const sorted  = sortTasks(pending, sortMode);
  const groups  = groupByList(sorted);

  return (
    <div style={{
      width: collapsed ? 0 : 280,
      flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-surface)',
      border: collapsed ? 'none' : '1px solid var(--border-subtle)',
      borderRadius: 16,
      overflow: 'hidden', minHeight: 0,
      opacity: collapsed ? 0 : 1,
      pointerEvents: collapsed ? 'none' : 'auto',
      transition: 'width 280ms cubic-bezier(0.4,0,0.2,1), opacity 280ms cubic-bezier(0.4,0,0.2,1)',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8,
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            My Tasks
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {pending.length} pending
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {/* Sort button */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowSort(v => !v)}
              title="Sort tasks"
              style={{
                width: 26, height: 26, borderRadius: 7,
                background: showSort ? 'var(--accent-subtle)' : 'transparent',
                border: 'none', color: showSort ? 'var(--accent)' : 'var(--text-3)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 130ms ease, color 130ms ease',
              }}
              onMouseEnter={e => {
                if (!showSort) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                }
              }}
              onMouseLeave={e => {
                if (!showSort) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
                }
              }}
            >
              <IconArrowsSort size={13} />
            </button>
            {showSort && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, zIndex: 50,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 10, padding: 4,
                boxShadow: 'var(--shadow-modal)',
                minWidth: 190,
                animation: 'modal-panel-in 160ms cubic-bezier(0.16,1,0.3,1) both',
              }}>
                {(Object.keys(SORT_LABELS) as SortMode[]).map(mode => (
                  <button
                    key={mode} type="button"
                    onClick={() => { setSortMode(mode); setShowSort(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '7px 10px', borderRadius: 7,
                      background: sortMode === mode ? 'var(--accent-subtle)' : 'transparent',
                      border: 'none', cursor: 'pointer',
                      fontSize: 11, fontWeight: sortMode === mode ? 600 : 400,
                      color: sortMode === mode ? 'var(--accent)' : 'var(--text-2)',
                      transition: 'background 120ms ease, color 120ms ease',
                    }}
                    onMouseEnter={e => {
                      if (sortMode !== mode) {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (sortMode !== mode) {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-2)';
                      }
                    }}
                  >
                    {SORT_LABELS[mode]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button" onClick={onToggle} title="Hide tasks"
            style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'transparent', border: 'none',
              color: 'var(--text-3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 130ms ease, color 130ms ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-1)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-3)';
            }}
          >
            <IconChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* Task list area */}
      <div
        style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}
        onClick={() => showSort && setShowSort(false)}
      >
        {tasks.length === 0 && (
          <div style={{ padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>No tasks yet</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Click "Add a task" to get started</div>
          </div>
        )}

        {Object.entries(groups).map(([listName, listTasks]) => (
          <div key={listName}>
            <div style={{
              padding: '8px 16px 4px',
              fontSize: 9, fontWeight: 700, color: 'var(--text-4)',
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {listName}
            </div>

            {listTasks.map(task => {
              const pc = PRIORITY_COLORS[task.priority];
              const { label: dueLabel, color: dueColor } = dueDateLabel(task.dueDate);
              if (editingId === task.id) {
                return (
                  <InlineEditRow
                    key={task.id}
                    task={task}
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingId(null)}
                  />
                );
              }
              return (
                <TaskRow
                  key={task.id}
                  task={task} pc={pc}
                  dueLabel={dueLabel} dueColor={dueColor}
                  onToggle={() => toggleDone(task)}
                  onEdit={() => setEditingId(task.id)}
                  onDelete={() => handleDelete(task.id)}
                />
              );
            })}
          </div>
        ))}

        {/* Add task button */}
        <button
          type="button" onClick={() => onOpenCreate('task')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', width: '100%',
            background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--text-4)',
            fontSize: 12, textAlign: 'left',
            transition: 'color 150ms ease, background 150ms ease',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(91,91,214,0.06)';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-4)';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <div style={{
            width: 18, height: 18, borderRadius: '50%',
            border: '1.5px dashed currentColor',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <IconPlus size={10} />
          </div>
          Add a task
        </button>

        {/* Completed section */}
        {done.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <div style={{
              padding: '8px 16px 4px', fontSize: 9, fontWeight: 700,
              color: 'var(--text-4)', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Completed ({done.length})
            </div>
            {done.map(task => {
              const pc = PRIORITY_COLORS[task.priority];
              const { label: dueLabel, color: dueColor } = dueDateLabel(task.dueDate);
              return (
                <TaskRow
                  key={task.id} task={task} pc={pc}
                  dueLabel={dueLabel} dueColor={dueColor}
                  onToggle={() => toggleDone(task)}
                  onEdit={() => setEditingId(task.id)}
                  onDelete={() => handleDelete(task.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Individual task row ── */
function TaskRow({
  task, pc, dueLabel, dueColor, onToggle, onEdit, onDelete,
}: {
  task: Task; pc: string; dueLabel: string; dueColor: string;
  onToggle: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const isDone = task.status === 'done';

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '7px 16px',
        transition: 'background 150ms ease',
        opacity: isDone ? 0.55 : 1,
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
    >
      {/* Circle checkbox */}
      <button
        type="button" onClick={onToggle}
        style={{
          width: 18, height: 18, borderRadius: '50%',
          border: `2px solid ${isDone ? pc : 'var(--border-default)'}`,
          background: isDone ? pc : 'transparent',
          cursor: 'pointer', flexShrink: 0, marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 150ms ease, background 150ms ease',
        }}
        onMouseEnter={e => { if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = pc; }}
        onMouseLeave={e => { if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'; }}
      >
        {isDone && <IconCheck size={10} color="#fff" strokeWidth={3} />}
      </button>

      {/* Content — click to edit */}
      <div style={{ flex: 1, minWidth: 0 }} onClick={onEdit}>
        <div style={{
          fontSize: 12, color: 'var(--text-1)', lineHeight: 1.4,
          textDecoration: isDone ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {task.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
          <span style={{ fontSize: 10, color: dueColor }}>{dueLabel}</span>
          <span style={{
            fontSize: 9, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
            background: `${pc}18`, color: pc, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        type="button" onClick={onDelete}
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--text-4)', cursor: 'pointer',
          fontSize: 14, lineHeight: 1, padding: '1px 2px',
          opacity: 0, transition: 'opacity 130ms ease, color 130ms ease', flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--color-red)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-4)'}
        className="task-delete-btn"
      >
        ×
      </button>
    </div>
  );
}

/* ── Inline edit form ── */
function InlineEditRow({ task, onSave, onCancel }: {
  task: Task; onSave: (t: Task) => void; onCancel: () => void;
}) {
  const [name,     setName]     = useState(task.name);
  const [dueDate,  setDueDate]  = useState(task.dueDate);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status,   setStatus]   = useState<TaskStatus>(task.status);

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg-input)',
    border: '1px solid var(--border-default)', borderRadius: 6,
    padding: '5px 8px', color: 'var(--text-1)',
    fontSize: 11, outline: 'none', fontFamily: 'inherit',
    colorScheme: 'dark',
    transition: 'border-color 120ms ease',
  };
  const selStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: '24px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'calc(100% - 6px) center',
  };

  return (
    <div style={{
      padding: '8px 16px',
      background: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <input
          autoFocus type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Task name" style={inputStyle}
          onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle}
            onFocus={e => { e.target.style.borderColor = 'var(--border-focus)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }} />
          <select value={priority} onChange={e => setPriority(e.target.value as TaskPriority)} style={selStyle}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <select value={status} onChange={e => setStatus(e.target.value as TaskStatus)} style={selStyle}>
          <option value="todo">To do</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
        </select>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => onSave({ ...task, name, dueDate, priority, status })}
            style={{
              flex: 2, padding: '5px 0', borderRadius: 6,
              background: 'var(--accent)', border: 'none',
              color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            type="button" onClick={onCancel}
            style={{
              flex: 1, padding: '5px 0', borderRadius: 6,
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              color: 'var(--text-3)', fontSize: 11, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
