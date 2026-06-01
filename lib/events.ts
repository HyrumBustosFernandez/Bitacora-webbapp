export type EventType = 'study' | 'exam' | 'deadline' | 'homework' | 'meeting' | 'personal' | 'task' | 'other';
export type EventGroup = 'school' | 'personal' | 'work' | string;

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;       // YYYY-MM-DD
  time?: string;      // HH:MM
  endTime?: string;   // HH:MM
  type: EventType;
  group: EventGroup;
  description?: string;
  color: string;
  courseId?: string;
}

export interface Reminder {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  study:    '#4875F0',
  exam:     '#EF4444',
  deadline: '#F59E0B',
  homework: '#A855F7',
  meeting:  '#06B6D4',
  personal: '#22C55E',
  task:     '#22C55E',
  other:    '#6B7280',
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  study:    'Study',
  exam:     'Exam',
  deadline: 'Deadline',
  homework: 'Homework',
  meeting:  'Meeting',
  personal: 'Personal',
  task:     'Task',
  other:    'Other',
};

export const COLOR_PRESETS = [
  '#4875F0', '#EF4444', '#F59E0B', '#A855F7',
  '#06B6D4', '#22C55E', '#FF7043', '#6B7280',
];

// Legacy support: map old type "task" → "task", no-op
export const EVENT_COLORS: Record<string, string> = EVENT_TYPE_COLORS;

export function loadEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('paceup_calendar_events') || '[]';
    return JSON.parse(data);
  } catch { return []; }
}

export function saveEvent(event: CalendarEvent): void {
  const events = loadEvents();
  const existing = events.findIndex(e => e.id === event.id);
  if (existing >= 0) events[existing] = event;
  else events.push(event);
  localStorage.setItem('paceup_calendar_events', JSON.stringify(events));
}

export function deleteEvent(id: string): void {
  const events = loadEvents().filter(e => e.id !== id);
  localStorage.setItem('paceup_calendar_events', JSON.stringify(events));
}

export function loadReminders(): Reminder[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('paceup_reminders') || '[]'); }
  catch { return []; }
}

export function saveReminder(r: Reminder): void {
  const all = loadReminders();
  const idx = all.findIndex(x => x.id === r.id);
  if (idx >= 0) all[idx] = r; else all.push(r);
  localStorage.setItem('paceup_reminders', JSON.stringify(all));
}

export function deleteReminder(id: string): void {
  localStorage.setItem('paceup_reminders', JSON.stringify(loadReminders().filter(r => r.id !== id)));
}

export function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ─────────────────────────────────────
   TASK TYPE
───────────────────────────────────── */
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus   = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  name: string;
  dueDate: string;        // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  description?: string;
  list?: string;          // e.g. 'CCST Prep', 'Personal'
  createdAt: string;
}

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low:    '#22C55E',
  medium: '#F59E0B',
  high:   '#EF4444',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low', medium: 'Medium', high: 'High',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do', inprogress: 'In progress', done: 'Done',
};

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('paceup_tasks') || '[]');
  } catch { return []; }
}

export function saveTask(task: Task): void {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = task; else tasks.push(task);
  localStorage.setItem('paceup_tasks', JSON.stringify(tasks));
}

export function deleteTask(id: string): void {
  localStorage.setItem('paceup_tasks', JSON.stringify(loadTasks().filter(t => t.id !== id)));
}
