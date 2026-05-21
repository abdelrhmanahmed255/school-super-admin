import api from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "../userSlice/slice";
import { RootState } from "@/store";
import qs from "qs";
import { toast } from "sonner";
import { UpdateFamilyRequest } from "./types";


export const fetchFamilies = createAsyncThunk(
  "families/fetchFamilies",
  async (
    filters:
      | {
          search?: string;
          sort_by?: string;
          order?: "asc" | "desc";
          page?: number;
          limit?: number;
        }
      | void,
    { rejectWithValue, dispatch, getState },
  ) => {
    const state = (getState() as RootState).families;

    const params = {
      search: filters?.search ?? state.search,
      sort_by: filters?.sort_by ?? state.sort_by,
      order: filters?.order ?? state.order,
      page: filters?.page ?? state.currPage,
      limit: filters?.limit ?? state.pageSize,
    };

    Object.keys(params).forEach((key) => {
      const val = (params as Record<string, unknown>)[key];
      if (val === "" || val === undefined || val === null) {
        delete (params as Record<string, unknown>)[key];
      }
    });

    try {
      const response = await api.get("/families", {
        params,
        paramsSerializer: (query) =>
          qs.stringify(query, { arrayFormat: "comma" }),
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

export const fetchFamilyById = createAsyncThunk(
  "families/fetchFamilyById",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/families/${id}`);
      return response.data?.item ?? response.data;
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

export const updateFamily = createAsyncThunk(
  "families/updateFamily",
  async (
    { id, familyData }: { id: string; familyData: UpdateFamilyRequest },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const payload: Record<string, unknown> = { ...familyData };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === null || payload[key] === undefined) {
          delete payload[key];
        }
      });

      const response = await api.patch(`/families/${id}`, payload);
      toast.success("Family updated successfully");
      return response.data?.item ?? response.data;
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

export const deleteFamily = createAsyncThunk(
  "families/deleteFamily",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/families/${id}`);
      toast.success("Family deleted successfully");
      dispatch(fetchFamilies());
      return response.data?.id;
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