import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { useScrollableRoot } from "../../_providers/scrollable-root-provider";
import { errorIfProduction } from "../../../_test/utils";

export type TaskTablePagingContext = {
  page: number;
  limit: number;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const TaskTablePagingContext = createContext<TaskTablePagingContext | undefined>(undefined);

export const TaskTablePagingProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { scrollableRootRef } = useScrollableRoot();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const value = useMemo((): TaskTablePagingContext => {
    return {
      page,
      limit,
      setPage: (page) => {
        setPage(page);
        scrollableRootRef.current?.scrollTo(0, 0);
      },
      setLimit,
    };
  }, [limit, page, scrollableRootRef]);

  return (
    <TaskTablePagingContext.Provider value={value}>{children}</TaskTablePagingContext.Provider>
  );
};

export const useTaskTablePaging = () => {
  const ctx = useContext(TaskTablePagingContext);
  if (!ctx) {
    throw new Error(`${TaskTablePagingProvider.name}が存在しません`);
  }

  return ctx;
};

export const MockTaskTablePagingProvider: React.FC<
  { value?: TaskTablePagingContext } & PropsWithChildren
> = ({ children, value }) => {
  errorIfProduction();

  if (!value) {
    return <TaskTablePagingProvider>{children}</TaskTablePagingProvider>;
  }

  return (
    <TaskTablePagingContext.Provider value={value}>{children}</TaskTablePagingContext.Provider>
  );
};
