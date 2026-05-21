export interface AcademicSubject {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
}

export interface BaseAcademicsState {
  subjects: AcademicSubject[];
  subjectsLoading: boolean;
  subjectsError: string | null;
  subjectsPage: number;
  subjectsTotalPages: number;
}
