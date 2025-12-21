import clsx from "clsx";
import { ReactNode } from "react";

export const BreadCrumbSeparator: React.FC = () => {
  return <span className="text-sm text-neutral-400">/</span>;
};

export const BreadCrumbItem: React.FC<{
  children: ReactNode;
  active?: boolean;
}> = ({ children, active = false }) => {
  return (
    <button
      className={clsx(
        "flex h-6 cursor-pointer items-center rounded-md px-1 text-sm text-nowrap transition-colors hover:bg-white/15",
        active && "font-bold",
      )}
    >
      {children}
    </button>
  );
};
