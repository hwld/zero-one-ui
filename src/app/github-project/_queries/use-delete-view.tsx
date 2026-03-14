import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../_components/toast/use-toast";
import { deleteView } from "../_backend/view/api";
import { viewQueryOption } from "./use-view";
import { SlicerPanelWidthStorage } from "../_lib/slicer-panel-width-storage";

type UseDeleteViewArgs = {
  // 使用する側で、mutation.mutate(data, { onSuccess })使用すると、コンポーネントがアンマウントされたときに実行されない。
  // このhookでは、mutateを実行したあとに楽観的更新でviewSummariesから削除対象のviewを削除するので、すぐにアンマウントされる。
  // そのため、hookで外から受け取るようにする。
  // [参考](https://tanstack.com/query/latest/docs/framework/react/guides/mutations#mutation-side-effects)
  onSuccess?: () => void;
};

export const useDeleteView = ({ onSuccess }: UseDeleteViewArgs) => {
  const { toast } = useToast();
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return deleteView(id);
    },

    onSuccess: async (_, id) => {
      client.removeQueries({
        queryKey: viewQueryOption(id).queryKey,
        exact: true,
      });
      SlicerPanelWidthStorage.remove(id);
      onSuccess?.();
    },

    onError: () => {
      toast({
        variant: "error",
        description: "ビューを削除することができませんでした。もう一度試してみてください。",
      });
    },
  });
};
