import { AnimatePresence, motion } from "motion/react";
import { CircleDotIcon, LucideIcon, Trash2Icon, XIcon } from "lucide-react";
import { ConfirmDialog } from "../confirm-dialog";
import { useState } from "react";
import {
  autoUpdate,
  offset,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useUpdateTaskStatuses } from "../../_queries/use-update-task-statuses";
import { useDeleteTasks } from "../../_queries/use-delete-tasks";
import { useTaskTableSelection } from "../task-table/selection-provider";

export const TaskSelectionMenu: React.FC = () => {
  const { selectedTaskIds, unselectAllTasks } = useTaskTableSelection();

  const updateTaskStatusesMutation = useUpdateTaskStatuses();
  const deleteTasksMutation = useDeleteTasks();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleConfirm = () => {
    deleteTasksMutation.mutate(selectedTaskIds);
    setIsDeleteConfirmOpen(false);
  };

  const handleMarkDone = () => {
    updateTaskStatusesMutation.mutate({ selectedTaskIds, status: "done" });
  };

  return (
    <AnimatePresence>
      {selectedTaskIds.length > 0 && (
        <motion.div
          role="toolbar"
          className="fixed inset-x-0 bottom-4 m-auto flex h-[40px] w-fit items-center gap-2 rounded-lg bg-zinc-300 px-2 text-sm text-zinc-700 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <div className="flex h-[25px] gap-1 overflow-hidden rounded-sm border border-dashed border-zinc-500">
            <div className="flex items-center px-2">
              <span className="mr-[2px] font-bold">
                {selectedTaskIds.length}
              </span>
              selected
            </div>
            <button
              className="grid w-[25px] place-items-center border-l border-dashed border-zinc-500 transition-colors hover:bg-black/5"
              onClick={unselectAllTasks}
              aria-label="選択解除"
            >
              <XIcon size={18} />
            </button>
          </div>

          <div className="h-[25px] w-px bg-zinc-400" />

          <TaskSelectionMenuButton
            icon={Trash2Icon}
            label="削除する"
            onClick={() => setIsDeleteConfirmOpen(true)}
          />
          <TaskSelectionMenuButton
            icon={CircleDotIcon}
            label="完了状態にする"
            onClick={handleMarkDone}
          />
          <ConfirmDialog
            isOpen={isDeleteConfirmOpen}
            onOpenChange={setIsDeleteConfirmOpen}
            confirmText="削除する"
            title="選択されたタスクの削除"
            onConfirm={handleConfirm}
          >
            <>
              選択された
              <span className="mx-1 font-bold">{selectedTaskIds.length}</span>
              個のタスクを削除しますか？
              <br />
              一度削除すると、元に戻すことはできません。
            </>
          </ConfirmDialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TaskSelectionMenuButton: React.FC<{
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex h-[25px] items-center gap-1 rounded-sm bg-zinc-900 px-2 text-xs text-zinc-100 transition-colors hover:bg-zinc-700"
        onClick={onClick}
        aria-label={label}
      >
        <Icon size={15} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <motion.div
              className="rounded-sm border border-zinc-600 bg-zinc-900 p-2 text-xs text-zinc-100"
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
            >
              {label}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
