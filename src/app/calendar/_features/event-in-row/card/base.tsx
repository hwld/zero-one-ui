import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { format } from "date-fns";
import { EventInRow } from "../type";

type Props = {
  disablePointerEvents: boolean;
  height: number;
  // このイベントカードを表示するEventsRowの日数
  eventsRowCols: number;
  eventCols?: number;
  displayStartCol: number;
  top: number;
  topMargin?: number;
} & ComponentPropsWithoutRef<"button">;

export const EventInRowCardBase = forwardRef<HTMLButtonElement, Props>(
  function EventInRowCardBase(
    {
      disablePointerEvents,
      height,
      eventsRowCols,
      eventCols = 1,
      top,
      displayStartCol,
      children,
      topMargin = 0,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        {...props}
        className={clsx(
          "group absolute pb-px pl-[2px] text-sm text-neutral-100 select-none focus-visible:outline-hidden",
          disablePointerEvents ? "pointer-events-none" : "pointer-events-auto",
          className,
        )}
        style={{
          height: `${height}px`,
          width: `calc(100% / ${eventsRowCols}  * ${eventCols} - 10px)`,
          top: `calc(${topMargin}px + ${height}px * ${top})`,
          left: `calc(100% / ${eventsRowCols} * ${displayStartCol})`,
        }}
      >
        {children}
      </button>
    );
  },
);

type ContentProps = { eventInRow: EventInRow; isDragging: boolean };
export const EventInRowCardContent: React.FC<ContentProps> = ({
  eventInRow,
  isDragging,
}) => {
  return (
    <div
      className={clsx(
        "flex h-full flex-nowrap items-center rounded-sm bg-neutral-700 px-1 text-xs ring-blue-500 transition-colors group-focus-visible:ring-3 hover:bg-neutral-800",
        isDragging && "bg-neutral-800 ring-3",
      )}
    >
      {!eventInRow.allDay ? (
        <span className="mr-1 text-nowrap text-neutral-300">
          {format(eventInRow.start, "aa hh:mm")}
        </span>
      ) : null}
      <span className="truncate">{eventInRow.title}</span>
    </div>
  );
};
