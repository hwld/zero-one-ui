import { Command } from "cmdk";
import { TaskStatus } from "../../../_backend/task-status/store";
import { SelectionMenu } from "../../selection-menu/menu";
import { forwardRef } from "react";
import { TaskStatusSelectionMenuItem } from "./item";

type Props = {
  allStatus: TaskStatus[];
  currentStatus: TaskStatus;
  onBack?: () => void;
  onClose: () => void;
  onSelect: (statusId: string) => void;
  placeHolder?: string;
};

export const TaskStatusSelectionMenu = forwardRef<HTMLDivElement, Props>(
  function TaskStatusSelectionMenu(
    { allStatus, currentStatus, onBack, onClose, onSelect, placeHolder = "Status..." },
    ref,
  ) {
    return (
      <SelectionMenu ref={ref} onBack={onBack} placeholder={placeHolder}>
        {allStatus.map((status) => {
          return (
            <Command.Item
              asChild
              key={status.id}
              onSelect={() => {
                onSelect(status.id);
                onClose();
              }}
            >
              <TaskStatusSelectionMenuItem
                status={status}
                active={status.id === currentStatus.id}
              />
            </Command.Item>
          );
        })}
      </SelectionMenu>
    );
  },
);
