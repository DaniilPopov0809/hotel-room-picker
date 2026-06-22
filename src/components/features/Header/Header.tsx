import Link from "next/link";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-2 sm:px-6 lg:px-8">
      <Link href="/" className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
        Hotel deals
      </Link>
    </header>
  )
}
