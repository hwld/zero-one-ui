import clsx from "clsx";
import Link from "next/link";
import { ReactNode } from "react";

export const SideBarItem: React.FC<{
  children: ReactNode;
  icon: ReactNode;
  href: string;
  active?: boolean;
}> = ({ children, href, icon, active }) => {
  return (
    <Link
      href={href}
      className={clsx(
        "flex w-full items-center justify-start gap-2 rounded-sm p-2 text-sm transition-all duration-200",
        { "pointer-events-none bg-neutral-100 text-neutral-700": active },
        { "text-neutral-100 hover:bg-white/20": !active },
      )}
    >
      {icon}
      {children}
    </Link>
  );
};
