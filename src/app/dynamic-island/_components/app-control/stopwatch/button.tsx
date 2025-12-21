import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode } from "react";

export const StopwatchButton: React.FC<
  {
    children: ReactNode;
    secondary?: boolean;
  } & ComponentPropsWithoutRef<"button">
> = ({ children, secondary, ...props }) => {
  return (
    <button
      className={clsx(
        "grid size-[35px] place-items-center rounded-full text-neutral-200 transition-colors disabled:cursor-not-allowed",
        secondary
          ? "bg-white/20 enabled:hover:bg-white/30 enabled:hover:text-neutral-50 disabled:bg-neutral-100/10 disabled:text-neutral-400"
          : "bg-neutral-100 text-neutral-900 enabled:hover:bg-neutral-300 disabled:bg-neutral-400 [&_svg]:fill-neutral-900",
      )}
      {...props}
    >
      {children}
    </button>
  );
};
