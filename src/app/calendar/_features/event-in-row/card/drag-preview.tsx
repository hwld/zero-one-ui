import { forwardRef, useMemo } from "react";
import { convertEventToEventInRow } from "../utils";
import { getEventFromMoveEventPreview } from "../utils";
import { MoveEventInRowPreview } from "../type";
import { EventInRow } from "../type";
import { EventInRowCardBase, EventInRowCardContent } from "./base";

type Props = {
  eventsRowDates: Date[];
  draggingEvent: MoveEventInRowPreview;
  topMargin?: number;
  height: number;
};

export const DragPreviewEventInRowCard = forwardRef<HTMLButtonElement, Props>(
  function DragPreviewEventInRowCard(
    { eventsRowDates, draggingEvent, topMargin = 0, height },
    ref,
  ) {
    const eventInRow: EventInRow | undefined = useMemo(() => {
      const newEvent = getEventFromMoveEventPreview(draggingEvent);
      return convertEventToEventInRow(newEvent, {
        top: 0,
        rowDateRange: {
          start: eventsRowDates.at(0)!,
          end: eventsRowDates.at(-1)!,
        },
      });
    }, [draggingEvent, eventsRowDates]);

    if (!eventInRow) {
      return null;
    }

    return (
      <div className="absolute top-0 left-0 w-full">
        <EventInRowCardBase
          ref={ref}
          height={height}
          topMargin={topMargin}
          disablePointerEvents={true}
          eventsRowCols={eventInRow.eventsRowCols}
          displayStartCol={eventInRow.displayStartCol}
          eventCols={eventInRow.displayEndCol - eventInRow.displayStartCol + 1}
          top={eventInRow.top}
        >
          <EventInRowCardContent eventInRow={eventInRow} isDragging={true} />
        </EventInRowCardBase>
      </div>
    );
  },
);
