/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { logout } from "../userSlice/slice";

export const fetchTeacherStatistics = createAsyncThunk(
  "teachersStatistics/fetchTeacherStatistics",
  async (teacherId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(
        `/teacher-statistics/teachers/${teacherId}/statistics`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch teacher statistics",
      );
    }
  },
);

export const fetchTeacherCommunicationTrend = createAsyncThunk(
  "teachersStatistics/fetchTeacherCommunicationTrend",
  async (teacherId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(
        `/teacher-statistics/teachers/${teacherId}/communications/trend`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch teacher communications trend",
      );
    }
  },
);

export const fetchTeacherAttendanceStatistics = createAsyncThunk(
  "teachersStatistics/fetchTeacherAttendanceStatistics",
  async (teacherId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(
        `/teacher-statistics/teachers/${teacherId}/attendance/statistics`,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error?.response?.data?.message ||
          "Failed to fetch teacher attendance statistics",
      );
    }
  },
);
