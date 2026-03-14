import { initialStatuses } from "../task-status/data";
import { Task } from "./store";

const taskCounts = [10, 3, 0, 20];
export const initialTasks: Task[] = initialStatuses.flatMap((status, statusIndex) => {
  return [...new Array(taskCounts[statusIndex] ?? 0)].map((_, i): Task => {
    return {
      id: `${statusIndex}-${i}`,
      title: `task${i + 1}`,
      comment: "",
      status,
    };
  });
});
