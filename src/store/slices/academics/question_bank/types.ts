export interface QuestionOption {
    id?: string;
    option_text: string;
    option_text_ar?: string;
    option_text_en?: string;
    is_correct: boolean;
    order: number;
}

export interface Question {
    id: string;
    question_text: string;
    question_text_ar?: string;
    question_text_en?: string;
    question_type:
    | "multiple_choice"
    | "short_answer"
    | "true_false"
    | "essay"
    | "fill_blank"
    | "matching";
    difficulty: "easy" | "medium" | "hard";
    category_id?: string;
    subject_id: string;
    grade_level_id: string;
    correct_answer?: string;
    answer_explanation?: string;
    image_url?: string;
    default_marks: number;
    is_ai_generated?: boolean;
    is_verified?: boolean;
    times_used?: number;
    avg_score_percentage?: number;
    tags?: Record<string, unknown>;
    options?: QuestionOption[];
    created_at?: string;
}

export interface CreateQuestionPayload {
    question_text: string;
    question_text_ar?: string;
    question_text_en?: string;
    question_type:
    | "multiple_choice"
    | "short_answer"
    | "true_false"
    | "essay"
    | "fill_blank"
    | "matching";
    difficulty: "easy" | "medium" | "hard";
    category_id?: string;
    subject_id: string;
    grade_level_id: string;
    correct_answer?: string;
    answer_explanation?: string;
    image_url?: string;
    default_marks?: number;
    tags?: string[];
    options?: Omit<QuestionOption, "id">[];
}

export interface UpdateQuestionPayload {
    id: string;
    data: Partial<CreateQuestionPayload>;
}

export interface FetchQuestionsParams {
    subject_id?: string;
    grade_level_id?: string;
    question_type?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

export interface QuestionBankState {
    questions: Question[];
    currentQuestion: Question | null;
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
    pages: number;
}
