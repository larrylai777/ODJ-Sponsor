import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleUserRound, Image, Link2, LockKeyhole, Save, Send, ShieldCheck, Sparkles, X } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import AuthButton from "@/components/AuthButton";
import ProposalEntry from "@/components/ProposalEntry";
import SiteFooter from "@/components/SiteFooter";
import { auth, db } from "@/lib/firebase";
import { canEditProposal, creatorSteps, getStepErrors, getSubmissionErrors, milestonePlan, proposalStatusLabel, type CreatorStep, type ProposalFormValues, type ProposalStatus } from "@/lib/proposalWorkflow";

type Draft = ProposalFormValues;
type SavedProposal = Partial<Draft> & { id: string; authorUid?: string; status?: ProposalStatus; totalRaised?: number };

const basePath = import.meta.env.BASE_URL;
const inputClass = "mt-2 w-full rounded-2xl border border-[#d2d2d7] bg-white px-4 py-3 text-sm text-[#1d1d1f] outline-none transition placeholder:text-[#a1a1a6] focus:border-[#f36b3b] focus:ring-4 focus:ring-[#f36b3b]/10 disabled:cursor-not-allowed disabled:bg-[#f5f5f7]";

function createEmptyDraft(creatorName: string): Draft {
  return {
    title: "",
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

function FormField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold text-[#1d1d1f]"><span>{label}</span>{hint ? <span className="mt-1 block text-xs font-normal leading-5 text-[#6e6e73]">{hint}</span> : null}{children}</label>;
}

function SignedOut() {
  return <div className="min-h-screen bg-white text-[#1d1d1f]"><main className="container grid min-h-[78vh] place-items-center py-12"><div className="max-w-md text-center"><div className="mx-auto grid size-14 place-items-center rounded-[20px] bg-[#f5f5f7] text-[#172846]"><LockKeyhole size={24} /></div><p className="odj-eyebrow mt-7 text-[#6e6e73]">CREATOR ACCESS</p><h1 className="font-display mt-3 text-4xl tracking-[-0.05em]">先登入，再建立作品。</h1><p className="mt-4 text-sm leading-7 text-[#6e6e73]">作品草稿與封面只會保存在你的帳號下；送審前不會公開。</p><div className="mt-7"><ProposalEntry fullWidth label="使用 Google 登入" loginLabel="使用 Google 登入" /></div><a href={`${basePath}dashboard`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition hover:text-[#f36b3b]"><ArrowLeft size={16} /> 回到工作台</a></div></main><SiteFooter /></div>;
}

export default function CreateProposal() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<CreatorStep>(1);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [proposalId, setProposalId] = useState<string | null>(null);
  const [status, setStatus] = useState<ProposalStatus>("draft");
  const [saving, setSaving] = useState(false);

  const displayName = useMemo(() => user?.displayName || user?.email?.split("@")[0] || "老東家會員", [user]);
  const editable = canEditProposal(status);
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  useEffect(() => onAuthStateChanged(auth, (nextUser) => { setUser(nextUser); setReady(true); }), []);
  useEffect(() => { if (user && !draft) setDraft(createEmptyDraft(displayName)); }, [user, draft, displayName]);
  useEffect(() => {
    if (!user) return;
    const draftId = params.get("draft");
    if (!draftId) return;
    void getDoc(doc(db, "proposals", draftId)).then((snapshot) => {
      if (!snapshot.exists() || snapshot.data().authorUid !== user.uid) {
        toast("找不到這份草稿", { description: "已為你建立一份新的作品草稿。" });
        return;
      }
      const source = snapshot.data() as SavedProposal;
      setProposalId(snapshot.id);
      setStatus(source.status || "draft");
      setDraft({ ...createEmptyDraft(displayName), ...source, targetAmount: Number(source.targetAmount) || 50000, minimumSupportAmount: Number(source.minimumSupportAmount) || 100, coverUrl: source.coverUrl || "" });
    }).catch(() => toast("暫時無法開啟草稿", { description: "請重新整理後再試一次。" }));
  }, [user, params, displayName]);
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => current ? { ...current, [key]: value } : current);
  const currentErrors = draft ? getStepErrors(draft, step) : [];

  const payload = () => ({
    title: draft?.title.trim() || "",
    category: draft?.category.trim() || "",
    summary: draft?.summary.trim() || "",
    description: draft?.description.trim() || "",
    creatorName: draft?.creatorName.trim() || displayName,
    targetAmount: Number(draft?.targetAmount) || 0,
    minimumSupportAmount: Number(draft?.minimumSupportAmount) || 0,
    budgetUse: draft?.budgetUse.trim() || "",
    currentStage: draft?.currentStage.trim() || "",
    nextMilestone: draft?.nextMilestone.trim() || "",
    estimatedCompletion: draft?.estimatedCompletion.trim() || "",
    coverUrl: draft?.coverUrl.trim() || "",
    updatedAt: serverTimestamp(),
  });

  const save = async (submit = false) => {
    if (!user || !draft || !editable || saving) return;
    const errors = submit ? getSubmissionErrors(draft) : [];
    if (errors.length) { toast("尚未完成送審條件", { description: errors[0] }); return; }
    setSaving(true);
    try {
      const data = payload();
      if (proposalId) {
        await updateDoc(doc(db, "proposals", proposalId), submit ? { ...data, status: "under_review", submittedAt: serverTimestamp() } : data);
      } else {
        const created = await addDoc(collection(db, "proposals"), { ...data, authorUid: user.uid, totalRaised: 0, status: submit ? "under_review" : "draft", disbursementPlan: milestonePlan, createdAt: serverTimestamp(), ...(submit ? { submittedAt: serverTimestamp() } : {}) });
        setProposalId(created.id);
      }
      if (submit) { setStatus("under_review"); toast("已送交平台審核", { description: "資料已鎖定，平台若要求補件才會重新開放編輯。" }); }
      else toast("草稿已儲存", { description: "這份作品目前只對你與平台審核端可見。" });
    } catch (error) {
      toast("儲存失敗", { description: error instanceof Error ? error.message : "請確認網路後再試一次。" });
    } finally { setSaving(false); }
  };

  const next = () => {
    if (currentErrors.length) { toast("這一步尚未完成", { description: currentErrors[0] }); return; }
    setStep((current) => Math.min(4, current + 1) as CreatorStep);
  };

  if (!ready) return <div className="grid min-h-screen place-items-center bg-white text-sm text-[#6e6e73]"><span className="size-5 animate-spin rounded-full border-2 border-[#d2d2d7] border-t-[#f36b3b]" /></div>;
  if (!user) return <SignedOut />;
  if (!draft) return null;

  return <div className="min-h-screen overflow-x-hidden bg-white text-[#1d1d1f]">
    <header className="sticky top-0 z-40 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl"><div className="container flex h-[52px] items-center justify-between gap-4"><a href={`${basePath}dashboard`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition hover:text-[#f36b3b]"><ArrowLeft size={16} /> 工作台</a><div className="flex items-center gap-3"><span className="hidden text-xs text-[#6e6e73] sm:block">作品建立器</span><AuthButton compact /></div></div></header>
    <main className="container py-8 pb-16 sm:py-12">
      <section className="mx-auto max-w-5xl"><div className="rounded-[30px] bg-[#f5f5f7] p-6 sm:p-9"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="odj-eyebrow text-[#6e6e73]">CREATOR STUDIO</p><h1 className="font-display mt-3 text-3xl tracking-[-0.05em] sm:text-5xl">建立你的作品。</h1><p className="mt-3 max-w-xl text-sm leading-7 text-[#6e6e73]">先完成私密草稿；通過審核前，作品不會公開，也不會開放讀者支持。</p></div><div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm"><CircleUserRound size={18} className="text-[#172846]" /><span className="max-w-40 truncate font-semibold">{displayName}</span></div></div>
        <div className="mt-8 grid grid-cols-4 gap-2">{creatorSteps.map((item) => <div key={item.id} className={`rounded-2xl px-2 py-3 text-center text-xs font-semibold sm:px-3 ${item.id === step ? "bg-[#172846] text-white" : item.id < step ? "bg-[#ffeadf] text-[#bd4d21]" : "bg-white text-[#86868b]"}`}><span className="block text-[10px] opacity-70">0{item.id}</span><span className="mt-1 block truncate">{item.label}</span></div>)}</div></div>

      {!editable ? <section className="mt-6 rounded-[30px] bg-[#f5f5f7] p-6 sm:p-9"><div className="flex items-start gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white text-[#f36b3b]"><LockKeyhole size={20} /></div><div><p className="odj-eyebrow text-[#6e6e73]">{proposalStatusLabel[status]}</p><h2 className="font-display mt-2 text-2xl tracking-[-0.04em]">這份作品目前已鎖定。</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e6e73]">送交審核後，作品資料與支持條件將保持一致。平台若要求補件，狀態會變成「待補件」，屆時才可再次修改。</p><a href={`${basePath}dashboard`} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#172846] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243d67]"><ArrowLeft size={16} /> 回到工作台</a></div></div></section> : <section className="mt-6 rounded-[30px] bg-[#f5f5f7] p-6 sm:p-9">
        {step === 1 ? <div><p className="odj-eyebrow text-[#f36b3b]">01 · WORK PROFILE</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">先讓讀者認識作品。</h2><div className="mt-7 grid gap-5 sm:grid-cols-2"><FormField label="作品名稱"><input value={draft.title} onChange={(event) => update("title", event.target.value)} className={inputClass} placeholder="例如：第九次出生" /></FormField><FormField label="作品類型"><select value={draft.category} onChange={(event) => update("category", event.target.value)} className={inputClass}><option value="小說">小說</option><option value="科幻小說">科幻小說</option><option value="奇幻小說">奇幻小說</option><option value="圖文小說">圖文小說</option><option value="經典重版">經典重版</option><option value="其他創作">其他創作</option></select></FormField><FormField label="創作者顯示名稱"><input value={draft.creatorName} onChange={(event) => update("creatorName", event.target.value)} className={inputClass} placeholder="作品公開時顯示的名稱" /></FormField><FormField label="封面圖片網址" hint="請貼上 HTTPS 圖片連結。作品送審前不會公開。"><div className="relative mt-2"><Link2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" /><input type="url" inputMode="url" value={draft.coverUrl} onChange={(event) => update("coverUrl", event.target.value)} className={`${inputClass} mt-0 pl-11`} placeholder="https://example.com/cover.jpg" /></div></FormField></div><div className="mt-5 grid gap-5 lg:grid-cols-[180px_1fr]"><div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#e8e8ed]">{draft.coverUrl ? <img src={draft.coverUrl} alt="作品封面預覽" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center p-5 text-center text-xs leading-5 text-[#86868b]"><Image size={20} className="mb-2" />貼上 HTTPS 封面網址後在此預覽</div>}</div><div className="space-y-5"><FormField label="作品簡介" hint="用一兩句話讓讀者理解這部作品。"><textarea value={draft.summary} onChange={(event) => update("summary", event.target.value)} className={`${inputClass} min-h-24 resize-y`} placeholder="作品想說的是什麼？" /></FormField><FormField label="完整提案說明" hint="說明創作背景、讀者為何值得支持，以及你會如何完成它。"><textarea value={draft.description} onChange={(event) => update("description", event.target.value)} className={`${inputClass} min-h-32 resize-y`} placeholder="寫下完整的作品計畫。" /></FormField></div></div></div> : null}
        {step === 2 ? <div><p className="odj-eyebrow text-[#f36b3b]">02 · SUPPORT PLAN</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">說清楚需要多少支持。</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e6e73]">老東家第一版採純支持，不販售商品或承諾出貨。公開後由平台代收，並以這部作品為單位專款管理。</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><FormField label="目標支持金額"><input type="number" min="1" value={draft.targetAmount} onChange={(event) => update("targetAmount", Number(event.target.value))} className={inputClass} /></FormField><FormField label="最低支持金額"><input type="number" min="1" value={draft.minimumSupportAmount} onChange={(event) => update("minimumSupportAmount", Number(event.target.value))} className={inputClass} /></FormField></div><div className="mt-5"><FormField label="款項用途" hint="清楚說明支持款會如何用在這部作品，例如編輯、插畫、校對、排版或製作紀錄。"><textarea value={draft.budgetUse} onChange={(event) => update("budgetUse", event.target.value)} className={`${inputClass} min-h-32 resize-y`} placeholder="例如：編輯、校對、插畫、排版與公開製作紀錄。" /></FormField></div><div className="mt-7 rounded-2xl bg-white p-5"><div className="flex items-center gap-2 text-sm font-semibold text-[#172846]"><ShieldCheck size={18} /> 三期撥付規則</div><div className="mt-4 grid gap-3 sm:grid-cols-3">{milestonePlan.map((milestone) => <div key={milestone.id} className="rounded-2xl bg-[#f5f5f7] p-4"><p className="text-xs text-[#6e6e73]">{milestone.percentage}%</p><p className="mt-2 text-sm font-semibold leading-6">{milestone.title}</p></div>)}</div></div></div> : null}
        {step === 3 ? <div><p className="odj-eyebrow text-[#f36b3b]">03 · TRANSPARENCY</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">預先寫下五項透明度。</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e6e73]">公開作品會固定顯示募得金額、預算用途、目前製作階段、下一個里程碑與預計完成時間。其中募得金額將由平台支付流程寫入。</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><FormField label="目前製作階段"><input value={draft.currentStage} onChange={(event) => update("currentStage", event.target.value)} className={inputClass} placeholder="例如：大綱與試讀完成" /></FormField><FormField label="下一個里程碑"><input value={draft.nextMilestone} onChange={(event) => update("nextMilestone", event.target.value)} className={inputClass} placeholder="例如：完成第一章初稿" /></FormField><FormField label="預計完成時間"><input value={draft.estimatedCompletion} onChange={(event) => update("estimatedCompletion", event.target.value)} className={inputClass} placeholder="例如：2027 年 3 月" /></FormField><FormField label="目前募得金額" hint="受平台流程保護，創作者無法自行調整。"><div className={`${inputClass} cursor-not-allowed bg-[#f5f5f7] text-[#6e6e73]`}>NT$ 0</div></FormField></div></div> : null}
        {step === 4 ? <div><p className="odj-eyebrow text-[#f36b3b]">04 · REVIEW</p><h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">檢查後，送交平台審核。</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[#6e6e73]">送審會鎖定作品資料。平台核准後才會公開並開啟支持；若需要補充資料，作品會退回給你修改。</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-white p-5"><p className="text-xs font-semibold text-[#6e6e73]">作品</p><p className="mt-2 font-semibold">{draft.title || "尚未命名作品"}</p><p className="mt-1 text-sm text-[#6e6e73]">{draft.category} · {draft.creatorName || displayName}</p></div><div className="rounded-2xl bg-white p-5"><p className="text-xs font-semibold text-[#6e6e73]">支持計畫</p><p className="mt-2 font-semibold">NT$ {draft.targetAmount.toLocaleString("zh-TW")}</p><p className="mt-1 text-sm text-[#6e6e73]">最低支持 NT$ {draft.minimumSupportAmount.toLocaleString("zh-TW")}</p></div></div><div className="mt-4 rounded-2xl border border-[#f36b3b]/20 bg-[#fff7f2] p-5 text-sm leading-7 text-[#6e6e73]"><div className="flex items-center gap-2 font-semibold text-[#bd4d21]"><Check size={17} /> 送審前確認</div><p className="mt-2">我已確認作品資訊與款項用途正確，並同意平台依三期里程碑與五項透明度規則審核這份提案。</p></div></div> : null}
        <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#d2d2d7] pt-6 sm:flex-row sm:justify-between"><div className="flex gap-3"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1) as CreatorStep)} disabled={step === 1 || saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#172846] ring-1 ring-[#d2d2d7] transition hover:bg-[#f5f5f7] disabled:opacity-50"><ArrowLeft size={16} /> 上一步</button><button type="button" onClick={() => void save(false)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#172846] ring-1 ring-[#d2d2d7] transition hover:bg-[#f5f5f7] disabled:opacity-50"><Save size={16} /> 儲存草稿</button></div>{step < 4 ? <button type="button" onClick={next} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#172846] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243d67]"><span>下一步</span><ArrowRight size={16} /></button> : <button type="button" onClick={() => void save(true)} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] disabled:opacity-60"><Send size={16} /> {saving ? "正在送審" : "送交平台審核"}</button>}</div>
      </section>}
      </section>
    </main>
    <SiteFooter />
  </div>;
}
