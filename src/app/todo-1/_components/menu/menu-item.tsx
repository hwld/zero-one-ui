import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

export const MenuItem: React.FC<{ icon: ReactNode; children: ReactNode }> = ({
  icon,
  children,
}) => {
  return (
    <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-sm p-2 text-sm text-neutral-200 outline-hidden transition-all duration-200 hover:bg-white/20 hover:outline-hidden focus:bg-white/20 focus:outline-hidden">
      {icon}
      {children}
    </DropdownMenu.Item>
  );
};
