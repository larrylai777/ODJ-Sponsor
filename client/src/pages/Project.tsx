import { useState } from "react";
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

const supportOptions: SupportOption[] = [
  { id: "support", name: "晨光支持者", price: "NT$ 390", detail: "為作品提供第一段創作與校訂所需的支持。", note: "可選擇公開致謝" },
  { id: "book", name: "故事守護者", price: "NT$ 890", detail: "支持作品進入初稿完成與核心製作階段。", note: "可選擇公開致謝" },
  { id: "collector", name: "長篇同行人", price: "NT$ 1,690", detail: "支持作品完成定稿與公開準備，陪它走得更遠。", note: "可選擇公開致謝" },
];

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const homePath = import.meta.env.BASE_URL;
const facebookUrl = "https://www.facebook.com/share/19TwFNqfoG/?mibextid=wwXIfr";
const projectImage = asset("odj-dawn-project.jpg");

export default function Project() {
  const [selected, setSelected] = useState<StripePaymentLinkId>("book");
  const current = supportOptions.find((item) => item.id === selected) ?? supportOptions[1];
  const checkoutUrl = stripePaymentLinks[current.id];

  const supportSelected = () => {
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
              <p className="odj-eyebrow text-[#6e6e73]">THE WORK</p>
              <h2 className="font-display mt-4 text-3xl tracking-[-0.04em] sm:text-5xl">這次想守住的，<br />是一部完整的作品。</h2>
              <p className="mt-6 text-base leading-8 text-[#6e6e73]">這筆支持將用於內容校訂、書封與內文製作、編輯協作以及公開前的最後整理。老東家不把支持視為預購；每一筆款項都對應這部作品的製作目標，並以公開進度接受讀者檢視。</p>
            </section>

            <section className="mt-16 border-t border-[#d2d2d7] pt-10">
              <p className="odj-eyebrow text-[#6e6e73]">THREE MILESTONES</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">三期完成，也三次交代。</h2>
              <ul className="mt-7 space-y-5">
                {[["第一期 · 啟動", "提案核准後開始內容校訂與書封提案。"], ["第二期 · 核心製作", "初稿或核心製作完成，公開本階段進度與下一步。"], ["第三期 · 定稿準備", "完成定稿與公開準備，交代作品的完成狀態。"]].map(([date, text]) => (
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
              <p className="odj-eyebrow text-[#f36b3b]">TRANSPARENCY · 2026.08.12</p>
              <h2 className="font-display mt-3 text-3xl tracking-[-0.04em]">支持者應該看見的五件事。</h2>
              <div className="mt-6 grid gap-4 text-sm leading-7 text-[#6e6e73] sm:grid-cols-2"><p><span className="font-semibold text-[#1d1d1f]">募得金額</span><br />NT$ 438,560／目標 NT$ 300,000</p><p><span className="font-semibold text-[#1d1d1f]">預算用途</span><br />校訂、編輯協作、書封與內文製作</p><p><span className="font-semibold text-[#1d1d1f]">目前製作階段</span><br />第一期：啟動與內容校訂</p><p><span className="font-semibold text-[#1d1d1f]">下一個里程碑</span><br />完成書封提案與初稿校訂</p><p className="sm:col-span-2"><span className="font-semibold text-[#1d1d1f]">預計完成時間</span><br />2026 年 11 月完成公開準備；實際進度會隨每期更新調整。</p></div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-[28px] bg-[#f5f5f7] p-6 sm:p-8">
              <p className="odj-eyebrow text-[#6e6e73]">WORK SUPPORT STATUS</p>
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-sm text-[#6e6e73]">本作品專款</p>
                  <p className="font-display mt-1 text-3xl tracking-[-0.04em]">NT$ 438,560</p>
                </div>
                <p className="text-lg font-semibold text-[#f36b3b]">146%</p>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-[#d2d2d7]"><div className="h-full w-full rounded-full bg-[#f36b3b]" /></div>
              <div className="mt-3 flex justify-between text-xs text-[#6e6e73]"><span>作品目標 NT$ 300,000</span><span>更新於 08.12</span></div>
              <div className="mt-7 grid grid-cols-2 border-y border-[#d2d2d7] py-5">
                <div><p className="font-display text-xl">642</p><p className="mt-1 text-xs text-[#6e6e73]">位支持者</p></div>
                <div className="border-l border-[#d2d2d7] pl-5"><p className="font-display text-xl">01 / 03</p><p className="mt-1 text-xs text-[#6e6e73]">目前階段</p></div>
              </div>

              <div className="mt-7">
                <p className="text-sm font-semibold">選擇純支持金額</p>
                <div className="mt-3 space-y-2" role="radiogroup" aria-label="支持方案">
                  {supportOptions.map((option) => (
                    <label key={option.id} className={`block cursor-pointer rounded-2xl p-4 transition ${selected === option.id ? "bg-white ring-1 ring-[#f36b3b]" : "bg-white/55 hover:bg-white"}`}>
                      <input type="radio" name="support" value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} className="sr-only" />
                      <div className="flex items-start justify-between gap-3">
                        <div><p className="text-sm font-semibold">{option.name}</p><p className="mt-1 text-xs leading-5 text-[#6e6e73]">{option.detail}</p></div>
                        <p className="shrink-0 text-sm font-semibold">{option.price}</p>
                      </div>
                      <p className="mt-2 text-xs text-[#6e6e73]">{option.note}</p>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={supportSelected} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f36b3b] py-3.5 text-sm font-semibold text-white transition hover:bg-[#d9522d] active:scale-[0.97]">以「{current.name}」支持作品 <Heart size={16} /></button>
              <div className="mt-4 flex gap-2 text-xs leading-5 text-[#6e6e73]"><WalletCards className="mt-0.5 shrink-0 text-[#6e6e73]" size={16} />本頁目前展示純支持規則；付款、平台代收與三期撥付將在受控後端與新測試連結完成後開放。</div>
              <div className="mt-3 flex gap-2 text-xs leading-5 text-[#6e6e73]"><ShieldCheck className="mt-0.5 shrink-0 text-[#6e6e73]" size={16} />老東家不是基金會。支持款以作品為單位管理，創作者須於每一期公開更新並通過平台確認。</div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
