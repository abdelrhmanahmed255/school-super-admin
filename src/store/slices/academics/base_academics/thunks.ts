/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { logout } from "../../userSlice/slice";

export const fetchAcademicSubjects = createAsyncThunk(
  "baseAcademics/fetchAcademicSubjects",
  async (
    params:
      | {
          page?: number;
          limit?: number;
          search?: string;
        }
      | void,
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.get("/academic/subjects", {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 20,
          ...(params?.search ? { search: params.search } : {}),
        },
      });
      return {
        ...response.data,
        _page: params?.page || 1,
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch subjects",
      );
    }
  },
);
