/**
 * 老東家晨光日出設計提醒：頁尾是地平線，使用霧藍與深靛整理官方資訊；所有法律連結保持低干擾但清楚可抵達。
 */

const asset = (name: string) => `${import.meta.env.BASE_URL}media/${name}`;
const basePath = import.meta.env.BASE_URL;

export default function SiteFooter() {
  return <footer className="border-t border-[#bcd7e1] bg-[#eaf4f5] text-[#294761]">
    <div className="container grid gap-10 py-12 lg:grid-cols-[1.25fr_.9fr_.9fr]">
      <div>
        <a href={basePath} className="inline-flex items-center gap-3" aria-label="回到老東家首頁"><img className="size-10 shrink-0 rounded-[14px] object-cover object-center shadow-sm ring-1 ring-[#e4ab52]/45" src={asset("odj-sunrise-icon.png")} alt="老東家日出圖示"/><span className="font-display text-xl font-black tracking-[0.08em] text-[#172846]">老東家</span></a>
        <p className="mt-4 max-w-sm text-sm leading-7 text-[#607f91]">ODJ Sponsor 是為華文小說與衍生周邊規劃的群眾支持平台原型。故事先被讀見，再迎著光出發。</p>
      </div>
      <div><p className="font-mono text-[10px] tracking-[0.16em] text-[#d85c36]">OFFICIAL INFORMATION</p><div className="mt-4 space-y-3 text-sm"><a className="block transition hover:text-[#e15b32]" href={`${basePath}about`}>關於老東家與平台狀態</a><a className="block transition hover:text-[#e15b32]" href={`${basePath}#shelf`}>今日啟航</a><a className="block transition hover:text-[#e15b32]" href={`${basePath}#workshop`}>晨光工坊</a><a className="block transition hover:text-[#e15b32]" href="https://www.facebook.com/share/19TwFNqfoG/?mibextid=wwXIfr" target="_blank" rel="noreferrer">Facebook 官方社群</a><a className="block transition hover:text-[#e15b32]" href="https://github.com/larrylai777/ODJ-Sponsor" target="_blank" rel="noreferrer">GitHub 原型原始碼</a></div></div>
      <div><p className="font-mono text-[10px] tracking-[0.16em] text-[#d85c36]">POLICY & TERMS</p><div className="mt-4 space-y-3 text-sm"><a className="block transition hover:text-[#e15b32]" href={`${basePath}privacy`}>隱私權政策</a><a className="block transition hover:text-[#e15b32]" href={`${basePath}terms`}>網站使用條款</a><p className="pt-1 text-xs leading-6 text-[#718d9d]">目前為公開互動原型，未啟用會員、付款、訂單、配送或客服收件功能。</p></div></div>
    </div>
    <div className="border-t border-[#c6dee5]"><div className="container flex flex-col justify-between gap-2 py-5 text-xs leading-6 text-[#668294] sm:flex-row"><p>© 2026 老東家 ODJ Sponsor · 官方資訊最後更新：2026 年 8 月 17 日</p><p>本網站內容僅供概念展示，不構成付款邀約或交易要約。</p></div></div>
  </footer>;
}
