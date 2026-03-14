import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { FieldFilter, SelectionFilter } from "../../_backend/api";
import { useTaskTablePaging } from "./paging-provider";
import { errorIfProduction } from "../../../_test/utils";

export type TaskTableFilterContext = {
  fieldFilters: FieldFilter[];
  selectionFilter: SelectionFilter;

  addFieldFilter: (filter: FieldFilter) => void;
  removeFieldFilter: (filterId: string) => void;
  setSelectionFilter: (filter: SelectionFilter) => void;
  removeAllFilter: () => void;
};

const TaskTableFilterContext = createContext<TaskTableFilterContext | undefined>(undefined);

export const TaskTableFilterProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { setPage } = useTaskTablePaging();

  const [fieldFilters, setFieldFilters] = useState<FieldFilter[]>([]);
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>(null);

  const value = useMemo((): TaskTableFilterContext => {
    return {
      fieldFilters,
      selectionFilter,

      addFieldFilter: (filter) => {
        setFieldFilters((f) => [...f, filter]);
        setPage(1);
      },

      removeFieldFilter: (id) => {
        setFieldFilters((filters) => filters.filter((f) => f.id !== id));
        setPage(1);
      },

      setSelectionFilter: (filter) => {
        setSelectionFilter(filter);
        setPage(1);
      },

      removeAllFilter: () => {
        setFieldFilters([]);
        setSelectionFilter(null);
        setPage(1);
      },
    };
  }, [fieldFilters, selectionFilter, setPage]);

  return (
    <TaskTableFilterContext.Provider value={value}>{children}</TaskTableFilterContext.Provider>
  );
};

export const useTaskTableFilter = () => {
  const ctx = useContext(TaskTableFilterContext);
  if (!ctx) {
    throw new Error(`${TaskTableFilterProvider.name}が存在しません`);
  }
  return ctx;
};

export const MockTaskTableFilterProvider: React.FC<
  { value?: TaskTableFilterContext } & PropsWithChildren
> = ({ value, children }) => {
  errorIfProduction();

  if (!value) {
    return <TaskTableFilterProvider>{children}</TaskTableFilterProvider>;
  }

  return (
    <TaskTableFilterContext.Provider value={value}>{children}</TaskTableFilterContext.Provider>
  );
};
