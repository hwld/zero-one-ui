import { Button } from "../button";
import { Task } from "../../_backend/task/store";
import { useId } from "react";
import { Input } from "../input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTaskInput, updateTaskInputSchema } from "../../_backend/task/api";
import { useUpdateTask } from "../../_queries/use-update-task";
import { FloatingErrorMessage } from "../floating-error-message";

export const TaskTitleForm: React.FC<{
  task: Task;
  onCancel: () => void;
  onAfterSubmit: () => void;
}> = ({ onCancel, onAfterSubmit, task }) => {
  const {
    register,
    formState: { errors },
    handleSubmit: buildHandleSubmit,
  } = useForm<UpdateTaskInput>({
    defaultValues: {
      title: task.title,
      statusId: task.status.id,
      comment: task.comment,
    },
    resolver: zodResolver(updateTaskInputSchema),
  });

  const updateTaskMutation = useUpdateTask();

  const handleSubmit = buildHandleSubmit((input) => {
    updateTaskMutation.mutate({ ...input, id: task.id });
    onAfterSubmit();
  });

  const titleErrorId = `${useId()}-title-error`;

  const { ref, ...otherRegister } = register("title");

  return (
    <form className="flex w-full items-end gap-4" onSubmit={handleSubmit}>
      <div className="grow space-y-1">
        <FloatingErrorMessage
          messageId={titleErrorId}
          message={errors.title?.message}
          anchorRef={ref}
          anchor={
            <Input
              autoFocus
              {...otherRegister}
              disabled={updateTaskMutation.isPending}
              aria-invalid={!!errors.title}
              aria-errormessage={titleErrorId}
            />
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <Button color="primary" type="submit">
          Save
        </Button>
        <Button onClick={onCancel} type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
};
