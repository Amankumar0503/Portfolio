import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPE = "application/pdf";

export async function POST(request: Request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== ALLOWED_TYPE) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const uploaded = await uploadFile(`documents/resume-${Date.now()}.pdf`, file);
    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("Error uploading resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
