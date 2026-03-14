import { createContext, useContext, type ReactNode } from "react";
import type { TaskboxNodes } from "./taskbox";

const TaskboxNodesContext = createContext<TaskboxNodes | undefined>(undefined);

export const TaskboxNodesProvider: React.FC<{
  taskboxNodes: TaskboxNodes;
  children: ReactNode;
}> = ({ taskboxNodes, children }) => {
  return (
    <TaskboxNodesContext.Provider value={taskboxNodes}>{children}</TaskboxNodesContext.Provider>
  );
};

export const useTaskboxNodes = () => {
  const ctx = useContext(TaskboxNodesContext);
  if (!ctx) {
    throw new Error("TaskboxNodeProviderが存在しません");
  }

  return ctx;
};
