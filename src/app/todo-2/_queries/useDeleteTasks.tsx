import { useMutation } from "@tanstack/react-query";
import { deleteTasks } from "../_mocks/api";
import { useTaskAction } from "../_contexts/tasks-provider";

export const useDeleteTasks = () => {
  const { unselectTaskIds } = useTaskAction();

  return useMutation({
    mutationFn: (ids: string[]) => {
      return deleteTasks(ids);
    },
    onSuccess: (_, ids) => {
      unselectTaskIds(ids);
    },
  });
};
