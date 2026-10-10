import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  byDisplayOrder,
  collections,
  createDoc,
  listDocs,
} from "@/lib/mongo/store";
import type { Skill } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const skills = byDisplayOrder(await listDocs<Skill>(collections.skills));
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
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
    const skill = await createDoc<Skill>(collections.skills, body);
    return NextResponse.json(skill);
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
