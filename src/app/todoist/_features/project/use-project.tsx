import { queryOptions } from "@tanstack/react-query";
import { fetchProject } from "../../_backend/taskbox/project/api";
import { useQuery } from "@tanstack/react-query";

export const projectQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["projects", id],
    queryFn: () => {
      return fetchProject(id);
    },
  });

export const useProject = (id: string) => {
  return useQuery({
    ...projectQueryOptions(id),
  });
};
