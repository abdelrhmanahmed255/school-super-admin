import { createSlice } from "@reduxjs/toolkit";
import {
  CurriculumsSyllabusState,
  LessonRangeResponse,
  SyllabusBook,
} from "./types";
import {
  createBookLesson,
  createBook,
  createLessonMedia,
  createUnitLesson,
  createUnit,
  deleteLesson,
  deleteMedia,
  deleteBook,
  deleteUnit,
  fetchBookById,
  fetchBookLessonRange,
  fetchBookUnits,
  fetchBooks,
  fetchLessonMedia,
  reorderBookUnits,
  reorderUnitLessons,
  updateLesson,
  updateBook,
  updateUnit,
} from "./thunks";

const initialState: CurriculumsSyllabusState = {
  books: [],
  currentBook: null,
  lessonRange: null,
  lessonMediaByLessonId: {},
  loading: false,
  submitting: false,
  error: null,
};

const curriculumsSyllabusSlice = createSlice({
  name: "curriculumsSyllabus",
  initialState,
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    clearLessonRange: (state) => {
      state.lessonRange = null;
    },
  },
  extraReducers: (builder) => {
    const asArray = (payload: any) => (payload?.items || payload?.data || payload || []) as any[];
    const asItem = (payload: any) => (payload?.data || payload) as any;

    const updateLessonInBook = (state: CurriculumsSyllabusState, lesson: any) => {
      if (!state.currentBook) return;
      const units = (state.currentBook.units || []) as any[];
      let updated = false;
      state.currentBook.units = units.map((unit: any) => {
        const lessons = Array.isArray(unit?.lessons) ? unit.lessons : [];
        const lessonIndex = lessons.findIndex((l: any) => l.id === lesson.id);
        if (lessonIndex === -1) return unit;
        updated = true;
        const nextLessons = [...lessons];
        nextLessons[lessonIndex] = { ...nextLessons[lessonIndex], ...lesson };
        return { ...unit, lessons: nextLessons };
      });

      if (updated) return;

      const directLessons = Array.isArray(state.currentBook.direct_lessons)
        ? (state.currentBook.direct_lessons as any[])
        : [];
      const directIndex = directLessons.findIndex((l: any) => l.id === lesson.id);
      if (directIndex !== -1) {
        const nextDirect = [...directLessons];
        nextDirect[directIndex] = { ...nextDirect[directIndex], ...lesson };
        state.currentBook.direct_lessons = nextDirect;
      }
    };

    // Fetch books
    builder.addCase(fetchBooks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.loading = false;
      state.books = (action.payload?.items || action.payload || []) as SyllabusBook[];
    });
    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch by id
    builder.addCase(fetchBookById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBookById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentBook = (action.payload?.data || action.payload) as SyllabusBook;
    });
    builder.addCase(fetchBookById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createBook.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createBook.fulfilled, (state, action) => {
      state.submitting = false;
      const createdBook = (action.payload?.data || action.payload) as SyllabusBook;
      state.books = [createdBook, ...state.books];
    });
    builder.addCase(createBook.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // Update
    builder.addCase(updateBook.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateBook.fulfilled, (state, action) => {
      state.submitting = false;
      const updatedBook = (action.payload?.data || action.payload) as SyllabusBook;
      state.books = state.books.map((book) =>
        book.id === updatedBook.id ? updatedBook : book,
      );
      if (state.currentBook?.id === updatedBook.id) {
        state.currentBook = updatedBook;
      }
    });
    builder.addCase(updateBook.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // Delete
    builder.addCase(deleteBook.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteBook.fulfilled, (state, action) => {
      state.submitting = false;
      state.books = state.books.filter((book) => book.id !== action.payload);
      if (state.currentBook?.id === action.payload) {
        state.currentBook = null;
      }
    });
    builder.addCase(deleteBook.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // Lesson range
    builder.addCase(fetchBookLessonRange.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBookLessonRange.fulfilled, (state, action) => {
      state.loading = false;
      state.lessonRange = (action.payload?.data || action.payload) as LessonRangeResponse;
    });
    builder.addCase(fetchBookLessonRange.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Units
    builder.addCase(fetchBookUnits.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBookUnits.fulfilled, (state, action) => {
      state.loading = false;
      const units = asArray(action.payload.data);
      if (state.currentBook?.id === action.payload.bookId) {
        if (state.currentBook) {
          state.currentBook.units = units;
        }
      }
      state.books = state.books.map((book) =>
        book.id === action.payload.bookId ? { ...book, units } : book,
      );
    });
    builder.addCase(fetchBookUnits.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createUnit.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createUnit.fulfilled, (state, action) => {
      state.submitting = false;
      const createdUnit = asItem(action.payload.data);
      if (state.currentBook?.id === action.payload.bookId) {
        if (state.currentBook) {
          const units = Array.isArray(state.currentBook.units)
            ? (state.currentBook.units as any[])
            : [];
          state.currentBook.units = [...units, createdUnit];
        }
      }
    });
    builder.addCase(createUnit.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateUnit.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateUnit.fulfilled, (state, action) => {
      state.submitting = false;
      const updatedUnit = asItem(action.payload);
      if (state.currentBook?.units) {
        state.currentBook.units = (state.currentBook.units as any[]).map((unit: any) =>
          unit.id === updatedUnit.id ? { ...unit, ...updatedUnit } : unit,
        );
      }
    });
    builder.addCase(updateUnit.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteUnit.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteUnit.fulfilled, (state, action) => {
      state.submitting = false;
      if (state.currentBook?.units) {
        state.currentBook.units = (state.currentBook.units as any[]).filter(
          (unit: any) => unit.id !== action.payload,
        );
      }
    });
    builder.addCase(deleteUnit.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(reorderBookUnits.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(reorderBookUnits.fulfilled, (state, action) => {
      state.submitting = false;
      if (!state.currentBook?.units || state.currentBook.id !== action.payload.bookId) {
        return;
      }
      const units = state.currentBook.units as any[];
      const mapById = new Map(units.map((unit: any) => [unit.id, unit]));
      state.currentBook.units = action.payload.unitIds
        .map((id: string) => mapById.get(id))
        .filter(Boolean);
    });
    builder.addCase(reorderBookUnits.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // Lessons
    builder.addCase(createBookLesson.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createBookLesson.fulfilled, (state, action) => {
      state.submitting = false;
      const createdLesson = asItem(action.payload.data);

      if (state.currentBook && state.currentBook?.id === action.payload.bookId) {
        const directLessons = Array.isArray(state.currentBook.direct_lessons)
          ? (state.currentBook.direct_lessons as any[])
          : [];
        state.currentBook.direct_lessons = [...directLessons, createdLesson];
      }
    });
    builder.addCase(createBookLesson.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(createUnitLesson.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createUnitLesson.fulfilled, (state, action) => {
      state.submitting = false;
      const createdLesson = asItem(action.payload.data);
      if (!state.currentBook?.units) return;
      state.currentBook.units = (state.currentBook.units as any[]).map((unit: any) => {
        if (unit.id !== action.payload.unitId) return unit;
        const lessons = Array.isArray(unit.lessons) ? unit.lessons : [];
        return { ...unit, lessons: [...lessons, createdLesson] };
      });
    });
    builder.addCase(createUnitLesson.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateLesson.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(updateLesson.fulfilled, (state, action) => {
      state.submitting = false;
      const updatedLesson = asItem(action.payload);
      updateLessonInBook(state, updatedLesson);
    });
    builder.addCase(updateLesson.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteLesson.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteLesson.fulfilled, (state, action) => {
      state.submitting = false;
      if (!state.currentBook) return;
      if (state.currentBook.units) {
        state.currentBook.units = (state.currentBook.units as any[]).map((unit: any) => ({
          ...unit,
          lessons: (Array.isArray(unit.lessons) ? unit.lessons : []).filter(
            (lesson: any) => lesson.id !== action.payload,
          ),
        }));
      }
      if (state.currentBook.direct_lessons) {
        state.currentBook.direct_lessons = (state.currentBook.direct_lessons as any[]).filter(
          (lesson: any) => lesson.id !== action.payload,
        );
      }
    });
    builder.addCase(deleteLesson.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(reorderUnitLessons.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(reorderUnitLessons.fulfilled, (state, action) => {
      state.submitting = false;
      if (!state.currentBook?.units) return;
      state.currentBook.units = (state.currentBook.units as any[]).map((unit: any) => {
        if (unit.id !== action.payload.unitId) return unit;
        const lessons = Array.isArray(unit.lessons) ? unit.lessons : [];
        const mapById = new Map(lessons.map((lesson: any) => [lesson.id, lesson]));
        const orderedLessons = action.payload.lessonIds
          .map((id: string) => mapById.get(id))
          .filter(Boolean);
        return { ...unit, lessons: orderedLessons };
      });
    });
    builder.addCase(reorderUnitLessons.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    // Media
    builder.addCase(fetchLessonMedia.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLessonMedia.fulfilled, (state, action) => {
      state.loading = false;
      state.lessonMediaByLessonId[action.payload.lessonId] = asArray(
        action.payload.data,
      );
    });
    builder.addCase(fetchLessonMedia.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createLessonMedia.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(createLessonMedia.fulfilled, (state, action) => {
      state.submitting = false;
      const createdMedia = asItem(action.payload.data);
      const existing = state.lessonMediaByLessonId[action.payload.lessonId] || [];
      state.lessonMediaByLessonId[action.payload.lessonId] = [...existing, createdMedia];
    });
    builder.addCase(createLessonMedia.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });

    builder.addCase(deleteMedia.pending, (state) => {
      state.submitting = true;
      state.error = null;
    });
    builder.addCase(deleteMedia.fulfilled, (state, action) => {
      state.submitting = false;
      Object.keys(state.lessonMediaByLessonId).forEach((lessonId) => {
        state.lessonMediaByLessonId[lessonId] = state.lessonMediaByLessonId[
          lessonId
        ].filter((media: any) => media.id !== action.payload);
      });
    });
    builder.addCase(deleteMedia.rejected, (state, action) => {
      state.submitting = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCurrentBook, clearLessonRange } =
  curriculumsSyllabusSlice.actions;
export default curriculumsSyllabusSlice.reducer;
