export type StripePaymentLinkId = "support" | "book" | "collector";

/**
 * Stripe Payment Link 是公開結帳網址，不應在此放入任何 API 金鑰。
 * 目前三個連結均為 Stripe 測試模式；正式啟用前必須換成 live mode 的 Payment Link。
 */
export const stripePaymentLinks: Record<StripePaymentLinkId, string | null> = {
  support: "https://buy.stripe.com/test_6oU00l82T7jw8kb8C15gc00",
  book: "https://buy.stripe.com/test_3cI3cxdndbzMdEvbOd5gc01",
  collector: "https://buy.stripe.com/test_7sY00l1Ev6fs1VN5pP5gc02",
};
