"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, BookOpen, ChevronRight } from "lucide-react"
import {
  useStore,
  getCourseColor,
  getCourseStats,
  COLOR_OPTIONS,
} from "@/lib/store"
import type { CourseColor } from "@/lib/types"

interface Props {
  searchQuery: string
  onNavigateToPlan: (courseId: string) => void
}

interface CourseFormData {
  name: string
  color: CourseColor
  deadline: string
  type: string
  hours: string
}

const EMPTY_FORM: CourseFormData = {
  name: "",
  color: "indigo",
  deadline: "",
  type: "",
  hours: "",
}

function CourseModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: CourseFormData
  onSave: (d: CourseFormData) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<CourseFormData>(initial ?? EMPTY_FORM)
  const set = (k: keyof CourseFormData, v: string) =>
    setForm((p) => ({ ...p, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {initial ? "Edit course" : "New course"}
        </h2>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Course name *</label>
            <input
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g. Introduction to Cybersecurity"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Deadline</label>
            <input
              type="date"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Type / provider</label>
              <input
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. Coursera, Cisco"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Est. hours</label>
              <input
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. ~6h"
                value={form.hours}
                onChange={(e) => set("hours", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => {
                const col = getCourseColor(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("color", c)}
                    className={`w-7 h-7 rounded-full ${col.bg} ring-2 transition-all ${
                      form.color === c
                        ? "ring-foreground ring-offset-1 ring-offset-card"
                        : "ring-transparent"
                    }`}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { if (form.name.trim()) onSave(form) }}
            disabled={!form.name.trim()}
            className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {initial ? "Save changes" : "Create course"}
          </button>
        </div>
      </div>
    </div>
  )
}

export function CoursesSection({ searchQuery, onNavigateToPlan }: Props) {
  const { state, createCourse, updateCourse, deleteCourse, loadTemplate } = useStore()
  const [showCreate, setShowCreate] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = state.courses.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const editingCourse = editId ? state.courses.find((c) => c.id === editId) : null

  function handleCreate(form: CourseFormData) {
    createCourse({ ...form, name: form.name.trim() })
    setShowCreate(false)
  }

  function handleEdit(form: CourseFormData) {
    if (!editId) return
    updateCourse(editId, { ...form, name: form.name.trim() })
    setEditId(null)
  }

  const isEmpty = state.courses.length === 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {state.courses.length} course{state.courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New course
        </button>
      </div>

      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <BookOpen className="w-10 h-10 text-muted-foreground/40" />
          <div>
            <p className="text-foreground font-medium">No courses yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first course or load the starter template.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Create course
            </button>
            <button
              onClick={loadTemplate}
              className="px-4 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
            >
              Load starter template
            </button>
          </div>
        </div>
      )}

      {!isEmpty && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground py-10 text-center">
          No courses match &quot;{searchQuery}&quot;
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((course) => {
          const { total, completed, pct } = getCourseStats(course)
          const col = getCourseColor(course.color)

          return (
            <div
              key={course.id}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 group hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.bg}`} />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {course.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditId(course.id)}
                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(course.id)}
                    className="p-1.5 rounded-md hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{completed}/{total} items</span>
                  <span className={pct === 100 ? "text-emerald-500 font-medium" : ""}>{pct}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${col.bg}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  {course.type && (
                    <span className="text-xs text-muted-foreground">{course.type}</span>
                  )}
                  {course.deadline && (
                    <span className="text-xs text-muted-foreground">
                      Due{" "}
                      {new Date(course.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onNavigateToPlan(course.id)}
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Open plan <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {showCreate && (
        <CourseModal onSave={handleCreate} onClose={() => setShowCreate(false)} />
      )}

      {editId && editingCourse && (
        <CourseModal
          initial={{
            name: editingCourse.name,
            color: editingCourse.color,
            deadline: editingCourse.deadline ?? "",
            type: editingCourse.type ?? "",
            hours: editingCourse.hours ?? "",
          }}
          onSave={handleEdit}
          onClose={() => setEditId(null)}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-base font-semibold text-foreground mb-2">Delete course?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              All weeks, items, and notes will be permanently deleted.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70"
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteCourse(confirmDelete); setConfirmDelete(null) }}
                className="px-4 py-2 text-sm rounded-lg bg-rose-500 text-white hover:bg-rose-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
