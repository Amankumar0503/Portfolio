import { flushSync } from "react-dom";

type ThemeOrigin = { x: number; y: number };

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

export function themeOrigin(event: React.MouseEvent<HTMLElement>): ThemeOrigin {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function setTheme(
  isDark: boolean,
  origin?: ThemeOrigin,
  sync?: () => void
) {
  const root = document.documentElement;
  const apply = () => {
    if (sync) flushSync(sync);
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = (document as DocumentWithViewTransition).startViewTransition;

  if (!origin || reduced || !start) {
    apply();
    return;
  }

  const end = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y)
  );

  root.style.setProperty("--theme-x", `${origin.x}px`);
  root.style.setProperty("--theme-y", `${origin.y}px`);

  const radius = `${Math.ceil(end) + 2}px`;
  let style = document.getElementById("theme-circle-style");
  if (!style) {
    style = document.createElement("style");
    style.id = "theme-circle-style";
    document.head.appendChild(style);
  }
  style.textContent = `@keyframes theme-circle { from { --theme-radius: 0px; } to { --theme-radius: ${radius}; } }`;

  start.call(document, apply);
}
