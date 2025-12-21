"use client";
import { ReactNode } from "react";

export const PageCardTag: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-400 transition-colors group-hover:bg-black/20">
      {children}
    </div>
  );
};
