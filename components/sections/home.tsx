"use client"

import { useState } from "react"
import { BookOpen, CheckCircle2, CalendarClock, Plus, X, Clock } from "lucide-react"
import {
  useStore,
  getGreeting,
  getCourseColor,
  getCourseStats,
  getGlobalStats,
  getDaysUntil,
  getEventsForDate,
  getEventTypeColor,
} from "@/lib/store"
import type { CalendarEvent, EventType } from "@/lib/types"

// ── Focus card ────────────────────────────────────────────────────────────────

function FocusCard() {
  const { state } = useStore()

  const urgent = [...state.courses]
    .filter((c) => {
      const { pct } = getCourseStats(c)
      return pct < 100
    })
    .sort((a, b) => {
      const aD = a.deadline ? getDaysUntil(a.deadline) : 9999
      const bD = b.deadline ? getDaysUntil(b.deadline) : 9999
      const aP = getCourseStats(a).pct
      const bP = getCourseStats(b).pct
      return aD !== bD ? aD - bD : aP - bP
    })[0]

  if (!urgent) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
        <p className="text-sm text-muted-foreground">🎉 All courses completed!</p>
      </div>
    )
  }

  const { completed, total, pct } = getCourseStats(urgent)
  const nextItem = urgent.weeks
    .flatMap((w) => w.items)
    .find((i) => !i.completed)
  const col = getCourseColor(urgent.color)
  const daysLeft = urgent.deadline ? getDaysUntil(urgent.deadline) : null

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Focus today
      </p>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2.5 h-2.5 rounded-full ${col.bg}`} />
            <span className="text-xs font-medium text-muted-foreground truncate">
              {urgent.name}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground truncate">
            {nextItem?.name ?? "Review and wrap up"}
          </h3>
          {nextItem?.sub && (
            <p className="text-xs text-muted-foreground mt-0.5">{nextItem.sub}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-foreground">{pct}%</span>
          <p className="text-xs text-muted-foreground">{completed}/{total} items</p>
          {daysLeft !== null && (
            <p className={`text-xs mt-0.5 font-medium ${daysLeft <= 3 ? "text-rose-500" : "text-muted-foreground"}`}>
              {daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${col.bg} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ── Stat row ──────────────────────────────────────────────────────────────────

function StatRow() {
  const { state } = useStore()
  const { total, completed } = getGlobalStats(state.courses)

  const nextDeadline = [...state.courses]
    .filter((c) => c.deadline && getCourseStats(c).pct < 100)
    .sort((a, b) => getDaysUntil(a.deadline!) - getDaysUntil(b.deadline!))[0]
  const daysLeft = nextDeadline?.deadline ? getDaysUntil(nextDeadline.deadline) : null

  const stats = [
    { label: "Courses", value: state.courses.length, icon: BookOpen },
    { label: "Items done", value: `${completed}/${total}`, icon: CheckCircle2 },
    { label: "Days left", value: daysLeft !== null ? daysLeft : "—", icon: CalendarClock },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <div
            key={s.label}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border flex flex-col items-center gap-1"
          >
            <Icon className="w-4 h-4 text-muted-foreground mb-1" />
            <span className="text-xl font-bold text-foreground">{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Progress card ─────────────────────────────────────────────────────────────

function ProgressCard() {
  const { state } = useStore()
  const { pct } = getGlobalStats(state.courses)

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Overall progress
      </p>
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="text-3xl font-bold text-foreground">{pct}%</span>
          <span className="text-sm text-muted-foreground ml-2">complete</span>
        </div>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        {state.courses.map((c) => {
          const { pct: cp } = getCourseStats(c)
          const col = getCourseColor(c.color)
          return (
            <div key={c.id} className="flex items-center gap-3">
              <span className="w-28 text-sm text-foreground truncate">{c.name}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${col.bg} transition-all`}
                  style={{ width: `${cp}%` }}
                />
              </div>
              <span className="w-9 text-right text-xs font-medium text-muted-foreground">
                {cp}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Calendar ──────────────────────────────────────────────────────────────────

const EVENT_TYPES: EventType[] = ["study", "exam", "deadline", "task", "other"]

function EventModal({
  date,
  events,
  onClose,
}: {
  date: string
  events: CalendarEvent[]
  onClose: () => void
}) {
  const { createEvent, deleteEvent } = useStore()
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("09:00")
  const [type, setType] = useState<EventType>("study")
  const [courseId, setCourseId] = useState("")
  const { state } = useStore()

  const label = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  function submit() {
    if (!title.trim()) return
    createEvent({
      date,
      time,
      title: title.trim(),
      type,
      courseId: courseId || undefined,
    })
    setTitle("")
    setTime("09:00")
    setType("study")
    setCourseId("")
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">{label}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* existing events */}
        {events.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {events
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl group"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${getEventTypeColor(ev.type)}`} />
                  <Clock className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground shrink-0">{ev.time}</span>
                  <span className="text-sm text-foreground flex-1 truncate">{ev.title}</span>
                  <button
                    onClick={() => deleteEvent(ev.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* add event form */}
        <div className="flex flex-col gap-2.5 pt-1 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground">Add event</p>
          <input
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit() }}
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <select
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {state.courses.length > 0 && (
            <select
              className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">No course link</option>
              {state.courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
          <button
            onClick={submit}
            disabled={!title.trim()}
            className="flex items-center justify-center gap-1.5 w-full py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add event
          </button>
        </div>
      </div>
    </div>
  )
}

function InteractiveCalendar() {
  const { state } = useStore()
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const monthName = new Date(viewYear, viewMonth).toLocaleString("en-US", { month: "long", year: "numeric" })
  const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function dateStr(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  function prev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  function next() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const selectedEvents = selectedDate ? getEventsForDate(state.events, selectedDate) : []

  return (
    <>
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-foreground">{monthName}</p>
          <div className="flex gap-1">
            <button onClick={prev} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-sm">‹</button>
            <button onClick={next} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors text-sm">›</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayLabels.map((d) => (
            <span key={d} className="text-[10px] font-medium text-muted-foreground py-1">{d}</span>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const ds = dateStr(day)
            const isToday = ds === today
            const dayEvents = getEventsForDate(state.events, ds)
            const hasActivity = state.completedDates.includes(ds)
            const eventTypes = [...new Set(dayEvents.map((e) => e.type))]

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(ds)}
                className={`relative w-8 h-8 flex flex-col items-center justify-center text-xs rounded-lg mx-auto transition-colors hover:bg-secondary ${
                  isToday
                    ? "bg-primary text-primary-foreground font-bold hover:bg-primary/90"
                    : "text-foreground"
                }`}
              >
                {day}
                {/* event dots */}
                {(dayEvents.length > 0 || hasActivity) && (
                  <div className="absolute bottom-0.5 flex gap-0.5 justify-center">
                    {hasActivity && !isToday && (
                      <span className="w-1 h-1 rounded-full bg-primary/60" />
                    )}
                    {eventTypes.slice(0, 2).map((t) => (
                      <span key={t} className={`w-1 h-1 rounded-full ${getEventTypeColor(t)}`} />
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* legend */}
        <div className="flex gap-3 mt-4 flex-wrap">
          {EVENT_TYPES.map((t) => (
            <div key={t} className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${getEventTypeColor(t)}`} />
              <span className="text-[10px] text-muted-foreground capitalize">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <EventModal
          date={selectedDate}
          events={selectedEvents}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </>
  )
}

// ── Home section ──────────────────────────────────────────────────────────────

export function HomeSection() {
  const { state } = useStore()
  const greeting = getGreeting()
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {greeting}{state.displayName && state.displayName !== "Student" ? `, ${state.displayName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{today}</p>
        </div>
        {state.courses.length > 0 ? (
          <>
            <FocusCard />
            <StatRow />
            <ProgressCard />
          </>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <p className="text-foreground font-medium mb-1">No courses yet</p>
            <p className="text-sm text-muted-foreground">
              Head to Courses to create your first course or load the starter template.
            </p>
          </div>
        )}
      </div>
      <div className="lg:w-72 shrink-0">
        <InteractiveCalendar />
      </div>
    </div>
  )
}
