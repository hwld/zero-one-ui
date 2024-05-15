import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfDay,
  endOfWeek,
  startOfDay,
  startOfWeek,
  format,
} from "date-fns";
import { RefObject, useMemo, useRef } from "react";
import { Event } from "../../_mocks/event-store";
import { splitEvent } from "./utils";
import {
  DATE_EVENT_MIN_HEIGHT,
  DATE_EVENT_MIN_MINUTES,
} from "../event/date-event/utils";
import { DateColumn } from "./date-column";
import { WeeklyCalendarDayHeader } from "./weekly-calendar-header";
import {
  MoveDateEventProvider,
  useMoveDateEvent,
} from "../event/date-event/move-event-provider";
import { CreateEventFormDialog } from "../event/create-event-form-dialog";
import {
  PrepareCreateDateEventProvider,
  usePrepareCreateDateEvent,
} from "../event/date-event/prepare-create-event-provider";
import {
  ResizeDateEventProvider,
  useResizeDateEvent,
} from "../event/date-event/resize-event-provider";
import { MoveWeekEventProvider } from "../event/week-event/move-event-provider";
import { PrepareCreateWeekEventProvider } from "../event/week-event/prepare-create-event-provider";

export const WEEKLY_CALENDAR_GRID_COLS_CLASS = "grid-cols-[75px,repeat(7,1fr)]";

type WeeklyCalendarProps = { date: Date; events: Event[] };

type WeeklyCalendarImplProps = {
  scrollableRef: RefObject<HTMLDivElement>;
} & WeeklyCalendarProps;

export const WeeklyCalendarImpl: React.FC<WeeklyCalendarImplProps> = ({
  scrollableRef,
  date,
  events,
}) => {
  const { longTermEvents, defaultEvents } = splitEvent(events);

  const week = useMemo(() => {
    const start = startOfDay(startOfWeek(date));
    const end = startOfDay(endOfWeek(date));

    return eachDayOfInterval({ start, end });
  }, [date]);

  const { prepareCreateEventState, prepareCreateEventActions } =
    usePrepareCreateDateEvent();
  const { isEventMoving, moveEventActions } = useMoveDateEvent();
  const { isEventResizing, resizeEventActions } = useResizeDateEvent();

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
        <WeeklyCalendarDayHeader
          calendarYearMonth={date}
          week={week}
          longTermEvents={longTermEvents}
        />
        <div
          className="flex w-full flex-col overflow-auto"
          style={{ scrollbarWidth: "none" }}
          ref={scrollableRef}
          onScroll={handleScroll}
        >
          <div className="grid grid-cols-[75px,repeat(7,1fr)]">
            <div className="">
              {eachHourOfInterval({
                start: startOfDay(date),
                end: endOfDay(date),
              }).map((h, i) => {
                return (
                  <div
                    className="relative select-none whitespace-nowrap border-r border-neutral-200 pr-3 text-end tabular-nums text-neutral-400"
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
            {week.map((date) => {
              return (
                <DateColumn
                  key={`${date}`}
                  displayedDay={date}
                  events={defaultEvents}
                />
              );
            })}
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

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ ...props }) => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  return (
    <PrepareCreateWeekEventProvider>
      <MoveWeekEventProvider>
        <PrepareCreateDateEventProvider scrollableRef={scrollableRef}>
          <MoveDateEventProvider scrollableRef={scrollableRef}>
            <ResizeDateEventProvider scrollableRef={scrollableRef}>
              <WeeklyCalendarImpl scrollableRef={scrollableRef} {...props} />
            </ResizeDateEventProvider>
          </MoveDateEventProvider>
        </PrepareCreateDateEventProvider>
      </MoveWeekEventProvider>
    </PrepareCreateWeekEventProvider>
  );
};
