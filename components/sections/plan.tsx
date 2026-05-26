"use client"

import { useState } from "react"
import { Plus, Trash2, Pencil, ChevronDown, ChevronUp, GraduationCap } from "lucide-react"
import { useStore, getCourseColor } from "@/lib/store"
import type { Course } from "@/lib/types"

interface Props {
  initialCourseId?: string | null
}

function WeekBlock({
  course,
  week,
}: {
  course: Course
  week: Course["weeks"][number]
}) {
  const { toggleItem, createItem, updateItem, deleteItem, updateWeek, deleteWeek } = useStore()
  const col = getCourseColor(course.color)
  const [open, setOpen] = useState(true)
  const [addingItem, setAddingItem] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editingItemName, setEditingItemName] = useState("")
  const [editingWeek, setEditingWeek] = useState(false)
  const [weekName, setWeekName] = useState(week.name)

  const completedCount = week.items.filter((i) => i.completed).length
  const pct = week.items.length === 0 ? 0 : Math.round((completedCount / week.items.length) * 100)

  function submitItem() {
    const name = newItemName.trim()
    if (!name) return
    createItem(course.id, week.id, { name })
    setNewItemName("")
    setAddingItem(false)
  }

  function submitItemEdit(itemId: string) {
    const name = editingItemName.trim()
    if (name) updateItem(course.id, week.id, itemId, { name })
    setEditingItemId(null)
  }

  function submitWeekEdit() {
    const name = weekName.trim()
    if (name) updateWeek(course.id, week.id, { name })
    setEditingWeek(false)
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* week header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-1 h-8 rounded-full ${col.bg}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{week.label}</span>
              {week.dates && (
                <span className="text-xs text-muted-foreground/60">{week.dates}</span>
              )}
            </div>
            {editingWeek ? (
              <input
                className="text-sm font-semibold text-foreground bg-secondary border border-border rounded px-2 py-0.5 outline-none mt-0.5"
                value={weekName}
                autoFocus
                onChange={(e) => setWeekName(e.target.value)}
                onBlur={submitWeekEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitWeekEdit()
                  if (e.key === "Escape") setEditingWeek(false)
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="text-sm font-semibold text-foreground truncate">{week.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground">{pct}%</span>
          <button
            onClick={(e) => { e.stopPropagation(); setEditingWeek(true) }}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); deleteWeek(course.id, week.id) }}
            className="p-1.5 rounded-md hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          {open ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* progress bar */}
      <div className="h-0.5 bg-secondary mx-5">
        <div
          className={`h-full ${col.bg} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {open && (
        <div className="px-5 py-3 flex flex-col gap-1">
          {week.tip && (
            <p className="text-xs text-amber-500/80 bg-amber-500/10 rounded-lg px-3 py-2 mb-2">
              💡 {week.tip}
            </p>
          )}

          {week.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 group/item rounded-lg px-1 hover:bg-secondary/30 transition-colors"
            >
              <button
                onClick={() => toggleItem(course.id, week.id, item.id)}
                className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition-colors ${
                  item.completed
                    ? `${col.bg} border-transparent`
                    : "border-border bg-transparent hover:border-primary"
                }`}
              >
                {item.completed && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                {editingItemId === item.id ? (
                  <input
                    className="w-full text-sm text-foreground bg-secondary border border-border rounded px-2 py-0.5 outline-none"
                    value={editingItemName}
                    autoFocus
                    onChange={(e) => setEditingItemName(e.target.value)}
                    onBlur={() => submitItemEdit(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitItemEdit(item.id)
                      if (e.key === "Escape") setEditingItemId(null)
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm transition-colors ${
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                    {item.exam && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                        <GraduationCap className="w-2.5 h-2.5" /> Exam
                      </span>
                    )}
                    {item.sub && (
                      <span className="text-xs text-muted-foreground/70">{item.sub}</span>
                    )}
                    {item.day && (
                      <span className="text-xs text-muted-foreground/50">{item.day}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => { setEditingItemId(item.id); setEditingItemName(item.name) }}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => deleteItem(course.id, week.id, item.id)}
                  className="p-1 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {addingItem ? (
            <div className="flex items-center gap-2 mt-1 pl-1">
              <input
                className="flex-1 text-sm text-foreground bg-secondary border border-border rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary"
                placeholder="Item name…"
                value={newItemName}
                autoFocus
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitItem()
                  if (e.key === "Escape") { setAddingItem(false); setNewItemName("") }
                }}
              />
              <button
                onClick={submitItem}
                className="px-3 py-1.5 text-xs rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add
              </button>
              <button
                onClick={() => { setAddingItem(false); setNewItemName("") }}
                className="px-3 py-1.5 text-xs rounded-lg bg-secondary text-foreground hover:bg-secondary/70"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingItem(true)}
              className="flex items-center gap-1.5 mt-1 pl-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add item
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function AddWeekRow({ courseId }: { courseId: string }) {
  const { createWeek } = useStore()
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState("")
  const [name, setName] = useState("")

  function submit() {
    if (!name.trim()) return
    createWeek(courseId, { label: label.trim() || "Week", name: name.trim() })
    setLabel("")
    setName("")
    setAdding(false)
  }

  if (!adding) {
    return (
      <button
        onClick={() => setAdding(true)}
        className="flex items-center gap-2 px-5 py-3 w-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/30 rounded-2xl border border-dashed border-border transition-colors"
      >
        <Plus className="w-4 h-4" /> Add week / block
      </button>
    )
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-foreground">New week / block</p>
      <div className="grid grid-cols-3 gap-2">
        <input
          className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          placeholder='Label (e.g. "Week 1")'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="col-span-2 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
          placeholder="Name (e.g. Modules 1–4 — Foundations)"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") setAdding(false) }}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={submit} disabled={!name.trim()} className="px-4 py-1.5 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40">
          Add week
        </button>
        <button onClick={() => setAdding(false)} className="px-4 py-1.5 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70">
          Cancel
        </button>
      </div>
    </div>
  )
}

export function PlanSection({ initialCourseId }: Props) {
  const { state } = useStore()
  const [selectedId, setSelectedId] = useState<string>(
    initialCourseId ?? state.courses[0]?.id ?? ""
  )

  const course = state.courses.find((c) => c.id === selectedId)

  if (state.courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <p className="text-foreground font-medium">No courses yet</p>
        <p className="text-sm text-muted-foreground">Create a course first to build your plan.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-3">Plan</h1>
        <div className="flex gap-2 flex-wrap">
          {state.courses.map((c) => {
            const col = getCourseColor(c.color)
            const active = c.id === selectedId
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? `${col.bg} text-white`
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${active ? "bg-white/60" : col.bg}`} />
                {c.name}
              </button>
            )
          })}
        </div>
      </div>

      {course && (
        <div className="flex flex-col gap-4">
          {course.weeks.map((week) => (
            <WeekBlock key={week.id} course={course} week={week} />
          ))}
          <AddWeekRow courseId={course.id} />
        </div>
      )}
    </div>
  )
}
