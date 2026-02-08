import { CircleDashedIcon, CircleDotIcon } from "lucide-react";
import clsx from "clsx";
import { Task, getTaskStatusLabel } from "../_backend/models";

type TaskStatusBadgeProps = {
  status: Task["status"];
  onChangeStatus: (value: Task["status"]) => void;
};
export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  onChangeStatus,
}) => {
  const statusClassMap = {
    done: "border-green-500 text-green-500 hover:bg-green-500/20",
    todo: "border-red-500 text-red-500 hover:bg-red-500/20",
  };
  const options = {
    done: { text: getTaskStatusLabel("done"), icon: CircleDotIcon },
    todo: { text: getTaskStatusLabel("todo"), icon: CircleDashedIcon },
  };

  const label = options[status].text;
  const Icon = options[status].icon;

  const handleChangeStatus = () => {
    const next = status === "done" ? "todo" : "done";
    onChangeStatus(next);
  };

  return (
    <button
      className={clsx(
        "flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors",
        statusClassMap[status],
      )}
      onClick={handleChangeStatus}
    >
      <Icon size={15} />
      {label}
    </button>
  );
};
