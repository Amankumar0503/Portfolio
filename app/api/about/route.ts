import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAbout, saveAbout } from "@/lib/mongo/store";
import type { About } from "@/types";

export const runtime = "nodejs";

const placeholder: About = {
  id: "profile",
  title: "Welcome to My Portfolio",
  description:
    "This is a placeholder description. Please update this from the admin dashboard.",
  updated_at: new Date(0).toISOString(),
};

export async function GET() {
  try {
    const about = await getAbout<About>();
    return NextResponse.json(about ?? placeholder);
  } catch (error) {
    console.error("Error fetching about:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();
    const about = await saveAbout<About>({
      title: body.title,
      description: body.description,
      profile_image_url: body.profile_image_url ?? null,
      resume_url: body.resume_url ?? null,
    });

    return NextResponse.json(about);
  } catch (error) {
    console.error("Error updating about:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
