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
