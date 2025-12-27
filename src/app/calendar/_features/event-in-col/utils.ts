import {
  areIntervalsOverlapping,
  startOfDay,
  endOfDay,
  differenceInMinutes,
  format,
  getHours,
  Interval,
  addMinutes,
  max,
  min,
} from "date-fns";
import { EventInCol } from "./type";
import { Event } from "../../_backend/event-store";

export const DATE_EVENT_MIN_HEIGHT = 17;
export const DATE_EVENT_MIN_MINUTES = 15;

export const getEventsInCol = ({
  date,
  events,
}: {
  date: Date;
  events: Event[];
}): EventInCol[] => {
  const sortedEvents = events
    .filter((event) =>
      areIntervalsOverlapping(
        { start: startOfDay(date), end: endOfDay(date) },
        event,
      ),
    )
    .sort((event1, event2) => {
      if (event1.start.getTime() > event2.start.getTime()) {
        return 1;
      }
      if (event1.start.getTime() < event2.start.getTime()) {
        return -1;
      }
      return (
        differenceInMinutes(event2.end, event2.start) -
        differenceInMinutes(event1.end, event1.start)
      );
    });

  const eventsInCol: (Omit<EventInCol, "totalOverlappings"> & {
    totalOverlappingsList: number[];
  })[] = [];

  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    const prevEvents = eventsInCol.filter((_, index) => index < i);

    const overlappingEvents = [];
    let prevOverlappings = 0;
    for (const prevEvent of prevEvents) {
      if (
        areIntervalsOverlapping(event, prevEvent) &&
        Math.abs(differenceInMinutes(event.start, prevEvent.start)) < 30
      ) {
        overlappingEvents.push(prevEvent);
        prevOverlappings++;
      }
    }

    overlappingEvents.forEach((e) =>
      e.totalOverlappingsList.push(prevOverlappings),
    );

    eventsInCol.push({
      ...event,
      prevOverlappings,
      totalOverlappingsList: [prevOverlappings],
    });
  }

  return eventsInCol.map((event) => ({
    ...event,
    totalOverlappings: Math.max(...event.totalOverlappingsList),
  }));
};

export const calcEventInColCardStyle = ({
  event,
  displayedDate,
}: {
  displayedDate: Date;
  event: EventInCol;
}) => {
  const top = getTopFromDate(event, displayedDate);

  const left =
    event.prevOverlappings === 0
      ? 0
      : (93 / (event.totalOverlappings + 1)) * event.prevOverlappings;

  const lastEventWidth =
    event.totalOverlappings === 0 ? 93 : 93 / (event.totalOverlappings + 1);

  const width =
    event.totalOverlappings === 0
      ? 93
      : event.totalOverlappings === event.prevOverlappings
        ? lastEventWidth
        : lastEventWidth * 1.7;

  const height = getHeightFromInterval(event, displayedDate);

  return { top, left: `${left}%`, width: `${width}%`, height };
};

const isSameAmPm = (date1: Date, date2: Date) => {
  const h1 = getHours(date1);
  const h2 = getHours(date2);
  const isAm1 = h1 >= 0 && h1 < 12;
  const isAm2 = h2 >= 0 && h2 < 12;
  return isAm1 === isAm2;
};

export const formatEventDateSpan = (event: EventInCol) => {
  if (isSameAmPm(event.start, event.end)) {
    return `${format(event.start, "h:mm")}~${format(event.end, "h:mm a")}`;
  }
  return `${format(event.start, "h:mm a")}~${format(event.end, "h:mm a")}`;
};

/**
 * y軸の0を指定した日の00時00分としたとき、y軸から日時を取得する
 */
export const getDateFromY = (
  yearMonthDate: Date,
  y: number,
  roundingOption: "floor" | "round" = "round",
): Date => {
  const roundingMethod = Math[roundingOption];

  const date = addMinutes(
    startOfDay(yearMonthDate),
    roundingMethod(y / DATE_EVENT_MIN_HEIGHT) * DATE_EVENT_MIN_MINUTES,
  );
  return date;
};

/**
 *  指定した期間が、指定された日付のカラムに表示されるときのtopを取得する
 */
export const getTopFromDate = (
  interval: { start: Date; end: Date },
  day: Date,
): number => {
  if (startOfDay(day).getTime() > interval.start.getTime()) {
    return 0;
  }

  const top =
    Math.floor(
      (interval.start.getHours() * 60 + interval.start.getMinutes()) /
        DATE_EVENT_MIN_MINUTES,
    ) * DATE_EVENT_MIN_HEIGHT;

  return top;
};

/**
 * 指定した期間が、指定された日付のカラムに表示されるheightを取得する
 */
export const getHeightFromInterval = (
  interval: Interval,
  day: Date,
): number => {
  const startDay = startOfDay(day);
  const endDay = endOfDay(day);

  // intervalの範囲外のときは0
  if (!areIntervalsOverlapping(interval, { start: startDay, end: endDay })) {
    return 0;
  }

  // 指定された日付の範囲にあるintervalを取得する
  const start = max([startDay, interval.start]);
  const end = min([endDay, interval.end]);

  const height =
    Math.ceil(differenceInMinutes(end, start) / DATE_EVENT_MIN_MINUTES) *
    DATE_EVENT_MIN_HEIGHT;

  return height;
};
