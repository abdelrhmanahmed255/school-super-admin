import { createSlice } from "@reduxjs/toolkit";
import { TeachersStatisticsState } from "./types";
import {
  fetchTeacherAttendanceStatistics,
  fetchTeacherCommunicationTrend,
  fetchTeacherStatistics,
} from "./thunks";

const initialState: TeachersStatisticsState = {
  data: null,
  communicationsTrend: null,
  attendanceStatistics: null,
  loading: {
    main: false,
    communications: false,
    attendance: false,
  },
  error: {
    main: null,
    communications: null,
    attendance: null,
  },
};

const teachersStatisticsSlice = createSlice({
  name: "teachersStatistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherStatistics.pending, (state) => {
        state.loading.main = true;
        state.error.main = null;
      })
      .addCase(fetchTeacherStatistics.fulfilled, (state, action) => {
        state.loading.main = false;
        state.data = action.payload;
      })
      .addCase(fetchTeacherStatistics.rejected, (state, action) => {
        state.loading.main = false;
        state.error.main = action.payload as string;
      })
      .addCase(fetchTeacherCommunicationTrend.pending, (state) => {
        state.loading.communications = true;
        state.error.communications = null;
      })
      .addCase(fetchTeacherCommunicationTrend.fulfilled, (state, action) => {
        state.loading.communications = false;
        state.communicationsTrend = action.payload;
      })
      .addCase(fetchTeacherCommunicationTrend.rejected, (state, action) => {
        state.loading.communications = false;
        state.error.communications = action.payload as string;
      })
      .addCase(fetchTeacherAttendanceStatistics.pending, (state) => {
        state.loading.attendance = true;
        state.error.attendance = null;
      })
      .addCase(fetchTeacherAttendanceStatistics.fulfilled, (state, action) => {
        state.loading.attendance = false;
        state.attendanceStatistics = action.payload;
      })
      .addCase(fetchTeacherAttendanceStatistics.rejected, (state, action) => {
        state.loading.attendance = false;
        state.error.attendance = action.payload as string;
      });
  },
});

export default teachersStatisticsSlice.reducer;
