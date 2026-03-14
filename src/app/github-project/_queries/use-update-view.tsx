import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateViewInput, updateView } from "../_backend/view/api";
import { useToast } from "../_components/toast/use-toast";
import { viewSummariesQueryOption } from "./use-view-summaries";

export const useUpdateView = () => {
  const client = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: UpdateViewInput & { id: string }) => {
      return updateView(input);
    },

    onMutate: async (input) => {
      await client.cancelQueries();

      client.setQueryData(viewSummariesQueryOption.queryKey, (views) => {
        if (!views) {
          return views;
        }

        return views.map((view) => {
          if (view.id !== input.id) {
            return view;
          }

          return { ...view, name: input.name };
        });
      });
    },

    onError: () => {
      toast({
        variant: "error",
        description: "ビューを更新することができませんでした。もう一度試してみてください。",
      });
    },
  });
};
