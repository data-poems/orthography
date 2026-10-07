import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Midnight belongs to card captures; the interactive atlas always uses Vellum.
const params = new URLSearchParams(location.search);
document.documentElement.dataset.theme = params.get("bare") === "1" && params.get("theme") === "midnight" ? "midnight" : "vellum";
if (params.get("bare") === "1") document.documentElement.dataset.bare = "true";

createRoot(document.getElementById("root")!).render(<App />);
