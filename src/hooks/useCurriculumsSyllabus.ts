import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearCurrentBook,
  clearLessonRange,
} from "@/store/slices/academics/curriculums_syllabus/slice";
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
} from "@/store/slices/academics/curriculums_syllabus/thunks";
import {
  CreateLessonMediaPayload,
  CreateLessonPayload,
  CreateBookPayload,
  CreateUnitPayload,
  FetchBooksParams,
  UpdateLessonPayload,
  UpdateBookPayload,
  UpdateUnitPayload,
} from "@/store/slices/academics/curriculums_syllabus/types";

export function useCurriculumsSyllabus() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(
    (rootState: RootState) => rootState.curriculumsSyllabus,
    shallowEqual,
  );

  const fetchAllBooks = useCallback(
    (params?: FetchBooksParams) => {
      return dispatch(fetchBooks(params));
    },
    [dispatch],
  );

  const fetchBook = useCallback(
    (bookId: string) => {
      return dispatch(fetchBookById(bookId));
    },
    [dispatch],
  );

  const addBook = useCallback(
    (payload: CreateBookPayload) => {
      return dispatch(createBook(payload)).unwrap();
    },
    [dispatch],
  );

  const editBook = useCallback(
    (bookId: string, payload: UpdateBookPayload) => {
      return dispatch(updateBook({ bookId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const removeBook = useCallback(
    (bookId: string) => {
      return dispatch(deleteBook(bookId)).unwrap();
    },
    [dispatch],
  );

  const fetchLessonRange = useCallback(
    (bookId: string) => {
      return dispatch(fetchBookLessonRange(bookId));
    },
    [dispatch],
  );

  const fetchUnits = useCallback(
    (bookId: string) => {
      return dispatch(fetchBookUnits(bookId));
    },
    [dispatch],
  );

  const addUnit = useCallback(
    (bookId: string, payload: CreateUnitPayload) => {
      return dispatch(createUnit({ bookId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const editUnit = useCallback(
    (unitId: string, payload: UpdateUnitPayload) => {
      return dispatch(updateUnit({ unitId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const removeUnit = useCallback(
    (unitId: string) => {
      return dispatch(deleteUnit(unitId)).unwrap();
    },
    [dispatch],
  );

  const reorderUnits = useCallback(
    (bookId: string, unitIds: string[]) => {
      return dispatch(reorderBookUnits({ bookId, unitIds })).unwrap();
    },
    [dispatch],
  );

  const addBookLesson = useCallback(
    (bookId: string, payload: CreateLessonPayload) => {
      return dispatch(createBookLesson({ bookId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const addUnitLesson = useCallback(
    (unitId: string, payload: CreateLessonPayload) => {
      return dispatch(createUnitLesson({ unitId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const editLesson = useCallback(
    (lessonId: string, payload: UpdateLessonPayload) => {
      return dispatch(updateLesson({ lessonId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const removeLesson = useCallback(
    (lessonId: string) => {
      return dispatch(deleteLesson(lessonId)).unwrap();
    },
    [dispatch],
  );

  const reorderLessons = useCallback(
    (unitId: string, lessonIds: string[]) => {
      return dispatch(reorderUnitLessons({ unitId, lessonIds })).unwrap();
    },
    [dispatch],
  );

  const fetchMedia = useCallback(
    (lessonId: string) => {
      return dispatch(fetchLessonMedia(lessonId));
    },
    [dispatch],
  );

  const addMedia = useCallback(
    (lessonId: string, payload: CreateLessonMediaPayload) => {
      return dispatch(createLessonMedia({ lessonId, data: payload })).unwrap();
    },
    [dispatch],
  );

  const removeMedia = useCallback(
    (mediaId: string) => {
      return dispatch(deleteMedia(mediaId)).unwrap();
    },
    [dispatch],
  );

  const resetCurrentBook = useCallback(() => {
    dispatch(clearCurrentBook());
  }, [dispatch]);

  const resetLessonRange = useCallback(() => {
    dispatch(clearLessonRange());
  }, [dispatch]);

  return {
    ...state,
    fetchAllBooks,
    fetchBook,
    addBook,
    editBook,
    removeBook,
    fetchLessonRange,
    fetchUnits,
    addUnit,
    editUnit,
    removeUnit,
    reorderUnits,
    addBookLesson,
    addUnitLesson,
    editLesson,
    removeLesson,
    reorderLessons,
    fetchMedia,
    addMedia,
    removeMedia,
    resetCurrentBook,
    resetLessonRange,
  };
}
