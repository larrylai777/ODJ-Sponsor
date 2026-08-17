import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Check, Heart, ShieldCheck, WalletCards } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import SiteFooter from "@/components/SiteFooter";
import { stripePaymentLinks, type StripePaymentLinkId } from "@/lib/stripePaymentLinks";

/** 專案頁先呈現作品與透明承諾；支持是純支持，不是購買商品或預購回饋。 */

type SupportOption = {
  id: StripePaymentLinkId;
  name: string;
  price: string;
  detail: string;
  note: string;
};

type ProjectProfile = {
  title: string;
  creator: string;
  category: string;
  intro: string;
  image: string;
  imageAlt: string;
  imagePresentation?: "cover" | "wide";
  workTitle: string;
  workBody: string;
  raised: string;
  target: string;
  progress: string;
  supporters: string;
  updateLabel: string;
  phase: string;
  status: "製作中" | "審核中";
  transparencyDate: string;
  budget: string;
  currentStage: string;
  nextMilestone: string;
  expectedCompletion: string;
  milestones: Array<[string, string]>;
};

const supportOptions: SupportOption[] = [
  { id: "support", name: "晨光支持者", price: "NT$ 390", detail: "為作品提供第一段創作與校訂所需的支持。", note: "可選擇公開致謝" },
  { id: "book", name: "故事守護者", price: "NT$ 890", detail: "支持作品進入初稿完成與核心製作階段。", note: "可選擇公開致謝" },
  { id: "collector", name: "長篇同行人", price: "NT$ 1,690", detail: "支持作品完成定稿與公開準備，陪它走得更遠。", note: "可選擇公開致謝" },
];

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const homePath = import.meta.env.BASE_URL;
const projectImage = asset("odj-dawn-project.jpg");
const ninthBirthCover = "/manus-storage/ninth-birth-cover_8fa0ecbf.png";

const projectsBySlug: Record<string, ProjectProfile> = {
  "moon-archive": {
    title: "月海檔案：潮汐退去之後",
    creator: "邊城製本所",
    category: "奇幻小說",
    intro: "當海水每夜退去，城市底下便露出一座被遺忘的月亮。這是一本關於失物、潮聲與重返故鄉的長篇奇幻小說。",
    image: projectImage,
    imageAlt: "月海檔案特裝書與周邊在清晨光線中的展示",
    imagePresentation: "wide",
    workTitle: "這次想守住的，\n是一部完整的作品。",
    workBody: "這筆支持將用於內容校訂、書封與內文製作、編輯協作以及公開前的最後整理。老東家不把支持視為預購；每一筆款項都對應這部作品的製作目標，並以公開進度接受讀者檢視。",
    raised: "NT$ 438,560",
    target: "NT$ 300,000",
    progress: "146%",
    supporters: "642",
    updateLabel: "更新於 08.12",
    phase: "01 / 03",
    status: "製作中",
    transparencyDate: "2026.08.12",
    budget: "校訂、編輯協作、書封與內文製作",
    currentStage: "第一期：啟動與內容校訂",
    nextMilestone: "完成書封提案與初稿校訂",
    expectedCompletion: "2026 年 11 月完成公開準備；實際進度會隨每期更新調整。",
    milestones: [
      ["第一期 · 啟動", "提案核准後開始內容校訂與書封提案。"],
      ["第二期 · 核心製作", "初稿或核心製作完成，公開本階段進度與下一步。"],
      ["第三期 · 定稿準備", "完成定稿與公開準備，交代作品的完成狀態。"],
    ],
  },
  "ninth-birth": {
    title: "第九次出生",
    creator: "創作者提案中",
    category: "科幻小說",
    intro: "一部以記憶、身份與重生為題的科幻小說提案。完整故事簡介、資金用途與完成時程，將隨平台審核進度公開。",
    image: ninthBirthCover,
    imageAlt: "第九次出生小說封面",
    imagePresentation: "cover",
    workTitle: "一部等待被讀見的，\n未來科幻小說。",
    workBody: "《第九次出生》正在完成平台審核。核准前不開放支持；創作者須先補足作品說明、資金用途、預計完成時間與三期製作承諾，讓讀者在支持前看見完整的公開資訊。",
    raised: "NT$ 0",
    target: "NT$ 300,000",
    progress: "0%",
    supporters: "0",
    updateLabel: "審核中 · 尚未開放支持",
    phase: "00 / 03",
    status: "審核中",
    transparencyDate: "等待審核完成",
    budget: "待創作者於提案審核時補充；核准後公開。",
    currentStage: "審核中：確認作品資料與支持規則",
    nextMilestone: "補足資金用途、時程與第一期製作承諾",
    expectedCompletion: "待創作者提出可公開的製作時程後揭露。",
    milestones: [
      ["第一期 · 提案核准與啟動", "平台確認資料完整後，公開第一期製作目標與款項用途。"],
      ["第二期 · 核心創作", "完成初稿或核心內容，更新進度並交代下一步。"],
      ["第三期 · 定稿與公開準備", "完成定稿與公開準備，對支持者說明作品完成狀態。"],
    ],
  },
};

export default function Project() {
  const [selected, setSelected] = useState<StripePaymentLinkId>("book");
  const [location] = useLocation();
  const slug = location.split("/").filter(Boolean).at(-1);
  const project = projectsBySlug[slug ?? "moon-archive"] ?? projectsBySlug["moon-archive"];
  const isReviewing = project.status === "審核中";
  const current = supportOptions.find((item) => item.id === selected) ?? supportOptions[1];
  const checkoutUrl = stripePaymentLinks[current.id];

  const supportSelected = () => {
    if (isReviewing) {
      toast("作品審核中，尚未開放支持", {
        description: "創作者補足透明度資料並通過平台審核後，才會開啟作品支持。",
      });
      return;
    }

    if (!checkoutUrl) {
      toast("Stripe 付款連結尚未設定", {
        description: "建立對應方案的 Stripe Payment Link 後，這裡才會開啟安全付款頁。",
      });
      return;
    }

    toast("純支持測試入口調整中", {
      description: "舊有測試付款頁仍含商品資訊；在新的純支持付款連結與平台代收流程完成前，暫不開啟，避免造成誤解。",
    });
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f]">
      <header className="sticky top-0 z-30 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl">
        <div className="container flex h-[52px] items-center justify-between">
          <a href={homePath} className="inline-flex items-center gap-2 text-sm font-medium text-[#424245] transition hover:text-[#f36b3b]">
            <ArrowLeft size={16} />
            探索作品
          </a>
          <div className="flex items-center gap-3">
            <AuthButton compact />
            <a href={homePath} className="flex items-center gap-2">
              <img className="size-8 rounded-[11px] object-cover" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示" />
              <span className="hidden font-display text-base tracking-[-0.02em] sm:inline">老東家</span>
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#f5f5f7] py-14 sm:py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <p className="odj-eyebrow text-[#f36b3b]">{project.category} · {project.creator}</p>
              <h1 className="font-display mt-4 text-4xl leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">{project.title}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73]">{project.intro}</p>
            </div>
            <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[28px] bg-[#111318]">
              <img src={project.image} alt={project.imageAlt} className={`${project.imagePresentation === "cover" ? "object-contain" : "object-cover object-center"} aspect-[16/8] w-full`} />
            </div>
          </div>
        </section>

        <section className="container grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-24">
          <div>
            <section className="max-w-3xl">
              <p className="odj-eyebrow text-[#6e6e73]">THE WORK</p>
              <h2 className="font-display mt-4 whitespace-pre-line text-3xl tracking-[-0.04em] sm:text-5xl">{project.workTitle}</h2>
              <p className="mt-6 text-base leading-8 text-[#6e6e73]">{project.workBody}</p>
            </section>

            <section className="mt-16 border-t border-[#d2d2d7] pt-10">
              <p className="odj-eyebrow text-[#6e6e73]">THREE MILESTONES</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">三期完成，也三次交代。</h2>
              <ul className="mt-7 space-y-5">
                {project.milestones.map(([phase, text]) => (
                  <li key={phase} className="flex gap-4 border-b border-[#e8e8ed] pb-5">
                    <Check className="mt-0.5 shrink-0 text-[#f36b3b]" size={18} />
                    <div>
                      <p className="font-semibold">{phase}</p>
                      <p className="mt-1 text-sm text-[#6e6e73]">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16 rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10">
              <p className="odj-eyebrow text-[#f36b3b]">TRANSPARENCY · {project.transparencyDate}</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">支持者應該看見的五件事。</h2>
              <div className="mt-6 grid gap-4 text-sm leading-7 text-[#6e6e73] sm:grid-cols-2">
                <p><span className="font-semibold text-[#1d1d1f]">募得金額</span><br />{project.raised}／目標 {project.target}</p>
                <p><span className="font-semibold text-[#1d1d1f]">預算用途</span><br />{project.budget}</p>
                <p><span className="font-semibold text-[#1d1d1f]">目前製作階段</span><br />{project.currentStage}</p>
                <p><span className="font-semibold text-[#1d1d1f]">下一個里程碑</span><br />{project.nextMilestone}</p>
                <p className="sm:col-span-2"><span className="font-semibold text-[#1d1d1f]">預計完成時間</span><br />{project.expectedCompletion}</p>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
              <p className="odj-eyebrow text-[#6e6e73]">WORK SUPPORT STATUS</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-[#6e6e73]">本作品專款</p>
                  <p className="font-display mt-1 text-3xl tracking-[-0.04em]">{project.raised}</p>
                </div>
                <p className="text-lg font-semibold text-[#f36b3b]">{project.progress}</p>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#d2d2d7]"><div className="h-full rounded-full bg-[#f36b3b]" style={{ width: `${Math.min(parseInt(project.progress, 10), 100)}%` }} /></div>
              <div className="mt-3 flex justify-between text-xs text-[#6e6e73]"><span>作品目標 {project.target}</span><span>{project.updateLabel}</span></div>
              <div className="mt-7 grid grid-cols-2 border-y border-[#d2d2d7] py-5">
                <div><p className="font-display text-xl">{project.supporters}</p><p className="mt-1 text-xs text-[#6e6e73]">位支持者</p></div>
                <div className="border-l border-[#d2d2d7] pl-5"><p className="font-display text-xl">{project.phase}</p><p className="mt-1 text-xs text-[#6e6e73]">目前階段</p></div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold">選擇純支持金額</p>
                <div className="mt-3 space-y-2" role="radiogroup" aria-label="支持方案">
                  {supportOptions.map((option) => (
                    <label key={option.id} className={`block rounded-2xl p-4 transition ${isReviewing ? "cursor-not-allowed bg-white/45 opacity-60" : selected === option.id ? "cursor-pointer bg-white ring-1 ring-[#f36b3b]" : "cursor-pointer bg-white/55 hover:bg-white"}`}>
                      <input type="radio" name="support" value={option.id} checked={selected === option.id} disabled={isReviewing} onChange={() => setSelected(option.id)} className="sr-only" />
                      <div className="flex items-start justify-between gap-3">
                        <div><p className="text-sm font-semibold">{option.name}</p><p className="mt-1 text-xs leading-5 text-[#6e6e73]">{option.detail}</p></div>
                        <p className="shrink-0 text-sm font-semibold">{option.price}</p>
                      </div>
                      <p className="mt-2 text-xs text-[#6e6e73]">{option.note}</p>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={supportSelected} disabled={isReviewing} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-[#a6a6ab] disabled:hover:bg-[#a6a6ab]">{isReviewing ? "審核中，暫不開放支持" : `以「${current.name}」支持作品`} <Heart size={16} /></button>
              <div className="mt-4 flex gap-2 text-xs leading-5 text-[#6e6e73]"><WalletCards className="mt-0.5 shrink-0 text-[#6e6e73]" size={16} />{isReviewing ? "此作品正在完成提案審核；通過後才會公開支持規則與平台代收入口。" : "本頁目前展示純支持規則；付款、平台代收與三期撥付將在受控後端與新測試連結完成後開放。"}</div>
              <div className="mt-3 flex gap-2 text-xs leading-5 text-[#6e6e73]"><ShieldCheck className="mt-0.5 shrink-0 text-[#6e6e73]" size={16} />老東家不是基金會。支持款以作品為單位管理，創作者須於每一期公開更新並通過平台確認。</div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
