import * as RxPopover from "@radix-ui/react-popover";
import type { ReactNode } from "react";

type Props = {
  trigger: ReactNode;
  children: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const Popover: React.FC<Props> = ({
  trigger,
  children,
  isOpen,
  onOpenChange,
}) => {
  return (
    <RxPopover.Root modal open={isOpen} onOpenChange={onOpenChange}>
      <RxPopover.Trigger asChild>{trigger}</RxPopover.Trigger>
      {isOpen ? (
        <RxPopover.Portal forceMount>
          <RxPopover.Content
            align="start"
            side="bottom"
            className="z-10000 h-[350px] w-[300px] overflow-hidden rounded-lg border border-stone-300 bg-stone-50 text-sm text-stone-700 shadow-lg"
          >
            {children}
          </RxPopover.Content>
        </RxPopover.Portal>
      ) : null}
    </RxPopover.Root>
  );
};
