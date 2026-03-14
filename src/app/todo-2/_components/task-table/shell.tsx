import {
  IconCheckbox,
  IconClipboardText,
  IconClockCheck,
  IconClockHour5,
  IconGridDots,
} from "@tabler/icons-react";
import { TaskTableCheckbox } from "./checkbox";
import { LabelTableHeader, SortableTableHeader, TableHeader } from "./header";
import { ReactNode } from "react";

type Props = {
  allSelected?: boolean;
  onChangeAllSelected?: () => void;
  body: ReactNode;
  footer?: ReactNode;
};

export const taskTableCols = 6;

export const TaskTableShell: React.FC<Props> = ({
  body,
  footer,
  allSelected = false,
  onChangeAllSelected = () => {},
}) => {
  return (
    <div className="flex h-full grow flex-col overflow-auto rounded-md border border-zinc-600 text-zinc-200">
      <table className="table w-full border-collapse text-left">
        <thead className="text-xs">
          <tr className="[&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
            <TableHeader width={50}>
              <TaskTableCheckbox
                aria-label="すべてを選択・選択解除"
                checked={allSelected}
                onChange={onChangeAllSelected}
              />
            </TableHeader>
            <LabelTableHeader icon={IconCheckbox} width={80} text="状況" />
            <SortableTableHeader icon={IconClipboardText} text="タスク名" fieldName="title" />
            <SortableTableHeader
              icon={IconClockHour5}
              width={200}
              text="作成日"
              fieldName="createdAt"
            />
            <SortableTableHeader
              icon={IconClockCheck}
              width={200}
              text="達成日"
              fieldName="completedAt"
            />
            <LabelTableHeader icon={IconGridDots} width={150} text="操作" />
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
      {footer && (
        <>
          <div className="shrink grow" />
          <div className="flex h-[60px] items-center justify-end border-t border-zinc-600 px-2">
            {footer}
          </div>
        </>
      )}
    </div>
  );
};
