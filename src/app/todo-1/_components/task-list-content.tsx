import { AnimatePresence, motion } from "motion/react";
import { TaskListEmpty } from "./task-list-empty";
import { TaskListError } from "./task-list-error";
import { TaskListLoading } from "./task-list-loading";
import { TaskCard } from "./task-card/task-card";
import { useMemo } from "react";
import { Task } from "../_backend/models";
import { UseQueryResult } from "@tanstack/react-query";

type Props = { tasks: Task[]; status: UseQueryResult["status"] };
export const TaskListContent: React.FC<Props> = ({ tasks, status }) => {
  const content = useMemo(() => {
    if (status === "error") {
      return (
        <div className="absolute w-full">
          <TaskListError />
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="absolute w-full">
          <TaskListLoading />
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="absolute w-full">
          <TaskListEmpty />
        </div>
      );
    }

    return tasks.map((task) => {
      return (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <TaskCard key={task.id} task={task} />
        </motion.div>
      );
    });
  }, [tasks, status]);

  return (
    <div className="flex flex-col gap-1">
      <AnimatePresence mode="popLayout" initial={false}>
        {content}
      </AnimatePresence>
    </div>
  );
};
