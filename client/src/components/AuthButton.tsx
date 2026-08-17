import { useEffect, useState } from "react";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";

/** Apple 式產品敘事提醒：帳號操作是安靜的次行動；以淺灰表面與清楚文字承接登入，不與曙光杏橘的主要提案行動競爭。 */

type AuthButtonProps = { compact?: boolean; fullWidth?: boolean };

export default function AuthButton({ compact = false, fullWidth = false }: AuthButtonProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setReady(true); }), []);

  const login = async () => {
    setPending(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast("已登入老東家", { description: "歡迎回來。你現在可以保留支援偏好與提案流程。" });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";
      if (code !== "auth/popup-closed-by-user") toast("Google 登入未完成", { description: "請確認瀏覽器允許彈出視窗，然後再試一次。" });
    } finally { setPending(false); }
  };

  const logout = async () => {
    await signOut(auth);
    setOpen(false);
    toast("已登出", { description: "此裝置上的登入狀態已清除。" });
  };

  if (!ready) return <div className={`h-10 animate-pulse rounded-2xl bg-[#f5f5f7] ${compact ? "w-10" : "w-28"}`} aria-label="登入狀態載入中" />;

  if (!user) return <button onClick={login} disabled={pending} className={`${fullWidth ? "w-full justify-center" : ""} inline-flex h-10 items-center gap-2 rounded-2xl bg-[#f5f5f7] px-4 text-sm font-semibold text-[#1d1d1f] transition duration-200 hover:bg-[#e8e8ed] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70`} aria-label="使用 Google 登入">{pending ? <span className="size-4 animate-spin rounded-full border-2 border-[#1d1d1f] border-t-transparent" /> : <LogIn size={16}/>}<span className={compact ? "sr-only" : ""}>{pending ? "登入中" : "登入"}</span></button>;

  const displayName = user.displayName || user.email?.split("@")[0] || "已登入";
  const initial = displayName.slice(0, 1).toUpperCase();
  return <div className={`relative ${fullWidth ? "w-full" : ""}`}><button onClick={() => setOpen(!open)} className={`${fullWidth ? "w-full" : ""} inline-flex h-10 items-center gap-2 rounded-2xl bg-[#f5f5f7] px-2.5 text-sm font-semibold text-[#1d1d1f] transition hover:bg-[#e8e8ed] active:scale-[0.97]`} aria-expanded={open} aria-label="開啟帳號選單">{user.photoURL ? <img src={user.photoURL} alt="Google 個人頭像" className="size-6 rounded-full object-cover" referrerPolicy="no-referrer" /> : <span className="grid size-6 place-items-center rounded-full bg-[#172846] text-xs text-white">{initial}</span>}<span className={compact ? "sr-only" : "max-w-24 truncate"}>{displayName}</span></button>{open && <div className={`absolute z-50 mt-2 min-w-60 rounded-[20px] border border-[#d2d2d7] bg-white p-3 odj-shadow ${fullWidth ? "left-0 right-0" : "right-0"}`}><div className="flex items-center gap-2 border-b border-[#e8e8ed] px-2 pb-3"><UserRound size={16} className="text-[#6e6e73]"/><div className="min-w-0"><p className="truncate text-sm font-semibold">{displayName}</p><p className="truncate text-xs text-[#6e6e73]">{user.email}</p></div></div><button onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-semibold text-[#424245] transition hover:bg-[#f5f5f7]"><LogOut size={16}/> 登出</button></div>}</div>;
}
