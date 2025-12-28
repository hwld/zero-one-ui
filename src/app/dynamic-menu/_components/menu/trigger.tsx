import { IconDots } from "@tabler/icons-react";
import { ComponentPropsWithoutRef, forwardRef } from "react";

export const MenuTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<"button">
>(function MenuTrigger(props, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className="flex size-[50px] items-center justify-center self-end rounded-full bg-neutral-200 transition-colors hover:bg-neutral-400"
    >
      <IconDots />
    </button>
  );
});
