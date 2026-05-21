import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
import { fetchAcademicSubjects } from "@/store/slices/academics/base_academics/thunks";

export function useBaseAcademics() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(
    (root: RootState) => root.baseAcademics,
    shallowEqual,
  );

  const loadSubjects = useCallback(
    (search = "") => {
      return dispatch(fetchAcademicSubjects({ page: 1, search }));
    },
    [dispatch],
  );

  const loadMoreSubjects = useCallback(
    (search = "") => {
      if (state.subjectsLoading || state.subjectsPage >= state.subjectsTotalPages) {
        return;
      }
      dispatch(
        fetchAcademicSubjects({ page: state.subjectsPage + 1, search }),
      );
    },
    [dispatch, state.subjectsLoading, state.subjectsPage, state.subjectsTotalPages],
  );

  return {
    ...state,
    loadSubjects,
    loadMoreSubjects,
  };
}
