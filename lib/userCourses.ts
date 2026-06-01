import type { Course, CourseItem, CourseWeek } from './courses';

export const USER_COURSES_KEY = 'paceup_user_courses';

function nanoid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function loadUserCourses(): Course[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USER_COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveUserCourse(course: Course): void {
  if (typeof window === 'undefined') return;
  const all = loadUserCourses();
  const idx = all.findIndex(c => c.id === course.id);
  if (idx >= 0) all[idx] = course;
  else all.push(course);
  localStorage.setItem(USER_COURSES_KEY, JSON.stringify(all));
}

export function deleteUserCourse(id: string): void {
  if (typeof window === 'undefined') return;
  const all = loadUserCourses().filter(c => c.id !== id);
  localStorage.setItem(USER_COURSES_KEY, JSON.stringify(all));
}

export function createUserCourse(opts: {
  title: string;
  type: string;
  accent: string;
  hoursNumeric: number;
  deadlineDate: string;
}): Course {
  const id = `uc-${nanoid()}`;
  return {
    id,
    num: id,
    tag: 'custom',
    accent: opts.accent,
    hours: opts.hoursNumeric > 0 ? `~${opts.hoursNumeric}h` : '?',
    hoursNumeric: opts.hoursNumeric,
    type: opts.type || 'Custom',
    title: opts.title,
    studyTopics: [],
    weeks: [],
    deadlineDate: opts.deadlineDate,
  };
}

export function addWeek(course: Course, name: string): Course {
  const wi = course.weeks.length;
  const week: CourseWeek = {
    id: `${course.id}-w${wi}-${nanoid()}`,
    tag: `wb${wi + 1}`,
    label: `Module ${wi + 1}`,
    name,
    items: [],
  };
  return { ...course, weeks: [...course.weeks, week] };
}

export function updateWeekName(course: Course, wi: number, name: string): Course {
  return {
    ...course,
    weeks: course.weeks.map((w, i) => i === wi ? { ...w, name } : w),
  };
}

export function removeWeek(course: Course, wi: number): Course {
  return { ...course, weeks: course.weeks.filter((_, i) => i !== wi) };
}

export function addItem(course: Course, wi: number, name: string): Course {
  const week = course.weeks[wi];
  if (!week) return course;
  const ii = week.items.length;
  const item: CourseItem = {
    id: `${week.id}-i${ii}-${nanoid()}`,
    name,
  };
  return {
    ...course,
    weeks: course.weeks.map((w, i) =>
      i === wi ? { ...w, items: [...w.items, item] } : w
    ),
  };
}

export function updateItem(
  course: Course,
  wi: number,
  ii: number,
  patch: Partial<Pick<CourseItem, 'name' | 'exam'>>,
): Course {
  return {
    ...course,
    weeks: course.weeks.map((w, i) =>
      i === wi
        ? { ...w, items: w.items.map((it, j) => j === ii ? { ...it, ...patch } : it) }
        : w
    ),
  };
}

export function removeItem(course: Course, wi: number, ii: number): Course {
  return {
    ...course,
    weeks: course.weeks.map((w, i) =>
      i === wi ? { ...w, items: w.items.filter((_, j) => j !== ii) } : w
    ),
  };
}
