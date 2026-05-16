# Bitácora

A personal course-tracking and study web app built for certification exam prep. Combines a structured study planner with per-module summaries (based on actual Cisco NetAcad and Microsoft Learn curriculum) and personal notes — all in a single-page PWA that runs entirely in the browser.

---

## Features

### Courses
Track progress across 10 courses covering Cisco NetAcad (CCST Cybersecurity) and Microsoft Learn (AZ-900, DP-900, AI-900) certifications. Each course card shows completion percentage and allows inline title editing.

### Plan
Weekly study schedule with a built-in calendar. Tracks whether you're **ahead**, **on track**, or **behind** based on daily check-ins. Each course has a detailed week-by-week plan with tips for heavier modules.

### Study
Select a course and topic to access:
- **Summary** — Pre-written module summaries based on the official Cisco NetAcad and Microsoft Learn curriculum, with key concepts and exam tips
- **My Notes** — A personal notepad per module; notes auto-save to the browser and persist between sessions

### Progress
Visual dashboard showing completion percentage, items done vs. total, and study status per course.

### Settings
Toggle dark/light theme and switch the UI language between English, Spanish, French, Korean, and Japanese.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML, CSS, JavaScript (no framework) |
| State | `localStorage` (no backend, no server required) |
| PWA | Service Worker, Web App Manifest |

---

## Project Structure

```
bitacora-webbapp/
├── index.html      # App shell and all section markup
├── app.js          # All application logic and state
├── app.css         # Styles including dark/light themes and animations
├── sw.js           # Service worker for offline/PWA support
├── manifest.json   # PWA manifest
└── icon*.png/svg   # App icons
```

---

## Running Locally

No build step or server required. Open `index.html` directly in a browser:

```bash
open index.html
```

Or serve it with any static file server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

---

## Courses Included

| # | Course | Certification |
|---|--------|--------------|
| 01 | Introducción a Ciberseguridad | CCST Cybersecurity |
| 02 | Conceptos Básicos de Redes | CCST Cybersecurity |
| 04 | Seguridad de Terminales | CCST Cybersecurity |
| 05 | Defensa de la Red | CCST Cybersecurity |
| 06 | Administración de Amenazas Cibernéticas | CCST Cybersecurity |
| 07 | Intro a Aplicaciones y Agentes de IA en Azure | Microsoft Learn |
| 08 | Conceptos de IA para Desarrolladores | Microsoft Learn |
| 09 | Introducción a la Infraestructura en la Nube | AZ-900 |
| 10 | Introducción a los Datos de Microsoft Azure | DP-900 |

---

## License

Personal project — not licensed for redistribution.
