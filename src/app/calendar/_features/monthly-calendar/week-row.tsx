import { MONTHLY_EVENT_ROW_SIZE } from "../../consts";
import { EventsRow } from "../event-in-row/events-row";
import { CalendarDate, MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { useOptimisticEventsInRow } from "../event-in-row/use-optimistic-events-in-row";
import { Event } from "../../_backend/event-store";
import { RefObject } from "react";
import { useAppState } from "../../_components/use-app-state";

type Props = {
  week: Date[];
  events: Event[];
  rowRef?: RefObject<HTMLDivElement | null>;
  calendarYearMonth: Date;
  eventLimit: number;
};

export const WeekRow: React.FC<Props> = ({
  week,
  events,
  rowRef,
  calendarYearMonth,
  eventLimit,
}) => {
  const weekEvents = useOptimisticEventsInRow({
    displayDateRange: { start: week.at(0)!, end: week.at(-1)! },
    events,
  });
  const { selectDate, changeCalendarType } = useAppState();

  const handleClickMoreWeekEvents = (date: Date) => {
    changeCalendarType({ kind: "range", days: 7 });
    selectDate(date);
  };

  return (
    <div className="relative grid min-h-[80px] min-w-[560px] grid-cols-7 select-none">
      {week.map((date) => {
        return (
          <CalendarDate
            calendarYearMonth={calendarYearMonth}
            key={date.getTime()}
            date={date}
          />
        );
      })}
      <div className="absolute inset-0">
        <EventsRow
          ref={rowRef}
          eventsRowDates={week}
          allEventsInRow={weekEvents}
          eventLimit={eventLimit}
          eventHeight={MONTHLY_EVENT_ROW_SIZE}
          eventTop={MONTHLY_DATE_HEADER_HEIGHT}
          onClickMoreEvents={handleClickMoreWeekEvents}
        />
      </div>
    </div>
  );
};
