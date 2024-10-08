import { useMoveEventInRow } from "./move-event-provider";
import { getEventFromMoveEventPreview, getEventsInRow } from "./utils";
import { useResizeEventInRow } from "./resize-event-provider";
import { Interval } from "date-fns";
import { Event } from "../../_backend/event-store";

/**
 *  表示する日付の範囲を指定して、eventのMoveやResizeの状態から更新後のEventInRowを返す
 */
export const useOptimisticEventsInRow = ({
  displayDateRange,
  events,
}: {
  displayDateRange: Interval;
  events: Event[];
}) => {
  const { isEventMoving, moveEventPreview } = useMoveEventInRow();
  const { resizeEventPreview } = useResizeEventInRow();

  return getEventsInRow({
    rowDateRange: displayDateRange,
    events: events.map((event): Event => {
      if (!isEventMoving && moveEventPreview?.id === event.id) {
        return getEventFromMoveEventPreview(moveEventPreview);
      }

      if (resizeEventPreview?.id === event.id) {
        return resizeEventPreview;
      }

      return event;
    }),
  });
};
