import { useId } from "react";
import { Task } from "../../_backend/task/store";
import { Button } from "../button";
import { Textarea } from "../textarea";
import { useForm } from "react-hook-form";
import { UpdateTaskInput, updateTaskInputSchema } from "../../_backend/task/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateTask } from "../../_queries/use-update-task";

type TaskCommentFormProps = {
  task: Task;
  onAfterSubmit: () => void;
  onCancel: () => void;
};
export const TaskCommentForm: React.FC<TaskCommentFormProps> = ({
  task,
  onAfterSubmit,
  onCancel,
}) => {
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
    updateTaskMutation.mutate({ id: task.id, ...input });
    onAfterSubmit();
  });

  const errorMessageId = useId();

  return (
    <form className="w-full space-y-2" onSubmit={handleSubmit}>
      <Textarea
        placeholder="Leave a comment"
        {...register("comment")}
        aria-invalid={!!errors.comment}
        aria-errormessage={errorMessageId}
        autoFocus
      />
      <div className="flex items-center justify-between gap-4">
        <p id={errorMessageId} className="text-sm text-red-400">
          {errors.comment?.message}
        </p>
        <div className="flex gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button color="primary">Update comment</Button>
        </div>
      </div>
    </form>
  );
};
