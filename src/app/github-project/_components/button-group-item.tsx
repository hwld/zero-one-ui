import clsx from "clsx";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

type Props = {
  icon: LucideIcon;
  position?: "left" | "center" | "right";
};

export const ButtonGroupItem = forwardRef<HTMLButtonElement, Props>(function ButtonGroupItem(
  { icon: Icon, position = "center", ...props },
  ref,
) {
  const positionClass = {
    left: "border-x rounded-l-md",
    center: "",
    right: "border-x rounded-r-md",
  };

  return (
    <button
      {...props}
      ref={ref}
      className={clsx(
        "flex h-8 w-9 items-center justify-center border-y border-neutral-600 bg-neutral-800 text-neutral-300 transition-colors hover:bg-neutral-600",
        positionClass[position],
      )}
    >
      <Icon size={20} />
    </button>
  );
});
