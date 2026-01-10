import { TbChevronLeft } from "@react-icons/all-files/tb/TbChevronLeft";
import { TbChevronRight } from "@react-icons/all-files/tb/TbChevronRight";
import { IconButton } from "./button";
import { useAppState } from "./use-app-state";
import { useMemo } from "react";

export const CalendarViewDate: React.FC = () => {
  const { prevCalendarPage, nextCalendarPage, calendarInfo } = useAppState();

  const option = useMemo(() => {
    switch (calendarInfo.type.kind) {
      case "month": {
        return null;
      }
      case "range": {
        if (calendarInfo.type.days !== 1) {
          return null;
        }
        return (
          <>
            <div className="mx-1 w-6 text-center text-lg tabular-nums">
              {calendarInfo.selectedDate.getDate()}
            </div>
            日
          </>
        );
      }
      default: {
        throw new Error(calendarInfo.type satisfies never);
      }
    }
  }, [calendarInfo]);

  return (
    <div className="flex items-center gap-2">
      <IconButton icon={TbChevronLeft} onClick={prevCalendarPage} />
      <div className="flex items-center select-none">
        <div className="mx-1 text-lg tabular-nums">
          {calendarInfo.selectedDate.getFullYear()}
        </div>
        年
        <div className="mx-1 w-6 text-center text-lg tabular-nums">
          {calendarInfo.selectedDate.getMonth() + 1}
        </div>
        月{option}
      </div>
      <IconButton icon={TbChevronRight} onClick={nextCalendarPage} />
    </div>
  );
};
