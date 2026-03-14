import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../_components/toast/use-toast";
import { UpdateTaskInput, updateTask } from "../_backend/task/api";
import { taskQueryOption } from "./use-task";

export const useUpdateTask = () => {
  const client = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: UpdateTaskInput & { id: string }) => {
      return updateTask(input);
    },
    onError: () => {
      toast({
        variant: "error",
        description: "タスクを更新することができませんでした。もう一度試してみてください。",
      });
    },
    onMutate: async (input) => {
      await client.cancelQueries();
      client.setQueryData(taskQueryOption(input.id).queryKey, (task) => {
        if (!task) {
          return task;
        }

        return { ...task, title: input.title, comment: input.comment };
      });
    },
  });
};
