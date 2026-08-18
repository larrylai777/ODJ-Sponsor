import { describe, expect, it } from "vitest";
import { mobileMenuLinks } from "./Home";

describe("mobileMenuLinks", () => {
  it("places the creator workbench entry before every other mobile navigation item", () => {
    expect(mobileMenuLinks[0]).toMatchObject({
      label: "進入創作者工作台",
      href: expect.stringMatching(/dashboard$/),
    });
  });
});
