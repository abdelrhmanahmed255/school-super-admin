/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { BaseAcademicsState } from "./types";
import { fetchAcademicSubjects } from "./thunks";

const initialState: BaseAcademicsState = {
  subjects: [],
  subjectsLoading: false,
  subjectsError: null,
  subjectsPage: 1,
  subjectsTotalPages: 1,
};

const baseAcademicsSlice = createSlice({
  name: "baseAcademics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAcademicSubjects.pending, (state) => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })
      .addCase(fetchAcademicSubjects.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        const page = action.payload._page || action.payload.page || 1;
        const normalized = (action.payload.items || []).map((s: any) => ({
          id: String(s.id),
          name: s.name || s.name_en || s.name_ar || "",
          name_ar: s.name_ar || s.title_ar || "",
          name_en: s.name_en || s.title_en || s.name || "",
        }));

        if (page === 1) {
          state.subjects = normalized;
        } else {
          const existingIds = new Set(state.subjects.map((i) => i.id));
          const merged = normalized.filter((i: any) => !existingIds.has(i.id));
          state.subjects = [...state.subjects, ...merged];
        }

        state.subjectsPage = page;
        state.subjectsTotalPages = action.payload.pages || 1;
      })
      .addCase(fetchAcademicSubjects.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload as string;
      });
  },
});

export default baseAcademicsSlice.reducer;
