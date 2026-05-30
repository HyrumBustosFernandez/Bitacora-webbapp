export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;
export type CourseStatus   = 'not-started' | 'in-progress' | 'completed' | 'paused';
export type CoursePriority = 'low' | 'medium' | 'high' | 'critical';

export interface StudyGoal {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export interface CourseUserData {
  courseId: string;
  status: CourseStatus;
  priority: CoursePriority;
  description?: string;
  difficulty?: DifficultyLevel;
  deadlineDateOverride?: string; // YYYY-MM-DD
  studyGoals: StudyGoal[];
  updatedAt: string;
}

const KEY = (courseId: string) => `course_userdata_${courseId}`;

export function loadCourseUserData(courseId: string): CourseUserData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY(courseId));
    return raw ? (JSON.parse(raw) as CourseUserData) : null;
  } catch { return null; }
}

export function saveCourseUserData(data: CourseUserData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY(data.courseId), JSON.stringify(data));
  } catch {}
}

export function loadAllCourseUserData(): Record<string, CourseUserData> {
  if (typeof window === 'undefined') return {};
  const result: Record<string, CourseUserData> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith('course_userdata_')) continue;
    try {
      const val = JSON.parse(localStorage.getItem(key)!) as CourseUserData;
      if (val?.courseId) result[val.courseId] = val;
    } catch {}
  }
  return result;
}
