import { useEffect, useState } from "react";
import { ArrowRight, LogIn, PenLine } from "lucide-react";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";

/** Apple 式產品敘事提醒：提案是全站唯一高辨識主行動；曙光杏橘集中在此，登入後仍保持一條直接通往工作台的路徑。 */

type ProposalEntryProps = { fullWidth?: boolean; className?: string; label?: string; loginLabel?: string; showUser?: boolean };
const dashboardPath = () => `${import.meta.env.BASE_URL}dashboard`;

export default function ProposalEntry({ fullWidth = false, className = "", label = "我要提案", loginLabel, showUser = false }: ProposalEntryProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setReady(true); }), []);
  const continueToDashboard = () => window.location.assign(dashboardPath());
  const handleProposalEntry = async () => {
    if (user) return continueToDashboard();
    setPending(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast("已登入，正在前往提案工作台", { description: "你可以先建立並儲存自己的提案草稿。" });
      continueToDashboard();
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";
      if (code !== "auth/popup-closed-by-user") toast("Google 登入未完成", { description: "請確認瀏覽器允許彈出視窗後再試一次。" });
    } finally { setPending(false); }
  };
  const icon = pending ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : user ? <ArrowRight size={17} /> : <LogIn size={17} />;
  const text = pending ? "登入中" : ready && user ? label : loginLabel || `${label} · Google 登入`;
  const displayName = user?.displayName || user?.email?.split("@")[0] || "已登入";
  const initial = displayName.slice(0, 1).toUpperCase();
  const account = (showUser || (fullWidth && label === "我要提案")) && ready && user ? <span className="flex min-w-0 items-center gap-2"><span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white/90 text-xs font-bold text-[#172846]">{user.photoURL ? <img src={user.photoURL} alt="Google 個人頭像" className="size-full object-cover" referrerPolicy="no-referrer"/> : initial}</span><span className="truncate">{displayName}</span></span> : null;
  return <button onClick={handleProposalEntry} disabled={!ready || pending} className={`${fullWidth ? "w-full justify-between" : ""} inline-flex items-center gap-2 rounded-2xl bg-[#f36b3b] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#d9522d] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 ${className}`}>{account}<span className="inline-flex items-center gap-2">{icon}<span>{text}</span></span></button>;
}
