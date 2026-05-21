import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdmissionsState, AdmissionStatus } from "./types";
import {
  fetchAdmissionApplications,
  fetchAdmissionApplicationById,
  updateAdmissionApplication,
} from "./thunks";

const initialState: AdmissionsState = {
  applications: [],
  applicationDetail: null,
  loading: false,
  detailLoading: false,
  updateLoading: false,
  error: null,
  detailError: null,
  updateError: null,
  count: 0,
  totalPages: 1,
  currPage: 1,
  pageSize: 20,
  search: "",
  statusFilter: "all",
  sort_by: "created_at",
  order: "desc",
};

const admissionsSlice = createSlice({
  name: "admissions",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currPage = 1;
    },
    setStatusFilter: (
      state,
      action: PayloadAction<AdmissionStatus | "all">,
    ) => {
      state.statusFilter = action.payload;
      state.currPage = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sort_by: string; order: "asc" | "desc" }>,
    ) => {
      state.sort_by = action.payload.sort_by;
      state.order = action.payload.order;
      state.currPage = 1;
    },
    setCurrPage: (state, action: PayloadAction<number>) => {
      state.currPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currPage = 1;
    },
    clearApplicationDetail: (state) => {
      state.applicationDetail = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmissionApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmissionApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.items;
        state.count = action.payload.total;
        state.totalPages = action.payload.pages;
      })
      .addCase(fetchAdmissionApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAdmissionApplicationById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.applicationDetail = null;
      })
      .addCase(fetchAdmissionApplicationById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.applicationDetail = action.payload;
      })
      .addCase(fetchAdmissionApplicationById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
        state.applicationDetail = null;
      })
      .addCase(updateAdmissionApplication.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateAdmissionApplication.fulfilled, (state, action) => {
        state.updateLoading = false;
        const updated = action.payload;
        const id = updated.id;
        state.applications = state.applications.map((a) =>
          a.id === id ? { ...a, ...updated } : a,
        );
        if (state.applicationDetail?.id === id) {
          state.applicationDetail = { ...state.applicationDetail, ...updated };
        }
      })
      .addCase(updateAdmissionApplication.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

export const {
  setSearch,
  setStatusFilter,
  setSorting,
  setCurrPage,
  setPageSize,
  clearApplicationDetail,
} = admissionsSlice.actions;

export default admissionsSlice.reducer;
