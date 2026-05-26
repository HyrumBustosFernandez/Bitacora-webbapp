"use client"

import { useState, useEffect, useRef } from "react"
import { BookOpen } from "lucide-react"
import { useStore, getCourseColor } from "@/lib/store"

export function StudySection() {
  const { state, setNote, getNote } = useStore()
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    state.courses[0]?.id ?? ""
  )
  const [selectedWeekId, setSelectedWeekId] = useState<string>("")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const course = state.courses.find((c) => c.id === selectedCourseId)

  // sync week selection when course changes
  useEffect(() => {
    if (course && course.weeks.length > 0) {
      setSelectedWeekId(course.weeks[0].id)
    } else {
      setSelectedWeekId("")
    }
  }, [selectedCourseId, course])

  const week = course?.weeks.find((w) => w.id === selectedWeekId)
  const noteText = selectedCourseId && selectedWeekId
    ? getNote(selectedCourseId, selectedWeekId)
    : ""

  function handleNoteChange(text: string) {
    if (!selectedCourseId || !selectedWeekId) return
    setSaveStatus("saving")
    setNote(selectedCourseId, selectedWeekId, text)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveStatus("saved"), 600)
  }

  if (state.courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-foreground font-medium">No courses yet</p>
        <p className="text-sm text-muted-foreground">Create a course to start taking notes.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Study</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Module notes</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* course sidebar */}
        <div className="lg:w-56 shrink-0 flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 px-1">
            Courses
          </p>
          {state.courses.map((c) => {
            const col = getCourseColor(c.color)
            const active = c.id === selectedCourseId
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCourseId(c.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                  active
                    ? "bg-primary/10 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${col.bg}`} />
                <span className="truncate">{c.name}</span>
              </button>
            )
          })}
        </div>

        {/* main area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* week tabs */}
          {course && course.weeks.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {course.weeks.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWeekId(w.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    w.id === selectedWeekId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          )}

          {/* week info */}
          {week && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{week.name}</p>
                {week.dates && (
                  <p className="text-xs text-muted-foreground">{week.dates}</p>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {saveStatus === "saving" && "Saving…"}
                {saveStatus === "saved" && "Saved ✓"}
              </span>
            </div>
          )}

          {/* notes textarea */}
          {course && course.weeks.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">
              This course has no weeks yet. Add one in the Plan section.
            </p>
          )}

          {week && (
            <textarea
              className="w-full min-h-[420px] bg-card border border-border rounded-2xl px-5 py-4 text-sm text-foreground resize-y outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50 leading-relaxed"
              placeholder="Write your thoughts, key takeaways, and personal notes for this module…"
              value={noteText}
              onChange={(e) => handleNoteChange(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
