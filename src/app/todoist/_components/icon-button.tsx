import { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  icon: IconType;
  size?: "md";
  label?: string;
} & ComponentPropsWithoutRef<"button">;

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  function IconButton({ icon: Icon, label, size = "md", ...props }, ref) {
    const sizeClass = {
      md: { button: "h-8", icon: "size-5" },
    };

    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          "grid place-items-center rounded-sm ring-stone-500 transition-all hover:bg-black/5 focus-visible:ring-2 focus-visible:outline-hidden",
          sizeClass[size].button,
          label ? "grid-cols-[auto_1fr] gap-1 px-2" : "w-8",
        )}
      >
        <Icon className={clsx(sizeClass[size].icon)} />
        {label && <p className="font-semibold text-stone-500">{label}</p>}
      </button>
    );
  },
);
