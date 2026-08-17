import { AlertCircle, ArrowLeft } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";

/** 老東家晨光日出設計提醒：備用頁使用霧藍背景與杏橘訊號，並保留官方頁尾作為安全出口。 */

const basePath = import.meta.env.BASE_URL;

export default function NotFound() {
  return <div className="flex min-h-screen flex-col bg-[#f7fbfb] text-[#172846]"><main className="container grid flex-1 place-items-center py-16"><section className="w-full max-w-xl rounded-[30px] border border-[#c5dce4] bg-white/80 p-9 text-center dawn-shadow"><div className="mx-auto grid size-16 place-items-center rounded-[24px] bg-[#fff1e6] text-[#e15b32]"><AlertCircle size={30}/></div><p className="font-mono mt-7 text-[11px] tracking-[0.18em] text-[#e15b32]">ERROR / 404</p><h1 className="font-display mt-3 text-4xl font-black">這段航線還沒開通</h1><p className="mt-4 leading-8 text-[#587287]">你要找的頁面不存在、已移動，或尚未在老東家的晨光航線上開放。</p><a href={basePath} className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#f36b3b] px-6 py-3.5 text-sm font-bold text-[#fffaf3] transition hover:bg-[#d9522d]"><ArrowLeft size={16}/> 回到首頁</a></section></main><SiteFooter /></div>;
}
