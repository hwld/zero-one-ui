import { CircleAlertIcon } from "lucide-react";
import { TaskListStateCard } from "./task-list-state-card";

export const TaskListError: React.FC = () => {
  return (
    <TaskListStateCard>
      <CircleAlertIcon size={80} className="text-red-500" />
      <div className="space-y-2 text-center">
        <div className="font-bold">
          タスクを読み込むことができませんでした。
        </div>
        <button
          className="rounded-sm bg-neutral-700 px-3 py-2 text-sm text-neutral-100 transition-colors hover:bg-neutral-600"
          onClick={() => {
            window.location.reload();
          }}
        >
          更新する
        </button>
      </div>
    </TaskListStateCard>
  );
};
