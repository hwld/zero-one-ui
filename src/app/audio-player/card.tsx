"use client";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

export const Card: React.FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex size-full min-h-0 flex-col rounded-lg border border-neutral-600 bg-neutral-800 p-4 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};
