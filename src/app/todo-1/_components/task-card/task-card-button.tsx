import { ReactNode } from "react";

export const taskCardItemClass =
  "flex h-[25px] w-[25px] items-center justify-center rounded-sm p-1 text-neutral-700 transition-all duration-200 hover:bg-neutral-200";

export const TaskCardButton: React.FC<{
  icon: ReactNode;
  onClick?: () => void;
}> = ({ icon, onClick, ...props }) => {
  return (
    <button {...props} onClick={onClick} className={taskCardItemClass}>
      {icon}
    </button>
  );
};
