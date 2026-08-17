import { describe, expect, it } from "vitest";
import { stripePaymentLinks } from "./stripePaymentLinks";

describe("stripePaymentLinks", () => {
  it("保留三個對應方案，且全部指向 Stripe 測試模式結帳網址", () => {
    expect(Object.keys(stripePaymentLinks)).toEqual(["support", "book", "collector"]);
    expect(Object.values(stripePaymentLinks)).toHaveLength(3);
    expect(Object.values(stripePaymentLinks)).toEqual(
      expect.arrayContaining([
        "https://buy.stripe.com/test_6oU00l82T7jw8kb8C15gc00",
        "https://buy.stripe.com/test_3cI3cxdndbzMdEvbOd5gc01",
        "https://buy.stripe.com/test_7sY00l1Ev6fs1VN5pP5gc02",
      ]),
    );
    expect(Object.values(stripePaymentLinks).every((url) => url?.includes("/test_"))).toBe(true);
  });
});
