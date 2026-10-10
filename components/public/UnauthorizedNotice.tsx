"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function UnauthorizedNotice() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("notice") !== "unauthorized") return;

    toast.error("You do not have access to the admin dashboard.");

    const next = new URLSearchParams(searchParams.toString());
    next.delete("notice");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return null;
}
