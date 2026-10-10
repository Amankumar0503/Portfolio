"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { ConfirmProvider } from "@/components/admin/ConfirmDialog";

function AdminShell({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  return (
    <ConfirmProvider>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <AdminSidebar
          open={menuOpen}
          collapsed={!sidebarOpen}
          onClose={() => setMenuOpen(false)}
        />
        <div className={`sidebar-shift transition-[padding] duration-300 ease-out ${sidebarOpen ? "lg:pl-60" : "lg:pl-0"}`}>
          <AdminHeader
            onMenu={() => {
              if (window.matchMedia("(min-width: 1024px)").matches) {
                setSidebarOpen((current) => !current);
                return;
              }
              setMenuOpen(true);
            }}
          />
          <main key={pathname} className="admin-enter px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </ConfirmProvider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin/login")) {
    return (
      <>
        {children}
        <Toaster position="bottom-right" />
      </>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
