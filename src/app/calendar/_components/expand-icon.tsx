import { IconType } from "@react-icons/all-files/lib";
import { TbArrowsDiagonal2 } from "@react-icons/all-files/tb/TbArrowsDiagonal2";
import { TbArrowsDiagonalMinimize } from "@react-icons/all-files/tb/TbArrowsDiagonalMinimize";
import { cn } from "../../../lib/utils";

export const CollapseIcon: IconType = ({ className, ...props }) => {
  return <TbArrowsDiagonalMinimize {...props} className={cn("rotate-45", className)} />;
};

export const ExpandIcon: IconType = ({ className, ...props }) => {
  return <TbArrowsDiagonal2 {...props} className={cn("rotate-45", className)} />;
};
