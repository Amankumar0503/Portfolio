import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  byDisplayOrder,
  collections,
  createDoc,
  listDocs,
} from "@/lib/mongo/store";
import type { Project } from "@/types";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const featured = new URL(request.url).searchParams.get("featured");
    let projects = byDisplayOrder(await listDocs<Project>(collections.projects));

    if (featured === "true") {
      projects = projects.filter((project) => project.is_featured);
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();
    const project = await createDoc<Project>(collections.projects, body);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
