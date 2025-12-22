import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useUpdateEvent } from "../event/use-update-event";
import { MoveEventInColPreview } from "./type";
import { EventInCol } from "./type";
import { addMinutes, differenceInMinutes, isSameMinute } from "date-fns";
import { MouseHistory } from "../../utils";
import { getDateFromY } from "./utils";
import { useScrollableElement } from "./scrollable-provider";

type MoveEventActions = {
  startMove: (event: EventInCol, moveStart: { date: Date; y: number }) => void;
  updateMoveDest: (day: Date, y: number) => void;
  scroll: (scrollTop: number) => void;
  move: () => void;
};

type MoveEventContext = {
  isEventMoving: boolean;
  moveEventPreview: MoveEventInColPreview | undefined;
  moveEventActions: MoveEventActions;
};

const Context = createContext<MoveEventContext | undefined>(undefined);

export const useMoveEventInCol = (): MoveEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${MoveEventInColProvider.name}が存在しません`);
  }
  return ctx;
};

export const MoveEventInColProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { scrollableElement } = useScrollableElement();
  const updateEventMutation = useUpdateEvent();

  const [state, setState] = useState<{
    isEventMoving: boolean;
    moveEventPreview: MoveEventInColPreview | undefined;
  }>({ isEventMoving: false, moveEventPreview: undefined });

  const { isEventMoving, moveEventPreview } = state;

  const mouseHistoryRef = useRef<MouseHistory>(undefined);

  const startMove: MoveEventActions["startMove"] = useCallback(
    (event, { date, y }) => {
      if (scrollableElement) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElement.scrollTop,
        };
      }

      const moveStartDate = getDateFromY(date, y);

      setState({
        isEventMoving: true,
        moveEventPreview: {
          ...event,
          prevMouseOverDate: moveStartDate,
          updatedAt: Date.now(),
        },
      });
    },
    [scrollableElement],
  );

  const updateMoveDest: MoveEventActions["updateMoveDest"] = useCallback(
    (day: Date, y: number) => {
      const moveDest = getDateFromY(day, y);
      if (
        !isEventMoving ||
        !moveEventPreview ||
        isSameMinute(moveDest, moveEventPreview.prevMouseOverDate)
      ) {
        return;
      }

      if (scrollableElement) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElement.scrollTop,
        };
      }

      const diffMinutes = differenceInMinutes(
        moveDest,
        moveEventPreview.prevMouseOverDate,
      );

      setState((prev) => ({
        ...prev,
        moveEventPreview: {
          ...moveEventPreview,
          start: addMinutes(moveEventPreview.start, diffMinutes),
          end: addMinutes(moveEventPreview.end, diffMinutes),
          prevMouseOverDate: moveDest,
          updatedAt: Date.now(),
        },
      }));
    },
    [isEventMoving, moveEventPreview, scrollableElement],
  );

  const scroll: MoveEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!isEventMoving || !moveEventPreview || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateMoveDest(moveEventPreview.prevMouseOverDate, y);
    },
    [isEventMoving, moveEventPreview, updateMoveDest],
  );

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!moveEventPreview) {
      return;
    }

    updateEventMutation.mutate(moveEventPreview, {
      onSettled: () => {
        setState((prev) => {
          if (prev.isEventMoving) {
            return prev;
          }
          return { ...prev, moveEventPreview: undefined };
        });
      },
    });

    setState((prev) => ({ ...prev, isEventMoving: false }));
  }, [moveEventPreview, updateEventMutation]);

  useEffect(() => {
    const moveEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        move();
      }
    };

    document.addEventListener("mouseup", moveEvent);
    return () => {
      document.removeEventListener("mouseup", moveEvent);
    };
  }, [move]);

  const value: MoveEventContext = useMemo(() => {
    return {
      isEventMoving,
      moveEventPreview,
      moveEventActions: { startMove, updateMoveDest, scroll, move },
    };
  }, [
    isEventMoving,
    move,
    moveEventPreview,
    scroll,
    startMove,
    updateMoveDest,
  ]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
