# Stripe Payment Link 測試設定紀錄

> 狀態：測試模式。以下物件不可用於正式收款；公開 Payment Link 僅可用 Stripe 測試卡驗證。

## 已建立的一次性贊助價格

| 方案 | 金額 | 幣別 | Price ID | Product ID | 環境 |
| --- | ---: | --- | --- | --- | --- |
| 小額支持 | 390 | TWD | `price_1U5O4ZQIB5qW02xFIVnEwJR0` | `prod_V5ZCslqioyNGCq` | Stripe Test mode |
| 實體書收藏 | 890 | TWD | `price_1U5O4sQIB5qW02xFG8SZXp5j` | `prod_V5ZDdAYr1kCdoC` | Stripe Test mode |
| 藏書人方案 | 1,690 | TWD | `price_1U5O57QIB5qW02xFuRRX4UUy` | `prod_V5ZDt4ivtS8oWo` | Stripe Test mode |

三筆價格均為一次性付款（`type: one_time`），且帶有 `platform=odj_sponsor`、`environment=test` 與方案識別的中繼資料。Stripe 的 TWD 價格以分為最小貨幣單位，因此 API 的 `unit_amount` 依序為 `39000`、`89000`、`169000`。

## 已建立的公開測試 Payment Link

| 方案 | Payment Link ID | 公開測試結帳網址 |
| --- | --- | --- |
| 小額支持 NT$390 | `plink_1U5O5SQIB5qW02xF1ZdzPwgo` | https://buy.stripe.com/test_6oU00l82T7jw8kb8C15gc00 |
| 實體書收藏 NT$890 | `plink_1U5O5fQIB5qW02xFevL8OI8K` | https://buy.stripe.com/test_3cI3cxdndbzMdEvbOd5gc01 |
| 藏書人方案 NT$1,690 | `plink_1U5O5vQIB5qW02xFgZfwnPTp` | https://buy.stripe.com/test_7sY00l1Ev6fs1VN5pP5gc02 |

首次建立的 `390`、`890`、`1690` 單位價格是以 API 的最小貨幣單位送出，金額不足 Payment Link 的最低換匯門檻，不能完成結帳。它們未被接到網站按鈕；正式測試使用上表列出的正確價格與連結。

## 結帳頁驗證

2026-08-17 已以瀏覽器開啟小額支持測試連結，Stripe Checkout 顯示「老東家｜小額支持（測試）」與「NT$390.00」，並標示為 Sandbox。僅檢視結帳頁，未填寫顧客資料、卡號或送出付款。來源：https://buy.stripe.com/test_6oU00l82T7jw8kb8C15gc00

實體書收藏與藏書人方案也已分別驗證：Stripe Checkout 顯示「老東家｜實體書收藏（測試）」與「NT$890.00」，以及「老東家｜藏書人方案（測試）」與「NT$1,690.00」。兩者均標示為 Sandbox，僅檢視頁面，未輸入顧客資料、卡號或送出付款。來源：https://buy.stripe.com/test_3cI3cxdndbzMdEvbOd5gc01 、https://buy.stripe.com/test_7sY00l1Ev6fs1VN5pP5gc02
