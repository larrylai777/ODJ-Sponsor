import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, Heart, ShieldCheck } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import SiteFooter from "@/components/SiteFooter";
import { stripePaymentLinks, type StripePaymentLinkId } from "@/lib/stripePaymentLinks";

/** Apple 式產品敘事提醒：專案頁像作品發表頁，先讓故事與畫面成立，再以清楚垂直路徑呈現進度、時程與回饋方案；不使用票據或航圖式裝飾。 */

type RewardOption = {
  id: StripePaymentLinkId;
  name: string;
  price: string;
  detail: string;
  stock: string;
};

const rewardOptions: RewardOption[] = [
  { id: "support", name: "小額支持", price: "NT$ 390", detail: "電子書 + 募資限定晨光桌布", stock: "不限量" },
  { id: "book", name: "實體書收藏", price: "NT$ 890", detail: "精裝本、暖金藏書票、作者後記", stock: "剩 128 份" },
  { id: "collector", name: "藏書人方案", price: "NT$ 1,690", detail: "精裝本 + 雙面壓克力立牌 + 3 張角色卡 + 典藏書盒", stock: "剩 42 份" },
];

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const homePath = import.meta.env.BASE_URL;
const facebookUrl = "https://www.facebook.com/share/19TwFNqfoG/?mibextid=wwXIfr";
const projectImage = asset("odj-dawn-project.jpg");

export default function Project() {
  const [selected, setSelected] = useState<StripePaymentLinkId>("book");
  const current = rewardOptions.find((item) => item.id === selected) ?? rewardOptions[1];
  const checkoutUrl = stripePaymentLinks[current.id];

  const supportSelected = () => {
    if (!checkoutUrl) {
      toast("Stripe 付款連結尚未設定", {
        description: "建立對應方案的 Stripe Payment Link 後，這裡才會開啟安全付款頁。",
      });
      return;
    }

    window.open(checkoutUrl, "_blank", "noopener,noreferrer");
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
              <p className="odj-eyebrow text-[#f36b3b]">奇幻小說 · 邊城製本所</p>
              <h1 className="font-display mt-4 text-4xl leading-[1.08] tracking-[-0.055em] sm:text-6xl lg:text-7xl">月海檔案：<br />潮汐退去之後</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6e6e73]">當海水每夜退去，城市底下便露出一座被遺忘的月亮。這是一本關於失物、潮聲與重返故鄉的長篇奇幻小說。</p>
            </div>
            <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[28px] bg-[#dfe6e8]">
              <img src={projectImage} alt="月海檔案特裝書與周邊在清晨光線中的展示" className="aspect-[16/8] w-full object-cover object-center" />
            </div>
          </div>
        </section>

        <section className="container grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:py-24">
          <div>
            <section className="max-w-3xl">
              <p className="odj-eyebrow text-[#6e6e73]">THE EDITION</p>
              <h2 className="font-display mt-4 text-3xl tracking-[-0.04em] sm:text-5xl">這次想做的，<br />不只是一冊書。</h2>
              <p className="mt-6 text-base leading-8 text-[#6e6e73]">特裝版會採精裝書衣、前後蝴蝶頁與暖金藏書票。典藏組另外收錄兩位主角的雙面壓克力立牌、角色卡與書盒；每一項回饋都會在打樣完成後於進度頁公開確認。</p>
            </section>

            <section className="mt-16 border-t border-[#d2d2d7] pt-10">
              <p className="odj-eyebrow text-[#6e6e73]">TIMELINE</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">接下來的製作節奏。</h2>
              <ul className="mt-7 space-y-5">
                {[["2026/08", "完成內容校對與書封提案"], ["2026/09", "完成印刷、周邊打樣確認"], ["2026/11", "依贊助方案分批寄出"]].map(([date, text]) => (
                  <li key={date} className="flex gap-4 border-b border-[#e8e8ed] pb-5">
                    <Check className="mt-0.5 shrink-0 text-[#f36b3b]" size={18} />
                    <div>
                      <p className="font-semibold">{date}</p>
                      <p className="mt-1 text-sm text-[#6e6e73]">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16 rounded-[28px] bg-[#f5f5f7] p-8 sm:p-10">
              <p className="odj-eyebrow text-[#f36b3b]">UPDATE · 2026.08.12</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">我們把月光，放進第一道晨光裡。</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-[#6e6e73]">首輪樣紙已完成測試，內襯選用偏霧面的珍珠紙，讓月海的藍色在不同角度有更安靜的反光。下一篇更新會公開立牌的正式線稿。</p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
              <p className="odj-eyebrow text-[#6e6e73]">FUNDING STATUS</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-[#6e6e73]">已募得</p>
                  <p className="font-display mt-1 text-3xl tracking-[-0.04em]">NT$ 438,560</p>
                </div>
                <p className="text-lg font-semibold text-[#f36b3b]">146%</p>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#d2d2d7]"><div className="h-full w-full rounded-full bg-[#f36b3b]" /></div>
              <div className="mt-3 flex justify-between text-xs text-[#6e6e73]"><span>目標 NT$ 300,000</span><span>剩 16 天</span></div>
              <div className="mt-7 grid grid-cols-2 border-y border-[#d2d2d7] py-5">
                <div><p className="font-display text-xl">642</p><p className="mt-1 text-xs text-[#6e6e73]">位支持者</p></div>
                <div className="border-l border-[#d2d2d7] pl-5"><p className="font-display text-xl">11.28</p><p className="mt-1 text-xs text-[#6e6e73]">預計寄出</p></div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold">選擇支持方式</p>
                <div className="mt-3 space-y-2" role="radiogroup" aria-label="支持方案">
                  {rewardOptions.map((option) => (
                    <label key={option.id} className={`block cursor-pointer rounded-2xl p-4 transition ${selected === option.id ? "bg-white ring-1 ring-[#f36b3b]" : "bg-white/55 hover:bg-white"}`}>
                      <input type="radio" name="reward" value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} className="sr-only" />
                      <div className="flex items-start justify-between gap-3">
                        <div><p className="text-sm font-semibold">{option.name}</p><p className="mt-1 text-xs leading-5 text-[#6e6e73]">{option.detail}</p></div>
                        <p className="shrink-0 text-sm font-semibold">{option.price}</p>
                      </div>
                      <p className={`mt-2 text-xs ${option.stock.includes("剩") ? "text-[#f36b3b]" : "text-[#6e6e73]"}`}>{option.stock}</p>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={supportSelected} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">支持「{current.name}」<Heart size={16} /></button>
              <div className="mt-4 flex gap-2 text-xs leading-5 text-[#6e6e73]"><ShieldCheck className="mt-0.5 shrink-0 text-[#6e6e73]" size={16} />Stripe 測試模式，將直接開啟安全測試結帳頁，不會產生真實扣款。</div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
