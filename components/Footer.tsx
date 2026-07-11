import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-forge-400">RetryForge</span>
          <span className="text-sm text-slate-500">© 2026</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <Link href="/demo" className="transition-colors hover:text-forge-400">
            Live Demo
          </Link>
          <Link href="/developers" className="transition-colors hover:text-forge-400">
            Developers
          </Link>
          <Link href="/research" className="transition-colors hover:text-forge-400">
            How we found this idea
          </Link>
        </nav>
      </div>
    </footer>
  );
}
