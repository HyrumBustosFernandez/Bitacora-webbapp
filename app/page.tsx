"use client"

import { useState } from "react"
import { StoreProvider } from "@/lib/store"
import { DesktopSidebar, MobileBottomNav } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { HomeSection } from "@/components/sections/home"
import { CoursesSection } from "@/components/sections/courses"
import { PlanSection } from "@/components/sections/plan"
import { StudySection } from "@/components/sections/study"
import { ProgressSection } from "@/components/sections/progress"
import { SettingsSection } from "@/components/sections/settings"

function AppContent() {
  const [section, setSection] = useState("home")
  const [searchQuery, setSearchQuery] = useState("")
  const [planCourseId, setPlanCourseId] = useState<string | null>(null)

  function handleNavigateToPlan(courseId: string) {
    setPlanCourseId(courseId)
    setSection("plan")
  }

  function handleNavigate(s: string) {
    setSection(s)
    if (s !== "plan") setPlanCourseId(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar activeSection={section} onNavigate={handleNavigate} />
      <MobileBottomNav activeSection={section} onNavigate={handleNavigate} />

      <div className="md:ml-60">
        <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="px-4 md:px-8 py-6 pb-24 md:pb-8 max-w-5xl">
          <div
            key={section}
            className="animate-in fade-in duration-200"
          >
            {section === "home" && <HomeSection />}
            {section === "courses" && (
              <CoursesSection
                searchQuery={searchQuery}
                onNavigateToPlan={handleNavigateToPlan}
              />
            )}
            {section === "plan" && <PlanSection initialCourseId={planCourseId} />}
            {section === "study" && <StudySection />}
            {section === "progress" && <ProgressSection />}
            {section === "settings" && <SettingsSection />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  )
}
