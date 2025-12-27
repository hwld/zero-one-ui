import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MoveTaskInput, View, moveTask } from "../_backend/view/api";
import { useToast } from "../_components/toast/use-toast";
import { viewQueryOption } from "./use-view";

export const useMoveTask = () => {
  const client = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: MoveTaskInput & { viewId: string }) => {
      return moveTask(input);
    },
    onError: () => {
      toast({
        variant: "error",
        description:
          "タスクを移動することができませんでした。もう一度試してみてください。",
      });
    },
    onMutate: async (input) => {
      await client.cancelQueries();
      client.setQueryData(viewQueryOption(input.viewId).queryKey, (view) => {
        if (!view) {
          return view;
        }

        const targetTask = view.columns
          .flatMap((c) => c.tasks)
          .find((t) => t.id === input.taskId);

        const taskDeletedView: View = {
          ...view,
          columns: view.columns.map((column) => {
            return {
              ...column,
              tasks: column.tasks.filter((task) => {
                return task.taskId !== input.taskId;
              }),
            };
          }),
        };

        return {
          ...taskDeletedView,
          columns: taskDeletedView.columns.map((column) => {
            if (column.statusId !== input.statusId) {
              return column;
            }

            if (!targetTask) {
              throw new Error("存在しないタスク");
            }

            const tasks = [
              ...column.tasks,
              { ...targetTask, order: input.newOrder },
            ].sort((a, b) => a.order - b.order);

            return { ...column, tasks };
          }),
        } satisfies View;
      });
    },
  });
};
