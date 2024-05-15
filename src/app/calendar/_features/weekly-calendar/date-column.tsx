import {
  differenceInMinutes,
  eachHourOfInterval,
  endOfDay,
  isSameDay,
  startOfDay,
} from "date-fns";
import {
  DATE_EVENT_MIN_HEIGHT,
  DATE_EVENT_MIN_MINUTES,
} from "../event/date-event/utils";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Event } from "../../_mocks/event-store";
import { DateEventsColumn } from "../event/date-event/date-events-column";
import { useOptimisticDateEvents } from "../event/date-event/use-optimistic-date-events";

type Props = {
  currentDate: Date;
  displayedDay: Date;
  events: Event[];
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  { currentDate, displayedDay, events },
  ref,
) {
  const displayedDateEvents = useOptimisticDateEvents({
    day: displayedDay,
    events,
  });

  const hours = useMemo(
    () =>
      eachHourOfInterval({
        start: startOfDay(displayedDay),
        end: endOfDay(displayedDay),
      }),
    [displayedDay],
  );

  const currentTimeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!currentTimeRef.current) {
      return;
    }

    currentTimeRef.current.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      <div className="border-r border-neutral-200">
        <DateEventsColumn
          dateEvents={displayedDateEvents}
          displayedDay={displayedDay}
        >
          {hours.map((hour, i) => {
            if (i === 0) {
              return null;
            }
            return (
              <div
                key={`${hour}`}
                className="absolute h-[1px] w-full bg-neutral-200"
                style={{
                  top:
                    DATE_EVENT_MIN_HEIGHT * (60 / DATE_EVENT_MIN_MINUTES) * i,
                }}
              />
            );
          })}
          {isSameDay(currentDate, displayedDay) ? (
            <div
              ref={currentTimeRef}
              className="absolute z-30 h-[1px] w-full border-y-[1px] border-blue-500 bg-blue-500"
              style={{
                top:
                  (DATE_EVENT_MIN_HEIGHT / DATE_EVENT_MIN_MINUTES) *
                  differenceInMinutes(currentDate, startOfDay(currentDate)),
              }}
            >
              <div className="absolute left-0 size-3 -translate-x-[50%] -translate-y-[50%] rounded-full bg-blue-500" />
            </div>
          ) : null}
        </DateEventsColumn>
      </div>
    </div>
  );
});