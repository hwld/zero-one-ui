import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { PiPlusCircleFill } from "@react-icons/all-files/pi/PiPlusCircleFill";
import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useState } from "react";
import { TaskForm } from "./task-form";
import { useCreateTask } from "./use-create-task";
import type { TaskFormData } from "../../_backend/task/schema";

export const TaskCreateButton: React.FC = forwardRef<HTMLButtonElement>(
  function TaskCreateButton(props, ref) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <>
        <button
          ref={ref}
          {...props}
          className="flex h-9 w-full items-center gap-1 rounded-sm p-2 text-rose-700 transition-colors hover:bg-black/5"
          onClick={() => setIsOpen(true)}
        >
          <div className="grid size-7 place-items-center">
            <PiPlusCircleFill className="size-7" />
          </div>
          <div className="font-bold">タスクを作成</div>
        </button>
        <TaskCreateDialog open={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
);

const TaskCreateDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const createTask = useCreateTask();

  const handleCreateTask = (input: TaskFormData) => {
    createTask.mutate(input, { onSuccess: onClose });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      return onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div className="fixed inset-0 z-40" />
            </DialogOverlay>
            <DialogContent asChild>
              <motion.div
                className="fixed top-[120px] left-1/2 z-50 w-[550px] rounded-lg border border-stone-300 bg-stone-50 shadow-2xl"
                initial={{ opacity: 0, y: 40, x: "-50%", scale: 0.8 }}
                animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 40, x: "-50%", scale: 0.8 }}
                transition={{ duration: 0.1 }}
              >
                <TaskForm
                  submitText="作成する"
                  onSubmit={handleCreateTask}
                  isSubmitting={createTask.isPending}
                  onCancel={onClose}
                />
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
