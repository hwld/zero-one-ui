import clsx from "clsx";
import { MoreHorizontalIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { ViewColumn, ViewTask } from "../../_backend/view/api";
import { DropdownMultiContent } from "../dropdown/content";
import { DropdownProvider } from "../dropdown/provider";
import { DropdownTrigger } from "../dropdown/trigger";
import { ViewTaskCardMenu } from "./menu";
import { TaskStatusSelectionMenu } from "./task-status-selection-menu/menu";

type ViewTaskMenuMode = "close" | "main" | "moveToColumn";

type Props = {
  columns: ViewColumn[];
  task: ViewTask;
  onMoveToColumn: (statusId: string) => void;
  onMoveTop: (() => void) | undefined;
  onMoveBottom: (() => void) | undefined;
};

export const ViewTaskMenuTrigger: React.FC<Props> = ({
  task,
  columns,
  onMoveTop,
  onMoveBottom,
  onMoveToColumn,
}) => {
  const [mode, setMode] = useState<ViewTaskMenuMode>("close");

  const contents = useMemo(() => {
    const handleMoveTop = onMoveTop
      ? () => {
          onMoveTop();
          setMode("close");
        }
      : undefined;

    const handleMoveBottom = onMoveBottom
      ? () => {
          onMoveBottom();
          setMode("close");
        }
      : undefined;

    return {
      close: null,
      main: (
        <ViewTaskCardMenu
          task={task}
          onOpenMoveToColumnMenu={() => setMode("moveToColumn")}
          onMoveTop={handleMoveTop}
          onMoveBottom={handleMoveBottom}
        />
      ),
      moveToColumn: (
        <TaskStatusSelectionMenu
          placeHolder="Column..."
          allStatus={columns.map((c) => c.status)}
          currentStatus={task.status}
          onBack={() => setMode("main")}
          onClose={() => setMode("close")}
          onSelect={onMoveToColumn}
        />
      ),
    };
  }, [columns, onMoveBottom, onMoveToColumn, onMoveTop, task]);

  const isOpen = mode !== "close";
  const handleOpenChang = (open: boolean) => {
    if (open) {
      setMode("main");
    } else {
      setMode("close");
    }
  };

  const handleEscapeKeydown = () => {
    if (mode === "moveToColumn") {
      setMode("main");
    } else {
      setMode("close");
    }
  };

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={handleOpenChang}>
      <DropdownTrigger>
        <button
          key="trigger"
          className={clsx(
            "grid size-5 place-items-center rounded-sm transition-all hover:bg-white/15 focus:bg-white/15 focus:opacity-100 focus-visible:bg-white/15 focus-visible:opacity-100",
            mode != "close"
              ? "bg-white/15 opacity-100"
              : "opacity-0 group-hover:opacity-100",
          )}
        >
          <MoreHorizontalIcon size={18} />
        </button>
      </DropdownTrigger>
      <DropdownMultiContent
        mode={mode}
        contents={contents}
        onEscapeKeydown={handleEscapeKeydown}
      ></DropdownMultiContent>
    </DropdownProvider>
  );
};
