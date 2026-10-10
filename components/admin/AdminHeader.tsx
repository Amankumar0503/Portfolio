"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setTheme, themeOrigin } from "@/lib/theme";

const titles: { match: (path: string) => boolean; title: string }[] = [
  { match: (path) => path === "/admin", title: "Overview" },
  { match: (path) => path.startsWith("/admin/about"), title: "About" },
  { match: (path) => path.startsWith("/admin/skills"), title: "Skills" },
  { match: (path) => path === "/admin/projects/new", title: "New project" },
  { match: (path) => path.includes("/edit"), title: "Edit project" },
  { match: (path) => path.startsWith("/admin/projects"), title: "Projects" },
  { match: (path) => path.startsWith("/admin/experience"), title: "Experience" },
  { match: (path) => path.startsWith("/admin/social"), title: "Social links" },
  { match: (path) => path.startsWith("/admin/messages"), title: "Messages" },
];

export default function AdminHeader({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const title = titles.find((item) => item.match(pathname))?.title || "Admin";
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    setIsDark(theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = !isDark;
    setTheme(next, themeOrigin(event), () => setIsDark(next));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-zinc-50/90 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          aria-label="Open menu"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <Link href="/" className="admin-btn-ghost !py-2">
          View site
        </Link>
      </div>
    </header>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 14.5A7.5 7.5 0 019.5 4 7 7 0 1019 15.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
