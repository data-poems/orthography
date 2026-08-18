import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";

const PROJECT_ROOT = import.meta.dirname;

/** Vite `base` must start and end with `/`. Production default `/writing/`. */
function normalizeViteBase(raw: string | undefined, mode: string): string {
  if (raw != null && String(raw).trim() !== "") {
    const t = String(raw).trim();
    const withLead = t.startsWith("/") ? t : `/${t}`;
    return withLead.endsWith("/") ? withLead : `${withLead}/`;
  }
  return mode === "production" ? "/writing/" : "/";
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, PROJECT_ROOT, "");
  const base = normalizeViteBase(env.VITE_BASE_PATH, mode);

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(PROJECT_ROOT, "client", "src"),
      },
    },
    envDir: PROJECT_ROOT,
    root: path.resolve(PROJECT_ROOT, "client"),
    build: {
      outDir: path.resolve(PROJECT_ROOT, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
    preview: {
      host: "127.0.0.1",
      port: 4173,
    },
  };
});
