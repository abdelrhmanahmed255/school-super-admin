/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersState } from "./types";
import {
  fetchUsers,
  fetchUserById,
  fetchTeacherDetailById,
  fetchStudentDetailById,
  createUser,
  updateUser,
  deleteUser,
} from "./thunks";

const initialState: UsersState = {
  users: [],
  currentUser: null,
  teacherDetail: null,
  studentDetail: null,
  loading: false,
  error: null,
  count: 0,
  totalPages: 1,
  currPage: 1,
  pageSize: 20,
  search: "",
  status: "All",
  role: "All",
  stage_id: "All",
  grade_level_id: "All",
  class_id: "All",
  gender: "All",
  sort_by: "created_at",
  order: "desc",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.currPage = 1;
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.currPage = 1;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
      state.currPage = 1;
    },
    setStage: (state, action: PayloadAction<string>) => {
      state.stage_id = action.payload;
      state.currPage = 1;
    },
    setGradeLevel: (state, action: PayloadAction<string>) => {
      state.grade_level_id = action.payload;
      state.currPage = 1;
    },
    setClassId: (state, action: PayloadAction<string>) => {
      state.class_id = action.payload;
      state.currPage = 1;
    },
    setGender: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
      state.currPage = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sort_by: string; order: "asc" | "desc" }>,
    ) => {
      state.sort_by = action.payload.sort_by;
      state.order = action.payload.order;
    },
    setCurrPage: (state, action: PayloadAction<number>) => {
      state.currPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currPage = 1;
    },
    clearFilters: (state) => {
      state.search = "";
      state.status = "All";
      state.role = "All";
      state.stage_id = "All";
      state.grade_level_id = "All";
      state.class_id = "All";
      state.gender = "All";
      state.currPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.items;
        state.count = action.payload.total;
        state.totalPages = action.payload.pages || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User By Id
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Teacher Detail By Id
      .addCase(fetchTeacherDetailById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teacherDetail = null;
      })
      .addCase(fetchTeacherDetailById.fulfilled, (state, action) => {
        state.loading = false;
        state.teacherDetail = action.payload;
      })
      .addCase(fetchTeacherDetailById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.teacherDetail = null;
      })
      // Fetch Student Detail By Id
      .addCase(fetchStudentDetailById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.studentDetail = null;
      })
      .addCase(fetchStudentDetailById.fulfilled, (state, action) => {
        state.loading = false;
        state.studentDetail = action.payload;
      })
      .addCase(fetchStudentDetailById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.studentDetail = null;
      })
      // Create User
      .addCase(createUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = [action.payload, ...state.users];
          state.count += 1;
        }
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        if (!updatedUser) return;

        state.users = state.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        );
        if (state.currentUser?.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }
        if (state.teacherDetail?.id === updatedUser.id) {
          state.teacherDetail = { ...state.teacherDetail, ...updatedUser };
        }
        if (state.studentDetail?.id === updatedUser.id) {
          state.studentDetail = { ...state.studentDetail, ...updatedUser };
        }
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.users = state.users.filter((user) => user.id !== deletedId);
        state.count -= 1;
      });
  },
});

export const {
  setSearch,
  setStatus,
  setRole,
  setStage,
  setGradeLevel,
  setClassId,
  setGender,
  setSorting,
  setCurrPage,
  setPageSize,
  clearFilters,
} = usersSlice.actions;

export default usersSlice.reducer;
