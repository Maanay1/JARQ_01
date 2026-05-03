"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-4">
      <section className="max-w-md rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-coral">
          <AlertTriangle size={17} />
          Something went sideways
        </div>
        <h1 className="mt-3 text-2xl font-semibold">JARQ could not load this view.</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65">{error.message || "Please try again."}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-ink px-3 text-sm font-semibold text-white"
          >
            <RotateCcw size={16} />
            Try again
          </button>
          <Link href="/" className="inline-flex h-10 items-center rounded-md border border-ink/10 px-3 text-sm font-semibold">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
