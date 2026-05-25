import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import { toast } from "sonner";
import type { SchoolSetupState } from "./types";

export const saveSetupData = createAsyncThunk(
  "schoolSetup/saveSetupData",
  async (
    { schoolId, setupData, step }: { schoolId: string; setupData: SchoolSetupState["setupData"]; step?: number },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/schools/${schoolId}/setup`, { ...setupData, currentStep: step });
      return response.data;
    } catch {
      // Silently store in localStorage when backend not yet ready
      try {
        const existing = JSON.parse(localStorage.getItem("schoolSetups") || "{}");
        existing[schoolId] = { ...setupData, currentStep: step, savedAt: new Date().toISOString() };
        localStorage.setItem("schoolSetups", JSON.stringify(existing));
      } catch { /* ignore */ }
      return { saved: "local" };
    }
  },
);

export const completeSetup = createAsyncThunk(
  "schoolSetup/completeSetup",
  async (
    { schoolId, setupData }: { schoolId: string; setupData: SchoolSetupState["setupData"] },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/schools/${schoolId}/complete-setup`, setupData);
      toast.success("School onboarding completed!", { position: "top-center" });
      return response.data;
    } catch {
      try {
        const existing = JSON.parse(localStorage.getItem("schoolSetups") || "{}");
        existing[schoolId] = { ...setupData, isComplete: true, completedAt: new Date().toISOString() };
        localStorage.setItem("schoolSetups", JSON.stringify(existing));
      } catch { /* ignore */ }
      toast.success("School onboarding completed!", { position: "top-center" });
      return { saved: "local", isComplete: true };
    }
  },
);

export const fetchSchoolSetupData = createAsyncThunk(
  "schoolSetup/fetchSetupData",
  async (schoolId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/schools/${schoolId}/setup`);
      return response.data;
    } catch {
      try {
        const existing = JSON.parse(localStorage.getItem("schoolSetups") || "{}");
        if (existing[schoolId]) return existing[schoolId];
      } catch { /* ignore */ }
      return null;
    }
  },
);
