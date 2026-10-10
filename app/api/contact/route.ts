import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/utils";
import { collections, createDoc } from "@/lib/mongo/store";
import type { ContactMessage } from "@/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const data = await createDoc<ContactMessage>(collections.messages, {
      name,
      email,
      subject,
      message,
      is_read: false,
    });

    return NextResponse.json({
      message: "Message sent successfully",
      data,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
