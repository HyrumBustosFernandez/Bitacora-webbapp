"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { AppState, Course, Week, Item, CalendarEvent, CourseColor } from "./types"
import { STARTER_TEMPLATE } from "./templates"

// ── helpers ──────────────────────────────────────────────────────────────────

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

const STORAGE_KEY = "paceupacad-data"

const EMPTY_STATE: AppState = {
  displayName: "Student",
  theme: "dark",
  language: "EN",
  courses: [],
  notes: {},
  completedDates: [],
  events: [],
}

function loadState(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...EMPTY_STATE, ...JSON.parse(raw) }
  } catch {}
  return EMPTY_STATE
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {}
}

// ── context ───────────────────────────────────────────────────────────────────

interface StoreContextType {
  state: AppState

  // course CRUD
  createCourse: (data: Omit<Course, "id" | "weeks">) => string
  updateCourse: (id: string, patch: Partial<Omit<Course, "id" | "weeks">>) => void
  deleteCourse: (id: string) => void

  // week CRUD
  createWeek: (courseId: string, data: Omit<Week, "id" | "items">) => string
  updateWeek: (courseId: string, weekId: string, patch: Partial<Omit<Week, "id" | "items">>) => void
  deleteWeek: (courseId: string, weekId: string) => void

  // item CRUD
  createItem: (courseId: string, weekId: string, data: Omit<Item, "id" | "completed">) => string
  updateItem: (courseId: string, weekId: string, itemId: string, patch: Partial<Omit<Item, "id">>) => void
  deleteItem: (courseId: string, weekId: string, itemId: string) => void
  toggleItem: (courseId: string, weekId: string, itemId: string) => void

  // notes
  setNote: (courseId: string, weekId: string, text: string) => void
  getNote: (courseId: string, weekId: string) => string

  // calendar events
  createEvent: (data: Omit<CalendarEvent, "id">) => void
  updateEvent: (id: string, patch: Partial<Omit<CalendarEvent, "id">>) => void
  deleteEvent: (id: string) => void

  // settings
  setDisplayName: (name: string) => void
  setTheme: (theme: "light" | "dark") => void
  setLanguage: (lang: string) => void

  // template + export/import
  loadTemplate: () => void
  exportData: () => string
  importData: (json: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

// ── provider ──────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(EMPTY_STATE)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const loaded = loadState()
    setState(loaded)
    document.documentElement.classList.toggle("dark", loaded.theme === "dark")
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    saveState(state)
  }, [state, mounted])

  // ── courses ────────────────────────────────────────────────────────────────

  const createCourse = useCallback((data: Omit<Course, "id" | "weeks">): string => {
    const id = uid()
    setState((prev) => ({
      ...prev,
      courses: [...prev.courses, { ...data, id, weeks: [] }],
    }))
    return id
  }, [])

  const updateCourse = useCallback(
    (id: string, patch: Partial<Omit<Course, "id" | "weeks">>) => {
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      }))
    },
    []
  )

  const deleteCourse = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
      notes: Object.fromEntries(
        Object.entries(prev.notes).filter(([k]) => !k.startsWith(id + "_"))
      ),
    }))
  }, [])

  // ── weeks ──────────────────────────────────────────────────────────────────

  const createWeek = useCallback(
    (courseId: string, data: Omit<Week, "id" | "items">): string => {
      const id = uid()
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? { ...c, weeks: [...c.weeks, { ...data, id, items: [] }] }
            : c
        ),
      }))
      return id
    },
    []
  )

  const updateWeek = useCallback(
    (courseId: string, weekId: string, patch: Partial<Omit<Week, "id" | "items">>) => {
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                weeks: c.weeks.map((w) => (w.id === weekId ? { ...w, ...patch } : w)),
              }
            : c
        ),
      }))
    },
    []
  )

  const deleteWeek = useCallback((courseId: string, weekId: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? { ...c, weeks: c.weeks.filter((w) => w.id !== weekId) }
          : c
      ),
      notes: Object.fromEntries(
        Object.entries(prev.notes).filter(([k]) => k !== `${courseId}_${weekId}`)
      ),
    }))
  }, [])

  // ── items ──────────────────────────────────────────────────────────────────

  const createItem = useCallback(
    (courseId: string, weekId: string, data: Omit<Item, "id" | "completed">): string => {
      const id = uid()
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                weeks: c.weeks.map((w) =>
                  w.id === weekId
                    ? { ...w, items: [...w.items, { ...data, id, completed: false }] }
                    : w
                ),
              }
            : c
        ),
      }))
      return id
    },
    []
  )

  const updateItem = useCallback(
    (courseId: string, weekId: string, itemId: string, patch: Partial<Omit<Item, "id">>) => {
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                weeks: c.weeks.map((w) =>
                  w.id === weekId
                    ? {
                        ...w,
                        items: w.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)),
                      }
                    : w
                ),
              }
            : c
        ),
      }))
    },
    []
  )

  const deleteItem = useCallback(
    (courseId: string, weekId: string, itemId: string) => {
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                weeks: c.weeks.map((w) =>
                  w.id === weekId
                    ? { ...w, items: w.items.filter((i) => i.id !== itemId) }
                    : w
                ),
              }
            : c
        ),
      }))
    },
    []
  )

  const toggleItem = useCallback(
    (courseId: string, weekId: string, itemId: string) => {
      const today = new Date().toISOString().split("T")[0]
      setState((prev) => {
        const courses = prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                weeks: c.weeks.map((w) =>
                  w.id === weekId
                    ? {
                        ...w,
                        items: w.items.map((i) =>
                          i.id === itemId ? { ...i, completed: !i.completed } : i
                        ),
                      }
                    : w
                ),
              }
            : c
        )
        const completedDates = prev.completedDates.includes(today)
          ? prev.completedDates
          : [...prev.completedDates, today]
        return { ...prev, courses, completedDates }
      })
    },
    []
  )

  // ── notes ──────────────────────────────────────────────────────────────────

  const setNote = useCallback((courseId: string, weekId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      notes: { ...prev.notes, [`${courseId}_${weekId}`]: text },
    }))
  }, [])

  const getNote = useCallback(
    (courseId: string, weekId: string): string => {
      return state.notes[`${courseId}_${weekId}`] ?? ""
    },
    [state.notes]
  )

  // ── calendar events ────────────────────────────────────────────────────────

  const createEvent = useCallback((data: Omit<CalendarEvent, "id">) => {
    setState((prev) => ({
      ...prev,
      events: [...prev.events, { ...data, id: uid() }],
    }))
  }, [])

  const updateEvent = useCallback(
    (id: string, patch: Partial<Omit<CalendarEvent, "id">>) => {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
      }))
    },
    []
  )

  const deleteEvent = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }))
  }, [])

  // ── settings ───────────────────────────────────────────────────────────────

  const setDisplayName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, displayName: name }))
  }, [])

  const setTheme = useCallback((theme: "light" | "dark") => {
    setState((prev) => ({ ...prev, theme }))
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [])

  const setLanguage = useCallback((lang: string) => {
    setState((prev) => ({ ...prev, language: lang }))
  }, [])

  // ── template + export/import ───────────────────────────────────────────────

  const loadTemplate = useCallback(() => {
    setState((prev) => ({ ...prev, courses: STARTER_TEMPLATE }))
  }, [])

  const exportData = useCallback((): string => {
    return JSON.stringify(state, null, 2)
  }, [state])

  const importData = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json)
      setState((prev) => ({ ...prev, ...parsed }))
    } catch {
      console.error("Invalid JSON")
    }
  }, [])

  if (!mounted) return null

  return (
    <StoreContext.Provider
      value={{
        state,
        createCourse, updateCourse, deleteCourse,
        createWeek, updateWeek, deleteWeek,
        createItem, updateItem, deleteItem, toggleItem,
        setNote, getNote,
        createEvent, updateEvent, deleteEvent,
        setDisplayName, setTheme, setLanguage,
        loadTemplate, exportData, importData,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}

// ── pure helpers ──────────────────────────────────────────────────────────────

export function getCourseColor(color: CourseColor) {
  const map: Record<CourseColor, { bg: string; text: string; light: string; hex: string }> = {
    indigo: { bg: "bg-indigo-500",   text: "text-indigo-500",   light: "bg-indigo-500/10",   hex: "#6366f1" },
    emerald:{ bg: "bg-emerald-500",  text: "text-emerald-500",  light: "bg-emerald-500/10",  hex: "#10b981" },
    amber:  { bg: "bg-amber-500",    text: "text-amber-500",    light: "bg-amber-500/10",    hex: "#f59e0b" },
    rose:   { bg: "bg-rose-500",     text: "text-rose-500",     light: "bg-rose-500/10",     hex: "#f43f5e" },
    violet: { bg: "bg-violet-500",   text: "text-violet-500",   light: "bg-violet-500/10",   hex: "#8b5cf6" },
    teal:   { bg: "bg-teal-500",     text: "text-teal-500",     light: "bg-teal-500/10",     hex: "#14b8a6" },
    pink:   { bg: "bg-pink-500",     text: "text-pink-500",     light: "bg-pink-500/10",     hex: "#ec4899" },
    blue:   { bg: "bg-blue-500",     text: "text-blue-500",     light: "bg-blue-500/10",     hex: "#3b82f6" },
    orange: { bg: "bg-orange-500",   text: "text-orange-500",   light: "bg-orange-500/10",   hex: "#f97316" },
  }
  return map[color] ?? map.indigo
}

export const COLOR_OPTIONS: CourseColor[] = [
  "indigo","emerald","amber","rose","violet","teal","pink","blue","orange",
]

export function getAllItems(course: Course) {
  return course.weeks.flatMap((w) => w.items)
}

export function getCourseStats(course: Course) {
  const items = getAllItems(course)
  const total = items.length
  const completed = items.filter((i) => i.completed).length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, pct }
}

export function getGlobalStats(courses: Course[]) {
  const total = courses.reduce((s, c) => s + getAllItems(c).length, 0)
  const completed = courses.reduce(
    (s, c) => s + getAllItems(c).filter((i) => i.completed).length,
    0
  )
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, pct }
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86400000))
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export function getEventsForDate(events: CalendarEvent[], date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date)
}

export function getEventTypeColor(type: CalendarEvent["type"]): string {
  const map: Record<CalendarEvent["type"], string> = {
    study:    "bg-blue-500",
    exam:     "bg-rose-500",
    deadline: "bg-amber-500",
    task:     "bg-emerald-500",
    other:    "bg-slate-400",
  }
  return map[type]
}
