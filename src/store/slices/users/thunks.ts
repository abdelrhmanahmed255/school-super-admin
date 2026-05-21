/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import qs from "qs";
import { logout } from "../userSlice/slice";
import { toast } from "sonner";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UsersState,
} from "./types";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    filters: {
      search?: string;
      status?: string;
      role?: string;
      stage_id?: string;
      grade_level_id?: string;
      class_id?: string;
      gender?: string;
      sort_by?: string;
      order?: "asc" | "desc";
      page?: number;
      limit?: number;
    } | void,
    { rejectWithValue, getState, dispatch },
  ) => {
    const state = (getState() as RootState).users;

    const params = {
      search: filters?.search ?? state.search,
      status: filters?.status ?? state.status,
      role: filters?.role ?? state.role,
      stage_id: filters?.stage_id ?? state.stage_id,
      grade_level_id: filters?.grade_level_id ?? state.grade_level_id,
      class_id: filters?.class_id ?? state.class_id,
      gender: filters?.gender ?? state.gender,
      sort_by: filters?.sort_by ?? state.sort_by,
      order: filters?.order ?? state.order,
      page: filters?.page ?? state.currPage,
      limit: filters?.limit ?? state.pageSize,
    };

    // Clean up empty values and "all"/"All" values
    Object.keys(params).forEach((key) => {
      const val = (params as any)[key];
      if (
        val === "all" ||
        val === "All" ||
        val === "" ||
        val === undefined ||
        (Array.isArray(val) && val.length === 0)
      ) {
        delete (params as any)[key];
      }
    });

    try {
      const response = await api.get("/users", {
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

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/users/${id}`);
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

export const fetchTeacherDetailById = createAsyncThunk(
  "users/fetchTeacherDetailById",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/users/teachers/${id}/detail`);
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

export const fetchStudentDetailById = createAsyncThunk(
  "users/fetchStudentDetailById",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/users/students/${id}/detail`);
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

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: CreateUserRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/users", userData);
      toast.success("User created successfully");
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

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { id, userData }: { id: string; userData: UpdateUserRequest },
    { rejectWithValue, dispatch },
  ) => {
    try {
      // Clean up empty values
      const payload: any = { ...userData };
      Object.keys(payload).forEach((key) => {
        if (
          payload[key] === "" ||
          payload[key] === null ||
          payload[key] === undefined
        ) {
          delete payload[key];
        }
      });

      const response = await api.patch(`/users/${id}`, payload);
      toast.success("User updated successfully");
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

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
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
