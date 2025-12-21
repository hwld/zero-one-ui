import clsx from "clsx";
import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";

export const buttonBaseClass =
  "flex h-7 items-center gap-1 text-nowrap rounded-sm px-2 text-xs transition-colors";
export const buttonClass = {
  default:
    "border text-zinc-200 border-zinc-600 bg-zinc-700 hover:bg-zinc-600 ",
  ghost: "hover:bg-white/10",
};

type Props = {
  children: ReactNode;
  variant?: "default" | "ghost";
} & ComponentPropsWithoutRef<"button">;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "default", children, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={clsx(buttonBaseClass, buttonClass[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
});
