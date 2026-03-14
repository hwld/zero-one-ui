import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { SortEntry } from "../../_backend/api";
import { useTaskTablePaging } from "./paging-provider";
import { errorIfProduction } from "../../../_test/utils";

export type TaskTableSortContext = {
  sortEntry: SortEntry;
  sort: (entry: SortEntry) => void;
};

const TaskTableSortContext = createContext<TaskTableSortContext | undefined>(undefined);

export const TaskTableSortProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { setPage } = useTaskTablePaging();

  const [sortEntry, setSortEntry] = useState<SortEntry>({
    field: "createdAt",
    order: "desc",
  });

  const value = useMemo((): TaskTableSortContext => {
    return {
      sortEntry,
      sort: (entry) => {
        setSortEntry(entry);
        setPage(1);
      },
    };
  }, [setPage, sortEntry]);

  return <TaskTableSortContext.Provider value={value}>{children}</TaskTableSortContext.Provider>;
};

export const useTaskTableSort = () => {
  const ctx = useContext(TaskTableSortContext);
  if (!ctx) {
    throw new Error(`${TaskTableSortProvider.name}が存在しません`);
  }
  return ctx;
};

export const MockTaskTableSortProvider: React.FC<
  { value?: TaskTableSortContext } & PropsWithChildren
> = ({ value, children }) => {
  errorIfProduction();

  if (!value) {
    return <TaskTableSortProvider>{children}</TaskTableSortProvider>;
  }

  return <TaskTableSortContext.Provider value={value}>{children}</TaskTableSortContext.Provider>;
};
