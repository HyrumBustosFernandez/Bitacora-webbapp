import { COURSES, START_DATE, TARGET_DATE, type Course } from './courses';

export type AppState = Record<string, string | number | boolean>;

// ── Configurable exam date ───────────────────────────────────────────────────

export function getExamDate(): Date {
  if (typeof window === 'undefined') return TARGET_DATE;
  const stored = localStorage.getItem('paceup_exam_date');
  if (stored) {
    const d = new Date(stored + 'T23:59:59');
    if (!isNaN(d.getTime())) return d;
  }
  return TARGET_DATE;
}

// ── Weekly goal ──────────────────────────────────────────────────────────────

function isoWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${weekNo}`;
}

export function getWeeklyGoal(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem('paceup_weekly_goal') ?? '0', 10) || 0;
}

export function getWeekDone(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = JSON.parse(localStorage.getItem('paceup_week_done') ?? '{}');
    if (raw.weekKey === isoWeekKey()) return raw.count ?? 0;
  } catch { /* ignore */ }
  return 0;
}

function updateWeekDone(delta: 1 | -1): void {
  if (typeof window === 'undefined') return;
  const key = isoWeekKey();
  let count = getWeekDone();
  count = Math.max(0, count + delta);
  localStorage.setItem('paceup_week_done', JSON.stringify({ weekKey: key, count }));
}

// ── Per-course progress storage (stable-ID format) ──────────────────────────

function loadCourseProgress(courseId: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(`course_progress_${courseId}`);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCourseProgress(courseId: string, progress: Record<string, string>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`course_progress_${courseId}`, JSON.stringify(progress));
  } catch {}
}

// ── One-time migration from bitacora_v2 (positional) → per-course (stable ID) ──

export function runMigration(): void {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('bitacora_migration_v2') === 'done') return;

  try {
    const old: Record<string, string> = JSON.parse(localStorage.getItem('bitacora_v2') || '{}');
    COURSES.forEach(c => {
      const progress: Record<string, string> = {};
      c.weeks.forEach((w, wi) => {
        w.items.forEach((item, ii) => {
          const oldKey = `${c.id}_w${wi}_i${ii}`;
          const val = old[oldKey];
          if (val === 'done' || val === 'partial') {
            progress[item.id] = val;
          }
        });
      });
      if (Object.keys(progress).length > 0) {
        saveCourseProgress(c.id, progress);
      }
    });
    localStorage.setItem('bitacora_migration_v2', 'done');
    // Keep bitacora_v2 for 1 session as backup — not deleted here
  } catch { /* ignore */ }
}

// ── State loading ────────────────────────────────────────────────────────────

export function loadState(): AppState {
  if (typeof window === 'undefined') return {};
  runMigration();

  const state: AppState = {};

  // Copy non-item keys (userName, etc.) from the legacy store
  try {
    const legacy: Record<string, unknown> = JSON.parse(localStorage.getItem('bitacora_v2') || '{}');
    Object.entries(legacy).forEach(([k, v]) => {
      if (!k.match(/^c\d+_w\d+_i\d+$/)) {
        state[k] = v as string | number | boolean;
      }
    });
  } catch { /* ignore */ }

  // Rebuild item states from per-course stable-ID storage
  COURSES.forEach(c => {
    const progress = loadCourseProgress(c.id);
    c.weeks.forEach((w, wi) => {
      w.items.forEach((item, ii) => {
        const val = progress[item.id];
        if (val) state[`${c.id}_w${wi}_i${ii}`] = val;
      });
    });
  });

  // Also load user-created course progress
  try {
    const ucRaw = localStorage.getItem('paceup_user_courses');
    const userCourses: Course[] = ucRaw ? JSON.parse(ucRaw) : [];
    userCourses.forEach(c => {
      const progress = loadCourseProgress(c.id);
      c.weeks.forEach((w, wi) => {
        w.items.forEach((item, ii) => {
          const val = progress[item.id];
          if (val) state[`${c.id}_w${wi}_i${ii}`] = val;
        });
      });
    });
  } catch { /* ignore */ }

  return state;
}

export function saveState(patch: Partial<AppState>): void {
  if (typeof window === 'undefined') return;
  const s = loadState();
  Object.assign(s, patch);
  // Only persist non-item keys to bitacora_v2
  const legacyPatch: Record<string, unknown> = {};
  Object.entries(patch).forEach(([k, v]) => {
    if (!k.match(/^c\d+_w\d+_i\d+$/)) legacyPatch[k] = v;
  });
  try {
    const existing: Record<string, unknown> = JSON.parse(localStorage.getItem('bitacora_v2') || '{}');
    Object.assign(existing, legacyPatch);
    localStorage.setItem('bitacora_v2', JSON.stringify(existing));
  } catch {}
}

// ── Item state helpers ───────────────────────────────────────────────────────

export function getItemState(
  c: Course, wi: number, ii: number, state: AppState
): 'done' | 'partial' | '' {
  const key = `${c.id}_w${wi}_i${ii}`;
  const saved = state[key] as string | undefined;
  if (saved === 'done') return 'done';
  if (saved === 'partial') return 'partial';
  if (!saved) {
    const item = c.weeks[wi]?.items[ii];
    if (item?.done) return 'done';
    if (item?.partial) return 'partial';
  }
  return '';
}

export function toggleItemDone(c: Course, wi: number, ii: number): void {
  const item = c.weeks[wi]?.items[ii];
  if (!item) return;

  const progress = loadCourseProgress(c.id);
  // Determine current effective state
  const stored = progress[item.id];
  const current = stored ?? (item.done ? 'done' : item.partial ? 'partial' : '');

  if (current === 'done') {
    delete progress[item.id];
    updateWeekDone(-1);
  } else {
    progress[item.id] = 'done';
    updateWeekDone(1);
  }
  saveCourseProgress(c.id, progress);
}

// ── Progress calculations ────────────────────────────────────────────────────

export function getCourseProgress(c: Course, state: AppState): number {
  let total = 0, done = 0;
  c.weeks.forEach((w, wi) => w.items.forEach((_, ii) => {
    total++;
    if (getItemState(c, wi, ii, state) === 'done') done++;
  }));
  return total ? Math.round(done / total * 100) : 0;
}

export function getWeekProgress(c: Course, wi: number, state: AppState): number {
  const items = c.weeks[wi]?.items ?? [];
  const done = items.filter((_, ii) => getItemState(c, wi, ii, state) === 'done').length;
  return items.length ? Math.round(done / items.length * 100) : 0;
}

export function getGlobalItems(state: AppState): { total: number; done: number } {
  let total = 0, done = 0;
  COURSES.forEach(c => c.weeks.forEach((w, wi) => w.items.forEach((_, ii) => {
    total++;
    if (getItemState(c, wi, ii, state) === 'done') done++;
  })));
  return { total, done };
}

export function getDayRatio(): number {
  const now = new Date();
  const examDate = getExamDate();
  const total = examDate.getTime() - START_DATE.getTime();
  const elapsed = Math.min(Math.max(now.getTime() - START_DATE.getTime(), 0), total);
  return total > 0 ? elapsed / total : 0;
}

export function getDaysLeft(): number {
  return Math.max(0, Math.ceil((getExamDate().getTime() - Date.now()) / 86_400_000));
}

export function getExamDateLabel(): string {
  const d = getExamDate();
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type TrackStatus = 'ahead' | 'on-track' | 'behind' | 'done';

export interface TrackInfo {
  status: TrackStatus;
  diff: number;
  done: number;
  total: number;
  actualPct: number;
  expectedPct: number;
  expectedItems: number;
}

export function getTrackInfo(course: Course | null, state: AppState): TrackInfo {
  const ratio = getDayRatio();
  let total = 0, done = 0;
  const targets = course ? [course] : COURSES;
  targets.forEach(c => c.weeks.forEach((w, wi) => w.items.forEach((_, ii) => {
    total++;
    if (getItemState(c, wi, ii, state) === 'done') done++;
  })));
  const actualPct    = total ? Math.round(done / total * 100) : 0;
  const expectedPct  = Math.round(ratio * 100);
  const expectedItems = Math.round(ratio * total);
  const diff         = done - expectedItems;
  let status: TrackStatus;
  if (actualPct >= 100) status = 'done';
  else if (diff >= 5)   status = 'ahead';
  else if (diff >= -5)  status = 'on-track';
  else                  status = 'behind';
  return { status, diff, done, total, actualPct, expectedPct, expectedItems };
}

export interface FocusInfo {
  course: Course;
  weekIndex: number;
  nextCourse?: Course;
  nextWeekIndex?: number;
}

export function getFocusInfo(state: AppState): FocusInfo | null {
  const expectedPct = getDayRatio() * 100;
  const candidates = COURSES.map(c => {
    const actualPct = getCourseProgress(c, state);
    const behindBy  = expectedPct - actualPct;
    const weekIdx   = c.weeks.findIndex((_, wi) =>
      c.weeks[wi].items.some((_, ii) => getItemState(c, wi, ii, state) !== 'done')
    );
    return { course: c, behindBy, weekIdx };
  })
    .filter(x => x.weekIdx >= 0)
    .sort((a, b) => b.behindBy - a.behindBy);

  if (!candidates[0]) return null;
  const { course, weekIdx } = candidates[0];
  const next = candidates[1];
  return {
    course,
    weekIndex: weekIdx,
    nextCourse:    next?.course,
    nextWeekIndex: next?.weekIdx,
  };
}

export function getUpcomingDeadlines(state: AppState) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return COURSES
    .map(c => {
      const deadline = new Date(c.deadlineDate);
      const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000);
      const pct = getCourseProgress(c, state);
      return { course: c, deadline, daysLeft, pct };
    })
    .filter(x => x.pct < 100)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);
}
