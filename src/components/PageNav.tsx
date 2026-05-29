import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageNavProps {
  backHref?: string;
  backLabel?: string;
  items?: BreadcrumbItem[];
}

export function PageNav({
  backHref = "/dashboard",
  backLabel = "Back to dashboard",
  items = [],
}: PageNavProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 space-y-2">
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-zinc-200"
      >
        <span aria-hidden="true">←</span>
        {backLabel}
      </Link>
      {items.length > 0 && (
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && <span className="text-zinc-700">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-zinc-300">
                  {item.label}
                </Link>
              ) : (
                <span className="text-zinc-300">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
