import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { INPUT_BASE_CLASS } from "./input";

export const Textarea: React.FC<{ label: string } & ComponentPropsWithoutRef<"textarea">> = ({
  label,
  ...props
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm">{label}</label>
      <textarea className={clsx(INPUT_BASE_CLASS, "resize-none")} {...props} />
    </div>
  );
};
