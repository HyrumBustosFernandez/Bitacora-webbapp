"use client"

import { Search, Sun, Moon, User } from "lucide-react"
import { useStore } from "@/lib/store"

interface TopBarProps {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function TopBar({ searchQuery, onSearchChange }: TopBarProps) {
  const { state, setTheme } = useStore()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 px-6 py-3 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="md:hidden flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-xs font-bold text-primary-foreground">B</span>
        </div>
        <span className="font-semibold text-foreground text-sm">PaceUp Acad</span>
      </div>

      <div className="hidden md:flex relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses and modules..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-secondary rounded-lg border-none outline-none placeholder:text-muted-foreground text-foreground focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(state.theme === "light" ? "dark" : "light")}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {state.theme === "light" ? (
            <Moon className="w-[18px] h-[18px]" />
          ) : (
            <Sun className="w-[18px] h-[18px]" />
          )}
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-full">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {state.displayName}
          </span>
        </div>
      </div>
    </header>
  )
}
