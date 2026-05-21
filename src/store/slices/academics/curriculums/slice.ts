import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchSubjects,
  fetchCurriculumContent,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createResource,
  downloadContent,
  deleteResource,
  fetchContentFileUrl,
  uploadContent,
  updateContent,
} from "./thunks";
import { CurriculumsState, CurriculumContent } from "./types";

const initialState: CurriculumsState = {
  subjects: [],
  currentContent: null,
  loading: false,
  error: null,
  semester_id: 1,
  current_grade_id: null,
};

const curriculumsSlice = createSlice({
  name: "curriculums",
  initialState,
  reducers: {
    setSemester: (state, action: PayloadAction<number>) => {
      state.semester_id = action.payload;
    },
    clearContent: (state) => {
      state.currentContent = null;
    },
    setGradeId: (state, action: PayloadAction<string>) => {
      state.current_grade_id = action.payload;
    },
  },
  extraReducers: (builder) => {
    const resolveResourceCategory = (resource: any) => {
      if (resource?.category) return resource.category;
      if (resource?.content_type === "teacher_video") return "teacher_video";
      if (
        resource?.content_type === "summary_resource" ||
        resource?.content_type === "summary"
      )
        return "summary";
      if (
        resource?.content_type === "official_curriculum" ||
        resource?.is_official
      )
        return "official";
      return "official";
    };

    // fetchSubjects
    builder.addCase(fetchSubjects.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSubjects.fulfilled, (state, action) => {
      state.loading = false;
      state.subjects = action.payload;
    });
    builder.addCase(fetchSubjects.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // fetchCurriculumContent
    builder.addCase(fetchCurriculumContent.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurriculumContent.fulfilled, (state, action) => {
      state.loading = false;
      state.currentContent = action.payload;
    });
    builder.addCase(fetchCurriculumContent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // createQuestion
    builder.addCase(createQuestion.fulfilled, (state, action) => {
      if (state.currentContent) {
        if (!state.currentContent.questions)
          state.currentContent.questions = [];
        state.currentContent.questions.push(action.payload);
      }
    });

    // updateQuestion
    builder.addCase(updateQuestion.fulfilled, (state, action) => {
      if (state.currentContent && state.currentContent.questions) {
        const index = state.currentContent.questions.findIndex(
          (q) => q.id === action.payload.id,
        );
        if (index !== -1) {
          state.currentContent.questions[index] = action.payload;
        }
      }
    });

    // deleteQuestion
    builder.addCase(deleteQuestion.fulfilled, (state, action) => {
      if (state.currentContent && state.currentContent.questions) {
        state.currentContent.questions = state.currentContent.questions.filter(
          (q) => q.id !== action.payload,
        );
      }
    });

    // createResource
    builder.addCase(createResource.fulfilled, (state, action) => {
      if (state.currentContent) {
        const resource = action.payload;
        if (resource.category === "official") {
          state.currentContent.official_curriculum.push(resource);
        } else if (resource.category === "teacher_video") {
          state.currentContent.teacher_videos.push(resource);
        } else if (resource.category === "summary") {
          state.currentContent.summaries_resources.push(resource);
        }
      }
    });

    // deleteResource
    builder.addCase(deleteResource.fulfilled, (state, action) => {
      if (state.currentContent) {
        state.currentContent.official_curriculum =
          state.currentContent.official_curriculum.filter(
            (r) => r.id !== action.payload,
          );
        state.currentContent.teacher_videos =
          state.currentContent.teacher_videos.filter(
            (r) => r.id !== action.payload,
          );
        state.currentContent.summaries_resources =
          state.currentContent.summaries_resources.filter(
            (r) => r.id !== action.payload,
          );
      }
    });

    // fetchContentFileUrl
    builder.addCase(fetchContentFileUrl.pending, (state) => {
      state.error = null;
    });
    builder.addCase(fetchContentFileUrl.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // downloadContent
    builder.addCase(downloadContent.fulfilled, (state, action) => {
      if (!state.currentContent) return;
      const contentId = action.payload?.contentId;
      const serverCount = action.payload?.downloads_count;

      const bumpDownloadsInList = (list: any[]) => {
        const index = list.findIndex((r) => r.id === contentId);
        if (index === -1) return;
        const current = Number(list[index]?.downloads_count || 0);
        list[index].downloads_count =
          typeof serverCount === "number" ? serverCount : current + 1;
      };

      bumpDownloadsInList(state.currentContent.official_curriculum);
      bumpDownloadsInList(state.currentContent.teacher_videos);
      bumpDownloadsInList(state.currentContent.summaries_resources);
    });
    builder.addCase(downloadContent.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // uploadContent
    builder.addCase(uploadContent.fulfilled, (state, action) => {
      if (!state.currentContent) return;

      const resource = action.payload?.data || action.payload;
      const category = resolveResourceCategory(resource);

      if (category === "teacher_video") {
        state.currentContent.teacher_videos.push(resource);
      } else if (category === "summary") {
        state.currentContent.summaries_resources.push(resource);
      } else {
        state.currentContent.official_curriculum.push(resource);
      }
    });

    // updateContent
    builder.addCase(updateContent.fulfilled, (state, action) => {
      if (!state.currentContent) return;

      const updatedResource = action.payload?.data || action.payload;
      const category = resolveResourceCategory(updatedResource);

      const updateInList = (list: any[]) => {
        const index = list.findIndex((resource) => resource.id === updatedResource.id);
        if (index !== -1) {
          list[index] = { ...list[index], ...updatedResource };
          return true;
        }
        return false;
      };

      const foundInVideos = updateInList(state.currentContent.teacher_videos);
      const foundInSummaries = updateInList(state.currentContent.summaries_resources);
      const foundInOfficial = updateInList(state.currentContent.official_curriculum);

      if (foundInVideos || foundInSummaries || foundInOfficial) return;

      if (category === "teacher_video") {
        state.currentContent.teacher_videos.push(updatedResource);
      } else if (category === "summary") {
        state.currentContent.summaries_resources.push(updatedResource);
      } else {
        state.currentContent.official_curriculum.push(updatedResource);
      }
    });
  },
});

export const { setSemester, clearContent, setGradeId } =
  curriculumsSlice.actions;
export default curriculumsSlice.reducer;
