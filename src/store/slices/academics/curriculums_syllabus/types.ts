export interface SyllabusBook {
  id: string;
  school_id?: string;
  subject_id: string;
  grade_level_id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  semester: number;
  order?: number;
  is_active?: boolean;
  structure_type?: "unit_chapter" | string;
  track_id?: string | null;
  curriculum_content_id?: string | null;
  units?: unknown[];
  direct_lessons?: unknown[];
}

export interface SyllabusUnit {
  id: string;
  book_id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  order?: number;
  lessons?: SyllabusLesson[];
}

export interface SyllabusLesson {
  id: string;
  book_id: string;
  unit_id?: string | null;
  title: string;
  title_ar?: string;
  title_en?: string;
  order?: number;
  page_start?: number;
  page_end?: number;
}

export interface LessonMedia {
  id: string;
  lesson_id: string;
  curriculum_content_id?: string;
  title?: string;
  title_ar?: string;
  media_type?: string;
  external_url?: string;
  url?: string;
  file_url?: string;
  thumbnail_url?: string;
  order?: number;
}

export interface LessonRangeItem {
  lesson_id: string;
  lesson_title: string;
  lesson_title_ar?: string;
  page_start?: number;
  page_end?: number;
}

export interface LessonRangeResponse {
  book_id: string;
  lessons: LessonRangeItem[];
}

export interface FetchBooksParams {
  school_id?: string;
  subject_id?: string;
  grade_level_id?: string;
  track_id?: string;
  semester?: number;
  with_units?: boolean;
}

export interface CreateBookPayload {
  subject_id: string;
  grade_level_id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  semester: number;
  structure_type?: "unit_chapter" | string;
  track_id?: string;
  curriculum_content_id?: string;
}

export interface UpdateBookPayload {
  subject_id?: string;
  grade_level_id?: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  semester?: number;
  structure_type?: "unit_chapter" | string;
  track_id?: string | null;
  curriculum_content_id?: string | null;
  is_active?: boolean;
  order?: number;
}

export interface CreateUnitPayload {
  title: string;
  title_ar?: string;
  title_en?: string;
  order?: number;
}

export interface UpdateUnitPayload {
  title?: string;
  title_ar?: string;
  title_en?: string;
  order?: number;
}

export interface CreateLessonPayload {
  title: string;
  title_ar?: string;
  title_en?: string;
  order?: number;
  page_start?: number;
  page_end?: number;
}

export interface UpdateLessonPayload {
  title?: string;
  title_ar?: string;
  title_en?: string;
  order?: number;
  page_start?: number;
  page_end?: number;
  unit_id?: string | null;
}

export interface CreateLessonMediaPayload {
  media_type?: string;
  title?: string;
  title_ar?: string;
  curriculum_content_id?: string;
  external_url?: string;
  order?: number;
}

export interface CurriculumsSyllabusState {
  books: SyllabusBook[];
  currentBook: SyllabusBook | null;
  lessonRange: LessonRangeResponse | null;
  lessonMediaByLessonId: Record<string, LessonMedia[]>;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}
