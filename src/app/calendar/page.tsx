"use client";
import { useMemo } from "react";
import { MonthlyCalendar } from "./_features/monthly-calendar/monthly-calendar";
import { DateColCalendar } from "./_features/date-col-calendar/calendar";
import { useEvents } from "./_features/event/use-events";
import { Sidebar } from "./_components/siderbar";
import { Button } from "./_components/button";
import {
  CalendarType,
  DAILY_CALENDAR_TYPE,
  WEEKLY_CALENDAR_TYPE,
  useAppState,
} from "./_components/use-app-state";
import { useCalendarCommands } from "./command";
import { Select, SelectItem } from "./_components/select";
import { CalendarViewDate } from "./_components/calendar-view-date";
import clsx from "clsx";
import { useBodyBgColor } from "../../lib/useBodyBgColor";

const Page = () => {
  useCalendarCommands();

  const { events } = useEvents();
  const { calendarInfo, goTodayCalendarPage, changeCalendarType } =
    useAppState();

  const calendar = useMemo(() => {
    switch (calendarInfo.type.kind) {
      case "month": {
        return (
          <MonthlyCalendar
            yearMonth={calendarInfo.selectedDate}
            events={events}
          />
        );
      }
      case "range": {
        return (
          <DateColCalendar
            cols={calendarInfo.type.days}
            viewDate={calendarInfo.selectedDate}
            events={events}
          />
        );
      }
      default: {
        throw new Error(calendarInfo.type satisfies never);
      }
    }
  }, [calendarInfo, events]);

  const bgClass = "bg-neutral-50";
  useBodyBgColor(bgClass);

  return (
    <div
      className={clsx(
        "grid h-dvh w-dvw grid-cols-[250px_1fr] overflow-hidden text-neutral-700",
        bgClass,
      )}
      style={{ colorScheme: "light" }}
    >
      <Sidebar />
      <div className="grid grid-rows-[60px_1fr] overflow-hidden">
        <div className="flex items-center gap-2 px-4">
          <Select
            items={CALENDAR_TYPE_LIST}
            selectedValue={calendarInfo.type}
            onSelect={changeCalendarType}
            isEqual={(a, b) => {
              if (a.kind !== b.kind) {
                return false;
              }
              if (a.kind === "month" && b.kind === "month") {
                return true;
              }
              if (a.kind === "range" && b.kind === "range") {
                return a.days === b.days;
              }
              return false;
            }}
          />
          <Button onClick={goTodayCalendarPage}>今日</Button>
          <CalendarViewDate />
        </div>
        {calendar}
      </div>
    </div>
  );
};

export default Page;

const CALENDAR_TYPE_LIST: SelectItem<CalendarType>[] = [
  {
    type: "root",
    value: { kind: "month" },
    label: "月",
    shortcut: "M",
  },
  {
    type: "root",
    value: WEEKLY_CALENDAR_TYPE,
    label: "週",
    shortcut: "W",
  },
  {
    type: "root",
    value: DAILY_CALENDAR_TYPE,
    label: "日",
    shortcut: "D",
  },
  {
    type: "nest",
    label: "日数",
    items: [
      {
        type: "root",
        value: { kind: "range", days: 2 },
        label: "2日間",
      },
      {
        type: "root",
        value: { kind: "range", days: 3 },
        label: "3日間",
      },
      {
        type: "root",
        value: { kind: "range", days: 4 },
        label: "4日間",
      },
    ],
  },
];
