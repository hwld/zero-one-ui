export const Routes = {
  base: () => "/todoist" as const,
  task: (id?: string) => `${Routes.base()}/task${id ? `?id=${id}` : ""}` as const,
  inbox: () => `${Routes.base()}/inbox` as const,
  today: () => `${Routes.base()}/today` as const,
  upcoming: () => `${Routes.base()}/upcoming` as const,
  filtersLabels: () => `${Routes.base()}/filters-labels` as const,
  projectList: () => `${Routes.base()}/project-list` as const,
  project: (id?: string) => `${Routes.base()}/projects${id ? `?id=${id}` : ""}` as const,
} as const;
