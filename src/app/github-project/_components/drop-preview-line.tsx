import { cn } from "../../../lib/utils";

type Props = { className?: string; align?: "horizontal" | "vertical" };
export const DropPreviewLine: React.FC<Props> = ({ className, align = "horizontal" }) => {
  const alignClass = {
    horizontal: "h-[4px] w-full",
    vertical: "w-[4px] h-full",
  };

  return <div className={cn("absolute rounded-full bg-blue-500", alignClass[align], className)} />;
};
