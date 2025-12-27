import { z } from "zod";

const BaseHomeSchema = z.object({ viewId: z.string().optional() });

export const HomeSearchParamsSchema = z.union([
  BaseHomeSchema.extend(
    z.object({ panel: z.literal("detail"), taskId: z.string() }).shape,
  ),
  BaseHomeSchema.extend(z.object({ panel: z.undefined().optional() }).shape),
]);

type HomeSearchParams = z.infer<typeof HomeSearchParamsSchema>;

export const Routes = {
  base: `/github-project` as const,

  home: (params: HomeSearchParams) => {
    // 値がnullableのフィールドを削除する
    const filteredParams = Object.entries(params).filter(
      ([_, v]) => v !== undefined && v !== null,
    );
    const searchParams = new URLSearchParams(filteredParams);

    return `${Routes.base}?${searchParams.toString()}` as const;
  },
} as const;
