export interface Stage {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
    order: number;
}

export interface Grade {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
    code: string;
    order: number;
    is_active: boolean;
    stage_id: string;
    stage: Stage;
}

export interface Class {
    id: string;
    name: string;
    section: string;
    grade_level_id: string;
    academic_year_id: string;
    capacity: number;
    room_id: string | null;
    room: string | null;
    homeroom_teacher_id: string | null;
    homeroom_teacher_name: string | null;
    homeroom_teacher?: Teacher | null;
    is_active: boolean;
    student_count: number;
    teacher_count: number;
    course_count: number;
    enrolled_count: number;
    grade: Grade;

}

export interface ClassStats {
    total_capacity: number;
    total_enrolled: number;
    available_places: number;
}

export interface AcademicYear {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    status: string;
}

export interface Teacher {
    id: string;
    full_name: string;
    email: string;
    role: string;
    specialized_subjects?: Array<
        | string
        | {
            id?: string;
            name?: string;
            name_ar?: string;
            name_en?: string;
            title?: string;
            title_ar?: string;
            title_en?: string;
        }
    >;
}

export interface Student {
    id: string;
    full_name: string;
    email: string;
    role: string;
}

export interface Enrollment {
    id: string;
    student_id: string;
    student_name: string;
    student_email: string;
    class_id: string;
    enrollment_date: string;
    is_active: boolean;
}

export interface TeacherAssignment {
    id: string;
    teacher_id: string;
    teacher_name: string;
    class_id: string;
    class_name: string;
    subject_id: string;
    subject_name: string;
    is_active: boolean;
}

export interface ScheduleItem {
    id: string;
    day_of_week: string;
    lesson_number: number;
    start_time: string;
    end_time: string;
    room: string;
    teacher_id: string;
    teacher_name: string;
    subject_id: string;
    subject_name: string;
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
    is_available: boolean;
}

export interface Subject {
    id: string;
    name: string;
    name_ar: string;
    name_en: string;
}

export interface EnrollStudentRequest {
    student_id: string;
    class_id: string;
}

export interface AssignTeacherRequest {
    teacher_id: string;
    subject_id: string;
    class_id: string;
}

export interface CreateClassRequest {
    name?: string;
    stage_id?: string;
    grade_level_id: string;
    section?: string;
    capacity?: number;
    room?: string;
    homeroom_teacher_id?: string;
    academic_year_id?: string;
}

export interface UpdateClassRequest {
    name?: string;
    stage_id?: string;
    grade_level_id?: string;
    section?: string;
    capacity?: number;
    room?: string;
    homeroom_teacher_id?: string;
    academic_year_id?: string;
}

export interface ClassesState {
    classes: Class[];
    currentClass: Class | null;
    stats: ClassStats;
    loading: boolean;
    error: string | null;
    count: number;
    totalPages: number;
    currPage: number;
    pageSize: number;
    grade_level_id: string;
    academic_year_id: string;

    // Lookup data for modal
    stages: Stage[];
    grades: Grade[];
    academicYears: AcademicYear[];

    // Teachers (paginated)
    teachers: Teacher[];
    teacherPage: number;
    teacherTotalPages: number;
    teachersLoading: boolean;
    teacherSubjects: Subject[];

    rooms: Room[];
    lookupLoading: boolean;

    // Detail page data
    enrollments: Enrollment[];
    teacherAssignments: TeacherAssignment[];
    schedules: ScheduleItem[];
    enrollmentsLoading: boolean;
    assignmentsLoading: boolean;
    schedulesLoading: boolean;

    // Enrollment lookup
    availableStudents: Student[];
    studentPage: number;
    studentTotalPages: number;
    availableStudentsLoading: boolean;
    enrollmentSubmitting: boolean;
    assignmentSubmitting: boolean;
}
