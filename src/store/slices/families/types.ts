export interface Family {
    id: string;
    family_code: string;
    school_id: string;
    father_full_name: string | null;
    father_phone: string | null;
    father_email: string | null;
    father_government_id: string | null;
    father_is_deceased: boolean;
    mother_full_name: string | null;
    mother_phone: string | null;
    mother_email: string | null;
    mother_government_id: string | null;
    mother_is_deceased: boolean;
    guardian_full_name: string | null;
    guardian_phone: string | null;
    guardian_email: string | null;
    guardian_government_id: string | null;
    guardian_is_deceased: boolean;
    student_count: number;
    created_at: string;
    updated_at: string;
}

export interface UpdateFamilyRequest {
    father_full_name?: string;
    father_full_name_ar?: string;
    father_phone?: string;
    father_email?: string;
    father_government_id?: string;
    father_is_deceased?: boolean;
    mother_full_name?: string;
    mother_full_name_ar?: string;
    mother_phone?: string;
    mother_email?: string;
    mother_government_id?: string;
    mother_is_deceased?: boolean;
    guardian_full_name?: string;
    guardian_phone?: string;
    guardian_email?: string;
    family_address?: string;
    family_address_ar?: string;
    primary_emergency_contact?: "FATHER" | "MOTHER" | "GUARDIAN";
}

export interface FamiliesState {
    families: Family[];
    familyDetail: Family | null;
    loading: boolean;
    detailLoading: boolean;
    updateLoading: boolean;
    error: string | null;
    detailError: string | null;
    updateError: string | null;
    count: number;
    totalPages: number;
    currPage: number;
    pageSize: number;
    search: string;
    sort_by: string;
    order: "asc" | "desc";
}