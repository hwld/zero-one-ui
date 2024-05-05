// TODO:
import {
  addMinutes,
  startOfDay,
  Interval,
  differenceInMinutes,
  isSameDay,
  areIntervalsOverlapping,
  format,
  getHours,
  endOfDay,
  max,
  min,
} from "date-fns";
import { DateEvent, Event } from "../type";

export const EVENT_MIN_HEIGHT = 17;
export const EVENT_MIN_MINUTES = 15;

/**
 * 年月日とweekly calendar上のy軸から日付を取得する
 */
export const getDateFromY = (
  yearMonthDate: Date,
  y: number,
  roundingOption: "floor" | "round" = "round",
): Date => {
  const roundingMethod = Math[roundingOption];

  const date = addMinutes(
    startOfDay(yearMonthDate),
    roundingMethod(y / EVENT_MIN_HEIGHT) * EVENT_MIN_MINUTES,
  );
  return date;
};

/**
 *  日付に対応するweekly calendar上のtopを取得する
 */
export const getTopFromDate = (date: Date): number => {
  const top =
    Math.floor((date.getHours() * 60 + date.getMinutes()) / EVENT_MIN_MINUTES) *
    EVENT_MIN_HEIGHT;

  return top;
};

/**
 * 指定した期間がweekly calendar上で指定された日付に表示される高さを取得する
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
    Math.ceil(differenceInMinutes(end, start) / EVENT_MIN_MINUTES) *
    EVENT_MIN_HEIGHT;

  return height;
};

export const getDateEvents = ({
  date,
  events,
}: {
  date: Date;
  events: Event[];
}): DateEvent[] => {
  const sortedEvents = events
    .filter((event) => isSameDay(date, event.start))
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

  const dateEvents: (Omit<DateEvent, "totalOverlappings"> & {
    totalOverlappingsList: number[];
  })[] = [];

  for (let i = 0; i < sortedEvents.length; i++) {
    const event = sortedEvents[i];
    const prevEvents = dateEvents.filter((_, index) => index < i);

    const overlappingEvents = [];
    let prevOverlappings = 0;
    for (let prevEvent of prevEvents) {
      if (
        areIntervalsOverlapping(event, prevEvent) &&
        isShortInterval(event.start, prevEvent.start)
      ) {
        overlappingEvents.push(prevEvent);
        prevOverlappings++;
      }
    }

    overlappingEvents.forEach((e) =>
      e.totalOverlappingsList.push(prevOverlappings),
    );

    dateEvents.push({
      ...event,
      prevOverlappings,
      totalOverlappingsList: [prevOverlappings],
    });
  }

  return dateEvents.map((event) => ({
    ...event,
    totalOverlappings: Math.max(...event.totalOverlappingsList),
  }));
};

const isShortInterval = (left: Date, right: Date) => {
  return Math.abs(differenceInMinutes(left, right)) < 30;
};

export const isSameAmPm = (date1: Date, date2: Date) => {
  const h1 = getHours(date1);
  const h2 = getHours(date2);
  const isAm1 = h1 >= 0 && h1 < 12;
  const isAm2 = h2 >= 0 && h2 < 12;
  return isAm1 === isAm2;
};

export const formatEventDateSpan = (event: DateEvent) => {
  if (isSameAmPm(event.start, event.end)) {
    return `${format(event.start, "h:mm")}~${format(event.end, "h:mm a")}`;
  }
  return `${format(event.start, "h:mm a")}~${format(event.end, "h:mm a")}`;
};
