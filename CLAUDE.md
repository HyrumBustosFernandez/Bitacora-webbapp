# PaceUp Acad — Project Context

## What this is
A personal study tracker web app. Originally called Bitácora, renamed to **PaceUp Acad**.
Users can create their own courses, track progress week by week, take notes, and manage a calendar.

## Owner
Hyrum Bustos — `hyrum@bytebridgesystems.com`

---

## GitHub
- **Repo:** `HyrumBustosFernandez/Bitacora-webbapp`
- **URL:** https://github.com/HyrumBustosFernandez/Bitacora-webbapp
- **Active branch:** `main`

---

## Tech Stack
| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI / shadcn (in `components/ui/` — do NOT edit these) |
| Icons | Lucide React |
| State | React Context + localStorage (no backend, no database) |
| Package manager | npm (`npm install`, `npm run dev`) |
| Deploy target | Vercel |

---

## Two Codebases — Important

There are currently two versions on the local machine:

| | Path | On GitHub | Status |
|---|---|---|---|
| Old version | `~/Documents/GitHub/Bitacora-webbapp` | ✅ Yes | Steps 1–12, hardcoded courses, being replaced |
| **Current version** | `~/Documents/bitacora-redesign` | ❌ Not yet | Active — use this one |

**The goal:** replace the GitHub repo content with `bitacora-redesign`. Not done yet.

---

## Project Structure

```
bitacora-redesign/
├── app/
│   ├── layout.tsx          — sets title "PaceUp Acad", loads font
│   ├── page.tsx            — entire app (single page, section-based nav)
│   └── globals.css         — Tailwind setup, dark/light CSS variables
│
├── components/
│   ├── sidebar.tsx         — desktop sidebar + mobile bottom nav
│   ├── top-bar.tsx         — search bar, theme toggle, user name
│   ├── sections/           — one file per screen (home, courses, plan, study, progress, settings)
│   └── ui/                 — shadcn components — DO NOT EDIT
│
├── lib/
│   ├── types.ts            — all TypeScript interfaces (Course, Week, Item, CalendarEvent, AppState)
│   ├── store.tsx           — all app state + every action (CRUD, events, notes, export/import)
│   ├── templates.ts        — 9 Cisco/Microsoft courses as a loadable starter template
│   └── utils.ts            — small helpers
│
├── public/                 — icons and images
├── package.json            — name: "paceup-acad"
└── CLAUDE.md               — this file
```

---

## Data Model
```
Course
  ├── id, name, color, deadline, tag, num, hours, type
  └── weeks[]
        ├── id, label, name, dates, tip
        └── items[]
              ├── id, name, sub, day, completed, exam
```

```
CalendarEvent
  ├── id, date (YYYY-MM-DD), time (HH:MM)
  ├── title, type (study | exam | deadline | task | other)
  └── courseId? (optional link to a course)
```

**localStorage key:** `paceupacad-data`
**Notes key pattern:** `${courseId}_${weekId}`

---

## What's Built
- Dynamic course CRUD (create, edit, delete courses)
- Week and item CRUD inside each course
- Item completion toggle (logs date to completedDates)
- Per-week notes, auto-saved
- Interactive calendar with date+time event modal
- Auto-events from exam items and course deadlines
- Progress tracking — per course and globally
- Focus card on Home (most urgent course by deadline + completion %)
- Export / Import JSON backup
- Load starter template (9 real Cisco/Microsoft courses)
- Dark/light theme toggle
- Language selector (EN, ES, FR, KO, JA)
- Display name setting

---

## What's Missing (exists in old GitHub version, not built here yet)
- Streak system
- Pomodoro timer in Study section
- Analytics page
- Groups feature
- External Tools section
- Course detail page

---

## Key Rules
- **Never edit files in `components/ui/`** — these are library components
- **All state goes through `lib/store.tsx`** — never use local useState for persistent data
- **No API keys, no backend** — everything is localStorage for now
- **pnpm is preferred** but npm works: `npm install` / `npm run dev`
- To run locally: `cd ~/Documents/bitacora-redesign && npm run dev` → http://localhost:3000

---

## Pending Tasks
1. Push `bitacora-redesign` into the GitHub repo (replace old code)
2. Deploy to Vercel
3. Ask user to share requirements document at start of session
