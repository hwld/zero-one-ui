import { ComponentPropsWithoutRef, forwardRef, useState, useRef } from "react";
import { EventInRowCardBase, EventInRowCardContent } from "./base";
import { ResizeEventInRowPreview, EventInRow } from "../type";
import { EventPopover } from "../../event/event-popover";

export type EventInRowCardProps = {
  height: number;
  disablePointerEvents: boolean;
  eventInRow: EventInRow;
  topMargin?: number;
  isDragging: boolean;
  onStartResize?: (
    e: React.MouseEvent,
    params: { event: EventInRow; origin: ResizeEventInRowPreview["origin"] },
  ) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const EventInRowCard = forwardRef<HTMLButtonElement, EventInRowCardProps>(
  function EventInRowCard(
    {
      height,
      disablePointerEvents,
      eventInRow,
      topMargin,
      onMouseDown,
      onMouseMove,
      onClick,
      isDragging,
      onStartResize,
      ...props
    },
    ref,
  ) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const isClick = useRef(false);
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseDown?.(e);
      isClick.current = true;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      onMouseMove?.(e);
      isClick.current = false;
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (isClick.current) {
        setIsPopoverOpen(true);
      }
    };

    const handleResizeStartFromEventStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize?.(e, { event: eventInRow, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize?.(e, { event: eventInRow, origin: "eventStart" });
    };

    return (
      <EventPopover event={eventInRow} isOpen={isPopoverOpen} onChangeOpen={setIsPopoverOpen}>
        <EventInRowCardBase
          ref={ref}
          height={height}
          disablePointerEvents={disablePointerEvents}
          top={eventInRow.top}
          eventsRowCols={eventInRow.eventsRowCols}
          displayStartCol={eventInRow.displayStartCol}
          eventCols={eventInRow.displayEndCol - eventInRow.displayStartCol + 1}
          topMargin={topMargin}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          {...props}
          className={isDragging ? "opacity-50" : ""}
        >
          {eventInRow.allDay && (
            <div
              className="absolute inset-y-0 left-0 w-1 cursor-ew-resize"
              onMouseDown={handleResizeStartFromEventStart}
            />
          )}
          <EventInRowCardContent eventInRow={eventInRow} isDragging={false} />
          {eventInRow.allDay && (
            <div
              className="absolute inset-y-0 right-0 w-1 cursor-ew-resize rounded-r-full"
              onMouseDown={handleResizeStartFromEventEnd}
            />
          )}
        </EventInRowCardBase>
      </EventPopover>
    );
  },
);
