/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import { logout } from "../../userSlice/slice";
import {
    CreateQuestionPayload,
    UpdateQuestionPayload,
    FetchQuestionsParams,
} from "./types";

export const fetchQuestions = createAsyncThunk(
    "questionBank/fetchQuestions",
    async (params: FetchQuestionsParams, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get("/question-bank", { params });
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch questions",
            );
        }
    },
);

export const fetchQuestionById = createAsyncThunk(
    "questionBank/fetchQuestionById",
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.get(`/question-bank/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch question",
            );
        }
    },
);

export const createQuestion = createAsyncThunk(
    "questionBank/createQuestion",
    async (data: CreateQuestionPayload, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post("/question-bank", data);
            toast.success("Question created successfully");
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 401) {
                dispatch(logout());
            }
            toast.error(
                error?.response?.data?.message || "Failed to create question",
            );
            return rejectWithValue(error?.response?.data?.message);
        }
    },
);

export const updateQuestion = createAsyncThunk(
    "questionBank/updateQuestion",
    async (
        { id, data }: UpdateQuestionPayload,
        { rejectWithValue, dispatch },
    ) => {
        try {
            const response = await api.put(`/question-bank/${id}`, data);
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
    "questionBank/deleteQuestion",
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            await api.delete(`/question-bank/${id}`);
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
