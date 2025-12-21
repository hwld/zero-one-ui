import { TaskStatusBadge } from "../task-status-badge";
import { DropdownProvider } from "../dropdown/provider";
import { useState } from "react";
import { DropdownTrigger } from "../dropdown/trigger";
import { DropdownContent } from "../dropdown/content";
import { TaskStatusSelectionMenu } from "../view-task-menu/task-status-selection-menu/menu";
import { Task } from "../../_backend/task/store";
import { useUpdateTask } from "../../_queries/use-update-task";
import { useAllTaskStatus } from "../../_queries/use-all-task-status";

type Props = {
  task: Task;
};

export const UpdateTaskStatusMenuTrigger: React.FC<Props> = ({ task }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: allTaskStatus = [] } = useAllTaskStatus();
  const updateTaskMutation = useUpdateTask();

  const handleUpdateTaskStatus = (statusId: string) => {
    updateTaskMutation.mutate({ ...task, statusId });
  };

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <button
          className="h-full w-full rounded-sm px-2 text-start text-sm transition-colors hover:bg-white/15 disabled:opacity-50"
          disabled={updateTaskMutation.isPending}
        >
          <TaskStatusBadge status={task.status} />
        </button>
      </DropdownTrigger>
      <DropdownContent
        onEscapeKeydown={(e) => {
          e.stopPropagation();
          setIsOpen(false);
        }}
      >
        <TaskStatusSelectionMenu
          allStatus={allTaskStatus}
          currentStatus={task.status}
          onSelect={handleUpdateTaskStatus}
          onClose={() => setIsOpen(false)}
        />
      </DropdownContent>
    </DropdownProvider>
  );
};
