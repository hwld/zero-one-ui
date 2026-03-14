"use client";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export const SubButton: React.FC<{ children: ReactNode } & ComponentPropsWithoutRef<"button">> = ({
  children,
  ...props
}) => {
  return (
    <button
      className="grid size-8 shrink-0 place-items-center rounded-full text-[18px] transition-colors hover:bg-white/15 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
};
