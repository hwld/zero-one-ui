export const GitHubProjectAPI = {
  base: "/github-project/api",
  views: () => `${GitHubProjectAPI.base}/views` as const,
  view: (id?: string) => `${GitHubProjectAPI.views()}/${id ?? ":id"}` as const,
  moveTask: (viewId?: string) => `${GitHubProjectAPI.view(viewId)}/move-task` as const,
  moveColumn: (viewId?: string) => `${GitHubProjectAPI.view(viewId)}/move-column`,
  tasks: () => `${GitHubProjectAPI.base}/tasks` as const,
  task: (id?: string) => `${GitHubProjectAPI.tasks()}/${id ?? ":id"}` as const,
  allTaskStatus: () => `${GitHubProjectAPI.base}/all-task-status` as const,
} as const;
