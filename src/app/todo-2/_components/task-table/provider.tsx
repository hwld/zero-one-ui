import { PropsWithChildren } from "react";
import {
  TaskTablePagingContext,
  TaskTablePagingProvider,
  MockTaskTablePagingProvider,
} from "./paging-provider";
import {
  MockTaskTableSelectionProvider,
  TaskTableSelectionContext,
  TaskTableSelectionProvider,
} from "./selection-provider";
import {
  MockTaskTableFilterProvider,
  TaskTableFilterContext,
  TaskTableFilterProvider,
} from "./filter-provider";
import {
  MockTaskTableSortProvider,
  TaskTableSortContext,
  TaskTableSortProvider,
} from "./sort-provider";
import {
  MockTaskTableSearchProvider,
  TaskTableSearchContext,
  TaskTableSearchProvider,
} from "./search-provider";
import { errorIfProduction } from "../../../_test/utils";

export const TaskTableProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TaskTablePagingProvider>
      <TaskTableSearchProvider>
        <TaskTableFilterProvider>
          <TaskTableSortProvider>
            <TaskTableSelectionProvider>{children}</TaskTableSelectionProvider>
          </TaskTableSortProvider>
        </TaskTableFilterProvider>
      </TaskTableSearchProvider>
    </TaskTablePagingProvider>
  );
};

type MockTaskTableProviderProps = {
  mockPaging?: TaskTablePagingContext;
  mockFilter?: TaskTableFilterContext;
  mockSearch?: TaskTableSearchContext;
  mockSort?: TaskTableSortContext;
  mockSelection?: TaskTableSelectionContext;
} & PropsWithChildren;

export const MockTaskTableProvider: React.FC<MockTaskTableProviderProps> = ({
  mockPaging,
  mockFilter,
  mockSearch,
  mockSort,
  mockSelection,
  children,
}) => {
  errorIfProduction();

  return (
    <MockTaskTablePagingProvider value={mockPaging}>
      <MockTaskTableSearchProvider value={mockSearch}>
        <MockTaskTableFilterProvider value={mockFilter}>
          <MockTaskTableSortProvider value={mockSort}>
            <MockTaskTableSelectionProvider value={mockSelection}>
              {children}
            </MockTaskTableSelectionProvider>
          </MockTaskTableSortProvider>
        </MockTaskTableFilterProvider>
      </MockTaskTableSearchProvider>
    </MockTaskTablePagingProvider>
  );
};
