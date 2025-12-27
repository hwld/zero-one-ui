import {
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  useEffect,
  useContext,
  createContext,
  PropsWithChildren,
} from "react";
import { DragDateRange } from "../../utils";
import { CreateEventInput } from "../../_backend/api";
import { max, min } from "date-fns";

type PrepareCreateEventState = {
  dragDateRange: DragDateRange | undefined;
  defaultCreateEventValues: CreateEventInput | undefined;
};

type PrepareCreateEventActions = {
  setDragDateRange: Dispatch<
    SetStateAction<PrepareCreateEventState["dragDateRange"]>
  >;
  startDrag: (dragStart: Date) => void;
  updateDragEnd: (dragEnd: Date) => void;
  setDefaultValues: () => void;
  clearState: () => void;
};

type PrepareCreateEventContext = {
  prepareCreateEventState: PrepareCreateEventState;
  prepareCreateEventActions: PrepareCreateEventActions;
};

const Context = createContext<PrepareCreateEventContext | undefined>(undefined);

export const usePrepareCreateEventInRow = (): PrepareCreateEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${PrepareCreateEventInRowProvider.name}}が存在しません`);
  }
  return ctx;
};

export const PrepareCreateEventInRowProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [dragDateRange, setDragDateRange] =
    useState<PrepareCreateEventState["dragDateRange"]>();

  const startDrag: PrepareCreateEventActions["startDrag"] = useCallback(
    (dragStart) => {
      setDragDateRange({ dragStartDate: dragStart, dragEndDate: dragStart });
    },
    [],
  );

  const updateDragEnd: PrepareCreateEventActions["updateDragEnd"] = useCallback(
    (dragEnd) => {
      if (!dragDateRange) {
        return;
      }
      setDragDateRange({ ...dragDateRange, dragEndDate: dragEnd });
    },
    [dragDateRange],
  );

  const [defaultCreateEventValues, setDefaultCreateEventValues] =
    useState<PrepareCreateEventState["defaultCreateEventValues"]>();

  const setDefaultValues: PrepareCreateEventActions["setDefaultValues"] =
    useCallback(() => {
      if (!dragDateRange) {
        return;
      }

      const { dragStartDate, dragEndDate } = dragDateRange;

      const eventStart = min([dragStartDate, dragEndDate]);
      const eventEnd = max([dragStartDate, dragEndDate]);

      setDefaultCreateEventValues({
        title: "",
        allDay: true,
        start: eventStart,
        end: eventEnd,
      });
    }, [dragDateRange]);

  const clearState: PrepareCreateEventActions["clearState"] =
    useCallback(() => {
      setDragDateRange(undefined);
      setDefaultCreateEventValues(undefined);
    }, []);

  const prepareCreateEventState: PrepareCreateEventState = useMemo(() => {
    return { dragDateRange, defaultCreateEventValues };
  }, [defaultCreateEventValues, dragDateRange]);

  useEffect(() => {
    const openCreateEventDialog = (event: MouseEvent) => {
      if (event.button === 0) {
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
        setDefaultValues,
        clearState,
      },
    }),
    [
      clearState,
      prepareCreateEventState,
      setDefaultValues,
      startDrag,
      updateDragEnd,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
