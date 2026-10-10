import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  byDisplayOrder,
  collections,
  createDoc,
  listDocs,
} from "@/lib/mongo/store";
import type { Experience } from "@/types";

export const runtime = "nodejs";

function asExperience(body: Record<string, unknown>) {
  const endDate = body.end_date;
  return {
    ...body,
    type: body.type ?? "experience",
    end_date: endDate === "" || body.is_current ? null : endDate,
  };
}

export async function GET() {
  try {
    const timeline = byDisplayOrder(
      await listDocs<Experience>(collections.timeline)
    );
    const experiences = timeline.filter(
      (item) => !item.type || item.type === "experience"
    );
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
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

    const body = asExperience(await request.json());
    const experience = await createDoc<Experience>(collections.timeline, body);
    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
