import { useMutation } from "@tanstack/react-query";
import { useToast } from "../_components/toast/use-toast";
import { CreateViewInput, createView } from "../_backend/view/api";

export const useCreateView = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: CreateViewInput) => {
      return createView(input);
    },

    onError: () => {
      toast({
        variant: "error",
        description: "ビューを作成することができませんでした。もう一度試してみてください。",
      });
    },
  });
};
