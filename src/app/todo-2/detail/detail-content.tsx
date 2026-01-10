import { ReactNode } from "react";
import { Card } from "../_components/card";
import { TaskDetailContentCard } from "../_components/task-detail-content-card";
import {
  IconCheckbox,
  IconClockHour5,
  IconClockCheck,
} from "@tabler/icons-react";
import { TaskStatusBadge } from "../_components/task-status-badge";
import { useUpdateTask } from "../_queries/use-update-task";
import { useTask } from "../_queries/use-task";
import { CircleSlashIcon, GhostIcon, Loader2Icon } from "lucide-react";
import { Button } from "../_components/button";
import { ButtonLink } from "../_components/button-link";

type Props = { taskId: string };
export const TaskDetailContent: React.FC<Props> = ({ taskId }) => {
  const updateTaskMutation = useUpdateTask();
  const { data: task, status } = useTask(taskId);

  if (status === "pending") {
    return (
      <Card>
        <div className="mt-20 flex w-full justify-center">
          <Loader2Icon className="animate-spin text-neutral-400" size={100} />
        </div>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card>
        <div className="flex size-full justify-center">
          <div className="mt-20 flex w-fit flex-col items-center">
            <GhostIcon size={100} />
            <div className="mt-2 text-center text-sm">
              タスクを読み込むことができませんでした
              <br />
              もう一度試してみてください
            </div>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              更新する
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (!task) {
    return (
      <Card>
        <div className="flex size-full justify-center">
          <div className="mt-20 flex w-fit flex-col items-center">
            <CircleSlashIcon size={100} />
            <div className="mt-2 text-sm">存在しないタスクです</div>
            <ButtonLink href="/todo-2" className="mt-4">
              ホームに戻る
            </ButtonLink>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grow grid-cols-[1fr_300px] gap-4">
      <TaskDetailContentCard task={task} />
      <Card>
        <div className="flex flex-col gap-4">
          <Row
            icon={IconCheckbox}
            title="状況"
            value={
              <TaskStatusBadge
                status={task.status}
                onChangeStatus={() => {
                  updateTaskMutation.mutate({
                    ...task,
                    status: task.status === "done" ? "todo" : "done",
                  });
                }}
              />
            }
          />
          <Row
            icon={IconClockHour5}
            title="作成日"
            value={task.createdAt.toLocaleString()}
          />
          {task.completedAt && (
            <Row
              icon={IconClockCheck}
              title="完了日"
              value={task.completedAt.toLocaleString()}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

const Row: React.FC<{
  icon: React.FC<{ className?: string; size?: number }>;
  title: string;
  value: ReactNode;
}> = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-[100px] items-center gap-1 text-sm text-zinc-400">
        <Icon size={18} />
        {title}
      </div>
      <div className="ml-2" suppressHydrationWarning>
        {value}
      </div>
    </div>
  );
};
