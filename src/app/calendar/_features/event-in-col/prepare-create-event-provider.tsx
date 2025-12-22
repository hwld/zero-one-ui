import {
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  useRef,
  useEffect,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import { DragDateRange, MouseHistory } from "../../utils";
import { CreateEventInput } from "../../_backend/api";
import { addMinutes, max, min, startOfDay } from "date-fns";
import { DATE_EVENT_MIN_MINUTES } from "./utils";
import { getDateFromY } from "./utils";
import { useScrollableElement } from "./scrollable-provider";

type PrepareCreateEventState = {
  dragDateRange: DragDateRange | undefined;
  defaultCreateEventValues: Omit<CreateEventInput, "title"> | undefined;
};

type PrepareCreateEventActions = {
  setDragDateRange: Dispatch<
    SetStateAction<PrepareCreateEventState["dragDateRange"]>
  >;
  startDrag: (day: Date, y: number) => void;
  updateDragEnd: (day: Date, y: number) => void;
  scroll: (scrollTop: number) => void;
  setDefaultValues: () => void;
  clearState: () => void;
};

type PrepareCreateEventContext = {
  prepareCreateEventState: PrepareCreateEventState;
  prepareCreateEventActions: PrepareCreateEventActions;
};

const Context = createContext<PrepareCreateEventContext | undefined>(undefined);

export const usePrepareCreateEventInCol = (): PrepareCreateEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${PrepareCreateEventInColProvider.name}が存在しません`);
  }
  return ctx;
};

export const PrepareCreateEventInColProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { scrollableElement } = useScrollableElement();
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateEventState["dragDateRange"]>();

  // マウスイベントが発生したときのyとscrollableのscrollTopを保存して、スクロールされたときに
  // これを使用してdragDateRangeを更新する
  const mouseHistoryRef = useRef<MouseHistory>(undefined);

  const startDrag: PrepareCreateEventActions["startDrag"] = useCallback(
    (day, y) => {
      if (scrollableElement) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElement.scrollTop,
        };
      }

      const targetDate = startOfDay(day);

      // ドラッグ開始の時点では常にクリックした最小領域が期間として設定されるようにする
      const dragStartDate = getDateFromY(targetDate, y, "floor");
      const dragEndDate = addMinutes(dragStartDate, DATE_EVENT_MIN_MINUTES);

      setDragDateRange({ dragStartDate, dragEndDate });
    },
    [scrollableElement],
  );

  const updateDragEnd: PrepareCreateEventActions["updateDragEnd"] = useCallback(
    (day, y) => {
      if (!dragDateRange) {
        return;
      }

      if (scrollableElement) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElement.scrollTop,
        };
      }

      const targetDate = startOfDay(day);
      const dragEndDate = getDateFromY(targetDate, y);
      setDragDateRange({ ...dragDateRange, dragEndDate });
    },
    [dragDateRange, scrollableElement],
  );

  const scroll: PrepareCreateEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!dragDateRange || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateDragEnd(dragDateRange.dragEndDate, y);
    },
    [dragDateRange, updateDragEnd],
  );

  const clearState: PrepareCreateEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
      mouseHistoryRef.current = undefined;
    }, []);

  const [defaultCreateEventValues, setDefaultCreateEventValues] =
    useState<PrepareCreateEventState["defaultCreateEventValues"]>();

  const setDefaultValues: PrepareCreateEventActions["setDefaultValues"] =
    useCallback(() => {
      if (!dragDateRange) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragDateRange;

      if (dragStartDate.getTime() !== dragEndDate.getTime()) {
        const eventStart = min([dragStartDate, dragEndDate]);
        const eventEnd = max([dragStartDate, dragEndDate]);

        setDefaultCreateEventValues({
          allDay: false,
          start: eventStart,
          end: eventEnd,
        });
      } else {
        clearState();
      }
    }, [clearState, dragDateRange]);

  const prepareCreateEventState: PrepareCreateEventState = useMemo(() => {
    return { dragDateRange, defaultCreateEventValues };
  }, [defaultCreateEventValues, dragDateRange]);

  useEffect(() => {
    const openCreateEventDialog = (e: MouseEvent) => {
      if (e.button === 0) {
        setDefaultValues();
      }
    };

    document.addEventListener("mouseup", openCreateEventDialog);
    return () => {
      document.removeEventListener("mouseup", openCreateEventDialog);
    };
  }, [setDefaultValues]);

  const value: PrepareCreateEventContext = useMemo(
    () => ({
      prepareCreateEventState,
      prepareCreateEventActions: {
        setDragDateRange,
        startDrag,
        updateDragEnd,
        scroll,
        setDefaultValues,
        clearState,
      },
    }),
    [
      clearState,
      prepareCreateEventState,
      scroll,
      setDefaultValues,
      startDrag,
      updateDragEnd,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
