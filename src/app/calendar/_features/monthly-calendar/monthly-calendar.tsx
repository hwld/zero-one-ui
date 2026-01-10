import { useEffect, useMemo, useRef, useState } from "react";
import { MONTHLY_EVENT_ROW_SIZE, WEEK_DAY_LABELS } from "../../consts";
import { getCalendarDates } from "../../utils";
import { Event } from "../../_backend/event-store";
import { MONTHLY_DATE_HEADER_HEIGHT } from "./calendar-date";
import { MoveEventInRowProvider } from "../event-in-row/move-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import {
  PrepareCreateEventInRowProvider,
  usePrepareCreateEventInRow,
} from "../event-in-row/prepare-create-event-provider";
import { WeekRow } from "./week-row";
import { ResizeEventInRowProvider } from "../event-in-row/resize-event-provider";

type Props = {
  yearMonth: Date;
  events: Event[];
};

const MonthlyCalendarImpl: React.FC<Props> = ({ yearMonth, events }) => {
  const year = useMemo(() => {
    return yearMonth.getFullYear();
  }, [yearMonth]);

  const month = useMemo(() => {
    return yearMonth.getMonth() + 1;
  }, [yearMonth]);

  const calendar = useMemo(() => {
    return getCalendarDates({ year, month });
  }, [month, year]);

  const firstEventsRowRef = useRef<HTMLDivElement>(null);
  const [eventLimit, setEventLimit] = useState(0);

  useEffect(() => {
    const eventSpace = firstEventsRowRef.current;
    const measure = () => {
      if (!eventSpace) {
        return;
      }
      const eventSpaceHeight =
        eventSpace.getBoundingClientRect().height - MONTHLY_DATE_HEADER_HEIGHT;
      // read moreを表示するため、-1する
      const eventLimit =
        Math.floor(eventSpaceHeight / MONTHLY_EVENT_ROW_SIZE) - 1;
      setEventLimit(eventLimit);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("reset", measure);
    };
  }, [yearMonth]);

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventInRow();

  return (
    <>
      <div className="grid size-full grid-rows-[min-content_1fr] gap-2">
        <div className="grid w-full grid-cols-7">
          {WEEK_DAY_LABELS.map((weekDay) => {
            return (
              <div className="text-center text-xs" key={weekDay}>
                {weekDay}
              </div>
            );
          })}
        </div>
        <div className="grid">
          {calendar.map((week, i) => {
            return (
              <WeekRow
                key={`${week[i]}`}
                rowRef={i === 0 ? firstEventsRowRef : undefined}
                week={week}
                events={events}
                calendarYearMonth={yearMonth}
                eventLimit={eventLimit}
              />
            );
          })}
        </div>
      </div>
      <CreateEventFormDialog
        isOpen={prepareCreateEventState.defaultCreateEventValues !== undefined}
        onClose={prepareCreateEventActions.clearState}
        defaultFormValues={prepareCreateEventState.defaultCreateEventValues}
        onChangeEventPeriodPreview={prepareCreateEventActions.setDragDateRange}
      />
    </>
  );
};

export const MonthlyCalendar: React.FC<Props> = (props) => {
  return (
    <PrepareCreateEventInRowProvider>
      <MoveEventInRowProvider>
        <ResizeEventInRowProvider>
          <MonthlyCalendarImpl {...props} />
        </ResizeEventInRowProvider>
      </MoveEventInRowProvider>
    </PrepareCreateEventInRowProvider>
  );
};
