import { forwardRef } from "react";
import { ViewTask } from "../../_backend/view/api";
import {
  CircleDotIcon,
  CopyIcon,
  ArrowUpToLine,
  ArrowDownToLineIcon,
  MoveHorizontalIcon,
  ChevronRightIcon,
  ArchiveIcon,
  TrashIcon,
} from "lucide-react";
import { useDeleteTask } from "../../_queries/use-delete-task";
import { Divider } from "../divider";
import { DropdownCard } from "../dropdown/card";
import { DropdownItemList, DropdownItem } from "../dropdown/item";
import { TaskDeleteConfirmDialogTrigger } from "../task-delete-confirm-dialog";

type Props = {
  task: ViewTask;
  onOpenMoveToColumnMenu: () => void;
  onMoveTop: (() => void) | undefined;
  onMoveBottom: (() => void) | undefined;
};

export const ViewTaskCardMenu = forwardRef<HTMLDivElement, Props>(function ViewTaskCardMenu(
  { task, onOpenMoveToColumnMenu, onMoveTop, onMoveBottom },
  ref,
) {
  const deleteTaskMutation = useDeleteTask();

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id);
  };

  return (
    <DropdownCard ref={ref}>
      <DropdownItemList>
        <DropdownItem icon={CircleDotIcon} label="Convert to issue" />
        <DropdownItem icon={CopyIcon} label="Copy link in project" />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem
          icon={ArrowUpToLine}
          label="Move to top"
          disabled={onMoveTop === undefined}
          onClick={onMoveTop}
        />
        <DropdownItem
          icon={ArrowDownToLineIcon}
          label="Move to bottom"
          disabled={onMoveBottom === undefined}
          onClick={onMoveBottom}
        />
        <DropdownItem
          icon={MoveHorizontalIcon}
          rightIcon={ChevronRightIcon}
          label="Move to column"
          onClick={onOpenMoveToColumnMenu}
        />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={ArchiveIcon} label="Archive" />
        <TaskDeleteConfirmDialogTrigger
          onDelete={handleDeleteTask}
          isDeleting={deleteTaskMutation.isPending}
        >
          <DropdownItem
            icon={TrashIcon}
            label="Delete from project"
            red
            disabled={deleteTaskMutation.isPending}
          />
        </TaskDeleteConfirmDialogTrigger>
      </DropdownItemList>
    </DropdownCard>
  );
});
