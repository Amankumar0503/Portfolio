import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  collections,
  deleteDocById,
  updateDocById,
} from "@/lib/mongo/store";
import type { SocialLink } from "@/types";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const { id } = await params;
    const body = await request.json();
    const link = await updateDocById<SocialLink>(collections.social, id, body);

    if (!link) {
      return NextResponse.json(
        { error: "Social link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error updating social link:", error);
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
    await deleteDocById(collections.social, id);
    return NextResponse.json({ message: "Social link deleted successfully" });
  } catch (error) {
    console.error("Error deleting social link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
