/**
 * 老東家晨光日出設計提醒：登入是啟航前的識別步驟；Firebase Web 組態為公開識別資訊，機密規則與私鑰不應放入前端。
 */
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBg9ihgYSCskFNPPntLs5mrKCFVa0sUnIg",
  authDomain: "odj-sponsor.firebaseapp.com",
  projectId: "odj-sponsor",
  storageBucket: "odj-sponsor.firebasestorage.app",
  messagingSenderId: "644648947081",
  appId: "1:644648947081:web:2a4bf26bcd8d80d461e558",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
