import { useEffect, useState } from "react";
import { ArrowDown, ImageOff, Menu, X } from "lucide-react";
import { collection, onSnapshot, query, where, type DocumentData } from "firebase/firestore";
import AuthButton from "@/components/AuthButton";
import ProposalEntry from "@/components/ProposalEntry";
import SiteFooter from "@/components/SiteFooter";
import { db } from "@/lib/firebase";
import { selectPublishedProposals, type PublicProposal } from "@/lib/publicProposals";

/** 首頁採作品優先的純支持敘事：先閱讀作品與承諾，再決定是否支持；平台不以基金會身分自居。 */

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const basePath = import.meta.env.BASE_URL;

function ProposalCover({ coverUrl, title }: { coverUrl?: string; title?: string }) {
  const [failed, setFailed] = useState(!coverUrl || coverUrl.includes("facebook.com/share/"));

  if (failed) {
    return <div className="grid aspect-[16/9] place-items-center bg-[#172846] p-6 text-center text-white"><div><ImageOff className="mx-auto size-6 text-[#ffc8aa]" /><p className="mt-3 text-sm font-medium">{title || "作品封面"}</p><p className="mt-1 text-xs text-white/65">封面將於資料更新後顯示</p></div></div>;
  }

  return <img src={coverUrl} alt={`${title || "作品"}封面`} onError={() => setFailed(true)} className="aspect-[16/9] w-full bg-[#e8e8ed] object-cover" />;
}
const heroImage = asset("odj-dawn-hero.jpg");
const workshopImage = asset("odj-dawn-workshop.jpg");

function Header({ onMenu, mobileNavVisible }: { onMenu: () => void; mobileNavVisible: boolean }) {
  return (
    <header className={`sticky top-0 z-40 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl transition-transform duration-200 ${mobileNavVisible ? "translate-y-0" : "-translate-y-full lg:translate-y-0"}`}>
      <div className="container flex h-[52px] items-center justify-between gap-5">
        <a href={basePath} className="group flex items-center gap-2.5" aria-label="回到老東家首頁">
          <img className="size-9 shrink-0 rounded-[12px] object-cover object-center transition-transform duration-200 group-hover:-translate-y-0.5" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示" />
          <span className="font-display text-[18px] tracking-[-0.02em] text-[#1d1d1f]">老東家</span>
        </a>
        <nav className="hidden items-center gap-6 text-xs font-medium text-[#424245] lg:flex" aria-label="主要導覽">
          <a className="odj-link transition hover:text-[#f36b3b]" href="#shelf">探索作品</a>
          <a className="odj-link transition hover:text-[#f36b3b]" href="#workshop">創作者工作台</a>
          <a className="odj-link transition hover:text-[#f36b3b]" href="#how">支持方式</a>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden md:block"><AuthButton compact /></div>
          <button onClick={onMenu} className="grid size-9 place-items-center rounded-2xl bg-[#f5f5f7] text-[#1d1d1f] transition hover:bg-[#e8e8ed] active:scale-[0.97] lg:hidden" aria-label="開啟選單">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(true);
  const [publishedProposals, setPublishedProposals] = useState<PublicProposal[]>([]);
  const [isLoadingShelf, setIsLoadingShelf] = useState(true);

  useEffect(() => {
    const publishedQuery = query(collection(db, "proposals"), where("status", "==", "published"));
    return onSnapshot(
      publishedQuery,
      (snapshot) => {
        const proposals = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }) as PublicProposal);
        setPublishedProposals(selectPublishedProposals(proposals));
        setIsLoadingShelf(false);
      },
      () => {
        setPublishedProposals([]);
        setIsLoadingShelf(false);
      },
    );
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameRequested = false;

    const updateNavigation = () => {
      const currentScrollY = window.scrollY;
      const difference = currentScrollY - lastScrollY;

      if (currentScrollY <= 12 || difference < -8 || menuOpen) {
        setMobileNavVisible(true);
      } else if (difference > 8) {
        setMobileNavVisible(false);
      }

      lastScrollY = currentScrollY;
      frameRequested = false;
    };

    const onScroll = () => {
      if (!frameRequested) {
        frameRequested = true;
        window.requestAnimationFrame(updateNavigation);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOpen]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#1d1d1f]">
      <Header onMenu={() => { setMobileNavVisible(true); setMenuOpen(!menuOpen); }} mobileNavVisible={mobileNavVisible} />
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex min-h-dvh flex-col bg-[#f5f5f7] lg:hidden" role="dialog" aria-modal="true" aria-label="主要導覽選單">
          <div className="container flex h-[52px] items-center justify-between border-b border-[#d2d2d7]/80">
            <a href={basePath} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5" aria-label="回到老東家首頁">
              <img className="size-9 rounded-[12px] object-cover object-center" src={asset("odj-sunrise-icon.png")} alt="" />
              <span className="font-display text-[18px] tracking-[-0.02em] text-[#1d1d1f]">老東家</span>
            </a>
            <div className="flex items-center gap-2">
              <a href={`${basePath}dashboard`} onClick={() => setMenuOpen(false)} className="inline-flex h-9 items-center rounded-2xl bg-[#f36b3b] px-3.5 text-xs font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">進入創作者工作台</a>
              <button type="button" onClick={() => setMenuOpen(false)} className="grid size-9 place-items-center rounded-2xl bg-white text-[#1d1d1f] shadow-sm transition hover:bg-[#e8e8ed] active:scale-[0.97]" aria-label="關閉選單">
                <X size={19} />
              </button>
            </div>
          </div>
          <div className="container flex flex-1 flex-col justify-between py-10 sm:py-14">
            <nav className="space-y-1" aria-label="手機版主要導覽">
              <a className="block border-b border-[#d2d2d7] py-5 font-display text-4xl tracking-[-0.045em] text-[#1d1d1f] transition hover:text-[#f36b3b]" href="#shelf" onClick={() => setMenuOpen(false)}>探索作品</a>
              <a className="block border-b border-[#d2d2d7] py-5 font-display text-4xl tracking-[-0.045em] text-[#1d1d1f] transition hover:text-[#f36b3b]" href="#workshop" onClick={() => setMenuOpen(false)}>創作者工作台</a>
              <a className="block border-b border-[#d2d2d7] py-5 font-display text-4xl tracking-[-0.045em] text-[#1d1d1f] transition hover:text-[#f36b3b]" href="#how" onClick={() => setMenuOpen(false)}>支持方式</a>
            </nav>
            <div className="mt-10 border-t border-[#d2d2d7] pt-5">
              <p className="max-w-sm text-xs leading-5 text-[#6e6e73]">外部品牌與聯絡方式收納於頁尾。按 Esc 或右上角按鈕可關閉選單。</p>
            </div>
          </div>
        </div>
      )}
      <main>
        <section className="overflow-hidden bg-[#f5f5f7]">
          <div className="container py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <p className="odj-eyebrow text-[#6e6e73]">ODJ SPONSOR</p>
              <h1 className="font-display mt-5 text-[42px] leading-[1.06] tracking-[-0.055em] text-[#1d1d1f] sm:text-6xl lg:text-8xl">讓值得留下的故事，<br /><span className="text-[#172846]">繼續被創作。</span></h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73] sm:text-xl">老東家是作品贊助平台。讀者支持喜歡的創作；平台以作品專款管理，公開每一步製作承諾與進度。</p>
              <div className="mt-8"><a href="#how" className="inline-flex items-center gap-2 rounded-2xl bg-[#f36b3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">了解支持如何運作 <ArrowDown size={16} /></a></div>
              <p className="mt-5 text-xs leading-5 text-[#6e6e73]">老東家不是基金會；我們以透明的作品支持規則與公開進度運作。</p>
            </div>
            <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px] bg-[#dfe6e8] sm:mt-20"><img src={heroImage} alt="晨光灑在小說、手稿與書寫桌面上" className="aspect-[16/8] w-full object-cover object-center" /></div>
          </div>
        </section>

        <section id="shelf" className="bg-white py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="odj-eyebrow text-[#6e6e73]">OPEN FOR STORIES</p>
              <h2 className="font-display mt-4 text-4xl tracking-[-0.045em] sm:text-6xl">{publishedProposals.length ? <>正在被讀見的故事，<br />正在等待你的支持。</> : <>下一個被讀見的故事，<br />可能正等待你開始。</>}</h2>
              <p className="mt-5 text-base leading-7 text-[#6e6e73]">{publishedProposals.length ? "每份上架作品都已通過平台審核，並公開支持目標與製作承諾。" : "公開作品會在平台審核後才出現。現在，這個書架正為下一份提案保留位置。"}</p>
            </div>
            {isLoadingShelf ? (
              <div className="mx-auto mt-10 max-w-4xl rounded-[30px] border border-[#e8e8ed] bg-[#f5f5f7] p-8 text-center sm:mt-12 sm:p-14" aria-live="polite"><p className="odj-eyebrow text-[#f36b3b]">THE SHELF IS OPEN</p><p className="mt-4 text-sm text-[#6e6e73]">正在整理已公開作品。</p></div>
            ) : publishedProposals.length ? (
              <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:mt-12 md:grid-cols-2">
                {publishedProposals.map((proposal) => (
                  <article key={proposal.id} className="overflow-hidden rounded-[30px] border border-[#e8e8ed] bg-[#f5f5f7] text-left shadow-[0_14px_45px_rgba(20,20,35,0.05)]">
                    <ProposalCover coverUrl={proposal.coverUrl} title={proposal.title} />
                    <div className="p-6 sm:p-7"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-[#fff3e8] px-2.5 py-1 text-xs font-semibold text-[#bd4d21]">已公開</span><span className="text-xs text-[#6e6e73]">{proposal.category || "作品提案"}</span></div><h3 className="font-display mt-5 text-3xl tracking-[-0.04em] text-[#1d1d1f]">{proposal.title || "未命名作品"}</h3><p className="mt-2 text-sm text-[#6e6e73]">{proposal.creatorName || "老東家創作者"}</p><p className="mt-5 text-sm leading-7 text-[#424245]">{proposal.summary || proposal.description || "創作者正在整理這份作品的公開說明。"}</p><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white p-4"><p className="text-xs text-[#6e6e73]">支持目標</p><p className="mt-1 font-semibold text-[#1d1d1f]">NT$ {(Number(proposal.targetAmount) || 0).toLocaleString("zh-TW")}</p></div><div className="rounded-2xl bg-white p-4"><p className="text-xs text-[#6e6e73]">最低支持</p><p className="mt-1 font-semibold text-[#1d1d1f]">NT$ {(Number(proposal.minimumSupportAmount) || 0).toLocaleString("zh-TW")}</p></div></div><dl className="mt-5 space-y-3 border-t border-[#e5e5e7] pt-5 text-sm"><div className="flex gap-3"><dt className="w-20 shrink-0 text-[#6e6e73]">製作階段</dt><dd className="text-[#1d1d1f]">{proposal.currentStage || "即將開始"}</dd></div><div className="flex gap-3"><dt className="w-20 shrink-0 text-[#6e6e73]">下一里程碑</dt><dd className="text-[#1d1d1f]">{proposal.nextMilestone || "待公布"}</dd></div><div className="flex gap-3"><dt className="w-20 shrink-0 text-[#6e6e73]">預計完成</dt><dd className="text-[#1d1d1f]">{proposal.estimatedCompletion || "待公布"}</dd></div></dl></div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-10 max-w-4xl rounded-[30px] border border-[#e8e8ed] bg-[#f5f5f7] p-8 text-center sm:mt-12 sm:p-14"><p className="odj-eyebrow text-[#f36b3b]">THE SHELF IS OPEN</p><h3 className="font-display mt-4 text-3xl tracking-[-0.04em] sm:text-4xl">目前尚無公開作品。</h3><p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6e6e73] sm:text-base">每份作品必須先完成基本資料、支持目標、透明度與三期里程碑，經平台審核後才會在這裡公開。你可以先建立自己的提案草稿。</p><div className="mt-7 flex justify-center"><ProposalEntry label="建立第一份作品" /></div></div>
            )}
          </div>
        </section>

        <section id="workshop" className="bg-[#172846] py-16 text-white sm:py-24">
          <div className="container grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <p className="odj-eyebrow text-[#ffb99d]">FOR CREATORS</p>
              <h2 className="font-display mt-4 text-4xl leading-tight tracking-[-0.045em] sm:text-6xl">作品準備好了，<br />下一步更清楚。</h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[#c7d2e1]">把作品提案、支持目標、資金用途與製作承諾留在同一個工作台。創作者負責故事；平台負責在公開前先審核、在過程中要求更新。</p>
              <div className="mt-8"><ProposalEntry label="進入創作者工作台" className="bg-white text-[#172846] hover:bg-[#f5f5f7]" /></div>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-[#253b5c]">
              <img src={workshopImage} alt="晨光中的書籍裝幀與印刷工坊桌面" className="aspect-[16/10] w-full object-cover" />
              <div className="grid gap-5 p-7 sm:grid-cols-3">
                <div><p className="odj-eyebrow text-[#ffb99d]">01</p><p className="mt-3 font-semibold">先說好作品</p><p className="mt-2 text-sm leading-6 text-[#c7d2e1]">把作品、資金用途與完成時間寫清楚。</p></div>
                <div><p className="odj-eyebrow text-[#ffb99d]">02</p><p className="mt-3 font-semibold">平台先審核</p><p className="mt-2 text-sm leading-6 text-[#c7d2e1]">通過後才公開，支持金額也有明確下限。</p></div>
                <div><p className="odj-eyebrow text-[#ffb99d]">03</p><p className="mt-3 font-semibold">三期完成製作</p><p className="mt-2 text-sm leading-6 text-[#c7d2e1]">每一期都更新透明度，再進入下一筆撥付。</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="bg-white py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center"><p className="odj-eyebrow text-[#6e6e73]">HOW SUPPORT WORKS</p><h2 className="font-display mt-4 text-4xl tracking-[-0.045em] sm:text-6xl">讀見一個故事，<br />陪它完成自己。</h2><p className="mt-5 text-base leading-7 text-[#6e6e73]">每件公開作品固定揭露五項資訊：募得金額、預算用途、目前製作階段、下一個里程碑與預計完成時間。</p></div>
            <ol className="mt-14 grid border-t border-[#d2d2d7] md:grid-cols-3">
              {[["01", "探索作品", "閱讀故事、資金用途與五項透明度，找到你想守護的創作。"], ["02", "選擇純支持", "以作品設定的最低支持金額加入；支持款由平台以作品為單位管理。"], ["03", "追蹤三期進度", "創作者更新里程碑，平台確認後才進入下一期製作與撥付。"]].map(([number, title, text]) => (
                <li key={number} className="border-b border-[#d2d2d7] py-8 md:border-b-0 md:px-8 md:first:pl-0 md:not(:last-child):border-r"><p className="odj-eyebrow text-[#f36b3b]">{number}</p><h3 className="font-display mt-10 text-2xl tracking-[-0.03em]">{title}</h3><p className="mt-3 max-w-xs text-sm leading-7 text-[#6e6e73]">{text}</p></li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
