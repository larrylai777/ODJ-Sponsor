# 整合驗證紀錄

版本：2026-08-17

## Firebase Firestore

已在 Firebase Console 開啟 `odj-sponsor` 專案，並確認目前瀏覽器登入帳號可存取該專案與 Firestore 導覽入口。會員發布功能所需的新規則已保存為 `firestore-rules-v2.rules`；此規則尚待在 Firebase Console 的 Firestore Rules 頁面檢視、測試並發布。發布後應以一個一般會員帳號驗證：可建立草稿、可從草稿送審、不可自行將作品改為公開、不可自行修改募得金額或撥付資料。

## Stripe 測試模式

已確認目前可使用的 Stripe 測試帳戶為 `Larry`，`stripe_context` 為 `acct_1RghyQQIB5qW02xF`，且 `livemode` 為 `false`。Stripe 整合規劃指出，本平台屬於由支持者付款、創作者透過平台取得款項的雙邊網路；若未來實作真實代收與創作者撥付，應採用包含 Connected Accounts、受控付款後端、Webhook、退款與爭議處理的 Marketplace／Connect 架構，而不是只依賴靜態 Payment Link。

目前網站內的 Payment Link 僅為舊有測試入口；在實際收款與撥付架構完成前，公開頁應清楚標示為測試模式，且不得將其描述為已完成的平台代收或三期撥付功能。

## 靜態預覽

在 `GITHUB_PAGES=true pnpm build` 成功後，以 `pnpm preview` 開啟 `http://localhost:4173/ODJ-Sponsor/` 時，瀏覽器標題能載入為「老東家｜故事，等你落款」，但畫面空白且沒有可見互動元素或瀏覽器主控台輸出。此為待排除項目；應先檢查建置產物入口的 JavaScript 載入路徑與 HTML 根節點，再進行 GitHub Pages 同步。

補充檢查顯示：Vite 靜態預覽不會在本機掛載 `/ODJ-Sponsor/assets/*` 子路徑，會把 JavaScript 請求回傳為 HTML，因此空白僅屬本機 `vite preview` 的子路徑行為。以 `GITHUB_PAGES=true pnpm dev --host 0.0.0.0 --port 5173` 開啟 `http://localhost:5173/ODJ-Sponsor/` 時，首頁已正常掛載並確認顯示「作品贊助平台」、「不是基金會」、平台作品專款管理、審核及五項透明度資訊。

作品詳情頁已確認顯示三個純支持金額、三期製作里程碑、五項透明度區塊，以及「新付款、平台代收與三期撥付尚未開放」的明確提示。未登入工作台已確認顯示 Google 登入、作品草稿、支持金額與送平台審核的引導；登入後的 Firestore 寫入流程仍待以實際帳號和新安全規則部署後進行端對端驗證。

Firebase 控制台已確認登入 ODJ Sponsor 專案，Cloud Firestore 的預設資料庫位於 asia-east1，現有 `users` 集合包含已建立的會員文件。新版規則草案尚未部署；部署屬會變更正式資料庫存取權限的敏感操作，必須先讓專案擁有者確認再發布。

已進入 Cloud Firestore 的預設資料庫；介面提供「資料／規則／索引」分頁，且目前可讀取 `users` 集合。下一步僅會比對並以 `firestore-rules-v2.rules` 部署新規則，這將讓作品草稿、送審及作品公開狀態的存取權限依新版流程生效。

新版規則已貼入 Firebase 規則編輯器，但尚未發布。由於網頁編輯器的隱藏文字輸入欄位沒有回傳完整模型內容，需先確認貼入操作未殘留舊規則尾端或產生額外括號，再按下「發布」。

規則編輯器目前維持「尚未發布的變更」狀態。瀏覽器無法透過一般文字節點完整擷取其內部模型，因此尚未執行發布；將改以編輯器原生全選覆寫方式重置內容，再根據 Firebase 的語法驗證與發布控制項判斷是否可安全生效。

Firebase 規則頁使用 CodeMirror。已確認第一個 CodeMirror 實例是主規則模型，且目前確有多餘的舊規則尾端；尚未發布。下一步會用該實例的原生內容設定方式完整覆寫為 `firestore-rules-v2.rules`，再確認沒有語法錯誤後發布。

已透過 CodeMirror 主模型完整覆寫規則；畫面現為 63 行，最後一行為 service 區塊的正確關閉括號，沒有先前重複的舊規則尾端。Firebase 顯示「有變更尚未發布」且「發布」按鈕可用；未見明確語法錯誤訊息。

已嘗試執行發布，但頁面仍顯示「有變更尚未發布」與未發布歷程項目，尚不能視為規則已生效。規則內容保持完整；需重新定位 Firebase 的提交控制項並確認是否有被介面提示或前端驗證阻擋。

重新載入後，頁面沒有在一般按鈕或可見文字節點中暴露「發布」控制項，但未發布變更仍存在。這表示 Firebase 主控台可能將提交行為收納到規則編輯器的自訂元件或等待非同步驗證；在未確認送出成功前，仍保持正式規則未變更的判定。

已確認規則編輯器為 Firebase 自訂元件，內部以 CodeMirror 維護內容；其一般可列舉控制器未提供可直接調用的發布方法。由於不應以未驗證的內部 API 推送生產規則，將改採使用者介面提供的鍵盤儲存／發布事件並確認歷程狀態。

新版規則已成功發布。Firebase 規則歷程最新版本顯示為「今天 • 11:54 上午」，不再標示「尚未發布的變更」；正式 Firestore 現已套用會員僅可管理自身草稿／送審、不可自行公開或改寫募得金額與撥付配置的權限限制。

## Firebase Storage

創作者建立頁採用 `proposal-covers/{uid}/{timestamp}-{safeFileName}` 保存封面；前端檢查 JPG、PNG、WebP 與 5MB 上限，Storage 規則草案亦重複強制該限制。使用者已登入 Google 帳號 `eric40311toby@gmail.com` 並可開啟 `odj-sponsor` 專案，但 `https://console.firebase.google.com/project/odj-sponsor/storage/rules` 仍停在工作區載入畫面，尚未取得可發布的 Storage 規則編輯器。

後續確認 Firebase Storage 尚未在 `odj-sponsor` 專案啟用；Firebase Console 顯示目前為 Spark 免付費方案，使用 Storage 需先升級專案定價方案。因此無法在現有方案下發布 Storage 規則或完成會員封面直接上傳的端對端驗證。

## GitHub Pages 建立頁與《第九次出生》發布狀態

在公開網址加上 `?release=d34a5e0` 後，首頁當時仍顯示舊版三個作品卡，尚未出現《第九次出生》。公開的 `/project/ninth-birth/` 當時回傳 GitHub Pages 404；但 `gh-pages` 分支的 `project/ninth-birth/index.html` 與 `create/index.html` 均已存在。GitHub Pages 的對應部署仍在建置中，因此應在部署完成後重新驗證首頁、`/project/ninth-birth/` 與 `/create/` 路由。

後續以提交 `43db0d809ed93810af3e80c84d4f91484ec4ae65` 成功完成 Pages 建置。公開首頁已列出《第九次出生》，公開作品頁也改為載入 `/ODJ-Sponsor/media/ninth-birth-cover.png`，不再引用 GitHub Pages 無法提供的 `/manus-storage/` 路徑。公開文字內容可正常取得，且未見瀏覽器主控台錯誤；視覺截圖偶爾回傳空白，仍應以另一個瀏覽器重新載入進行最後交叉確認。

## GitHub Pages 服務端發布異常

2026-08-17 15:06 UTC 後，提交 `41fec53bc12ab31d0f6c8c2d2dc330bd7872fafd` 與 `9c2f9dc4f0cc5a38b5c1cbeecc8183ce7fc62d66` 的 GitHub Pages 工作流程均在 Deploy to GitHub Pages 階段失敗。官方工作流程日誌指出部署建立 API 回傳 HTTP 503「No server is currently available to service your request」，並非靜態產物建置錯誤；官方 GitHub Status 同時通報 API Requests 與 Actions 出現重大可用性問題。提交 `bdde023f317a6c3d7dd906ad2135fb1b743469c0` 則在建置階段無法下載 `actions/jekyll-build-pages@v1`，依序收到 HTTP 503 與 HTTP 429，三次重試後失敗。最新網站建置已通過，本次公開發布待 GitHub 服務恢復後再重新執行。

## 本機首頁交叉驗證

以 GitHub Pages 子路徑設定啟動本機 Vite 預覽後，瀏覽器截圖工具偶爾呈現空白；但 DOM 已正常掛載首頁、52px 導覽列與「目前尚無公開作品。」空白狀態區塊。此現象與先前預覽截圖問題一致，不能視為程式渲染失敗；仍需在 GitHub Pages 服務恢復後以公開網址做最終手機版驗證。
