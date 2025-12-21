import { isSameDay, isSameMonth, isWeekend } from "date-fns";
import { isDayWithinDragDateRange } from "../../utils";
import clsx from "clsx";
import { usePrepareCreateEventInRow } from "../event-in-row/prepare-create-event-provider";
import { useMinuteClock } from "../../_components/use-minute-clock";

export const MONTHLY_DATE_HEADER_HEIGHT = 32;

type Props = {
  calendarYearMonth: Date;
  date: Date;
};

export const CalendarDate: React.FC<Props> = ({ calendarYearMonth, date }) => {
  const { currentDate } = useMinuteClock();
  const { prepareCreateEventState } = usePrepareCreateEventInRow();
  const isDraggedDate =
    prepareCreateEventState.dragDateRange &&
    isDayWithinDragDateRange(date, prepareCreateEventState.dragDateRange);

  return (
    <div
      className={clsx(
        "relative border-t border-r border-neutral-200 text-xs text-neutral-700 transition-colors select-none",
        isWeekend(date) ? "bg-neutral-200/15" : "",
      )}
    >
      <div
        className={clsx(
          "h-full w-full",
          isDraggedDate ? "bg-neutral-700/5" : "",
        )}
      >
        <div
          className="h-10 w-full p-1"
          style={{ height: MONTHLY_DATE_HEADER_HEIGHT }}
        >
          <div
            className={clsx(
              "grid place-items-center rounded-sm p-1",
              isSameMonth(calendarYearMonth, date)
                ? "opacity-100"
                : "opacity-50",
              isSameDay(currentDate, date) && "bg-blue-500 text-neutral-100",
            )}
            style={{
              width: MONTHLY_DATE_HEADER_HEIGHT - 8,
              height: MONTHLY_DATE_HEADER_HEIGHT - 8,
            }}
          >
            {date.getDate()}
          </div>
        </div>
      </div>
    </div>
  );
};
