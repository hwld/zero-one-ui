import { z } from "zod";

export const projectFormSchema = z.object({
  label: z
    .string()
    .min(1, "プロジェクト名を入力してください")
    .max(120, "プロジェクト名は120文字以内で入力してください"),
});
export type ProjectFormData = z.infer<typeof projectFormSchema>;

export const createProjectInputSchema = z.union([
  projectFormSchema.extend(z.object({ type: z.literal("default") }).shape),
  projectFormSchema.extend(
    z.object({
      type: z.union([z.literal("before"), z.literal("after")]),
      referenceProjectId: z.string(),
    }).shape,
  ),
]);

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = projectFormSchema;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

export const projectPositionChangeSchema = z.object({
  projectId: z.string(),
  order: z.number(),
  parentProjectId: z.string().nullable(),
});

export type ProjectPositionChange = z.infer<typeof projectPositionChangeSchema>;
