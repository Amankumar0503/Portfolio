"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardStats from "@/components/admin/DashboardStats";
import { DashboardStats as StatsType, ContactMessage } from "@/types";

const emptyStats: StatsType = {
  totalProjects: 0,
  featuredProjects: 0,
  totalSkills: 0,
  totalExperiences: 0,
  unreadMessages: 0,
  totalMessages: 0,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsType>(emptyStats);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((res) => res.json()),
      fetch("/api/skills").then((res) => res.json()),
      fetch("/api/experience").then((res) => res.json()),
      fetch("/api/messages").then((res) => res.json()),
    ])
      .then(([projects, skills, experiences, messages]) => {
        const projectList = Array.isArray(projects) ? projects : [];
        const skillList = Array.isArray(skills) ? skills : [];
        const experienceList = Array.isArray(experiences) ? experiences : [];
        const messageList = Array.isArray(messages) ? messages : [];

        setStats({
          totalProjects: projectList.length,
          featuredProjects: projectList.filter((project) => project.is_featured).length,
          totalSkills: skillList.length,
          totalExperiences: experienceList.length,
          unreadMessages: messageList.filter((message) => !message.is_read).length,
          totalMessages: messageList.length,
        });
        setRecentMessages(messageList.slice(0, 5));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Update the public site from here.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-500">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { href: "/admin/projects", label: "Add project" },
            { href: "/admin/skills", label: "Add skill" },
            { href: "/admin/experience", label: "Add experience" },
            { href: "/admin/about", label: "Edit about" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="admin-panel px-4 py-4 text-sm font-medium text-zinc-900 transition hover:border-zinc-400 dark:text-white dark:hover:border-zinc-600"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-zinc-500">Recent messages</h3>
          <Link href="/admin/messages" className="text-sm text-zinc-900 underline-offset-4 hover:underline dark:text-white">
            View all
          </Link>
        </div>
        <div className="admin-panel divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentMessages.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-zinc-500">No messages yet.</p>
          ) : (
            recentMessages.map((message) => (
              <Link
                key={message.id}
                href="/admin/messages"
                className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {message.name}
                  </p>
                  <p className="truncate text-sm text-zinc-500">{message.subject}</p>
                </div>
                {!message.is_read && (
                  <span className="mt-0.5 rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-white dark:text-zinc-900">
                    New
                  </span>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
