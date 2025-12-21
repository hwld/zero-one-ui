import { PiDotsSixVerticalBold } from "@react-icons/all-files/pi/PiDotsSixVerticalBold";
import { PiCaretRight } from "@react-icons/all-files/pi/PiCaretRight";
import { PiPencilSimpleLineLight } from "@react-icons/all-files/pi/PiPencilSimpleLineLight";
import { PiCalendarPlusLight } from "@react-icons/all-files/pi/PiCalendarPlusLight";
import { PiChatLight } from "@react-icons/all-files/pi/PiChatLight";
import { useState } from "react";
import type { Task } from "../../../_backend/task/model";
import { useUpdateTaskDone } from "../use-update-task-done";
import { TaskUpdateForm } from "./update-form";
import { Tooltip, TooltipDelayGroup } from "../../../_components/tooltip";
import { ActionButton } from "./action-button";
import { TaskListItemMenu } from "./menu";
import { TaskCheckbox } from "../task-checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Routes } from "../../../routes";
import { stopPropagation } from "../../../../../lib/utils";

type Props = { task: Task };

export const TaskListItem: React.FC<Props> = ({ task }) => {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  const updateTaskDone = useUpdateTaskDone();

  const handleUpdateTaskDone = () => {
    updateTaskDone.mutate({
      id: task.id,
      done: !task.done,
      taskboxId: task.taskboxId,
    });
  };

  if (isEditing) {
    return <TaskUpdateForm task={task} onClose={() => setIsEditing(false)} />;
  }

  return (
    <TooltipDelayGroup>
      <div
        key={task.id}
        className="group relative grid min-w-0 cursor-pointer grid-cols-[auto_1fr] gap-2 border-b border-stone-200 pr-5"
        onClick={() => {
          router.push(Routes.task(task.id), { scroll: false });
        }}
      >
        <div
          className="absolute right-full mr-1 flex items-center pt-[9px]"
          onClick={stopPropagation}
        >
          <div className="opacity-0 transition-all group-hover:opacity-100">
            <ActionButton
              size="sm"
              icon={PiDotsSixVerticalBold}
              tabIndex={-1}
            />
          </div>
          {task.subTasks.length > 0 && (
            <Tooltip label="サブタスクを広げる" placement="top">
              <ActionButton size="sm" icon={PiCaretRight} />
            </Tooltip>
          )}
        </div>

        <div className="pt-[10px]">
          <TaskCheckbox
            checked={task.done}
            onChange={handleUpdateTaskDone}
            onClick={stopPropagation}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1 py-2">
          <Link
            href={Routes.task(task.id)}
            onClick={stopPropagation}
            className="break-all"
            scroll={false}
          >
            {task.title}
          </Link>
          <div className="truncate text-xs text-stone-500">
            {task.description}
          </div>
        </div>

        <div
          className="absolute right-0 flex items-center gap-1 bg-stone-50 opacity-0 transition-all group-hover:opacity-100 has-focus:opacity-100 has-data-open:opacity-100"
          onClick={stopPropagation}
        >
          {!task.done && (
            <>
              <Tooltip placement="top" label="タスクを編集" keys={["Cmd", "E"]}>
                <ActionButton
                  icon={PiPencilSimpleLineLight}
                  onClick={() => setIsEditing(true)}
                />
              </Tooltip>
              <Tooltip placement="top" label="予定日を設定" keys={["T"]}>
                <ActionButton icon={PiCalendarPlusLight} />
              </Tooltip>
            </>
          )}
          <Tooltip placement="top" label="タスクにコメント" keys={["C"]}>
            <ActionButton icon={PiChatLight} />
          </Tooltip>
          <Tooltip placement="top" label="その他のアクション" keys={["."]}>
            <TaskListItemMenu taskId={task.id} taskboxId={task.taskboxId} />
          </Tooltip>
        </div>
      </div>
    </TooltipDelayGroup>
  );
};
