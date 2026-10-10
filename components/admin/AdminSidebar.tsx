"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/admin", label: "Overview", icon: GridIcon },
  { href: "/admin/about", label: "About", icon: UserIcon },
  { href: "/admin/skills", label: "Skills", icon: SparkIcon },
  { href: "/admin/projects", label: "Projects", icon: FolderIcon },
  { href: "/admin/experience", label: "Experience", icon: BriefcaseIcon },
  { href: "/admin/social", label: "Social", icon: LinkIcon },
  { href: "/admin/messages", label: "Messages", icon: MailIcon },
];

export default function AdminSidebar({
  open,
  collapsed,
  onClose,
}: {
  open: boolean;
  collapsed: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [unread, setUnread] = useState(0);
  const [drawerMounted, setDrawerMounted] = useState(open);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setDrawerOpen(false);
      const timer = window.setTimeout(() => setDrawerMounted(false), 380);
      return () => window.clearTimeout(timer);
    }

    setDrawerMounted(true);
    setDrawerOpen(false);
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setDrawerOpen(true));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [open]);

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => (res.ok ? res.json() : []))
      .then((messages) => {
        if (Array.isArray(messages)) {
          setUnread(messages.filter((message) => !message.is_read).length);
        }
      })
      .catch(() => setUnread(0));
  }, [pathname]);

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center px-5">
        <Link href="/admin" onClick={onClose} className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-white">
          Portfolio
          <span className="ml-2 rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              <Icon />
              <span className="flex-1">{item.label}</span>
              {item.href === "/admin/messages" && unread > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    active
                      ? "bg-white/20 text-white dark:bg-zinc-900/10 dark:text-zinc-900"
                      : "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  }`}
                >
                  {unread}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <div className="mb-2 truncate px-2 text-xs text-zinc-500">
          {user?.primaryEmailAddress?.emailAddress}
        </div>
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <LogoutIcon />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-zinc-200 bg-white transition-transform duration-300 ease-out dark:border-zinc-800 dark:bg-zinc-950 lg:block ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {nav}
      </aside>
      {drawerMounted && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className={`drawer-backdrop absolute inset-0 bg-black/50 ${drawerOpen ? "is-open" : ""}`}
            onClick={onClose}
          />
          <aside className={`drawer-panel absolute inset-y-0 left-0 w-72 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 ${drawerOpen ? "is-open" : ""}`}>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}

function GridIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19.2c1.4-2.6 3.8-4 7-4s5.6 1.4 7 4" strokeLinecap="round" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" strokeLinejoin="round" />
    </svg>
  );
}
function FolderIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 7.5A2.5 2.5 0 015.5 5H9l2 2h7.5A2.5 2.5 0 0121 9.5v7A2.5 2.5 0 0118.5 19h-13A2.5 2.5 0 013 16.5v-9z" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5.5A1.5 1.5 0 019.5 4h5A1.5 1.5 0 0116 5.5V7" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 14a5 5 0 007.07 0l1.41-1.41a5 5 0 00-7.07-7.07L10 6.9" strokeLinecap="round" />
      <path d="M14 10a5 5 0 00-7.07 0L5.5 11.41a5 5 0 007.07 7.07L14 17.1" strokeLinecap="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M10 7V5a2 2 0 012-2h7v18h-7a2 2 0 01-2-2v-2" strokeLinecap="round" />
      <path d="M4 12h11M11 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
