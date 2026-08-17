import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, BookOpen, Check, ChevronRight, Compass, Heart, Menu, PenLine, Search, Sparkles, X } from "lucide-react";

/**
 * 老東家設計提醒：掌櫃的書案——首頁像一張有信任資訊的書案；故事先於交易，朱紅印章才是動作焦點。
 */

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const basePath = import.meta.env.BASE_URL;

const projects = [
  {
    id: "moon-archive", title: "月海檔案：潮汐退去之後", creator: "邊城製本所", category: "奇幻小說", raised: "NT$ 438,560", target: "NT$ 300,000", supporters: "642", days: "剩 16 天", progress: "146%", image: asset("odj-project-moon.jpg"), accent: "bg-[#183454]", badge: "主編選書"
  },
  {
    id: "greenhouse", title: "在杉林盡頭等雨", creator: "葉晴與繪者燈塔", category: "圖文小說", raised: "NT$ 182,940", target: "NT$ 250,000", supporters: "231", days: "剩 28 天", progress: "73%", image: asset("odj-project-forest.jpg"), accent: "bg-[#355c4c]", badge: "新作預熱"
  },
  {
    id: "ink-garden", title: "墨園拾遺：特裝小說集", creator: "南島讀本", category: "經典重版", raised: "NT$ 611,200", target: "NT$ 500,000", supporters: "813", days: "剩 5 天", progress: "122%", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=85", accent: "bg-[#6f3e35]", badge: "限量特裝"
  }
];

function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b paper-rule bg-[#fbf8ef]/92 backdrop-blur-md">
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <a href={basePath} className="group flex items-center gap-3" aria-label="回到老東家首頁">
          <img className="h-8 w-[52px] shrink-0 rounded-[14px] object-cover object-center shadow-sm ring-1 ring-[#d49f48]/20 transition-transform duration-200 group-hover:-translate-y-0.5" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示" />
          <div className="leading-none"><p className="font-display text-[22px] font-black tracking-[0.08em]">老東家</p><p className="mt-1 font-mono text-[9px] tracking-[0.14em] text-[#a03a32]">ODJ SPONSOR</p></div>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium md:flex" aria-label="主要導覽">
          <a className="editorial-link hover:text-[#b84236] hover:underline" href="#shelf">正在募資</a>
          <a className="editorial-link hover:text-[#b84236] hover:underline" href="#workshop">老東家工坊</a>
          <a className="editorial-link hover:text-[#b84236] hover:underline" href="#how">如何運作</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => toast("提案入口示意", { description: "下一步可串接創作者登入、提案審核與周邊工坊報價。" })} className="hidden rounded-2xl border border-[#b84236] px-4 py-2 text-sm font-semibold text-[#a83932] transition hover:bg-[#b84236] hover:text-[#fff8ee] sm:block">我要提案</button>
          <button onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-2xl border paper-rule md:hidden" aria-label="開啟選單"><Menu size={19} /></button>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header onMenu={() => setMenuOpen(!menuOpen)} />
      {menuOpen && <div className="fixed inset-x-0 top-[72px] z-30 border-b paper-rule bg-[#fbf8ef] p-5 md:hidden"><div className="space-y-4 font-medium"><a className="block" href="#shelf" onClick={() => setMenuOpen(false)}>正在募資</a><a className="block" href="#workshop" onClick={() => setMenuOpen(false)}>老東家工坊</a><a className="block" href="#how" onClick={() => setMenuOpen(false)}>如何運作</a><button onClick={() => toast("提案入口示意", { description: "下一步可串接創作者登入與提案資料。" })} className="w-full rounded-2xl bg-[#b84236] py-3 font-semibold text-[#fff8ee]">我要提案</button></div></div>}

      <main>
        <section className="relative border-b paper-rule bg-[#e9dfcc]">
          <div className="container grid min-h-[620px] items-stretch lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative z-10 flex flex-col justify-center py-20 lg:py-24">
              <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold tracking-[0.2em] text-[#a73d35]"><span className="h-px w-9 bg-[#b84236]" /> STORIES &amp; COLLECTIBLES</div>
              <h1 className="font-display max-w-[650px] text-5xl font-black leading-[1.18] tracking-[-0.04em] text-[#26201d] sm:text-6xl lg:text-7xl">故事，<br/><span className="text-[#b84236]">等你落款。</span></h1>
              <p className="mt-7 max-w-lg text-base leading-8 text-[#504842]">老東家是為華文故事創作者與收藏型讀者準備的群眾募資書案。一本小說、一套特裝、一個被認真實現的世界，都可以從這裡開始。</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a href="#shelf" className="group inline-flex items-center gap-3 rounded-2xl bg-[#b84236] px-6 py-3.5 text-sm font-bold text-[#fff8ee] transition duration-200 hover:-translate-y-0.5 hover:bg-[#963128] active:scale-[0.97]">逛逛今日書架 <ArrowDownRight size={17} className="transition group-hover:translate-y-0.5 group-hover:translate-x-0.5" /></a>
                <button onClick={() => toast("平台原型", { description: "此版本展示小說與周邊群募的發現、詳情與方案選擇流程。" })} className="inline-flex items-center gap-2 rounded-2xl border border-[#4f4740] px-6 py-3.5 text-sm font-bold transition hover:bg-[#f7f0e1] active:scale-[0.97]">先認識老東家 <ChevronRight size={16} /></button>
              </div>
              <div className="mt-14 grid max-w-[500px] grid-cols-3 border-y paper-rule py-5">
                <div><p className="font-mono text-xl font-medium">03</p><p className="mt-1 text-xs text-[#6e6259]">進行中計畫</p></div>
                <div className="border-l paper-rule pl-5"><p className="font-mono text-xl font-medium">1,686</p><p className="mt-1 text-xs text-[#6e6259]">已加入贊助</p></div>
                <div className="border-l paper-rule pl-5"><p className="font-mono text-xl font-medium">2026</p><p className="mt-1 text-xs text-[#6e6259]">第一季書單</p></div>
              </div>
            </div>
            <div className="relative -mr-4 hidden min-h-[620px] overflow-hidden lg:block">
              <img src={asset("odj-hero-library.jpg")} alt="小說特裝書與收藏周邊陳列在木製書案上" className="absolute inset-0 h-full w-full object-cover object-right" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#e9dfcc] via-[#e9dfcc]/20 to-transparent" />
              <div className="absolute bottom-10 right-8 flex items-center gap-3 border border-white/30 bg-[#22344b]/90 px-4 py-3 text-[#f8f0e4] backdrop-blur"><BookOpen size={17}/><span className="text-xs leading-5">收藏不是附贈。<br/>它是故事的第二種形狀。</span></div>
            </div>
          </div>
        </section>

        <section id="shelf" className="container py-20 sm:py-28">
          <div className="flex flex-col justify-between gap-6 border-b paper-rule pb-7 md:flex-row md:items-end">
            <div><p className="font-mono text-[11px] tracking-[0.18em] text-[#a33e34]">THE CURRENT SHELF / 01</p><h2 className="font-display mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">今日書架</h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#6a5f56]">每一件提案都由作品、回饋與履約資訊共同組成；你先讀故事，再決定是否成為它的第一批讀者。</p>
          </div>
          <div className="mt-9 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_0.85fr]">
            {projects.map((project, index) => (
              <article key={project.id} className={index === 0 ? "relative lg:pr-7 lg:after:absolute lg:after:right-0 lg:after:top-0 lg:after:h-full lg:after:w-px lg:after:bg-[#cfc1ac]" : ""}>
                <a href={`${basePath}project/${project.id}`} className="group block">
                  {index === 0 && <div className="mb-3 flex items-center justify-between border-b paper-rule pb-2"><span className="font-mono text-[10px] tracking-[0.16em] text-[#8e3831]">館藏索引 / FEATURED 001</span><span className="font-mono text-[10px] text-[#6e6259]">A-01</span></div>}
                  <div className={`relative overflow-hidden bg-[#d8cfbe] ink-shadow ${index === 0 ? "aspect-[4/4.8]" : "aspect-[4/4.55]"}`}>
                    <img src={project.image} alt={`${project.title} 專案封面`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]" />
                    <div className={`stamp absolute left-4 top-4 border border-[#f8e5d0] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#fff8ed] ${project.accent}`}>{project.badge}</div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 border border-[#d8c9b7] bg-[#faf5e9]/95 px-3 py-2 font-mono text-[10px] font-medium text-[#342c27]"><Heart size={13} className="text-[#b84236]"/> 已落款 {project.supporters} 人</div>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4"><div><p className="text-xs font-semibold text-[#a53c34]">{project.category}</p><h3 className="font-display mt-2 text-2xl font-bold leading-snug group-hover:text-[#a53c34]">{project.title}</h3><p className="mt-2 text-sm text-[#71665d]">{project.creator}</p></div><ArrowUpRight className="mt-1 shrink-0 transition duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" size={21}/></div>
                  <div className="mt-5 border-y paper-rule py-3"><div className="mb-2 flex items-center justify-between font-mono text-xs"><span>募得 {project.raised}</span><span className="stamp border border-[#b84236] px-2 py-0.5 text-[#a53c34]">達成 {project.progress}</span></div><div className="h-[3px] bg-[#d4c9b7]"><div className="h-full bg-[#b84236]" style={{ width: `${Math.min(parseInt(project.progress), 100)}%` }} /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-[#756960]"><span>目標 {project.target}</span><span>{project.days}</span></div></div>
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="workshop" className="border-y paper-rule bg-[#293b50] text-[#f8f1e5]"><div className="container grid gap-12 py-20 lg:grid-cols-[0.85fr_1.15fr] lg:py-28"><div><p className="font-mono text-[11px] tracking-[0.18em] text-[#d9a4a0]">THE ODJ WORKSHOP / 02</p><h2 className="font-display mt-3 text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">你的故事，<br/>不只是一冊書。</h2><p className="mt-6 max-w-sm leading-8 text-[#d7d1c6]">老東家工坊將小說的特裝、壓克力立牌、色紙與小卡放進同一套製作節奏。創作者專心把世界寫好，其餘交給熟悉出版的夥伴。</p><button onClick={() => toast("工坊報價示意", { description: "正式版本可提供規格、MOQ、打樣與出貨時程管理。" })} className="mt-9 inline-flex items-center gap-2 rounded-2xl border border-[#d9a4a0] px-5 py-3 text-sm font-semibold transition hover:bg-[#f8f1e5] hover:text-[#293b50] active:scale-[0.97]">看看怎麼做 <ArrowUpRight size={16}/></button></div><div className="grid gap-px overflow-hidden border border-[#526477] bg-[#526477] sm:grid-cols-2"><div className="bg-[#293b50] p-7"><span className="font-mono text-[#d9a4a0]">01</span><h3 className="font-display mt-9 text-2xl font-bold">提案好編輯</h3><p className="mt-3 text-sm leading-6 text-[#c4c9c9]">從故事亮點、回饋階梯到出貨風險，協助把你的世界講得清楚。</p></div><div className="bg-[#293b50] p-7"><span className="font-mono text-[#d9a4a0]">02</span><h3 className="font-display mt-9 text-2xl font-bold">周邊好規格</h3><p className="mt-3 text-sm leading-6 text-[#c4c9c9]">用小批量友善的製作選項，讓特裝與周邊真的能被準時完成。</p></div><div className="bg-[#293b50] p-7"><span className="font-mono text-[#d9a4a0]">03</span><h3 className="font-display mt-9 text-2xl font-bold">進度好交代</h3><p className="mt-3 text-sm leading-6 text-[#c4c9c9]">每個關鍵節點都有公開更新，支持者隨時知道故事走到哪裡。</p></div><div className="bg-[#b84236] p-7"><PenLine size={28}/><p className="font-display mt-9 text-2xl font-bold leading-snug">先把故事備好，<br/>剩下的交給老東家。</p></div></div></div></section>

        <section id="how" className="container py-20 sm:py-28"><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="font-mono text-[11px] tracking-[0.18em] text-[#a33e34]">HOW IT WORKS / 03</p><h2 className="font-display mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">從想讀，<br/>到成冊。</h2></div><ol className="grid gap-6 sm:grid-cols-3">{[["讀到心動","瀏覽專案故事、試閱與回饋方案，選擇你想收藏的那一份。"],["一起達標","在募資期限內集結支持；未達標時，這筆款項不會成立。"],["等待寄來","製作進度公開更新，書與周邊完成後，寄到你的書桌。"]].map(([title, text], i) => <li key={title} className="border-t-2 border-[#25201c] pt-5"><p className="font-mono text-sm text-[#a33e34]">0{i + 1}</p><h3 className="font-display mt-6 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#6d625a]">{text}</p></li>)}</ol></div></section>
      </main>
      <footer className="border-t paper-rule bg-[#f0e7d7]"><div className="container flex flex-col justify-between gap-6 py-9 sm:flex-row sm:items-end"><div className="flex items-center gap-3"><img className="h-8 w-[52px] shrink-0 rounded-[14px] object-cover object-center shadow-sm ring-1 ring-[#d49f48]/20" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示"/><div><p className="font-display text-lg font-black tracking-[0.08em]">老東家</p><p className="mt-1 text-xs text-[#70645a]">故事得有人先相信。</p></div></div><div className="text-xs leading-6 text-[#756a60]"><p>ODJ Sponsor Prototype · 僅供產品概念展示</p><p>不處理真實付款、訂單或個人資料。</p></div></div></footer>
    </div>
  );
}
