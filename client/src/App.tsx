import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminReview from "./pages/AdminReview";
import CreateProposal from "./pages/CreateProposal";
import { OfficialPage, PrivacyPage, TermsPage } from "./pages/LegalPages";
import Project from "./pages/Project";

/**
 * 老東家設計提醒：晨霧、曙光杏橘與深靛組成可讀的日出航線；官方與法律資訊頁維持清楚、克制且可抵達。
 */

const routePrefix = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");

function SiteRouter() {
  return (
    <Switch>
      <Route path={`${routePrefix}/`} component={Home} />
      <Route path={`${routePrefix}/dashboard`} component={Dashboard} />
      <Route path={`${routePrefix}/dashboard/`} component={Dashboard} />
      <Route path={`${routePrefix}/admin/reviews`} component={AdminReview} />
      <Route path={`${routePrefix}/admin/reviews/`} component={AdminReview} />
      <Route path={`${routePrefix}/create`} component={CreateProposal} />
      <Route path={`${routePrefix}/create/`} component={CreateProposal} />
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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
