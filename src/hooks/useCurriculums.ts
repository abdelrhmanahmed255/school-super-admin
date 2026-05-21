import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearContent, setGradeId, setSemester } from "@/store/slices/academics/curriculums/slice";
import {
  createQuestion,
  createResource,
  deleteQuestion,
  deleteResource,
  downloadContent,
  fetchContentFileUrl,
  fetchCurriculumContent,
  fetchSubjects,
  updateContent,
  updateQuestion,
  uploadContent,
} from "@/store/slices/academics/curriculums/thunks";
import { UpdateContentPayload, UploadContentPayload } from "@/store/slices/academics/curriculums/types";

export function useCurriculums() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(
    (rootState: RootState) => rootState.curriculums,
    shallowEqual,
  );

  const fetchSubjectsByGrade = useCallback(
    (gradeId: string, semesterId: number | string) => {
      return dispatch(fetchSubjects({ gradeId, semesterId }));
    },
    [dispatch],
  );

  const fetchContent = useCallback(
    (subjectId: string, gradeId: string, semesterId: number | string) => {
      return dispatch(fetchCurriculumContent({ subjectId, gradeId, semesterId }));
    },
    [dispatch],
  );

  const addQuestion = useCallback(
    (payload: any) => {
      return dispatch(createQuestion(payload)).unwrap();
    },
    [dispatch],
  );

  const editQuestion = useCallback(
    (id: string, payload: any) => {
      return dispatch(updateQuestion({ id, data: payload })).unwrap();
    },
    [dispatch],
  );

  const removeQuestion = useCallback(
    (id: string) => {
      return dispatch(deleteQuestion(id)).unwrap();
    },
    [dispatch],
  );

  const addResource = useCallback(
    (payload: any) => {
      return dispatch(createResource(payload)).unwrap();
    },
    [dispatch],
  );

  const removeResource = useCallback(
    (id: string) => {
      return dispatch(deleteResource(id)).unwrap();
    },
    [dispatch],
  );

  const uploadCurriculumContent = useCallback(
    (payload: UploadContentPayload) => {
      return dispatch(uploadContent(payload)).unwrap();
    },
    [dispatch],
  );

  const editCurriculumContent = useCallback(
    (payload: UpdateContentPayload) => {
      return dispatch(updateContent(payload)).unwrap();
    },
    [dispatch],
  );

  const fetchContentFileUrlById = useCallback(
    (contentId: string) => {
      return dispatch(fetchContentFileUrl(contentId)).unwrap();
    },
    [dispatch],
  );

  const registerContentDownload = useCallback(
    (contentId: string) => {
      return dispatch(downloadContent(contentId));
    },
    [dispatch],
  );

  const setSemesterValue = useCallback(
    (semester: number) => {
      dispatch(setSemester(semester));
    },
    [dispatch],
  );

  const setSelectedGradeId = useCallback(
    (gradeId: string) => {
      dispatch(setGradeId(gradeId));
    },
    [dispatch],
  );

  const resetContent = useCallback(() => {
    dispatch(clearContent());
  }, [dispatch]);

  return {
    ...state,
    fetchSubjectsByGrade,
    fetchContent,
    addQuestion,
    editQuestion,
    removeQuestion,
    addResource,
    removeResource,
    uploadCurriculumContent,
    editCurriculumContent,
    fetchContentFileUrlById,
    registerContentDownload,
    setSemesterValue,
    setSelectedGradeId,
    resetContent,
  };
}
