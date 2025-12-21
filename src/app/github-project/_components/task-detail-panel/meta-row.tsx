import { ReactNode } from "react";

type Props = { label: string; children: ReactNode };

export const TaskDetailPanelMetaRow: React.FC<Props> = ({
  label,
  children,
}) => {
  return (
    <div className="grid grid-cols-[30%_70%]">
      <div className="flex items-center text-xs font-bold text-neutral-400">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
};
