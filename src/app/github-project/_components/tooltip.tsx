import { ReactNode } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";

type Props = {
  children: ReactNode;
  label: string;
  disabled?: boolean;
};

export const Tooltip: React.FC<Props> = ({ children, label, disabled }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <div>{children}</div>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          {!disabled && (
            <RadixTooltip.Content
              className="flex h-6 items-center rounded-sm bg-neutral-700 px-2 text-xs text-neutral-300 shadow-sm"
              sideOffset={8}
            >
              {label}
            </RadixTooltip.Content>
          )}
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
