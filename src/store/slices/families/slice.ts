import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FamiliesState } from "./types";
import { deleteFamily, fetchFamilies, fetchFamilyById, updateFamily } from "./thunks";


const initialState: FamiliesState = {
    families: [],
    familyDetail: null,
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
    sort_by: "created_at",
    order: "desc",
};

const familiesSlice = createSlice({
    name: "families",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
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
        clearFilters: (state) => {
            state.search = "";
            state.currPage = 1;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFamilies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFamilies.fulfilled, (state, action) => {
                state.loading = false;
                state.families = action.payload.items;
                state.count = action.payload.total;
                state.totalPages = action.payload.pages || 1;
            })
            .addCase(fetchFamilies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchFamilyById.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
                state.familyDetail = null;
            })
            .addCase(fetchFamilyById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.familyDetail = action.payload;
            })
            .addCase(fetchFamilyById.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload as string;
                state.familyDetail = null;
            })
            .addCase(updateFamily.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })
            .addCase(updateFamily.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.familyDetail = action.payload;
                state.families = state.families.map((family) =>
                    family.id === action.payload.id ? action.payload : family,
                );
            })
            .addCase(updateFamily.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload as string;
            })
            .addCase(deleteFamily.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFamily.fulfilled, (state, action) => {
                state.loading = false;
                state.families = state.families.filter((family) => family.id !== action.payload);
            })
            .addCase(deleteFamily.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
  setSearch,
  setSorting,
  setCurrPage,
  setPageSize,
  clearFilters,
} = familiesSlice.actions;

export default familiesSlice.reducer;