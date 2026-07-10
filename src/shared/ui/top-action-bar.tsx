import type { ReactNode } from "react";

export function TopActionBar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-16 w-full shrink-0 items-center bg-page px-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      {children}
    </div>
  );
}
