import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { MosqueProfileForm } from "@/components/profile/mosque-profile-form";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");
  if (!session.user.mosqueId) redirect("/dashboard/setup");

  const mosque = await prisma.mosque.findUnique({
    where: { id: session.user.mosqueId },
  });

  if (!mosque) redirect("/dashboard/setup");

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/dashboard/profile" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Settings
            </p>
            <h1 className="font-display text-2xl italic">Masjid profile</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <MosqueProfileForm
            defaultValues={{
              name: mosque.name,
              address: mosque.address ?? "",
              city: mosque.city ?? "",
              phone: mosque.phone ?? "",
              email: mosque.email ?? "",
            }}
          />
        </main>
      </div>
    </div>
  );
}
