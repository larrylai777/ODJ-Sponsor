import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import ProposalEntry from "@/components/ProposalEntry";
import SiteFooter from "@/components/SiteFooter";

/** 首頁採作品優先的純支持敘事：先閱讀作品與承諾，再決定是否支持；平台不以基金會身分自居。 */

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const basePath = import.meta.env.BASE_URL;
const heroImage = asset("odj-dawn-hero.jpg");
const projectImage = asset("odj-dawn-project.jpg");
const workshopImage = asset("odj-dawn-workshop.jpg");
const ninthBirthCover = asset("ninth-birth-cover.png");

const projects = [
  {
    id: "moon-archive",
    title: "月海檔案：潮汐退去之後",
    creator: "邊城製本所",
    category: "奇幻小說",
    raised: "NT$ 438,560",
    target: "NT$ 300,000",
    supporters: "642",
    days: "更新於 08.12",
    progress: "146%",
    image: projectImage,
    badge: "透明製作中",
    description: "當海水每夜退去，城市底下便露出一座被遺忘的月亮。一本關於失物、潮聲與重返故鄉的長篇奇幻小說。",
  },
  {
    id: "greenhouse",
    title: "在杉林盡頭等雨",
    creator: "葉晴與繪者燈塔",
    category: "圖文小說",
    raised: "NT$ 182,940",
    target: "NT$ 250,000",
    supporters: "231",
    days: "審核中",
    progress: "73%",
    image: asset("odj-project-forest.jpg"),
    badge: "新作計畫",
    description: "一封未寄出的信、一段雨季中的步行，以及一本逐頁長出色彩的圖文小說。",
  },
  {
    id: "ink-garden",
    title: "墨園拾遺：特裝小說集",
    creator: "南島讀本",
    category: "經典重版",
    raised: "NT$ 611,200",
    target: "NT$ 500,000",
    supporters: "813",
    days: "更新於 08.08",
    progress: "122%",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85",
    badge: "保存計畫",
    description: "把一部值得重讀的小說，以校訂、製作與公開記錄的方式重新交到讀者手中。",
  },
  {
    id: "ninth-birth",
    title: "第九次出生",
    creator: "創作者提案中",
    category: "科幻小說",
    raised: "NT$ 0",
    target: "NT$ 300,000",
    supporters: "0",
    days: "審核中 · 尚未開放支持",
    progress: "0%",
    image: ninthBirthCover,
    imagePresentation: "portrait",
    badge: "需贊助作品",
    description: "以記憶、身份與重生為題的科幻小說提案。完整故事簡介、資金用途與完成時程將隨審核進度公開。",
  },
];

const projectFilters = ["全部作品", ...Array.from(new Set(projects.map((project) => project.category)))];

function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#d2d2d7]/80 bg-white/80 backdrop-blur-xl">
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

function ProjectProgress({ project }: { project: typeof projects[number] }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between text-xs text-[#6e6e73]">
        <span>已募得 {project.raised}</span>
        <span className="font-semibold text-[#f36b3b]">{project.progress}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[#e8e8ed]">
        <div className="h-full rounded-full bg-[#f36b3b]" style={{ width: `${Math.min(parseInt(project.progress, 10), 100)}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-[#6e6e73]">
        <span>作品目標 {project.target}</span>
        <span>{project.supporters} 位支持者 · {project.days}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("全部作品");
  const visibleProjects = activeFilter === "全部作品" ? projects : projects.filter((project) => project.category === activeFilter);
  const featured = visibleProjects[0] ?? projects[0];
  const supportingProjects = visibleProjects.filter((project) => project.id !== featured.id);

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

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#1d1d1f]">
      <Header onMenu={() => setMenuOpen(!menuOpen)} />
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex min-h-dvh flex-col bg-[#f5f5f7] lg:hidden" role="dialog" aria-modal="true" aria-label="主要導覽選單">
          <div className="container flex h-[52px] items-center justify-between border-b border-[#d2d2d7]/80">
            <a href={basePath} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5" aria-label="回到老東家首頁">
              <img className="size-9 rounded-[12px] object-cover object-center" src={asset("odj-sunrise-icon.png")} alt="" />
              <span className="font-display text-[18px] tracking-[-0.02em] text-[#1d1d1f]">老東家</span>
            </a>
            <button type="button" onClick={() => setMenuOpen(false)} className="grid size-9 place-items-center rounded-2xl bg-white text-[#1d1d1f] shadow-sm transition hover:bg-[#e8e8ed] active:scale-[0.97]" aria-label="關閉選單">
              <X size={19} />
            </button>
          </div>
          <div className="container flex flex-1 flex-col justify-between py-10 sm:py-14">
            <nav className="space-y-1" aria-label="手機版主要導覽">
              <a className="block border-b border-[#d2d2d7] py-5 font-display text-4xl tracking-[-0.045em] text-[#1d1d1f] transition hover:text-[#f36b3b]" href="#shelf" onClick={() => setMenuOpen(false)}>探索作品</a>
              <a className="block border-b border-[#d2d2d7] py-5 font-display text-4xl tracking-[-0.045em] text-[#1d1d1f] transition hover:text-[#f36b3b]" href="#workshop" onClick={() => setMenuOpen(false)}>創作者工作台</a>
              <a className="block border-b border-[#d2d2d7] py-5 font-display text-4xl tracking-[-0.045em] text-[#1d1d1f] transition hover:text-[#f36b3b]" href="#how" onClick={() => setMenuOpen(false)}>支持方式</a>
            </nav>
            <div className="mt-10 border-t border-[#d2d2d7] pt-5">
              <a href={`${basePath}dashboard`} onClick={() => setMenuOpen(false)} className="inline-flex items-center rounded-2xl bg-[#f36b3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">進入創作者工作台</a>
              <p className="mt-5 max-w-sm text-xs leading-5 text-[#6e6e73]">外部品牌與聯絡方式收納於頁尾。按 Esc 或右上角按鈕可關閉選單。</p>
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
              <div className="mt-8"><a href="#shelf" className="inline-flex items-center gap-2 rounded-2xl bg-[#f36b3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">探索正在被守護的作品 <ArrowDown size={16} /></a></div>
              <p className="mt-5 text-xs leading-5 text-[#6e6e73]">老東家不是基金會；我們以透明的作品支持規則與公開進度運作。</p>
            </div>
            <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px] bg-[#dfe6e8] sm:mt-20"><img src={heroImage} alt="晨光灑在小說、手稿與書寫桌面上" className="aspect-[16/8] w-full object-cover object-center" /></div>
          </div>
        </section>

        <section id="shelf" className="bg-white py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="odj-eyebrow text-[#6e6e73]">FEATURED STORIES</p>
              <h2 className="font-display mt-4 text-4xl tracking-[-0.045em] sm:text-6xl">值得被讀見的，<br />正在這裡發生。</h2>
              <p className="mt-5 text-base leading-7 text-[#6e6e73]">先靠近故事與它的製作承諾，再決定是否加入它的旅程。</p>
            </div>

            <div className="mt-10 border-y border-[#e8e8ed] py-4 sm:mt-12 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm text-[#6e6e73]"><span className="font-medium text-[#1d1d1f]">探索類型</span> · 以作品找到你想支持的故事</p>
              <div className="mt-3 flex flex-wrap gap-2 sm:mt-0" aria-label="作品類型篩選">
                {projectFilters.map((filter) => {
                  const selected = activeFilter === filter;
                  return <button key={filter} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={selected} className={`rounded-2xl px-3 py-1.5 text-xs transition ${selected ? "bg-[#172846] text-white" : "bg-[#f5f5f7] text-[#424245] hover:bg-[#e8e8ed]"}`}>{filter}</button>;
                })}
              </div>
            </div>

            <a href={`${basePath}project/${featured.id}`} className="group mt-5 grid overflow-hidden rounded-[30px] bg-[#f5f5f7] lg:grid-cols-2">
              <div className="order-2 flex flex-col justify-center p-8 sm:p-12 lg:order-1 lg:p-16">
                <p className="odj-eyebrow text-[#f36b3b]">{featured.badge}</p>
                <p className="mt-4 text-sm text-[#6e6e73]">{featured.category} · {featured.creator}</p>
                <h3 className="font-display mt-3 text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">{featured.title}</h3>
                <p className="mt-5 max-w-md text-base leading-7 text-[#6e6e73]">{featured.description}</p>
                <ProjectProgress project={featured} />
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition group-hover:text-[#f36b3b]">閱讀作品與透明度 <ArrowUpRight size={17} /></span>
              </div>
              <div className="order-1 min-h-[360px] lg:order-2"><img src={featured.image} alt={`${featured.title} 專案封面`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /></div>
            </a>

            {supportingProjects.length > 0 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {supportingProjects.map((project) => (
                  <a key={project.id} href={`${basePath}project/${project.id}`} className="group overflow-hidden rounded-[28px] bg-[#f5f5f7]">
                    <img src={project.image} alt={`${project.title} 專案封面`} className={`${project.imagePresentation === "portrait" ? "aspect-[3/4] bg-[#111318] object-contain" : "aspect-[16/9] object-cover"} w-full transition duration-500 group-hover:scale-[1.025]`} />
                    <div className="p-7">
                      <p className="odj-eyebrow text-[#f36b3b]">{project.badge}</p>
                      <p className="mt-3 text-sm text-[#6e6e73]">{project.category}</p>
                      <h3 className="font-display mt-1 text-2xl tracking-[-0.03em] transition group-hover:text-[#f36b3b]">{project.title}</h3>
                      <p className="mt-2 text-sm text-[#6e6e73]">{project.creator}</p>
                      <ProjectProgress project={project} />
                    </div>
                  </a>
                ))}
              </div>
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
