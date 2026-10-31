import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

const TOGGLE = "mt-2 inline-flex items-center gap-1 text-sm font-semibold text-purple-400 hover:text-purple-300";

function DisclosureToggle({ open, label, onToggle }: { open: boolean; label: string; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-expanded={open} className={TOGGLE}>
      {open ? "Show less" : label}
      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

const CLAMP = { 2: "line-clamp-2", 3: "line-clamp-3", 4: "line-clamp-4" } as const;

/**
 * Paragraph clamped to a few lines with a "Read more" toggle. The toggle only
 * appears when the text actually overflows.
 */
export function ClampText({
  children,
  lines = 3,
  className = "",
}: {
  children: ReactNode;
  lines?: keyof typeof CLAMP;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || open) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, children]);

  return (
    <div>
      <p ref={ref} className={`${className} ${open ? "" : CLAMP[lines]}`}>
        {children}
      </p>
      {(overflows || open) && <DisclosureToggle open={open} label="Read more" onToggle={() => setOpen((o) => !o)} />}
    </div>
  );
}

/** Content hidden behind a toggle, animated open/closed. */
export function Expandable({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          {children}
        </div>
      </div>
      <DisclosureToggle open={open} label={label} onToggle={() => setOpen((o) => !o)} />
    </div>
  );
}
