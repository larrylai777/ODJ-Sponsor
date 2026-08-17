import { useEffect, useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowUpRight, Bookmark, BookOpen, Check, CircleUserRound, FilePenLine, Heart, LogIn, PackageCheck, PenLine, Plus, Save, Send, ShieldCheck, Sparkles } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, type DocumentData } from "firebase/firestore";
import { toast } from "sonner";
import AuthButton from "@/components/AuthButton";
import ProposalEntry from "@/components/ProposalEntry";
import SiteFooter from "@/components/SiteFooter";
import { auth, db } from "@/lib/firebase";
import { canEditProposal, getSubmissionErrors, milestonePlan, proposalStatusLabel, type ProposalFormValues, type ProposalStatus } from "@/lib/proposalWorkflow";

/** 工作台採作品工作區，而非銷售後台：會員先儲存提案、設定支持金額與五項透明度，再送平台審核。 */

type BookmarkRecord = { id: string; title?: string; projectSlug?: string; category?: string; addedAt?: { toDate?: () => Date } };
type PledgeRecord = { id: string; projectTitle?: string; amount?: number; status?: string };
type ProposalRecord = Partial<ProposalFormValues> & {
  id: string;
  authorUid?: string;
  status?: ProposalStatus;
  coverUrl?: string;
  reviewNote?: string;
  totalRaised?: number;
  createdAt?: { toDate?: () => Date };
  updatedAt?: { toDate?: () => Date };
};
type ProposalDraft = ProposalFormValues & { coverUrl: string };

const basePath = import.meta.env.BASE_URL;
const facebookUrl = "https://www.facebook.com/share/19TwFNqfoG/?mibextid=wwXIfr";
const projectPath = (slug: string) => `${basePath}project/${slug}`;
const formatDate = (value?: { toDate?: () => Date }) => value?.toDate?.().toLocaleDateString("zh-TW", { month: "short", day: "numeric" }) ?? "尚未記錄";
const formatCurrency = (amount?: number) => `NT$ ${(amount ?? 0).toLocaleString("zh-TW")}`;
const recordFromSnapshot = <T,>(snapshot: { id: string; data: () => DocumentData }) => ({ id: snapshot.id, ...snapshot.data() }) as T;
const inputClass = "mt-2 w-full rounded-2xl border border-[#d2d2d7] bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#a1a1a6] focus:border-[#f36b3b] focus:ring-4 focus:ring-[#f36b3b]/10 disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[#86868b]";

function emptyDraft(creatorName: string): ProposalDraft {
  return {
    title: "未命名作品",
    category: "小說",
    summary: "",
    description: "",
    creatorName,
    targetAmount: 50000,
    minimumSupportAmount: 100,
    budgetUse: "",
    currentStage: "提案草稿",
    nextMilestone: "完成作品概要與支持計畫",
    estimatedCompletion: "",
    coverUrl: "",
  };
}

function draftFromProposal(proposal: ProposalRecord, creatorName: string): ProposalDraft {
  return {
    ...emptyDraft(creatorName),
    ...proposal,
    targetAmount: Number(proposal.targetAmount) || 50000,
    minimumSupportAmount: Number(proposal.minimumSupportAmount) || 100,
    coverUrl: proposal.coverUrl || "",
  };
}

function statusClass(status?: ProposalStatus) {
  if (status === "published" || status === "completed") return "bg-[#e9f7ef] text-[#137333]";
  if (status === "under_review") return "bg-[#fff3e8] text-[#bd4d21]";
  if (status === "revision_requested") return "bg-[#fff8d8] text-[#7a5a00]";
  if (status === "paused") return "bg-[#f0f0f2] text-[#6e6e73]";
  return "bg-[#eef1f7] text-[#344b72]";
}

function LoadingPanel() {
  return <div className="grid min-h-screen place-items-center bg-white text-sm text-[#6e6e73]"><div className="flex items-center gap-3"><span className="size-5 animate-spin rounded-full border-2 border-[#d2d2d7] border-t-[#f36b3b]" />正在開啟你的工作台</div></div>;
}

function SignedOutPanel() {
  return <div className="min-h-screen bg-white text-[#1d1d1f]"><main className="container grid min-h-[78vh] place-items-center py-12"><div className="max-w-md text-center"><div className="mx-auto grid size-14 place-items-center rounded-[20px] bg-[#f5f5f7] text-[#172846]"><LogIn size={24} /></div><p className="odj-eyebrow mt-7 text-[#6e6e73]">MEMBER ACCESS</p><h1 className="font-display mt-3 text-4xl tracking-[-0.05em]">先登入，再開始。</h1><p className="mt-4 text-sm leading-7 text-[#6e6e73]">登入後可以建立作品草稿、設定支持金額，並送交平台審核。未登入者將返回首頁。</p><div className="mt-7"><ProposalEntry fullWidth label="使用 Google 登入" loginLabel="使用 Google 登入" /></div><a href={basePath} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition hover:text-[#f36b3b]"><ArrowLeft size={16} /> 回到首頁</a></div></main><SiteFooter /></div>;
}

function Panel({ eyebrow, title, icon, action, children }: { eyebrow: string; title: string; icon: ReactNode; action?: ReactNode; children: ReactNode }) {
  return <section className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="odj-eyebrow text-[#6e6e73]">{eyebrow}</p><div className="mt-3 flex items-center gap-2"><span className="text-[#172846]">{icon}</span><h2 className="font-display text-2xl tracking-[-0.03em]">{title}</h2></div></div>{action}</div><div className="mt-6">{children}</div></section>;
}

function FormField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-[#1d1d1f]"><span>{label}</span>{hint ? <span className="mt-1 block text-xs font-normal leading-5 text-[#6e6e73]">{hint}</span> : null}{children}</label>;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [pledges, setPledges] = useState<PledgeRecord[]>([]);
  const [proposals, setProposals] = useState<ProposalRecord[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProposalDraft | null>(null);
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setReady(true); }), []);
  useEffect(() => { if (!ready || user) return; const timeout = window.setTimeout(() => window.location.assign(basePath), 1800); return () => window.clearTimeout(timeout); }, [ready, user]);
  useEffect(() => {
    if (!user) return;
    void setDoc(doc(db, "users", user.uid), { displayName: user.displayName || null, email: user.email || null, photoURL: user.photoURL || null, updatedAt: serverTimestamp(), createdAt: serverTimestamp() }, { merge: true }).catch(() => toast("會員資料暫時無法同步", { description: "請稍後重新整理；你的 Google 登入狀態不受影響。" }));
    const stopBookmarks = onSnapshot(collection(db, "bookmarks", user.uid, "items"), (snapshot) => setBookmarks(snapshot.docs.map((item) => recordFromSnapshot<BookmarkRecord>(item))), () => toast("目前無法讀取收藏", { description: "請確認網路狀態後再試一次。" }));
    const stopPledges = onSnapshot(collection(db, "pledges", user.uid, "records"), (snapshot) => setPledges(snapshot.docs.map((item) => recordFromSnapshot<PledgeRecord>(item))), () => toast("目前無法讀取支持紀錄", { description: "正式支持開放後，紀錄會在這裡顯示。" }));
    const stopProposals = onSnapshot(query(collection(db, "proposals"), where("authorUid", "==", user.uid)), (snapshot) => setProposals(snapshot.docs.map((item) => recordFromSnapshot<ProposalRecord>(item)).sort((a, b) => (b.updatedAt?.toDate?.().getTime() ?? 0) - (a.updatedAt?.toDate?.().getTime() ?? 0))), () => toast("目前無法讀取作品草稿", { description: "請確認登入狀態後重新整理。" }));
    return () => { stopBookmarks(); stopPledges(); stopProposals(); };
  }, [user]);

  const displayName = useMemo(() => user?.displayName || user?.email?.split("@")[0] || "老東家會員", [user]);
  const initial = displayName.slice(0, 1).toUpperCase();
  const selectedProposal = proposals.find((proposal) => proposal.id === selectedProposalId) ?? null;
  const editable = canEditProposal(selectedProposal?.status);

  useEffect(() => {
    if (!selectedProposal) return;
    setDraft(draftFromProposal(selectedProposal, displayName));
  }, [selectedProposalId, selectedProposal?.updatedAt, displayName]);

  const createDraft = async () => {
    if (!user || creatingDraft) return;
    setCreatingDraft(true);
    try {
      const initialDraft = emptyDraft(displayName);
      const created = await addDoc(collection(db, "proposals"), {
        authorUid: user.uid,
        ...initialDraft,
        totalRaised: 0,
        status: "draft",
        disbursementPlan: milestonePlan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSelectedProposalId(created.id);
      setDraft(initialDraft);
      toast("已建立作品草稿", { description: "補齊支持金額與五項透明度後，即可送交平台審核。" });
    } catch {
      toast("建立草稿失敗", { description: "請確認登入狀態與網路連線後再試一次。" });
    } finally {
      setCreatingDraft(false);
    }
  };

  const proposalPayload = (values: ProposalDraft) => ({
    title: values.title.trim(),
    category: values.category.trim(),
    summary: values.summary.trim(),
    description: values.description.trim(),
    creatorName: values.creatorName.trim(),
    targetAmount: Number(values.targetAmount),
    minimumSupportAmount: Number(values.minimumSupportAmount),
    budgetUse: values.budgetUse.trim(),
    currentStage: values.currentStage.trim(),
    nextMilestone: values.nextMilestone.trim(),
    estimatedCompletion: values.estimatedCompletion.trim(),
    coverUrl: values.coverUrl.trim(),
    updatedAt: serverTimestamp(),
  });

  const saveDraft = async () => {
    if (!selectedProposal || !draft || !editable || saving) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "proposals", selectedProposal.id), proposalPayload(draft));
      toast("草稿已儲存", { description: "只有你與平台審核端能看到這份作品。" });
    } catch {
      toast("儲存失敗", { description: "請確認網路連線後再試一次。" });
    } finally {
      setSaving(false);
    }
  };

  const submitForReview = async () => {
    if (!selectedProposal || !draft || !editable || saving) return;
    const errors = getSubmissionErrors(draft);
    if (errors.length) {
      toast("尚未完成送審條件", { description: errors[0] });
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "proposals", selectedProposal.id), { ...proposalPayload(draft), status: "under_review", submittedAt: serverTimestamp() });
      toast("已送交平台審核", { description: "作品不會立刻公開；審核結果會顯示在這份作品裡。" });
    } catch {
      toast("送審失敗", { description: "請確認網路連線後再試一次。" });
    } finally {
      setSaving(false);
    }
  };

  const selectProposal = (proposal: ProposalRecord) => {
    setSelectedProposalId(proposal.id);
    setDraft(draftFromProposal(proposal, displayName));
  };

  if (!ready) return <LoadingPanel />;
  if (!user) return <SignedOutPanel />;

  return <div className="min-h-screen overflow-x-hidden bg-white text-[#1d1d1f]">
    <header className="sticky top-0 z-40 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl"><div className="container flex h-[52px] items-center justify-between gap-4"><a href={basePath} className="group inline-flex items-center gap-2.5"><img src={`${basePath}media/odj-sunrise-icon.png`} alt="老東家日出圖示" className="size-9 rounded-[12px] object-cover transition group-hover:-translate-y-0.5" /><span className="font-display text-[18px] tracking-[-0.02em]">老東家</span></a><div className="flex items-center gap-4"><a href={basePath} className="hidden text-xs font-medium text-[#424245] transition hover:text-[#f36b3b] sm:block">探索作品</a><a href={facebookUrl} target="_blank" rel="noreferrer" className="hidden text-xs font-medium text-[#424245] transition hover:text-[#f36b3b] sm:block">聯絡我們</a><AuthButton compact /></div></div></header>
    <main>
      <section className="bg-[#f5f5f7]"><div className="container py-16 sm:py-20"><div className="mx-auto max-w-4xl text-center"><p className="odj-eyebrow text-[#6e6e73]">CREATOR WORKBENCH</p><h1 className="font-display mt-4 text-4xl tracking-[-0.055em] sm:text-6xl">早安，{displayName}。</h1><p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6e6e73]">在這裡整理作品、設定支持金額，並把每一個製作承諾寫清楚。公開前，所有作品都會先經平台審核。</p></div><div className="mx-auto mt-10 flex max-w-md items-center gap-4 rounded-[24px] bg-white p-4 odj-shadow"><div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#172846] text-lg font-semibold text-white">{user.photoURL ? <img src={user.photoURL} alt="會員頭像" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : initial}</div><div className="min-w-0 text-left"><p className="truncate font-semibold">{displayName}</p><p className="mt-1 truncate text-sm text-[#6e6e73]">{user.email}</p></div></div></div></section>

      <section className="container py-12 sm:py-16"><div className="grid gap-6 lg:grid-cols-[.82fr_1.18fr]">
        <div className="space-y-6">
          <Panel eyebrow="帳號" title="我的帳號" icon={<CircleUserRound size={20} />}><div className="space-y-3 text-sm"><div className="flex justify-between gap-4 border-b border-[#d2d2d7] pb-3"><span className="text-[#6e6e73]">登入方式</span><span className="font-semibold">Google</span></div><div className="flex justify-between gap-4"><span className="text-[#6e6e73]">會員識別</span><span className="max-w-[170px] truncate text-xs text-[#424245]" title={user.uid}>{user.uid}</span></div></div></Panel>
          <Panel eyebrow="創作者" title="建立作品" icon={<Sparkles size={20} />} action={<PenLine size={19} className="text-[#f36b3b]" />}><p className="text-sm leading-7 text-[#6e6e73]">作品會先以私密草稿保存。你可以設定目標與最低支持金額、五項透明度與預計完成時間，再送交審核。</p><button onClick={createDraft} disabled={creatingDraft} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70">{creatingDraft ? <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <Plus size={17} />} {creatingDraft ? "正在建立草稿" : "建立新作品草稿"}</button></Panel>
          <Panel eyebrow="平台規則" title="支持款如何管理" icon={<ShieldCheck size={20} />}><p className="text-sm leading-7 text-[#6e6e73]">老東家不是基金會；公開作品採平台代收、以作品為單位專款管理。實際付款與撥付尚未開放，本工作台先固定三期進度與透明度規則。</p><ol className="mt-5 space-y-3">{milestonePlan.map((milestone) => <li key={milestone.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 text-sm"><span>{milestone.title}</span><span className="font-semibold text-[#f36b3b]">{milestone.percentage}%</span></li>)}</ol></Panel>
        </div>

        <div className="space-y-6">
          <Panel eyebrow="我的作品" title="作品草稿與狀態" icon={<FilePenLine size={20} />} action={<span className="text-sm font-semibold text-[#f36b3b]">{proposals.length.toString().padStart(2, "0")}</span>}>
            {proposals.length ? <div className="space-y-3">{proposals.map((proposal) => <button key={proposal.id} type="button" onClick={() => selectProposal(proposal)} className={`flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left transition ${selectedProposalId === proposal.id ? "bg-[#172846] text-white" : "bg-white hover:bg-[#fff0e8]"}`}><div className="min-w-0"><p className="truncate font-semibold">{proposal.title || "未命名作品"}</p><p className={`mt-1 text-xs ${selectedProposalId === proposal.id ? "text-[#c7d2e1]" : "text-[#6e6e73]"}`}>{proposal.category || "作品提案"} · 上次編輯 {formatDate(proposal.updatedAt)}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${selectedProposalId === proposal.id ? "bg-white/15 text-white" : statusClass(proposal.status)}`}>{proposalStatusLabel[proposal.status || "draft"]}</span></button>)}</div> : <div className="rounded-2xl bg-white p-5 text-sm leading-7 text-[#6e6e73]">還沒有作品草稿。從左側建立第一份作品，資料只會鎖定在你的帳號下。</div>}
          </Panel>

          {selectedProposal && draft ? <Panel eyebrow="作品編輯" title={editable ? "補齊作品資訊" : "作品狀態"} icon={<PenLine size={20} />} action={<span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass(selectedProposal.status)}`}>{proposalStatusLabel[selectedProposal.status || "draft"]}</span>}>
            {!editable ? <div className="rounded-2xl bg-white p-5 text-sm leading-7 text-[#6e6e73]">{selectedProposal.status === "under_review" ? "這份作品正在由平台審核。審核期間已鎖定內容，避免公開資訊前後不一致。" : selectedProposal.status === "published" ? "作品已公開。支持金額、募得金額與製作進度將由平台受控流程更新。" : selectedProposal.reviewNote || "這份作品目前不開放自行編輯。"}</div> : <>
              <p className="text-sm leading-7 text-[#6e6e73]">送審前請完成作品與支持計畫。送出後會鎖定內容，直到平台審核完成或要求補件。</p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <FormField label="作品名稱"><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className={inputClass} placeholder="例如：月海檔案" /></FormField>
                <FormField label="作品類型"><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className={inputClass}><option value="小說">小說</option><option value="圖文小說">圖文小說</option><option value="經典重版">經典重版</option><option value="其他創作">其他創作</option></select></FormField>
                <FormField label="創作者顯示名稱"><input value={draft.creatorName} onChange={(event) => setDraft({ ...draft, creatorName: event.target.value })} className={inputClass} placeholder="作品公開時顯示的名稱" /></FormField>
                <FormField label="封面圖片網址" hint="第一版先支援公開圖片網址；上傳功能會在儲存服務完成後開放。"><input value={draft.coverUrl} onChange={(event) => setDraft({ ...draft, coverUrl: event.target.value })} className={inputClass} inputMode="url" placeholder="https://" /></FormField>
              </div>
              <div className="mt-5"><FormField label="作品簡介" hint="用一兩句話讓讀者理解這部作品。"><textarea value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} className={`${inputClass} min-h-24 resize-y`} placeholder="作品想說的是什麼？" /></FormField></div>
              <div className="mt-5"><FormField label="完整提案說明" hint="說明創作背景、讀者為何值得支持，以及你會如何完成它。"><textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className={`${inputClass} min-h-36 resize-y`} placeholder="寫下完整的作品計畫。" /></FormField></div>
              <div className="mt-10 border-t border-[#d2d2d7] pt-8"><p className="odj-eyebrow text-[#f36b3b]">SUPPORT PLAN</p><h3 className="font-display mt-3 text-2xl tracking-[-0.03em]">純支持金額</h3><p className="mt-2 text-sm leading-7 text-[#6e6e73]">老東家第一版不販售商品或承諾出貨。讀者是支持作品完成；公開致謝將是日後可選功能。</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><FormField label="目標支持金額"><input type="number" min="1" value={draft.targetAmount} onChange={(event) => setDraft({ ...draft, targetAmount: Number(event.target.value) })} className={inputClass} /></FormField><FormField label="最低支持金額"><input type="number" min="1" value={draft.minimumSupportAmount} onChange={(event) => setDraft({ ...draft, minimumSupportAmount: Number(event.target.value) })} className={inputClass} /></FormField></div></div>
              <div className="mt-10 border-t border-[#d2d2d7] pt-8"><p className="odj-eyebrow text-[#f36b3b]">PUBLIC TRANSPARENCY</p><h3 className="font-display mt-3 text-2xl tracking-[-0.03em]">五項公開透明度</h3><div className="mt-5 grid gap-5 sm:grid-cols-2"><FormField label="目前製作階段"><input value={draft.currentStage} onChange={(event) => setDraft({ ...draft, currentStage: event.target.value })} className={inputClass} placeholder="例如：大綱與試讀完成" /></FormField><FormField label="下一個里程碑"><input value={draft.nextMilestone} onChange={(event) => setDraft({ ...draft, nextMilestone: event.target.value })} className={inputClass} placeholder="例如：第一章初稿完成" /></FormField><FormField label="預計完成時間"><input value={draft.estimatedCompletion} onChange={(event) => setDraft({ ...draft, estimatedCompletion: event.target.value })} className={inputClass} placeholder="例如：2027 年 3 月" /></FormField><FormField label="目前募得金額" hint="由受控付款流程寫入，創作者不能自行調整。"><div className={`${inputClass} cursor-not-allowed bg-[#f5f5f7] text-[#6e6e73]`}>{formatCurrency(selectedProposal.totalRaised)}</div></FormField></div><div className="mt-5"><FormField label="預算用途" hint="請列出支持款的使用方向，例如編輯、插畫、校對、排版或公開製作紀錄。"><textarea value={draft.budgetUse} onChange={(event) => setDraft({ ...draft, budgetUse: event.target.value })} className={`${inputClass} min-h-28 resize-y`} placeholder="清楚說明支持款會如何用在這部作品。" /></FormField></div></div>
              <div className="mt-8 flex flex-col gap-3 border-t border-[#d2d2d7] pt-6 sm:flex-row"><button type="button" onClick={saveDraft} disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#172846] ring-1 ring-[#d2d2d7] transition hover:bg-[#f5f5f7] active:scale-[0.97] disabled:opacity-60"><Save size={16} /> 儲存草稿</button><button type="button" onClick={submitForReview} disabled={saving} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97] disabled:opacity-60"><Send size={16} /> 送交平台審核</button></div>
            </>}
          </Panel> : <Panel eyebrow="開始創作" title="建立第一份作品" icon={<Sparkles size={20} />}><p className="rounded-2xl bg-white p-5 text-sm leading-7 text-[#6e6e73]">先建立草稿，再把作品、支持金額與透明度資訊逐步補齊。所有公開支持都必須經平台核准後才會開啟。</p></Panel>}

          <div className="grid gap-6 md:grid-cols-2">
            <Panel eyebrow="收藏" title="想再讀一次" icon={<Bookmark size={20} />} action={<Heart size={18} className="text-[#f36b3b]" />}>{bookmarks.length ? <div className="space-y-3">{bookmarks.map((bookmark) => <a key={bookmark.id} href={bookmark.projectSlug ? projectPath(bookmark.projectSlug) : basePath} className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-4 transition hover:bg-[#fff0e8]"><div className="min-w-0"><p className="truncate text-sm font-semibold group-hover:text-[#f36b3b]">{bookmark.title || "未命名收藏"}</p><p className="mt-1 text-xs text-[#6e6e73]">{bookmark.category || "作品"} · 收藏於 {formatDate(bookmark.addedAt)}</p></div><ArrowUpRight size={16} className="shrink-0 text-[#6e6e73]" /></a>)}</div> : <p className="rounded-2xl bg-white p-5 text-sm leading-7 text-[#6e6e73]">尚未收藏作品。從首頁開始，把想再讀一次的故事留在這裡。</p>}<a href={basePath} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition hover:text-[#f36b3b]">探索作品 <ArrowUpRight size={15} /></a></Panel>
            <Panel eyebrow="支持" title="支持紀錄" icon={<PackageCheck size={20} />} action={<BookOpen size={18} className="text-[#6e6e73]" />}>{pledges.length ? <div className="space-y-3">{pledges.map((pledge) => <div key={pledge.id} className="rounded-2xl bg-white p-4"><p className="text-sm font-semibold">{pledge.projectTitle || "支持作品"}</p><p className="mt-1 text-xs text-[#6e6e73]">{formatCurrency(pledge.amount)} · {pledge.status || "處理中"}</p></div>)}</div> : <p className="rounded-2xl bg-white p-5 text-sm leading-7 text-[#6e6e73]">目前沒有支持紀錄。平台代收、專款管理與三期撥付規則已確立；實際支付功能尚未開放。</p>}</Panel>
          </div>
        </div>
      </div></section>
    </main>
    <SiteFooter />
  </div>;
}
