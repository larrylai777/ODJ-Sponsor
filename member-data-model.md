# 老東家會員與創作者提案資料模型

版本：0.1（2026-08-17）

## 目的與範圍

本模型把既有 Google 登入帳號作為唯一識別來源，讓讀者保存收藏、查看個人贊助紀錄，並讓創作者建立或送出提案。資料庫僅保存會員自行建立的資料與必要帳號公開資訊；公開專案內容仍可維持靜態展示，不需要對所有訪客開放寫入權限。

## 資料結構

### `users/{uid}`

每個 Firebase Authentication 使用者只對應一份個人檔案。欄位包含 `displayName`、`email`、`photoURL`、`role`（預設 `member`）、`createdAt` 與 `lastLoginAt`。使用者僅能讀寫自己的文件，且不可自行將角色變更為管理者。

### `users/{uid}/favorites/{projectId}`

收藏以專案識別碼為文件 ID，欄位包含 `projectId` 與 `createdAt`。使用者只能讀寫自己的收藏，避免把讀者的興趣偏好公開給其他使用者。

### `users/{uid}/pledges/{pledgeId}`

贊助紀錄的欄位包括 `projectId`、`projectTitle`、`planId`、`planName`、`amount`、`status`、`createdAt` 與 `updatedAt`。目前網站尚未有付款功能；此集合只用於保留登入會員在原型流程中建立的「支持意向」或未來由受控付款後端寫入的正式紀錄。前端不能自行把紀錄標示為已付款。

### `proposals/{proposalId}`

每個會員作品以獨立文件保存，必填創作者欄位為 `authorUid`、`title`、`category`、`summary`、`description`、`creatorName`、`targetAmount`、`minimumSupportAmount`、`budgetUse`、`currentStage`、`nextMilestone`、`estimatedCompletion`、`status`、`createdAt` 與 `updatedAt`。`coverUrl` 可在草稿階段暫缺，但送審前建議填入。`totalRaised` 由受控付款後端計算，會員前端不可寫入。

狀態依序為 `draft`、`under_review`、`revision_requested`、`published`、`paused` 與 `completed`。會員只可建立自己的 `draft`，並編輯 `draft` 或 `revision_requested`；送審只允許從 `draft`／`revision_requested` 轉為 `under_review`。核准公開、暫停、完成、退回原因及公開募得金額均由管理端或受控後端寫入。

每份作品包含固定 `disbursementPlan`：啟動期 30%、核心製作期 40%、定稿／公開準備期 30%。資料模型保留未來用於受控撥付的欄位；第一版僅公開規則與進度，不讓瀏覽器建立付款、撥款、退款或改寫金額。

## 權限與資料治理

Google 登入只作為 `request.auth.uid` 的身分基礎。所有會員資料與子集合都須以「擁有者 UID 等於已登入 UID」作為讀寫條件。角色、付款狀態、公開募得金額、審核結果、退款、撥付狀態及任何管理欄位必須由受控後端或管理工具寫入，不能交由瀏覽器客戶端宣告。`firestore-rules-v2.rules` 是本輪會員發布功能需發布的規則草案；發布前應在 Firebase Emulator 或 Rules Playground 驗證。

在正式開放交易前，平台只允許登入、收藏、支持意向及創作者提案；不得收集收件地址、統一編號、銀行帳戶、信用卡或其他付款資料。隱私權政策與網站使用條款必須同步說明這些資料用途、保存方式與刪除聯絡窗口。

## 資料庫位置依據

預計建立的 Cloud Firestore 預設資料庫採 Native mode，位置選擇 `asia-east1`（Taiwan）。依 Firebase 官方位置文件，資料庫位置應接近使用者與服務，且預設 Cloud Firestore 資料庫的區域設定在建立後不可變更；`asia-east1` 列為台灣區域。來源：https://firebase.google.com/docs/firestore/locations（查閱：2026-08-17）。

Firebase 控制台建立精靈提供 Standard 與 Enterprise 版本。會員、收藏、支持意向與提案草稿僅需標準文件讀寫與自動索引，採 Standard 版；精靈同時提示其安全預設會拒絕所有第三方讀寫要求，後續再以 Firebase Authentication 的 UID 權限規則精準開放使用者自己的資料。（Firebase 控制台查閱：2026-08-17）

建立精靈在資料庫位置步驟預設顯示 `nam5 (United States)`，並再次警示位置設定後不可變更。本專案已獲確認應改選 `asia-east1 (Taiwan)`，不得使用預設美國位置。（Firebase 控制台查閱：2026-08-17）

Firebase 建立精靈現已確認選取 `asia-east1 (Taiwan)`，資料庫 ID 為預設 `(default)`；下一步將進入安全模式設定。位置選擇與使用者確認相符。（Firebase 控制台查閱：2026-08-17）

Firestore 已以「正式版模式」開始佈建；建立初始規則為 `allow read, write: if false;`，在自訂擁有者規則發布前，會拒絕全部第三方用戶端讀寫。（Firebase 控制台查閱：2026-08-17）

Firebase 控制台仍顯示「正在設定安全性規則」的佈建狀態；在這段期間沒有開放任何公開資料讀寫。（Firebase 控制台查閱：2026-08-17）

Firestore 已完成 `(default)` 資料庫的建立，位置為 `asia-east1`。會員資料規則已在控制台中設定為：`users/{uid}` 與 `bookmarks/{uid}/items/{itemId}` 僅限相同 Firebase Auth UID 讀寫；`pledges/{uid}/records/{recordId}` 僅限相同 UID 讀取且用戶端禁止寫入；`proposals/{proposalId}` 的建立、讀取、修改與刪除均以 `authorUid` 與 Firebase Auth UID 相符為前提，且更新時不可變更作者 UID；其餘所有路徑維持拒絕讀寫。發布動作完成後，應以控制台歷程的最新版本為準。（Firebase 控制台查閱：2026-08-17）

## 已實作的工作台串接

前端會員工作台路徑為 `/dashboard`。使用 Google 登入後，前端會以登入帳號的 UID 建立或更新 `users/{uid}` 的基本識別欄位；工作台以即時監聽讀取 `bookmarks/{uid}/items`、`pledges/{uid}/records` 與 `proposals` 中 `authorUid` 等於登入 UID 的文件。建立「提案草稿」時，前端只會新增包含目前 UID 的 `authorUid`、草稿狀態與時間戳記的文件。收藏寫入介面、提案內容編輯器及受控付款後端仍待後續階段完成。
