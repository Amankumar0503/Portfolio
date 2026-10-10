import { DashboardStats as StatsType } from "@/types";
import Link from "next/link";

interface DashboardStatsProps {
  stats: StatsType;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    { label: "Projects", value: stats.totalProjects, hint: `${stats.featuredProjects} featured`, link: "/admin/projects" },
    { label: "Skills", value: stats.totalSkills, hint: "On your about page", link: "/admin/skills" },
    { label: "Experience", value: stats.totalExperiences, hint: "Timeline entries", link: "/admin/experience" },
    { label: "Unread", value: stats.unreadMessages, hint: `${stats.totalMessages} total messages`, link: "/admin/messages" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {statCards.map((card) => (
        <Link
          key={card.label}
          href={card.link}
          className="admin-panel p-5 transition hover:border-zinc-400 dark:hover:border-zinc-600"
        >
          <p className="text-sm text-zinc-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{card.hint}</p>
        </Link>
      ))}
    </div>
  );
}
