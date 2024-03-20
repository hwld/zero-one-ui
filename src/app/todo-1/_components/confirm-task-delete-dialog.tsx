import { Task } from "../_mocks/task-store";
import { Dialog } from "./dialog";

export const ConfirmTaskDeleteDialog: React.FC<{
  task: Task;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}> = ({ task, isOpen, onOpenChange, onConfirm }) => {
  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      titleText="タスクの削除"
      cancelText="キャンセル"
      actionText="削除する"
      onAction={onConfirm}
    >
      <div>
        タスク`
        <span className="mx-1 break-all font-bold text-neutral-900">
          {task.title}
        </span>
        ` を削除してもよろしいですか？
        <br />
        タスクを削除すると、もとに戻すことはできません。
      </div>
    </Dialog>
  );
};
