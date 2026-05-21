/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import { logout } from "../../userSlice/slice";
import { UploadContentPayload, UpdateContentPayload } from "./types";
export const fetchSubjects = createAsyncThunk(
  "curriculums/fetchSubjects",
  async (
    { gradeId, semesterId }: { gradeId: string; semesterId: number | string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.get(`/curriculum/grades/${gradeId}/subjects`, {
        params: { semester_id: semesterId },
      });
      return response.data;
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

export const fetchCurriculumContent = createAsyncThunk(
  "curriculums/fetchCurriculumContent",
  async (
    {
      subjectId,
      gradeId,
      semesterId,
    }: { subjectId: string; gradeId: string; semesterId: number | string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.get(
        `/curriculum/subjects/${subjectId}/grades/${gradeId}/content`,
        { params: { semester_id: semesterId } },
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch curriculum content",
      );
    }
  },
);

// Question operations
export const createQuestion = createAsyncThunk(
  "curriculums/createQuestion",
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/curriculum/questions", data);
      toast.success("Question added successfully");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(error?.response?.data?.message || "Failed to add question");
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const updateQuestion = createAsyncThunk(
  "curriculums/updateQuestion",
  async (
    { id, data }: { id: string; data: any },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.patch(`/curriculum/questions/${id}`, data);
      toast.success("Question updated successfully");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(
        error?.response?.data?.message || "Failed to update question",
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const deleteQuestion = createAsyncThunk(
  "curriculums/deleteQuestion",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/curriculum/questions/${id}`);
      toast.success("Question deleted successfully");
      return id;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(
        error?.response?.data?.message || "Failed to delete question",
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

// Resource operations (Files/Videos)
export const createResource = createAsyncThunk(
  "curriculums/createResource",
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/curriculum/content", data);
      toast.success("Resource added successfully");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(error?.response?.data?.message || "Failed to add resource");
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const deleteResource = createAsyncThunk(
  "curriculums/deleteResource",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/curriculum/content/${id}`);
      toast.success("Resource deleted successfully");
      return id;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(
        error?.response?.data?.message || "Failed to delete resource",
      );
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const fetchContentFileUrl = createAsyncThunk(
  "curriculums/fetchContentFileUrl",
  async (contentId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/curriculum/content/${contentId}/file-url`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(error?.response?.data?.message || "Failed to get file url");
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const downloadContent = createAsyncThunk(
  "curriculums/downloadContent",
  async (contentId: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/curriculum/content/${contentId}/download`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(error?.response?.data?.message || "Failed to register download");
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const uploadContent = createAsyncThunk(
  "curriculums/uploadContent",
  async (data: UploadContentPayload, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subject_id", data.subject_id);
      formData.append("grade_level_id", data.grade_level_id);
      formData.append("semester_id", String(data.semester_id));
      formData.append("content_type", data.content_type);
      if (data.partitioning_type) {
        formData.append("partitioning_type", data.partitioning_type);
      }

      if (data.title_ar?.trim()) {
        formData.append("title_ar", data.title_ar.trim());
      }
      if (data.description?.trim()) {
        formData.append("description", data.description.trim());
      }
      if (typeof data.is_official === "boolean") {
        formData.append("is_official", String(data.is_official));
      }
      if (data.file) {
        formData.append("file", data.file);
      }
      if (data.parts?.length) {
        formData.append("parts", JSON.stringify(data.parts));
      }

      const response = await api.post("/curriculum/content/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Content uploaded successfully");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(error?.response?.data?.message || "Failed to upload content");
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);

export const updateContent = createAsyncThunk(
  "curriculums/updateContent",
  async (
    { contentId, ...data }: UpdateContentPayload,
    { rejectWithValue, dispatch },
  ) => {
    try {
      const hasFile = data.file instanceof File;
      let response;

      if (hasFile) {
        const formData = new FormData();
        if (data.title?.trim()) formData.append("title", data.title.trim());
        if (data.title_ar?.trim()) formData.append("title_ar", data.title_ar.trim());
        if (data.description?.trim()) formData.append("description", data.description.trim());
        if (data.content_type) formData.append("content_type", data.content_type);
        if (data.semester_id !== undefined && data.semester_id !== null) {
          formData.append("semester_id", String(data.semester_id));
        }
        if (data.file) {
          formData.append("file", data.file);
        }
        response = await api.patch(`/curriculum/content/${contentId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
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
        response = await api.patch(`/curriculum/content/${contentId}`, payload);
      }

      toast.success("Content updated successfully");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        dispatch(logout());
      }
      toast.error(error?.response?.data?.message || "Failed to update content");
      return rejectWithValue(error?.response?.data?.message);
    }
  },
);
