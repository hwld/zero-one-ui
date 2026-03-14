import {
  addDays,
  addMonths,
  subDays,
  subMonths,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  previousSunday,
  isSunday,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useMinuteClock } from "./use-minute-clock";

export type CalendarType = { kind: "month" } | { kind: "range"; days: number };

export const WEEKLY_CALENDAR_TYPE = {
  kind: "range",
  days: 7,
} as const satisfies CalendarType;

export const DAILY_CALENDAR_TYPE = {
  kind: "range",
  days: 1,
} as const satisfies CalendarType;

type CalendarInfo = {
  selectedDate: Date;
  viewDates: Date[];
  type: CalendarType;
};

type AppStateContext = {
  calendarInfo: CalendarInfo;
  changeCalendarType: (type: CalendarType) => void;

  dayPickerMonth: Date;
  setDayPickerMonth: Dispatch<SetStateAction<Date>>;

  selectDate: (date: Date) => void;

  nextCalendarPage: () => void;
  prevCalendarPage: () => void;
  goTodayCalendarPage: () => void;
};

const Context = createContext<AppStateContext | undefined>(undefined);

export const useAppState = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${AppStateProvider.name}が存在しません。`);
  }
  return ctx;
};

export const AppStateProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { currentDate } = useMinuteClock();

  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
    selectedDate: currentDate,
    type: { kind: "range", days: 7 },
    viewDates: eachDayOfInterval({
      start: startOfWeek(currentDate),
      end: endOfWeek(currentDate),
    }),
  });

  const [dayPickerMonth, setDayPickerMonth] = useState(calendarInfo.selectedDate);

  const changeCalendarType = useCallback(
    (type: CalendarType) => {
      switch (type.kind) {
        case "month": {
          const viewDates = eachDayOfInterval({
            start: startOfMonth(calendarInfo.selectedDate),
            end: endOfMonth(calendarInfo.selectedDate),
          });
          setCalendarInfo((info) => ({ ...info, type, viewDates }));
          return;
        }
        case "range": {
          // 指定された日付を範囲の最後だと仮定したときに、指定された範囲に日曜日が含まれているか判定する。
          // selectedDateが日曜日の場合にも日曜日が含まれていると判定させる
          const nearestSunday = isSunday(calendarInfo.selectedDate)
            ? calendarInfo.selectedDate
            : previousSunday(calendarInfo.selectedDate);
          const includesSundayInRange = isWithinInterval(nearestSunday, {
            start: subDays(calendarInfo.selectedDate, type.days - 1),
            end: calendarInfo.selectedDate,
          });

          const viewDates = includesSundayInRange
            ? eachDayOfInterval({
                start: nearestSunday,
                end: addDays(nearestSunday, type.days - 1),
              })
            : eachDayOfInterval({
                start: calendarInfo.selectedDate,
                end: addDays(calendarInfo.selectedDate, type.days - 1),
              });
          setCalendarInfo((info) => ({ ...info, type, viewDates }));
          return;
        }
        default: {
          throw new Error(type satisfies never);
        }
      }
    },
    [calendarInfo.selectedDate],
  );

  const selectDate = useCallback(
    (date: Date) => {
      const viewDates =
        calendarInfo.type.kind === "month"
          ? eachDayOfInterval({ start: date, end: addMonths(date, 1) })
          : calendarInfo.type.days === WEEKLY_CALENDAR_TYPE.days
            ? eachDayOfInterval({
                start: startOfWeek(date),
                end: endOfWeek(date),
              })
            : eachDayOfInterval({
                start: date,
                end: addDays(date, calendarInfo.type.days - 1),
              });

      setDayPickerMonth(date);
      setCalendarInfo((info) => ({
        ...info,
        selectedDate: date,
        viewDates,
      }));
    },
    [calendarInfo.type],
  );

  const nextCalendarPage = useCallback(() => {
    switch (calendarInfo.type.kind) {
      case "month": {
        const newStartDay = addMonths(calendarInfo.viewDates.at(0)!, 1);

        setDayPickerMonth(newStartDay);
        setCalendarInfo((info) => ({
          ...info,
          selectedDate: newStartDay,
          viewDates: eachDayOfInterval({
            start: newStartDay,
            end: endOfMonth(newStartDay),
          }),
        }));
        return;
      }
      case "range": {
        const days = calendarInfo.type.days;
        const newStartDay = addDays(calendarInfo.viewDates.at(-1)!, 1);

        setDayPickerMonth(newStartDay);
        setCalendarInfo((info) => ({
          ...info,
          selectedDate: newStartDay,
          viewDates: eachDayOfInterval({
            start: newStartDay,
            end: addDays(newStartDay, days - 1),
          }),
        }));
        return;
      }
      default: {
        throw new Error(calendarInfo.type satisfies never);
      }
    }
  }, [calendarInfo]);

  const prevCalendarPage = useCallback(() => {
    switch (calendarInfo.type.kind) {
      case "month": {
        const newStartDay = subMonths(calendarInfo.viewDates.at(0)!, 1);

        setDayPickerMonth(newStartDay);
        setCalendarInfo((info) => ({
          ...info,
          selectedDate: newStartDay,
          viewDates: eachDayOfInterval({
            start: newStartDay,
            end: endOfMonth(newStartDay),
          }),
        }));
        return;
      }
      case "range": {
        const days = calendarInfo.type.days;
        const newStartDay = subDays(calendarInfo.viewDates.at(0)!, days);

        setDayPickerMonth(newStartDay);
        setCalendarInfo((info) => ({
          ...info,
          selectedDate: newStartDay,
          viewDates: eachDayOfInterval({
            start: newStartDay,
            end: addDays(newStartDay, days - 1),
          }),
        }));
        return;
      }
      default: {
        throw new Error(calendarInfo.type satisfies never);
      }
    }
  }, [calendarInfo]);

  const goTodayCalendarPage = useCallback(() => {
    selectDate(new Date());
  }, [selectDate]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return false;
      }

      if (event.key === "W" || event.key === "w") {
        setCalendarInfo((info) => ({ ...info, type: WEEKLY_CALENDAR_TYPE }));
      } else if (event.key === "M" || event.key === "m") {
        setCalendarInfo((info) => ({ ...info, type: { kind: "month" } }));
      } else if (event.key === "D" || event.key === "d") {
        setCalendarInfo((info) => ({ ...info, type: DAILY_CALENDAR_TYPE }));
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  const value: AppStateContext = useMemo(
    () => ({
      calendarInfo,
      changeCalendarType,

      selectDate,

      dayPickerMonth,
      setDayPickerMonth,

      nextCalendarPage,
      prevCalendarPage,
      goTodayCalendarPage,
    }),
    [
      calendarInfo,
      changeCalendarType,
      selectDate,
      dayPickerMonth,
      nextCalendarPage,
      prevCalendarPage,
      goTodayCalendarPage,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
