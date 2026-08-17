/** 平台管理員以 Firebase UID 識別；前端僅用於介面導向，實際資料保護由 Firestore 規則負責。 */
const platformAdminUids = new Set([
  "FQqJ6FT5ZcWTKULuKpz92whv1KH2",
]);

export function isPlatformAdmin(uid?: string | null) {
  return Boolean(uid && platformAdminUids.has(uid));
}

export const adminReviewPath = `${import.meta.env.BASE_URL}admin/reviews`;
