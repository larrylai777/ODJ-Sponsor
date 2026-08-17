import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, BookOpen, CircleUserRound, FilePenLine, Heart, LogIn, PackageCheck, PenLine, Plus, Sparkles } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, where, type DocumentData } from "firebase/firestore";
import { toast } from "sonner";
import AuthButton from "@/components/AuthButton";
import ProposalEntry from "@/components/ProposalEntry";
import SiteFooter from "@/components/SiteFooter";
import { auth, db } from "@/lib/firebase";

/**
 * 老東家晨光日出設計提醒：工作台是個人航圖，不是密集後台；霧白留作閱讀面，深靛承載狀態，杏橘只標示下一個可行動的創作節點。
 */

type BookmarkRecord = {
  id: string;
  title: string;
  projectSlug?: string;
  category?: string;
  coverUrl?: string;
  addedAt?: { toDate?: () => Date };
};

type PledgeRecord = {
  id: string;
  projectTitle?: string;
  rewardTitle?: string;
  amount?: number;
  status?: string;
  createdAt?: { toDate?: () => Date };
};

type ProposalRecord = {
  id: string;
  title?: string;
  format?: string;
  status?: string;
  updatedAt?: { toDate?: () => Date };
};

const basePath = import.meta.env.BASE_URL;
const projectPath = (slug: string) => `${basePath}project/${slug}`;
const formatDate = (value?: { toDate?: () => Date }) => value?.toDate?.().toLocaleDateString("zh-TW", { month: "short", day: "numeric" }) ?? "尚未記錄";

function recordFromSnapshot<T>(snapshot: { id: string; data: () => DocumentData }) {
  return { id: snapshot.id, ...snapshot.data() } as T;
}

function LoadingPanel() {
  return <div className="grid min-h-screen place-items-center bg-[#f7fbfb] text-[#405b70]"><div className="flex items-center gap-3 text-sm font-bold"><span className="size-5 animate-spin rounded-full border-2 border-[#f36b3b] border-t-transparent" /> 正在整理你的晨光航圖</div></div>;
}

function SignedOutPanel() {
  return <div className="min-h-screen bg-[#f7fbfb] text-[#172846]"><main className="container grid min-h-[78vh] place-items-center py-12"><div className="max-w-md rounded-[28px] border border-[#c9dee5] bg-white/80 p-8 shadow-[0_24px_60px_rgba(40,70,88,.12)]"><div className="grid size-12 place-items-center rounded-2xl bg-[#fff3df] text-[#e15b32]"><LogIn size={23}/></div><p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-[#d85c36]">MEMBER ACCESS</p><h1 className="font-display mt-3 text-3xl font-black tracking-[-0.04em]">先登入，再開啟你的工作台。</h1><p className="mt-4 text-sm leading-7 text-[#607a8d]">工作台會保留你的個人帳號、收藏、支持紀錄與提案草稿。未登入者將返回首頁。</p><div className="mt-7"><ProposalEntry fullWidth label="使用 Google 登入" loginLabel="使用 Google 登入" /></div><a href={basePath} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#49657a] transition hover:text-[#d9522d]"><ArrowLeft size={16}/> 回到首頁</a></div></main><SiteFooter /></div>;
}

function DataCard({ icon, eyebrow, title, children, action }: { icon: React.ReactNode; eyebrow: string; title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return <section className="rounded-[28px] border border-[#c9dee5] bg-white/72 p-5 shadow-[0_14px_32px_rgba(36,67,86,.07)] sm:p-6"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-[#edf7f8] text-[#d9522d]">{icon}</span><div><p className="font-mono text-[10px] tracking-[0.16em] text-[#d85c36]">{eyebrow}</p><h2 className="font-display mt-1 text-xl font-bold">{title}</h2></div></div>{action}</div><div className="mt-5">{children}</div></section>;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [pledges, setPledges] = useState<PledgeRecord[]>([]);
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [creatingDraft, setCreatingDraft] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => {
    setUser(nextUser);
    setReady(true);
  }), []);

  useEffect(() => {
    if (!ready || user) return;
    const timeout = window.setTimeout(() => window.location.assign(basePath), 1800);
    return () => window.clearTimeout(timeout);
  }, [ready, user]);

  useEffect(() => {
    if (!user) return;
    const profile = doc(db, "users", user.uid);
    void setDoc(profile, {
      displayName: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true }).catch(() => toast("會員資料暫時無法同步", { description: "請稍後重新整理；你的 Google 登入狀態不受影響。" }));

    const stopBookmarks = onSnapshot(collection(db, "bookmarks", user.uid, "items"), (snapshot) => {
      setBookmarks(snapshot.docs.map((item) => recordFromSnapshot<BookmarkRecord>(item)));
    }, () => toast("目前無法讀取收藏", { description: "請確認網路狀態後再試一次。" }));

    const stopPledges = onSnapshot(collection(db, "pledges", user.uid, "records"), (snapshot) => {
      setPledges(snapshot.docs.map((item) => recordFromSnapshot<PledgeRecord>(item)));
    }, () => toast("目前無法讀取支持紀錄", { description: "正式贊助開放後，紀錄會在這裡顯示。" }));

    const proposalQuery = query(collection(db, "proposals"), where("authorUid", "==", user.uid));
    const stopProposals = onSnapshot(proposalQuery, (snapshot) => {
      setProposals(snapshot.docs.map((item) => recordFromSnapshot<ProposalRecord>(item)).sort((a, b) => (b.updatedAt?.toDate?.().getTime() ?? 0) - (a.updatedAt?.toDate?.().getTime() ?? 0)));
    }, () => toast("目前無法讀取提案草稿", { description: "請確認登入狀態後重新整理。" }));

    return () => { stopBookmarks(); stopPledges(); stopProposals(); };
  }, [user]);

  const displayName = useMemo(() => user?.displayName || user?.email?.split("@")[0] || "老東家會員", [user]);
  const initial = displayName.slice(0, 1).toUpperCase();

  const createDraft = async () => {
    if (!user || creatingDraft) return;
    setCreatingDraft(true);
    try {
      await addDoc(collection(db, "proposals"), {
        authorUid: user.uid,
        title: "未命名提案",
        format: "小說或衍生周邊",
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast("已建立提案草稿", { description: "提案工作區正在建置中；草稿已安全儲存在你的帳號下。" });
    } catch {
      toast("建立草稿失敗", { description: "請確認登入狀態與網路連線後再試一次。" });
    } finally {
      setCreatingDraft(false);
    }
  };

  if (!ready) return <LoadingPanel />;
  if (!user) return <SignedOutPanel />;

  return <div className="min-h-screen overflow-x-hidden bg-[#f7fbfb] text-[#172846]"><header className="sticky top-0 z-40 border-b border-[#bfd6df]/80 bg-[#f8fcfc]/90 backdrop-blur-xl"><div className="container flex h-[72px] items-center justify-between gap-4"><a href={basePath} className="group inline-flex items-center gap-3"><img src={`${basePath}media/odj-sunrise-icon.png`} alt="老東家日出圖示" className="size-10 rounded-[14px] object-cover ring-1 ring-[#e4ab52]/45 transition group-hover:-translate-y-0.5"/><span className="font-display text-[21px] font-black tracking-[0.08em]">老東家</span></a><div className="flex items-center gap-2"><a href={basePath} className="hidden items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold text-[#49657a] transition hover:bg-[#edf6f7] hover:text-[#d9522d] sm:inline-flex"><ArrowLeft size={16}/> 繼續探索</a><AuthButton compact /></div></div></header><main><section className="relative overflow-hidden border-b border-[#bfd6df] bg-[#edf7f8]"><div className="absolute -right-20 -top-24 size-80 rounded-full bg-[#ffd27b]/35 blur-3xl"/><div className="container relative grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><div><p className="font-mono text-[11px] tracking-[0.18em] text-[#d85c36]">MEMBER WORKBENCH / 04</p><h1 className="font-display mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">早安，{displayName}。</h1><p className="mt-5 max-w-xl text-base leading-8 text-[#466279]">你的收藏、支持與創作草稿都從這裡出發。老東家會把每一個下一步留在看得見的位置。</p></div><div className="flex items-center gap-4 rounded-[24px] border border-white/75 bg-white/65 p-4 shadow-sm backdrop-blur"><div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f36b3b] text-lg font-bold text-white">{user.photoURL ? <img src={user.photoURL} alt="會員頭像" className="h-full w-full object-cover" referrerPolicy="no-referrer"/> : initial}</div><div className="min-w-0"><p className="truncate font-bold">{displayName}</p><p className="mt-1 truncate text-sm text-[#638096]">{user.email}</p><p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-[#d85c36]">GOOGLE VERIFIED</p></div></div></div></section><section className="container py-10 sm:py-14"><div className="grid gap-6 lg:grid-cols-[.84fr_1.16fr]"><div className="space-y-6"><DataCard icon={<CircleUserRound size={20}/>} eyebrow="ACCOUNT / 01" title="我的帳號"><div className="space-y-3 text-sm"><div className="flex justify-between gap-4 border-b border-[#e1ecef] pb-3"><span className="text-[#6a879a]">登入方式</span><span className="font-bold">Google</span></div><div className="flex justify-between gap-4"><span className="text-[#6a879a]">會員識別</span><span className="max-w-[180px] truncate font-mono text-xs text-[#405b70]" title={user.uid}>{user.uid}</span></div></div></DataCard><DataCard icon={<Sparkles size={20}/>} eyebrow="CREATOR / 02" title="開始一份提案" action={<PenLine size={19} className="text-[#e15b32]"/>}><p className="text-sm leading-7 text-[#607a8d]">提案草稿只會對登入帳號本人開放。先建立骨架，下一步再補上作品內容與回饋方案。</p><button onClick={createDraft} disabled={creatingDraft} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] px-4 py-3 text-sm font-bold text-[#fffaf3] transition hover:bg-[#d9522d] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70">{creatingDraft ? <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"/> : <Plus size={17}/>} {creatingDraft ? "正在建立草稿" : "建立提案草稿"}</button></DataCard></div><div className="space-y-6"><DataCard icon={<FilePenLine size={20}/>} eyebrow="DRAFTS / 03" title="我的提案草稿" action={<span className="font-mono text-xs text-[#e15b32]">{proposals.length.toString().padStart(2, "0")}</span>}>{proposals.length ? <div className="space-y-3">{proposals.map((proposal) => <div key={proposal.id} className="flex items-center justify-between gap-4 rounded-[18px] border border-[#d8e7eb] bg-[#f8fcfc] p-4"><div className="min-w-0"><p className="truncate font-bold">{proposal.title || "未命名提案"}</p><p className="mt-1 text-xs text-[#698396]">{proposal.format || "小說或衍生周邊"} · 上次編輯 {formatDate(proposal.updatedAt)}</p></div><span className="sun-stamp shrink-0 border border-[#f0b26a] px-2 py-1 font-mono text-[10px] text-[#d9522d]">草稿</span></div>)}</div> : <div className="rounded-[18px] border border-dashed border-[#bdd6df] bg-[#f8fcfc] p-5 text-sm leading-7 text-[#607a8d]">還沒有提案草稿。從左側建立第一份草稿，資料會鎖定在你的帳號下。</div>}</DataCard><div className="grid gap-6 md:grid-cols-2"><DataCard icon={<Bookmark size={20}/>} eyebrow="SAVED / 04" title="我的收藏" action={<Heart size={18} className="text-[#e15b32]"/>}>{bookmarks.length ? <div className="space-y-3">{bookmarks.map((bookmark) => <a key={bookmark.id} href={bookmark.projectSlug ? projectPath(bookmark.projectSlug) : basePath} className="group flex items-center justify-between gap-3 rounded-[18px] border border-[#d8e7eb] bg-[#f8fcfc] p-3 transition hover:border-[#f0b26a]"><div className="min-w-0"><p className="truncate text-sm font-bold group-hover:text-[#d9522d]">{bookmark.title || "未命名收藏"}</p><p className="mt-1 text-xs text-[#6a879a]">{bookmark.category || "專案"} · 收藏於 {formatDate(bookmark.addedAt)}</p></div><ArrowUpRight size={16} className="shrink-0 text-[#49657a]"/></a>)}</div> : <div className="rounded-[18px] border border-dashed border-[#bdd6df] bg-[#f8fcfc] p-5 text-sm leading-7 text-[#607a8d]">尚未收藏故事。從首頁開始，把想再讀一次的提案留在這裡。</div>}<a href={basePath} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#d9522d] hover:underline">探索今日書架 <ArrowUpRight size={15}/></a></DataCard><DataCard icon={<PackageCheck size={20}/>} eyebrow="SUPPORT / 05" title="支持紀錄" action={<BookOpen size={18} className="text-[#e15b32]"/>}>{pledges.length ? <div className="space-y-3">{pledges.map((pledge) => <div key={pledge.id} className="rounded-[18px] border border-[#d8e7eb] bg-[#f8fcfc] p-3"><p className="text-sm font-bold">{pledge.projectTitle || "支持專案"}</p><p className="mt-1 text-xs text-[#6a879a]">{pledge.rewardTitle || "回饋方案"} · NT$ {pledge.amount?.toLocaleString() || "—"} · {pledge.status || "處理中"}</p></div>)}</div> : <div className="rounded-[18px] border border-dashed border-[#bdd6df] bg-[#f8fcfc] p-5 text-sm leading-7 text-[#607a8d]">目前沒有支持紀錄。老東家仍是原型，尚未開放真實贊助與付款。</div>}</DataCard></div></div></div></section></main><SiteFooter /></div>;
}
