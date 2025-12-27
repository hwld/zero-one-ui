import { useIsFetching } from "@tanstack/react-query";
import { DayPicker } from "./day-picker";
import { useAppState } from "./use-app-state";
import { eventsQueryOption } from "../_features/event/use-events";
import { AnimatePresence, motion } from "motion/react";
import { TbLoader2 } from "@react-icons/all-files/tb/TbLoader2";

type Props = {};

export const Sidebar: React.FC<Props> = () => {
  const { calendarInfo, selectDate, dayPickerMonth, setDayPickerMonth } =
    useAppState();

  const isFetchingEvents =
    useIsFetching({
      queryKey: eventsQueryOption.queryKey,
    }) > 0;

  return (
    <div className="flex flex-col items-center gap-4 border-r border-neutral-300 bg-neutral-100 p-2">
      <div className="h-8 w-full rounded-sm border border-neutral-300 bg-neutral-200 px-2 text-xs text-neutral-500 shadow-inner">
        <AnimatePresence>
          {isFetchingEvents && (
            <motion.div
              className="flex h-full items-center gap-2"
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
            >
              <TbLoader2 className="animate-spin" size={18} />
              <div>loading...</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <DayPicker
        hideSelectedDates={calendarInfo.type.kind === "month"}
        selectedDates={calendarInfo.viewDates}
        month={dayPickerMonth}
        onChangeMonth={setDayPickerMonth}
        onClickDay={selectDate}
      />
    </div>
  );
};
