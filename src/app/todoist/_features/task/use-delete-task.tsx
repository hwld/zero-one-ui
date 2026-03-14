import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../../_backend/task/api";
import { projectQueryOptions } from "../project/use-project";
import { inboxQueryOptions } from "../inbox/use-inbox";

export const useDeleteTask = () => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, taskboxId: _ }: { taskId: string; taskboxId: string }) => {
      return deleteTask(taskId);
    },
    onMutate: async (input) => {
      const projectQuery = projectQueryOptions(input.taskboxId);
      const inboxQuery = inboxQueryOptions;

      await Promise.all([
        client.cancelQueries({ queryKey: projectQuery.queryKey }),
        client.cancelQueries({ queryKey: inboxQuery.queryKey }),
      ]);

      client.setQueryData(projectQuery.queryKey, (oldProject) => {
        if (!oldProject) {
          return undefined;
        }

        return {
          ...oldProject,
          tasks: oldProject.tasks.filter((t) => t.id !== input.taskId),
        };
      });

      client.setQueryData(inboxQuery.queryKey, (oldInbox) => {
        if (!oldInbox) {
          return undefined;
        }

        return {
          ...oldInbox,
          tasks: oldInbox.tasks.filter((t) => t.id !== input.taskId),
        };
      });
    },
  });
};
