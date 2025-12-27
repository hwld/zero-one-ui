import type { ReactNode } from "react";
import type { Task } from "../../_backend/task/model";
import { TaskFormOpenButton } from "../../_features/task/task-form-open-button";
import { TaskListItem } from "../../_features/task/task-list-item/task-list-item";
import { PiWarningCircle } from "@react-icons/all-files/pi/PiWarningCircle";
import type React from "react";
import { AnimatePresence, motion } from "motion/react";
import { PiSpinnerGap } from "@react-icons/all-files/pi/PiSpinnerGap";

type Props = {
  status: "pending" | "error" | "success";
  taskbox: { tasks: Task[]; taskboxId: string } | undefined;
  emptyContent?: ReactNode;
  errorMessage: string;
};

export const TasksContent: React.FC<Props> = ({
  emptyContent,
  status,
  taskbox,
  errorMessage,
}) => {
  if (status === "error") {
    return (
      <div className="flex flex-col gap-2 text-red-600">
        <PiWarningCircle className="size-8" />
        <p>
          {errorMessage}
          <br />
          ※このアプリでは、更新すると作成したデータは削除されます。
        </p>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {status === "pending" ? (
          <motion.div
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PiSpinnerGap className="size-8 animate-spin" />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {taskbox ? (
        <TasksMainContent
          tasks={taskbox.tasks}
          taskboxId={taskbox.taskboxId}
          emptyContent={emptyContent}
        />
      ) : null}
    </>
  );
};

const TasksMainContent: React.FC<{
  tasks: Task[];
  taskboxId: string;
  emptyContent: ReactNode;
}> = ({ tasks, taskboxId, emptyContent }) => {
  const isEmpty = tasks.length === 0;

  const doneTasks = tasks.filter((t) => t.done);
  const undoneTasks = tasks.filter((t) => !t.done);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        {undoneTasks?.map((t) => {
          return <TaskListItem key={t.id} task={t} />;
        })}
      </div>
      <TaskFormOpenButton taskboxId={taskboxId} />
      <div className="flex flex-col gap-2">
        {doneTasks?.map((t) => {
          return <TaskListItem key={t.id} task={t} />;
        })}
      </div>
      {isEmpty ? emptyContent : null}
    </div>
  );
};
