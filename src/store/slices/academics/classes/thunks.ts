import { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import qs from "qs";
import { logout } from "../../userSlice/slice";
import { toast } from "sonner";
import { AssignTeacherRequest, CreateClassRequest, EnrollStudentRequest, UpdateClassRequest } from "./types";

export const fetchClasses = createAsyncThunk(
    "classes/fetchClasses",
    async (
        filters:
            | {
                page?: number;
                limit?: number;
                grade_level_id?: string;
                academic_year_id?: string;
            }
            | void,
        { rejectWithValue, getState, dispatch },
    ) => {
        const state = (getState() as RootState).classes;

        const params: any = {
            grade_level_id: filters?.grade_level_id ?? state.grade_level_id,
            academic_year_id: filters?.academic_year_id ?? state.academic_year_id,
            page: filters?.page ?? state.currPage,
            limit: filters?.limit ?? state.pageSize,
        };

        // Clean up empty values and "all"/"All" values
        Object.keys(params).forEach((key) => {
            const val = params[key];
            if (
                val === "all" ||
                val === "All" ||
                val === "" ||
                val === undefined ||
                (Array.isArray(val) && val.length === 0)
            ) {
                delete params[key];
            }
        });

        try {
            const response = await api.get("/academic/classes", {
                params,
                paramsSerializer: (params) =>
                    qs.stringify(params, { arrayFormat: "comma" }),
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    },
);

export const fetchClassById = createAsyncThunk(
    "classes/fetchClassById",
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get(`/academic/classes/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";
            return rejectWithValue(errorMessage);
        }
    },
);

export const createClass = createAsyncThunk(
    "classes/createClass",
    async (classData: CreateClassRequest, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/academic/classes", classData);
            toast.success("Class created successfully");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";
            toast.error(
                typeof errorMessage === "string"
                    ? errorMessage
                    : JSON.stringify(errorMessage),
            );
            return rejectWithValue(errorMessage);
        }
    },
);

export const updateClass = createAsyncThunk(
    "classes/updateClass",
    async (
        { id, classData }: { id: string; classData: UpdateClassRequest },
        { rejectWithValue, dispatch },
    ) => {
        try {
            const payload: any = { ...classData };
            Object.keys(payload).forEach((key) => {
                if (
                    payload[key] === "" ||
                    payload[key] === null ||
                    payload[key] === undefined
                ) {
                    delete payload[key];
                }
            });

            const response = await api.put(`/academic/classes/${id}`, payload);
            toast.success("Class updated successfully");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";
            toast.error(
                typeof errorMessage === "string"
                    ? errorMessage
                    : JSON.stringify(errorMessage),
            );
            return rejectWithValue(errorMessage);
        }
    },
);

export const deleteClass = createAsyncThunk(
    "classes/deleteClass",
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/academic/classes/${id}`);
            toast.success("Class deleted successfully");
            return id;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            const errorMessage =
                error?.response?.data?.message ||
                error.message ||
                "Something went wrong";
            toast.error(
                typeof errorMessage === "string"
                    ? errorMessage
                    : JSON.stringify(errorMessage),
            );
            return rejectWithValue(errorMessage);
        }
    },
);

export const fetchStages = createAsyncThunk(
    "classes/fetchStages",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get("/academic/stages");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch stages",
            );
        }
    },
);

export const fetchGrades = createAsyncThunk(
    "classes/fetchGrades",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get("/academic/grades");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch grades",
            );
        }
    },
);

export const fetchAcademicYears = createAsyncThunk(
    "classes/fetchAcademicYears",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get("/academic/years");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to fetch academic years",
            );
        }
    },
);

export const fetchTeachers = createAsyncThunk(
    "classes/fetchTeachers",
    async (params: { role?: string; limit?: number; page?: number; available_for_homeroom?: boolean; search?: string } | void, { rejectWithValue, dispatch }) => {
        try {
            // Build params and remove undefined values
            const queryParams: Record<string, any> = {
                role: params?.role || "teacher",
                limit: params?.limit || 20,
                page: params?.page || 1,
            };
            if (params?.available_for_homeroom !== undefined) {
                queryParams.available_for_homeroom = params.available_for_homeroom;
            }
            if (params?.search) {
                queryParams.search = params.search;
            }
            const response = await api.get("/users", { params: queryParams });
            return { ...response.data, _page: params?.page || 1 };
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch teachers",
            );
        }
    },
);

export const fetchRooms = createAsyncThunk(
    "classes/fetchRooms",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get("/schools/rooms");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch rooms",
            );
        }
    },
);

export const fetchTeacherSubjects = createAsyncThunk(
    "classes/fetchTeacherSubjects",
    async (teacherId: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get(`/academic/teachers/${teacherId}/subjects`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch teacher subjects",
            );
        }
    },
);

export const fetchEnrollments = createAsyncThunk(
    "classes/fetchEnrollments",
    async (classId: string, { dispatch }) => {
        try {
            const response = await api.get("/academic/enrollments", {
                params: { class_id: classId },
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            throw error;
        }
    },
);

export const fetchTeacherAssignments = createAsyncThunk(
    "classes/fetchTeacherAssignments",
    async (classId: string, { dispatch }) => {
        try {
            const response = await api.get("/academic/teacher-assignments", {
                params: { class_id: classId },
            });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            throw error;
        }
    },
);

export const fetchClassSchedules = createAsyncThunk(
    "classes/fetchClassSchedules",
    async (classId: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get(`/schedules/aggregated/${classId}`);
            return response.data.items;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Something went wrong",
            );
        }
    },
);




export const fetchAvailableStudents = createAsyncThunk(
    "classes/fetchAvailableStudents",
    async (params: { page?: number; search?: string } | void, { rejectWithValue, dispatch }) => {
        try {
            const queryParams: Record<string, any> = {
                role: "student",
                limit: 20,
                page: params?.page || 1,
            };
            if (params?.search) {
                queryParams.search = params.search;
            }
            const response = await api.get("/users", {
                params: queryParams,
            });
            return { ...response.data, _page: params?.page || 1 };
        } catch (error: any) {
            if (error.response?.status === 401) dispatch(logout());
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch available students",
            );
        }
    },
);

export const enrollStudent = createAsyncThunk(
    "classes/enrollStudent",
    async (data: EnrollStudentRequest, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/academic/enrollments", data);
            toast.success("Student enrolled successfully");
            dispatch(fetchEnrollments(data.class_id));
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) dispatch(logout());
            const errorMessage =
                error?.response?.data?.message || error.message || "Failed to enroll student";
            toast.error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
            return rejectWithValue(errorMessage);
        }
    },
);

export const unenrollStudent = createAsyncThunk(
    "classes/unenrollStudent",
    async (enrollment: any, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/academic/enrollments/${enrollment.id}`);
            toast.success("Student unenrolled successfully");
            dispatch(fetchEnrollments(enrollment.class_id));
            return enrollment.id;
        } catch (error: any) {
            if (error.response?.status === 401) dispatch(logout());
            const errorMessage =
                error?.response?.data?.message || error.message || "Failed to unenroll student";
            toast.error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
            return rejectWithValue(errorMessage);
        }
    },
);

export const assignTeacher = createAsyncThunk(
    "classes/assignTeacher",
    async (data: AssignTeacherRequest, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/academic/teacher-assignments", data);
            toast.success("Teacher assigned successfully");
            dispatch(fetchTeacherAssignments(data.class_id));
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) dispatch(logout());
            const errorMessage =
                error?.response?.data?.message || error.message || "Failed to assign teacher";
            toast.error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
            return rejectWithValue(errorMessage);
        }
    },
);

export const unassignTeacher = createAsyncThunk(
    "classes/unassignTeacher",
    async (assignment: any, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/academic/teacher-assignments/${assignment.id}`);
            toast.success("Teacher unassigned successfully");
            dispatch(fetchTeacherAssignments(assignment.class_id));
            return assignment.id;
        } catch (error: any) {
            if (error.response?.status === 401) dispatch(logout());
            const errorMessage =
                error?.response?.data?.message || error.message || "Failed to unassign teacher";
            toast.error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
            return rejectWithValue(errorMessage);
        }
    },
);
