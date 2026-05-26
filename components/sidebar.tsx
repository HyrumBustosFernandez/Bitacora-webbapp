"use client"

import {
  Home,
  BookOpen,
  ListChecks,
  PenLine,
  BarChart3,
  Settings,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "plan", label: "Plan", icon: ListChecks },
  { id: "study", label: "Study", icon: PenLine },
  { id: "progress", label: "Progress", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
]

export function DesktopSidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 bg-card border-r border-border">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground tracking-tight">
          PaceUp Acad
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export function MobileBottomNav({ activeSection, onNavigate }: SidebarProps) {
  const mobileItems = NAV_ITEMS.slice(0, 5)
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 px-1 z-50">
      {mobileItems.map((item) => {
        const Icon = item.icon
        const isActive = activeSection === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
