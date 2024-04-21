import { CircleAlertIcon } from "lucide-react";
import { TaskListStatusCard } from "./task-list-status-card";

export const ErrorTasks: React.FC = () => {
  return (
    <TaskListStatusCard>
      <CircleAlertIcon size={80} className="text-red-500" />
      <div className="space-y-2 text-center">
        <div className="font-bold">
          タスクを読み込むことができませんでした。
        </div>
        <button
          className="rounded bg-neutral-700 px-3 py-2 text-sm text-neutral-100 transition-colors hover:bg-neutral-600"
          onClick={() => {
            window.location.reload();
          }}
        >
          更新する
        </button>
      </div>
    </TaskListStatusCard>
  );
};
