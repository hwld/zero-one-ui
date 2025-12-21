import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { IconType } from "@react-icons/all-files/lib";
import { TbLoader2 } from "@react-icons/all-files/tb/TbLoader2";
import { cn } from "../../../lib/utils";

type ButtonBaseProps = {
  isPending?: boolean;
} & ComponentPropsWithoutRef<"button">;

const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  function ButtonBase(
    { className, children, isPending = false, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(
          "relative flex items-center rounded-sm transition-colors select-none focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:outline-hidden",
          isPending && "pointer-events-none text-transparent!",
          className,
        )}
        {...props}
      >
        {children}
        {isPending && (
          <div className="absolute top-1/2 left-1/2 grid aspect-square h-full -translate-x-1/2 -translate-y-1/2 place-items-center">
            <TbLoader2 className="size-[70%] animate-spin text-neutral-400" />
          </div>
        )}
      </button>
    );
  },
);

type ButtonProps = {
  variant?: "default" | "ghost";
  size?: "md" | "sm";
  active?: boolean;
} & Omit<ButtonBaseProps, "className">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "default", size = "md", children, active, ...props },
    ref,
  ) {
    const sizeClass = {
      sm: "h-7 text-xs px-2",
      md: "h-8 text-sm px-3",
    } satisfies Record<typeof size, unknown>;

    const variantClass = {
      default:
        "bg-neutral-100 border border-neutral-300 text-neutral-700 hover:bg-neutral-200",
      ghost: " bg-transparent text-neutral-700 hover:bg-black/5",
    } satisfies Record<typeof variant, unknown>;

    return (
      <ButtonBase
        ref={ref}
        {...props}
        className={cn(
          variantClass[variant],
          sizeClass[size],
          active && "bg-neutral-200",
        )}
      >
        {children}
      </ButtonBase>
    );
  },
);

type IconButtonProps = {
  icon: IconType;
  size?: "sm" | "md";
  variant?: "default" | "muted";
} & Omit<ButtonBaseProps, "children">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon: Icon, size = "md", variant = "default", ...props },
    ref,
  ) {
    const sizeClass = {
      sm: "size-6",
      md: "size-7",
    } satisfies Record<typeof size, unknown>;

    const variantClass = {
      default: "text-neutral-700 hover:text-neutral-900",
      muted: "text-neutral-400 hover:text-neutral-600",
    } satisfies Record<typeof variant, unknown>;

    return (
      <ButtonBase
        ref={ref}
        {...props}
        className={clsx(
          "grid place-items-center hover:bg-neutral-500/15",
          sizeClass[size],
          variantClass[variant],
        )}
      >
        <Icon size="65%" />
      </ButtonBase>
    );
  },
);
