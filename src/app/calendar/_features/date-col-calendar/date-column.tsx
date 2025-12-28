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
} from "../event-in-col/utils";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Event } from "../../_backend/event-store";
import { EventsColumn } from "../event-in-col/events-column";
import { useOptimisticEventsInCol } from "../event-in-col/use-optimistic-events-in-col";
import { useMinuteClock } from "../../_components/use-minute-clock";

type Props = {
  displayedDay: Date;
  events: Event[];
};

export const DateColumn = forwardRef<HTMLDivElement, Props>(function DateColumn(
  { displayedDay, events },
  ref,
) {
  const { currentDate } = useMinuteClock();
  const displayedEventsInCol = useOptimisticEventsInCol({
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
        <EventsColumn
          eventsInCol={displayedEventsInCol}
          displayedDay={displayedDay}
        >
          {hours.map((hour, i) => {
            if (i === 0) {
              return null;
            }
            return (
              <div
                key={`${hour}`}
                className="absolute h-px w-full bg-neutral-200"
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
              className="absolute z-30 h-px w-full bg-blue-500 shadow-[0_0_0_1px] shadow-blue-500"
              style={{
                top:
                  (DATE_EVENT_MIN_HEIGHT / DATE_EVENT_MIN_MINUTES) *
                  differenceInMinutes(currentDate, startOfDay(currentDate)),
              }}
            >
              <div className="absolute left-0 size-3 -translate-[50%] rounded-full bg-blue-500" />
            </div>
          ) : null}
        </EventsColumn>
      </div>
    </div>
  );
});
