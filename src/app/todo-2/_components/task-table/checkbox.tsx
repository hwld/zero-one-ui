"use client";

import { IconCheck } from "@tabler/icons-react";
import clsx from "clsx";

type Props = { checked: boolean; onChange: (checked: boolean) => void };

export const TaskTableCheckbox: React.FC<Props> = ({
  checked,
  onChange,
  // aria-labelなどの属性をそのまま渡せるようにする
  ...props
}) => {
  return (
    <div
      className={clsx(
        "relative block size-[18px] overflow-hidden rounded-sm border border-zinc-500 outline-2 outline-[#4c84e5] transition-colors has-focus-visible:outline-solid",
        checked ? "border-zinc-300 bg-zinc-300" : "hover:bg-white/10",
      )}
    >
      <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={() => onChange(!checked)}
        className="h-full w-full cursor-pointer appearance-none opacity-0"
      />
      {checked && (
        <IconCheck
          className="pointer-events-none absolute inset-0 text-zinc-700"
          size={15}
        />
      )}
    </div>
  );
};
