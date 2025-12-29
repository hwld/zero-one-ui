"use client";
import { ReactNode } from "react";

export const PageCardTag: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="rounded-sm border border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-400 transition-colors">
      {children}
    </div>
  );
};
