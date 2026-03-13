import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Learn from "./pages/Learn";
import SavedSnippets from "./pages/SavedSnippets";
import AppLayout from "./components/AppLayout";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/editor"}>
        <AppLayout>
          <Editor />
        </AppLayout>
      </Route>
      <Route path={"/learn"}>
        <AppLayout>
          <Learn />
        </AppLayout>
      </Route>
      <Route path={"/snippets"}>
        <AppLayout>
          <SavedSnippets />
        </AppLayout>
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
