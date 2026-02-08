import { EmptyTableContent } from "./empty-content";
import { TaskTableRow } from "./row";
import { Pagination } from "../pagination";
import { useMemo } from "react";
import { TaskTableShell } from "./shell";
import { Task } from "../../_backend/models";
import { useTaskTableSelection } from "./selection-provider";
import { useTaskTablePaging } from "./paging-provider";

type Props = { paginatedTasks: Task[]; totalPages: number };

export const TaskTable: React.FC<Props> = ({ paginatedTasks, totalPages }) => {
  const { selectedTaskIds, selectTaskIds, unselectTaskIds } =
    useTaskTableSelection();
  const { page, setPage } = useTaskTablePaging();

  const allSelectedOnPage = useMemo(() => {
    if (paginatedTasks.length === 0) {
      return false;
    }

    return !!paginatedTasks.every((t) => selectedTaskIds.includes(t.id));
  }, [paginatedTasks, selectedTaskIds]);

  const handleToggleAllSelectedOnPage = () => {
    const taskIds = paginatedTasks.map((t) => t.id) ?? [];

    if (allSelectedOnPage) {
      unselectTaskIds(taskIds);
    } else {
      selectTaskIds(taskIds);
    }
  };

  return (
    <TaskTableShell
      allSelected={allSelectedOnPage}
      onChangeAllSelected={handleToggleAllSelectedOnPage}
      body={
        <>
          {paginatedTasks.length === 0 && <EmptyTableContent />}
          {paginatedTasks.map((task) => {
            return <TaskTableRow key={task.id} task={task} />;
          })}
        </>
      }
      footer={
        totalPages > 1 && (
          <Pagination page={page} onChangePage={setPage} total={totalPages} />
        )
      }
    />
  );
};
