/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchSchools,
  deleteSchool,
  createSchool,
  fetchSchoolById,
  editSchool,
  fetchStatsSchools,
} from "./thunks";
import { School } from "./type";

interface SchoolsState {
  schools: School[];
  count: number;
  selectedSchools: string[];
  selectAllSchools: boolean;
  loading: boolean;
  loadingStats: boolean;
  error: string | null;
  currPage: string;
  pageSize: number;
  totalPages: number;
  lang: string;
  statsSchools: any;
  selectedMySchools: number[];
  searchName: string;
  statusFilter: string;
  profitValue: number;
  profitType: string;
}

const initialState: SchoolsState = {
  schools: [],
  count: 0,
  selectedSchools: [],
  selectAllSchools: false,
  loading: false,
  loadingStats: false,
  error: null,
  currPage: "1",
  pageSize: 20,
  totalPages: 1,
  lang: "ar", // ضبط اللغة الافتراضية
  selectedMySchools: [],
  statsSchools: {},
  searchName: "",
  statusFilter: "All",
  profitValue: 0,
  profitType: "percentage",
};

const schoolsSlice = createSlice({
  name: "schools",
  initialState,
  reducers: {
    setSchools: (state, action) => {
      state.schools = action.payload;
    },
    setSearchName: (state, action) => {
      state.searchName = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setCurrPage: (state, action) => {
      state.currPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // التعامل مع حالة الـ fetchSchools
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = false;

        const { data, pagination, append } = action.payload || {};

        if (append) {
          // ✅ في حالة "تحميل المزيد" نضيف البيانات الجديدة للبيانات الموجودة
          const newSchools = data ?? [];
          state.schools = [...state.schools, ...newSchools];
        } else {
          // ✅ في الحالة العادية نستبدل البيانات
          state.schools = data ?? [];
        }

        // ✅ نحافظ على باقي القيم من الـ pagination
        state.count = pagination?.total ?? 0;
        state.totalPages = pagination?.pages ?? 1;
        state.currPage = pagination?.page?.toString() ?? "1";
        state.pageSize = pagination?.limit ?? 10;

        state.selectedSchools = [];
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.schools = [];
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      // التعامل مع حذف منتج واحد
      .addCase(deleteSchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.schools = state.schools.filter(
          (supplier) => supplier.id.toString() !== action.meta.arg.toString(),
        );
        state.error = null;
        state.loading = false;
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(createSchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSchool.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(editSchool.pending, (state) => {})
      .addCase(editSchool.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(editSchool.rejected, (state, action) => {
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchSchoolById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSchoolById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchSchoolById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(fetchStatsSchools.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchStatsSchools.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.statsSchools = action.payload;
      })
      .addCase(fetchStatsSchools.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const {
  setSchools,
  setSearchName,
  setStatusFilter,
  setCurrPage,
  setPageSize,
} = schoolsSlice.actions;
export default schoolsSlice.reducer;
