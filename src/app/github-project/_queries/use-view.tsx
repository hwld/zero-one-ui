import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchView } from "../_mocks/view/api";
import { useMswState } from "@/app/_providers/msw-provider";

export const viewQueryOption = (id: string) =>
  queryOptions({
    queryKey: ["views", id],
    queryFn: () => {
      return fetchView(id);
    },
  });

export const useView = (id?: string) => {
  const { isMockserverUp } = useMswState();

  return useQuery({
    ...viewQueryOption(id!),
    enabled: isMockserverUp && !!id,
  });
};
