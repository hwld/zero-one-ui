import { forwardRef, useRef } from "react";
import { useMergedRef } from "@mantine/hooks";
import { useMoveEventInRow } from "./move-event-provider";
import { usePrepareCreateEventInRow } from "./prepare-create-event-provider";
import { AnimatePresence, motion } from "motion/react";
import { EventInRowCard, EventInRowCardProps } from "./card/event-in-row-card";
import { MoreEventInrowCard } from "./card/more-event-in-row";
import { DragPreviewEventInRowCard } from "./card/drag-preview";
import { EventInRow } from "./type";
import { getExceededEventCountByIndex } from "./utils";
import { useResizeEventInRow } from "./resize-event-provider";

type Props = {
  eventsRowDates: Date[];
  allEventsInRow: EventInRow[];
  eventLimit?: number;
  eventHeight: number;
  eventTop?: number;
  onClickMoreEvents?: (date: Date) => void;
};

export const EventsRow = forwardRef<HTMLDivElement, Props>(function EventRow(
  {
    eventsRowDates,
    allEventsInRow,
    eventLimit,
    eventHeight,
    eventTop,
    onClickMoreEvents,
  },
  _ref,
) {
  const { isEventMoving, moveEventPreview, moveEventActions } =
    useMoveEventInRow();
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventInRow();
  const { isEventResizing, resizeEventPreview, resizeEventActions } =
    useResizeEventInRow();

  const dragDateRangeForCreate = prepareCreateEventState.dragDateRange;
  const isDraggingForCreate = dragDateRangeForCreate !== undefined;

  const rowRef = useRef<HTMLDivElement>(null);
  const ref = useMergedRef(_ref, rowRef);

  const getDateFromX = (x: number) => {
    if (!rowRef.current) {
      throw new Error("");
    }

    const rowRect = rowRef.current.getBoundingClientRect();
    const index = Math.floor(
      (x - rowRect.x) / (rowRect.width / eventsRowDates.length),
    );

    return eventsRowDates[index];
  };

  const handleRowMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    const date = getDateFromX(event.clientX);
    prepareCreateEventActions.startDrag(date);
  };

  const handleRowMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const date = getDateFromX(event.clientX);

    if (isDraggingForCreate) {
      prepareCreateEventActions.updateDragEnd(date);
    }

    if (moveEventPreview) {
      moveEventActions.updateMoveEnd(date);
    }

    if (isEventResizing) {
      resizeEventActions.updateResizeDest(date);
    }
  };

  const handleEventDragStart = (
    e: React.DragEvent<HTMLButtonElement>,
    event: EventInRow,
  ) => {
    // dragの開始をハンドリングしたいだけなので他の挙動は抑制する
    e.preventDefault();

    const date = getDateFromX(e.clientX);
    moveEventActions.startMove(event, date);
  };

  const handleStartResizeEvent: EventInRowCardProps["onStartResize"] = (
    _,
    { event, origin },
  ) => {
    resizeEventActions.startResize({ event, origin });
  };

  const visibleEvents =
    eventLimit === undefined
      ? allEventsInRow
      : allEventsInRow.filter((e) => e.top < eventLimit);

  const exceededEventCountMap =
    eventLimit !== undefined
      ? getExceededEventCountByIndex({
          eventsRowDates: eventsRowDates,
          eventInRows: allEventsInRow,
          limit: eventLimit,
        })
      : undefined;

  return (
    <div
      ref={ref}
      className="relative size-full"
      onMouseDown={handleRowMouseDown}
      onMouseMove={handleRowMouseMove}
    >
      <AnimatePresence>
        {visibleEvents.map((event) => {
          const isDragging = isEventMoving && moveEventPreview?.id === event.id;
          const isResizing =
            isEventResizing && resizeEventPreview?.id === event.id;

          return (
            <motion.div
              key={event.id}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <EventInRowCard
                eventInRow={event}
                isDragging={isDragging}
                topMargin={eventTop}
                height={eventHeight}
                disablePointerEvents={
                  isDraggingForCreate || isEventMoving || isResizing
                }
                draggable
                onMouseDown={(e) => e.stopPropagation()}
                onDragStart={(e) => handleEventDragStart(e, event)}
                onStartResize={handleStartResizeEvent}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {/* 表示上限を超えたイベントの数 */}
      {eventLimit !== undefined &&
        exceededEventCountMap !== undefined &&
        eventsRowDates.map((date, index) => {
          const count = exceededEventCountMap.get(index);
          if (!count) {
            return null;
          }

          const handleClick = () => {
            onClickMoreEvents?.(date);
          };

          return (
            <MoreEventInrowCard
              key={index}
              topMargin={eventTop}
              displayStartCol={index}
              count={count}
              limit={eventLimit}
              eventsRowCols={eventsRowDates.length}
              disablePointerEvents={isDraggingForCreate || isEventMoving}
              height={eventHeight}
              onClick={handleClick}
            />
          );
        })}
      {isEventMoving && moveEventPreview && (
        <DragPreviewEventInRowCard
          eventsRowDates={eventsRowDates}
          draggingEvent={moveEventPreview}
          topMargin={eventTop}
          height={eventHeight}
        />
      )}
    </div>
  );
});
