"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

interface DevNoteProps {
  note: string;
  label?: string;
}

export default function DevNote({ note, label = "DEV NOTE" }: DevNoteProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400/80 transition-colors hover:bg-amber-400/10 hover:text-amber-300"
        aria-label="Developer note"
      >
        <Info className="h-3 w-3" />
        <span className="hidden sm:inline">{label}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-lg border border-amber-500/30 bg-slate-900 p-3 text-xs leading-relaxed text-slate-300 shadow-xl">
          <p className="mb-1 font-semibold text-amber-400">{label}</p>
          <p>{note}</p>
        </div>
      )}
    </div>
  );
}
