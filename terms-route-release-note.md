# Terms Route Release Note

2026-08-18：檢查 `gh-pages/terms/index.html` 時，發現其仍保留舊的執行期注入內容。
後續發布會以本次 GitHub Pages 正式建置產生的入口檔覆寫，使使用條款深層路由與首頁、會員工作台、關於頁、建立作品頁及隱私權政策頁一致地載入新版頁尾與手機選單資產。

已於 GitHub 編輯器確認覆寫內容包含 `#root`，並引用 `index-BYdeTHgl.js` 與 `index-PWH_H5s3.css`。
