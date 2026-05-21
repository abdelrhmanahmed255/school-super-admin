import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardState } from "./types";
import { fetchDashboardStats, fetchAnalyticsStats } from "./thunks";

const initialState: DashboardState = {
  stats: {
    total_schools: 0,
    total_users: 0,
    system_health: "unknown",
    activeSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeTeachers: 0,
  },
  analytics: null,
  recentActivities: [],
  loading: false,
  error: null,
  analyticsFilters: {
    period: "month",
    class_id: "all",
    subject_id: "all",
  },
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setAnalyticsFilters: (
      state,
      action: PayloadAction<{
        period?: string;
        class_id?: string;
        subject_id?: string;
      }>,
    ) => {
      state.analyticsFilters = {
        ...state.analyticsFilters,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Dashboard Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload?.data || action.payload;
        state.stats = {
          total_schools: data?.total_schools ?? data?.totalSchools ?? 0,
          total_users: data?.total_users ?? data?.totalUsers ?? 0,
          system_health: data?.system_health ?? data?.systemHealth ?? "unknown",
          activeSchools: data?.activeSchools ?? 0,
          totalStudents: data?.total_students ?? data?.totalStudents ?? 0,
          totalTeachers: data?.total_teachers ?? data?.totalTeachers ?? 0,
          activeTeachers: data?.active_teachers ?? data?.activeTeachers ?? 0,
        };
        state.recentActivities = data?.recentActivities ?? [];
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Analytics Stats
      .addCase(fetchAnalyticsStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalyticsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload?.data || action.payload;
      })
      .addCase(fetchAnalyticsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAnalyticsFilters } = dashboardSlice.actions;
export default dashboardSlice.reducer;
