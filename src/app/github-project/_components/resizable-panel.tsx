import { Resizable, ResizableProps } from "re-resizable";
import { LegacyRef } from "react";
import { cn } from "../../../lib/utils";

type Props = Omit<
  ResizableProps,
  "handleClasses" | "handleComponent" | "enable" | "className"
> & { direction: "left" | "right"; resizableRef?: LegacyRef<Resizable> };

export const ResizablePanel: React.FC<Props> = ({
  direction,
  resizableRef,
  ...props
}) => {
  const directionClass = { left: "border-l", right: "border-r" };

  const handleClass = "z-100 flex justify-center group";
  const handle = (
    <div className="h-full w-[2px] transition-colors group-hover:bg-neutral-500 group-active:bg-blue-500"></div>
  );

  return (
    <Resizable
      ref={resizableRef}
      enable={{ right: direction === "right", left: direction === "left" }}
      handleClasses={{ right: handleClass, left: handleClass }}
      handleComponent={{ right: handle, left: handle }}
      className={cn("border-neutral-600", directionClass[direction])}
      {...props}
    />
  );
};
