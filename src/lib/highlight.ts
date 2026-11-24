import { codeToHtml } from "shiki";

/**
 * Highlights code at build time (server only). Emits both light and dark
 * token colours as CSS variables; globals.css picks one per theme, so no
 * highlighter ever ships to the browser.
 */
export async function highlight(code: string, lang: string): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
