/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ClassesState } from "./types";
import {
    fetchClasses,
    fetchClassById,
    createClass,
    updateClass,
    deleteClass,
    fetchStages,
    fetchGrades,
    fetchAcademicYears,
    fetchTeachers,
    fetchRooms,
    fetchTeacherSubjects,
    fetchEnrollments,
    fetchTeacherAssignments,
    fetchClassSchedules,
    fetchAvailableStudents,
    enrollStudent,
    assignTeacher,
    unenrollStudent,
    unassignTeacher,
} from "./thunks";

const initialState: ClassesState = {
    classes: [],
    currentClass: null,
    stats: {
        total_capacity: 0,
        total_enrolled: 0,
        available_places: 0,
    },
    loading: false,
    error: null,
    count: 0,
    totalPages: 1,
    currPage: 1,
    pageSize: 20,
    grade_level_id: "All",
    academic_year_id: "All",
    stages: [],
    grades: [],
    academicYears: [],
    teachers: [],
    teacherPage: 1,
    teacherTotalPages: 1,
    teachersLoading: false,
    rooms: [],
    teacherSubjects: [],
    lookupLoading: false,
    enrollments: [],
    teacherAssignments: [],
    schedules: [],
    enrollmentsLoading: false,
    assignmentsLoading: false,
    schedulesLoading: false,
    availableStudents: [],
    studentPage: 1,
    studentTotalPages: 1,
    availableStudentsLoading: false,
    enrollmentSubmitting: false,
    assignmentSubmitting: false,
};

const classesSlice = createSlice({
    name: "classes",
    initialState,
    reducers: {
        setCurrPage: (state, action: PayloadAction<number>) => {
            state.currPage = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.pageSize = action.payload;
            state.currPage = 1;
        },
        setGradeLevelFilter: (state, action: PayloadAction<string>) => {
            state.grade_level_id = action.payload;
            state.currPage = 1;
        },
        setAcademicYearFilter: (state, action: PayloadAction<string>) => {
            state.academic_year_id = action.payload;
            state.currPage = 1;
        },
        clearFilters: (state) => {
            state.grade_level_id = "All";
            state.academic_year_id = "All";
            state.currPage = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Classes
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload.items;
                state.count = action.payload.total;
                state.totalPages = action.payload.pages || 1;
                if (action.payload.stats) {
                    state.stats = action.payload.stats;
                }
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Fetch Class By Id
            .addCase(fetchClassById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentClass = action.payload;
            })
            .addCase(fetchClassById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create Class
            .addCase(createClass.fulfilled, (state, action) => {
                if (action.payload) {
                    state.classes = [action.payload, ...state.classes];
                    state.count += 1;
                }
            })
            // Update Class
            .addCase(updateClass.fulfilled, (state, action) => {
                const updatedClass = action.payload;
                if (!updatedClass) return;

                state.classes = state.classes.map((cls) =>
                    cls.id === updatedClass.id ? updatedClass : cls,
                );
                if (state.currentClass?.id === updatedClass.id) {
                    state.currentClass = updatedClass;
                }
            })
            // Delete Class
            .addCase(deleteClass.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.classes = state.classes.filter((cls) => cls.id !== deletedId);
                state.count -= 1;
            })
            // Fetch Stages
            .addCase(fetchStages.pending, (state) => {
                state.lookupLoading = true;
            })
            .addCase(fetchStages.fulfilled, (state, action) => {
                state.lookupLoading = false;
                state.stages = action.payload.items || [];
            })
            .addCase(fetchStages.rejected, (state) => {
                state.lookupLoading = false;
            })
            // Fetch Grades
            .addCase(fetchGrades.fulfilled, (state, action) => {
                state.grades = action.payload.items || [];
            })
            // Fetch Academic Years
            .addCase(fetchAcademicYears.fulfilled, (state, action) => {
                state.academicYears = action.payload.items || [];
            })
            // Fetch Teachers (paginated — append on page > 1)
            .addCase(fetchTeachers.pending, (state) => {
                state.teachersLoading = true;
            })
            .addCase(fetchTeachers.fulfilled, (state, action) => {
                state.teachersLoading = false;
                const page = action.payload.page || 1;
                const items = (action.payload.items || []).map((t: any) => ({
                    id: t.id,
                    full_name: t.full_name,
                    email: t.email,
                    role: t.role,
                    specialized_subjects: Array.isArray(t.specialized_subjects)
                        ? t.specialized_subjects
                        : [],
                }));
                if (page === 1) {
                    state.teachers = items;
                } else {
                    state.teachers = [...state.teachers, ...items];
                }
                state.teacherPage = page;
                state.teacherTotalPages = action.payload.pages || 1;
                console.log(action.payload.pages)
            })
            .addCase(fetchTeachers.rejected, (state) => {
                state.teachersLoading = false;
            })
            // Fetch Rooms
            .addCase(fetchRooms.fulfilled, (state, action) => {
                state.rooms = action.payload.items || [];
            })
            // Fetch Teacher Subjects
            .addCase(fetchTeacherSubjects.fulfilled, (state, action) => {
                state.teacherSubjects = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.items || [];
            })
            // Fetch Enrollments
            .addCase(fetchEnrollments.pending, (state) => {
                state.enrollmentsLoading = true;
            })
            .addCase(fetchEnrollments.fulfilled, (state, action) => {
                state.enrollmentsLoading = false;
                state.enrollments = action.payload.items || [];
            })
            .addCase(fetchEnrollments.rejected, (state) => {
                state.enrollmentsLoading = false;
            })
            // Fetch Teacher Assignments
            .addCase(fetchTeacherAssignments.pending, (state) => {
                state.assignmentsLoading = true;
            })
            .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
                state.assignmentsLoading = false;
                state.teacherAssignments = action.payload.items || [];
            })
            .addCase(fetchTeacherAssignments.rejected, (state) => {
                state.assignmentsLoading = false;
            })
            // Fetch Class Schedules
            .addCase(fetchClassSchedules.pending, (state) => {
                state.schedulesLoading = true;
            })
            .addCase(fetchClassSchedules.fulfilled, (state, action) => {
                state.schedulesLoading = false;
                state.schedules = action.payload || [];
            })
            .addCase(fetchClassSchedules.rejected, (state) => {
                state.schedulesLoading = false;
            })
            // Fetch Available Students
            .addCase(fetchAvailableStudents.pending, (state) => {
                state.availableStudentsLoading = true;
                state.error = null;
            })
            .addCase(fetchAvailableStudents.fulfilled, (state, action) => {
                state.availableStudentsLoading = false;
                const newStudents = (action.payload.items || []).map((s: any) => ({
                    id: s.id,
                    full_name: s.full_name,
                    email: s.email,
                    role: s.role,
                }));

                if (action.payload._page === 1) {
                    state.availableStudents = newStudents;
                } else {
                    state.availableStudents = [...state.availableStudents, ...newStudents];
                }
                state.studentPage = action.payload._page;
                state.studentTotalPages = action.payload.pages || 1;
            })
            .addCase(fetchAvailableStudents.rejected, (state, action) => {
                state.availableStudentsLoading = false;
                state.error = action.payload as string;
            })
            // Enroll Student
            .addCase(enrollStudent.pending, (state) => {
                state.enrollmentSubmitting = true;
            })
            .addCase(enrollStudent.fulfilled, (state) => {
                state.enrollmentSubmitting = false;
            })
            .addCase(enrollStudent.rejected, (state) => {
                state.enrollmentSubmitting = false;
            })
            // Assign Teacher
            .addCase(assignTeacher.pending, (state) => {
                state.assignmentSubmitting = true;
            })
            .addCase(assignTeacher.fulfilled, (state) => {
                state.assignmentSubmitting = false;
            })
            .addCase(assignTeacher.rejected, (state) => {
                state.assignmentSubmitting = false;
            })
            // Unenroll Student
            .addCase(unenrollStudent.pending, (state) => {
                state.enrollmentSubmitting = true;
            })
            .addCase(unenrollStudent.fulfilled, (state) => {
                state.enrollmentSubmitting = false;
            })
            .addCase(unenrollStudent.rejected, (state) => {
                state.enrollmentSubmitting = false;
            })
            // Unassign Teacher
            .addCase(unassignTeacher.pending, (state) => {
                state.assignmentSubmitting = true;
            })
            .addCase(unassignTeacher.fulfilled, (state) => {
                state.assignmentSubmitting = false;
            })
            .addCase(unassignTeacher.rejected, (state) => {
                state.assignmentSubmitting = false;
            })
    },
});

export const {
    setCurrPage,
    setPageSize,
    setGradeLevelFilter,
    setAcademicYearFilter,
    clearFilters,
} = classesSlice.actions;

export default classesSlice.reducer;
