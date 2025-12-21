import { useState } from "react";
import { TaskForm } from "./task-form";
import { PiPlusBold } from "@react-icons/all-files/pi/PiPlusBold";
import { useCreateTask } from "./use-create-task";
import type { TaskFormData } from "../../_backend/task/schema";

type Props = { taskboxId: string };

export const TaskFormOpenButton: React.FC<Props> = ({ taskboxId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(crypto.randomUUID());

  const createTask = useCreateTask();

  const handleCreateTask = (input: TaskFormData) => {
    createTask.mutate(
      {
        title: input.title,
        description: input.description,
        taskboxId: input.taskboxId,
        parentId: input.parentId,
      },
      {
        onSuccess: () => {
          setFormKey(crypto.randomUUID());
        },
      },
    );
  };

  if (isOpen) {
    return (
      <div className="rounded-lg border border-stone-300">
        <TaskForm
          key={formKey}
          size="sm"
          defaultValues={{ taskboxId }}
          onCancel={() => setIsOpen(false)}
          onSubmit={handleCreateTask}
          submitText="タスクを追加"
          isSubmitting={createTask.isPending}
        />
      </div>
    );
  }

  return (
    <button
      className="group grid h-8 grid-cols-[auto_1fr] items-center gap-1 rounded-sm px-2 text-start text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
      onClick={() => setIsOpen(true)}
    >
      <div className="grid size-5 place-items-center rounded-full transition-colors group-hover:bg-rose-600">
        <PiPlusBold className="size-4 text-rose-500 transition-colors group-hover:text-stone-100" />
      </div>
      <div>タスクを追加</div>
    </button>
  );
};
