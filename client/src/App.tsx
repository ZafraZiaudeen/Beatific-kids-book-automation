import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import NewBatchRun from "./pages/NewBatchRun";
import Gallery from "./pages/Gallery";

const APP_ROUTES = ["/", "/gallery", "/404"] as const;

function registerRoutes() {
  if (typeof window === "undefined") {
    return;
  }

  const routeWindow = window as Window & {
    __WOUTER_ROUTES__?: string[];
  };

  routeWindow.__WOUTER_ROUTES__ = [...APP_ROUTES];
}

function Router() {
  useEffect(() => {
    registerRoutes();
  }, []);

  return (
    <Switch>
      <Route path={"/"} component={NewBatchRun} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/404"} component={NotFound} />
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
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
