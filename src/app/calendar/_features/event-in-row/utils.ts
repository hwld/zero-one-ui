import {
  areIntervalsOverlapping,
  startOfDay,
  endOfDay,
  differenceInCalendarDays,
  eachDayOfInterval,
  isWithinInterval,
  addDays,
  differenceInDays,
  Interval,
  isSameDay,
} from "date-fns";
import { MoveEventInRowPreview, EventInRow } from "./type";
import { Event } from "../../_backend/event-store";
import { getOverlappingDates } from "../../utils";

export const getEventsInRow = ({
  rowDateRange,
  events,
}: {
  rowDateRange: Interval;
  events: Event[];
}): EventInRow[] => {
  const sortedEvents = events
    .filter((event) => {
      const overlapping = areIntervalsOverlapping(
        {
          start: startOfDay(rowDateRange.start),
          end: endOfDay(rowDateRange.end),
        },
        event,
        { inclusive: true },
      );

      return overlapping;
    })
    .sort((event1, event2) => {
      const startTime1 = event1.start.getTime();
      const startTime2 = event2.start.getTime();
      if (startTime1 < startTime2) {
        return -1;
      }
      if (startTime2 > startTime1) {
        return 1;
      }

      const range1 = differenceInCalendarDays(event1.end, event1.start);
      const range2 = differenceInCalendarDays(event2.end, event2.start);
      if (range1 > range2) {
        return -1;
      }
      if (range2 > range1) {
        return 1;
      }

      return 0;
    });

  const eventsInRow: EventInRow[] = [];
  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];

    // イベントよりも前に存在している重複したイベントを取得する
    const prevOverlappingEvents = eventsInRow.filter((prevEvent, index) => {
      const overlapping = areIntervalsOverlapping(
        { start: startOfDay(event.start), end: startOfDay(event.end) },
        { start: startOfDay(prevEvent.start), end: startOfDay(prevEvent.end) },
        {
          inclusive: true,
        },
      );
      return overlapping && index < i;
    });

    // 使用されているtopを取得する
    const dates = eachDayOfInterval(event);
    const invalidTops = dates.flatMap((date) => {
      return prevOverlappingEvents
        .map((prevEvent) => {
          if (
            isWithinInterval(date, {
              start: startOfDay(prevEvent.start),
              end: startOfDay(prevEvent.end),
            })
          ) {
            return prevEvent.top;
          }
          return undefined;
        })
        .filter((top): top is number => top !== undefined);
    });
    const invalidTopSet = new Set(invalidTops);

    // topを求める
    let top = 0;
    for (let i = 0; i < Number.MAX_VALUE; i++) {
      if (!invalidTopSet.has(i)) {
        top = i;
        break;
      }
    }

    const eventInRow = convertEventToEventInRow(event, {
      top,
      rowDateRange: rowDateRange,
    });
    if (eventInRow) {
      eventsInRow.push(eventInRow);
    }
  }

  return eventsInRow;
};

export const convertEventToEventInRow = (
  event: Event,
  { top, rowDateRange }: { top: number; rowDateRange: Interval },
): EventInRow | undefined => {
  const rowDates = eachDayOfInterval(rowDateRange);

  const eventDatesInRow = getOverlappingDates(
    {
      start: startOfDay(rowDates.at(0)!),
      end: endOfDay(rowDates.at(-1)!),
    },
    event,
    { inclusive: true },
  );

  if (!eventDatesInRow.length) {
    return undefined;
  }

  const eventsInRow: EventInRow = {
    ...event,
    top,
    eventsRowCols: rowDates.length,
    displayStartCol: rowDates.findIndex((d) => isSameDay(d, eventDatesInRow.at(0)!)),
    displayEndCol: rowDates.findIndex((d) => isSameDay(d, eventDatesInRow.at(-1)!)),
  };

  return eventsInRow;
};

/**
 * 指定された範囲で、表示できるイベントの上限数を超えているイベント数を数え、
 * indexをキー、超えているイベント数を値とするMapとして返す関数
 */
export const getExceededEventCountByIndex = ({
  eventsRowDates,
  eventInRows,
  limit,
}: {
  eventsRowDates: Date[];
  eventInRows: EventInRow[];
  limit: number;
}) => {
  type Index = number;
  type ExceededEventCount = number;

  return eventInRows
    .filter((event) => event.top >= limit)
    .flatMap((event) => {
      return eachDayOfInterval(event);
    })
    .reduce((map, date) => {
      // 複数の行にまたがるイベントでは、指定した行以外の日付も含まれるので、それを取り除く
      const isOutsideRow = !isWithinInterval(date, {
        start: startOfDay(eventsRowDates[0]),
        end: endOfDay(eventsRowDates[eventsRowDates.length - 1]),
      });

      if (isOutsideRow) {
        return map;
      }

      const index = eventsRowDates.findIndex((d) => isSameDay(d, date));
      const overLimitEventCount = map.get(index);

      if (overLimitEventCount !== undefined) {
        map.set(index, overLimitEventCount + 1);
      } else {
        map.set(index, 1);
      }
      return map;
    }, new Map<Index, ExceededEventCount>());
};

export const getEventFromMoveEventPreview = (draggingEvent: MoveEventInRowPreview): Event => {
  const { dragStartDate, dragEndDate, ...event } = draggingEvent;
  const diffDay = differenceInDays(dragEndDate, dragStartDate);

  const newStart = addDays(event.start, diffDay);
  const newEnd = addDays(event.end, diffDay);

  return { ...event, start: newStart, end: newEnd };
};
