import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Check, ChevronDown, Heart, PackageCheck, ShieldCheck, Sparkles, X } from "lucide-react";

/**
 * 老東家設計提醒：專案頁像出版目錄與收據並列；以作品、回饋與履約資訊建立清楚的信任節奏。
 */

const rewardOptions = [
  { id: "digital", name: "閱讀支持", price: "NT$ 280", detail: "電子書 + 募資限定桌布", stock: "不限量" },
  { id: "book", name: "首刷精裝版", price: "NT$ 780", detail: "精裝本、燙金藏書票、作者後記", stock: "剩 128 份" },
  { id: "collector", name: "潮汐典藏組", price: "NT$ 1,680", detail: "精裝本 + 雙面壓克力立牌 + 3 張燙銀角色卡 + 典藏書盒", stock: "剩 42 份" },
];

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const homePath = import.meta.env.BASE_URL;

export default function Project() {
  const [selected, setSelected] = useState("book");
  const [modalOpen, setModalOpen] = useState(false);
  const current = rewardOptions.find((item) => item.id === selected) ?? rewardOptions[1];

  const continueToSponsor = () => {
    setModalOpen(false);
    toast("已保留方案（示意）", { description: `已選擇「${current.name}」。正式版本將在此銜接金流與寄送資訊。` });
  };

  return <div className="min-h-screen bg-[#fbf8ef] text-[#29221e]">
    <header className="sticky top-0 z-30 border-b border-[#d8cdbb] bg-[#fbf8ef]/95 backdrop-blur"><div className="container flex h-[72px] items-center justify-between"><a href={homePath} className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[#b84236]"><ArrowLeft size={18}/> 回到今日書架</a><a href={homePath} className="flex items-center gap-2"><img className="h-9 w-9 rounded-[8px] object-cover" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示"/><span className="font-display text-lg font-black tracking-[0.08em]">老東家</span></a></div></header>
    <main className="container py-9 sm:py-14"><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-14"><div>
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs"><span className="stamp border border-[#e1b6a8] bg-[#183454] px-3 py-1.5 font-semibold tracking-[0.12em] text-[#fff9ed]">主編選書</span><span className="font-semibold text-[#a23b33]">奇幻小說</span><span className="text-[#74675e]">邊城製本所</span></div>
      <h1 className="font-display text-4xl font-black leading-[1.25] tracking-[-0.04em] sm:text-6xl">月海檔案：<br/>潮汐退去之後</h1>
      <p className="mt-6 max-w-2xl text-lg leading-9 text-[#5d5149]">當海水每夜退去，城市底下便露出一座被遺忘的月亮。這是一本關於失物、潮聲與重返故鄉的長篇奇幻小說；也將是我們想好好做成的第一套特裝書。</p>
      <div className="mt-9 overflow-hidden border border-[#d8cdbb] bg-[#e8ded0] shadow-[6px_7px_0_rgba(43,34,29,.12)]"><img src={asset("odj-hero-library.jpg")} alt="月海檔案特裝書與周邊的桌面展示" className="aspect-[16/8] w-full object-cover object-center"/></div>
      <div className="mt-12 grid gap-10 border-t border-[#d8cdbb] pt-10 sm:grid-cols-2"><div><h2 className="font-display text-3xl font-bold">這次想做的，不只是一冊書</h2><p className="mt-4 leading-8 text-[#5f544c]">特裝版會採精裝書衣、前後蝴蝶頁與燙金藏書票。典藏組另外收錄兩位主角的雙面壓克力立牌、燙銀角色卡與書盒；每一項回饋都會在打樣完成後於進度頁公開確認。</p></div><div className="border-l border-[#d8cdbb] pl-0 sm:pl-8"><h3 className="font-display text-2xl font-bold">製作時程</h3><ul className="mt-5 space-y-4 text-sm"><li className="flex gap-3"><Check className="mt-0.5 shrink-0 text-[#b84236]" size={17}/><span><b>2026/08</b>　完成內容校對與書封提案</span></li><li className="flex gap-3"><Check className="mt-0.5 shrink-0 text-[#b84236]" size={17}/><span><b>2026/09</b>　完成印刷、周邊打樣確認</span></li><li className="flex gap-3"><PackageCheck className="mt-0.5 shrink-0 text-[#b84236]" size={17}/><span><b>2026/11</b>　依贊助方案分批寄出</span></li></ul></div></div>
      <div className="mt-14 border-t border-[#d8cdbb] pt-10"><p className="font-mono text-[11px] tracking-[0.16em] text-[#a43c34]">UPDATE · 2026.08.12</p><h2 className="font-display mt-3 text-3xl font-bold">我們把月光放進了書盒的內襯</h2><p className="mt-4 max-w-2xl leading-8 text-[#5f544c]">首輪樣紙已完成測試，內襯選用偏霧面的珍珠紙，讓月海的藍色在不同角度有更安靜的反光。下一篇更新會公開立牌的正式線稿。</p></div>
    </div>
    <aside className="lg:sticky lg:top-24 lg:h-fit"><div className="border border-[#cfc2b1] bg-[#fffdf7] p-6 shadow-[6px_7px_0_rgba(43,34,29,.12)]"><div className="flex items-start justify-between border-b border-dashed border-[#cfc2b1] pb-4"><div><p className="font-mono text-[10px] tracking-[0.14em] text-[#8b7466]">老東家集資收據</p><p className="font-mono mt-1 text-[10px] text-[#a23b33]">NO. ODJ-MH-0826</p></div><span className="stamp border-2 border-[#b84236] px-2 py-1 font-mono text-[10px] font-bold tracking-[0.13em] text-[#b84236]">已達標</span></div><div className="mt-5 flex items-end justify-between"><div><p className="font-mono text-xs text-[#6e625a]">本期落款總額</p><p className="font-mono mt-2 text-3xl font-medium">NT$ 438,560</p></div><p className="font-mono text-sm text-[#b84236]">146%</p></div><div className="mt-5 h-[4px] bg-[#e1d6c5]"><div className="h-full w-full bg-[#b84236]"/></div><div className="mt-3 flex justify-between font-mono text-[10px] text-[#675b52]"><span>目標 NT$ 300,000</span><span>期限 剩 16 天</span></div><div className="mt-6 grid grid-cols-2 border-y border-dashed border-[#cfc2b1] py-4"><div><p className="font-mono text-lg">642</p><p className="mt-1 text-[10px] tracking-[0.08em] text-[#71655c]">已落款讀者</p></div><div className="border-l border-[#e0d6c7] pl-4"><p className="font-mono text-lg">11.28</p><p className="mt-1 text-[10px] tracking-[0.08em] text-[#71655c]">預計交件日</p></div></div>
        <div className="mt-7"><div className="mb-3 flex items-center justify-between"><p className="text-xs font-bold tracking-[0.1em] text-[#594c43]">選一份落款</p><p className="font-mono text-[10px] text-[#8b7466]">RETURN / 03</p></div><div className="space-y-2">{rewardOptions.map((option, index) => <button key={option.id} onClick={() => setSelected(option.id)} className={`w-full border p-3 text-left transition ${selected === option.id ? "border-[#b84236] bg-[#f8eee2]" : "border-[#ded3c4] hover:border-[#a59280]"}`}><div className="flex items-start justify-between gap-3"><div className="flex gap-2"><span className="font-mono text-[10px] text-[#a23b33]">0{index + 1}</span><div><p className="text-sm font-bold">{option.name}</p><p className="mt-1 text-xs leading-5 text-[#71655c]">{option.detail}</p></div></div><p className="font-mono shrink-0 text-sm">{option.price}</p></div><p className={`mt-2 font-mono text-[10px] ${option.stock.includes("剩") ? "text-[#b84236]" : "text-[#71655c]"}`}>{option.stock}</p></button>)}</div></div>
        <button onClick={() => setModalOpen(true)} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#b84236] py-4 text-sm font-bold text-[#fff9ed] transition hover:bg-[#963128] active:scale-[0.97]">選擇「{current.name}」<Heart size={16}/></button><div className="mt-5 flex gap-2 border-t border-[#e3d9cc] pt-4 text-[11px] leading-5 text-[#75685e]"><ShieldCheck className="mt-0.5 shrink-0 text-[#b84236]" size={16}/>此為互動原型，不會收取實際款項。正式版本可在此呈現退款、金流與寄送條款。</div></div></aside></div></main>
    {modalOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-[#29211d]/50 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-md bg-[#fffaf0] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="font-mono text-xs text-[#a43c34]">SPONSOR CHECKOUT · DEMO</p><h2 className="font-display mt-2 text-3xl font-bold">確認你的落款</h2></div><button onClick={() => setModalOpen(false)} aria-label="關閉"><X size={20}/></button></div><div className="mt-6 border-y border-[#ded3c4] py-4"><p className="font-semibold">{current.name}</p><p className="mt-1 text-sm text-[#71655c]">{current.detail}</p><p className="font-mono mt-3 text-xl">{current.price}</p></div><p className="mt-5 text-sm leading-7 text-[#665a51]">這一步在正式產品中會串接贊助者資料、配送方式與受管控的付款流程。</p><button onClick={continueToSponsor} className="mt-6 w-full bg-[#b84236] py-3.5 text-sm font-bold text-[#fff9ed] transition hover:bg-[#963128] active:scale-[0.97]">完成方案選擇（示意）</button></div></div>}
  </div>;
}
