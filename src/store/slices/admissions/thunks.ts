import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../userSlice/slice";
import { RootState } from "@/store";
import qs from "qs";
import { toast } from "sonner";
import { AdmissionApplication, UpdateAdmissionRequest } from "./types";

function normalizeListPayload(data: Record<string, unknown>) {
  const items = (data.items ?? data.data ?? []) as AdmissionApplication[];
  const total = Number(data.total ?? data.count ?? 0);
  const pages = Number(data.pages ?? data.total_pages ?? 1) || 1;
  return { items, total, pages };
}

export const fetchAdmissionApplications = createAsyncThunk(
  "admissions/fetchAdmissionApplications",
  async (
    filters:
      | {
          search?: string;
          status?: string;
          sort_by?: string;
          order?: "asc" | "desc";
          page?: number;
          limit?: number;
        }
      | void,
    { rejectWithValue, dispatch, getState },
  ) => {
    const state = (getState() as RootState).admissions;

    const params: Record<string, string | number | undefined> = {
      search: filters?.search ?? state.search,
      status:
        (filters?.status ?? state.statusFilter) === "all"
          ? undefined
          : filters?.status ?? state.statusFilter,
      sort_by: filters?.sort_by ?? state.sort_by,
      order: filters?.order ?? state.order,
      page: filters?.page ?? state.currPage,
      limit: filters?.limit ?? state.pageSize,
    };

    Object.keys(params).forEach((key) => {
      const val = params[key];
      if (val === "" || val === undefined || val === null) {
        delete params[key];
      }
    });

    try {
      const response = await api.get("/admissions/applications", {
        params,
        paramsSerializer: (query) =>
          qs.stringify(query, { arrayFormat: "comma" }),
      });
      const normalized = normalizeListPayload(
        response.data as Record<string, unknown>,
      );
      return normalized;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 401) {
        dispatch(logout());
      }
      const errorMessage =
        err?.response?.data?.message ||
        (error instanceof Error ? error.message : null) ||
        "Failed to load applications";
      return rejectWithValue(
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
      );
    }
  },
);

export const fetchAdmissionApplicationById = createAsyncThunk(
  "admissions/fetchAdmissionApplicationById",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/admissions/applications/${id}`);
      return response.data as AdmissionApplication;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 401) {
        dispatch(logout());
      }
      const errorMessage =
        err?.response?.data?.message ||
        (error instanceof Error ? error.message : null) ||
        "Failed to load application";
      return rejectWithValue(
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
      );
    }
  },
);

export const updateAdmissionApplication = createAsyncThunk(
  "admissions/updateAdmissionApplication",
  async (
    { id, body }: { id: string; body: UpdateAdmissionRequest },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.patch(`/admissions/applications/${id}`, body);
      toast.success("Application updated");
      const data = response.data;
      if (data && typeof data === "object") {
        return data as AdmissionApplication;
      }
      return { id, ...body } as AdmissionApplication;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string } } };
      if (err.response?.status === 401) {
        dispatch(logout());
      }
      const errorMessage =
        err?.response?.data?.message ||
        (error instanceof Error ? error.message : null) ||
        "Update failed";
      toast.error(
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
      );
      return rejectWithValue(
        typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage),
      );
    }
  },
);
