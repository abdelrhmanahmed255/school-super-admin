import { createSlice } from "@reduxjs/toolkit";
import {
    fetchQuestions,
    fetchQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from "./thunks";
import { QuestionBankState } from "./types";

const initialState: QuestionBankState = {
    questions: [],
    currentQuestion: null,
    loading: false,
    error: null,
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
};

const questionBankSlice = createSlice({
    name: "questionBank",
    initialState,
    reducers: {
        clearCurrentQuestion: (state) => {
            state.currentQuestion = null;
        },
        clearQuestions: (state) => {
            state.questions = [];
            state.total = 0;
            state.page = 1;
            state.pages = 0;
        },
    },
    extraReducers: (builder) => {
        // fetchQuestions
        builder.addCase(fetchQuestions.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchQuestions.fulfilled, (state, action) => {
            state.loading = false;
            state.questions = action.payload.items;
            state.total = action.payload.total;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.pages = action.payload.pages;
        });
        builder.addCase(fetchQuestions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // fetchQuestionById
        builder.addCase(fetchQuestionById.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchQuestionById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentQuestion = action.payload;
        });
        builder.addCase(fetchQuestionById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // createQuestion
        builder.addCase(createQuestion.fulfilled, (state, action) => {
            state.questions.unshift(action.payload);
            state.total += 1;
        });

        // updateQuestion
        builder.addCase(updateQuestion.fulfilled, (state, action) => {
            const index = state.questions.findIndex(
                (q) => q.id === action.payload.id,
            );
            if (index !== -1) {
                state.questions[index] = action.payload;
            }
            if (state.currentQuestion?.id === action.payload.id) {
                state.currentQuestion = action.payload;
            }
        });

        // deleteQuestion
        builder.addCase(deleteQuestion.fulfilled, (state, action) => {
            state.questions = state.questions.filter((q) => q.id !== action.payload);
            state.total -= 1;
            if (state.currentQuestion?.id === action.payload) {
                state.currentQuestion = null;
            }
        });
    },
});

export const { clearCurrentQuestion, clearQuestions } =
    questionBankSlice.actions;
export default questionBankSlice.reducer;
