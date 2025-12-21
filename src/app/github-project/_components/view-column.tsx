import clsx from "clsx";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { ViewColumn as ViewColumnData } from "../_backend/view/api";
import { CountBadge } from "./count-badge";
import { TaskStatusIcon } from "./task-status-icon";
import { ViewColumnMenuTrigger } from "./view-column-menu-trigger";
import { DRAG_TYPE } from "../consts";
import { DropPreviewLine } from "./drop-preview-line";
import { useMoveColumn } from "../_queries/use-move-column";
import { ViewTaskCardList } from "./view-task-card-list";

type Props = {
  viewId: string;
  allColumns: ViewColumnData[];
  column: ViewColumnData;
  onClickAddItem: (statusId: string) => void;
  onMoveToColumn: (input: { taskId: string; statusId: string }) => void;
  previousOrder: number;
  nextOrder: number;
  acceptBottomDrop?: boolean;
  onSetScrollBottomRef: (statusId: string, element: HTMLDivElement) => void;
  addingColumnId: string | null;
};

export const ViewColumn: React.FC<Props> = ({
  viewId,
  allColumns,
  column,
  onClickAddItem,
  onMoveToColumn,
  previousOrder,
  nextOrder,
  acceptBottomDrop = false,
  onSetScrollBottomRef,
  addingColumnId,
}) => {
  const [acceptDrop, setAcceptDrop] = useState<"none" | "left" | "right">(
    "none",
  );
  const moveColumnMutation = useMoveColumn();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE.column)) {
      e.preventDefault();
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = (rect.left + rect.right) / 2;
      setAcceptDrop(e.clientX <= midpoint ? "left" : "right");
    }
  };

  const handleDragLeave = () => {
    setAcceptDrop("none");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes(DRAG_TYPE.column)) {
      e.stopPropagation();

      const data = JSON.parse(e.dataTransfer.getData(DRAG_TYPE.column));
      const statusId = z.string().parse(data.statusId);

      const droppedOrder = acceptDrop === "left" ? previousOrder : nextOrder;
      const newOrder = (droppedOrder + column.order) / 2;

      moveColumnMutation.mutate({ viewId, statusId, newOrder });
    }
    setAcceptDrop("none");
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      DRAG_TYPE.column,
      JSON.stringify({ statusId: column.statusId }),
    );
  };

  const handleSetScrollBottomRef = (e: HTMLDivElement) => {
    onSetScrollBottomRef(column.statusId, e);
  };

  const handleClickAddItem = () => {
    onClickAddItem(column.statusId);
  };

  return (
    <div
      className="relative h-full px-[3px]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {acceptDrop !== "none" && (
        <DropPreviewLine
          align="vertical"
          className={clsx(
            acceptDrop === "left" && "left-[-2px]",
            (acceptDrop === "right" || acceptBottomDrop) && "right-[-2px]",
          )}
        />
      )}
      <div
        className={clsx(
          "flex h-full w-[350px] shrink-0 cursor-grab flex-col rounded-lg border border-neutral-600 bg-neutral-900",
        )}
        draggable
        onDragStart={handleDragStart}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <TaskStatusIcon color={column.status.color} />
            <div className="font-bold">{column.status.name}</div>
            <CountBadge count={column.tasks.length} />
          </div>
          <div className="flex items-center">
            <ViewColumnMenuTrigger status={column.status}>
              <button className="grid size-6 place-items-center rounded-md text-neutral-400 transition-colors hover:bg-white/15">
                <MoreHorizontalIcon size={20} />
              </button>
            </ViewColumnMenuTrigger>
          </div>
        </div>
        <div className="px-4 pb-2 text-sm text-neutral-400">
          {column.status.description}
        </div>
        <ViewTaskCardList
          isAddingTask={addingColumnId === column.statusId}
          viewId={viewId}
          allColumns={allColumns}
          onMoveToColumn={onMoveToColumn}
          tasks={column.tasks}
          statusId={column.statusId}
          onSetScrollBottomRef={handleSetScrollBottomRef}
        />
        <div className="grid place-items-center p-2">
          <button
            className="flex w-full items-center gap-1 rounded-md px-4 py-2 text-neutral-300 transition-colors hover:bg-white/15"
            onClick={handleClickAddItem}
          >
            <PlusIcon size={16} />
            <span className="text-sm">Add Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
