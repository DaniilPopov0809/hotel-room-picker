import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-slate-950">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Hotel deals
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        The page you are looking for does not exist or was moved.
      </p>
      <Link
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-brand px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover"
        href="/"
      >
        Back to search
      </Link>
    </div>
  );
}
