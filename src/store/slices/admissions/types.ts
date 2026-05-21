export type AdmissionStatus =
  | "PENDING_REVIEW"
  | "UNDER_REVIEW"
  | "INTERVIEW_SCHEDULED"
  | "ACCEPTED"
  | "ENROLLED"
  | "REJECTED";

export interface AdmissionApplication {
  id: string;
  reference?: string | null;
  enrollment_number?: string | null;
  student_full_name?: string;
  student_date_of_birth?: string;
  desired_grade_level?: string;
  desired_grade_level_id?: string | null;
  parent_full_name?: string;
  parent_email?: string | null;
  parent_phone?: string | null;
  status: AdmissionStatus;
  interview_at?: string | null;
  rejection_reason?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateAdmissionRequest {
  status?: AdmissionStatus;
  rejection_reason?: string | null;
  interview_at?: string | null;
}

export interface AdmissionsState {
  applications: AdmissionApplication[];
  applicationDetail: AdmissionApplication | null;
  loading: boolean;
  detailLoading: boolean;
  updateLoading: boolean;
  error: string | null;
  detailError: string | null;
  updateError: string | null;
  count: number;
  totalPages: number;
  currPage: number;
  pageSize: number;
  search: string;
  statusFilter: AdmissionStatus | "all";
  sort_by: string;
  order: "asc" | "desc";
}
