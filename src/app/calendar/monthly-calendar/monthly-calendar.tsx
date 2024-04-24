import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EVENT_ROW_SIZE, WEEK_DAY_LABELS } from "../consts";
import {
  DragDateRange,
  getCalendarDates,
  getExceededEventCountByDayOfWeek,
  getWeekEvents,
} from "./utils";
import { Event } from "../type";
import { CalendarDate } from "./calendar-date";
import { WeekEventRow } from "./week-event-row";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { addMonths, subMonths } from "date-fns";

type Props = {};

export const MonthlyCalendar: React.FC<Props> = ({}) => {
  const [yearMonth, setYearMonth] = useState(new Date());

  const year = useMemo(() => {
    return yearMonth.getFullYear();
  }, [yearMonth]);

  const month = useMemo(() => {
    return yearMonth.getMonth() + 1;
  }, [yearMonth]);

  const handleGoPrevMonth = () => {
    setYearMonth(subMonths(yearMonth, 1));
  };
  const handleGoNextMonth = () => {
    setYearMonth(addMonths(yearMonth, 1));
  };

  const calendar = useMemo(() => {
    return getCalendarDates({ year, month });
  }, [month, year]);

  const [events, setEvents] = useState<Event[]>([]);

  const [dragDateRange, setDragDateRange] = useState<DragDateRange | undefined>(
    undefined,
  );

  const handleCreateEvent = (event: Event) => {
    setEvents((ss) => [...ss, event]);
  };

  const firstWeekEventRowRef = useRef<HTMLDivElement>(null);
  const [eventLimit, setEventLimit] = useState(0);

  useEffect(() => {
    const eventSpace = firstWeekEventRowRef.current;
    const measure = () => {
      if (!eventSpace) {
        return;
      }
      const eventSpaceHeight = eventSpace.getBoundingClientRect().height;
      // read moreを表示するため、-1する
      const eventLimit = Math.floor(eventSpaceHeight / EVENT_ROW_SIZE) - 1;
      setEventLimit(eventLimit);
    };

    measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("reset", measure);
    };
  }, [yearMonth]);

  return (
    <div className="grid h-full w-full grid-rows-[min-content,min-content,1fr] gap-2">
      <div className="flex items-center gap-2">
        <MonthNavigationButton onClick={handleGoPrevMonth}>
          <TbChevronLeft />
        </MonthNavigationButton>
        <div className="flex select-none items-center">
          <div className="mx-1 text-lg tabular-nums">{year}</div>年
          <div className="mx-1 w-6 text-center text-lg tabular-nums">
            {month}
          </div>
          月
        </div>
        <MonthNavigationButton onClick={handleGoNextMonth}>
          <TbChevronRight />
        </MonthNavigationButton>
      </div>
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
          const weekEvents = getWeekEvents({ week, events });

          const filteredWeekEvents = weekEvents.filter(
            (event) => event.top < eventLimit,
          );
          const exceededEventCountMap = getExceededEventCountByDayOfWeek({
            weekEvents,
            limit: eventLimit,
          });

          return (
            <div
              key={`${week[0]}`}
              className="relative grid min-h-[80px] min-w-[560px] select-none grid-cols-7"
            >
              {week.map((date) => {
                return (
                  <CalendarDate
                    calendarYearMonth={yearMonth}
                    key={date.getTime()}
                    date={date}
                    isLastWeek={calendar.length - 1 === i}
                    dragDateRange={dragDateRange}
                    onDragDateRangeChange={setDragDateRange}
                    onCreateEvent={handleCreateEvent}
                  />
                );
              })}
              <WeekEventRow
                ref={i === 0 ? firstWeekEventRowRef : undefined}
                isDraggingDate={!!dragDateRange}
                week={week}
                weekEvents={filteredWeekEvents}
                eventLimit={eventLimit}
                exceededEventCountMap={exceededEventCountMap}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MonthNavigationButton: React.FC<
  { children: ReactNode } & ComponentPropsWithoutRef<"button">
> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="grid size-6 place-items-center rounded text-lg transition-colors hover:bg-neutral-500/20"
    >
      {children}
    </button>
  );
};