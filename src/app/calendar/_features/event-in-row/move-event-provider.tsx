import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getEventFromMoveEventPreview } from "./utils";
import { MoveEventInRowPreview } from "./type";
import { useUpdateEvent } from "../event/use-update-event";
import { EventInRow } from "./type";

type MoveEventActions = {
  startMove: (event: EventInRow, moveStartDate: Date) => void;
  updateMoveEnd: (moveEndDate: Date) => void;
  move: () => void;
};

type MoveEventContext = {
  isEventMoving: boolean;
  moveEventPreview: MoveEventInRowPreview | undefined;
  moveEventActions: MoveEventActions;
};

const Context = createContext<MoveEventContext | undefined>(undefined);

export const useMoveEventInRow = (): MoveEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${MoveEventInRowProvider.name}が存在しません`);
  }
  return ctx;
};

export const MoveEventInRowProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const updateEventMutation = useUpdateEvent();

  const [state, setState] = useState<{
    isEventMoving: boolean;
    moveEventPreview: MoveEventInRowPreview | undefined;
  }>({ isEventMoving: false, moveEventPreview: undefined });

  const { moveEventPreview, isEventMoving } = state;

  const startMove: MoveEventActions["startMove"] = useCallback((event, moveStartDate) => {
    setState({
      isEventMoving: true,
      moveEventPreview: {
        ...event,
        dragStartDate: moveStartDate,
        dragEndDate: moveStartDate,
      },
    });
  }, []);

  const updateMoveEnd: MoveEventActions["updateMoveEnd"] = useCallback(
    (moveEndDate: Date) => {
      if (!isEventMoving || !moveEventPreview) {
        return;
      }

      setState((prev) => ({
        ...prev,
        moveEventPreview: { ...moveEventPreview, dragEndDate: moveEndDate },
      }));
    },
    [isEventMoving, moveEventPreview],
  );

  const move: MoveEventActions["move"] = useCallback(() => {
    if (!moveEventPreview) {
      return;
    }

    const updatedEvent = getEventFromMoveEventPreview(moveEventPreview);
    updateEventMutation.mutate(updatedEvent, {
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
    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        move();
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [move]);

  const value: MoveEventContext = useMemo(
    () => ({
      isEventMoving,
      moveEventPreview,
      moveEventActions: { startMove, updateMoveEnd, move },
    }),
    [isEventMoving, move, moveEventPreview, startMove, updateMoveEnd],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
