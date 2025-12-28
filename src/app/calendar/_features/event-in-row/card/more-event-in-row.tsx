import { EventInRowCardBase } from "./base";

type Props = {
  count: number;
  limit: number;
  height: number;
  eventsRowCols: number;
  disablePointerEvents: boolean;
  displayStartCol: number;
  topMargin?: number;
  onClick?: () => void;
};

export const MoreEventInrowCard: React.FC<Props> = ({
  count,
  limit,
  height,
  eventsRowCols,
  disablePointerEvents,
  displayStartCol,
  topMargin,
  onClick,
}) => {
  return (
    <EventInRowCardBase
      height={height}
      disablePointerEvents={disablePointerEvents}
      top={limit}
      displayStartCol={displayStartCol}
      eventsRowCols={eventsRowCols}
      eventCols={1}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={onClick}
      topMargin={topMargin}
    >
      <div className="flex size-full items-center rounded-sm px-1 text-xs text-neutral-700 ring-blue-500 transition-colors hover:bg-neutral-900/10">
        他<span className="mx-1">{count}</span>件
      </div>
    </EventInRowCardBase>
  );
};
