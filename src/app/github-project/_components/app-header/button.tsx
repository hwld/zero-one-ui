import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import React from "react";
import { ComponentPropsWithoutRef } from "react";

type Props = {
  icon: LucideIcon;
  rightIcon?: LucideIcon;
} & ComponentPropsWithoutRef<"button">;

export const HeaderButton = React.forwardRef<HTMLButtonElement, Props>(function HeaderButton(
  { icon: Icon, rightIcon: RightIcon, ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        "flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-md border border-neutral-600 text-neutral-400 transition-colors hover:bg-white/10",
        RightIcon ? "px-2" : "w-8",
      )}
    >
      <Icon size={18} />
      {RightIcon && <RightIcon size={18} />}
    </button>
  );
});
