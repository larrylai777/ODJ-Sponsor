# 綠界金流（ECPay）串接紀錄

> 狀態：測試環境。以下設定使用綠界官方公開的測試特店資訊，僅可用於串接驗證，不可用於正式收款。

## 為什麼原本的 Stripe Payment Link 做法不能直接套用

`client/src/lib/stripePaymentLinks.ts` 的做法是把金鑰完全留在 Stripe 後台，前端只保存公開結帳網址，適合純靜態網站（GitHub Pages）。綠界沒有等同的純前端方案：下單需要用 HashKey / HashIV 對參數做 SHA256 檢查碼簽章，付款結果的背景通知（ReturnURL）也必須有伺服器端點驗證檢查碼並回應 `1|OK`。因此這次串接是加在 `server/`（Express）而非純前端，只有透過 `pnpm build && pnpm start` 啟動的伺服器才能使用，GitHub Pages 靜態部署不支援。

## 新增的檔案

- `shared/ecpayPlans.ts`：三個純支持方案（`support` / `book` / `collector`）的品名與金額，與 `client/src/pages/Project.tsx` 的 `supportOptions` 對齊。
- `server/ecpay.ts`：檢查碼演算法（依綠界規則排序、URL encode、SHA256、轉大寫）、下單參數組裝、自動送出表單頁面產生。
- `client/src/lib/ecpay.test.ts`：檢查碼自我驗證、竄改後驗證失敗、下單參數組裝的單元測試（`pnpm test`）。

## 新增的伺服器路由（`server/index.ts`）

| 路由                                                                   | 方法 | 用途                                                                      |
| ---------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------- |
| `/api/ecpay/checkout?plan=<support\|book\|collector>&slug=<專案 slug>` | GET  | 組出綠界訂單參數與檢查碼，回傳會自動 POST 到綠界結帳頁的中繼 HTML         |
| `/api/ecpay/notify`                                                    | POST | 綠界背景通知（ReturnURL）。驗證檢查碼後回應純文字 `1\|OK`；驗證失敗回 400 |

`ClientBackURL` 導回 `/project/<slug>?ecpay=return`，`Project.tsx` 會在讀到這個參數時顯示提示 toast 並清除網址上的參數。

## 環境變數（`.env.example`）

未設定 `ECPAY_MERCHANT_ID` / `ECPAY_HASH_KEY` / `ECPAY_HASH_IV` 時，伺服器預設使用綠界官方公開的測試特店資訊（`MerchantID=2000132`），可直接測試付款流程；`ECPAY_ENV` 預設為 `test`（呼叫 `payment-stage.ecpay.com.tw`），正式上線需設為 `production` 並填入正式金鑰（呼叫 `payment.ecpay.com.tw`）。

## 已驗證項目

- `pnpm test`：新增的 6 項 ecpay 單元測試通過（含檢查碼自我驗證、竄改偵測、依方案組裝正確金額與網址）。
- `pnpm check`：TypeScript 型別檢查通過。
- `pnpm build`：client 與 server bundle 皆建置成功。
- 以 `node dist/index.js` 啟動後手動測試：
  - `GET /api/ecpay/checkout?plan=book&slug=moon-archive` 回傳的表單包含正確金額（NT$890）、品名、檢查碼格式為 64 碼大寫十六進位。
  - `POST /api/ecpay/notify` 帶入偽造 `CheckMacValue` 回傳 `0|CheckMacValueError`；帶入正確計算出的檢查碼回傳 `1|OK`。

## 尚未完成、留給下一步的事

- **訂單持久化**：目前 `/api/ecpay/notify` 驗證成功後只寫入伺服器日誌，尚未把付款結果存進資料庫或更新支持者名單／募資進度。專案目前沒有後端資料庫（會員資料在 Firebase，但金流訂單還沒接上），需要另外設計資料模型。
  簡而言之：串接跑得通，但「付款完成後平台怎麼記錄、怎麼讓創作者與支持者看到」還沒做，需要接下來規劃。
- **正式金鑰與網域**：目前是綠界測試環境；正式上線前需要向綠界申請正式特店資料，並確認 `server/index.ts` 是部署在有固定網域、可被綠界背景通知打到的伺服器上（不能是 GitHub Pages）。
