import { NextResponse } from "next/server";
import { getAdminStatus, requireAdmin } from "@/lib/auth";
import {
  byDisplayOrder,
  collections,
  createDoc,
  listDocs,
} from "@/lib/mongo/store";
import type { SocialLink } from "@/types";

export const runtime = "nodejs";

export async function GET() {
  try {
    const status = await getAdminStatus();
    let links = byDisplayOrder(
      await listDocs<SocialLink>(collections.social)
    );

    if (status !== "admin") {
      links = links.filter((link) => link.is_visible !== false);
    }

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching social links:", error);
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
    const link = await createDoc<SocialLink>(collections.social, {
      ...body,
      is_visible: body.is_visible !== false,
    });
    return NextResponse.json(link);
  } catch (error) {
    console.error("Error creating social link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
