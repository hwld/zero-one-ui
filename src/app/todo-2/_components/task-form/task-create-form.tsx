import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMergeRefs } from "@floating-ui/react";
import { useEffect, useId, useRef } from "react";
import { TaskFormErrorTooltip } from "./error-tooltip";
import clsx from "clsx";
import { CreateTaskInput, createTaskInputSchema } from "../../_backend/api";

type Props = {
  onAddTask: (data: CreateTaskInput) => void;
  id: string;
};

export const TaskCreateForm: React.FC<Props> = ({ onAddTask, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    defaultValues: { title: "", description: "" },
    resolver: zodResolver(createTaskInputSchema),
  });

  const innerTitleRef = useRef<HTMLInputElement>(null);
  const { ref: _titleRef, ...titleRegister } = register("title");
  const titleRef = useMergeRefs([innerTitleRef, _titleRef]);

  useEffect(() => {
    innerTitleRef.current?.focus();
  }, []);

  const componentId = useId();
  const titleErrorMessageId = `${componentId}-title-errormessage`;
  const descErrorMessageId = `${componentId}-desc-errormessage`;

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onAddTask)}
      className="flex flex-col gap-2 px-4"
    >
      <TaskFormErrorTooltip
        id={titleErrorMessageId}
        error={errors.title?.message}
      >
        <input
          ref={titleRef}
          placeholder="タスクのタイトル"
          aria-invalid={!!errors.title}
          aria-errormessage={titleErrorMessageId}
          className={clsx(
            "w-full rounded-sm bg-transparent text-lg font-bold placeholder:text-zinc-500 focus-visible:outline-hidden",
            errors.title && "text-red-400",
          )}
          {...titleRegister}
        />
      </TaskFormErrorTooltip>
      <TaskFormErrorTooltip
        id={descErrorMessageId}
        error={errors.description?.message}
        placement="bottom-start"
      >
        <textarea
          placeholder="タスクの説明"
          rows={6}
          aria-invalid={!!errors.description}
          aria-errormessage={descErrorMessageId}
          className={clsx(
            "w-full resize-none bg-transparent text-sm placeholder:text-zinc-500 focus-visible:outline-hidden",
            errors.description && "text-red-400",
          )}
          {...register("description")}
        />
      </TaskFormErrorTooltip>
    </form>
  );
};
