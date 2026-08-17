import { useState } from "react";
import { toast } from "sonner";
import { ArrowDownRight, ArrowUpRight, BookOpen, ChevronRight, Compass, Heart, Menu, PenLine, Sunrise } from "lucide-react";

/**
 * 老東家晨光日出設計提醒：此頁以「曙光書航」為核心；霧藍是海平線，杏橘是啟航的光，右側主視覺留給清晨中的書與工作桌。
 */

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const basePath = import.meta.env.BASE_URL;
const heroImage = asset("odj-dawn-hero.jpg");
const projectImage = asset("odj-dawn-project.jpg");
const workshopImage = asset("odj-dawn-workshop.jpg");

const projects = [
  { id: "moon-archive", title: "月海檔案：潮汐退去之後", creator: "邊城製本所", category: "奇幻小說", raised: "NT$ 438,560", target: "NT$ 300,000", supporters: "642", days: "剩 16 天", progress: "146%", image: projectImage, accent: "bg-[#172846]", badge: "今晨精選" },
  { id: "greenhouse", title: "在杉林盡頭等雨", creator: "葉晴與繪者燈塔", category: "圖文小說", raised: "NT$ 182,940", target: "NT$ 250,000", supporters: "231", days: "剩 28 天", progress: "73%", image: asset("odj-project-forest.jpg"), accent: "bg-[#315e72]", badge: "新作啟航" },
  { id: "ink-garden", title: "墨園拾遺：特裝小說集", creator: "南島讀本", category: "經典重版", raised: "NT$ 611,200", target: "NT$ 500,000", supporters: "813", days: "剩 5 天", progress: "122%", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=85", accent: "bg-[#d96a42]", badge: "限量晨光" },
];

function Header({ onMenu }: { onMenu: () => void }) {
  return <header className="sticky top-0 z-40 border-b border-[#bfd6df]/80 bg-[#f8fcfc]/86 backdrop-blur-xl">
    <div className="container flex h-[72px] items-center justify-between gap-6">
      <a href={basePath} className="group flex items-center gap-3" aria-label="回到老東家首頁">
        <img className="size-10 shrink-0 rounded-[14px] object-cover object-center shadow-sm ring-1 ring-[#e4ab52]/45 transition-transform duration-200 group-hover:-translate-y-0.5" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示" />
        <div className="leading-none"><p className="font-display text-[22px] font-black tracking-[0.08em] text-[#172846]">老東家</p><p className="mt-1 font-mono text-[9px] tracking-[0.17em] text-[#e15b32]">ODJ SPONSOR</p></div>
      </a>
      <nav className="hidden items-center gap-7 text-sm font-medium text-[#314863] md:flex" aria-label="主要導覽">
        <a className="editorial-link transition hover:text-[#e15b32] hover:underline" href="#shelf">今日啟航</a>
        <a className="editorial-link transition hover:text-[#e15b32] hover:underline" href="#workshop">晨光工坊</a>
        <a className="editorial-link transition hover:text-[#e15b32] hover:underline" href="#how">如何同行</a>
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={() => toast("提案入口示意", { description: "下一步可串接創作者登入、提案審核與周邊工坊報價。" })} className="hidden rounded-2xl border border-[#f36b3b] px-4 py-2 text-sm font-bold text-[#d9522d] transition hover:-translate-y-0.5 hover:bg-[#f36b3b] hover:text-[#fffaf3] sm:block">我要提案</button>
        <button onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-2xl border border-[#bfd6df] text-[#172846] md:hidden" aria-label="開啟選單"><Menu size={19} /></button>
      </div>
    </div>
  </header>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return <div className="min-h-screen overflow-x-hidden bg-[#f7fbfb] text-[#172846]">
    <Header onMenu={() => setMenuOpen(!menuOpen)} />
    {menuOpen && <div className="fixed inset-x-0 top-[72px] z-30 border-b border-[#bfd6df] bg-[#f8fcfc]/98 p-5 backdrop-blur-xl md:hidden"><div className="space-y-4 font-medium text-[#263f5c]"><a className="block" href="#shelf" onClick={() => setMenuOpen(false)}>今日啟航</a><a className="block" href="#workshop" onClick={() => setMenuOpen(false)}>晨光工坊</a><a className="block" href="#how" onClick={() => setMenuOpen(false)}>如何同行</a><button onClick={() => toast("提案入口示意", { description: "下一步可串接創作者登入與提案資料。" })} className="w-full rounded-2xl bg-[#f36b3b] py-3 font-bold text-[#fffaf3]">我要提案</button></div></div>}

    <main>
      <section className="relative isolate overflow-hidden border-b border-[#bfd6df] bg-[#eff8f8]">
        <div className="absolute -right-32 -top-44 size-[34rem] rounded-full bg-[#ffcf76]/50 blur-3xl" />
        <div className="absolute right-[10%] top-10 hidden size-64 rounded-full border border-[#e7b45c]/35 lg:block" />
        <div className="container relative grid min-h-[660px] items-stretch lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10 flex flex-col justify-center py-20 lg:py-24">
            <div className="mb-7 flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.2em] text-[#d85c36]"><span className="h-px w-9 bg-[#f36b3b]" /> DAWN EDITION / 01</div>
            <h1 className="font-display max-w-[670px] text-5xl font-black leading-[1.15] tracking-[-0.05em] text-[#172846] sm:text-6xl lg:text-7xl">讓故事，<br/><span className="text-[#f36b3b]">迎著光出發。</span></h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-[#405b70]">老東家陪華文故事走過提案、製作與寄送。一本小說、一套特裝、一個正準備被讀者看見的世界，從這道晨光開始啟航。</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#shelf" className="group inline-flex items-center gap-3 rounded-2xl bg-[#f36b3b] px-6 py-3.5 text-sm font-bold text-[#fffaf3] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d9522d] active:scale-[0.97]">看今天升起的故事 <ArrowDownRight size={17} className="transition group-hover:translate-y-0.5 group-hover:translate-x-0.5" /></a>
              <button onClick={() => toast("平台原型", { description: "此版本展示小說與周邊群募的發現、詳情與方案選擇流程。" })} className="inline-flex items-center gap-2 rounded-2xl border border-[#789aac] bg-white/35 px-6 py-3.5 text-sm font-bold text-[#253f59] transition hover:bg-white/80 active:scale-[0.97]">先認識老東家 <ChevronRight size={16} /></button>
            </div>
            <div className="mt-14 grid max-w-[530px] grid-cols-3 rounded-[22px] border border-[#bfd6df] bg-white/55 p-5 backdrop-blur-sm">
              <div><p className="font-mono text-xl font-medium text-[#172846]">03</p><p className="mt-1 text-xs text-[#638096]">正在啟航的計畫</p></div>
              <div className="border-l border-[#c9dee5] pl-5"><p className="font-mono text-xl font-medium text-[#172846]">1,686</p><p className="mt-1 text-xs text-[#638096]">一起等候的人</p></div>
              <div className="border-l border-[#c9dee5] pl-5"><p className="font-mono text-xl font-medium text-[#172846]">2026</p><p className="mt-1 text-xs text-[#638096]">第一季航線</p></div>
            </div>
          </div>
          <div className="relative -mr-4 hidden min-h-[660px] lg:block">
            <div className="absolute inset-y-10 left-8 right-0 overflow-hidden rounded-l-[38px] border border-white/55 dawn-shadow"><img src={heroImage} alt="晨光灑在小說、手稿與書寫桌面上" className="h-full w-full object-cover object-center" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(239,248,248,.58),transparent_44%)]" /></div>
            <div className="absolute bottom-16 left-0 max-w-[240px] rounded-[22px] border border-white/60 bg-[#172846]/92 p-4 text-[#f6fbfb] shadow-xl backdrop-blur"><div className="flex items-center gap-2 text-[#ffd27b]"><Sunrise size={18}/><span className="font-mono text-[10px] tracking-[0.16em]">FIRST LIGHT</span></div><p className="mt-3 text-sm leading-6">每一份支持，都是讓一本書出海前亮起的第一盞燈。</p></div>
          </div>
        </div>
      </section>

      <section id="shelf" className="container py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-6 border-b border-[#bfd6df] pb-8 md:flex-row md:items-end"><div><p className="font-mono text-[11px] tracking-[0.18em] text-[#d85c36]">DAWN SHELF / 01</p><h2 className="font-display mt-3 max-w-xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">今天，哪些故事正升起？</h2></div><p className="max-w-sm text-sm leading-7 text-[#607a8d]">每一個提案都從被閱讀開始。先靠近故事，再決定要不要陪它走完這段航程。</p></div>
        <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-[1.22fr_.89fr_.89fr]">
          {projects.map((project, index) => <article key={project.id} className={index === 0 ? "relative lg:pr-7 lg:after:absolute lg:after:right-0 lg:after:top-0 lg:after:h-full lg:after:w-px lg:after:bg-[#c9dee5]" : ""}>
            <a href={`${basePath}project/${project.id}`} className="group block">
              {index === 0 && <div className="mb-3 flex items-center justify-between border-b border-[#d8e7eb] pb-2"><span className="font-mono text-[10px] tracking-[0.16em] text-[#d85c36]">FIRST LIGHT / FEATURED 001</span><Compass size={15} className="text-[#e4ab52]"/></div>}
              <div className={`relative overflow-hidden rounded-[26px] bg-[#dceaf0] dawn-shadow-sm ${index === 0 ? "aspect-[4/4.8]" : "aspect-[4/4.55]"}`}><img src={project.image} alt={`${project.title} 專案封面`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]" /><div className={`sun-stamp absolute left-4 top-4 border border-white/50 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-white ${project.accent}`}>{project.badge}</div><div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-white/65 bg-[#f8fcfc]/92 px-3 py-2 font-mono text-[10px] font-medium text-[#27435b]"><Heart size={13} className="text-[#f36b3b]"/> 已同行 {project.supporters} 人</div></div>
              <div className="mt-5 flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-[#d85c36]">{project.category}</p><h3 className="font-display mt-2 text-2xl font-bold leading-snug transition group-hover:text-[#e15b32]">{project.title}</h3><p className="mt-2 text-sm text-[#6b8495]">{project.creator}</p></div><ArrowUpRight className="mt-1 shrink-0 text-[#425f77] transition duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" size={21}/></div>
              <div className="mt-5 rounded-[18px] border border-[#d8e7eb] bg-white/65 p-3"><div className="mb-2 flex items-center justify-between font-mono text-xs text-[#2d4c65]"><span>已募得 {project.raised}</span><span className="sun-stamp border border-[#f36b3b] px-2 py-0.5 text-[#d9522d]">{project.progress}</span></div><div className="h-[4px] overflow-hidden rounded-full bg-[#dbeaf0]"><div className="h-full rounded-full bg-[#f36b3b]" style={{ width: `${Math.min(parseInt(project.progress), 100)}%` }} /></div><div className="mt-2 flex justify-between font-mono text-[10px] text-[#6d8798]"><span>目標 {project.target}</span><span>{project.days}</span></div></div>
            </a>
          </article>)}
        </div>
      </section>

      <section id="workshop" className="relative overflow-hidden border-y border-[#314863] bg-[#172846] text-[#f6fbfb]"><div className="absolute -left-28 -top-36 size-[30rem] rounded-full border border-[#f3b65b]/25" /><div className="container relative grid gap-12 py-20 lg:grid-cols-[.82fr_1.18fr] lg:py-28"><div><p className="font-mono text-[11px] tracking-[0.18em] text-[#ffd27b]">DAWN WORKSHOP / 02</p><h2 className="font-display mt-3 text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl">故事亮起後，<br/>我們一起把它做好。</h2><p className="mt-6 max-w-sm leading-8 text-[#c6dce5]">從特裝、壓克力立牌到角色卡，老東家工坊把製作節奏攤在晨光裡。創作者把世界寫好，其餘交給熟悉出版的夥伴。</p><button onClick={() => toast("工坊報價示意", { description: "正式版本可提供規格、MOQ、打樣與出貨時程管理。" })} className="mt-9 inline-flex items-center gap-2 rounded-2xl border border-[#ffd27b] px-5 py-3 text-sm font-bold text-[#fff7e8] transition hover:bg-[#ffd27b] hover:text-[#172846] active:scale-[0.97]">看看晨光怎麼做到 <ArrowUpRight size={16}/></button></div><div className="grid gap-5 sm:grid-cols-[1.1fr_.9fr]"><div className="relative min-h-[340px] overflow-hidden rounded-[28px] border border-[#50718c]"><img src={workshopImage} alt="晨光中的書籍裝幀與印刷工坊桌面" className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(23,40,70,.92)_100%)]"/><div className="absolute bottom-6 left-6 right-6"><p className="font-mono text-xs tracking-[0.16em] text-[#ffd27b]">MADE WITH DAYLIGHT</p><p className="mt-2 font-display text-2xl font-bold">讓規格、打樣與寄送，<br/>都有下一站可去。</p></div></div><div className="grid gap-3"><div className="rounded-[24px] border border-[#50718c] bg-[#203a5d] p-6"><span className="font-mono text-[#ffd27b]">01</span><h3 className="font-display mt-7 text-xl font-bold">提案好編輯</h3><p className="mt-2 text-sm leading-6 text-[#bed3dd]">協助故事找到能被讀懂的第一句話。</p></div><div className="rounded-[24px] border border-[#50718c] bg-[#203a5d] p-6"><span className="font-mono text-[#ffd27b]">02</span><h3 className="font-display mt-7 text-xl font-bold">周邊好規格</h3><p className="mt-2 text-sm leading-6 text-[#bed3dd]">小批量也能做出被珍惜的質感。</p></div><div className="rounded-[24px] bg-[#f36b3b] p-6 text-[#fffaf3]"><PenLine size={24}/><p className="font-display mt-7 text-xl font-bold leading-snug">你把故事交出來，<br/>我們替它等天亮。</p></div></div></div></div></section>

      <section id="how" className="container py-20 sm:py-28"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="font-mono text-[11px] tracking-[0.18em] text-[#d85c36]">WAYS TO SAIL / 03</p><h2 className="font-display mt-3 text-4xl font-black tracking-[-0.035em] sm:text-5xl">從看見，<br/>到一起抵達。</h2></div><ol className="grid gap-5 sm:grid-cols-3">{[["讀到一束光","先讀故事、看試閱，選擇你想支持的那一份。"],["一起推向海面","在募資期間集結支持，讓作品有足夠的風可以啟航。"],["等它抵達書桌","製作進度公開更新，書與收藏準備好後寄向你的日常。"]].map(([title, text], i) => <li key={title} className="rounded-[22px] border border-[#c9dee5] bg-white/62 p-6"><p className="font-mono text-sm text-[#e15b32]">0{i + 1}</p><h3 className="font-display mt-10 text-2xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-[#617c8f]">{text}</p></li>)}</ol></div></section>
    </main>
    <footer className="border-t border-[#bfd6df] bg-[#eaf4f5]"><div className="container flex flex-col justify-between gap-6 py-9 sm:flex-row sm:items-end"><div className="flex items-center gap-3"><img className="size-10 shrink-0 rounded-[14px] object-cover object-center shadow-sm ring-1 ring-[#e4ab52]/45" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示"/><div><p className="font-display text-lg font-black tracking-[0.08em] text-[#172846]">老東家</p><p className="mt-1 text-xs text-[#688397]">替下一本書，留一盞晨光。</p></div></div><div className="text-xs leading-6 text-[#688397]"><p>ODJ Sponsor Prototype · 僅供產品概念展示</p><p>不處理真實付款、訂單或個人資料。</p></div></div></footer>
  </div>;
}
