import { z, type BRAND } from "zod";
import { taskSchema } from "../../task/model";

export type Project = {
  /**
   * 主キーとして使うIdで、projectIdと同じ意味を持つ
   */
  taskboxId: string;
  parentId: string | null;
  label: string;
  taskCount: number;
  order: number;
  subProjects: Project[];
};

export const projectSchema: z.ZodType<Project> = z.object({
  taskboxId: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  taskCount: z.number(),
  order: z.number(),
  subProjects: z.lazy(() => projectSchema.array()),
});

export const projectDetailSchema = z.object({
  taskboxId: z.string(),
  label: z.string(),
  tasks: z.array(taskSchema),
});

export type ProjectDetail = z.infer<typeof projectDetailSchema>;

type GetOrderBasedOnProjectParams = {
  baseProjectId: string;
  position: "before" | "after";
  getProject: (id: string) => Project | undefined;
};
type OrderBasedOnProject = { parentId: string | null; order: number };

export const getOrderBasedOnProject = ({
  baseProjectId,
  position,
  getProject,
}: GetOrderBasedOnProjectParams): OrderBasedOnProject => {
  const baseProject = getProject(baseProjectId);
  if (!baseProject) {
    throw new Error(`存在しないプロジェクト :${baseProject}`);
  }

  switch (position) {
    case "before": {
      return { parentId: baseProject.parentId, order: baseProject.order };
    }
    case "after": {
      const hasSubProjects = baseProject.subProjects.length !== 0;

      return hasSubProjects
        ? { parentId: baseProject.taskboxId, order: 0 }
        : { parentId: baseProject.parentId, order: baseProject.order + 1 };
    }
    default: {
      throw new Error(position satisfies never);
    }
  }
};

type CreateInput = { label: string; parentId: string | null; order?: number };
export type ValidatedCreateInput = CreateInput & BRAND<"CreateInput">;

export const validateCreateInput = (input: CreateInput): ValidatedCreateInput => {
  return input as ValidatedCreateInput;
};

type UpdateInput = { id: string; label: string };
export type ValidatedUpdateInput = UpdateInput & BRAND<"UpdateInput">;

export const validateUpdateInput = (
  input: UpdateInput,
  { getProject }: { getProject: (id: string) => Project | undefined },
): ValidatedUpdateInput => {
  const project = getProject(input.id);
  if (!project) {
    throw new Error(`プロジェクトが存在しない: ${input.id}`);
  }

  return input as ValidatedUpdateInput;
};

type UpdatePositionInput = {
  projectId: string;
  parentProjectId: string | null;
  order: number;
};
export type ValidatedUpdatePositionInput = UpdatePositionInput & BRAND<"UpdatePositionInput">;

export const validateUpdatePositionInputs = (
  inputs: UpdatePositionInput[],
  { getProjects }: { getProjects: (ids: string[]) => Project[] },
): ValidatedUpdatePositionInput[] => {
  const projects = getProjects(inputs.map((i) => i.projectId));
  const projectMap = new Map(projects.map((p) => [p.taskboxId, p]));

  return inputs.map((input) => {
    if (!projectMap.get(input.projectId)) {
      throw new Error(`プロジェクトが存在しない: ${input.projectId}`);
    }

    return input as ValidatedUpdatePositionInput;
  });
};

type DeleteInput = { projectId: string };
export type ValidatedDeleteInput = DeleteInput & BRAND<"DeleteInput">;

export const validateDeleteInput = (
  input: DeleteInput,
  { getProject }: { getProject: (id: string) => Project | undefined },
): ValidatedDeleteInput => {
  const project = getProject(input.projectId);
  if (!project) {
    throw new Error(`プロジェクトが存在しない: ${input.projectId}`);
  }

  return input as ValidatedDeleteInput;
};
