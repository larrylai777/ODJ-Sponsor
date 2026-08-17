import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import { OfficialPage, PrivacyPage, TermsPage } from "./pages/LegalPages";
import Project from "./pages/Project";

/**
 * 老東家設計提醒：晨霧、曙光杏橘與深靛組成可讀的日出航線；官方與法律資訊頁維持清楚、克制且可抵達。
 */

const routePrefix = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
const rallyBrandUrl = "https://store.line.me/search/zh-Hant?q=%E6%8B%89%E5%8A%9B%E4%B8%80%E6%96%B9";
const calmCatChannelUrl = "https://youtube.com/@calm_cat_channel?si=1VLQJ9lvOkUBzsX7";
const bdNovelUrl = "https://larrylai777.github.io/bd-novel/";

function ExternalBrandLinks() {
  useEffect(() => {
    const addBrandLinks = () => {
      const facebookLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="facebook.com"]')).filter((link) => link.closest("header") || link.closest(".fixed")?.className.includes("top-[52px]"));
      facebookLinks.forEach((facebookLink) => {
        const container = facebookLink.parentElement;
        let insertionPoint: HTMLAnchorElement = facebookLink;
        const existingRallyLink = Array.from(container?.querySelectorAll<HTMLAnchorElement>("a") ?? []).find((link) => link.href === rallyBrandUrl);

        if (existingRallyLink) {
          insertionPoint = existingRallyLink;
        } else {
          const brandLink = document.createElement("a");
          brandLink.href = rallyBrandUrl;
          brandLink.target = "_blank";
          brandLink.rel = "noreferrer";
          brandLink.dataset.rallyBrand = "true";
          brandLink.className = facebookLink.className || "flex items-center gap-1 text-[#424245] transition hover:text-[#f36b3b]";
          brandLink.textContent = "拉力一方 LINE STORE ↗";
          facebookLink.insertAdjacentElement("afterend", brandLink);
          insertionPoint = brandLink;
        }

        const existingCalmCatLink = Array.from(container?.querySelectorAll<HTMLAnchorElement>("a") ?? []).find((link) => link.href === calmCatChannelUrl);
        if (existingCalmCatLink) {
          insertionPoint = existingCalmCatLink;
        } else {
          const channelLink = document.createElement("a");
          channelLink.href = calmCatChannelUrl;
          channelLink.target = "_blank";
          channelLink.rel = "noreferrer";
          channelLink.dataset.calmCatChannel = "true";
          channelLink.className = facebookLink.className || "flex items-center gap-1 text-[#424245] transition hover:text-[#f36b3b]";
          channelLink.textContent = "寧靜喵 YouTube 頻道 ↗";
          insertionPoint.insertAdjacentElement("afterend", channelLink);
          insertionPoint = channelLink;
        }

        const hasBdNovelLink = Array.from(container?.querySelectorAll<HTMLAnchorElement>("a") ?? []).some((link) => link.href === bdNovelUrl);
        if (hasBdNovelLink) return;

        const bdNovelLink = document.createElement("a");
        bdNovelLink.href = bdNovelUrl;
        bdNovelLink.target = "_blank";
        bdNovelLink.rel = "noreferrer";
        bdNovelLink.dataset.bdNovel = "true";
        bdNovelLink.className = facebookLink.className || "flex items-center gap-1 text-[#424245] transition hover:text-[#f36b3b]";
        bdNovelLink.textContent = "BÐ 小說 官方網站 ↗";
        insertionPoint.insertAdjacentElement("afterend", bdNovelLink);
      });
    };

    const observer = new MutationObserver(addBrandLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    addBrandLinks();
    return () => observer.disconnect();
  }, []);

  return null;
}

function SiteRouter() {
  return (
    <Switch>
      <Route path={`${routePrefix}/`} component={Home} />
      <Route path={`${routePrefix}/dashboard`} component={Dashboard} />
      <Route path={`${routePrefix}/dashboard/`} component={Dashboard} />
      <Route path={`${routePrefix}/project/:slug`} component={Project} />
      <Route path={`${routePrefix}/project/:slug/`} component={Project} />
      <Route path={`${routePrefix}/about`} component={OfficialPage} />
      <Route path={`${routePrefix}/about/`} component={OfficialPage} />
      <Route path={`${routePrefix}/privacy`} component={PrivacyPage} />
      <Route path={`${routePrefix}/privacy/`} component={PrivacyPage} />
      <Route path={`${routePrefix}/terms`} component={TermsPage} />
      <Route path={`${routePrefix}/terms/`} component={TermsPage} />
      <Route path={`${routePrefix}/404`} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <SiteRouter />
          <ExternalBrandLinks />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
