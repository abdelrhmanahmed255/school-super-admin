import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { shallowEqual } from "react-redux";
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
} from "@/store/slices/academics/classes/thunks";
import {
    setCurrPage,
    setPageSize,
    setGradeLevelFilter,
    setAcademicYearFilter,
    clearFilters
} from "@/store/slices/academics/classes/slice";
import { AssignTeacherRequest, CreateClassRequest, EnrollStudentRequest, UpdateClassRequest } from "@/store/slices/academics/classes/types";
import { useCallback } from "react";

export function useClasses() {
    const dispatch = useAppDispatch();
    const state = useAppSelector((state: RootState) => state.classes, shallowEqual);

    const fetchAll = useCallback((filters?: any) => {
        return dispatch(fetchClasses(filters));
    }, [dispatch]);

    const fetchById = useCallback((id: string) => {
        return dispatch(fetchClassById(id));
    }, [dispatch]);

    const create = useCallback((data: CreateClassRequest) => {
        return dispatch(createClass(data)).unwrap();
    }, [dispatch]);

    const update = useCallback((id: string, data: UpdateClassRequest) => {
        return dispatch(updateClass({ id, classData: data })).unwrap();
    }, [dispatch]);

    const remove = useCallback((id: string) => {
        return dispatch(deleteClass(id)).unwrap();
    }, [dispatch]);

    const fetchLookups = useCallback(() => {
        dispatch(fetchStages());
        dispatch(fetchGrades());
        dispatch(fetchAcademicYears());
        dispatch(fetchTeachers({ page: 1, available_for_homeroom: true }));
        dispatch(fetchRooms());
    }, [dispatch]);

    const fetchMoreTeachers = useCallback((extraParams?: { available_for_homeroom?: boolean; search?: string }) => {
        const { teacherPage, teacherTotalPages, teachersLoading } = state;
        if (teachersLoading || teacherPage >= teacherTotalPages) return;
        dispatch(fetchTeachers({ page: teacherPage + 1, ...extraParams }));
    }, [dispatch, state]);

    const searchTeachers = useCallback((query: string, extraParams?: { available_for_homeroom?: boolean }) => {
        dispatch(fetchTeachers({ page: 1, search: query, ...extraParams }));
    }, [dispatch]);

    const fetchEnrollmentData = useCallback((classId: string) => {
        return dispatch(fetchEnrollments(classId));
    }, [dispatch]);

    const fetchAssignmentData = useCallback((classId: string) => {
        return dispatch(fetchTeacherAssignments(classId));
    }, [dispatch]);

    const fetchScheduleData = useCallback((classId: string) => {
        return dispatch(fetchClassSchedules(classId));
    }, [dispatch]);

    const fetchTeacherMaterials = useCallback((teacherId: string) => {
        return dispatch(fetchTeacherSubjects(teacherId));
    }, [dispatch]);

    const fetchStudentOptions = useCallback(() => {
        dispatch(fetchAvailableStudents({ page: 1 }));
    }, [dispatch]);

    const fetchMoreAvailableStudents = useCallback((extraParams?: { search?: string }) => {
        const { studentPage, studentTotalPages, availableStudentsLoading } = state;
        if (availableStudentsLoading || studentPage >= studentTotalPages) return;
        dispatch(fetchAvailableStudents({ page: studentPage + 1, ...extraParams }));
    }, [dispatch, state]);

    const searchStudents = useCallback((query: string) => {
        dispatch(fetchAvailableStudents({ page: 1, search: query }));
    }, [dispatch]);

    const enroll = useCallback((data: EnrollStudentRequest) => {
        return dispatch(enrollStudent(data)).unwrap();
    }, [dispatch]);

    const unenroll = useCallback((enrollment: any) => {
        return dispatch(unenrollStudent(enrollment)).unwrap();
    }, [dispatch]);

    const assign = useCallback((data: AssignTeacherRequest) => {
        return dispatch(assignTeacher(data)).unwrap();
    }, [dispatch]);

    const unassign = useCallback((assignment: any) => {
        return dispatch(unassignTeacher(assignment)).unwrap();
    }, [dispatch]);

    const setPage = useCallback((page: number) => {
        dispatch(setCurrPage(page));
        dispatch(fetchClasses({
            page,
            limit: state.pageSize,
        }));
    }, [dispatch, state.pageSize]);

    return {
        ...state,
        // Actions
        fetchAll,
        fetchById,
        create,
        update,
        remove,
        fetchLookups,
        fetchDetailData: (classId: string) => {
            dispatch(fetchClassById(classId));
            dispatch(fetchEnrollments(classId));
            dispatch(fetchTeacherAssignments(classId));
            dispatch(fetchClassSchedules(classId));
        },
        fetchEnrollmentData,
        fetchAssignmentData,
        fetchScheduleData,
        fetchTeacherMaterials,
        fetchStudentOptions,
        fetchMoreAvailableStudents,
        searchStudents,
        fetchMoreTeachers,
        searchTeachers,
        enroll,
        unenroll,
        assign,
        unassign,
        // Pagination & Filters
        setPage,
        setLimit: (limit: number) => dispatch(setPageSize(limit)),
        setGradeFilter: (id: string) => dispatch(setGradeLevelFilter(id)),
        setYearFilter: (id: string) => dispatch(setAcademicYearFilter(id)),
        resetFilters: () => dispatch(clearFilters()),
    };
}
