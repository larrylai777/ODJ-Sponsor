# Firebase Google 登入設定紀錄

更新時間：2026-08-17

- 使用者選擇建立獨立 Firebase 專案，而非使用既有的 `rcobo-afc05` 或 `larry-51145` 專案。
- Firebase 建立流程目前使用顯示名稱 `ODJ Sponsor` 與自動產生的專案 ID `odj-sponsor`。
- Gemini in Firebase 與 Google 登入無關，已在建立流程中關閉；Google Analytics 也已關閉。
- Firebase 已完成建立，顯示名稱為 `ODJ Sponsor`、專案 ID 為 `odj-sponsor`。
- 控制台顯示「Firebase 專案已準備就緒」；下一步為進入專案並啟用 Authentication 的 Google 供應商。
- Firebase Authentication 供應商設定頁：https://console.firebase.google.com/project/odj-sponsor/authentication/providers
- 專案建立完成後的必要設定：啟用 Authentication 的 Google 登入供應商、加入 `larrylai777.github.io` 為授權網域、建立 Web App 取得 Firebase Web 設定值，並在靜態網站加入登入流程。
- 目前公開站仍為 GitHub Pages；Firebase 專案與 Google 登入資料會獨立於既有 Firebase 專案。
