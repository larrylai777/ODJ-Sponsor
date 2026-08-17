# Firebase Google 登入實測紀錄

驗證時間：2026-08-17

- 公開首頁可顯示 `Google 登入` 按鈕與 Facebook 官方社群連結。
- 點選登入後，網站成功導向 Firebase Authentication 處理端點 `odj-sponsor.firebaseapp.com/__/auth/handler`。
- Firebase 處理端點成功轉至 Google 帳號選擇畫面，畫面顯示的 OAuth 用戶端屬於 `odj-sponsor.firebaseapp.com`，且登入回傳網域為 `larrylai777.github.io`。
- 使用者已同意以目前 Google 帳號執行測試；帳號選擇後 OAuth 彈出視窗關閉，重新開啟首頁時登入按鈕仍顯示未登入。
- 已前往 Firebase Authentication 使用者頁檢查登入紀錄；控制台當下仍在載入使用者清單，待頁面完成載入後確認是否建立帳號或回報 OAuth 錯誤。
- Firebase Authentication 使用者清單已確認建立一筆 Google 登入使用者紀錄，電子郵件為 `eric40311toby@gmail.com`；建立日期與登入日期皆為 2026 年 8 月 17 日，表示 Google OAuth、Firebase 回呼與使用者建立流程已完成。
- 自動化瀏覽器在 OAuth 彈出視窗關閉後切到 `about:blank`，因此未能在同一個自動化視窗觀察原始頁面的頭像狀態；Firebase 使用者紀錄已作為本次授權流程成功的驗證依據。
