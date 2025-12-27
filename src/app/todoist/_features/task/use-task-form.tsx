import { useForm } from "react-hook-form";
import {
  taskFormFieldMap,
  taskFormSchema,
  type TaskFormData,
} from "../../_backend/task/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef } from "react";

type Params = { defaultValues?: TaskFormData; onCancel?: () => void };

export const useTaskForm = ({ defaultValues, onCancel }: Params) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
    watch,
    setValue,
    resetField,
  } = useForm<TaskFormData>({
    defaultValues,
    mode: "all",
    resolver: zodResolver(taskFormSchema, {
      errorMap: (issue, ctx) => {
        if (issue.code === "too_big" && issue.type === "string") {
          const field = issue.path[0];

          return {
            message: `${taskFormFieldMap[field]}の文字数制限: ${Number(ctx.data?.length)} / ${issue.maximum}`,
          };
        }

        return { message: ctx.defaultError };
      },
    }),
  });

  const errorMessagesWithoutTooSmall = [errors.title, errors.description]
    .filter((e) => {
      return e?.type !== "too_small";
    })
    .map((e) => e?.message)
    .filter((m) => m !== undefined);

  const submitRef = useRef<HTMLButtonElement | null>(null);

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel?.();
      return;
    }

    if (e.key === "Enter" && e.metaKey) {
      submitRef.current?.click();
      return;
    }
  };

  return {
    register,
    handleSubmit,
    formState: { isValid, errorMessagesWithoutTooSmall },
    trigger,
    submitRef,
    handleFormKeyDown,
    watch,
    setValue,
    resetField,
  };
};
