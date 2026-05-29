"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions";

interface HeaderProps {
  name?: string;
  showAdmin?: boolean;
}

function navLinkClass(active: boolean) {
  return active
    ? "font-medium text-zinc-50"
    : "text-zinc-400 hover:text-zinc-200";
}

export function Header({ name, showAdmin }: HeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");
  const isPrep = pathname.startsWith("/prep");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <Link href="/" className="text-lg font-semibold text-zinc-50">
            AI Execution Accelerator
          </Link>
          {name && (
            <p className="truncate text-sm text-zinc-500">Welcome, {name}</p>
          )}
        </div>
        <nav className="flex shrink-0 items-center gap-1 sm:gap-4 text-sm">
          <Link href="/" className={`px-2 py-1 ${navLinkClass(isDashboard)}`}>
            Dashboard
          </Link>
          {showAdmin && (
            <Link
              href="/admin"
              className={`px-2 py-1 ${navLinkClass(isAdminPage)}`}
            >
              Admin
            </Link>
          )}
          {isPrep && (
            <span className="hidden px-2 py-1 text-zinc-600 sm:inline">
              Prep
            </span>
          )}
          <form action={signOut} className="ml-1 sm:ml-2">
            <button
              type="submit"
              className="px-2 py-1 text-zinc-500 hover:text-zinc-300"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
