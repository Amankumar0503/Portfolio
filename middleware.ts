import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin-email";

async function emailForUser(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.primaryEmailAddress?.emailAddress;
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (!isAdminArea || isLogin) return;

  const { userId } = await auth();

  if (!userId) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("redirect_url", pathname);
    return NextResponse.redirect(url);
  }

  if (!isAdminEmail(await emailForUser(userId))) {
    const url = new URL("/", request.url);
    url.searchParams.set("notice", "unauthorized");
    return NextResponse.redirect(url, 307);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
