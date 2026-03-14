import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../_components/toast/use-toast";
import { MoveColumnInput, moveColumn } from "../_backend/view/api";
import { viewQueryOption } from "./use-view";

export const useMoveColumn = () => {
  const client = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: MoveColumnInput & { viewId: string }) => {
      return moveColumn(input);
    },
    onError: () => {
      toast({
        variant: "error",
        description: "列を移動することができませんでした。もう一度試してみてください。",
      });
    },
    onMutate: async (input) => {
      await client.cancelQueries();
      client.setQueryData(viewQueryOption(input.viewId).queryKey, (view) => {
        if (!view) {
          return view;
        }

        return {
          ...view,
          columns: [
            ...view.columns.map((column) => {
              if (column.statusId === input.statusId) {
                return { ...column, order: input.newOrder };
              }
              return column;
            }),
          ].sort((a, b) => a.order - b.order),
        };
      });
    },
  });
};
