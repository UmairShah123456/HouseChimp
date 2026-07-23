"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

/** Tappable checkout checklist on the dark card (design 2d). State is local. */
export function CheckoutChecklist({ items }: { items: string[] }) {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));

  return (
    <div className="mt-1.5 rounded-[var(--radius-lg)] bg-dark p-4.5 text-white">
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() =>
              setDone((prev) => prev.map((v, j) => (j === i ? !v : v)))
            }
            className="flex items-center gap-2.5 text-left text-[13.5px]"
          >
            <span
              className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[var(--radius-sm)] border-2 border-accent-gold ${
                done[i] ? "bg-accent-gold" : ""
              }`}
            >
              {done[i] && <CheckIcon className="h-3 w-3 text-dark" />}
            </span>
            <span className={done[i] ? "text-white/45 line-through" : ""}>
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
