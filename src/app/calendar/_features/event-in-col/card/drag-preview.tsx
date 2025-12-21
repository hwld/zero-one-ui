import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { EventInCol } from "../type";
import { getTopFromDate, getHeightFromInterval } from "../utils";
import { EventInColCardBase, EventInColCardContent } from "./base";

type Props = {
  date: Date;
  event: EventInCol;
};

export const DragPreviewEventInColCard = forwardRef<HTMLButtonElement, Props>(
  function DragPreviewEventInColCard({ date, event }, ref) {
    const style = useMemo(() => {
      const top = event && getTopFromDate(event, date);
      const height = event && getHeightFromInterval(event, date);

      return { top, height, width: "100%" };
    }, [date, event]);

    return (
      <EventInColCardBase
        ref={ref}
        className={clsx("pointer-events-none z-30 bg-neutral-900 ring-3")}
        style={style}
      >
        {event && <EventInColCardContent event={event} />}
      </EventInColCardBase>
    );
  },
);
