"use client"

import { useRef, useState } from "react"
import { Sun, Moon, Download, Upload, Trash2, BookOpen } from "lucide-react"
import { useStore } from "@/lib/store"

export function SettingsSection() {
  const { state, setDisplayName, setTheme, setLanguage, loadTemplate, exportData, importData, deleteCourse } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState("")
  const [importOk, setImportOk] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const LANGUAGES = ["EN", "ES", "FR", "KO", "JA"]

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `paceupacad-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string
        importData(text)
        setImportOk(true)
        setImportError("")
        setTimeout(() => setImportOk(false), 3000)
      } catch {
        setImportError("Invalid file. Make sure it's a Bitácora JSON backup.")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  function handleClearAll() {
    state.courses.forEach((c) => deleteCourse(c.id))
    setConfirmClear(false)
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Customize your experience</p>
      </div>

      {/* profile */}
      <section className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">Profile</p>
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground w-28">Display name</label>
          <input
            className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary"
            value={state.displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </div>
      </section>

      {/* appearance */}
      <section className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">Appearance</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-28">Theme</span>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                state.theme === "light"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sun className="w-4 h-4" /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                state.theme === "dark"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <Moon className="w-4 h-4" /> Dark
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground w-28">Language</span>
          <div className="flex gap-2 flex-wrap">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  state.language === lang
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* data */}
      <section className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-foreground">Data</p>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Starter template</p>
              <p className="text-xs text-muted-foreground">Load 9 pre-built Cisco/Microsoft courses</p>
            </div>
            <button
              onClick={loadTemplate}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Load
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Export backup</p>
              <p className="text-xs text-muted-foreground">Download all your data as JSON</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Import backup</p>
              <p className="text-xs text-muted-foreground">Restore from a JSON backup file</p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
            >
              <Upload className="w-4 h-4" /> Import
            </button>
          </div>

          {importError && (
            <p className="text-xs text-rose-500 bg-rose-500/10 rounded-lg px-3 py-2">{importError}</p>
          )}
          {importOk && (
            <p className="text-xs text-emerald-500 bg-emerald-500/10 rounded-lg px-3 py-2">
              ✓ Data imported successfully
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div>
              <p className="text-sm text-rose-500">Clear all courses</p>
              <p className="text-xs text-muted-foreground">Permanently delete all data</p>
            </div>
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>
      </section>

      <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-base font-semibold text-foreground mb-2">Clear all courses?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              All courses, weeks, items, notes, and progress will be permanently deleted. Export a backup first if you want to keep your data.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmClear(false)} className="px-4 py-2 text-sm rounded-lg bg-secondary text-foreground hover:bg-secondary/70">
                Cancel
              </button>
              <button onClick={handleClearAll} className="px-4 py-2 text-sm rounded-lg bg-rose-500 text-white hover:bg-rose-600">
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
