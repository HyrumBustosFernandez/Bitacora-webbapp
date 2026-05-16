# Bitácora

A personal course-tracking and AI-powered study web app built for certification exam prep. Combines a structured study planner with Claude-powered flashcards, quizzes, and summaries — all in a single-page PWA.

---

## Features

### Courses
Track progress across 10 courses covering Cisco NetAcad (CCST Cybersecurity) and Microsoft Learn (AZ-900, DP-900, AI-900) certifications. Each course card shows completion percentage and allows inline title editing.

### Plan
Weekly study schedule with a built-in calendar. Tracks whether you're **ahead**, **on track**, or **behind** based on daily check-ins. Each course has a detailed week-by-week plan with tips for heavier modules.

### Study (AI-powered)
Select a course and topic, then generate:
- **Summary** — structured study notes with key concepts and exam-likely points
- **Flashcards** — 8 interactive flip cards with terms and definitions
- **Quiz** — 5 multiple-choice questions at certification-exam level with explanations

All content is generated on demand via the Anthropic Claude API.

### Progress
Visual dashboard showing completion percentage, items done vs. total, and study status per course.

### Settings
Toggle dark/light theme and switch the UI language between English, Spanish, French, Korean, and Japanese.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vanilla HTML, CSS, JavaScript (no framework) |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Hosting | Cloudflare Workers + Assets |
| PWA | Service Worker, Web App Manifest |
| State | `localStorage` (no backend database) |

---

## Project Structure

```
bitacora-webbapp/
├── index.html       # App shell and all section markup
├── app.js           # All application logic, state, and AI calls
├── app.css          # Styles including dark/light themes and animations
├── sw.js            # Service worker for offline/PWA support
├── manifest.json    # PWA manifest
├── wrangler.jsonc   # Cloudflare Workers deployment config
└── icon*.png/svg    # App icons
```

---

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (for Wrangler CLI)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — `npm install -g wrangler`
- An [Anthropic API key](https://console.anthropic.com/)

### Local Development

```bash
wrangler dev
```

### API Key Configuration

The app calls the Anthropic API from the client. Before deploying, you need to configure your API key. The recommended approach is to proxy requests through a Cloudflare Worker so the key is never exposed in the browser.

> **Note:** The current `callClaude()` function in `app.js` does not include an API key header. A Worker-based proxy is needed for the Study features (flashcards, quiz, summary) to work.

### Deploy to Cloudflare

```bash
wrangler deploy
```

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
