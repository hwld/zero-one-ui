import clsx from "clsx";
import { ReactNode } from "react";

export const Card: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "size-full grow gap-4 rounded-lg bg-zinc-800 p-6 shadow-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
};
