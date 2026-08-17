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

最新提交 `fbf92b80f2bf3dce172f708994985fce067f8a3f` 的工作流程 `32042571976` 也在設定階段失敗：GitHub 管理的 `dynamic/pages/pages-build-deployment` 三次下載 `actions/jekyll-build-pages@v1` 時連續收到兩次 429（Too Many Requests）及一次 502（Bad Gateway）。失敗發生於網站檔案建置前，因此不能藉由修改作品清單、導覽列或工作台程式碼排除；而該工作流程不屬於儲存庫可編輯的 YAML，無法安全固定動作版本。

2026-08-17 15:52 UTC 以空白發布提交 `925b9d73c9a9a12cb38a79d0382825c2212a8a72` 重新觸發 GitHub Pages 後，工作流程 `32043643818` 已成功完成。公開首頁以 `release=925b9d7` 驗證已顯示「目前尚無公開作品」的空白狀態與建立提案入口；四個已移除作品路由（ink-garden、moon-tide、forest-rain、ninth-birth）均回傳 HTTP 404。公開首頁也已驗證導覽列向下滑會套用收起狀態、向上回滑會立即恢復可見。

2026-08-17 15:59 UTC 以已登入的 Google 帳戶開啟公開工作台後，介面正確顯示「還沒有作品草稿」。這代表該帳戶目前在 Firestore 中沒有任何 `proposals` 文件，因此畫面沒有可供呈現編輯或刪除操作的草稿卡。先前截圖所示的十筆未命名作品卡不在目前帳戶的實際資料結果中，需先建立或找回對應帳戶的草稿後，才能進一步驗證卡片上的操作。

## 本機首頁交叉驗證

以 GitHub Pages 子路徑設定啟動本機 Vite 預覽後，瀏覽器截圖工具偶爾呈現空白；但 DOM 已正常掛載首頁、52px 導覽列與「目前尚無公開作品。」空白狀態區塊。此現象與先前預覽截圖問題一致，不能視為程式渲染失敗；仍需在 GitHub Pages 服務恢復後以公開網址做最終手機版驗證。

本機瀏覽器目前以桌面寬度啟動，依響應式設定不渲染手機選單觸發按鈕；因此無法以該視窗量測右上角工作台入口，需改在 375px 手機尺寸的公開頁面完成最後視覺驗證。

另以本機預覽暫時覆寫桌面斷點、模擬手機選單完成 DOM 量測：右上角「進入創作者工作台」按鈕尺寸為 124 × 36px，位於 x=1064 至 1188；關閉按鈕位於 x=1196 至 1232，兩者保留 8px 間距，不會重疊。

2026-08-17 16:12 UTC 已透過 Firebase 控制台確認目前登入的 Google 帳戶可存取 `odj-sponsor` 專案與 Firestore 介面。Sandbox 中的 Firebase CLI 尚無授權帳戶；若需從命令列發布規則，必須另行完成 CLI 登入，也可改由 Firebase 控制台的 Rules 頁面發布。

2026-08-17 16:19 UTC 已取得使用者同意發布管理員審核規則；Firebase Rules 頁面在目前瀏覽器工作階段持續載入，尚未出現規則編輯器與發布控制項，尚未執行任何規則變更。

以瀏覽器主控台確認頁面載入完成後，網址雖為 Firestore Rules 路徑，實際 DOM 仍呈現專案總覽內容。改用帶有 `/u/0/` 的帳戶路徑仍相同，表示目前 Firebase Console 的前端導覽未正確開啟 Rules 編輯器；尚未變更正式規則。

控制台導覽中的 Firestore 項目目前只提供 `overview#` 動態連結，未提供可直接存取的 Rules 編輯網址；以該項目觸發導覽也沒有載入資料庫或規則頁，仍無法安全發布。

Google Cloud Console 的直接入口 `https://console.cloud.google.com/firestore/databases/-default-/security/rules?project=odj-sponsor` 已導向正確的 `(default)` Firestore 安全規則頁；頁面目前仍在載入，尚未顯示規則文字或發布按鈕。

Google Cloud 規則頁的文件狀態停留於 `interactive`，頁面文字只包含控制台通用導覽，且最近網路資源未包含 Firestore Rules API 回應；顯示問題位於控制台前端資料載入階段，未顯示權限拒絕或規則語法錯誤。

Google Cloud Console 已確認以具專案權限的帳戶登入，且目前選取專案為 `ODJ Sponsor`（專案 ID：`odj-sponsor`）。Cloud Shell 控制項可用，將作為發布已確認 Firestore 規則的替代途徑。

Google Cloud Console 已完成完整初始化，頁面顯示可用的「啟用 Cloud Shell」控制項；目前登入帳戶與 `odj-sponsor` 專案一致，可嘗試透過 Cloud Shell 執行規則發布。

Cloud Shell 已由控制台啟用，但終端面板目前仍顯示初始化載入狀態，尚未提供可輸入的命令提示字元；此時無法從該面板發布規則，也未出現權限拒絕訊息。

已依確認按下 Cloud Shell 授權。瀏覽器完成 Google OAuth 跳轉後回到空白中繼頁；需重新開啟主控台，確認原 Cloud Shell 工作階段是否已接續並提供終端。

重新回到主控台後，Cloud Shell 終端已建立，工作階段專案正確設為 `odj-sponsor`。授權提示再次出現，已再次依既有確認觸發 OAuth 跳轉；待此跳轉完成後，才可在終端中輸入 Firebase CLI 指令。

第二次 OAuth 跳轉未保留可用的 Google 登入工作階段。重新開啟主控台時，Google 帳戶選擇器將原帳戶標記為「Signed out」，因此 Cloud Shell 尚無法取得憑證或發布正式規則；需要由帳戶持有人完成重新登入。

帳戶持有人重新登入並回到主控台後，Cloud Shell 終端仍顯示 `odj-sponsor` 工作階段，但其憑證授權視窗再次出現。按下授權後又導向空白 OAuth 回呼頁，沒有返回可輸入的終端；尚未執行任何 Firebase CLI 指令，也未變更正式 Firestore 規則。

後續帳戶登入已成功通過，瀏覽器可到達 Google Cloud Firestore Rules 的直接網址；但該頁目前只顯示空白載入畫面，沒有可見規則編輯器、語法狀態或發布控制項。正式規則仍未變更。

規則頁載入完成後，歷程中 11:54:53 的版本標示為「運作中」。目前檢視的 13:58:15 未啟用規則集雖有 63 行，但經比對不含管理員 UID 白名單、跨使用者提案讀取或審核狀態轉換規則；不得直接發布，須先以本機 `firestore-rules-v2.rules` 完整覆寫。

目前與歷史規則集皆為唯讀；嘗試聚焦 13:58:15 的未啟用規則集時，控制台明確提示無法編輯。下一步需要使用「新的規則集」建立可編輯版本，再貼入已審核的 v2 規則並發布。

已建立一個「剛剛／未發布」的全新規則集。此規則集可編輯，控制台提供「發布」與「捨棄」控制項；目前仍是預設的拒絕所有存取規則，尚未貼入 v2 管理員審核規則。

已選取新規則集的預設內容並嘗試一次性貼入完整 v2 規則，但瀏覽器輸入操作在 60 秒後逾時。草稿尚未發布；必須先以編輯器內容確認貼入是否成功或部分成功，再採取不同的輸入方法。

內容檢查顯示貼入確實只部分成功：管理員 UID 與部分函式已寫入，但內容在 `adminReviewsProposal()` 的狀態條件中截斷，未包含欄位白名單、集合比對或任何 `match` 權限區塊。此草稿語法不完整且發布控制項不可用；不得發布，須以不同輸入方式完整覆寫。

已改用編輯器的單一原生文字插入操作覆寫整份草稿；控制台回傳插入成功，字元數為 2,835，與本機 v2 規則草案相符。仍需驗證完整內容、語法與發布按鈕狀態，尚未對正式資料庫套用任何變更。

驗證發現單一插入操作未取代既有草稿，而是附加在前次截斷內容之後，導致重複的 `rules_version` 與語法錯誤。草稿不可發布；目前已重新選取整份編輯器內容，下一步應先刪除所有文字，再以單一插入操作寫入 v2 規則。

已嘗試以鍵盤刪除選取內容，但控制台編輯器仍保有兩份 `rules_version`，清空未生效。頁面也未暴露可直接使用的 `window.monaco` 或 Angular 偵錯 API，不能以全域模型安全覆寫；後續需改用編輯器的可靠選取與輸入互動方式。

改用功能等價的精簡規則再次嘗試覆寫，但控制台輸入仍在 60 秒後逾時。檢查結果顯示這次已清除先前重複內容，但新規則在提案集合區塊之前截斷（可見 1,520 字元，尚無 `/proposals` 與結尾大括號）；草稿仍不可發布。

截斷內容的結尾剛好停在 `match ` 關鍵字後，因此已以一次短文字插入補上書籤、贊助紀錄、作品提案集合的權限區塊及三層結尾大括號。草稿仍未發布，下一步必須確認其語法無誤並具備 v2 規則所需的全部限制。

規則完整性與控制台語法檢查均無錯誤後，已取得使用者再次確認並執行正式發布。控制台目前顯示「載入中」，尚待確認新規則集是否成為運作中版本。

已確認 Firestore 控制台顯示「已發布規則集」，新版本時間為今天 16:55:47，並標示為「運作中」。正式資料庫現在套用管理員可跨使用者讀取待審提案、並僅能核准公開或退回補件的審核規則。

已以同一個 Google 帳戶開啟 Firebase Authentication 使用者頁。頁面已載入欄位，包含「使用者 UID」，但使用者資料列仍在讀取，尚未能從控制台畫面再次取得 UID；前端與已發布規則目前皆設定為 `FQqJ6FT5ZcWTKULuKpz92whv1KH2`。

Firebase Authentication 使用者清單已完成載入，確認 `eric40311toby@gmail.com` 的 Firebase UID 正是 `FQqJ6FT5ZcWTKULuKpz92whv1KH2`。此 UID 與 `adminAccess.ts` 的前端管理員白名單及正式 Firestore 規則完全一致。

已將管理後台原始碼推送至 `main` 分支（`e38d969`），並將含 `/admin/` 與 `/admin/reviews/` 深層入口的靜態建置檔推送至 `gh-pages` 分支（`a08b144`）。初次開啟公開管理網址仍回傳舊版 404；GitHub Pages 的最新部署工作流程當時仍在執行，需待其完成後再次驗證。

GitHub Pages 工作流程 `32048239623` 已成功完成。公開網址 `https://larrylai777.github.io/ODJ-Sponsor/admin/reviews/` 已正確載入管理員審核後台，登入帳戶被辨識為管理員，並能讀取目前唯一的 `under_review` 提案《第九次出生》與其透明度資料。核准與退回按鈕均已顯示，尚未執行會寫入 Firestore 的審核決定。

已依管理員明確確認，對《第九次出生》執行「核准公開」，並寫入審核意見「五項透明度資訊完整，核准公開。」。公開後台顯示成功訊息、待審案件數由 `01` 更新為 `00`，且案件自待審清單移除；核准公開的完整端對端流程已完成驗證。

首頁同步版本已部署至 GitHub Pages（`650e7bf`）。公開首頁已讀取 Firestore 中狀態為 `published` 的《第九次出生》，並顯示其標題、創作者、支持目標、最低支持額及三項製作透明度。提案中的 `coverUrl` 為 Facebook 分享頁而不是圖片檔，瀏覽器無法載入封面，需在首頁加入失效封面替代顯示。

編輯器 DOM 包含 Angular 的 `__ngContext__`，但不是可直接逐項巡覽的陣列，首次檢查已安全失敗，未更動草稿。後續會改以物件鍵值方式辨識元件持有的編輯器或模型實例。

後續檢查確認該節點的 Angular 上下文只保留數值索引，沒有可安全存取的元件執行個體；全域 `window.monaco` 與 AMD `require` 亦不可用。頁面確實載入 Monaco 相關腳本，但目前應改採控制台 UI 或以分段鍵盤輸入完成草稿。
