import { cn } from "../../../../../lib/utils";
import type { IconType } from "@react-icons/all-files";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  icon: IconType;
  size?: "md" | "sm";
} & ComponentPropsWithoutRef<"button">;

export const ActionButton = forwardRef<HTMLButtonElement, Props>(
  function ActionButton({ icon: Icon, size = "md", className, ...props }, ref) {
    const sizeClass = {
      sm: { button: "size-6", icon: "size-4" },
      md: { button: "size-7", icon: "size-6" },
    };

    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "grid size-7 place-items-center rounded-sm text-stone-600 transition-colors hover:bg-black/5",
          sizeClass[size].button,
          className,
        )}
      >
        <Icon className={sizeClass[size].icon} />
      </button>
    );
  },
);
