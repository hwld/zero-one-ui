import { createContext, useContext, type ReactNode } from "react";
import type { Project } from "../../_backend/taskbox/project/model";

export type ProjectsContext = {
  projects: Project[];
  updateProjectsCache: (callback: (projects: Project[]) => Project[]) => void;
};
const ProjectsContext = createContext<ProjectsContext | undefined>(undefined);

export const ProjectsProvider: React.FC<{
  value: ProjectsContext;
  children: ReactNode;
}> = ({ value, children }) => {
  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
};

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    throw new Error("ProjectsProviderが存在しません");
  }

  return ctx;
};
