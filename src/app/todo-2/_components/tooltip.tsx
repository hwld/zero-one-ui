import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as RadixTooltip,
} from "@radix-ui/react-tooltip";
import { ReactNode } from "react";

type Props = { children: ReactNode; label: string };
export const Tooltip: React.FC<Props> = ({ children, label }) => {
  return (
    <TooltipProvider>
      <RadixTooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipProvider>
          <TooltipContent
            side="top"
            align="center"
            sideOffset={5}
            className="rounded-sm border border-zinc-700 bg-zinc-900 p-2 text-xs shadow-sm"
          >
            {label}
          </TooltipContent>
        </TooltipProvider>
      </RadixTooltip>
    </TooltipProvider>
  );
};
