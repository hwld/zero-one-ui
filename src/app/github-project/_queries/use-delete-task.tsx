import { useMutation } from "@tanstack/react-query";
import { deleteTask } from "../_backend/task/api";
import { useToast } from "../_components/toast/use-toast";

export const useDeleteTask = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteTask(id);
    },
    onError: () => {
      toast({
        variant: "error",
        description: "タスクを削除することができませんでした。もう一度試してみてください。",
      });
    },
  });
};
