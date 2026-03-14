import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

type Props = { icon: LucideIcon; onClick?: () => void };

export const userPanelButtonClass =
  "grid size-[30px] place-items-center rounded-full bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-600";

export const UserPanelButton = forwardRef<HTMLButtonElement, Props>(function UserMenuItem(
  { icon: Icon, onClick },
  ref,
) {
  return (
    <button ref={ref} className={userPanelButtonClass} onClick={onClick}>
      <Icon size={20} />
    </button>
  );
});
