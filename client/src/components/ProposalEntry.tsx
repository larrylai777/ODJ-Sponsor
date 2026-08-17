import { useEffect, useState } from "react";
import { LogIn, PenLine } from "lucide-react";
import { onAuthStateChanged, signInWithPopup, type User } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "@/lib/firebase";

/**
 * 老東家晨光日出設計提醒：提案是啟航按鈕；杏橘行動色只用於明確前進，登入與前往工作台必須是一條不中斷的航線。
 */

type ProposalEntryProps = {
  fullWidth?: boolean;
  className?: string;
  label?: string;
  loginLabel?: string;
};

const dashboardPath = () => `${import.meta.env.BASE_URL}dashboard`;

export default function ProposalEntry({ fullWidth = false, className = "", label = "我要提案", loginLabel }: ProposalEntryProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    setReady(true);
  }), []);

  const continueToDashboard = () => {
    window.location.assign(dashboardPath());
  };

  const handleProposalEntry = async () => {
    if (user) {
      continueToDashboard();
      return;
    }

    setPending(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast("已登入，正在前往提案工作台", { description: "你可以先建立並儲存自己的提案草稿。" });
      continueToDashboard();
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "unknown";
      if (code !== "auth/popup-closed-by-user") {
        toast("Google 登入未完成", { description: "請確認瀏覽器允許彈出視窗後再試一次。" });
      }
    } finally {
      setPending(false);
    }
  };

  const icon = pending ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : user ? <PenLine size={17} /> : <LogIn size={17} />;
  const text = pending ? "登入中" : ready && user ? label : loginLabel || `${label} · Google 登入`;

  return <button onClick={handleProposalEntry} disabled={!ready || pending} className={`${fullWidth ? "w-full justify-center" : ""} inline-flex items-center gap-2 rounded-2xl border border-[#f36b3b] bg-[#f36b3b] px-4 py-2 text-sm font-bold text-[#fffaf3] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d9522d] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 ${className}`}>
    {icon}<span>{text}</span>
  </button>;
}
