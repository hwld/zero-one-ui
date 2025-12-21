import { ComponentPropsWithoutRef, forwardRef } from "react";
import { EventInCol } from "../type";
import { DATE_EVENT_MIN_HEIGHT } from "../utils";
import { formatEventDateSpan } from "../utils";
import { cn } from "../../../../../lib/utils";

type Props = {
  style: {
    top: number | string;
    left?: number | string;
    width: number | string;
    height: number;
  };
} & Omit<ComponentPropsWithoutRef<"button">, "style">;

export const EventInColCardBase = forwardRef<HTMLButtonElement, Props>(
  function EventInColCardBase({ className, children, style, ...props }, ref) {
    const thin = style.height < DATE_EVENT_MIN_HEIGHT * 3;

    return (
      <button
        ref={ref}
        className="group absolute z-10 pb-px select-none focus-visible:outline-hidden"
        style={style}
        {...props}
      >
        <div
          className={cn(
            "flex h-full w-full flex-col overflow-hidden rounded-sm border border-neutral-500 bg-neutral-700 pl-[10px] text-start text-neutral-100 ring-blue-500 outline-3 transition-colors group-focus-visible:ring-3",
            thin ? "pt-0" : "pt-1",
            className,
          )}
        >
          {children}
          <div
            className={cn(
              "absolute top-0 bottom-0 left-0 w-1 rounded-full bg-neutral-500",
              thin ? "mx-[2px] mt-[3px] mb-[4px]" : "mx-[3px] mt-1 mb-[5px]",
            )}
          />
        </div>
      </button>
    );
  },
);

export const EventInColCardContent: React.FC<{ event: EventInCol }> = ({
  event,
}) => {
  return (
    <>
      <div className="text-xs">{event.title}</div>
      <div className="text-neutral-300" style={{ fontSize: "10px" }}>
        {formatEventDateSpan(event)}
      </div>
    </>
  );
};
