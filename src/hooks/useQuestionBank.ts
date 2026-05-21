import { useCallback } from "react";
import { shallowEqual } from "react-redux";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    clearCurrentQuestion,
    clearQuestions,
} from "@/store/slices/academics/question_bank/slice";
import {
    fetchQuestions,
    fetchQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from "@/store/slices/academics/question_bank/thunks";
import {
    CreateQuestionPayload,
    FetchQuestionsParams,
} from "@/store/slices/academics/question_bank/types";

export function useQuestionBank() {
    const dispatch = useAppDispatch();
    const state = useAppSelector(
        (rootState: RootState) => rootState.questionBank,
        shallowEqual,
    );

    const getQuestions = useCallback(
        (params: FetchQuestionsParams) => {
            return dispatch(fetchQuestions(params));
        },
        [dispatch],
    );

    const getQuestionById = useCallback(
        (id: string) => {
            return dispatch(fetchQuestionById(id)).unwrap();
        },
        [dispatch],
    );

    const addQuestion = useCallback(
        (payload: CreateQuestionPayload) => {
            return dispatch(createQuestion(payload)).unwrap();
        },
        [dispatch],
    );

    const editQuestion = useCallback(
        (id: string, data: Partial<CreateQuestionPayload>) => {
            return dispatch(updateQuestion({ id, data })).unwrap();
        },
        [dispatch],
    );

    const removeQuestion = useCallback(
        (id: string) => {
            return dispatch(deleteQuestion(id)).unwrap();
        },
        [dispatch],
    );

    const resetCurrentQuestion = useCallback(() => {
        dispatch(clearCurrentQuestion());
    }, [dispatch]);

    const resetQuestions = useCallback(() => {
        dispatch(clearQuestions());
    }, [dispatch]);

    return {
        ...state,
        getQuestions,
        getQuestionById,
        addQuestion,
        editQuestion,
        removeQuestion,
        resetCurrentQuestion,
        resetQuestions,
    };
}
