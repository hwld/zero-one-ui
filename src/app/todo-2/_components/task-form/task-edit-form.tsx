import { useForm } from "react-hook-form";
import { Task } from "../../_contexts/tasks-provider";
import { TaskFormData, taskFormSchema } from "./task-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskDetailViewClass } from "../task-detail-content-card";
import clsx from "clsx";

type Props = {
  defaultTask: Task;
  formId: string;
  onUpdateTask: (data: TaskFormData) => void;
};
export const TaskEditForm: React.FC<Props> = ({
  defaultTask,
  formId,
  onUpdateTask,
}) => {
  const { register, handleSubmit } = useForm<TaskFormData>({
    defaultValues: {
      title: defaultTask.title,
      description: defaultTask.description,
    },
    resolver: zodResolver(taskFormSchema),
  });

  const inputBaseClass =
    "rounded bg-transparent outline outline-1 outline-zinc-500 focus-visible:outline-1 focus-visible:outline-zinc-100";

  return (
    <form
      className={taskDetailViewClass.wrapper}
      id={formId}
      onSubmit={handleSubmit(onUpdateTask)}
    >
      <input
        className={clsx(taskDetailViewClass.title, inputBaseClass)}
        {...register("title")}
      />
      <textarea
        className={clsx(
          taskDetailViewClass.description,
          inputBaseClass,
          "resize-none",
        )}
        {...register("description")}
      />
    </form>
  );
};
