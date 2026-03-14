import { forwardRef } from "react";
import { TaskStatusIcon } from "../../task-status-icon";
import { CheckIcon } from "lucide-react";
import { TaskStatus } from "../../../_backend/task-status/store";

type Props = { status: TaskStatus; active?: boolean };

export const TaskStatusSelectionMenuItem = forwardRef<HTMLButtonElement, Props>(
  function TaskStatusSelectionMenuItem({ status, active = false, ...props }, ref) {
    return (
      <button
        {...props}
        ref={ref}
        className="flex min-h-12 w-full items-start gap-2 rounded-md px-2 py-[6px] transition-colors hover:bg-white/10 data-[selected=true]:bg-white/10"
      >
        <TaskStatusIcon color={status.color} />
        <div className="flex w-full flex-col items-start gap-[2px]">
          <div className="flex w-full items-start justify-between gap-1 text-sm">
            {status.name}
            {active && <CheckIcon size={20} />}
          </div>
          <div className="text-xs text-neutral-400">{status.description}</div>
        </div>
      </button>
    );
  },
);
