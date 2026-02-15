import { IconPencil } from "@tabler/icons-react";
import { Card } from "./card";
import { useId, useState } from "react";
import { TaskEditForm } from "./task-form/task-edit-form";
import { useUpdateTask } from "../_queries/use-update-task";
import { Button } from "./button";
import { Task } from "../_backend/models";
import { CreateTaskInput } from "../_backend/api";

export const taskDetailViewClass = {
  wrapper: "flex h-full flex-col gap-2",
  title: "text-xl font-bold p-1 w-full",
  description: "grow p-1 break-all whitespace-pre-wrap w-full h-full",
};

type Props = { task: Task };
export const TaskDetailContentCard: React.FC<Props> = ({ task }) => {
  const updateTaskMutation = useUpdateTask();
  const [isEditing, setIsEditing] = useState(false);
  const editFormId = useId();

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateTask = (data: CreateTaskInput) => {
    setIsEditing(false);
    updateTaskMutation.mutate({
      ...task,
      title: data.title,
      description: data.description,
    });
  };

  return (
    <Card>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex h-[24px] items-center rounded-sm bg-zinc-700 px-2 text-sm text-zinc-400">
            Task Detail
          </div>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Button variant="ghost" onClick={handleCancelEdit}>
                キャンセル
              </Button>
              <Button form={editFormId} type="submit">
                保存する
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <IconPencil size={15} className="mb-px" />
              編集する
            </Button>
          )}
        </div>
        {isEditing ? (
          <TaskEditForm
            defaultTask={task}
            formId={editFormId}
            onUpdateTask={handleUpdateTask}
          />
        ) : (
          <div className={taskDetailViewClass.wrapper}>
            <h2 className={taskDetailViewClass.title}>{task.title}</h2>
            <div className={taskDetailViewClass.description}>
              {task.description}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
