/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import { logout } from "../../userSlice/slice";
import {
  CreateLessonMediaPayload,
  CreateLessonPayload,
  CreateBookPayload,
  CreateUnitPayload,
  FetchBooksParams,
  UpdateLessonPayload,
  UpdateBookPayload,
  UpdateUnitPayload,
} from "./types";

const BASE_URL = "/curriculum/syllabus";

const handleError = (error: any, dispatch: any, rejectWithValue?: any, toast?: any) => {
  if (error?.response?.status === 401) {
    dispatch(logout());
  }
  toast?.error(error?.response?.data?.message || "Failed to fetch data");
  return rejectWithValue ? rejectWithValue(error?.response?.data?.message || "Failed to fetch data") : error?.response?.data?.message || "Failed to fetch data";
};

export const fetchBooks = createAsyncThunk(
  "curriculumsSyllabus/fetchBooks",
  async (params: FetchBooksParams | void, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${BASE_URL}/books`, { params });
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue);
    }
  },
);

export const fetchBookById = createAsyncThunk(
  "curriculumsSyllabus/fetchBookById",
  async (bookId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${BASE_URL}/books/${bookId}`);
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue);
    }
  },
);

export const createBook = createAsyncThunk(
  "curriculumsSyllabus/createBook",
  async (data: CreateBookPayload, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`${BASE_URL}/books`, data);
      toast.success("Book created successfully");
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const updateBook = createAsyncThunk(
  "curriculumsSyllabus/updateBook",
  async (
    { bookId, data }: { bookId: string; data: UpdateBookPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const payload: Record<string, unknown> = { ...data };
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && !value.trim())
        ) {
          delete payload[key];
        }
      });

      const response = await api.patch(`${BASE_URL}/books/${bookId}`, payload);
      toast.success("Book updated successfully");
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const deleteBook = createAsyncThunk(
  "curriculumsSyllabus/deleteBook",
  async (bookId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`${BASE_URL}/books/${bookId}`);
      toast.success("Book deleted successfully");
      return bookId;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const fetchBookLessonRange = createAsyncThunk(
  "curriculumsSyllabus/fetchBookLessonRange",
  async (bookId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${BASE_URL}/books/${bookId}/lesson-range`);
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const fetchBookUnits = createAsyncThunk(
  "curriculumsSyllabus/fetchBookUnits",
  async (bookId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${BASE_URL}/books/${bookId}/units`);
      return { bookId, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const createUnit = createAsyncThunk(
  "curriculumsSyllabus/createUnit",
  async (
    { bookId, data }: { bookId: string; data: CreateUnitPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post(`${BASE_URL}/books/${bookId}/units`, data);
      toast.success("Unit created successfully");
      return { bookId, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const updateUnit = createAsyncThunk(
  "curriculumsSyllabus/updateUnit",
  async (
    { unitId, data }: { unitId: string; data: UpdateUnitPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.patch(`${BASE_URL}/units/${unitId}`, data);
      toast.success("Unit updated successfully");
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const deleteUnit = createAsyncThunk(
  "curriculumsSyllabus/deleteUnit",
  async (unitId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`${BASE_URL}/units/${unitId}`);
      toast.success("Unit deleted successfully");
      return unitId;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const reorderBookUnits = createAsyncThunk(
  "curriculumsSyllabus/reorderBookUnits",
  async (
    { bookId, unitIds }: { bookId: string; unitIds: string[] },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.put(
        `${BASE_URL}/books/${bookId}/units/reorder`,
        unitIds,
      );
      toast.success("Units reordered successfully");
      return { bookId, unitIds, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const createBookLesson = createAsyncThunk(
  "curriculumsSyllabus/createBookLesson",
  async (
    { bookId, data }: { bookId: string; data: CreateLessonPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post(`${BASE_URL}/books/${bookId}/lessons`, data);
      toast.success("Lesson created successfully");
      return { bookId, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const createUnitLesson = createAsyncThunk(
  "curriculumsSyllabus/createUnitLesson",
  async (
    { unitId, data }: { unitId: string; data: CreateLessonPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post(`${BASE_URL}/units/${unitId}/lessons`, data);
      
      toast.success("Lesson created successfully");
      return { unitId, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const updateLesson = createAsyncThunk(
  "curriculumsSyllabus/updateLesson",
  async (
    { lessonId, data }: { lessonId: string; data: UpdateLessonPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.patch(`${BASE_URL}/lessons/${lessonId}`, data);
      toast.success("Lesson updated successfully");
      return response.data;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const deleteLesson = createAsyncThunk(
  "curriculumsSyllabus/deleteLesson",
  async (lessonId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`${BASE_URL}/lessons/${lessonId}`);
      toast.success("Lesson deleted successfully");
      return lessonId;
    } catch (error: any) {
        return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const reorderUnitLessons = createAsyncThunk(
  "curriculumsSyllabus/reorderUnitLessons",
  async (
    { unitId, lessonIds }: { unitId: string; lessonIds: string[] },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.put(
        `${BASE_URL}/units/${unitId}/lessons/reorder`,
        lessonIds,
      );
      toast.success("Lessons reordered successfully");
      return { unitId, lessonIds, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const fetchLessonMedia = createAsyncThunk(
  "curriculumsSyllabus/fetchLessonMedia",
  async (lessonId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`${BASE_URL}/lessons/${lessonId}/media`);
      return { lessonId, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue);
    }
  },
);

export const createLessonMedia = createAsyncThunk(
  "curriculumsSyllabus/createLessonMedia",
  async (
    { lessonId, data }: { lessonId: string; data: CreateLessonMediaPayload },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post(`${BASE_URL}/lessons/${lessonId}/media`, data);
      toast.success("Lesson media added successfully");
      return { lessonId, data: response.data };
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);

export const deleteMedia = createAsyncThunk(
  "curriculumsSyllabus/deleteMedia",
  async (mediaId: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`${BASE_URL}/media/${mediaId}`);
      toast.success("Media deleted successfully");
      return mediaId;
    } catch (error: any) {
      return handleError(error, dispatch, rejectWithValue, toast);
    }
  },
);
