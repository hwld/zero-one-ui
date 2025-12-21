import { LucideIcon } from "lucide-react";

export const MenuItem: React.FC<{ icon: LucideIcon; onClick?: () => void }> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      className="control-item grid h-[30px] w-full min-w-[45px] place-items-center rounded-sm text-neutral-100 transition-colors hover:bg-white/20"
      onClick={onClick}
    >
      <Icon size={20} />
    </button>
  );
};
