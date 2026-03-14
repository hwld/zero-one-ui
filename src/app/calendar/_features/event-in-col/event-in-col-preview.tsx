import { max, min } from "date-fns";
import { getHeightFromInterval, getTopFromDate } from "./utils";
import { DragDateRange } from "../../utils";

type Props = { eventCreationDragData: DragDateRange; date: Date };
export const EventInColPreview: React.FC<Props> = ({ eventCreationDragData, date }) => {
  const dragStartDate = eventCreationDragData.dragStartDate;
  const dragEndDate = eventCreationDragData.dragEndDate;

  const startDate = min([dragStartDate, dragEndDate]);
  const endDate = max([dragStartDate, dragEndDate]);

  const interval = { start: startDate, end: endDate };
  const top = getTopFromDate(interval, date);
  const height = getHeightFromInterval(interval, date);

  return <div className="absolute z-10 w-full bg-neutral-700/5" style={{ top, height }} />;
};
