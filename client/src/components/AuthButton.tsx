import { useEffect, useState } from "react";
import { LogIn, LogOut, UserRound } from "lucide-react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";

/**
 * 老東家晨光日出設計提醒：登入入口像一枚晨光航標；未登入時使用低飽和霧藍邊框，登入後以杏橘初始字識別，避免壓過主要提案行動。
 */

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

  if (!ready) return <div className={`h-10 animate-pulse rounded-2xl bg-[#dceaf0] ${compact ? "w-10" : "w-28"}`} aria-label="登入狀態載入中" />;

  if (!user) return <button onClick={login} disabled={pending} className={`${fullWidth ? "w-full justify-center" : ""} inline-flex h-10 items-center gap-2 rounded-2xl border border-[#88aaba] bg-white/60 px-3 text-sm font-bold text-[#25435c] transition hover:-translate-y-0.5 hover:border-[#f36b3b] hover:bg-[#fff6ef] hover:text-[#d9522d] disabled:cursor-wait disabled:opacity-70`} aria-label="使用 Google 登入">{pending ? <span className="size-4 animate-spin rounded-full border-2 border-[#f36b3b] border-t-transparent" /> : <LogIn size={17}/>}<span className={compact ? "sr-only" : ""}>{pending ? "登入中" : "Google 登入"}</span></button>;

  const displayName = user.displayName || user.email?.split("@")[0] || "已登入";
  const initial = displayName.slice(0, 1).toUpperCase();
  return <div className={`relative ${fullWidth ? "w-full" : ""}`}><button onClick={() => setOpen(!open)} className={`${fullWidth ? "w-full" : ""} inline-flex h-10 items-center gap-2 rounded-2xl border border-[#f0b26a] bg-[#fff8ed] px-2.5 text-sm font-bold text-[#25435c] transition hover:bg-[#fff1df]`} aria-expanded={open} aria-label="開啟帳號選單">{user.photoURL ? <img src={user.photoURL} alt="Google 個人頭像" className="size-6 rounded-full object-cover" referrerPolicy="no-referrer" /> : <span className="grid size-6 place-items-center rounded-full bg-[#f36b3b] text-xs text-white">{initial}</span>}<span className={compact ? "sr-only" : "max-w-24 truncate"}>{displayName}</span></button>{open && <div className={`absolute z-50 mt-2 min-w-56 rounded-[20px] border border-[#c9dee5] bg-[#f8fcfc] p-3 shadow-xl ${fullWidth ? "left-0 right-0" : "right-0"}`}><div className="flex items-center gap-2 border-b border-[#dceaf0] px-2 pb-3"><UserRound size={16} className="text-[#e15b32]"/><div className="min-w-0"><p className="truncate text-sm font-bold">{displayName}</p><p className="truncate text-xs text-[#6a879a]">{user.email}</p></div></div><button onClick={logout} className="mt-2 flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-sm font-bold text-[#49657a] transition hover:bg-[#edf6f7] hover:text-[#d9522d]"><LogOut size={16}/> 登出</button></div>}</div>;
}
