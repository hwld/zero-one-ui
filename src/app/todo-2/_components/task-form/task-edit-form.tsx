import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskDetailViewClass } from "../task-detail-content-card";
import clsx from "clsx";
import { TaskFormErrorTooltip } from "./error-tooltip";
import { UpdateTaskInput, updateTaskInputSchema } from "../../_backend/api";
import { Task } from "../../_backend/task-store";
import { useId } from "react";

type Props = {
  defaultTask: Task;
  formId: string;
  onUpdateTask: (data: UpdateTaskInput) => void;
};
export const TaskEditForm: React.FC<Props> = ({
  defaultTask,
  formId,
  onUpdateTask,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskInput>({
    defaultValues: {
      title: defaultTask.title,
      description: defaultTask.description,
      status: defaultTask.status,
    },
    resolver: zodResolver(updateTaskInputSchema),
  });

  const inputBaseClass =
    "rounded-sm bg-transparent outline-solid outline-1 outline-zinc-500 focus-visible:outline-1 focus-visible:outline-zinc-100";

  const componentId = useId();
  const titleErrorMessageId = `${componentId}-title-errormessage`;
  const descErrorMessageId = `${componentId}-desc-errormessage`;

  return (
    <form
      className={taskDetailViewClass.wrapper}
      id={formId}
      onSubmit={handleSubmit(onUpdateTask)}
    >
      <TaskFormErrorTooltip
        id={titleErrorMessageId}
        error={errors.title?.message}
      >
        <input
          className={clsx(taskDetailViewClass.title, inputBaseClass)}
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-errormessage={titleErrorMessageId}
        />
      </TaskFormErrorTooltip>
      <TaskFormErrorTooltip
        id={descErrorMessageId}
        className="h-full w-full"
        error={errors.description?.message}
        placement="bottom-start"
      >
        <textarea
          className={clsx(
            taskDetailViewClass.description,
            inputBaseClass,
            "resize-none",
          )}
          {...register("description")}
          aria-invalid={!!errors.description}
          aria-errormessage={descErrorMessageId}
        />
      </TaskFormErrorTooltip>
    </form>
  );
};
