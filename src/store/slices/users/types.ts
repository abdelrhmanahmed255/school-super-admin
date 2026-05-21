export interface CreateUserRequest {
  email: string;
  password?: string;
  full_name: string;
  role: string;
  school_id?: string;
  phone?: string;
  student_id?: string;
  grade_level_id?: string;
  class_id?: string;
  family_id?: string;
  parent_ids?: string[];
  student_ids?: string[];
  relationship_type?: string;
  is_primary?: boolean;
  new_parents?: string[];
  new_students?: string[];
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  government_id?: string;
  government_id_type?: string;
  address?: string;
  blood_type?: string;
  medical_info?: string;
  allergies?: string;
  special_needs?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  specialized_subject_ids?: string[];
  status?: string;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  full_name?: string;
  role?: string;
  school_id?: string;
  phone?: string;
  avatar_url?: string;
  status?: string;
  address?: string;
  blood_type?: string;
  medical_info?: string;
  allergies?: string;
  special_needs?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  nationality?: string;
  government_id?: string;
  government_id_type?: string;
  academic_rank_en?: string;
  academic_rank_ar?: string;
  date_of_birth?: string;
  gender?: string;
  department_id?: string;
  designation_id?: string;
  employment_type?: string;
  joining_date?: string;
  specialized_subject_ids?: string[];
  family_id?: string;
}

export interface User {
  id: string;
  email: string;
  username: string | null;
  full_name: string;
  full_name_ar?: string,
  generated_password: string | null;
  role: string;
  status: string;
  school_id: string;
  avatar_url: string | null;
  phone: string | null;
  nationality?: string | null;
  government_id?: string | null;
  identifier?: string | null;
  created_at: string;
  specialized_subjects: string[];
  gender: string | null;
  student_id: string | null;
  grade_level_name: string | null;
  grade_level_name_ar: string | null;
  grade_level_name_en: string | null;
  class_name: string | null;
  stage_name_en: string | null;
  stage_name_ar: string | null;
  guardian_name: string | null;
  family_id: string | null;
}

export interface TeacherDetail {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  status?: string;
  role?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  government_id?: string;
  government_id_type?: string;
  employee_id?: string;
  department?: string;
  department_id?: string;
  designation?: string;
  designation_id?: string;
  employment_type?: string;
  joining_date?: string;
  date_joined?: string;
  contract_type?: string;
  visa_expiry_date?: string;
  academic_rank_en?: string;
  academic_rank_ar?: string;
  specialization?: string;
  specialized_subjects?: unknown[];
  qualifications?: string;
  years_of_experience?: number;
  office_location?: string;
  office_hours?: string;
  classes_taught?: unknown[];
  salary_info?: {
    basic_salary?: number;
    allowances?: number;
    deductions?: number;
    net_salary?: number;
    last_payment_date?: string;
  };
  total_students?: number;
  average_student_grade?: number;
}

export interface StudentDetail {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  status?: string;
  gender?: string;
  birth_date?: string;
  id_number?: string;
  student_id?: string;
  class_name?: string;
  class_id?: string;
  grade_level?: string;
  enrollment_date?: string;
  family?: {
    id?: string;
    family_code?: string;
    father_full_name?: string;
    father_full_name_ar?: string;
    father_phone?: string;
    father_is_deceased?: boolean;
    mother_full_name?: string;
    mother_full_name_ar?: string;
    mother_phone?: string;
    mother_is_deceased?: boolean;
    guardian_full_name?: string;
    guardian_phone?: string;
    guardian_relationship_type?: string;
    family_address?: string;
    student_count?: number;
  };
  parents?: unknown[];
  grade_analytics?: unknown[];
  overall_gpa?: number;
  attendance_analytics?: {
    total_days?: number;
    present_days?: number;
    absent_days?: number;
    late_days?: number;
    excused_days?: number;
    attendance_percentage?: number;
  };
  fee_status?: {
    total_fees?: number;
    total_paid?: number;
    total_discount?: number;
    balance?: number;
    payment_status?: string;
    last_payment_date?: string;
    last_payment_amount?: number;
  };
  medical_info?: string;
  allergies?: string;
  special_needs?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface UsersState {
  users: User[];
  currentUser: User | null;
  teacherDetail: TeacherDetail | null;
  studentDetail: StudentDetail | null;
  loading: boolean;
  error: string | null;
  count: number;
  totalPages: number;
  currPage: number;
  pageSize: number;
  search: string;
  status: string;
  role: string;
  stage_id: string;
  grade_level_id: string;
  class_id: string;
  gender: string;
  sort_by: string;
  order: "asc" | "desc";
}
