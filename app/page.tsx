"use client";

import { useRef, useState } from "react";
import { NestedMenuDrawer } from "./components/NestedMenuDrawer";
import { menuCatalog } from "./lib/menuData";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-zinc-100 p-6 text-zinc-900">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Mobile drawer demo
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-zinc-900">
          Nested bottom sheet
        </h1>
      </div>

      <button
        ref={triggerRef}
        className="rounded-full bg-blue-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        Open Menu
      </button>

      <NestedMenuDrawer
        menu={menuCatalog}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        triggerRef={triggerRef}
      />
    </div>
  );
}
