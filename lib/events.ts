export type EventType = 'study' | 'exam' | 'deadline' | 'task' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;      // YYYY-MM-DD
  type: EventType;
  courseId?: string;
}

export const EVENT_COLORS: Record<EventType, string> = {
  study:    '#4875F0',
  exam:     '#EF4444',
  deadline: '#F59E0B',
  task:     '#22C55E',
  other:    '#A8A29A',
};

export function loadEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('calendar_events') || '[]'); }
  catch { return []; }
}

export function saveEvent(event: CalendarEvent): void {
  const events = loadEvents();
  events.push(event);
  localStorage.setItem('calendar_events', JSON.stringify(events));
}

export function deleteEvent(id: string): void {
  const events = loadEvents().filter(e => e.id !== id);
  localStorage.setItem('calendar_events', JSON.stringify(events));
}

export function toDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}
