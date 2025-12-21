import { format, isSameDay } from "date-fns";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  CaptionProps,
  useNavigation,
  DayPicker as ReactDayPicker,
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
  const selected = useMemo((): Date | { from: Date; to: Date } | undefined => {
    if (hideSelectedDates) {
      return undefined;
    }
    return { from: selectedDates.at(0)!, to: selectedDates.at(-1)! };
  }, [hideSelectedDates, selectedDates]);

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
      selected={selected}
      onDayClick={onClickDay}
      fixedWeeks
      showOutsideDays
      formatters={{
        formatCaption: (e) => format(e, "yyyy年M月"),
        formatWeekdayName: (d) => WEEK_DAY_LABELS[d.getDay()],
      }}
      className="w-fit"
      modifiers={{
        "first-selected": isFirstSelectedDay,
        "last-selected": isLastSelectedDay,
      }}
      modifiersClassNames={{
        "first-selected": "first-selected",
        "last-selected": "last-selected",
      }}
      classNames={{
        month: "space-y-2",
        table: "w-full border-collapse",
        head_row: "flex mb-1",
        head_cell: "text-neutral-500 rounded-md w-8 font-normal text-[0.6rem]",
        row: "flex w-full",
        cell: "relative p-[2px] text-center text-xs [&:has(.first-selected)]:rounded-l [&:has(.last-selected)]:rounded-r overflow-hidden [&:has([aria-selected])]:bg-neutral-500/15",
        day: "size-7 p-0 font-normal aria-selected:opacity-100 hover:bg-neutral-500/15 rounded-sm",
        day_today: "bg-blue-500! hover:bg-blue-500! text-neutral-100!",
        day_selected: "pointer-events-none",
        day_outside:
          "day-outside text-neutral-400 aria-selected:text-neutral-500",
      }}
      components={{
        IconLeft: TbChevronLeft,
        IconRight: TbChevronRight,
        Caption,
      }}
    />
  );
};

const Caption = ({ displayMonth }: CaptionProps) => {
  const { goToMonth, goToDate, nextMonth, previousMonth } = useNavigation();

  return (
    <div className="flex w-full items-center justify-between pl-2">
      <div className="text-xs">{format(displayMonth, "yyyy年MM月")}</div>
      <div className="flex">
        <IconButton
          size="sm"
          icon={TbArrowBackUp}
          onClick={() => {
            goToDate(new Date());
          }}
        />
        <IconButton
          size="sm"
          icon={TbChevronLeft}
          disabled={!previousMonth}
          onClick={() => {
            previousMonth && goToMonth(previousMonth);
          }}
        />
        <IconButton
          size="sm"
          disabled={!nextMonth}
          onClick={() => {
            nextMonth && goToMonth(nextMonth);
          }}
          icon={TbChevronRight}
        />
      </div>
    </div>
  );
};
