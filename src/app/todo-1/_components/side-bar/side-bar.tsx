"use client";
import {
  CalendarIcon,
  CircleIcon,
  HomeIcon,
  LayoutListIcon,
} from "lucide-react";
import { SideBarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

export const SideBar: React.FC = () => {
  const path = usePathname();

  return (
    <div className="hidden w-[300px] shrink-0 flex-col gap-5 rounded-e-md bg-neutral-800 p-5 lg:flex">
      <div className="flex items-center gap-2 px-3 font-bold text-neutral-100">
        <CircleIcon strokeWidth={3} />
        TODODO
      </div>
      <div className="h-px w-full bg-neutral-600" />
      <div className="flex flex-col items-start gap-2">
        <SideBarItem
          href="/todo-1"
          active={path === "/todo-1"}
          icon={<HomeIcon />}
        >
          今日のタスク
        </SideBarItem>
        <SideBarItem href="/todo-1" icon={<LayoutListIcon />}>
          過去のタスク
        </SideBarItem>
        <SideBarItem href="/todo-1" icon={<CalendarIcon />}>
          予定
        </SideBarItem>
      </div>
    </div>
  );
};
