import { describe, expect, it } from "vitest";
import { footerSectionOrder, relatedBrandLinks } from "./SiteFooter";

describe("relatedBrandLinks", () => {
  it("groups the three requested brands in the footer", () => {
    expect(relatedBrandLinks.map((brand) => brand.label)).toEqual(["寧靜喵", "拉力一方", "比爸小說"]);
  });

  it("uses secure external destinations for every related brand", () => {
    expect(relatedBrandLinks.every((brand) => brand.href.startsWith("https://"))).toBe(true);
  });

  it("places related brands before policy and contact links", () => {
    expect(footerSectionOrder).toEqual(["相關品牌", "政策與聯絡"]);
  });
});
