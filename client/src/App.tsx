/**
 * Light theme only; the ground is vellum, so no dark mode toggle.
 */
import NotFound from "@/pages/NotFound";
import { Route, Router, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Origins from "./pages/Origins";

/** Wouter `base` has no trailing slash; Vite `BASE_URL` is like `/writing/` or `/`. */
function routerBaseFromVite(): string | undefined {
  const raw = import.meta.env.BASE_URL ?? "/";
  const trimmed = raw.replace(/\/$/, "");
  return trimmed === "" ? undefined : trimmed;
}

function RouterView() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/specimens"} component={Gallery} />
      <Route path={"/about"} component={About} />
      <Route path={"/origins"} component={Origins} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const base = routerBaseFromVite();
  return (
    <ErrorBoundary>
      {base ? (
        <Router base={base}>
          <RouterView />
        </Router>
      ) : (
        <RouterView />
      )}
    </ErrorBoundary>
  );
}

export default App;
