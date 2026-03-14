import React, { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { errorIfProduction } from "../../../_test/utils";

export type TaskTableSelectionContext = {
  selectedTaskIds: string[];

  selectTaskIds: (ids: string[]) => void;
  unselectTaskIds: (ids: string[]) => void;
  toggleTaskSelection: (id: string) => void;
  unselectAllTasks: () => void;
};

const TaskTableSelectionContext = createContext<TaskTableSelectionContext | undefined>(undefined);

export const TaskTableSelectionProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const value = useMemo((): TaskTableSelectionContext => {
    return {
      selectedTaskIds,

      selectTaskIds: (ids) => {
        setSelectedTaskIds((prev) => {
          return Array.from(new Set([...prev, ...ids]));
        });
      },

      unselectTaskIds: (ids) => {
        setSelectedTaskIds((selectedIds) => {
          return selectedIds.filter((selectedId) => {
            return !ids.includes(selectedId);
          });
        });
      },

      toggleTaskSelection: (id) => {
        setSelectedTaskIds((st) => {
          if (st.includes(id)) {
            return st.filter((i) => i !== id);
          }
          return [...st, id];
        });
      },

      unselectAllTasks: () => {
        setSelectedTaskIds([]);
      },
    };
  }, [selectedTaskIds]);

  return (
    <TaskTableSelectionContext.Provider value={value}>
      {children}
    </TaskTableSelectionContext.Provider>
  );
};

export const useTaskTableSelection = () => {
  const ctx = useContext(TaskTableSelectionContext);
  if (!ctx) {
    throw new Error(`${TaskTableSelectionProvider.name}が存在しません`);
  }
  return ctx;
};

export const MockTaskTableSelectionProvider: React.FC<
  PropsWithChildren & { value?: TaskTableSelectionContext }
> = ({ children, value }) => {
  errorIfProduction();

  if (!value) {
    return <TaskTableSelectionProvider>{children}</TaskTableSelectionProvider>;
  }

  return (
    <TaskTableSelectionContext.Provider value={value}>
      {children}
    </TaskTableSelectionContext.Provider>
  );
};
