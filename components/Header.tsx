"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer } from "lucide-react";

const navLinks = [
  { href: "/demo", label: "Demo" },
  { href: "/developers", label: "Developers" },
  { href: "/research", label: "Research" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forge-600/20 ring-1 ring-forge-500/30">
            <Hammer className="h-4 w-4 text-forge-400" />
          </div>
          <span className="text-lg font-bold tracking-tight">RetryForge</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-forge-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/demo"
          className="rounded-lg bg-forge-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forge-500"
        >
          Try Demo
        </Link>
      </div>
    </header>
  );
}
