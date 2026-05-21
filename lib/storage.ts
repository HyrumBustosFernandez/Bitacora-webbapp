import { COURSES, START_DATE, TARGET_DATE, type Course } from './courses';

export type AppState = Record<string, string | number | boolean>;

export function loadState(): AppState {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem('bitacora_v2') || '{}'); }
  catch { return {}; }
}

export function saveState(patch: Partial<AppState>): void {
  if (typeof window === 'undefined') return;
  const s = loadState();
  Object.assign(s, patch);
  try { localStorage.setItem('bitacora_v2', JSON.stringify(s)); } catch {}
}

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
  const key = `${c.id}_w${wi}_i${ii}`;
  const state = loadState();
  const current = getItemState(c, wi, ii, state);
  saveState({ [key]: current === 'done' ? '' : 'done' });
}

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
  const total = TARGET_DATE.getTime() - START_DATE.getTime();
  const elapsed = Math.min(Math.max(now.getTime() - START_DATE.getTime(), 0), total);
  return elapsed / total;
}

export function getDaysLeft(): number {
  return Math.max(0, Math.ceil((TARGET_DATE.getTime() - Date.now()) / 86_400_000));
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
