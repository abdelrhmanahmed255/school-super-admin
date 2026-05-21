/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { RootState } from "@/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { logout } from "../userSlice/slice";

import qs from "qs";
import { toast } from "sonner";

//function to get all schools from backend
export const fetchSchools = createAsyncThunk(
  "schools/fetchSchools",
  async (
    {
      page = 1,
      append = false,
    }: {
      page?: number;
      append?: boolean;
    },
    { rejectWithValue, getState, dispatch },
  ) => {
    const { pageSize, searchName, statusFilter } = (getState() as RootState)
      .schools;

    const params = {
      limit: pageSize,
      page,
      search: searchName || undefined,
      status: statusFilter !== "All" ? statusFilter.toLowerCase() : undefined,
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
      const response = await api.get("/schools", {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "comma" }),
      });

      return {
        data: response.data.items,
        pagination: {
          limit: response.data.limit,
          page: response.data.page,
          pages: response.data.pages,
          total: response.data.total,
        },
        append,
      };
    } catch (error: any) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(message);
    }
  },
);

export const fetchSchoolById = createAsyncThunk(
  "schools/fetchSchoolById",
  async (id: string | number, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/schools/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        // showToast({
        //   message:
        //     error.response?.data?.message ||
        //     "You do not have any access to do this action",
        //   type: "error",
        // });
      }
      if (error?.response?.status === 401) {
        dispatch(logout());
        // window.location.href = "/login";
      }
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  },
);

export const editSchool = createAsyncThunk(
  "schools/editSchool",
  async (
    prams: {
      id: string;
      name?: string;
      code?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      phone?: string;
      email?: string;
      website?: string;
      timezone?: string;
    },
    { rejectWithValue, dispatch, getState },
  ) => {
    const params = {
      name: prams?.name || undefined,
      code: prams?.code || undefined,
      address: prams?.address || undefined,
      city: prams?.city || undefined,
      state: prams?.state || undefined,
      country: prams?.country || undefined,
      phone: prams?.phone || undefined,
      email: prams?.email || undefined,
      website: prams?.website || undefined,
      timezone: prams?.timezone || undefined,
    };

    try {
      const response = await api.patch(`/schools/${prams.id}`, params);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        // showToast({
        //   message:
        //     error.response?.data?.message ||
        //     "You do not have any access to do this action",
        //   type: "error",
        // });
      }
      if (error?.response?.status === 401) {
        dispatch(logout());
        // window.location.href = "/login";
      }
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  },
);
export const createSchool = createAsyncThunk(
  "schools/createSchool",
  async (
    prams: {
      name?: string;
      code?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      phone?: string;
      email?: string;
      website?: string;
      timezone?: string;
    },
    { rejectWithValue, dispatch, getState },
  ) => {
    const params = {
      name: prams?.name || undefined,
      code: prams?.code || undefined,
      address: prams?.address || undefined,
      city: prams?.city || undefined,
      state: prams?.state || undefined,
      country: prams?.country || undefined,
      phone: prams?.phone || undefined,
      email: prams?.email || undefined,
      website: prams?.website || undefined,
      timezone: prams?.timezone || undefined,
    };

    try {
      const response = await api.post("/schools", params);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        // showToast({
        //   message:
        //     error.response?.data?.message ||
        //     "You do not have any access to do this action",
        //   type: "error",
        // });
      }
      if (error.response?.status === 400) {
        const msg =
          error.response?.data?.message ||
          "You do not have any access to do this action";
        toast.error(typeof msg === "string" ? msg : JSON.stringify(msg), {
          position: "top-center",
        });
      }
      if (error?.response?.status === 401) {
        dispatch(logout());
        // window.location.href = "/login";
      }
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  },
);

export const deleteSchool = createAsyncThunk(
  "schools/deleteSchool",
  async (Id: string | number, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await api.delete(`/schools/${Id}`);

      if (response.status === 200) {
        return Id;
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }
      if (error.response?.status === 403) {
        // showToast({
        //   message:
        //     error.response?.data?.message ||
        //     "You do not have any access to do this action",
        //   type: "error",
        // });
      }
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchStatsSchools = createAsyncThunk(
  "schools/fetchStatsSchools",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await api.get("/schools/dashboard/stats");

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        const msg =
          error.response?.data?.message ||
          "You do not have any access to do this action";
        toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
      if (error.response?.status === 401) {
        dispatch(logout());
        // window.location.href = "/login";
      }
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue(errorMessage);
    }
  },
);
