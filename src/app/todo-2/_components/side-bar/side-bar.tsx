import { IconCalendar, IconHome, IconListDetails } from "@tabler/icons-react";
import { SidebarItem } from "./item";
import { CircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export const Sidebar: React.FC = () => {
  const path = usePathname();

  return (
    <div className="flex w-[200px] flex-col gap-4">
      <div className="flex items-center gap-1 text-sm font-bold whitespace-nowrap">
        <CircleIcon size={18} />
        <p>todo</p>
      </div>
      <div className="flex flex-col gap-1">
        <SidebarItem
          icon={IconHome}
          label="今日のタスク"
          path="/todo-2"
          active={path === "/todo-2"}
        />
        <SidebarItem
          icon={IconListDetails}
          label="過去のタスク"
          path="/todo-2"
        />
        <SidebarItem icon={IconCalendar} label="予定" path="/todo-2" />
      </div>
    </div>
  );
};
