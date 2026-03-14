export const TodoistAPI = {
  base: "/todoist/api",

  taskboxes: () => `${TodoistAPI.base}/taskboxes` as const,

  inbox: () => `${TodoistAPI.base}/inbox` as const,

  projects: () => `${TodoistAPI.base}/projects` as const,
  project: (id?: string) => `${TodoistAPI.projects()}/${id ?? ":id"}` as const,
  changeProjectPosition: () => `${TodoistAPI.projects()}/change-position` as const,

  tasks: () => `${TodoistAPI.base}/tasks` as const,
  task: (id?: string) => `${TodoistAPI.tasks()}/${id ?? ":id"}` as const,
  updateTaskDone: (id?: string) => `${TodoistAPI.task(id)}/update-task-done` as const,
} as const;
