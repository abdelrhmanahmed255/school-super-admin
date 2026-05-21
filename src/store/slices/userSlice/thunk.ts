/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { logout } from "./slice";

function toErrorString(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && "message" in value && typeof (value as { message: unknown }).message === "string") {
    return (value as { message: string }).message;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data: { email?: string; password?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", data);

      return response.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Invalid Email or Password";
      return rejectWithValue(toErrorString(msg));
    }
  },
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/logout", {});

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        toErrorString(error?.response?.data?.message ?? error?.message ?? "Logout failed"),
      );
    }
  },
);

export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (
    data: {
      email?: string;
      password?: string;
      name?: string;
      mobile?: string;
      mobileCode?: string;
      country?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/signup", data);

      return response.data.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Invalid Email or Password";
      return rejectWithValue(toErrorString(msg));
    }
  },
);
export const forgetPassword = createAsyncThunk(
  "user/forgetPassword",
  async (
    data: {
      email?: string;
      locale?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/forget-password", data);

      return response.data.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Invalid Email or Password";
      return rejectWithValue(toErrorString(msg));
    }
  },
);
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (
    data: {
      id?: string;
      password?: string;
      confirmPassword?: string;
      OTP?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/reset-password", data);

      return response.data.data;
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Invalid Email or Password";
      return rejectWithValue(toErrorString(msg));
    }
  },
);

export const fetchSubscription = createAsyncThunk(
  "user/fetchSubscription",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.get("/subscriptions/user");
      return data.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }
      console.error("Failed to fetch subscription:", error);
      const msg = error?.response?.data ?? error?.message ?? "Failed to fetch subscription";
      return rejectWithValue(toErrorString(msg));
    }
  },
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.patch("/users/edit", formData);

      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to update profile";
      return rejectWithValue(toErrorString(msg));
    }
  },
);

export const changeUserPassword = createAsyncThunk(
  "user/changeUserPassword",
  async (
    params: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post("/users/change-password", params);

      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }
      const msg =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to update profile";
      return rejectWithValue(toErrorString(msg));
    }
  },
);
export const fetchConnections = createAsyncThunk(
  "user/fetchConnections",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await api.get("/users/connections");
      return data.data;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }
      console.error("Failed to fetch subscription:", error);
      const msg = error?.response?.data ?? error?.message ?? "Failed to fetch connections";
      return rejectWithValue(toErrorString(msg));
    }
  },
);
