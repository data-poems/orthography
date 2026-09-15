/** Join a public-file path to Vite's base (`/writing/` in production). */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const trimmed = path.replace(/^\/+/, "");
  return `${base}${trimmed}`;
}
