import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/NotFound";
import NewBatchRunPage from "@/pages/NewBatchRun";
import RunDetailPage from "@/pages/RunDetail";
import RunsListPage from "@/pages/RunsList";
import SignInPage from "@/pages/SignIn";
import SignUpPage from "@/pages/SignUp";
import TeamManagementPage from "@/pages/TeamManagement";
import { Route, Switch } from "wouter";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Switch>
            <Route path="/sign-in" component={SignInPage} />
            <Route path="/sign-up" component={SignUpPage} />
            <Route path="/">
              <ProtectedRoute>
                <NewBatchRunPage />
              </ProtectedRoute>
            </Route>
            <Route path="/runs">
              <ProtectedRoute>
                <RunsListPage />
              </ProtectedRoute>
            </Route>
            <Route path="/runs/:id">
              <ProtectedRoute>
                <RunDetailPage />
              </ProtectedRoute>
            </Route>
            <Route path="/team">
              <ProtectedRoute adminOnly>
                <TeamManagementPage />
              </ProtectedRoute>
            </Route>
            <Route component={NotFound} />
          </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
