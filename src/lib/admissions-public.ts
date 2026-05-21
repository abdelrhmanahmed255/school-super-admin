import api from "@/lib/axios";

/**
 * Public admission endpoints (no auth). Paths follow `/api/v1/admissions/public/...` when
 * `NEXT_PUBLIC_API_URL` includes the API version prefix.
 */
export function submitPublicAdmissionApplication(
  schoolCode: string,
  formData: FormData,
) {
  return api.post(`/admissions/public/apply/${encodeURIComponent(schoolCode)}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function fetchPublicAdmissionByReference(reference: string) {
  return api.get(
    `/admissions/public/applications/${encodeURIComponent(reference)}`,
  );
}
