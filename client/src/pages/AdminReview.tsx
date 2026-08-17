import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, FileSearch, ShieldAlert, XCircle } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where, type DocumentData } from "firebase/firestore";
import { toast } from "sonner";
import AuthButton from "@/components/AuthButton";
import SiteFooter from "@/components/SiteFooter";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { adminReviewPath, isPlatformAdmin } from "@/lib/adminAccess";
import { auth, db } from "@/lib/firebase";
import { canReviewProposal, getReviewNoteError, type ProposalFormValues, type ReviewDecision } from "@/lib/proposalWorkflow";

type ReviewProposal = Partial<ProposalFormValues> & {
  id: string;
  authorUid?: string;
  authorEmail?: string;
  status?: string;
  submittedAt?: { toDate?: () => Date };
  updatedAt?: { toDate?: () => Date };
};

const basePath = import.meta.env.BASE_URL;
const formatDateTime = (value?: { toDate?: () => Date }) => value?.toDate?.().toLocaleString("zh-TW", { dateStyle: "medium", timeStyle: "short" }) ?? "尚未記錄";
const formatCurrency = (value?: number) => `NT$ ${(Number(value) || 0).toLocaleString("zh-TW")}`;
const recordFromSnapshot = (snapshot: { id: string; data: () => DocumentData }) => ({ id: snapshot.id, ...snapshot.data() }) as ReviewProposal;

function AdminLoading() {
  return <div className="grid min-h-screen place-items-center bg-white text-sm text-[#6e6e73]"><div className="flex items-center gap-3"><span className="size-5 animate-spin rounded-full border-2 border-[#d2d2d7] border-t-[#f36b3b]" />正在確認管理員權限</div></div>;
}

function AccessDenied({ signedIn }: { signedIn: boolean }) {
  return <div className="min-h-screen bg-white text-[#1d1d1f]"><header className="sticky top-0 z-40 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl"><div className="container flex h-[52px] items-center justify-between gap-4"><a href={basePath} className="font-display text-[18px] tracking-[-0.02em]">老東家</a><AuthButton compact /></div></header><main className="container grid min-h-[72vh] place-items-center py-12"><div className="max-w-md text-center"><span className="mx-auto grid size-14 place-items-center rounded-[20px] bg-[#fff3e8] text-[#bd4d21]"><ShieldAlert size={26} /></span><p className="odj-eyebrow mt-7 text-[#6e6e73]">REVIEW ACCESS</p><h1 className="font-display mt-3 text-4xl tracking-[-0.05em]">此頁僅供管理員使用。</h1><p className="mt-4 text-sm leading-7 text-[#6e6e73]">{signedIn ? "目前登入帳戶沒有提案審核權限。" : "請先以平台管理員 Google 帳戶登入。"}</p><a href={basePath} className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition hover:text-[#f36b3b]"><ArrowLeft size={16} /> 回到首頁</a></div></main><SiteFooter /></div>;
}

function ProposalReviewCard({ proposal, onReview }: { proposal: ReviewProposal; onReview: (proposal: ReviewProposal, decision: ReviewDecision) => void }) {
  const fields = [
    ["目前製作階段", proposal.currentStage || "未填寫"],
    ["下一個里程碑", proposal.nextMilestone || "未填寫"],
    ["預計完成時間", proposal.estimatedCompletion || "未填寫"],
    ["款項用途", proposal.budgetUse || "未填寫"],
  ];

  return <article className="rounded-[28px] border border-[#d2d2d7] bg-white p-5 shadow-[0_10px_35px_rgba(20,20,35,0.04)] sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#fff3e8] px-2.5 py-1 text-xs font-semibold text-[#bd4d21]">待審</span><span className="text-xs text-[#6e6e73]">送審於 {formatDateTime(proposal.submittedAt || proposal.updatedAt)}</span></div><h2 className="font-display mt-4 text-2xl tracking-[-0.035em] sm:text-3xl">{proposal.title || "未命名作品"}</h2><p className="mt-2 text-sm text-[#6e6e73]">{proposal.category || "未分類"} · {proposal.creatorName || "未署名創作者"}</p></div><div className="rounded-2xl bg-[#f5f5f7] px-4 py-3 text-left sm:text-right"><p className="text-xs text-[#6e6e73]">支持目標</p><p className="mt-1 font-semibold text-[#1d1d1f]">{formatCurrency(proposal.targetAmount)}</p></div></div><p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-[#424245]">{proposal.summary || proposal.description || "創作者尚未提供作品摘要。"}</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{fields.map(([label, value]) => <div key={label} className="rounded-2xl bg-[#f5f5f7] p-4"><p className="text-xs font-semibold text-[#6e6e73]">{label}</p><p className="mt-2 text-sm leading-6 text-[#1d1d1f]">{value}</p></div>)}</div><div className="mt-6 flex flex-col gap-3 border-t border-[#e5e5e7] pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-[#6e6e73]">建立者識別：{proposal.authorEmail || proposal.authorUid || "未記錄"}</p><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onReview(proposal, "revision_requested")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-[#e8b9b3] bg-white px-4 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff1ef] active:scale-[0.97]"><XCircle size={16} /> 退回補件</button><button type="button" onClick={() => onReview(proposal, "published")} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#172846] px-4 text-sm font-semibold text-white transition hover:bg-[#243d67] active:scale-[0.97]"><CheckCircle2 size={16} /> 核准公開</button></div></div></article>;
}

export default function AdminReview() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [proposals, setProposals] = useState<ReviewProposal[]>([]);
  const [reviewTarget, setReviewTarget] = useState<ReviewProposal | null>(null);
  const [decision, setDecision] = useState<ReviewDecision>("published");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const isAdmin = isPlatformAdmin(user?.uid);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setReady(true); }), []);
  useEffect(() => {
    if (!isAdmin) return;
    const pendingQuery = query(collection(db, "proposals"), where("status", "==", "under_review"));
    return onSnapshot(pendingQuery, (snapshot) => setProposals(snapshot.docs.map(recordFromSnapshot).sort((a, b) => (b.submittedAt?.toDate?.().getTime() ?? b.updatedAt?.toDate?.().getTime() ?? 0) - (a.submittedAt?.toDate?.().getTime() ?? a.updatedAt?.toDate?.().getTime() ?? 0))), () => toast("目前無法讀取待審案件", { description: "請確認管理員登入狀態後重新整理。" }));
  }, [isAdmin]);

  const countLabel = useMemo(() => proposals.length.toString().padStart(2, "0"), [proposals.length]);
  const openReview = (proposal: ReviewProposal, nextDecision: ReviewDecision) => {
    if (!canReviewProposal(proposal.status)) return;
    setReviewTarget(proposal);
    setDecision(nextDecision);
    setNote("");
  };
  const submitReview = async () => {
    if (!user || !reviewTarget || saving) return;
    const noteError = getReviewNoteError(decision, note);
    if (noteError) {
      toast("請補充審核意見", { description: noteError });
      return;
    }
    const reviewNote = note.trim();
    if (!reviewNote) {
      toast("請補充審核意見", { description: "核准與退回都會保存一段審核紀錄。" });
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "proposals", reviewTarget.id), { status: decision, reviewNote, reviewedByUid: user.uid, reviewedAt: serverTimestamp(), updatedAt: serverTimestamp() });
      toast(decision === "published" ? "作品已核准公開" : "作品已退回補件", { description: "審核紀錄已保存，作品會自待審清單移除。" });
      setReviewTarget(null);
    } catch (error) {
      toast("審核操作失敗", { description: error instanceof Error ? error.message : "請稍後重新整理後再試一次。" });
    } finally {
      setSaving(false);
    }
  };

  if (!ready) return <AdminLoading />;
  if (!isAdmin) return <AccessDenied signedIn={Boolean(user)} />;

  return <div className="min-h-screen overflow-x-hidden bg-white text-[#1d1d1f]"><header className="sticky top-0 z-40 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl"><div className="container flex h-[52px] items-center justify-between gap-4"><a href={basePath} className="inline-flex items-center gap-2.5"><img src={`${basePath}media/odj-sunrise-icon.png`} alt="老東家日出圖示" className="size-9 rounded-[12px] object-cover" /><span className="font-display text-[18px] tracking-[-0.02em]">老東家</span></a><div className="flex items-center gap-4"><a href={`${basePath}dashboard`} className="hidden text-xs font-medium text-[#424245] transition hover:text-[#f36b3b] sm:block">創作者工作台</a><AuthButton compact /></div></div></header><main><section className="bg-[#172846] text-white"><div className="container py-16 sm:py-20"><a href={`${basePath}dashboard`} className="inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"><ArrowLeft size={16} /> 回到工作台</a><div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="odj-eyebrow text-[#ffc8aa]">ADMIN REVIEW</p><h1 className="font-display mt-4 text-4xl tracking-[-0.055em] sm:text-6xl">作品審核後台</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">在公開前檢查作品資訊、支持目標與五項透明度。所有核准與退回操作都會寫入審核紀錄。</p></div><div className="inline-flex w-fit items-center gap-3 rounded-[24px] bg-white/10 px-5 py-4"><Clock3 size={22} className="text-[#ffc8aa]" /><div><p className="text-xs text-white/65">待審案件</p><p className="mt-1 text-2xl font-semibold">{countLabel}</p></div></div></div></div></section><section className="container py-12 sm:py-16">{proposals.length ? <div className="space-y-5">{proposals.map((proposal) => <ProposalReviewCard key={proposal.id} proposal={proposal} onReview={openReview} />)}</div> : <div className="mx-auto max-w-xl rounded-[28px] bg-[#f5f5f7] px-7 py-16 text-center"><span className="mx-auto grid size-14 place-items-center rounded-[20px] bg-white text-[#172846]"><FileSearch size={25} /></span><h2 className="font-display mt-6 text-3xl tracking-[-0.04em]">目前沒有待審案件。</h2><p className="mt-4 text-sm leading-7 text-[#6e6e73]">會員送出作品後，案件會自動出現在這裡。</p></div>}</section></main><SiteFooter /><AlertDialog open={Boolean(reviewTarget)} onOpenChange={(open) => { if (!open && !saving) setReviewTarget(null); }}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{decision === "published" ? "核准公開作品" : "退回作品補件"}</AlertDialogTitle><AlertDialogDescription>{reviewTarget?.title || "這份作品"}將會{decision === "published" ? "變更為已公開狀態。" : "回到待補件狀態，創作者可再次修改後送審。"}</AlertDialogDescription></AlertDialogHeader><label className="block text-sm font-semibold text-[#1d1d1f]"><span>審核意見</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder={decision === "published" ? "例如：透明度資訊完整，核准公開。" : "請具體說明需補正的內容。"} className="mt-2 w-full resize-y rounded-2xl border border-[#d2d2d7] bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-[#a1a1a6] focus:border-[#f36b3b] focus:ring-4 focus:ring-[#f36b3b]/10" /></label><AlertDialogFooter><AlertDialogCancel disabled={saving}>取消</AlertDialogCancel><button type="button" onClick={() => void submitReview()} disabled={saving} className={`min-h-10 rounded-xl px-4 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${decision === "published" ? "bg-[#172846] hover:bg-[#243d67]" : "bg-[#b42318] hover:bg-[#8f1c14]"}`}>{saving ? "處理中" : decision === "published" ? "確認核准" : "確認退回"}</button></AlertDialogFooter></AlertDialogContent></AlertDialog></div>;
}
