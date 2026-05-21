export interface Subject {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  code: string;
  category: string | null;
  content_language: string;
  is_rtl_content: boolean;
  content_count: number;
  video_count: number;
  file_count: number;
  exam_count: number;
  grade_level_id?: string;
}

export interface CurriculumResource {
  id: string;
  title: string;
  title_ar?: string;
  title_en?: string;
  type: "file" | "video";
  url: string;
  thumbnail?: string;
  description?: string;
  subject_id: string;
  grade_level_id: string;
  semester_id: string | number;
  created_at?: string;
  category?: "official" | "teacher_video" | "summary";
  content_type?: "teacher_video" | "summary_resource" | "official_curriculum";
  is_official?: boolean;
  partitioning_type?: "units" | "lessons";
  parts?: CurriculumContentPart[];
  uploader_name?: string;
  file_size?: number;
  views_count?: number;
  downloads_count?: number;
}

export interface CurriculumContentLesson {
  id?: string;
  title: string;
  title_ar?: string;
  start: string;
  end: string;
}

export interface CurriculumContentPart {
  id?: string;
  title: string;
  title_ar?: string;
  start: string;
  end: string;
  lessons?: CurriculumContentLesson[];
}

export interface Question {
  id: string;
  content: string;
  content_ar?: string;
  content_en?: string;
  type: "multiple_choice" | "true_false" | "text";
  difficulty: "easy" | "medium" | "hard";
  subject_id: string;
  grade_level_id: string;
  semester_id: string | number;
  options?: string[];
  correct_answer?: string;
  created_at?: string;
}

export interface CurriculumContent {
  subject_id: string;
  subject_name: string;
  subject_name_ar: string;
  grade_level_id: string;
  grade_name: string;
  grade_name_ar: string;
  is_rtl_content: boolean;
  content_language: string;
  official_curriculum: CurriculumResource[];
  teacher_videos: CurriculumResource[];
  summaries_resources: CurriculumResource[];
  semester_id: number;
  questions?: Question[];
}

export interface CurriculumsState {
  subjects: Subject[];
  currentContent: CurriculumContent | null;
  loading: boolean;
  error: string | null;
  semester_id: number;
  current_grade_id: string | null;
}


export interface ContentPartPayload {
  title: string;
  title_ar?: string;
  start?: string;
  end?: string;
  lessons?: {
    title: string;
    title_ar?: string;
    start?: string;
    end?: string;
  }[];
}

export interface UploadContentPayload {
  title: string;
  title_ar?: string;
  description?: string;
  subject_id: string;
  grade_level_id: string;
  semester_id: string | number;
  content_type: "teacher_video" | "summary_resource" | "official_curriculum";
  partitioning_type?: "units" | "lessons";
  is_official?: boolean;
  parts?: ContentPartPayload[];
  file?: File | null;
}

export interface UpdateContentPayload {
  contentId: string;
  title?: string;
  title_ar?: string;
  description?: string;
  semester_id?: string | number;
  content_type?: "teacher_video" | "summary_resource" | "official_curriculum";
  partitioning_type?: "units" | "lessons";
  is_official?: boolean;
  parts?: ContentPartPayload[];
  file?: File | null;
}
