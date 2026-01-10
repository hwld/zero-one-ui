import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  startOfDay,
  startOfWeek,
  format,
  differenceInMinutes,
  addDays,
} from "date-fns";
import { useMemo } from "react";
import { Event } from "../../_backend/event-store";
import { splitEvent } from "./utils";
import {
  DATE_EVENT_MIN_HEIGHT,
  DATE_EVENT_MIN_MINUTES,
} from "../event-in-col/utils";
import { DateColumn } from "./date-column";
import { DateColCalendarDayHeader } from "./header";
import {
  MoveEventInColProvider,
  useMoveEventInCol,
} from "../event-in-col/move-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import {
  PrepareCreateEventInColProvider,
  usePrepareCreateEventInCol,
} from "../event-in-col/prepare-create-event-provider";
import {
  ResizeEventInColProvider,
  useResizeEventInCol,
} from "../event-in-col/resize-event-provider";
import { MoveEventInRowProvider } from "../event-in-row/move-event-provider";
import { PrepareCreateEventInRowProvider } from "../event-in-row/prepare-create-event-provider";
import { useMinuteClock } from "../../_components/use-minute-clock";
import clsx from "clsx";
import { ResizeEventInRowProvider } from "../event-in-row/resize-event-provider";
import {
  ScrollableProvider,
  useScrollableElement,
} from "../event-in-col/scrollable-provider";

const DATE_COLUMN_CALENDAR_GRID_FIRST_COL_SIZE = 75;
export const DATE_COLUMN_CALENDAR_GRID_TEMPLATE_COLUMNS = (cols: number) =>
  `${DATE_COLUMN_CALENDAR_GRID_FIRST_COL_SIZE}px repeat(${cols},1fr)`;

type DateColCalendarProps = {
  viewDate: Date;
  events: Event[];
  cols: number;
};

const DateColCalendarImpl: React.FC<DateColCalendarProps> = ({
  cols,
  viewDate,
  events,
}) => {
  const { setScrollableElement } = useScrollableElement();
  const { currentDate } = useMinuteClock();
  const { longTermEvents, defaultEvents } = splitEvent(events);

  const calendarViewDates = useMemo(() => {
    let start: Date;
    if (cols >= 7) {
      start = startOfDay(startOfWeek(viewDate));
    } else {
      start = startOfDay(viewDate);
    }
    const end = addDays(start, cols - 1);

    return eachDayOfInterval({ start, end });
  }, [cols, viewDate]);

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateEventInCol();
  const { isEventMoving, moveEventActions } = useMoveEventInCol();
  const { isEventResizing, resizeEventActions } = useResizeEventInCol();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;

    if (prepareCreateEventState) {
      prepareCreateEventActions.scroll(scrollTop);
    }

    if (isEventMoving) {
      moveEventActions.scroll(scrollTop);
    }

    if (isEventResizing) {
      resizeEventActions.scroll(scrollTop);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-col">
        <DateColCalendarDayHeader
          dates={calendarViewDates}
          calendarYearMonth={viewDate}
          longTermEvents={longTermEvents}
        />
        <div
          className="flex w-full flex-col overflow-auto"
          style={{ scrollbarWidth: "none" }}
          ref={setScrollableElement}
          onScroll={handleScroll}
        >
          <div
            className={clsx("relative grid")}
            style={{
              gridTemplateColumns:
                DATE_COLUMN_CALENDAR_GRID_TEMPLATE_COLUMNS(cols),
            }}
          >
            <div>
              {eachHourOfInterval({
                start: startOfDay(viewDate),
                end: endOfDay(viewDate),
              }).map((h, i) => {
                return (
                  <div
                    className="relative border-r border-neutral-200 pr-3 text-end whitespace-nowrap text-neutral-400 tabular-nums select-none"
                    key={i}
                    style={{
                      height:
                        DATE_EVENT_MIN_HEIGHT * (60 / DATE_EVENT_MIN_MINUTES),
                      top: i !== 0 ? "-5px" : undefined,
                      fontSize: "10px",
                    }}
                  >
                    {format(h, "hh:mm a")}
                  </div>
                );
              })}
            </div>
            {calendarViewDates.map((date) => {
              return (
                <DateColumn
                  key={`${date}`}
                  displayedDay={date}
                  events={defaultEvents}
                />
              );
            })}
            <div
              className="absolute grid h-px w-full"
              style={{
                gridTemplateColumns: `${DATE_COLUMN_CALENDAR_GRID_FIRST_COL_SIZE}px 1fr`,
                top:
                  (DATE_EVENT_MIN_HEIGHT / DATE_EVENT_MIN_MINUTES) *
                  differenceInMinutes(currentDate, startOfDay(currentDate)),
              }}
            >
              <div
                className="relative -translate-y-1/2 pr-3 text-end text-xs font-bold"
                style={{
                  width: DATE_COLUMN_CALENDAR_GRID_FIRST_COL_SIZE,
                  fontSize: "10px",
                }}
              >
                {format(currentDate, "hh:mm a")}
              </div>
              <div className="h-px w-full bg-blue-300" />
            </div>
          </div>
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

export const DateColCalendar: React.FC<DateColCalendarProps> = ({
  ...props
}) => {
  return (
    <ScrollableProvider>
      <PrepareCreateEventInRowProvider>
        <MoveEventInRowProvider>
          <ResizeEventInRowProvider>
            <PrepareCreateEventInColProvider>
              <MoveEventInColProvider>
                <ResizeEventInColProvider>
                  <DateColCalendarImpl {...props} />
                </ResizeEventInColProvider>
              </MoveEventInColProvider>
            </PrepareCreateEventInColProvider>
          </ResizeEventInRowProvider>
        </MoveEventInRowProvider>
      </PrepareCreateEventInRowProvider>
    </ScrollableProvider>
  );
};
