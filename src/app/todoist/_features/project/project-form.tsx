import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../_components/input";
import { useId } from "react";
import { Label } from "../../_components/label";
import { ErrorMessage } from "../../_components/error-message";
import { ProjectFormData, projectFormSchema } from "../../_backend/taskbox/project/schema";

type Props = {
  id: string;
  defaultValues?: ProjectFormData;
  onSubmit: (data: ProjectFormData) => void;
};

export const ProjectForm: React.FC<Props> = ({ id, defaultValues, onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ProjectFormData>({
    defaultValues,
    resolver: zodResolver(projectFormSchema),
  });

  const labelErrorId = `${useId()}-label-error`;

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="label">名前</Label>
        <div className="space-y-1">
          <Input
            id="label"
            {...register("label")}
            data-auto-focus
            autoComplete="off"
            aria-invalid={!!errors.label}
            aria-errormessage={labelErrorId}
          />
          {errors.label && (
            <ErrorMessage errorId={labelErrorId}>{errors.label.message}</ErrorMessage>
          )}
        </div>
      </div>
    </form>
  );
};
