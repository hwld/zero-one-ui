import clsx from "clsx";
import { HashIcon } from "lucide-react";

type Props = { active?: boolean };

export const ChannelLink: React.FC<Props> = ({ active }) => {
  return (
    <button
      className={clsx(
        "flex w-full items-center gap-1 rounded-sm p-2 transition-colors",
        active ? "bg-green-500/25" : "hover:bg-green-500/10",
      )}
    >
      <HashIcon size={18} className="text-green-500" />
      <div>channnel</div>
    </button>
  );
};
