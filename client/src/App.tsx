/**
 * Vellum by default; shared links may select the Midnight plate.
 */
import { useState } from "react";
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
  const [night, setNight] = useState(document.documentElement.dataset.theme === "midnight");
  function toggleTheme() {
    const next = !night;
    setNight(next);
    document.documentElement.dataset.theme = next ? "midnight" : "vellum";
    const url = new URL(location.href);
    url.searchParams.set("theme", next ? "midnight" : "vellum");
    history.replaceState(history.state, "", url);
  }
  return (
    <ErrorBoundary>
      <button className="theme-switch" onClick={toggleTheme} aria-label={night ? "Use vellum theme" : "Use midnight theme"}>{night ? "Vellum" : "Midnight"}</button>
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
