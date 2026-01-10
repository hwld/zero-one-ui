import { PropsWithChildren, useEffect, useRef } from "react";
import { DATE_EVENT_MIN_HEIGHT } from "./utils";
import { EventInCol } from "./type";
import { startOfDay, endOfDay, areIntervalsOverlapping } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { EventInColCardProps, EventInColCard } from "./card/event-in-col-card";
import { DragPreviewEventInColCard } from "./card/drag-preview";
import { EventInColPreview } from "./event-in-col-preview";
import { useMoveEventInCol } from "./move-event-provider";
import { usePrepareCreateEventInCol } from "./prepare-create-event-provider";
import { useResizeEventInCol } from "./resize-event-provider";
import { areDragDateRangeOverlapping } from "../../utils";

type Props = {
  eventsInCol: EventInCol[];
  displayedDay: Date;
} & PropsWithChildren;

export const EventsColumn: React.FC<Props> = ({
  children,
  displayedDay,
  eventsInCol,
}) => {
  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventInCol();
  const { isEventResizing, resizeEventActions, resizeEventPreview } =
    useResizeEventInCol();
  const { isEventMoving, moveEventActions, moveEventPreview } =
    useMoveEventInCol();

  const dragDateRangeForCreate = prepareCreateEventState.dragDateRange;
  const isDraggingForCreate = dragDateRangeForCreate !== undefined;

  const columnRef = useRef<HTMLDivElement>(null);

  const getColumnBasedY = (y: number) => {
    if (!columnRef.current) {
      throw new Error("columnRefがセットされていません");
    }

    const columnY = columnRef.current.getBoundingClientRect().y;
    return y - columnY;
  };

  const handleColumnMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.button !== 0) {
      return;
    }

    const columnBasedY = getColumnBasedY(e.clientY);
    prepareCreateEventActions.startDrag(displayedDay, columnBasedY);
  };

  const updateDragDateRangeForCreate = (mouseY: number) => {
    if (!isDraggingForCreate) {
      return;
    }

    const columnBasedY = getColumnBasedY(mouseY);
    prepareCreateEventActions.updateDragEnd(displayedDay, columnBasedY);
  };

  const updateMoveDest = (mouseY: number) => {
    if (!isEventMoving) {
      return;
    }

    const columnBasedY = getColumnBasedY(mouseY);
    moveEventActions.updateMoveDest(displayedDay, columnBasedY);
  };

  const updateResizeDest = (mouseY: number) => {
    if (!isEventResizing) {
      return;
    }

    const columnBasedY = getColumnBasedY(mouseY);
    if (columnBasedY < 0) {
      return;
    }

    resizeEventActions.updateResizeDest(displayedDay, columnBasedY);
  };

  const handleColumnMouseMove = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isDraggingForCreate) {
      updateDragDateRangeForCreate(e.clientY);
    }

    if (isEventMoving) {
      updateMoveDest(e.clientY);
    }

    if (isEventResizing) {
      updateResizeDest(e.clientY);
    }
  };

  const handleEventDragStart = (
    event: React.DragEvent,
    eventInCol: EventInCol,
  ) => {
    event.preventDefault();

    const columnBasedY = getColumnBasedY(event.clientY);
    moveEventActions.startMove(eventInCol, {
      date: displayedDay,
      y: columnBasedY,
    });
  };

  const handleStartResizeEvent: EventInColCardProps["onStartResize"] = (
    e,
    { event, origin },
  ) => {
    const columnBasedY = getColumnBasedY(e.clientY);
    resizeEventActions.startResize({ event, origin, y: columnBasedY });
  };

  const currentTimeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!currentTimeRef.current) {
      return;
    }

    currentTimeRef.current.scrollIntoView({ block: "center" });
  }, []);

  const isEventPreviewVisible =
    dragDateRangeForCreate &&
    areDragDateRangeOverlapping(displayedDay, dragDateRangeForCreate);

  return (
    <div
      ref={columnRef}
      className="relative"
      style={{ height: DATE_EVENT_MIN_HEIGHT * 4 * 24 }}
      draggable={false}
      onMouseDown={handleColumnMouseDown}
      onMouseMove={handleColumnMouseMove}
    >
      {children}
      {isEventPreviewVisible && (
        <EventInColPreview
          date={displayedDay}
          eventCreationDragData={dragDateRangeForCreate}
        />
      )}
      <AnimatePresence>
        {eventsInCol.map((event) => {
          const isDragPreview = moveEventPreview?.id === event.id;
          const isResizePreview = resizeEventPreview?.id === event.id;

          const isDragging = isEventMoving && isDragPreview;
          const isResizing = isEventResizing && isResizePreview;

          return (
            <motion.div
              key={event.id}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <EventInColCard
                displayedDate={displayedDay}
                event={event}
                isDragging={isDragging}
                isOtherEventDragging={isEventMoving ? !isDragging : false}
                onDragStart={handleEventDragStart}
                isResizing={isResizing}
                isOtherEventResizing={isEventResizing ? !isResizing : false}
                onStartResize={handleStartResizeEvent}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {isEventMoving &&
        moveEventPreview &&
        areIntervalsOverlapping(moveEventPreview, {
          start: startOfDay(displayedDay),
          end: endOfDay(displayedDay),
        }) && (
          <DragPreviewEventInColCard
            date={displayedDay}
            event={moveEventPreview}
          />
        )}
    </div>
  );
};
