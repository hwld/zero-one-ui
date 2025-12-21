import { LucideIcon, ChevronRightIcon } from "lucide-react";
import { forwardRef, ComponentPropsWithoutRef } from "react";
import { DropdownItemBase } from "../dropdown/item";

type Props = {
  icon: LucideIcon;
  title: string;
  value: string;
} & ComponentPropsWithoutRef<"button">;

export const ViewConfigMenuItem = forwardRef<HTMLButtonElement, Props>(
  function ViewConfigMenuItem({ icon: Icon, title, value, ...props }, ref) {
    return (
      <DropdownItemBase ref={ref} {...props}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-neutral-400">
            <Icon size={16} />
            <div className="text-sm">{title}:</div>
          </div>
          <div className="flex min-w-0 items-center gap-1">
            <div className="truncate text-sm text-nowrap">{value}</div>
            <ChevronRightIcon size={16} className="text-neutral-400" />
          </div>
        </div>
      </DropdownItemBase>
    );
  },
);
