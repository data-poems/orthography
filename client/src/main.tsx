import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Shared links can open the nocturnal plate without changing the vellum default.
const params = new URLSearchParams(location.search);
document.documentElement.dataset.theme = params.get("theme") === "midnight" ? "midnight" : "vellum";
if (params.get("bare") === "1") document.documentElement.dataset.bare = "true";

createRoot(document.getElementById("root")!).render(<App />);
