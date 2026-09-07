import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma/client";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { EventForm } from "@/components/events/event-form";

const categoryLabels: Record<string, string> = {
  JUMMAH: "Jummah",
  TARAWEEH: "Taraweeh",
  EID: "Eid Prayers",
  QURAN_CLASS: "Quran Class",
  LECTURE: "Islamic Lecture",
  FUNDRAISING: "Fundraising",
  OTHER: "Other",
};

function formatWhen(start: Date, end: Date | null) {
  const date = start.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const startTime = start.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!end) return `${date} · ${startTime}`;
  const endTime = end.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} · ${startTime}–${endTime}`;
}

export default async function EventsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/unauthorized");
  if (!session.user.mosqueId) redirect("/setup");

  const mosqueId = session.user.mosqueId;
  const now = new Date();

  const [upcoming, past] = await Promise.all([
    prisma.event.findMany({
      where: { mosqueId, startsAt: { gte: now } },
      orderBy: { startsAt: "asc" },
    }),
    prisma.event.findMany({
      where: { mosqueId, startsAt: { lt: now } },
      orderBy: { startsAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="flex min-h-screen flex-1 bg-[var(--color-parchment)] text-[var(--color-ink)]">
      <DashboardSidebar currentPath="/events" />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-parchment-dim)] px-6 py-5 sm:px-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[var(--color-brass)]">
              Community
            </p>
            <h1 className="font-display text-2xl italic">Events</h1>
          </div>
          <SignOutButton />
        </header>

        <main className="flex-1 px-6 py-10 sm:px-10">
          <EventForm />

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <section>
              <h2 className="font-display text-lg italic">Upcoming</h2>
              <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                {upcoming.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                    No upcoming events scheduled.
                  </p>
                ) : (
                  upcoming.map((event) => (
                    <div key={event.id} className="px-4 py-3">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                        {categoryLabels[event.category] ?? event.category} ·{" "}
                        {formatWhen(event.startsAt, event.endsAt)}
                      </p>
                      {event.description && (
                        <p className="mt-1 text-sm text-[var(--color-ink)]/70">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg italic">Past</h2>
              <div className="mt-4 divide-y divide-[var(--color-parchment-dim)] rounded-sm bg-white/40">
                {past.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-[var(--color-ink)]/60">
                    No past events yet.
                  </p>
                ) : (
                  past.map((event) => (
                    <div key={event.id} className="px-4 py-3 opacity-70">
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[var(--color-ink)]/50">
                        {categoryLabels[event.category] ?? event.category} ·{" "}
                        {formatWhen(event.startsAt, event.endsAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
