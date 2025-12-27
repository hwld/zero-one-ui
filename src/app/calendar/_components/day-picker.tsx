import { format, isSameDay, isWithinInterval } from "date-fns";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  DayPicker as ReactDayPicker,
  type ChevronProps,
  Chevron as DayPickerChevron,
  type MonthCaptionProps,
  useDayPicker,
  type DayProps,
} from "react-day-picker";
import { TbArrowBackUp } from "@react-icons/all-files/tb/TbArrowBackUp";
import { TbChevronRight } from "@react-icons/all-files/tb/TbChevronRight";
import { TbChevronLeft } from "@react-icons/all-files/tb/TbChevronLeft";
import { WEEK_DAY_LABELS } from "../consts";
import { IconButton } from "./button";

type Props = {
  hideSelectedDates?: boolean;
  selectedDates: Date[];
  month: Date;
  onChangeMonth: Dispatch<SetStateAction<Date>>;
  onClickDay: (d: Date) => void;
};

export const DayPicker: React.FC<Props> = ({
  hideSelectedDates,
  selectedDates,
  month,
  onChangeMonth,
  onClickDay,
}) => {
  const selected = useMemo((): { from: Date; to: Date } | undefined => {
    if (hideSelectedDates) {
      return undefined;
    }
    return { from: selectedDates.at(0)!, to: selectedDates.at(-1)! };
  }, [hideSelectedDates, selectedDates]);

  const isSelectedDay = (day: Date) => {
    if (!selected) {
      return false;
    }
    if ("from" in selected) {
      return isWithinInterval(day, { start: selected.from, end: selected.to });
    }

    return isSameDay(selected, day);
  };

  const isFirstSelectedDay = (day: Date) => {
    if (!selected) {
      return false;
    }
    if ("from" in selected) {
      return isSameDay(selected.from, day);
    }

    return isSameDay(selected, day);
  };

  const isLastSelectedDay = (day: Date) => {
    if (!selected) {
      return false;
    }
    if ("from" in selected) {
      return isSameDay(selected.to, day);
    }
    return isSameDay(selected, day);
  };

  return (
    <ReactDayPicker
      month={month}
      onMonthChange={onChangeMonth}
      onDayClick={onClickDay}
      fixedWeeks
      showOutsideDays
      formatters={{
        formatCaption: (e) => format(e, "yyyy年M月"),
        formatWeekdayName: (d) => WEEK_DAY_LABELS[d.getDay()],
      }}
      className="w-fit"
      modifiers={{
        selected: isSelectedDay,
        "first-selected": isFirstSelectedDay,
        "last-selected": isLastSelectedDay,
      }}
      modifiersClassNames={{
        selected: "bg-neutral-500/15 pointer-events-none",
        "first-selected": "rounded-l",
        "last-selected": "rounded-r",
      }}
      classNames={{
        month: "space-y-2",
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday: "text-neutral-500 rounded-md w-8 font-normal text-[0.6rem]",
        week: "flex w-full",
        day: "relative p-[2px] text-center text-xs overflow-hidden",
        day_button: "size-7 p-0 font-normal hover:bg-neutral-500/15 rounded-sm",
        outside: "day-outside text-neutral-400",
      }}
      components={{
        Nav: Empty,
        Day,
        Chevron,
        MonthCaption,
      }}
    />
  );
};

const Empty = () => <></>;

const Day = ({ day: _, modifiers, children, ...props }: DayProps) => {
  const content = useMemo(() => {
    if (modifiers.today) {
      return (
        <div className="rounded-sm bg-blue-500 text-neutral-100">
          {children}
        </div>
      );
    }
    return children;
  }, [children, modifiers.today]);

  return <td {...props}>{content}</td>;
};

const Chevron = ({ orientation, ...props }: ChevronProps) => {
  if (orientation === "left") {
    return <TbChevronLeft {...props} />;
  }
  if (orientation === "right") {
    return <TbChevronRight {...props} />;
  }
  return <DayPickerChevron orientation={orientation} {...props} />;
};

const MonthCaption = ({ calendarMonth }: MonthCaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useDayPicker();

  return (
    <div className="flex w-full items-center justify-between pl-2">
      <div className="text-xs">{format(calendarMonth.date, "yyyy年MM月")}</div>
      <div className="flex">
        <IconButton
          size="sm"
          icon={TbArrowBackUp}
          onClick={() => {
            goToMonth(new Date());
          }}
        />
        <IconButton
          size="sm"
          icon={TbChevronLeft}
          disabled={!previousMonth}
          onClick={() => {
            if (previousMonth) {
              goToMonth(previousMonth);
            }
          }}
        />
        <IconButton
          size="sm"
          disabled={!nextMonth}
          onClick={() => {
            if (nextMonth) {
              goToMonth(nextMonth);
            }
          }}
          icon={TbChevronRight}
        />
      </div>
    </div>
  );
};
