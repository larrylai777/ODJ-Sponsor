import crypto from "node:crypto";
import { ecpayPlans, type EcpayPlanId } from "../shared/ecpayPlans.js";

export type EcpayEnv = "test" | "production";

export interface EcpayConfig {
  merchantId: string;
  hashKey: string;
  hashIv: string;
  env: EcpayEnv;
}

/**
 * 綠界官方公開的測試環境特店資訊（文件公開範例值），僅在未設定 ECPAY_* 環境變數時作為預設值，
 * 讓專案在正式串接金鑰之前也能先跑通串接流程；正式上線前必須改用真正的特店金鑰並設定 ECPAY_ENV=production。
 */
const TEST_MERCHANT_ID = "2000132";
const TEST_HASH_KEY = "5294y06JbISpM5x9";
const TEST_HASH_IV = "v77hoKGq4kWxNNIS";

export function loadEcpayConfig(): EcpayConfig {
  const env: EcpayEnv =
    process.env.ECPAY_ENV === "production" ? "production" : "test";
  return {
    merchantId: process.env.ECPAY_MERCHANT_ID || TEST_MERCHANT_ID,
    hashKey: process.env.ECPAY_HASH_KEY || TEST_HASH_KEY,
    hashIv: process.env.ECPAY_HASH_IV || TEST_HASH_IV,
    env,
  };
}

export function ecpayActionUrl(env: EcpayEnv): string {
  return env === "production"
    ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
    : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
}

/** 綠界檢查碼要求的 .NET 風格 URL encode（與官方 SDK 一致的字元轉換規則）。 */
function ecpayUrlEncode(raw: string): string {
  return encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%2d/g, "-")
    .replace(/%5f/g, "_")
    .replace(/%2e/g, ".")
    .replace(/%21/g, "!")
    .replace(/%2a/g, "*")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")");
}

export function genCheckMacValue(
  params: Record<string, string | number>,
  hashKey: string,
  hashIv: string
): string {
  const sortedKeys = Object.keys(params).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
  const joined = sortedKeys.map(key => `${key}=${params[key]}`).join("&");
  const encoded = ecpayUrlEncode(
    `HashKey=${hashKey}&${joined}&HashIV=${hashIv}`
  );
  return crypto
    .createHash("sha256")
    .update(encoded)
    .digest("hex")
    .toUpperCase();
}

export function verifyCheckMacValue(
  params: Record<string, string>,
  hashKey: string,
  hashIv: string
): boolean {
  const { CheckMacValue, ...rest } = params;
  if (!CheckMacValue) return false;
  return (
    genCheckMacValue(rest, hashKey, hashIv) === CheckMacValue.toUpperCase()
  );
}

function formatMerchantTradeDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find(part => part.type === type)?.value ?? "00";
  return `${get("year")}/${get("month")}/${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export function genMerchantTradeNo(): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `ODJ${stamp}${rand}`.toUpperCase().slice(0, 20);
}

export interface BuildEcpayOrderInput {
  planId: EcpayPlanId;
  slug: string;
  appBaseUrl: string;
  config: EcpayConfig;
}

export interface EcpayOrder {
  actionUrl: string;
  params: Record<string, string>;
}

export function buildEcpayOrder({
  planId,
  slug,
  appBaseUrl,
  config,
}: BuildEcpayOrderInput): EcpayOrder {
  const plan = ecpayPlans[planId];
  const base = appBaseUrl.replace(/\/+$/, "");

  const orderParams: Record<string, string> = {
    MerchantID: config.merchantId,
    MerchantTradeNo: genMerchantTradeNo(),
    MerchantTradeDate: formatMerchantTradeDate(new Date()),
    PaymentType: "aio",
    TotalAmount: String(plan.amount),
    TradeDesc: "ODJ Sponsor Pure Support",
    ItemName: plan.itemName,
    ReturnURL: `${base}/api/ecpay/notify`,
    ChoosePayment: "ALL",
    ClientBackURL: `${base}/project/${slug}?ecpay=return`,
    EncryptType: "1",
  };

  const checkMacValue = genCheckMacValue(
    orderParams,
    config.hashKey,
    config.hashIv
  );

  return {
    actionUrl: ecpayActionUrl(config.env),
    params: { ...orderParams, CheckMacValue: checkMacValue },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 產生會自動送出到綠界結帳頁的中繼頁面，瀏覽器導向後立即以 POST 轉址。 */
export function renderEcpayAutoSubmitForm(order: EcpayOrder): string {
  const inputs = Object.entries(order.params)
    .map(
      ([key, value]) =>
        `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}" />`
    )
    .join("\n    ");

  return `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="utf-8" />
    <title>正在前往綠界安全付款頁…</title>
  </head>
  <body>
    <p>正在前往綠界安全付款頁，請稍候…</p>
    <form id="ecpay-form" method="POST" action="${escapeHtml(order.actionUrl)}">
    ${inputs}
    </form>
    <script>document.getElementById("ecpay-form").submit();</script>
  </body>
</html>`;
}
