import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { MosqueSetupForm } from "@/components/setup/mosque-setup-form";

export default async function SetupPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");
  if (session.user.mosqueId) redirect("/dashboard");

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--color-ink)] px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brass-bright)]">
          Step 1 of 1
        </p>
        <h1 className="mt-3 text-center font-display text-3xl italic text-[var(--color-parchment)]">
          Add your masjid
        </h1>
        <p className="mt-3 text-center text-sm text-[var(--color-sage)]">
          Just the basics — you can fill in the rest later.
        </p>
        <MosqueSetupForm />
      </div>
    </div>
  );
}
