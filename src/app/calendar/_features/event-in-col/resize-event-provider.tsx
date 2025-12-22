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
import { ResizeEventInColPreview } from "./type";
import { EventInCol } from "./type";
import { useUpdateEvent } from "../event/use-update-event";
import { isAfter, isBefore, isSameMinute } from "date-fns";
import { MouseHistory } from "../../utils";
import { getDateFromY } from "./utils";
import { useScrollableElement } from "./scrollable-provider";

type ResizeEventActions = {
  startResize: (params: {
    event: EventInCol;
    origin: ResizeEventInColPreview["origin"];
    y: number;
  }) => void;
  scroll: (scrollTop: number) => void;
  updateResizeDest: (day: Date, y: number) => void;
  resize: () => void;
};

type ResizeEventContext = {
  isEventResizing: boolean;
  resizeEventPreview: ResizeEventInColPreview | undefined;
  resizeEventActions: ResizeEventActions;
};

const Context = createContext<ResizeEventContext | undefined>(undefined);

export const useResizeEventInCol = (): ResizeEventContext => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${ResizeEventInColProvider.name}が存在しません`);
  }
  return ctx;
};

export const ResizeEventInColProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { scrollableElement } = useScrollableElement();
  const updateEventMutation = useUpdateEvent();

  const [state, setState] = useState<{
    isEventResizing: boolean;
    resizeEventPreview: ResizeEventInColPreview | undefined;
  }>({ isEventResizing: false, resizeEventPreview: undefined });

  const { resizeEventPreview, isEventResizing } = state;

  const mouseHistoryRef = useRef<MouseHistory>(undefined);

  const startResize: ResizeEventActions["startResize"] = useCallback(
    ({ event, origin, y }) => {
      if (scrollableElement) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElement.scrollTop,
        };
      }

      setState({
        isEventResizing: true,
        resizeEventPreview: {
          ...event,
          origin,
          updatedAt: Date.now(),
        },
      });
    },
    [scrollableElement],
  );

  const updateResizeDest: ResizeEventActions["updateResizeDest"] = useCallback(
    (day, y) => {
      if (scrollableElement) {
        mouseHistoryRef.current = {
          prevY: y,
          prevScrollTop: scrollableElement.scrollTop,
        };
      }

      const resizeDest = getDateFromY(day, y);

      if (!isEventResizing || !resizeEventPreview) {
        return;
      }

      switch (resizeEventPreview.origin) {
        case "eventStart": {
          if (isSameMinute(resizeEventPreview.start, resizeDest)) {
            return;
          }

          if (isBefore(resizeDest, resizeEventPreview.start)) {
            setState((prev) => ({
              ...prev,
              resizeEventPreview: {
                ...resizeEventPreview,
                origin: "eventEnd",
                start: resizeDest,
                end: resizeEventPreview.start,
                updatedAt: Date.now(),
              },
            }));
          } else {
            setState((prev) => ({
              ...prev,
              resizeEventPreview: {
                ...resizeEventPreview,
                end: resizeDest,
                updatedAt: Date.now(),
              },
            }));
          }
          return;
        }
        case "eventEnd": {
          if (isSameMinute(resizeEventPreview.end, resizeDest)) {
            return;
          }

          if (isAfter(resizeDest, resizeEventPreview.end)) {
            setState((prev) => ({
              ...prev,
              resizeEventPreview: {
                ...resizeEventPreview,
                origin: "eventStart",
                start: resizeEventPreview.end,
                end: resizeDest,
                updatedAt: Date.now(),
              },
            }));
          } else {
            setState((prev) => ({
              ...prev,
              resizeEventPreview: {
                ...resizeEventPreview,
                start: resizeDest,
                updatedAt: Date.now(),
              },
            }));
          }
          return;
        }
        default: {
          throw new Error(resizeEventPreview.origin satisfies never);
        }
      }
    },
    [isEventResizing, resizeEventPreview, scrollableElement],
  );

  const scroll: ResizeEventActions["scroll"] = useCallback(
    (scrollTop) => {
      if (!isEventResizing || !resizeEventPreview || !mouseHistoryRef.current) {
        return;
      }

      const delta = scrollTop - mouseHistoryRef.current.prevScrollTop;
      const y = mouseHistoryRef.current.prevY + delta;

      updateResizeDest(
        resizeEventPreview.origin === "eventEnd"
          ? resizeEventPreview.start
          : resizeEventPreview.end,
        y,
      );
    },
    [isEventResizing, resizeEventPreview, updateResizeDest],
  );

  const resize: ResizeEventActions["resize"] = useCallback(() => {
    if (!resizeEventPreview) {
      return;
    }

    updateEventMutation.mutate(resizeEventPreview, {
      onSettled: () => {
        setState((prev) => {
          if (prev.isEventResizing) {
            return prev;
          }

          return { ...prev, resizeEventPreview: undefined };
        });
      },
    });
    setState((prev) => ({ ...prev, isEventResizing: false }));
  }, [resizeEventPreview, updateEventMutation]);

  useEffect(() => {
    const endResizeEvent = (e: MouseEvent) => {
      if (e.button === 0) {
        resize();
      }
    };

    document.addEventListener("mouseup", endResizeEvent);
    return () => {
      document.removeEventListener("mouseup", endResizeEvent);
    };
  }, [resize]);

  const value: ResizeEventContext = useMemo(() => {
    return {
      isEventResizing,
      resizeEventPreview,
      resizeEventActions: { startResize, updateResizeDest, scroll, resize },
    };
  }, [
    isEventResizing,
    resize,
    resizeEventPreview,
    scroll,
    startResize,
    updateResizeDest,
  ]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
