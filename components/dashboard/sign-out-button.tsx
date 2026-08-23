"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="rounded-full border border-[var(--color-ink)]/15 px-4 py-2 text-sm font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)]/5"
    >
      Sign out
    </button>
  );
}
