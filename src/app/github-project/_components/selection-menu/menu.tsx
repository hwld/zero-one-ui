import { ChevronLeftIcon } from "lucide-react";
import { ReactNode, forwardRef } from "react";
import { Divider } from "../divider";
import { DropdownCard } from "../dropdown/card";
import { DropdownItemList } from "../dropdown/item";
import { Command } from "cmdk";

type Props = {
  width?: number;
  header?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
  placeholder?: string;
};

export const SelectionMenu = forwardRef<HTMLDivElement, Props>(
  function SelectionMenu(
    { width = 250, header, onBack, children, placeholder },
    ref,
  ) {
    return (
      <Command ref={ref}>
        <DropdownCard width={width}>
          <div className="flex h-8 w-full items-center px-2">
            {onBack && (
              <button
                className="grid size-6 shrink-0 place-items-center rounded-md bg-neutral-700 transition-colors hover:bg-neutral-600"
                onClick={onBack}
              >
                <ChevronLeftIcon size={18} className="mr-[2px]" />
              </button>
            )}
            <Command.Input
              className="mx-2 block size-full bg-transparent text-sm placeholder:text-neutral-400 focus-within:outline-hidden"
              placeholder={placeholder}
              autoFocus
            />
          </div>
          <Divider />
          {header && (
            <>
              {header}
              <Divider />
            </>
          )}
          <Command.List asChild>
            <DropdownItemList>
              <Command.Empty className="grid h-20 place-items-center text-sm text-neutral-400">
                No results found.
              </Command.Empty>
              {children}
            </DropdownItemList>
          </Command.List>
        </DropdownCard>
      </Command>
    );
  },
);
