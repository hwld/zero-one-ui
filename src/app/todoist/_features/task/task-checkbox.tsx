import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { PiCheckBold } from "@react-icons/all-files/pi/PiCheckBold";
import { cn } from "../../../../lib/utils";

type Props = Omit<CheckboxPrimitive.CheckboxProps, "onChange"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const TaskCheckbox: React.FC<Props> = ({
  checked,
  onChange,
  ...props
}) => {
  return (
    <CheckboxPrimitive.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        "group/checkbox size-5 shrink-0 rounded-full border border-stone-400 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        checked && "animate-in zoom-in-125 bg-stone-400 text-stone-100",
      )}
      {...props}
    >
      {checked ? (
        <CheckboxPrimitive.Indicator
          forceMount
          className={cn("flex items-center justify-center text-current")}
        >
          <PiCheckBold className="size-3 stroke-[4px]" />
        </CheckboxPrimitive.Indicator>
      ) : (
        <div className="grid place-items-center">
          <PiCheckBold className="size-3 stroke-[4px] text-stone-400 opacity-0 transition-opacity group-hover/checkbox:opacity-100" />
        </div>
      )}
    </CheckboxPrimitive.Root>
  );
};
