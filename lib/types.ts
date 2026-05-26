export type CourseColor =
  | "indigo"
  | "emerald"
  | "amber"
  | "rose"
  | "violet"
  | "teal"
  | "pink"
  | "blue"
  | "orange"

export interface Item {
  id: string
  name: string
  sub?: string
  day?: string
  completed: boolean
  exam?: boolean
}

export interface Week {
  id: string
  label: string
  name: string
  dates?: string
  items: Item[]
  tip?: string
}

export interface Course {
  id: string
  name: string
  color: CourseColor
  deadline: string
  tag?: string
  num?: string
  hours?: string
  type?: string
  weeks: Week[]
}

export type EventType = "study" | "exam" | "deadline" | "task" | "other"

export interface CalendarEvent {
  id: string
  date: string
  time: string
  title: string
  type: EventType
  courseId?: string
}

export interface AppState {
  displayName: string
  theme: "light" | "dark"
  language: string
  courses: Course[]
  notes: Record<string, string>
  completedDates: string[]
  events: CalendarEvent[]
}
