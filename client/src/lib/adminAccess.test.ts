import { describe, expect, it } from "vitest";
import { adminReviewPath, isPlatformAdmin } from "./adminAccess";

describe("admin access", () => {
  it("只辨識指定的 Firebase 管理員 UID", () => {
    expect(isPlatformAdmin("FQqJ6FT5ZcWTKULuKpz92whv1KH2")).toBe(true);
    expect(isPlatformAdmin("ordinary-member-uid")).toBe(false);
    expect(isPlatformAdmin()).toBe(false);
  });

  it("使用網站子路徑下的固定審核後台入口", () => {
    expect(adminReviewPath).toContain("admin/reviews");
  });
});
