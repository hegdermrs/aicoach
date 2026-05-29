import Link from "next/link";

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          AI Execution Accelerator
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Member prep portal</p>

        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-zinc-700 py-3 text-sm font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900/50"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
