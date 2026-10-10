import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  byCreatedAtDesc,
  collections,
  listDocs,
  updateDocById,
} from "@/lib/mongo/store";
import type { ContactMessage } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const messages = byCreatedAtDesc(
      await listDocs<ContactMessage>(collections.messages)
    );
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
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

    const { id, is_read } = await request.json();
    const message = await updateDocById<ContactMessage>(
      collections.messages,
      id,
      { is_read }
    );

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
