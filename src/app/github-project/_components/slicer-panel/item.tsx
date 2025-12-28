import clsx from "clsx";
import { ViewColumn } from "../../_backend/view/api";
import { TaskStatusIcon } from "../task-status-icon";
import { CountBadge } from "../count-badge";

type Props = {
  active?: boolean;
  column: ViewColumn;
};

export const SlicerListItem: React.FC<Props> = ({ active = false, column }) => {
  return (
    <li
      className={clsx(
        "relative w-full border-b border-neutral-600",
        active &&
          "before:absolute before:top-2 before:bottom-2 before:-left-3 before:w-1 before:rounded-full before:bg-blue-500 before:content-['']"
      )}
    >
      <button
        className={clsx(
          "flex w-full items-start justify-between rounded-md p-2 text-start transition-colors hover:bg-white/10",
          column.status.description ? "min-h-14" : ""
        )}
      >
        <div className="flex items-start gap-2">
          <TaskStatusIcon color={column.status.color} />
          <div className="flex flex-col items-start">
            <div className="text-sm">{column.status.name}</div>
            {column.status.description && (
              <div className="text-xs text-neutral-400">
                {column.status.description}
              </div>
            )}
          </div>
        </div>
        <CountBadge count={column.tasks.length} />
      </button>
    </li>
  );
};
