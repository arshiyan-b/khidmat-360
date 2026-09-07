"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "@/lib/auth/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await signIn.email({ email, password });

    setLoading(false);

    if (signInError) {
      setError(signInError.message ?? "Couldn't sign in. Check your details and try again.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-[var(--color-ink)] px-6 py-16">
      <div className="w-full max-w-sm">
        <Image
          src="/brand/logo-symbol-dark.png"
          alt=""
          width={56}
          height={56}
          className="mx-auto"
        />
        <p className="mt-4 text-center font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brass-bright)]">
          Khidmat-360
        </p>
        <h1 className="mt-3 text-center font-display text-3xl italic text-[var(--color-parchment)]">
          Sign in to your masjid
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 rounded-sm bg-[var(--color-parchment)] p-8 shadow-2xl shadow-black/40"
        >
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Email
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
              placeholder="you@yourmasjid.org"
            />
          </label>

          <label className="mt-5 block text-sm font-medium text-[var(--color-ink)]">
            Password
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-[var(--color-parchment-dim)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-brass)] focus:ring-2 focus:ring-[var(--color-brass)]/30"
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-sm bg-[var(--color-rust)]/10 px-3 py-2 text-sm text-[var(--color-rust)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-full bg-[var(--color-brass)] px-5 py-3 text-sm font-semibold text-[var(--color-ink-shadow)] transition-colors hover:bg-[var(--color-brass-bright)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
