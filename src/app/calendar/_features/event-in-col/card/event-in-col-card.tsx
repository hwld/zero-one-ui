import { SyntheticEvent, forwardRef, useMemo, useRef, useState } from "react";
import { ResizeEventInColPreview } from "../type";
import { EventInCol } from "../type";
import { calcEventInColCardStyle } from "../utils";
import clsx from "clsx";
import { EventInColCardBase, EventInColCardContent } from "./base";
import { EventPopover } from "../../event/event-popover";
import { useScrollableElement } from "../scrollable-provider";

export type EventInColCardProps = {
  // 一つのイベントが複数の日にまたがる可能性があるので、どの日のイベントを表示するのかを指定する
  displayedDate: Date;
  event: EventInCol;

  isDragging: boolean;
  isOtherEventDragging: boolean;
  onDragStart: (e: React.DragEvent, event: EventInCol) => void;

  isResizing: boolean;
  isOtherEventResizing: boolean;
  onStartResize: (
    e: React.MouseEvent,
    params: { event: EventInCol; origin: ResizeEventInColPreview["origin"] },
  ) => void;
};

export const EventInColCard = forwardRef<HTMLButtonElement, EventInColCardProps>(
  function EventInColCard(
    {
      event,
      displayedDate,
      isOtherEventDragging,
      onDragStart,
      isDragging,
      isOtherEventResizing,
      isResizing,
      onStartResize,
    },
    ref,
  ) {
    const { scrollableElement } = useScrollableElement();
    const isInteractive = !isOtherEventDragging && !isOtherEventResizing;

    const style = useMemo(() => {
      const base = calcEventInColCardStyle({ event, displayedDate });

      if (isResizing) {
        return { ...base, width: "100%", left: 0 };
      }

      return calcEventInColCardStyle({ event, displayedDate });
    }, [displayedDate, event, isResizing]);

    const handleResizeStartFromEventStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize(e, { event, origin: "eventEnd" });
    };

    const handleResizeStartFromEventEnd = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      onStartResize(e, { event, origin: "eventStart" });
    };

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const isClick = useRef(false);
    const handleMouseDown = (e: SyntheticEvent) => {
      isClick.current = true;
      e.stopPropagation();
    };

    const handleMouseMove = () => {
      isClick.current = false;
    };

    const handleClick = () => {
      if (!isClick.current) {
        return;
      }
      setIsPopoverOpen(true);
    };

    const handleDragStart = (e: React.DragEvent) => {
      onDragStart(e, event);
    };

    return (
      <EventPopover
        event={event}
        isOpen={isPopoverOpen}
        onChangeOpen={setIsPopoverOpen}
        placement="right-start"
        fallbackPlacements={["left-start", "top"]}
        floatingBoundary={scrollableElement}
      >
        <EventInColCardBase
          ref={ref}
          draggable
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onDragStart={handleDragStart}
          style={style}
          className={clsx(
            isDragging && "opacity-50",
            isInteractive && "hover:z-20 hover:bg-neutral-900",
            isResizing && "z-30",
          )}
        >
          <div
            className="absolute inset-x-0 top-0 h-1 cursor-ns-resize"
            onMouseDown={handleResizeStartFromEventStart}
          />
          <EventInColCardContent event={event} />
          <div
            className="absolute inset-x-0 bottom-0 h-1 cursor-ns-resize"
            onMouseDown={handleResizeStartFromEventEnd}
          />
        </EventInColCardBase>
      </EventPopover>
    );
  },
);
