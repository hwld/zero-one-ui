"use client";

import { IconHome } from "@tabler/icons-react";
import { NextPage } from "next";
import { TaskTable } from "./_components/task-table/task-table";
import { TaskAddButton } from "./_components/task-add-button";
import { TaskTableFilter } from "./_components/task-table/filter";
import { TaskSearchForm } from "./_components/task-search-form";
import { TaskSelectionMenu } from "./_components/task-selection-menu/task-selection-menu";
import { Card } from "./_components/card";
import { usePaginatedTasks } from "./_queries/use-paginated-tasks";
import { LoadingTaskTable } from "./_components/task-table/loading-task-table";
import { ErrorTaskTable } from "./_components/task-table/error-task-table";
import { useTodo2HomeCommands } from "./commands";
import { useTaskTableSelection } from "./_components/task-table/selection-provider";
import { useTaskTableSort } from "./_components/task-table/sort-provider";
import { useTaskTableFilter } from "./_components/task-table/filter-provider";
import { useTaskTablePaging } from "./_components/task-table/paging-provider";
import { useTaskTableSearch } from "./_components/task-table/search-provider";

const Page: NextPage = () => {
  const { selectedTaskIds } = useTaskTableSelection();
  const { sortEntry } = useTaskTableSort();
  const { fieldFilters, selectionFilter } = useTaskTableFilter();
  const { page, limit } = useTaskTablePaging();
  const { searchText } = useTaskTableSearch();

  const { data, status } = usePaginatedTasks({
    searchText,
    sortEntry,
    paginationEntry: { page, limit },
    fieldFilters,
    selectionFilter,
    selectedTaskIds,
  });

  const renderContent = () => {
    switch (status) {
      case "success": {
        return (
          <TaskTable paginatedTasks={data.tasks} totalPages={data.totalPages} />
        );
      }
      case "pending": {
        return <LoadingTaskTable />;
      }
      case "error": {
        return <ErrorTaskTable />;
      }
    }
  };

  useTodo2HomeCommands();

  return (
    <>
      <div className="flex flex-nowrap items-center gap-1">
        <IconHome size={18} />
        <h1 className="text-sm">今日のタスク</h1>
      </div>
      <div className="min-w-[800px] grow">
        <Card>
          <div className="flex h-full grow flex-col gap-4">
            <div className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <TaskSearchForm />
                <TaskTableFilter />
              </div>
              <TaskAddButton />
            </div>
            {renderContent()}
          </div>
        </Card>
      </div>
      <TaskSelectionMenu />
    </>
  );
};

export default Page;
