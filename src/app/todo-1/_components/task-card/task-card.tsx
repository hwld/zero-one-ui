import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";
import {
  CheckIcon,
  PanelRightOpenIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { TaskEditableTitle } from "../task-editable-title";
import { TaskCardButton } from "./task-card-button";
import { TaskDeleteConfirmDialog } from "../task-delete-confirm-dialog";
import { Task } from "../../_backend/task-store";
import { useUpdateTask } from "../../_queries/use-update-task";
import { useDeleteTask } from "../../_queries/use-delete-task";
import { TaskCardLink } from "./task-card-link";
import { Card } from "../card";

export const TaskCard: React.FC<{
  task: Task;
}> = ({ task }) => {
  const [editable, setEditable] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleUpdateTaskDone = () => {
    updateTaskMutation.mutate({ ...task, done: !task.done });
  };

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id);
  };

  const titleInputRef = useRef<HTMLInputElement>(null);
  return (
    <Card>
      <div className="flex w-full items-center justify-between gap-1">
        <div className="flex w-full items-center gap-2">
          <div className="relative flex size-[25px] shrink-0 cursor-pointer items-center justify-center">
            <AnimatePresence initial={false}>
              {task.done && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-neutral-900"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: 1.4,
                    opacity: 0,
                  }}
                />
              )}
            </AnimatePresence>
            <input
              id={task.id}
              aria-label="完了状態を変更"
              type="checkbox"
              className="peer absolute size-[25px] cursor-pointer appearance-none rounded-full border-2 border-neutral-300"
              checked={task.done}
              onChange={handleUpdateTaskDone}
            ></input>
            <div
              className={clsx(
                "pointer-events-none absolute inset-0 flex origin-[50%_70%] items-center justify-center rounded-full bg-neutral-900 text-neutral-100 transition-all duration-200 ease-in-out",
                task.done ? "opacity-100" : "opacity-0"
              )}
            >
              <CheckIcon size="80%" />
            </div>
          </div>
          <TaskEditableTitle
            key={`${task.title}-${editable}`}
            ref={titleInputRef}
            task={task}
            editable={editable}
            onChangeEditable={setEditable}
            onChangeTitle={(title) => {
              updateTaskMutation.mutate({ ...task, title });
            }}
          />
        </div>
        <div className="flex gap-1">
          <TaskCardButton
            aria-label="タイトルを編集"
            icon={<PencilIcon />}
            onClick={() => {
              setEditable((s) => !s);
              setTimeout(() => {
                titleInputRef.current?.focus();
              }, 0);
            }}
          />
          <TaskCardLink
            href={`/todo-1/detail?id=${task.id}`}
            icon={<PanelRightOpenIcon />}
          />
          <TaskCardButton
            aria-label="削除ダイアログを開く"
            onClick={() => setIsConfirmDeleteOpen(true)}
            icon={<TrashIcon />}
          />
          <TaskDeleteConfirmDialog
            task={task}
            isOpen={isConfirmDeleteOpen}
            onOpenChange={setIsConfirmDeleteOpen}
            onConfirm={handleDeleteTask}
            isDeleting={deleteTaskMutation.isPending}
          />
        </div>
      </div>
    </Card>
  );
};
