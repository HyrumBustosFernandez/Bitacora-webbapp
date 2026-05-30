'use client';

import { useState, useCallback, useEffect } from 'react';
import { IconChevronLeft, IconPlus, IconCheck } from '@tabler/icons-react';
import {
  Task, TaskPriority, PRIORITY_COLORS, PRIORITY_LABELS, STATUS_LABELS,
  loadTasks, saveTask, deleteTask,
} from '@/lib/events';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onOpenCreate: (mode: 'task') => void;
  refreshKey: number;
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
    low:    'rgba(34,197,94,0.12)',
    medium: 'rgba(245,158,11,0.12)',
    high:   'rgba(239,68,68,0.12)',
  };
  return map[p];
}

function dueDateLabel(dueDate: string): { label: string; color: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0)  return { label: 'Overdue',   color: 'var(--color-red)' };
  if (diffDays === 0) return { label: 'Due today',  color: 'var(--color-amber)' };
  if (diffDays === 1) return { label: 'Tomorrow',   color: 'var(--color-amber)' };
  if (diffDays <= 5)  return { label: `${diffDays}d left`, color: 'var(--color-amber)' };
  return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: 'var(--text-4)' };
}

export default function TasksSidebar({ collapsed, onToggle, onOpenCreate, refreshKey }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const refresh = useCallback(() => setTasks(loadTasks()), []);
  useEffect(() => { refresh(); }, [refresh, refreshKey]);

  function toggleDone(task: Task) {
    const updated: Task = {
      ...task,
      status: task.status === 'done' ? 'todo' : 'done',
    };
    saveTask(updated);
    refresh();
  }

  function handleDelete(id: string) {
    deleteTask(id);
    refresh();
  }

  const pending = tasks.filter(t => t.status !== 'done');
  const done    = tasks.filter(t => t.status === 'done');
  const groups  = groupByList(pending);

  return (
    <div style={{
      width: collapsed ? 0 : 280,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-surface)',
      border: collapsed ? 'none' : '1px solid var(--border-subtle)',
      borderRadius: 16,
      overflow: 'hidden',
      minHeight: 0,
      opacity: collapsed ? 0 : 1,
      pointerEvents: collapsed ? 'none' : 'auto',
      transition: 'width 280ms cubic-bezier(0.4,0,0.2,1), opacity 280ms cubic-bezier(0.4,0,0.2,1), border-color 280ms ease',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 16px 12px',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>
            My Tasks
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {pending.length} pending
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          title="Hide tasks"
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

      {/* Task list area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>

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
              fontSize: 9, fontWeight: 700,
              color: 'var(--text-4)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {listName}
            </div>

            {listTasks.map(task => {
              const pc = PRIORITY_COLORS[task.priority];
              const { label: dueLabel, color: dueColor } = dueDateLabel(task.dueDate);
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  pc={pc}
                  dueLabel={dueLabel}
                  dueColor={dueColor}
                  onToggle={() => toggleDone(task)}
                  onDelete={() => handleDelete(task.id)}
                />
              );
            })}
          </div>
        ))}

        {/* Add task button */}
        <button
          type="button"
          onClick={() => onOpenCreate('task')}
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
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <IconPlus size={10} />
          </div>
          Add a task
        </button>

        {/* Completed section */}
        {done.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <div style={{
              padding: '8px 16px 4px',
              fontSize: 9, fontWeight: 700,
              color: 'var(--text-4)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Completed ({done.length})
            </div>
            {done.map(task => {
              const pc = PRIORITY_COLORS[task.priority];
              const { label: dueLabel, color: dueColor } = dueDateLabel(task.dueDate);
              return (
                <TaskRow
                  key={task.id}
                  task={task}
                  pc={pc}
                  dueLabel={dueLabel}
                  dueColor={dueColor}
                  onToggle={() => toggleDone(task)}
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
  task, pc, dueLabel, dueColor, onToggle, onDelete,
}: {
  task: Task;
  pc: string;
  dueLabel: string;
  dueColor: string;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const isDone = task.status === 'done';

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '7px 16px',
        transition: 'background 150ms ease',
        opacity: isDone ? 0.55 : 1,
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
    >
      {/* Circle checkbox */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: 18, height: 18, borderRadius: '50%',
          border: `2px solid ${isDone ? pc : 'var(--border-default)'}`,
          background: isDone ? pc : 'transparent',
          cursor: 'pointer', flexShrink: 0, marginTop: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 150ms ease, background 150ms ease',
        }}
        onMouseEnter={e => {
          if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = pc;
        }}
        onMouseLeave={e => {
          if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
        }}
      >
        {isDone && <IconCheck size={10} color="#fff" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
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
            background: `${pc}18`, color: pc, letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={onDelete}
        style={{
          background: 'transparent', border: 'none',
          color: 'var(--text-4)', cursor: 'pointer',
          fontSize: 14, lineHeight: 1, padding: '1px 2px',
          opacity: 0, transition: 'opacity 130ms ease, color 130ms ease',
          flexShrink: 0,
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
