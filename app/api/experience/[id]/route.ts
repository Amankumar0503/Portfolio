import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  collections,
  deleteDocById,
  updateDocById,
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    const body = asExperience(await request.json());
    const experience = await updateDocById<Experience>(
      collections.timeline,
      id,
      body
    );

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(experience);
  } catch (error) {
    console.error("Error updating experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    await deleteDocById(collections.timeline, id);
    return NextResponse.json({ message: "Experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
