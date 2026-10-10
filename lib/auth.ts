import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin-email";

export { isAdminEmail };

export async function getAdminStatus() {
  const { userId } = await auth();
  if (!userId) return "signed-out" as const;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  return isAdminEmail(email) ? ("admin" as const) : ("forbidden" as const);
}

export async function requireAdmin() {
  const status = await getAdminStatus();

  if (status === "signed-out") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (status === "forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
