/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { logout } from "../userSlice/slice";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/dashboard");
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

export const fetchAnalyticsStats = createAsyncThunk(
  "dashboard/fetchAnalyticsStats",
  async (
    filters: { period?: string; class_id?: string; subject_id?: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.get("/dashboard/analytics", {
        params: filters,
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
