/** Apple 式產品敘事提醒：頁尾收束為低干擾的深色資訊列；以細分隔線、台北黑體、政策與合作品牌連結，讓晨光日出品牌在內容結尾保持克制、明確。 */

const basePath = import.meta.env.BASE_URL;
const facebookUrl = "https://www.facebook.com/share/19TwFNqfoG/?mibextid=wwXIfr";
const bdNovelUrl = "https://larrylai777.github.io/bd-novel/";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="container flex flex-col gap-3 py-5 text-xs leading-5 text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 老東家 ODJ Sponsor</p>
        <nav aria-label="頁尾政策與聯絡連結" className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <a className="transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none" href={`${basePath}privacy`}>
            隱私權政策
          </a>
          <a className="transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none" href={`${basePath}terms`}>
            網站使用條款
          </a>
          <a className="transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none" href={facebookUrl} target="_blank" rel="noreferrer">
            聯絡我們
          </a>
          <a className="transition-colors duration-150 hover:text-white focus-visible:text-white focus-visible:outline-none" href={bdNovelUrl} target="_blank" rel="noreferrer">
            BÐ 小說 官方網站
          </a>
        </nav>
      </div>
    </footer>
  );
}
