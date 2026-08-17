import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, ExternalLink, Menu } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import ProposalEntry from "@/components/ProposalEntry";
import SiteFooter from "@/components/SiteFooter";

/** Apple 式產品敘事提醒：首頁採全寬作品舞台與一屏一件事；近白留白建立呼吸，台北黑體承擔大標，曙光杏橘只保留給提案與核心轉換。作品探索借鏡群募平台的資訊分層，但維持小說閱讀的安靜節奏。 */

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const basePath = import.meta.env.BASE_URL;
const heroImage = asset("odj-dawn-hero.jpg");
const projectImage = asset("odj-dawn-project.jpg");
const workshopImage = asset("odj-dawn-workshop.jpg");

const projects = [
  {
    id: "moon-archive",
    title: "月海檔案：潮汐退去之後",
    creator: "邊城製本所",
    category: "奇幻小說",
    raised: "NT$ 438,560",
    target: "NT$ 300,000",
    supporters: "642",
    days: "剩 16 天",
    progress: "146%",
    image: projectImage,
    badge: "精選作品",
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
    days: "剩 28 天",
    progress: "73%",
    image: asset("odj-project-forest.jpg"),
    badge: "新作提案",
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
    days: "剩 5 天",
    progress: "122%",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=85",
    badge: "限量典藏",
    description: "把一部值得重讀的小說，以紙材、裝幀與細節重新交到讀者手中。",
  },
];

const projectFilters = ["全部作品", ...projects.map((project) => project.category)];

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
        <span>目標 {project.target}</span>
        <span>{project.supporters} 人支持 · {project.days}</span>
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-[#1d1d1f]">
      <Header onMenu={() => setMenuOpen(!menuOpen)} />
      {menuOpen && (
        <div className="fixed inset-x-0 top-[52px] z-30 border-b border-[#d2d2d7] bg-white/98 p-5 backdrop-blur-xl lg:hidden">
          <div className="space-y-4 text-sm font-medium text-[#424245]">
            <a className="block" href="#shelf" onClick={() => setMenuOpen(false)}>探索作品</a>
            <a className="block" href="#workshop" onClick={() => setMenuOpen(false)}>創作者工作台</a>
            <a className="block" href="#how" onClick={() => setMenuOpen(false)}>支持方式</a>
            <p className="border-t border-[#e8e8ed] pt-4 text-xs font-normal leading-5 text-[#6e6e73]">外部品牌與聯絡方式收納於頁尾。</p>
          </div>
        </div>
      )}
      <main>
        <section className="overflow-hidden bg-[#f5f5f7]">
          <div className="container py-16 sm:py-24 lg:py-28">
            <div className="mx-auto max-w-4xl text-center">
              <p className="odj-eyebrow text-[#6e6e73]">ODJ SPONSOR</p>
              <h1 className="font-display mt-5 text-[42px] leading-[1.06] tracking-[-0.055em] text-[#1d1d1f] sm:text-6xl lg:text-8xl">讓下一本書，<br /><span className="text-[#172846]">正式亮相。</span></h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73] sm:text-xl">老東家把故事、支持與製作節奏放在同一個清楚的地方。先讀一段，再決定要不要陪它走遠。</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <a href="#shelf" className="inline-flex items-center gap-2 rounded-2xl bg-[#f36b3b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">探索正在發生的作品 <ArrowDown size={16} /></a>
                <a href={`${basePath}about`} className="inline-flex items-center gap-1 text-sm font-medium text-[#424245] transition hover:text-[#f36b3b]">認識老東家 <ArrowRight size={16} /></a>
              </div>
            </div>
            <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px] bg-[#dfe6e8] sm:mt-20"><img src={heroImage} alt="晨光灑在小說、手稿與書寫桌面上" className="aspect-[16/8] w-full object-cover object-center" /></div>
          </div>
        </section>

        <section id="shelf" className="bg-white py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="odj-eyebrow text-[#6e6e73]">FEATURED STORIES</p>
              <h2 className="font-display mt-4 text-4xl tracking-[-0.045em] sm:text-6xl">值得被讀見的，<br />正在這裡發生。</h2>
              <p className="mt-5 text-base leading-7 text-[#6e6e73]">先靠近故事，再決定是否加入它的製作旅程。</p>
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
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#172846] transition group-hover:text-[#f36b3b]">閱讀專案詳情 <ArrowUpRight size={17} /></span>
              </div>
              <div className="order-1 min-h-[360px] lg:order-2"><img src={featured.image} alt={`${featured.title} 專案封面`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" /></div>
            </a>

            {supportingProjects.length > 0 && (
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {supportingProjects.map((project) => (
                  <a key={project.id} href={`${basePath}project/${project.id}`} className="group overflow-hidden rounded-[28px] bg-[#f5f5f7]">
                    <img src={project.image} alt={`${project.title} 專案封面`} className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
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
              <p className="mt-6 max-w-md text-base leading-8 text-[#c7d2e1]">把提案、回饋規格與進度留在同一個工作台。創作者負責故事，我們一起把應該被理解的事，說得更清楚。</p>
              <div className="mt-8"><ProposalEntry label="進入創作者工作台" className="bg-white text-[#172846] hover:bg-[#f5f5f7]" /></div>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-[#253b5c]">
              <img src={workshopImage} alt="晨光中的書籍裝幀與印刷工坊桌面" className="aspect-[16/10] w-full object-cover" />
              <div className="grid gap-5 p-7 sm:grid-cols-3">
                <div><p className="odj-eyebrow text-[#ffb99d]">01</p><p className="mt-3 font-semibold">先說好作品</p><p className="mt-2 text-sm leading-6 text-[#c7d2e1]">從提案開始，把故事的核心留下來。</p></div>
                <div><p className="odj-eyebrow text-[#ffb99d]">02</p><p className="mt-3 font-semibold">再決定回饋</p><p className="mt-2 text-sm leading-6 text-[#c7d2e1]">用可被理解的規格，安排支持方式。</p></div>
                <div><p className="odj-eyebrow text-[#ffb99d]">03</p><p className="mt-3 font-semibold">一起完成製作</p><p className="mt-2 text-sm leading-6 text-[#c7d2e1]">讓每一段時程都留在看得見的位置。</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="bg-white py-16 sm:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl text-center"><p className="odj-eyebrow text-[#6e6e73]">HOW IT WORKS</p><h2 className="font-display mt-4 text-4xl tracking-[-0.045em] sm:text-6xl">讀見一個故事，<br />支持它抵達書桌。</h2></div>
            <ol className="mt-14 grid border-t border-[#d2d2d7] md:grid-cols-3">
              {[["01", "探索作品", "閱讀故事與製作細節，找到你想更靠近的一本書。"], ["02", "選擇支持", "確認回饋方案與時程，在作品需要的時候加入。"], ["03", "等待完成", "追蹤製作更新，讓書與收藏在準備好後抵達。"]].map(([number, title, text]) => (
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
