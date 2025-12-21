import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CalendarIcon,
  HomeIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { MenuItem } from "./menu-item";

export const Menu: React.FC = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-100 transition-colors duration-200 hover:bg-neutral-700 focus-visible:ring-3 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-100 focus-visible:outline-hidden">
          <MoreHorizontalIcon size="60%" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[state=closed]:animate-popoverExit data-[state=open]:animate-popoverEnter min-w-[300px] origin-bottom-right rounded-lg bg-neutral-900 p-3 transition-all duration-200"
          sideOffset={12}
          side="top"
          align="end"
        >
          <MenuItem icon={<HomeIcon />}>今日のタスク</MenuItem>
          <MenuItem icon={<LayoutListIcon />}>過去のタスク</MenuItem>
          <MenuItem icon={<CalendarIcon />}>予定</MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
