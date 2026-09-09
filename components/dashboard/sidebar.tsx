import Image from "next/image";

const navItems: { label: string; href: string; soon?: boolean }[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Donations", href: "/donations" },
  { label: "Expenses", href: "/expenses" },
  { label: "Staff", href: "/staff" },
  { label: "Salaries", href: "/salaries" },
  { label: "Reports", href: "/reports" },
  { label: "Receipts", href: "/receipts" },
  { label: "Events", href: "/events" },
];

export function DashboardSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--color-parchment-dim)] bg-[var(--color-ink)] px-5 py-8 text-[var(--color-parchment)] sm:flex">
      <div className="flex items-center gap-2">
        <Image src="/brand/logo-symbol-dark.png" alt="" width={28} height={28} />
        <span className="font-display text-lg tracking-tight">Khidmat-360</span>
      </div>
      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map((item) =>
          item.soon ? (
            <span
              key={item.label}
              className="flex items-center justify-between rounded-sm px-3 py-2 text-sm text-[var(--color-sage)]/60"
            >
              {item.label}
              <span className="font-mono text-[9px] uppercase tracking-wider">
                Soon
              </span>
            </span>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className={
                item.href === currentPath
                  ? "rounded-sm bg-white/10 px-3 py-2 text-sm font-medium"
                  : "rounded-sm px-3 py-2 text-sm font-medium text-[var(--color-parchment)]/90 hover:bg-white/10"
              }
            >
              {item.label}
            </a>
          )
        )}
      </nav>

      <div className="border-t border-[var(--color-parchment)]/10 pt-3">
        <a
          href="/profile"
          className={
            "/profile" === currentPath
              ? "block rounded-sm bg-white/10 px-3 py-2 text-sm font-medium"
              : "block rounded-sm px-3 py-2 text-sm font-medium text-[var(--color-parchment)]/90 hover:bg-white/10"
          }
        >
          Masjid Profile
        </a>
      </div>
    </aside>
  );
}
