"use client"

import { useStore, getCourseColor, getCourseStats, getGlobalStats, getDaysUntil } from "@/lib/store"

export function ProgressSection() {
  const { state } = useStore()

  if (state.courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <p className="text-foreground font-medium">No courses yet</p>
        <p className="text-sm text-muted-foreground">Add courses to track your progress.</p>
      </div>
    )
  }

  const global = getGlobalStats(state.courses)
  const sorted = [...state.courses].sort((a, b) => {
    const aP = getCourseStats(a).pct
    const bP = getCourseStats(b).pct
    return aP - bP
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Completion by course</p>
      </div>

      {/* global card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Overall
        </p>
        <div className="flex items-end justify-between mb-2">
          <div>
            <span className="text-3xl font-bold text-foreground">{global.pct}%</span>
            <span className="text-sm text-muted-foreground ml-2">complete</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {global.completed}/{global.total} items
          </span>
        </div>
        <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${global.pct}%` }}
          />
        </div>
      </div>

      {/* per-course cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((course) => {
          const { total, completed, pct } = getCourseStats(course)
          const col = getCourseColor(course.color)
          const daysLeft = course.deadline ? getDaysUntil(course.deadline) : null
          const done = pct === 100

          return (
            <div
              key={course.id}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.bg}`} />
                <span className="text-sm font-semibold text-foreground truncate flex-1">
                  {course.name}
                </span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    done
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {done ? "Done" : `${pct}%`}
                </span>
              </div>

              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${col.bg}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{completed} of {total} items</span>
                {daysLeft !== null && !done && (
                  <span className={daysLeft <= 3 ? "text-rose-500 font-medium" : ""}>
                    {daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
