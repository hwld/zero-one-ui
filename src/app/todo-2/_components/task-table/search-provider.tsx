import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { useTaskTablePaging } from "./paging-provider";
import { errorIfProduction } from "../../../_test/utils";

export type TaskTableSearchContext = {
  searchText: string;
  search: (text: string) => void;
};

const TaskTableSearchContext = createContext<TaskTableSearchContext | undefined>(undefined);

export const TaskTableSearchProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { setPage } = useTaskTablePaging();
  const [searchText, setSefarchText] = useState<string>("");

  const value = useMemo((): TaskTableSearchContext => {
    return {
      searchText,
      search: (text) => {
        setSefarchText(text);
        setPage(1);
      },
    };
  }, [searchText, setPage]);

  return (
    <TaskTableSearchContext.Provider value={value}>{children}</TaskTableSearchContext.Provider>
  );
};

export const useTaskTableSearch = () => {
  const ctx = useContext(TaskTableSearchContext);
  if (!ctx) {
    throw new Error(`${TaskTableSearchProvider.name}が存在しません`);
  }

  return ctx;
};

export const MockTaskTableSearchProvider: React.FC<
  { value?: TaskTableSearchContext } & PropsWithChildren
> = ({ value, children }) => {
  errorIfProduction();

  if (!value) {
    return <TaskTableSearchProvider>{children}</TaskTableSearchProvider>;
  }

  return (
    <TaskTableSearchContext.Provider value={value}>{children}</TaskTableSearchContext.Provider>
  );
};
