import { LucideIcon } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
};

export const ChatCardMenuItem: React.FC<Props> = ({
  icon: Icon,
  label,
  onClick,
}) => {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger
          className="grid place-items-center p-2 transition-colors hover:bg-white/5"
          onClick={onClick}
        >
          <Icon size={20} />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={3}
            className="rounded-sm bg-neutral-900 px-2 py-1 text-xs text-neutral-200"
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
