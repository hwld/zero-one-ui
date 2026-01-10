import { useId, useState } from "react";
import * as Switch from "@radix-ui/react-switch";
import clsx from "clsx";
import { motion } from "motion/react";
import { CheckIcon, XIcon } from "lucide-react";

export const SettingSwitch: React.FC<{ label: string }> = ({ label }) => {
  const id = useId();
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex w-full items-center justify-between">
      <label className="cursor-pointer pr-4" htmlFor={id}>
        {label}
      </label>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
        className={clsx(
          "h-[28px] w-[46px] shrink-0 rounded-full transition-colors",
          checked ? "bg-green-500" : "bg-neutral-500",
        )}
      >
        <Switch.Thumb asChild>
          <motion.span
            className="grid size-[20px] place-items-center rounded-full bg-neutral-100"
            animate={{ x: checked ? 22 : 4 }}
          >
            {checked ? (
              <CheckIcon size={16} className="text-green-500" />
            ) : (
              <XIcon size={16} className="text-neutral-500" />
            )}
          </motion.span>
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
};
